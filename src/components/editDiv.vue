<template>
  <div
    class="base-edit-div"
    :style="{'-webkit-user-modify': disabled ? 'read-only' : '', '-moz-user-modify': disabled ? 'read-only' : '', 'overflow-x': disabled ? 'hidden' : '', 'height' : disabled && !text ? '35px' : '100%'}"
    contenteditable="true"
    @focus="$emit('focus', $event)"
    @click="$emit('click')"
    @blur="$emit('blur', $event)"
    @keydown="$emit('keydown', $event)"
    @keyup="$emit('keyup', $event)"
    @input="domInput"
  ></div>
</template>

<script>
import EventUtil from '../js/eventUtil'
export default {
  props: {
    // 默认值
    text: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    // 组件初始化，对innerHTML赋值
    this.$el.innerHTML = this.text
    // 一旦div的dom发生插入值的操作，调用domChange()方法传递值至父组件
    EventUtil.addHandler(this.$el, 'DOMNodeInserted', this.domChange)
  },
  beforeDestroy () {
    // 销毁
    EventUtil.removeHandler(this.$el, 'DOMNodeInserted', this.domChange)
  },
  methods: {
    domChange (event) {
      this.$emit('input', this.$el.innerHTML, this.$el.dataset.index, event)
    },
    emptyInnerHTML () {
      this.$el.innerHTML = ''
      this.$emit('input', this.$el.innerHTML, this.$el.dataset.index, event)
    },
    domInput (event) {
      this.$emit('input', this.$el.innerHTML, this.$el.dataset.index, event)
    }
  }
}
</script>

<style lang="less" scoped>
.base-edit-div{
  position: relative;
  outline: none;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: auto;
  word-break: break-all;
  user-select: text;
  text-align: left;
}
</style>
