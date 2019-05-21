<style lang="less" scoped>
    .confirm_page {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.7);
        z-index: 9999;
        .confirm_content {
            position: absolute;
            top: 200px;
            left: 50%;
            width: 264px;
            transform: translateX(-50%);
            font-family: PingFangSC-Regular;
            font-size: 16px;
            border-radius: 5px;
            background: #ffffff;
            .cancelIcon{
                position: absolute;
                top: -82px;
                right: 20px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .icon-chax{
                    font-size: 20px;
                    color: #fff;
                }

            }
            .xian{
                    width: 1px;
                    height: 60px;
                    color: #fff;
                }
            .img_box {
                margin: 45px auto 5px;
                width: 150px;
                height: 93px;
                .show_img {
                    width: 100%;
                    height: 100%;
                }
            }
            .stress_text {
                text-align: center;
                color: #333333;
            }
            .no_img {
                padding: 15px;
            }
            .show_text {
                margin: 10px 0 15px;
                font-size: 13px;
                text-align: center;
                color: #999999;
            }
            .btn_box {
                display: flex;
                /*justify-content: space-around;*/
                text-align: center;
                line-height: 50px;
                color: #999999;
                .cancel {
                    position: relative;
                    flex: 1;
                    .border_left {
                        position: absolute;
                        top: 50%;
                        right: 0;
                        transform: translateY(-50%);
                        width: .5px;
                        height: 30px;
                        background: #e8e8e8;
                    }
                }
                .confirm {
                    flex: 1;
                    color: #11BFF4;
                }
            }
        }
    }

</style>
<template>
    <div class="confirm_page" v-show="show">
        <div class="confirm_content">
            <div class="img_box" v-if="showImg">
                <img class="show_img" :src="picUrl" alt="">
            </div>
            <div class="stress_text" :class="{'no_img': !showImg}" v-if="stressTxt">{{stressTxt}}</div>
            <div class="show_text" v-if="showtext && showImg">{{showtext}}</div>
            <div class="btn_box bd-top">
                <div class="cancel" v-if="!onlySure" @click="onCancel">
                    {{cancelTxt}}
                    <span class="border_left"></span>
                </div>
                <div class="confirm" @click="onConfirm">{{sureTxt}}</div>
            </div>
        </div>
    </div>
</template>
<script>
    import pic from '../assets/img/no-data.png'
    export default {
        data() {
            return {

            }
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            showtext: { //显示的文字
                type:String,
                default:'确定删除你所选定的商品吗？'
            },
            stressTxt: { //强调文字
                type:String,
                default:'确定删除'
            },
            cancelTxt:{
                type:String,
                default:'取消'
            },
            sureTxt:{
                type:String,
                default:'确认'
            },
            picUrl: { // 显示的图片
                type: String,
                default: pic
            },
            onlySure: { // 是否只有sureTxt按钮
                type: Boolean,
                default: false
            },
            showImg: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            onCancel() {
                this.$emit('on-cancel');
            },
            onConfirm() {
                this.$emit('on-confirm')
            }
        }
    }
</script>
