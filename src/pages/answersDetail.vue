<style lang="less" scoped>
@import '../assets/style/pages/answersDetail.less';
</style>
<template>
    <div class="answersDetail_page">
        <v-header title=回答详情 :backFun="backFun"></v-header>

        <div class="answersDetailContent">
            <div class="answer-title">
                <i class="signButton">{{questionInfo.issuesTag}}</i> {{questionInfo.questionTitle}}
            </div>

           <div class="answer-box">
                <div class="block">
                    <!-- 已经采纳 -->
                    <div class="block_img" v-if="replyInfo.adoptionStat=='1' || isAccept">
                        <img src="../assets/img/caina.png" alt="">
                    </div>
                    <div class="block-header">
                        <div @click="userDetail()">
                            <span class="photo"><img :src="renderHeadPic(replyInfo.respondentId)" alt="" ></span>
                            {{replyInfo.respondent}}
                        </div>
                        <div v-if="replyInfo.isMine != 1">
                            <div @click="clickAttention()" class="concernButton" v-if="replyInfo.attentionStat=='0'"><i class="icon-guanzhu iconfont"></i>关注</div>
                            <div @click="clickAttention()" class="concernButton" v-if="replyInfo.attentionStat=='1'"><i></i>已关注</div>
                            <div @click="clickAttention()" class="concernButton" v-if="replyInfo.attentionStat=='2'"><i></i>互相关注</div>
                        </div>

                    </div>
                    <div class="discount">
                         {{replyInfo.replyContent}}
                    </div>
                    <!-- 存在图片才显示 -->
                    <div v-if="replyInfo.picture">
                        <div class="answer-img" v-for="(item,index) in replyInfo.picture" :key="index" @click="showPic(index)">
                            <img :src="item" alt="" >
                        </div>
                    </div>

                    <span class=time>发布于 {{replyInfo.contentTime | formaTime}}</span>
                    <!-- 个人提出问题 （点赞、评论、采纳），他人提出问题（点赞、评论）-->
                    <div class="work-box">
                        <span v-if=" questionInfo.questionStat== 1 && replyInfo.isMine == 1" @click="deleteMethod()">
                            <i class="icon-lajitongx iconfont"></i>
                            <p>删除</p>
                        </span>
                        <span v-if="questionInfo.questionStat== 1 && replyInfo.isMine == 1" @click="editMethod()">
                            <i class="icon-bianji iconfont"></i>
                            <p>编辑</p>
                        </span>
                        <span @click="likeMehod()" v-if="questionInfo.questionStat != 0 && replyInfo.isMine != 1 && !replyInfo.praiseStat">
                            <i class="icon-dianzanxiao-liebiaoye iconfont"></i>
                            <p>点赞({{replyInfo.praiseNum}})</p>
                        </span>
                        <span v-if="replyInfo.praiseStat && replyInfo.isMine != 1" style="color: #11BFF4">
                            <img src="../assets/img/have-praise.svg" alt="" style="width: 16px;height: 16px;">
                            <p>点赞({{replyInfo.praiseNum}})</p>
                        </span>
                        <span  @click="clickComment()">
                            <i class="icon-pinglunxiaoliebiaoye iconfont"></i>
                            <p>评论({{replyInfo.commentNum}})</p>
                        </span>
                        <!-- 问题详情是我的显示 -->
                        <span v-if="questionInfo.isMine=='1'&& questionInfo.questionStat == 1 && !isAccept" @click="acceptMethod()">
                            <i class="icon-xingxing iconfont"></i>
                            <p>采纳</p>
                        </span>
                    </div>

                </div>
           </div>

           <div class="next-button" v-if="replyInfo.nextReplyId">
                <div class="nextAnswer" @click="nextReplyMethod(replyInfo.nextReplyId)">
                    <img src="../assets/img/doubleArrow.svg" alt="">
                    下个回答
                </div>
           </div>
        </div>


        <picture-preview :show="showPreview" :list="replyInfo.picture" :index="showPreviewIdx" v-on:on-hide="hidePic"></picture-preview>
    </div>
</template>

<script>
import { setTimeout } from 'timers';
import { storage ,methods} from '../js/common'
export default {
    data() {
        return {
            hasRight: false,
            list: [],
            replyId:'', // 回复Id
            questionInfo:{}, // 问题详情信息
            replyInfo:{}, // 回复问题信息
            questionId:'', //
            respondentId:'', //
            nextReplyId:'', // 下一个回答
            isAccept: false,
            havePraise: false,
            comFrom: '', // 标记是推送消息还是直接路由
            showPreview : false, //是否显示轮播图
            showPreviewIdx : 0  //显示第几张图
        }
    },
    methods:{
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
            console.log(this.comFrom)
            if(this.comFrom == 1) {
                this.goPage('community')
            } else {
                this.$router.go(-1);
                localStorage.removeItem('hasReplyId');
            }
        },
        getAnswersMethod() {
            let params = {
                replyId:this.replyId,
            };
            this.$showLoading();
            this.$store.dispatch('getAidDetailInfo',params).then(data => {
                if(data.retcode == "SUCC"){
                    this.$hideLoading();
                    this.lastNextReplyId = '';
                    this.questionInfo = data.questionInfo;
                    this.replyInfo = data.replyInfo;
                    this.nextReplyId = data.replyInfo.nextReplyId;
                }else {
                    this.$toast(data.errmsg || "获取信息失败！");
                    this.$hideLoading();
                }
            },e=>{
                this.$hideLoading();
                this.$toast(e);
            })
        },
        /**下个回答 */
        nextReplyMethod(infoid){
             let params = {
                replyId:this.nextReplyId,
            };
            this.$showLoading();
            this.$store.dispatch('getAidDetailInfo',params).then(data => {
                if(data.retcode == "SUCC"){
                    this.$hideLoading();
                    this.lastNextReplyId = '';
                    this.questionInfo = data.questionInfo;
                    this.replyInfo = data.replyInfo;
                    this.nextReplyId = data.replyInfo.nextReplyId;
                }else {
                    this.$toast(data.errmsg || "获取信息失败！");
                    this.$hideLoading();
                }
            },e=>{
                this.$hideLoading();
                this.$toast(e);
            })
        },
        /** 点击评论 */
        clickComment(){
            this.$router.push({
                name:'allCommont',
                query:{
                    num: this.questionInfo.respondentNum,
                    replyID: this.replyInfo.replyId
                }
            })

        },
        /** 采纳 */
        acceptMethod(){
            let params = {
                organizationId:'',
                replyId:this.replyInfo.replyId,
                replyType:'3'
            }
            this.$showLoading()
            this.$store.dispatch('replyQuestion',params).then(rep=>{
                this.$hideLoading()
                if(rep.retcode == 'SUCC'){
                    this.$toast('亲，您已经采纳了该条回答！！')
                    this.isAccept = true;
                } else {
                    this.$toast('采纳接口出错')
                }
            },e=>{
                this.$hideLoading();
                this.$toast(e || '网络开小差，请稍后重试！');
            })
        },
        /** 关注 */
        clickAttention(){
            let params = {
                userType:this.replyInfo.userType,
                objId:this.replyInfo.respondentId,
                attentionType:'1'
            }
            this.$showLoading();
            this.$store.dispatch("attentionThings",params).then(rep=>{
                if(rep.retcode == "SUCC"){
                    this.$hideLoading();
                    if(rep.errmsg == '关注成功!'){
                        this.replyInfo.attentionStat = 1
                    }
                    if(rep.errmsg == '取消关注成功!'){
                        this.replyInfo.attentionStat = 0
                    }
                }else{
                    this.$hideLoading();
                }
            },e=>{
                this.$hideLoading();
                this.$toast(e);
            })
        },
        /**点赞 */
        likeMehod(){
            let params = {
                userType:this.replyInfo.userType,
                objId:this.replyInfo.replyId,
                attentionType:'3'
            }
            this.$showLoading();
            this.$store.dispatch("attentionThings",params).then(rep=>{
                if(rep.retcode == "SUCC"){
                    this.$hideLoading();
                    this.$toast(rep.errmsg)
                    this.getAnswersMethod();
                }else{
                    this.$hideLoading();
                }
            },e=>{
                this.$hideLoading();
                this.$toast(e);
            })
        },
        /**删除*/
        deleteMethod(){
            this.$showLoading();
            let params = {
                userType:this.replyInfo.userType,
                replyId:this.replyInfo.replyId,
                replyType:'4'
            }
            this.$store.dispatch('replyQuestion',params).then(rep=>{
                this.$hideLoading();
                if(rep.retcode == "SUCC") {
                    this.$toast('亲，删除成功！！！')
                    setTimeout(() => {
                        this.$router.push('myAnswers')
                    }, 3000)
                }
            },e=>{
                this.$hideLoading();
                this.$toast(e);
            })
        },
        /** 编辑 */
        editMethod(){
            this.$router.push({
                name:'editAnswer',
                query:{
                    replyContent: this.replyInfo.replyContent,
                    quesTitle: this.questionInfo.questionTitle,
                    replyID: this.replyInfo.replyId,
                    pictureList: this.replyInfo.picture,
                    edit: true
                }
            })
        },
        /** 个人详细 */
        userDetail(){
            this.goPage('myHomepage', {respondentId:this.replyInfo.respondentId,userType:this.replyInfo.userType})
        },
        goPage(url, param) {
            this.$router.$push({
                name: url,
                query:param
            })
        },
    },
    activated(){
        let query = this.$route.query
        this.comFrom = query.comFrom || ''
        this.replyId = query.replyId;
        // 如果 有值就是 上一个页面的，否则选择缓存的
        if (this.replyId){
            localStorage.setItem('hasReplyId',this.replyId);
        } else {
            this.replyId = localStorage.getItem('hasReplyId');
        }
        this.getAnswersMethod();
    },
    deactivated(){
        this.hidePic();
    }
}
</script>
