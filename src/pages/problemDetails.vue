<style lang="less" scoped>
@import '../assets/style/pages/problemDetails';
</style>

<template>
    <div class="problemDetails_page">
        <v-header title="问题详情" :backFun="backFun"></v-header>

        <div class="problemDetailsContent">
            <div class="detail-box" ref="detailBox">
                <div class="communicationBox">
                        <div class="block" ref="blocks">
                            <div class="block-left">
                                <div class="block-content">
                                    <div class="title"><i class="signButton">{{questionObj&&questionObj.issuesTag || ''}}</i> {{questionObj.questionTitle || ''}}</div>
                                    <div class="info">
                                        <span v-if="!questionObj.isMine">{{questionObj.organizationId | orgFilter}}·{{questionObj.proposer}}</span>
                                        <span>{{questionObj.creationDate | formaTime}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="block-right" v-if="questionObj.isMine == 1">
                                <!-- <div class="closeButton">关闭问题</div>
                                <div class="alreadyClose">已关闭</div> -->
                                <div  v-if="questionObj.questionStat == 0 || questionObj.questionStat == 2" class="alreadyClose">已关闭</div>
                                <div  v-if="questionObj.questionStat == 1" class="closeButton" @click="closeQuestion(questionObj.questionId)">关闭问题</div>
                            </div>
                            <div class="block-right" v-else>
                                <div class="concernButton"  @click="addAttenion(questionObj)" v-if="questionObj.attentionStat == 0"><i class="icon-guanzhu iconfont"></i>关注</div>
                                <div class="payAttentionButton"  @click="addAttenion(questionObj)" v-else>已关注</div>
                            </div>

                        </div>

                        <div class="balock-img-box" ref="blockImg">
                            <div class="item-title">
                                {{questionObj.questionDescribe}}
                            </div>
                            <div class="img-box" v-if="pictrueList.length">
                                <div class="item-img" v-for="(item, index) in pictrueList" :key="index" @click="showPic(index)" >
                                    <img :src="item" alt="">
                                </div>
                            </div>
                        </div>

                        <div class="answer" ref="answer" >
                            回答({{list.length}}条)
                        </div>

                        <!-- <div style="position: relative;"> -->
                            <!-- <scroller ref="scroller" class="my-scroller"  :pullDown="true" @pullDown="downLoading()" :pullUp="page.isMore" @pullUp='upLoading()' :class="{'pos-bottom': questionObj.isMine != 1, 'pos-top': pictrueList.length==0}"> -->
                                <div class="item" v-for="(item, index) in list" :key="index">
                                    <div class="block-status" v-if="item.adoptionStat">
                                        <img src="../assets/img/caina.png" alt="">
                                    </div>
                                    <div class="block-header">
                                        <div><span class="photo" @click="userDetail(item)"><img :src="renderHeadPic(item.respondentId)" alt=""></span>{{item.respondent}}<span class="time">{{item.contentTime | formaTime}}</span></div>
                                        <div v-if="questionObj.isMine == 1">
                                            <div class="iconBox" v-if="!hasAdoptionStat && item.adoptionStat != 1 && item.questionStat == 0" @click="acceptMethod(item.replyId)"><i class="iconfont icon-caina"></i> 采纳</div>
                                        </div>
                                    </div>
                                    <div class="block-content">
                                        <div class="discount"  @click="goPage('answersDetail',{replyId:item.replyId})">
                                            {{item.replyContent}}
                                        </div>
                                    </div>
                                    <!-- <div class="block-footer" v-if="item.isMine!=1">
                                        <span><i class="iconfont iconpinglunxiaoliebiaoye "></i>评论(0)</span>
                                        <span><i class="iconfont icondianzanxiao-liebiaoye "></i>点赞(0)</span>
                                    </div> -->
                                </div>
                            <!-- </scroller> -->
                        <!-- </div> -->

                </div>
            </div>

            <div class="footer bd-top" v-if="questionObj.isMine != 1">
                <div class="submitButton"  @click="goPage('editAnswer', {quesID:questionObj.questionId, quesTitle: questionObj.questionTitle})">写回答</div>
            </div>
        </div>

        <picture-preview :show="showPreview" :list="pictrueList" :index="showPreviewIdx" v-on:on-hide="hidePic"></picture-preview>
    </div>
</template>

<script>
export default {
    data() {
        return {
            questionId: '', // 问题id
            organizationId: '', //事业部id
            list: [],
            questionObj: {},
            notResouce: false,
            isAttention: false, //是否关注
            pictrueList: [],
            hasAdoptionStat: false,
            comFrom: '',
            showPreview : false,
            showPreviewIdx : 0
        }
    },
    methods: {
        //隐藏轮播图
        hidePic(){
            this.showPreview = false;
            this.showPreviewIdx = 0;
        },
        //显示轮播图
        showPic(idx){
            this.showPreviewIdx = idx;
            this.showPreview = true;
        },
        backFun() {
            if(this.comFrom == 1) {
                this.goPage('community');
            } else {
                this.$router.go(-1);
            }
        },
        /** 个人详细 */
        userDetail(item){
            console.log('个人详情');
            this.goPage('myHomepage', {respondentId:item.respondentId,userType:item.userType})
        },
        goPage(url, param) {
            this.$router.$push({
                name: url,
                query:param
            })
        },
        // 下拉刷新
        downLoading() {
            this.page.pageNum = 1;
            this.list = [];
            this.getAidDetailInfo();
        },
        // 上拉刷新
        upLoading() {
            this.getAidDetailInfo();
        },
        //查询问题详情
        getAidDetailInfo(){
            let params = {
                organizationId: this.organizationId,
                questionId: this.questionId,
                limit: 999
            }
            this.$showLoading();
            this.$store.dispatch('getAidDetailInfo', params).then(rep => {
                this.$hideLoading();
                console.log(rep)
                if(rep.retcode == 'SUCC'){
                    this.questionObj = rep.questionInfo
                    this.pictrueList = rep.questionInfo.picture
                    this.list = rep.replyList
                } else {
                    console.log(rep.errmsg || 'getAidDetailInfo接口返回失败！')
                }
            }).catch(e => {
                this.$hideLoading();
                this.$toast(e || '网络出小差，请稍后重试！')
            })
        },
        //加关注
        addAttenion(val){
            this.organizationId = val.organizationId
            this.userType = val.userType
            this.objId = val.questionId
            this.attentionThings();
        },
        //调用接口关注
        attentionThings() {
            let params = {
                organizationId: this.organizationId,
                attentionType: '2',
                userType: this.userType,
                objId: this.objId
            }
            this.$showLoading();
            this.$store.dispatch('attentionThings', params).then(rep => {
                this.$hideLoading();
                if (rep.retcode == 'SUCC') {
                    this.$toast(rep.errmsg)
                    if(rep.errmsg == '关注成功!'){
                        // this.questionObj.questionStat = 1;
                        this.questionObj.attentionStat = 1;
                    }
                    if(rep.errmsg == '取消关注成功!'){
                        // this.questionObj.questionStat = 0
                        this.questionObj.attentionStat = 0;
                    }
                } else {
                    console.log(rep.errmsg || 'attentionThings接口返回失败！')
                }
            }).catch(e => {
                this.$hideLoading();
                this.$toast(e || '网络出小差，请稍后重试！')
            })
        },
        // 关闭问题
        closeQuestion(questionId){
            let params = {questionId,replyType:2};
            this.$store.dispatch('replyQuestion', params).then(rep => {
                if(rep.retcode == "SUCC") {
                    this.$toast('关闭问题成功')
                    this.questionObj.questionStat = 0
                }
            }).catch(erro => {
                throw erro;
            })
        },
        // 采纳
        acceptMethod(val){
            let params = {
                organizationId:'',
                replyId:val,
                replyType:'3'
            }
            this.$showLoading()
            this.$store.dispatch('replyQuestion',params).then(rep=>{
                this.$hideLoading()
                if(rep.retcode == 'SUCC'){
                    this.$toast('亲，您已经采纳了该条回答！！')
                    this.getAidDetailInfo();
                } else {
                    this.$toast('采纳接口出错')
                }
            },e=>{
                this.$hideLoading();
                this.$toast(e || '网络开小差，请稍后重试！');
            })
        },
    },
    activated() {
        console.log(666);

        let currentOrg = this.storage.get('organization') || ''
        console.log(currentOrg)
        
        let query = this.$route.query
        console.log(query)
        this.questionId = query.questionId
        this.comFrom = query.comFrom || ''
        this.organizationId = currentOrg[0].baseDataId || query.bookId
        this.getAidDetailInfo();
    },
    deactivated(){
        this.hidePic();
    }
}
</script>
