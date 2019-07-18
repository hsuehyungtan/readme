<template>
  <div class="color-picker" v-click-outside="handleClickOutside">
    <div
      :class="{ grey: theme === 'grey', warned: isWarned }"
      :style="[ value ? { backgroundColor: value } : '' ]"
      class="color-picker__wrapper"
      @click="openPicker = true">
      <div class="color-picker__pick-button"></div>
      <div class="color-picker__desc"><span>{{ value ? value : $t('EDITOR.COLOR_PICKER.DESCRIPTION') }}</span></div>
    </div>
    <div v-show="openPicker" class="color-picker__picker">
      <colorPicker :color="value" :sucker-hide="true" @changeColor="updateValue"/>
    </div>
  </div>
</template>
<script>

import colorPicker from './Color.vue'

export default {
  name: 'ColorPicker',
  components: {
    colorPicker
  },
  directives: {
    'click-outside': {
      bind (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el == event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  },
  props: {
    // assetType: {},
    isWarned: {},
    theme: {},
    value: {}
  },
  data () {
    return {
      
      color: null,
      openPicker: false,
      // isLoading: false
    }
  },
  methods: {
    handleClickOutside () {
      this.openPicker = false
    },
    updateValue (value) {
      // this.color = value.rgba.toRgbaString()
      this.$emit('update:value', value.rgba.toRgbaString())
    }
  }
}
</script>
<style lang="stylus" scoped>
  .color-picker
    position relative
    min-height 185px
    max-width 340px
    width 100%
    &__wrapper
      background-color #fff
      min-height 185px
      display flex
      justify-content center
      align-items center
      flex-direction column
      cursor pointer
      border-radius 4px
      &.grey
        background-color #f7f7f7
        border 1px solid #f7f7f7
    &__pick-button
      r = 38px
      width r
      height r
      min-width r
      min-height r      
      background-color #808080
      border-radius r
      margin 30px auto 17px
      outline none
      background-image url(/public/icons/colorpicker.png)
      background-position center center
      background-size auto 30px
      background-repeat no-repeat          
    &__desc
      font-size 1rem
      font-weight normal
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      color #a0a0a0
    &__picker
      box-sizing content-box
      position absolute
      top 0
      left calc(-100% - 20px)
      z-index 10
      width 100%
      > div
        margin 0 auto

      
</style>
