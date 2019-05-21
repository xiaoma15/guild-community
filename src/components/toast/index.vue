<!--
** toast组件
** params参数
**    msg参数： toast显示的内容
**    parent：默认body， 组件实例挂载对象节点;
**    duration: 3000, toast组件持续时间;
**    className: '',  // 需要修改的class名字
**    styleObj: '',  // 需要修改的styleObj对象
**    mode: 'override || queue'  模式 （覆盖，或者队列模式）
-->

<template>
    <div>
        <transition name="toast-in">
            <div
                    class="toast-wrapper"
                    :id="optionConf.id"
                    :class="optionConf.className"
                    :style = "optionConf.styleObj"
                    v-show="showing"
            >
                <span class="toast-content" v-html="optionConf.message"></span>
            </div>
        </transition>
    </div>
</template>

<script>
    import Vue from 'vue'
    const DEFAULT_OPT = {
        id: 'my-toast',
        className: '',
        parent: 'body',
        duration: 3000,
        styleObj: {},
        mode: 'override',
        succ: null // 弹层消失时的回调函数
    };
    export default {
        DEFAULT_OPT: DEFAULT_OPT,
        name: "toast",
        data() {
            return {
                queue: [],
                option: {},
                showing: false,
                timeoutId: null
            }
        },
        computed: {
            optionConf: function() {
                return Object.assign({}, DEFAULT_OPT, this.option)
            },
        },
        watch: {
            // 队列模式
            queue: function() {
                let pending = this.queue.length
                if (pending === 0) {
                    return
                }
                // 如果当前模式为队列模式，则必须等待弹层完成才能继续
                if(this.option.mode === 'queue' && this.timeoutId) {
                    this.queue = [];
                    return;
                }
                this.showing = true
                this.option = this.queue[0]
                if ((!this.option.mode || this.option.mode === 'override') && pending > 1) {
                    clearTimeout(this.timeoutId)
                    this.showing = false
                    this.timeoutId = null
                    this.timeoutId = setTimeout(() => this.queue.shift())
                } else {
                    this.timeoutId = setTimeout(() => {
                        this.showing = false
                        this.timeoutId = null
                        setTimeout(() => this.queue.shift());
                        // 判断是否执行回调函数
                        if(this.option.succ && typeof this.option.succ === 'function') {
                            this.option.succ.apply(this, [this.option])
                        }
                    }, this.optionConf.duration)
                }
            }
        }
    }
</script>

<style scoped>

    .toast-wrapper {
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 6px;
        padding: 10px 10px;
        display: inline-block;
        max-width: 300px;
        min-width: 120px;
        color: white;
        z-index: 9999;
        margin: auto;
        text-align: center;
    }
    .toast-wrapper {
        position: fixed;
        top: 220px;
        left: 50%;
        transform: translate(-50%, 0);
    }
    .toast-content {
        text-align: center;
        color: #fff;
    }

    .toast-in-enter-active,
    .toast-in-leave-active,
    .toast-in-transition {
        -webkit-transition: all .3s ease;
        transition: all .3s ease;
    }
    .toast-in-enter,
    .toast-in-leave-active {
        transform: translate(-50%, -50%) scale(1.1, 1.1);
        opacity: 0;
    }
</style>
