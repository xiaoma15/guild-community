<style lang="less" scoped>
@import '../assets/style/pages/myQUestions';
</style>
<style lang="less">
input{
    font-size: 14px;
    color: #999;
    font-family: PingFangSC-Regular;
}
</style>
<template>
    <div class="myQUestions_page">
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

        <div class="myQUestionsContent">
            <div class="nav">
                <div class="nav-item" @click="$router.push('community')">我的关注</div>
                <div class="nav-item" @click="$router.push('askMeQuestions')">向我提问</div>
                <div class="nav-item actived">我的提问<div class="nav-bottom"></div></div>
                <div class="nav-item" @click="$router.push('myAnswers')">我的回答</div>
            </div>

            <div class="detail-box">
                <div class="communicationBox">
                    <scroller ref="scroller" class="my-scroller"  :pullDown="true" @pullDown="downLoading()" :pullUp="page.isMore" @pullUp='upLoading()'>
                        <div class="block" v-for="(item, index) in list" :key="index">
                            <div class="block-status">
                                <!-- <img src="../assets/img/caina.png" alt="" v-if="item.adoptionStat"> -->
                                <img src="../assets/img/guanbi.png" alt="" v-if="item.questionStat == 0">
                                <img src="../assets/img/jiejue.png" alt="" v-if="item.questionStat == 2">
                            </div>
                            <div class="block-content" @click.capture="goPage('problemDetails', {questionId: item.questionId})">
                                <div class="title"><i>{{item.issuesTag}}</i> {{item.questionTitle}}</div>
                                <div class="time">
                                    <span>{{item.proposeTime | formaTime}}</span><span v-if="item.respondentNum">{{item.respondentNum}}人已回答</span>
                                </div>
                                <div class="discount">
                                    {{item.questionDescribe}}
                                </div>
                            </div>
                            <div class="block-footer" :class="{'pad-0': item.questionStat == 0,'pad-0': item.questionStat == 2, 'bd-top': item.questionStat == 1}">
                                <div  v-if="item.questionStat == 1" class="closeButton" @click="closeQuestion(item.questionId,item)">关闭问题</div>
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
            transitionName: '',
            noAnimate: true,
            page: {
                isMore: true,
                pageSize: 10,
                pageNum: 1
            },
            list: []
        }
    },
    methods: {
        // 退出应用
        exit() {
            platform.exit();
        },
        //关闭问题
        closeQuestion(questionId,closeItem){
            let params = {questionId,replyType:2};
            this.$store.dispatch('replyQuestion', params).then(rep => {
                if(rep.retcode == 'SUCC') {
                    this.$toast('关闭问题成功')
                    this.list = this.list.map(item => {
                        if(item == closeItem){
                            item.questionStat = 0;
                        }
                        return item;
                    });
                } else{
                    this.$toast('replyQuestion接口出错')
                }
            }).catch(erro => {
                this.$toast(erro || '网络开小差，请稍后重试！')
            })

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
            this.getAidQuestionList();
        },
        // 上拉刷新
        upLoading() {
            this.getAidQuestionList();
        },
        //调用接口获取我的提问
        getAidQuestionList(){
            let params = {
                search: this.condition,
                page: this.page.pageNum,
                limit: this.page.pageSize,
                questionType: '2', //问题类型
            }
            this.$showLoading();
            this.$store.dispatch('getAidQuestionList', params).then(rep => {
                console.log(rep)
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
        /** 跳转 */
        goPage(url,param){
            this.$router.$push({
                name:url,
                query: param
            })
        }
    },
    activated() {
        this.downLoading();
    },
}
</script>

