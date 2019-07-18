<template>
  <div class="content-options">
    <div class="gen-item" @click="gen"><span v-text="$t('EDITOR.CONTENT_OPTIONS.GEN')"></span></div>
    <template v-for="(opt, index) in opts">
      <div class="item" :key="opt.key || opt.id" :id="`opt-${opt.key || opt.id}`" v-if="opt.active">
        <TextInput
          backgroundColor="#f7f7f7"
          :placeHolder="$t('EDITOR.CONTENT_OPTIONS.TITLE')"
          :value.sync="opt.title"></TextInput>
        <TextInput
          backgroundColor="#f7f7f7"
          :placeHolder="$t('EDITOR.CONTENT_OPTIONS.SUBTITLE')"
          :value.sync="opt.subtitle"></TextInput>
        <QuillEditor :content.sync="opt.content" :index="index" />
        <div class="two-col">
          <AssetPicker theme="grey" :value.sync="opt.backgroundImage" :assetType="[ 1 ]"></AssetPicker>
          <ColorPicker theme="grey" :value.sync="opt.backgroundColor"></ColorPicker>
        </div>
        <AssetPicker theme="grey" :value.sync="opt.image" :assetType="[ 1 ]" class="two-col__item"></AssetPicker>
      </div>
    </template>
  </div>
</template>
<script>
import AssetPicker from 'src/components/form/AssetPicker/AssetPicker.vue'
import ColorPicker from 'src/components/form/ColorPicker/ColorPicker.vue'
import QuillEditor from 'src/components/form/Quill/QuillEditor.vue'
import TextInput from 'src/components/form/TextInput.vue'
import { smoothScrollTo, } from 'kc-scroll' 

export default {
  name: 'ContentOptions',
  components: {
    AssetPicker,
    ColorPicker,
    QuillEditor,
    TextInput,
  },
  data () {
    return {
      opts: [],
    }
  },
  computed: {
    filteredOpts () {
      return filter(this.opts, opt => opt.active)
    },
  },
  methods: {
    gen () {
      const key = Date.now()
      this.opts.push({ key, active: 1  })   
      this.goOpt(key)
    },
    goOpt (key) {
      setTimeout(() => {
        smoothScrollTo({ eID: `#opt-${key}`, })
      }, 100) 
    },
  }
}
</script>
<style lang="stylus" scoped>
.content-options
  .gen-item
    font-size 1rem
    font-weight normal
    font-style normal
    font-stretch normal
    line-height normal
    letter-spacing normal
    color #ffffff
    background-color #000
    display flex
    justify-content center
    align-items center
    height 36px
    width 100%
    cursor pointer
    margin-bottom 20px
    border-radius 4px
    &:hover
     background-color #222
  .item
    background-color #fff
    box-shadow 1.6px 1.2px 2px 0px rgba(0, 0, 0, 0.1)    
    padding 30px 20px
    display flex
    flex-wrap wrap
    position relative
    border-radius 4px
    &:not(:last-child)
      margin-bottom 10px
    > div + div
      margin-top 1em
    .text-input, .quill-editor-wrapper
      width 100%
    .quill-editor-wrapper
      background-color rgb(247, 247, 247)
      >>> .editor
        background-color rgb(247, 247, 247)
    .two-col
      display flex
      width 100%
      > div
        flex 1
        & + div
          margin-left 20px
      &__item
        width calc(50% - 10px)
</style>
