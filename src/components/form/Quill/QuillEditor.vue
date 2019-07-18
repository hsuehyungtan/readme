<template>
  <QuillEditorWrapper :class="{ fullscreen: isExpanded }">
    <section class="editor news">
      <!-- <div class="editor__heading">
        <div class="editor__heading-text" v-text="$t('POST_EDITOR.EDITOR')"></div>
        <div class="editor__heading-switch" @click="$_quillEditor_toggleHtml">&lt; / &gt;</div>
      </div> -->
      <div :id="`toolbar-${index}`" v-show="isInitialized">
        <span class="ql-formats">
          <select class="ql-color"></select>   
          <button class="ql-bold"></button>
          <button class="ql-header" value="1"></button>
          <button class="ql-header" value="2"></button>
          <button class="ql-italic" value="2"></button>
          <button class="ql-blockquote"></button>
          <button class="ql-code-block"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-image"></button>
          <button class="ql-link"></button>
          <button class="ql-video"></button>
          <button class="ql-embed"></button>
          <button v-show="$can('editPostOg')" class="ql-hr"></button>
        </span>
        <span class="ql-formats right">
          <button class="ql-expand"></button>
        </span>
      </div>
      <div class="editor__quill" ref="quillEditor"
        v-quill:quillEditor="editorOption"
        :content="content"
        @change="$_quillEditor_onEditorChange($event)">
      </div>
      <div class="editor__html" v-text="content"></div>
    </section>
  </QuillEditorWrapper>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import AssetPickerPanel from 'src/components/form/AssetPicker/AssetPickerPanel.vue'
import QuillEditorWrapper from './QuillEditorWrapper.vue'
import axios from 'axios'
import preventScroll from 'prevent-scroll'
import { get, } from 'lodash'
import {
  registerEmbed,
  registerHr,
  registerImageSrcSet,
  registerFigcaption, } from './custom.js'

const debug = require('debug')('CLIENT:QuillEditor')
const debugEditorChange = require('debug')('CLIENT:QuillEditorChange')
const openPicker = (store, callback, assetType) => store.dispatch('COMMON_LIGHTBOX_SWITCH', {
  active: true,
  component: AssetPickerPanel,
  callback,
  custProps: { assetType, }
})
const setUpValue = (store, { active, type, value }) => store.dispatch('SET_VALUE', { active, type, value })

export default {
  name: 'QuillEditor',
  components: {
    QuillEditorWrapper,
  },
  computed: {
    valueSetter () {
      return get(this.$store, 'state.valueSetter', {})
    },
  },
  data () {
    return {
      editorOption: {
        // theme: 'bubble',
        // formats: [ 'bold', 'color', 'header', 'italic', 'blockquote', 'code-block', 'link', 'image', 'video', 'hr', 'figcaption', ],
        modules: {
          toolbar: {
            container: `#toolbar-${this.index}`,
            handlers: {
              store: this.$store,
              'image': this.$_quillEditor_imageHandler,
              'hr': this.$_quillEditor_customHrHandler,
              'embed': this.valueSetUpEmbed,
              'expand': this.toggleEditorMode,
            },
          },
          clipboard: {
            matchVisual: false,
          },
        },
      },
      file: undefined,
      isLoading: false,
      isInitialized: false,
      isExpanded: false,
    }
  },
  mounted () {
    const descImageHint = this.$t('EDITOR.QUILLEDITOR.IMAGE.DESCRIPTION')
    Promise.all([
      registerEmbed(),
      registerHr(),
      registerFigcaption(descImageHint),
      registerImageSrcSet()
    ]).then(() => {
      this.isInitialized = true
    })
  },
  methods: {
    $_quillEditor_customHrHandler () {
      // if (this.$can('editPostOg')) {
        const range = this.quillEditor.getSelection()
        this.quillEditor.insertEmbed(range.index, 'hr', 'null')
      // }
    },
    $_quillEditor_imageHandler () {
      openPicker(this.$store, this.preparePreviewData, [ 1 ])
    },

    $_quillEditor_onEditorChange (event) {
      debugEditorChange(event.html)
      if (event.html) {
        this.$emit('update:content', event.html)
      }
    },
    $_quillEditor_toggleHtml (event) {
      event.target.parentNode.parentNode.classList.toggle('showHtml')
    },
    toggleEditorMode () {
      console.log('go expand!')
      this.isExpanded = !this.isExpanded
    },
    preparePreviewData (value, title) {
      debug('value', value)
      let range = this.quillEditor.getSelection()
      if (!range) {
        this.quillEditor.focus()
        range = this.quillEditor.getSelection()
      }
      this.quillEditor.insertEmbed(range.index, 'readme-image', { src: value, title })
      return Promise.resolve()
    },    
    valueSetUpEmbed () {
      debug('call valueSetter')
      setUpValue(this.$store, { active: true, type: 'readme-embed', value: '' })
    },
  },
  props: {
    content: {
      default: '',
    },
    index: {
      type: Number,
      default: 1
    }
  },  
  watch: {
    content () {
      debug('MUTATION DETECTED: content', this.content)
    },
    isExpanded () {
      if (this.isExpanded) {
        preventScroll.on()
      } else {
        preventScroll.off()
      }
    },
    'valueSetter.value': function () {
      if (!this.valueSetter.value || !this.valueSetter.active) { return }

      /**
       * Going to append embedded codes.
       */
      this.quillEditor.focus()
      const range = this.quillEditor.getSelection()
      this.quillEditor.insertEmbed(range.index, 'readme-embed', this.valueSetter.value)   

      setUpValue(this.$store, { active: false, type: '', value: '' })
    },
    'valueSetter.type': function () {
      debug('change!valueSetter.type')
    },
  },
}
</script>

<style lang="stylus" scoped>
  @keyframes fade-out
    0%
      opacity 0
    100%
      opacity 1
  .quill-editor-wrapper
    &.fullscreen
      animation fade-out 0.2s
      position fixed
      width 100vw
      height 100vh
      top 0
      left 0
      background-color rgba(0,0,0,0.6)
      z-index 9999
      display flex
      justify-content center
      align-items center
      .editor
        width 95%
        height 95%
        max-width 950px
        box-shadow 0 0 15px rgba(255,255,255,0.75)
        >>> .ql-expand
          background-image url(/public/icons/icon_minimize.png)
          background-size 70%
        >>> .ql-editor
          width 100%
          padding 0 60px
          > p
            margin 40px 0
            line-height 1.6
        &__quill
          height 95%
  .editor
    position relative
    margin-top 15px
    width 100%
    background-color white
    border-radius 4px

    >>> .ql-editor
      > p
        margin 10px 0
    >>> .ql-toolbar
      display flex
      .ql-picker-label
        outline none
      &.ql-snow
        border none
        border-bottom 1px solid #f1f1f1
      .ql-formats
        &:not(:last-child)
          padding-right 15px
          position relative
          &:before
            content ''
            display block
            position absolute
            right 0
            top 25%
            height 50%
            width 1px
            background-color #d5d5d5
        &.right
          flex 1
          display flex
          justify-content flex-end
    >>> .ql-container
      .ql-color-label.ql-stroke
        stroke #00ff00
      // &.ql-bubble
      //   overflow visible
      &.ql-snow
        border none      
    >>> .ql-hr
      width 54px
      &:after
        content 'More'
    >>> .ql-code-block
      background-image url(/public/icons/icon_code.png)
      background-position center center
      background-repeat no-repeat
      background-size 50%
      svg
        display none
    >>> .ql-embed
      background-image url(/public/icons/icon_embed.png)
      background-position center center
      background-repeat no-repeat
      background-size 70%
    >>> .ql-expand
      background-image url(/public/icons/icon_maximize.png)
      background-position center center
      background-repeat no-repeat
      background-size 70%
    >>> hr
      height 0px
      margin-top 5px
      margin-bottom 5px
    >>> figcaption
      color #b3b3b1
      font-size .75rem
      font-weight 400
      margin-top 10px
    >>> .readme-embed, >>> .readme-image
      display flex
      flex-direction column
      justify-content center
      align-items center
      width 100%
      // background-color #e3e3e354
      border-radius 5px
      padding 10px
    
    >>> .readme-image
      img
        max-width 70%
        width 70%
      &:after
        padding 0 15%
        content attr(text)
        display block
        color #b3b3b1
        font-size .875rem
        font-weight 400
        line-height normal
        margin-top 10px
    >>> .readme-embed
      script
        display block
        margin 0
        color #c4c4c4
        &:before
          content 'SCRIPT'
          border 1px solid #c4c4c4
          padding 2px 5px
          border-radius 5px
          display flex
          justify-content center
          align-items center
      script:not(:first-child), iframe:not(:first-child)
        margin-top 10px
    > input
      display none
    &.showHtml
      .editor__heading-switch
        background-color #d8ca21
      .editor__quill
        width 50%
      .editor__html
        display block
    &__heading
      display flex
      height 20px
      padding-left 10px
      color #fff
      font-size .875rem
      line-height 20px
      background-color #000
      &-text
        flex 1
        user-select none
      &-switch
        width 50px
        text-align center
        background-color #808080
        cursor pointer
        user-select none
        
    &__quill
      height 380px
      font-size 1rem
      // overflow-y auto
      overflow visible
      >>> img
        max-width 50%
      p:has(img)
        color red
    &__html
      display none
      position absolute
      right 0
      bottom 0
      width 50%
      height 380px
      padding 10px
      border-right 1px solid #d3d3d3
      border-bottom 1px solid #d3d3d3
</style>
