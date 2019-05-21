<style lang="less" scoped>
@import '../assets/style/pages/myAnswers';
i.signButton{
    padding: 1.5px 6px;
    margin: 1px 2px 2px 0;
    line-height: 14px;
    display: inline-block;
}    
</style>
<style lang="less">
input{
    font-size: 14px;
    color: #999;
    font-family: PingFangSC-Regular;
}
</style>
<template>
    <div class="myAnswers_page">
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

        <div class="myAnswersContent">
            <div class="nav">
                <div class="nav-item" @click="$router.push('community')">我的关注</div>
                <div class="nav-item" @click="$router.push('askMeQuestions')">向我提问</div>
                <div class="nav-item" @click="$router.push('myQuestions')">我的提问</div>
                <div class="nav-item actived">我的回答<div class="nav-bottom"></div></div>
            </div>

            <div class="detail-box">
                <div class="rankingBox">
                    <div class="ranking">
                        <div class="photo">
                            <img :src="renderHeadPic(userInfo.respondentId)" alt="">
                        </div>
                        <div class="myRankPhoto">
                            <img src="../assets/img/one.png" alt="" v-if="userInfo.popularRank == 1">
                            <img src="../assets/img/two.png" alt="" v-if="userInfo.popularRank == 2">
                            <img src="../assets/img/thrid.png" alt="" v-if="userInfo.popularRank == 3">
                        </div>
                        <span class="myRank">第{{userInfo.popularRank}}名</span>
                    </div>
                    <!-- $router.push('myFans')  $router.push('myAttention')-->
                    <div class="ranking padtop" @click="goNext(1, userInfo.fansNum)">
                        <p class="num special">{{userInfo.fansNum || 0}}</p>
                        <p class="numName">粉丝</p>
                    </div>

                    <div class="ranking padtop" @click="goNext(2, userInfo.attentionNum)">
                        <p class="num special">{{userInfo.attentionNum || 0}}</p>
                        <p class="numName">关注</p>
                    </div>

                    <div class="ranking padtop">
                        <p class="num">{{userInfo.replyNum || 0}}</p>
                        <p class="numName">回答</p>
                    </div>

                    <div class="ranking padtop">
                        <p class="num">{{userInfo.praiseNum || 0}}</p>
                        <p class="numName">点赞</p>
                    </div>

                </div>
                <div class="communicationBox">
                    <scroller ref="scroller" class="my-scroller"  :pullDown="true" @pullDown="downLoading()" :pullUp="page.isMore" @pullUp='upLoading()'>
                        <div class="block" v-for="(item, index) in list" :key="index">
                            <div class="block-status" v-if="item.adoptionStat=='1'">
                                <img src="../assets/img/caina.png" alt="">
                            </div>
                            <div class="block-title" @click="goPage('answersDetail',{replyId:item.replyId})">
                                {{item.replyContent}}
                                <div>{{item.contentTime | formaTime}}</div>
                            </div>
                            <!--  -->
                            <div class="block-item">
                                <!--去到问题 详情 problemDetails myProblemDetails(关闭问题) -->
                                <div class="title" @click="goPage('problemDetails',{questionId: item.questionId})"><i class="signButton">{{item.issuesTag}}</i> {{item.questionTitle}}</div>
                                <div class="time">
                                    <span>{{item.organizationId | orgFilter}}·{{item.proposer}}</span><span>{{item.proposeTime | formaTime}}</span><span>{{item.respondentNum}}人已回答</span>
                                </div>
                                <div class="discount">
                                   {{item.questionDescribe}}
                                </div>
                                <b></b>
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
            list: [],
            userInfo:{}
        }
    },
    methods: {
        // 退出应用
        exit() {
            platform.exit();
        },
        goNext(type, num){
            if(type==1 && num != 0) {
                this.goPage('myFans')
            }
            if(type==2 && num != 0) {
                this.goPage('myAttention')
            }
        },
        // 确认搜索
        searchWord(e,val) {
            if(e.keyCode === 13) {
                this.condition = val;
            }
        },
        // 取消搜索
        clear() {
            this.condition = ''
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
        //掉接口获取我的回答
        getAidQuestionList(){
            let params = {
                search: this.condition,
                page: this.page.pageNum,
                limit: this.page.pageSize,
                questionType: '3', //问题类型
            }
            this.$showLoading();
            this.$store.dispatch('getAidQuestionList', params).then(rep => {
                console.log(rep)
                this.$hideLoading();
                if(rep.retcode == "SUCC") {
                    this.userInfo = rep.userInfo;
                } else {
                    console.log(rep.errmsg || 'getAttentionList接口返回失败！')
                }
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
        this.getAidQuestionList();
    }
}
</script>

