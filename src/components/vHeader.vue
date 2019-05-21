<style lang="less" scoped>
    @import "../assets/style/variable.less";
    .header{
        display: flex;
        justify-content: space-between;
        position: fixed;
        z-index: 1;
        font-size: 18px;
        top:0;
        left: 0;
        right:0;
        height: 45px;
        box-sizing: border-box;
        line-height: 44px;
        text-align: center;
        background: #fff;
        user-select: none;
        .back{
            position: relative;
            font-size: 21px;
            color: #333333;
            line-height: 44px;
            padding-left: 15px;
            width: 30px;
            &.icon-back {
                &::before {
                    position: absolute;
                    top: 51%;
                    left: 11px;
                    margin-top: -10px;
                    line-height: 0;
                    padding: 10px 0;
                }
            }
        }
        .title{
            font-family: PingFangTC-Regular;
            font-size: 20px;
            color: #303030;
        }
        .left-con{
            flex-grow: 1;
        }
        .middle-con{
            position: absolute;
            top:50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            overflow: hidden;
        }
        .right-con{
            flex-grow: 0;
            padding-right: 15px;
            font-size: 18px;
            color: #666;
        }
    }
    .header-back{
        position: absolute;
        top: 1px;
        left: 32px;
        font-family: PingFangTC-Regular;
        font-size: 18px;
        color: #333333;
    }
</style>
<template>
    <header class="header  bd-bottom" v-if="show">
       <div class="back icon-back iconfont" v-if="showBack" @click="back"></div>
        <span class="header-back" @click="back"></span>
        <div class="left-con">
            <slot name="left"></slot>
        </div>
        <div class="middle-con" v-if="!title">
            <slot name="middle"></slot>
        </div>
        <div class="title middle-con" v-if="title">
            {{title}}
            <slot></slot>
        </div>
        <div class="right-con">
            <slot name="right"></slot>
        </div>
    </header>
</template>
<script>
    export default{
    	props:{
    	    showBack:{
    	    	type:Boolean,
                default:true
            },
            title: {
    	    	type: String,
            },
            show:  {
    	    	type:Boolean,
                default:true
            },
            backFun: {
                type: Function,
            }
        },
        data() {
            return{

            }
        },
        mounted(){

        },
        methods: {
            back () {
                if(this.backFun){
                    this.backFun();
                }else{
//                    console.log(this.$route)
                    this.$router.back();
                }
            }
        }
    }
</script>
