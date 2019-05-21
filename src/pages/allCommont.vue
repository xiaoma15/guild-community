<style lang="less" scoped>
@import '../assets/style/pages/allComment';
</style>

<template>
    <div class="moreAnswers_page">
        <v-header :backFun="backFun">
            <div slot="middle" class="middleSlot" >{{'全部'+answerNum+'条评论'}}</div>
        </v-header>

        <div class="moreAnswersContent">
            <scroller ref="scroller" class="my-scroller"  :pullDown="true" @pullDown="downLoading()" :pullUp="page.isMore" @pullUp='upLoading()'>
                <div class="moreAnswerBox"  v-for="(item, index) in list" :key="index">
                    <div class="bd-bottom">
                        <div class="moreAnswers">
                            <div class="left"  @click="goPage('myHomepage', {respondentId: item.respondentId, userType: item.userType})">
                                <div class="person-img">
                                   <img :src="renderHeadPic(item.respondentId)" alt="">
                                </div>
                            </div>

                            <div class="right"  :class="{'bd-bottom': item.subCommentList}">
                                <div class="person-info">
                                    <p class="person-name">{{item.commentator}} <span class="time">{{item.commentTime | formaTime}}</span></p>
                                    <p class="person-content">{{item.commentContent}}</p>
                                </div>
                                <div class="icBox" @click="inputFun({item})">
                                    <i class="icon-pinglunda-pinglunxiangqingye iconfont" ></i>
                                </div>
                            </div>
                        </div>

                        <div class="answers-box">
                                <div class="sub-answer">
                                    <div class="" v-for="(items, ind) in item.subCommentList" :key="ind">
                                        <div v-if="ind<=2" class="moreAnswers">
                                            <div class="answers-left">
                                                <span class="small-img">
                                                    <img :src="renderHeadPic(item.respondentId)" alt="">
                                                </span>
                                            </div>

                                            <div class="answers-right bd-bottom">
                                                <div class="right">
                                                    <div class="person-info">
                                                        <p class="person-name special">
                                                            <span class="colorName" @click="originalCommentatorClick(items)">{{items.originalCommentator}}</span>回复<span @click="commentatorClick(items)" class="colorName">@{{items.commentator}}</span>
                                                        </p>
                                                    </div>
                                                    <span class="time">{{items.commentTime | formaTime}}</span>
                                                </div>

                                                <p class="person-answer">{{items.commentContent}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <!-- </scroller> -->
                        </div>

                        <div class="allAnswer" v-if="item.subCommentList" @click="$router.push({name:'moreAnswers',query:{replyId:item.commentId,replyID:replyId}})" >
                                查看全部{{item.subCommentList.length}}条评论
                        </div>
                    </div>

                </div>
            </scroller>
        </div>

        <div class="answer-footer bd-top" v-if="!showInput" @click="inputFun({replyTypeVal : 1})">
            <input type="text" placeholder="请输入评论…" >
            <div class="closeButton">发布</div>
        </div>

        <!-- <div  v-if="isClickMessage"> -->
            <bottom-input :show = 'showInput' :contentPerson = 'contentPersonName' @on-colseCurrentView='colseCurrentView'  @on-submit="commentMethod">
                <textarea  ref="textareaRef" class="comment" type="text" placeholder="请输入评论…" v-model="replyContent"></textarea>
            </bottom-input>
        <!-- </div> -->
        <div class="no_data" v-show="notResouce && !list.length">
            <img class="no_data_img" src="../assets/img/no-data.png" alt="">
            <div class="no_data_content">暂无数据哦~</div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    data() {
        return {
            notResouce: false,
            answerNum: '', //全部回复数
            page: {
                isMore: true,
                pageSize: 10,
                pageNum: 1
            },
            answerList: [],// 全部 评论数
            list: [],
            replyId: '', //回答id
            // isClickMessage:false, // 是否要评论
            organizationId:'',
            commentId:'',
            replyContent:'',
            showInput:false,
            contentPersonName:'', // 回复@名字
            replyType:'',
            focusnode:null,
            comFrom: '',
        }
    },
    methods: {
        backFun() {
            if(this.comFrom == 1) {
                this.goPage('community')
            } else {
                this.$router.go(-1);
            }
        },
        inputFun({item = null,replyTypeVal = false}){
            //区分回答类型
            if(replyTypeVal){
                this.replyType = replyTypeVal;
                 this.contentPersonName = '';
            }else{
                this.commentId = item.commentId; // 评论Id
                this.contentPersonName = item.commentator; // @ 名字
                this.replyType = '';
            }

            this.showInput = true;
            this.isClickMessage = false;

            setTimeout(() => {
                this.$refs.textareaRef.focus();
            }, 50);

        },
        commentMethod(){
            if(this.replyContent.trim() == ''){
                this.$toast("发布失败,请输入有效内容！",{duration : 1200})
            }else{
                if(this.replyType == ''){
                    this.pulishAnswer(false);
                }else{
                    this.pulishAnswer();
                }
            }
        },
        colseCurrentView(){
            this.showInput = false
            this.isClickMessage = false;
        },
        // 下拉刷新
        downLoading() {
            this.page.pageNum = 1;
            this.list = [];
            this.getCommentList();
        },
        // 上拉刷新
        upLoading() {
            this.getCommentList();
        },
        //调用接口获取所有评论列表
        getCommentList() {
            let params = {
                replyId: this.replyId,
                page: this.page.pageNum,
                limit: this.page.pageSize
            }
            this.$showLoading();
            this.$store.dispatch('getCommentList', params).then(rep => {
                this.$hideLoading();
                if(rep.retcode == 'SUCC') {
                    this.answerNum = rep.commentNum
                }
                if (rep.retcode == 'SUCC' && rep.commentList && rep.commentList.length) {
                    this.notResouce = false;
                    if (this.page.pageNum === 1) {
                        this.list = [];
                    }
                    if ((rep.commentList && rep.commentList.length < this.page.pageSize)) {
                        this.page.isMore = false;
                    } else {
                        this.page.isMore = true;
                        this.page.pageNum++;
                    }
                    this.list = this.list.concat(rep.commentList);

                    this.$nextTick(() => {
                        this.$refs.scroller.refresh();
                    });
                } else {
                    if (this.page.pageNum == 1) {
                        this.notResouce = true;
                    }
                    console.log(rep.errmsg || 'getCommentList接口返回失败！')
                }
            }).catch(e => {
                this.$hideLoading();
                this.$toast(e || '网络出小差，请稍后重试！')
            })

        },
        /** 点击评论回答*/
        pulishAnswer(isReplyContent = true) {
            let params = {};
            if(isReplyContent){
                params = {
                    organizationId: this.organizationId,
                    replyId: this.replyId, // 回答id
                    replyContent: this.replyContent,
                    replyType: this.replyType
                }
            }else{
                params = {
                    organizationId: this.organizationId,
                    replyContent: this.replyContent,
                    commentId:this.commentId
                }
            }

            this.$showLoading();
            this.$store.dispatch('replyQuestion', params).then(rep => {
                this.$hideLoading();
                if (rep.retcode == 'SUCC') {
                    this.$toast(rep.errmsg)
                    this.replyContent = ''; // 清空
                    // 刷新
                    // this.isClickMessage = false;
                    this.showInput = false;
                    this.getCommentList();

                } else {
                    console.log(rep.errmsg || 'replyQuestion接口返回失败！')
                }
            }).catch(e => {
                this.$hideLoading();
                this.$toast(e || '网络出小差，请稍后重试！')
            })
        },
        // /** 点击显示 发布评论 UI */
        // commentMessage(item){
        //     console.log('啊啊啊',item);
        //     this.showInput = true;
        //     this.isClickMessage = false;
        //     this.commentId = item.commentId; // 评论Id
        //     this.contentPersonName = item.commentator; // @ 名字
        // },
        // 点击自己
        originalCommentatorClick(items){
            this.isClickMessage = true;
            this.commentId = items.commentId;
            this.contentPersonName = items.originalCommentator; // @ 名字
        },
        // 点击别人
        commentatorClick(items){
            this.isClickMessage = true;
            this.commentId = items.originalCommentId;
            this.contentPersonName = items.commentator;// @ 名字
        },
        goPage(url, param) {
            this.$router.$push({
                name: url,
                query: param
            })
        },
    },
    activated() {


        this.focusnode = this.$refs.textareaRef;

        this.list = []; // 清空

        this.contentPersonName = '';
        this.replyContent = '';

        let query = this.$route.query
        this.comFrom = query.comFrom
        this.replyId = query.replyID || query.replyId 
        if(!this.replyId){
            this.replyId = this.$route.query.temp;
        }
        this.getCommentList();


    }
}
</script>
