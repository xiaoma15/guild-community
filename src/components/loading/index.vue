<!--
** loading组件
** params参数
**    msg参数： toast显示的内容
-->

<template>
    <div>
        <div class="loading-mask" v-show="optionConf.showMask && !isHide">

        </div>
        <div class="dagger-loading-content" ref="loadingCon" style="display: none; opacity: 0">
            <svg id="dagger-loading" viewBox="0 0 44 44" :style="setLoadingTop()">
                <title>Loading animation</title>
                <g id="dagger-loading-pane" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="loading-circle" stroke-width="3">
                        <circle id="circle-back-face" stroke="#5B5B5C" cx="22" cy="22" r="20"></circle>
                        <circle id="circle-front-face" stroke="#188BF9" cx="22" cy="22" r="20"></circle>
                    </g>
                    <g id="result-success" transform="translate(2, 3)" stroke="#188BF9" stroke-width="3">
                        <path d="M7.43725586,19.375 L15.6247559,27.625 L31.9372559,11.4375" stroke-linecap="round"></path>
                    </g>
                    <g id="result-failure" transform="translate(2, 3)" stroke="#FC4B4C" stroke-width="3">
                        <path stroke-linecap="round" d="M10.125,10.09375 L29.9375,29.78125"></path>
                        <path stroke-linecap="round" d="M10.125,10.09375 L29.9375,29.78125" transform="translate(20.031250, 19.937500) scale(-1, 1) translate(-20.031250, -19.937500) "></path>
                    </g>
                </g>
            </svg>
            <div class="status-group" v-show="showText"><p class="status">{{loadText}}</p></div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    const DEFAULT_OPT = {
        id: 'my-loading',
        type: 'loading',
        text: '',
        duration: 0,
        showMask: true,
        showText: true,
    };
    export default {
        DEFAULT_OPT: DEFAULT_OPT,
        name: "loading",
        data() {
            return {
                option: {},
                showText: false,
                loadText: '',
                isHide: true,
                config: {
                    loadingText: '加载中',
                    successText: '加载成功',
                    failureText: '加载失败'
                }
            }
        },
        computed: {
            optionConf: function() {
                return Object.assign({}, DEFAULT_OPT, this.option)
            },
        },
        watch: {
        },
        methods: {
            setLoadingTop() {
                if(this.showText) {
                    return {
                        top: '20%'
                    }
                } else {
                    return {
                        top: '30%'
                    }
                }
            },
            show() {
                this.showText = this.optionConf.showText;
                if(this.optionConf.type === 'loading') {
                    this.loadText = this.optionConf.text || this.config.loadingText;
                    this.loading();
                } else if(this.optionConf.type === 'success') {
                    this.loadText = this.optionConf.text || this.config.successText;
                    this.success();
                } else if(this.optionConf.type === 'failure') {
                    this.loadText = this.optionConf.text || this.config.failureText;
                    this.fail();
                } else {
                    this.loadText = this.optionConf.text || this.config.loadingText;
                    this.loading();
                }
            },
            hide: function(duration, callback) {
                let elem = this.$refs.loadingCon;
                if (elem.style.display === 'none') return;
                if (duration && typeof duration != 'function') {
                    var opacity = 1,
                        _self = this;
                    var fadeOut = window.setInterval(function() {
                        if (opacity <= 0) {
                            window.clearInterval(fadeOut);
                            elem.style.display = 'none';
                            _self.isHide = true;
                            if (callback && typeof callback === 'function') {
                                callback.apply(_self, [])
                            }
                        } else {
                            elem.style.opacity = opacity = opacity - 0.2;
                        }
                    }, duration || _self.optionConf.duration || 0);
                } else {
                    elem.style.display = 'none';
                    this.isHide = true;
                    if (duration && typeof duration === 'function') {
                        duration.apply(this, []);
                    }
                }
            },
            loading() {
                let elem = this.$refs.loadingCon;
                this.isHide = false;
                if (this.optionConf.duration) {
                    if (elem.style.display === 'none') return;

                    let opacity = 0;
                    elem.style.opacity = 0;
                    elem.style.display = 'block';

                    var fadeIn = window.setInterval(function() {
                        if (opacity >= 1) {
                            window.clearInterval(fadeIn);
                        } else {
                            elem.style.opacity = opacity = opacity + 0.2;
                        }

                    }, this.optionConf.duration);
                } else {
                    elem.style.opacity = 1;
                    elem.style.display = 'block';
                }
            },
            success: function() {
                let elem = this.$refs.loadingCon;
                let success = elem.querySelector('#result-success');
                success.style.display = 'block';
                this._showStatusLoading();
            },

            fail: function() {
                let elem = this.$refs.loadingCon;
                let failure = elem.querySelector('#result-failure');
                failure.style.display = 'block';
                this._showStatusLoading();
            },
            _showStatusLoading: function() {
                let elem = this.$refs.loadingCon;
                let svg = elem.querySelector('svg#dagger-loading');
                elem.querySelector('div.status-group').classList.add('complete');
                svg.classList.add(this.optionConf.type);
                this.loading();
                var _self = this,
                    _completeTimeout;
                svg.addEventListener('webkitAnimationEnd', animateEndEvent, false);

                function animateEndEvent(event) {
                    svg.removeEventListener('webkitAnimationEnd', animateEndEvent, false);
                    if (_completeTimeout) {
                        return;
                    }

                    _completeTimeout = setTimeout(function() {
                        _self.complete();
                        window.clearTimeout(_completeTimeout);
                        _completeTimeout = null;
                    }, 1000);
                }
            },

            complete: function() {
                let elem = this.$refs.loadingCon;
                let failure = elem.querySelector('#result-failure');
                let success = elem.querySelector('#result-success');
                let svg = elem.querySelector('svg#dagger-loading');
                elem.querySelector('div.status-group').classList.remove('complete');

                this.hide(70, function() {
                    success.style.display = 'none';
                    failure.style.display = 'none';
                    svg.classList.remove('success');
                    svg.classList.remove('failure');
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .loading-mask {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
        width: 100%;
        height: 100%;
    }
    .dagger-loading-content {
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 9999;
        width: 100px;
        height: 100px;
        margin-left: -50px;
        margin-top: -50px;
        background-color: rgba(0,0,0,.7);
        border-radius: 20px;
        [data-dpr] & {
            width: 1rem;
            height: 1rem;
            margin-left: -.5rem;
            margin-top: -.5rem;
            border-radius: .2rem;
        }
        #dagger-loading {
            position: absolute;
            top: 20%;
            left: 30%;
            width: 40%;
            height: 40%;
            #circle-back-face {
            // TODO: 在这里可以改变背景圈圈的颜色
            // stroke: #fff;
            }
            #circle-front-face {
                stroke-dasharray: 125;
                stroke-dashoffset: -155;
            // TODO: 这里可以改变前景圈圈的颜色
                stroke: #fff;
                -webkit-animation: loading-rotate 1s linear infinite;
                animation: loading-rotate 1s linear infinite;
                -webkit-transform-origin: center;
                transform-origin: center;
            }
            #result-success {
                path {
                // TODO: 这里可以改变√的颜色
                    stroke: #484848;
                    stroke-dasharray: 35;
                    stroke-dashoffset: 35;
                }
            }
            #result-failure {
                path {
                // TODO: 这里可以改变×的颜色
                    stroke: #484848;
                    stroke-dasharray: 32;
                    stroke-dashoffset: 32;
                }
            }
            &.success {
                #circle-front-face {
                    -webkit-transform: rotate(-90deg);
                    transform: rotate(-90deg);
                    -webkit-animation: dash .5s linear;
                    animation: dash .5s linear;
                    -webkit-animation-fill-mode: forwards !important;
                    animation-fill-mode: forwards !important;
                }
                #result-success {
                    path {
                        stroke: #fff;
                        -webkit-animation: dash-0 .5s linear;
                        animation: dash-0 .5s linear;
                        -webkit-animation-fill-mode: forwards;
                        animation-fill-mode: forwards;
                    }
                }
            }
            &.failure {
                #circle-front-face {
                // TODO: 这里可以改变前景圈圈在×状态时的颜色
                //stroke: #FC4B4C;
                    -webkit-transform: rotate(-90deg);
                    transform: rotate(-90deg);
                    -webkit-animation: dash .5s linear;
                    animation: dash .5s linear;
                    -webkit-animation-fill-mode: forwards !important;
                    animation-fill-mode: forwards !important;
                }
                #result-failure {
                    path {
                        stroke: #fff;
                        -webkit-animation: dash-0 .5s linear;
                        animation: dash-0 .5s linear;
                        -webkit-animation-fill-mode: forwards;
                        animation-fill-mode: forwards;
                    }
                }
            }
        }
        &.ng-leave {
            -webkit-animation: fadeOut .3s;
            animation: fadeOut .3s;
        }
        .status-group {
            position: relative;
            height: 16px;
            margin-top: 70%;
            text-align: center;
            color: #fff;
        //overflow: hidden;
            [data-dpr='2'] & {
                height: 28px;
            }
            [data-dpr='3'] & {
                height: 42px;
            }
            p {
                height: 14px;
                line-height: 14px;
                font-size: 14px;
                margin-bottom: 0 !important;
                [data-dpr='2'] & {
                    height: 28px;
                    line-height: 28px;
                    font-size: 28px;
                }
                [data-dpr='3'] & {
                    height: 42px;
                    line-height: 42px;
                    font-size: 42px;
                }
                -webkit-transform: translate3d(1px, 1px, 1px);
                transform: translate3d(1px, 1px, 1px);
            }
            &.complete {
                margin-top: 85%;
            }
            &.complete p {
                -webkit-animation: move-up .2s linear;
                animation: move-up .2s linear;
                -webkit-animation-fill-mode: forwards;
                animation-fill-mode: forwards;
            }
        }
    }
    @-webkit-keyframes loading-rotate {
        from { -webkit-transform: rotate(-90deg);   transform: rotate(-90deg); }
        to   { -webkit-transform: rotate(270deg); transform: rotate(270deg); }
    }
    @keyframes loading-rotate {
        from { transform: rotate(-90deg); }
        to   { transform: rotate(270deg); }
    }
    @-webkit-keyframes dash {
        0% { stroke-dasharray: 125; stroke-dashoffset: -155; }
        99% { stroke-dasharray: 125; stroke-dashoffset: -250; }
        100% {
            stroke-dasharray: 0;
            stroke-dashoffset: 0;
        }
    }
    @keyframes dash {
        0% { stroke-dasharray: 125; stroke-dashoffset: -155; }
        99% { stroke-dasharray: 125; stroke-dashoffset: -250; }
        100% {
            stroke-dasharray: 0;
            stroke-dashoffset: 0;
        }
    }
    @-webkit-keyframes dash-0 {
        to { stroke-dashoffset: 0; }
    }
    @keyframes dash-0 {
        to { stroke-dashoffset: 0; }
    }
    @-webkit-keyframes move-up {
        from { -webkit-transform: translate3d(0, 0, 0);   transform: translate3d(0, 0, 0); }
        to   { -webkit-transform: translate3d(0, -99%, 0); transform: translate3d(0, -99%, 0); }
    }
    @keyframes move-up {
        from { transform: translate3d(0, 0, 0); }
        to   { transform: translate3d(0, -99%, 0); }
    }
</style>
