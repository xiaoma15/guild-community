<style lang="less" scoped>
    @import "../assets/style/variable.less";
    .header{
        font-family: PingFangSC-Regular;
        display: flex;
        align-items: center;
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
        .header-back{
            flex-basis: 40px;
            font-family: PingFangTC-Regular;
            font-size: 18px;
            color: #333333;
            .back{
                position: relative;
                font-size: 21px;
                color: #333333;
                line-height: 44px;
                padding-left: 15px;
                width: 30px;
            }
        }
        .title{
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #303030;
            text-indent: -20px;
        }
        .middle-con{
            overflow: hidden;
            flex: 1;
        }
        .right-con{
            flex-basis: 75px;
            // padding-left: 15px;
            padding-right: 15px;
            font-size: 18px;
            color: #666;
        }
    }

</style>
<template>
    <header class="header  bd-bottom" v-if="show">
        <div  class="header-back" @click="back">
            <i class="back icon-back iconfont"></i>
        </div>
        <div class="middle-con" v-if="!title">
            <slot name="middle"></slot>
        </div>
        <div class="title middle-con" v-if="title">{{title}}</div>
        <div class="right-con" v-if="hasRight">
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
            },
            hasRight: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return{

            }
        },
        mounted(){

        },
        methods: {
            back() {
                if(this.backFun){
                    this.backFun();
                }else{
                    this.$router.back();
                }
            }
        }
    }
</script>
