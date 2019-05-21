<style lang="less" scoped>
  .text-content{
    width: 100%;
    // flex: 1 1 66.7%;
    // width: 55%;
    &.full {
    //   flex: 1 1 100%;
      width: 100%;
      .weui-textarea-counter {
        color: #B2B2B2;
        text-align: left;
        width: 100%;
      }
    }
  }
  textarea{
    font-size: 14px;
    padding-left: 0;
    border-radius: 0;
    line-height: inherit;
    border: 0;
    height: 20px;
    resize : none;
    word-break: break-all;
    text-align: left;
    width: 100%;
    // background:red;
  }
  textarea::-webkit-input-placeholder {
      color: #999999!important;
      font-family: PingFangSC-Light;
      // padding-left: 55%;
      text-align: left
  }
  textarea:focus {
    outline: none;
}
</style>
<template>
    <div class="text-content" :class="{full:full}">
      <textarea
        class="weui-textarea"
        :autocomplete="autocomplete"
        :autocapitalize="autocapitalize"
        :autocorrect="autocorrect"
        :spellcheck="spellcheck"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :name="name"
        :rows="rows"
        :cols="cols"
        v-model="currentValue"
        :style="textareaStyle"
        :maxlength="max"

        ref="textarea" ></textarea>
      <div class="weui-textarea-counter" v-show="showCounter && max"><span>{{count}}</span>/{{max}}</div>
    </div>

</template>
<script>
  import  Autosize from 'autosize';
  export default {
//    minxins: [Base],
    props: {
      full: {
        type: Boolean,
        default: false
      },
        showCounter: {
        type: Boolean,
        default: false
      },
      max: Number,
      value: {
        type: String,
        default: ''
      },
      name: String,
      placeholder: String,
      readonly: {
        type: Boolean,
        default: false
      },
      rows: {
        type: Number,
        default: 3
      },
      cols: {
        type: Number,
        default: 30
      },
      height: Number,
      // https://github.com/yisibl/blog/issues/3
      autocomplete: {
        type: String,
        default: 'off'
      },
      autocapitalize: {
        type: String,
        default: 'off'
      },
      autocorrect: {
        type: String,
        default: 'off'
      },
      spellcheck: {
        type: String,
        default: 'false'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    created () {
      this.currentValue = this.value
    },
    watch: {
      value (val) {
        this.currentValue = val
      },
      currentValue (newVal) {
        if (this.max && (newVal.length >= (this.max*1))) {
          // this.currentValue = newVal.slice(0, this.max)
            this.currentValue = newVal.substring(0, this.max);
        }
        this.$emit('on-change', this.currentValue)
        this.$emit('input', this.currentValue)
      }
    },
    data () {
      return {
        currentValue: ''
      }
    },
    methods: {
        // 处理光标位置
        moveToEnd() {
            this.$refs.textarea.selectionStart = this.$refs.textarea.selectionEnd = this.$refs.textarea.value.length;
        }
    },
    computed: {
      count () {
        let len = 0
        if (this.currentValue) {
          len = this.currentValue.replace(/\n/g, 'aa').length
        }
        return len > this.max ? this.max : len
      },
      textareaStyle () {
        if (this.height) {
          return {
            height: `${this.height}px`
          }
        }
      }
    },
    mounted () {
      Autosize(this.$refs.textarea);
      this.$refs.textarea.focus();
    },
    updated(){
      Autosize.update(this.$refs.textarea)
    },
    beforeDestroy () {
      Autosize.destroy(this.$refs.textarea)
    },
  }
/*  export default{
      props: ['msg','rows'],
      data(){
          return{
              message:this.msg
          }
      },
      mounted () {
      Autosize(this.$refs.autosize)
    },
    beforeDestroy () {
      Autosize.destroy(this.$refs.autosize)
    }
  }*/
</script>
