<style lang="less" scoped>
    .multiple_box {
        position: relative;
        font-family: PingFangSC-Regular;
        -webkit-user-select: none;
        user-select: none;
        position: fixed;
        z-index: 201;
        .masker {
            position: fixed;
            z-index: 201;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .5);
            -webkit-transition: opacity .1s linear;
            transition: opacity .1s linear;
            z-index: 100;
            .content_box {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                padding-bottom: 230px;
                overflow: hidden;
                font-size: 14px;
                color: #333333;
                background: white;
                .multiple_title {
                    position: relative;
                    z-index: 2;
                    text-align: center;
                    line-height: 50px;
                    // background: #f4f4f4;
                    color: #666;
                    .close_box {
                        position: absolute;
                        right: 0;
                        top: 50%;
                        width: 50px;
                        height: 50px;
                        transform: translateY(-50%);
                    }
                    .close {
                        width: 12px;
                        height: 12px;
                        position: absolute;
                        right: 15px;
                    }
                }
                .select_item_box {
                    overflow: auto;
                    position: absolute;
                    top: 50px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding: 0 15px;
                    .select_item {
                        height: 45px;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        .iconfont{
                            width: 18px;
                            height: 12px;
                            font-size: 10px;
                        }
                        .select_icon {
                            color:  #11BFF4;
                        }
                    }
                }
            }
        }
    }
    .fade-enter-active{
        animation: fadeIn .5s
    }
    .fade-leave-active{
        animation: fadeOut .5s
    }
    @keyframes fadeIn{
        0%{
            opacity: 0;
        }
        100%{
            opacity: 1;
        }
    }
    @keyframes fadeOut{
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0;
        }
    }
    .slide-enter-active{
        animation: fadeUp .5s
    }
    .slide-leave-active{
        animation: fadeDown .5s
    }
    @keyframes fadeUp{
        0%{
            opacity: .6;
            transform: translateY(100%);
        }
        100%{
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes fadeDown{
        0%{
            opacity: 1;
            transform: translateY(0);
        }
        100%{
            opacity: .6;
            transform: translateY(100%);
        }
    }
</style>
<template>
    <transition name="fade">
        <div class="multiple_box" v-show="show">
            <div class="masker" @click="cancel">
                 <div class="content_box">
                    <div class="multiple_title bd-bottom">
                        {{title}}
                        <i class="icon-chax iconfont close"></i>
                    </div>
                    <div class="select_item_box">
                        <div  v-for="(item, index) in multipleChoiceArray" :key="index" @click="selectIcon(item, index)" class="select_item bd-bottom">
                            {{item.baseDataName || item.basedataname}}
                            <i class="icon-xuanzex iconfont select_icon" v-if="item.checked"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   </transition>
</template>
<script>
    export default {
        props: {
            show:{
                type:Boolean,
                default: false
            },
            title: {
                type:String,
                default: '请选择'
            },
            multipleChoiceArray: {
                type: Array,
                default: () => {[]}
            }
        },
        methods:{
            cancel(){
                this.$emit('cancelModal');
            },
            selectIcon(item,index) {
                console.log(item)
                console.log(index)
                this.$emit('comfirmSelect', {infoItem: item, idx: index})
            }
        }
    }
</script>
