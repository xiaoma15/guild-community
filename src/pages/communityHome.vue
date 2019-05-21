<style lang="less" scoped>
@import '../assets/style/pages/communityHome';
</style>
<style lang="less">
input{
    font-size: 14px;
    color: #999;
    font-family: PingFangSC-Regular;
}
</style>
<template>
    <div class="communityHome">
        <my-header class="my-header" :backFun="exit">
            <div slot="middle" class="middle">
                <div class="search-box">
                    <div class="inputBox">
                        <i class="iconfont icon-chaxunx"></i>
                        <form action="javascript:return true">
                            <input type="search" :placeholder="placeholder" v-model="condition" @keyup.prevent.stop="searchWord($event,condition)" :class="{'col-333': condition}" @click="goPage('searchTemp')">
                        </form>
                        <i class="iconfont icon-chax " v-if='condition.length'  @click.prevent.stop="clear"></i>
                    </div>
                </div>
            </div>
            <div slot="right" class="right" @click="$router.push('publishQuestions')">
                <i class="icon-tiwen iconfont"></i>
                提问
            </div>
        </my-header>

        <div class="communityContent">
            <div class="nav">
                <div class="nav-item">我的关注<div class="nav-bottom"></div></div>
                <div class="nav-item" @click="$router.push('askMeQuestions')">向我提问</div>
                <div class="nav-item" @click="$router.push('myQuestions')">我的提问</div>
                <div class="nav-item" @click="$router.push('myAnswers')">我的回答</div>
            </div>

            <div class="detail-box">
                <div class="more" @click="goPage('mySquare')">
                    <span>发现更多感兴趣的人</span>
                    <div class="imgBox">
                        <div class="pro-img" v-for="(item, idx) in 5" :key="idx" :style="{right:35+21*idx + 'px'}">
                            <img :src="renderHeadPic(idx)" alt="">
                        </div>
                        <i class="iconfont icon-back rotate180" ></i>
                    </div>
                </div>

                <div class="communicationBox">
                    <scroller ref="scroller" class="my-scroller"  :pullDown="true" @pullDown="downLoading()" :pullUp="page.isMore" @pullUp='upLoading()'>
                        <div class="block" v-for="(item, index) in list" :key="index">
                            <!-- <div class="block-status">
                                <img src="../assets//img/caina.png" alt="">
                            </div> -->
                            <div class="block-header" v-if="item.attentionType == 1" @click="goPage('myHomepage', {respondentId: item.respondentId, userType: item.userType})">
                                <div><span class="photo"><img :src="renderHeadPic(item.respondentId)" alt=""></span>{{item.respondent}}回答了问题</div>
                                <div>{{item.contentTime | formaTime}}</div>
                            </div>
                            <div class="block-header" v-if="item.attentionType == 2">
                                <div style="display: flex;"><span class="ques-title">{{item.questionTitle}}</span><span>有了新回答</span></div>
                                <div class="time">{{item.contentTime | formaTime}}</div>
                            </div>
                            <div class="block-content">
                                <div class="title" @click="goPage('problemDetails', {questionId: item.questionId})">
                                    <i>{{item.issuesTag}}</i> {{item.questionTitle}}
                                </div>
                                <div class="discount" @click="goPage('answersDetail',{replyId:item.replyId})">
                                    {{item.replyContent}}
                                </div>
                            </div>
                            <div class="block-footer">
                                <!-- @click="goPage('allCommont', {num: item.commentNum, replyId: item.replyId})"   @click="doPraise(item.replyId)"-->
                                <span ><i class="iconfont icon-pinglunxiaoliebiaoye"></i>评论({{item.commentNum}})</span>
                                <span ><i class="iconfont icon-dianzanxiao-liebiaoye1"></i>点赞({{item.praiseNum}})</span>
                            </div>
                        </div>
                    </scroller>
                </div>
            </div>
        </div>

        <div class="no_data" v-show="notResouce && !list.length">
            <img class="no_data_img" src="../assets/img/no-data.png" alt="">
            <div class="no_data_content">暂无数据哦~</div>
        </div>

        <div class="guide-background" v-if="guidesShow">
            <img class="" src="../assets/img/guideOne.jpg" style="width: 100%; height: 100%" v-if="guides == 1"
                @click="guideClick(2)">
            <img class="" src="../assets/img/guideTwo.jpg" style="width: 100%; height: 100%" v-if="guides == 2"
                @click="guideClick(3)">
            <img class="" src="../assets/img/guideThree.jpg" style="width: 100%; height: 100%" v-if="guides == 3"
                @click="guideClick(4)">
            <img class="" src="../assets/img/guideFour.jpg" style="width: 100%; height: 100%" v-if="guides == 4"
                @click="guideClick(5)">
            <img class="" src="../assets/img/guideFive.jpg" style="width: 100%; height: 100%" v-if="guides == 5"
                @click="guideClick(6)">
            <img class="" src="../assets/img/guideSix.jpg" style="width: 100%; height: 100%" v-if="guides == 6"
                @click="guideClick(7)">
            <img class="" src="../assets/img/guideSeven.jpg" style="width: 100%; height: 100%" v-if="guides == 7"
                @click="guideClick(8)">
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex';
import platform from '../platform';
import { storage } from '../js/common';
export default {
    data() {
        return {
            notResouce: false,
            condition: '', //查询条件
            placeholder: '输入关键词搜索',
            page: {
                isMore: true,
                pageSize: 10,
                pageNum: 1
            },
            list: [],
            guidesShow: null,
            guides: 1,
        }
    },
    methods: {
        // 退出应用
        exit() {
            platform.exit();
        },
        // 确认搜索
        searchWord(e,val) {
            if(e.keyCode === 13) {
                this.condition = val;
                this.downLoading();
            }
        },
        // 取消搜索
        clear() {
            this.condition = ''
            this.downLoading();
        },
        toggleTab(tab) {
            this.currentTab = tab; // tab 为当前触发标签页的组件名
        },
        // 下拉刷新
        downLoading() {
            this.page.pageNum = 1;
            this.list = []
            this.getAttentionList();
        },
        // 上拉刷新
        upLoading() {
            this.getAttentionList();
        },
        guideClick(num){
            this.guides = num
            if(this.guides == 8) {
                this.guidesShow = false
                storage.set('firstGo', 1)
            }
        },
        //调用接口获取数据
        getAidQueationNum() {
            let params = {
            }
            this.$showLoading();
            this.$store.dispatch('getAidQuestionNum', params).then(rep => {
                if (rep.retcode == 'SUCC') {
                    this.$hideLoading();
                }
            }).catch(e => {
                this.$hideLoading();
                this.$toast(e || '网络出小差，请稍后重试！')
            })
        },
        //掉接口获取我的关注列表
        getAttentionList(){
            let params = {
                search: this.condition,
                page: this.page.pageNum,
                limit: this.page.pageSize
            }
            this.$showLoading();
            this.$store.dispatch('getAttentionList', params).then(rep => {
                this.$hideLoading();
                if (rep.retcode == 'SUCC' && rep.attentionList && rep.attentionList.length) {
                    this.notResouce = false;
                    if (this.page.pageNum === 1) {
                        this.list = [];
                    }
                    if ((rep.attentionList && rep.attentionList.length < this.page.pageSize)) {
                        this.page.isMore = false;
                    } else {
                        this.page.isMore = true;
                        this.page.pageNum++;
                    }
                    this.list = this.list.concat(rep.attentionList);
                    this.$nextTick(() => {
                        this.$refs.scroller.refresh();
                    });
                } else {
                    if (this.page.pageNum == 1) {
                        this.notResouce = true;
                    }
                    console.log(rep.errmsg || 'getAttentionList接口返回失败！')
                }
            }).catch(e => {
                this.$hideLoading();
                this.$toast(e || '网络出小差，请稍后重试！')
            })
        },
        // //调用点赞接口
        // attentionThings(val){
        //     let params = {
        //         organizationId: '10',
        //         attentionType: '3', //类型(1:关注题主 2:关注问题 3:回复点赞)
        //         objId: val
        //     }
        //     this.$showLoading();
        //     this.$store.dispatch('attentionThings', params).then(rep => {
        //         this.$hideLoading();
        //         if (rep.retcode == 'SUCC' ) {
        //             this.$toast(rep.errmsg)
        //             // this.downLoading();
        //         } else {
        //             console.log(rep.errmsg || 'attentionThings接口返回失败！')
        //         }
        //     }).catch(e => {
        //         this.$hideLoading();
        //         this.$toast(e || '网络出小差，请稍后重试！')
        //     })
        // },
        // //点赞
        // doPraise(val) {
        //     this.attentionThings(val)
        // },
        goPage(url, param) {
            this.$router.$push({
                name: url,
                query: param
            })
        },
    },
    created(){
        let first = storage.get('firstGo') || ''
        if(first != 1){
            this.guidesShow = true
        }
    },
    activated(){
        this.getAidQueationNum();
        this.downLoading();
    }
}
</script>
