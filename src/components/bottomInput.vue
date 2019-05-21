<style lang="less" scoped>
    .confirm_page {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.50);
        height: 100%;
        .bottom-0{
            bottom: 0;
        }
        .zIndex{
            z-index: 1000;
        }
        .maxHeight{
            flex: 1;
        }
        .confrim-mask{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 201px;
            background: rgba(0,0,0,0.50);
            z-index: 999;
        }
        .confirm_content {
            z-index: 2;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            .confrim-header{
                height: 50px;
                line-height: 50px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #666666;
                padding: 0 15px;
                display: flex;
                justify-content: space-between;
                .person{
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #2A2A2A;
                    text-align: center;
                    line-height: 20px;
                    padding-left: 5px;
                }
                .handleIcon{
                    width: 50px;
                    height: 50px;
                    box-sizing: border-box;
                    // padding: 0 15px;
                    text-align: right;
                }
                .icon-zhankai{
                    color: #999;
                    font-size: 10px;
                }
            }
            .confrim-content{
                width: 100%;
                padding: 15px;
                height: 100px;
            }
            .confrim-footer{
                line-height: 50px;
                text-align: right;
                .submitBu{
                    display: inline-block;
                    margin: 10px 15px;
                }
            }
        }
    }

</style>
<template>
    <div class="confirm_page" v-show="show">
        <div class="confrim-mask" @click="closeCurrentView()" :class="{'bottom-0': zhankai}"></div>
        <div class="confirm_content" :class="{'zIndex': zhankai}" ref="onInput">
            <div class="confrim-header bd-bottom">
                <span>评论<span v-if="contentPerson">给</span><span class="person">{{contentPerson}}</span></span>
                <span class='handleIcon' @click="handaleZhankai"><i class="iconfont icon-zhankai"></i></span>
            </div>
            <div class="confrim-content"  :class="{'maxHeight': zhankai}">
                <slot></slot>
            </div>
            <div class="confrim-footer bd-top">
                <span class="closeButton submitBu" @click="emitSubmit">发布</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                note: '',
                zhankai: false,
                showView: false
            }
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            contentPerson: {
                type: String,
                default: ''
            }
        },
        methods: {
            handaleZhankai(){
                this.zhankai = !this.zhankai;
                let height = window.innerHeight;
                this.$parent.focusnode.focus();
                this.$refs.onInput.style = `height : ${height}px`;
            },
            emitSubmit(){
                this.$emit('on-submit')
            },
            closeCurrentView(){
                this.$emit('on-colseCurrentView');
            },
        },
        deactivated : function(){
            this.note='',
            this.zhankai=false,
            this.showView=false
        }
    }
</script>
