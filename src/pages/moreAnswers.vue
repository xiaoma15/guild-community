<style lang="less" scoped>
@import '../assets/style/pages/moreAnswers';
</style>

<template>
    <div class="moreAnswers_page">
        <my-header>
            <div slot="middle" class="middleSlot">{{answerNum+'条评论'}}</div>
        </my-header>

        <div class="moreAnswersContent" v-for="(item, index) in list" :key="index">
            <div class="moreAnswers">
                <div class="left">
                    <div class="person-img" @click="goPage('myHomepage', {respondentId: item.respondentId, userType: item.userType})"></div>
                    <div class="person-info">
                        <p class="person-name">{{item.commentator}} <span class="time">{{item.commentTime | formaTime}}</span></p>
                        <p>{{item.commentContent}}</p>
                    </div>
                </div>

                <div class="right" @click="inputFun()">
                    <i class="icon-pinglunda-pinglunxiangqingye iconfont"></i>
                </div>
            </div>

            <div class="answer">
                回答({{item.commentNum}}条)
            </div>

            <div class="answers-box">
                    <div class="sub-answer">
                        <div class="moreAnswers" v-for="(items, ind) in item.subCommentList" :key="ind">
                            <div class="left">
                                <div class="person-img" @click="goPage('myHomepage', {respondentId: items.respondentId, userType: items.userType})"></div>
                                <div class="person-info">
                                    <p class="person-name special">
                                        <!-- <span class="small-img"></span> -->
                                        <span class="colorName" >{{items.commentator}}</span>回复<span class="colorName">@{{items.originalCommentator}}</span>
                                    </p>
                                    <p class="person-answer">{{items.commentContent}}</p>
                                </div>
                            </div>

                            <div class="right">
                                <span class="time">{{items.commentTime | formaTime}}</span>
                            </div>
                            <div class="bd-bottom">
                            </div>
                        </div>
                    </div>
                <!-- </scroller> -->
            </div>
        </div>

    <div class="answer-footer bd-top" v-if="!showInput" @click="inputFun(type = 1)">
            <input type="text" placeholder="请输入评论…" >
            <div class="closeButton">发布</div>
        </div>

        <bottom-input :show = 'showInput' :contentPerson = 'contentPersonName' @on-colseCurrentView='colseCurrentView'  @on-submit="commentMethod">
            <textarea class="comment" type="text" placeholder="请输入评论…" v-model="replyContent"></textarea>
        </bottom-input>
    </div>
</template>

<script>
export default {
    data() {
        return {
            answerNum: '',
            // page: {
            //     isMore: true,
            //     pageSize: 10,
            //     pageNum: 1
            // },
            list: [],
            replyId:'',//待定
            replyID:'',// 返回上个页面需要带
            isClickMessage:false, // 是否要评论
            showInput:false,
            replyContent:'',
            organizationId:'',
            contentPersonName:'' // 回复@名字

        }
    },
    methods: {
        inputFun(type, val){
            this.showInput = true;
            this.isClickMessage = false;
        },
        commentMethod(){
            this.pulishAnswer();
        },
        colseCurrentView(){
            console.log('66666666关闭 ');
            this.showInput = false
            this.isClickMessage = false;
        },
        // 下拉刷新
        downLoading() {
            this.page.pageNum = 1;
            this.list = []
            this.subList = []
            this.getCommentList();
        },
        // 上拉刷新
        upLoading() {
            this.getCommentList();
        },
         //调用接口获取所有评论列表
        getCommentList() {
            let params = {
                commentId: this.replyId,
                // page: this.page.pageNum,
                // limit: this.page.pageSize
            }
            this.$showLoading();
            this.$store.dispatch('getCommentList', params).then(rep => {
                this.$hideLoading();
                if (rep.retcode == 'SUCC' && rep.commentList && rep.commentList.length) {
                    this.list = rep.commentList

                    this.answerNum = this.list[0].subCommentList.length;

                    this.contentPersonName = this.list[0].commentator;

                } else {
                    console.log(rep.errmsg || 'getCommentList接口返回失败！')
                }
            }).catch(e => {
                this.$hideLoading();
                this.$toast(e || '网络出小差，请稍后重试！')
            })
        },

        /** 点击评论回答*/
        pulishAnswer() {
            let params = {
                organizationId: this.organizationId,
                replyContent: this.replyContent,
                commentId: this.replyId
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
        goPage(url, param) {
            this.$router.$push({
                name: url,
                query: param
            })
        },

    },
    activated() {
        this.contentPersonName = '';
        this.replyContent = '';
        let query = this.$route.query.param
        console.log(query)
        this.replyId = query.replyId //当前页面用到的评论id
        this.replyID = query.replyID // 返回到全部评论页面的回复id
        this.getCommentList();
    },
     // 点击后 回到上一个页面需要值
    beforeRouteLeave (to, from, next) {
        if (to.name === 'allCommont') {
            to.query.temp = this.replyID
        }
        next();
    },
}
</script>
