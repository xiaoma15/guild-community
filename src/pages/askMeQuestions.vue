<style lang="less" scoped>
@import '../assets/style/pages/askMEQuestions';
</style>
<style lang="less">
input{
    font-size: 14px;
    color: #999;
    font-family: PingFangSC-Regular;
}
</style>
<template>
    <div class="askMeQuestions_page">
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

        <div class="askMeQuestionsContent">
            <div class="nav">
                <div class="nav-item" @click="$router.push('community')">我的关注</div>
                <div class="nav-item actived">向我提问<div class="nav-bottom"></div></div>
                <div class="nav-item" @click="$router.push('myQuestions')">我的提问</div>
                <div class="nav-item" @click="$router.push('myAnswers')">我的回答</div>
            </div>

            <div class="detail-box">
                <div class="communicationBox">
                    <scroller ref="scroller" class="my-scroller"  :pullDown="true" @pullDown="downLoading()" :pullUp="page.isMore" @pullUp='upLoading()'>
                        <div class="block" v-for="(item, index) in list" :key="index">
                            <div class="block-left" @click="goPage('problemDetails', {questionId: item.questionId})">
                                <div class="block-content">
                                    <div class="title"><i class="signButton">{{item.issuesTag}}</i> {{item.questionTitle}}</div>
                                    <div class="info">
                                        <span>{{ item.organizationId | orgFilter }}·{{item.proposer}}</span><span>{{item.proposeTime | formaTime}}</span><span>{{item.respondentNum}}人已回答</span>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="block-right">
                                <div class="concernButton" @click="addAttenion(item)" v-if="item.attentionStat == 0"><i class="icon-guanzhu iconfont"></i>关注</div>
                                <div class="payAttentionButton" v-if="item.attentionStat == 1">已关注</div>
                            </div> -->
                            <div class="block-right" >
                                <div class="concernButton"  @click="addAttenion(item, index)" v-if="item.attentionStat == 0"><i class="icon-guanzhu iconfont"></i>关注</div>
                                <div class="payAttentionButton"  @click="addAttenion(item, index)" v-if="item.attentionStat == 1">已关注</div>
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
    </div>
</template>

<script>
import platform from '../platform';
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
            organizationId: '', //事业部id
            objId: '', //问题id
            userType: '', //[题主类型](10: 导购  40:业务员)
            isAttention: false,
            repMsg: '',
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
            this.list = [];
            this.getAidQuestionList();
        },
        // 上拉刷新
        upLoading() {
            this.getAidQuestionList();
        },
        //掉接口获取向我提问
        getAidQuestionList(){
            let params = {
                search: this.condition,
                page: this.page.pageNum,
                limit: this.page.pageSize,
                questionType: '1', //问题类型
            }
            this.$showLoading();
            this.$store.dispatch('getAidQuestionList', params).then(rep => {
                this.$hideLoading();
                if (rep.retcode == 'SUCC' && rep.questionList && rep.questionList.length) {
                    this.notResouce = false;
                    if (this.page.pageNum === 1) {
                        this.list = [];
                    }
                    if ((rep.questionList && rep.questionList.length < this.page.pageSize)) {
                        this.page.isMore = false;
                    } else {
                        this.page.isMore = true;
                        this.page.pageNum++;
                    }
                    this.list = this.list.concat(rep.questionList);
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
        // 加关注
        addAttenion(val, idx){
            console.log(val)
            let params = {
                attentionType: '2',
                userType: val.userType,
                objId: val.questionId,
                organizationId: val.organizationId,
            }
            this.$showLoading();
            this.$store.dispatch('attentionThings', params).then(rep => {
                this.$hideLoading();
                if (rep.retcode == 'SUCC') {
                    this.$toast(rep.errmsg)
                    if(rep.errmsg == '关注成功!') {
                        this.list = this.list.map(item => {
                            if(item == val){
                                item.attentionStat = 1;
                            }
                            return item;
                        });
                    } else {
                        this.list = this.list.map(item => {
                            if(item == val){
                                item.attentionStat = 0;
                            }
                            return item;
                        });
                    }
                } else {
                    console.log(rep.errmsg || 'attentionThings接口返回失败！')
                }
            }).catch(e => {
                this.$hideLoading();
                this.$toast(e || '网络出小差，请稍后重试！')
            })
        },
        goPage(url, param) {
            this.$router.$push({
                name: url,
                query:param
            })
        },
    },
    activated(){
        this.downLoading();
    }
}
</script>

