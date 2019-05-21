<style lang="less">
    .pullDown {
        width: 100%;
        margin-top: -45px;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center;
    }
    .pullDown.scroller-loadState {
        margin-top: 0;
    }
    .scroller {
        // background: #fff;
    }
</style>
<template>
  <div ref="scrollView" class="scroller">
      <div>
            <div class="pullDown" :class="{'scroller-loadState':downState}" v-show='pullDown && showPullDownLabel'>
            {{pullDownLabel}}
            </div>
            <div >
                <div ref="content">
                    <slot></slot>
                </div>
            </div>
      </div>
  </div>
</template>
<script>
import Bscroll from 'better-scroll'
export default {
    data() {
        return {
             pullDownLabel: '',
             showPullDownLabel: false,
             downState: 'false'
        }
    },
    props: {
        options: {
            type: Object,
            default () {
                let clickVal = (function(){
                    if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
                    if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
                    if (/Silk/i.test(navigator.userAgent)) return false;
                    if (/Android/i.test(navigator.userAgent)) {
                        var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
                        return parseFloat(s[0]+s[3]) < 44 ? false : true}
                }())
                return {
                    probeType: 3,//probeType：1对性能没有影响。在滚动事件被触发时，滚动轴是不是忙着做它的东西。probeType：2总执行滚动，除了势头，反弹过程中的事件。这类似于原生的onscroll事件。probeType：3发出的滚动事件与到的像素精度。注意，滚动被迫requestAnimationFrame（即：useTransition：假）。
                    scrollbars: false,//有滚动条
                    mouseWheel: false,//允许滑轮滚动
                    fadeScrollbars: false,//滚动时显示滚动条，默认影藏，并且是淡出淡入效果
                    bounce: true,//边界反弹
                    //shrinkScrollbars:'scale',// 当滚动边界之外的滚动条是由少量的收缩。'clip' or 'scale'.
                    //tap: true , // 允许点击事件
                    click: clickVal,
                    disablePointer: true,
                    disableTouch : false,
                    disableMouse : true,
                    eventPassthrough: 'horizontal',
                    //preventDefault: false
                }
            }
        },
        // 是否仅需要滚动
        onlyScroll: {
            type: Boolean,
            default: false
        },
        // 是否启动无限加载
        pullUp: {
            type: Boolean,
            default: true
        },
        // 是否启动下拉
        pullDown: {
            type: Boolean,
            default: true
        },
        // 是否监听滚动事件
        listenScroll: {
            type: Boolean,
            default: false
        },

    },
    mounted() {
        this._initScroll();
        // console.log(this.scroller.wrapperHeight);
        this.$refs.content.style.minHeight = (this.scroller.wrapperHeight + 1)+'px';
    },
    methods: {
        _initScroll() {
            this.scroller = new Bscroll(this.$refs.scrollView, this.options)
            const {scroller} = this;
            this.scroller.on('scroll', e => {
                // 当加载状态===0
                if(!this.onlyScroll) {
                    if (scroller.y > 0 && scroller.y < 60 && this.pullDown && !this.downState) {
                        this.showPullDownLabel = true;
                        this.isReadyLoadIng = false;
                        this.pullDownLabel = '下拉刷新';
                    } else if (scroller.y >= 60 && this.pullDown && !this.downState) {
                        this.showPullDownLabel = true;
                        this.isReadyLoadIng = true;
                        this.pullDownLabel = '松手刷新';
                    }   else if(scroller.maxScrollY - scroller.y > -20 && !this.upState && this.pullUp){
                        console.log('this.upState',this.upState)
                        this.upState = true;
                        this.$emit('pullUp', scroller);
                        console.log('pullup')
                    }
                    if(this.listenScroll) {
                        this.$emit('on-scroll', scroller)
                    }
                }
                if(scroller.maxScrollY - scroller.y > -20 && scroller.pointY < 100 && !this.isBack) {
                    this.isBack = true;
                    this.scrollTo(0, scroller.maxScrollY, 400);
                }
            });
            if(!this.onlyScroll) {
                if(this.pullDown) {
                    this.scroller.on('touchEnd', (pos) => {
                        // 下拉动作
                        console.log('touchend')
                        if (pos.y > 50) {
                            if(this.isReadyLoadIng) {
                                this.downState = true;
                                this.upState = true;
                                this.pullDownLabel = '正在努力加载中...';
                                this.isReadyLoadIng = false;
                                this.$emit('pullDown', scroller);
                                setTimeout(() =>{
                                    this.refresh();
                                }, 500)
                            }
                        } else {
                            // this.refresh();
                            // this.downState = false;
                            this.showPullDownLabel = false;
                            // this.upState = false;
                        }
                    })
                }
            }
            this.scroller.on('scrollStart', e => {
                if(!!document.activeElement){
                    document.activeElement.blur();
                }
            });
            this.scroller.on('scrollEnd', e => {
                this.isBack = false;
            });
        },
        scrollToElement() {
            this.$nextTick(() => this.scroller.scrollToElement.apply(this.scroller, arguments))
        },
        scrollBy() {
            this.$nextTick(() => this.scroller.scrollBy.apply(this.scroller, arguments))
        },
        scrollTo() {
            this.$nextTick(() => this.scroller.scrollTo.apply(this.scroller, arguments))
        },
        refresh() {
            this.downState = false;
            this.showPullDownLabel = false;
            this.upState = false;
            this.$nextTick(() => {
                this.scroller.refresh.apply(this.scroller, arguments)

            })
            // this.scroller.scrollTo(0,0);
        }
    }
}
</script>
