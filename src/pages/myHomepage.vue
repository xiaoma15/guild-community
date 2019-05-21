<style lang="less" scoped>
@import '../assets/style/pages/myHomepage';
</style>

<template>
    <div class="myHomepage_page">
        <div class="myHomepageHeader">
            <div class="header-box">
                <div  class="header-back" @click="goBack">
                    <i class="icon-back iconfont"></i>
                </div>
                <div class="header-title">
                    {{currentUserInfo.isMine == 1?'我':'他'}}的主页
                </div>
            </div>

            <div class="header-person">
                <div class="heder-left">
                    <div class="person-img">
                        <img :src="renderHeadPic(currentUserInfo.respondentId)" alt="">
                    </div>
                    <div class="person-info">
                        <p class="person-name">{{currentUserInfo.employeeName}}</p>
                        <p v-if="currentUserInfo.organizationId">（{{currentUserInfo.organizationId | orgFilter}}）</p>
                    </div>
                </div>

                <div class="header-right" v-if="currentUserInfo.isMine!=1">
                    <div class="concernButton" @click="addAttenion(currentUserInfo)" v-if="currentUserInfo.attentionStat == 0"><i class="icon-guanzhu iconfont"></i>关注</div>
                    <div class="concernButton" @click="addAttenion(currentUserInfo)" v-if="currentUserInfo.attentionStat == 1">已关注</div>
                    <div class="concernButton" v-if="currentUserInfo.attentionStat == 2">互相关注</div>
                </div>
            </div>
        </div>

        <div class="myHomepageContent">
            <div class="square-detail">
                <div class="squre-item">
                    <p class="num ">{{currentUserInfo.attentionNum}}</p>
                    <p class="numName">粉丝</p>
                    <div class="bd-right"></div>
                </div>
                <div class="squre-item ">
                    <p class="num">{{currentUserInfo.replyNum}}</p>
                    <p class="numName">回答</p>
                    <div class="bd-right"></div>
                </div>

                <div class="squre-item ">
                    <p class="num">{{currentUserInfo.praiseNum}}</p>
                    <p class="numName">点赞</p>
                </div>
            </div>

            <div class="nav-tab">
                <div class="list_item" :class="{'actived': navIndex == index}" v-for="(item, index) in navList" :key="index" @click="changeTabs(item, index)">
                    {{item.itemName}}
                </div>
            </div>

            <div class="myHome-box">
                <div class="communicationBox">
                    <scroller ref="scroller" class="my-scroller"  :pullDown="true" @pullDown="downLoading()" :pullUp="page.isMore" @pullUp='upLoading()'>
                        <div class="block" v-for="(item, index) in list" :key="index">
                            <div class="block-status" v-if="item.adoptionStat=='1'">
                                <img src="../assets/img/caina.png" alt="">
                            </div>
                            <div class="block-header">
                                <div>
                                    <span class="photo" v-if="item.isAnonymous">
                                        <img :src="renderHeadPic(item.employeeId)" alt="">
                                    </span>
                                    {{item.isAnonymous?currentUserInfo.employeeName:'匿名'}}{{ item.dynamicType | dynamicTFilter}}
                                </div>
                                <div>{{item.dynamicTime | formaTime}}</div>
                            </div>
                            <div class="block-content">
                                <div class="title"><i>{{item.issuesTag}}</i> {{item.questionTitle}}</div>
                                <div class="discount">
                                    {{item.replyContent}}
                                </div>
                            </div>
                            <div class="block-footer">
                                <span><i class="iconfont icon-pinglunxiaoliebiaoye "></i>评论({{item.commentNum}})</span>
                                <span><i class="iconfont icon-dianzanxiao-liebiaoye1 "></i>点赞({{item.praiseNum}})</span>
                            </div>
                        </div>
                    </scroller>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            navList: [
                {itemName:'全部', actived: true, type: 0},
                {itemName:'回复', actived: false, type: 2},
                {itemName:'点赞', actived: false, type: 3},
                {itemName:'提问', actived: false, type: 1}
            ],
            dacType: 0,
            navIndex: 0,
            page: {
                isMore: true,
                pageSize: 10,
                pageNum: 1
            },
            list: [],
            currentUserInfo: {},
            notResouce: false,
        }
    },
    methods: {
        goBack() {
            this.$router.push('community')
        },
        downLoading(){
            this.page.pageNum = 1
            this.list = []
            this.getAidUserDetail();
        },
        upLoading(){
            this.getAidUserDetail();
        },
        //切换tab
        changeTabs(item, idx){
            console.log('点击了：',item,idx);

            this.dacType = item.type;
            this.navIndex = idx
            // 调用接口
            // this.getAidUserDetail();
            this.downLoading();
        },
        //查询用户详情（getAidUserDetail）
        getAidUserDetail() {
            let params = {
                organizationId: '10',
                respondentId: this.respondentId,
                userType: this.userType,
                page: this.page.pageNum,
                limit: this.page.pageSize,
                dynamicType:this.dacType
            }
            this.$showLoading();
            this.$store.dispatch('getAidUserDetail', params).then(rep => {
                this.$hideLoading();
                if (rep.retcode == 'SUCC') {
                    this.currentUserInfo = rep.userInfo
                }
                if (rep.retcode == 'SUCC' && rep.dynamicList && rep.dynamicList.length) {
                    this.notResouce = false;
                    if (this.page.pageNum == 1) {
                        this.list = [];
                    }
                    if ((rep.dynamicList && rep.dynamicList.length < this.page.pageSize)) {
                        this.page.isMore = false;
                    } else {
                        this.page.isMore = true;
                        this.page.pageNum++;
                    }
                    this.list = this.list.concat(rep.dynamicList);
                    this.$nextTick(() => {
                        this.$refs.scroller.refresh();
                    });
                } else {
                    if (this.page.pageNum == 1) {
                        this.notResouce = true;
                    }
                    console.log(rep.errmsg || 'getAidUserDetail接口返回失败！')
                }
            }).catch(e => {
                this.$hideLoading();
                this.$toast(e || '网络出小差，请稍后重试！')
            })
        },
         //加关注
        addAttenion(val){
            console.log(val)
            this.organizationId = val.organizationId
            this.userType = val.userType
            this.objId = val.respondentId
            this.attentionThings();
        },
        //调用接口关注
        attentionThings() {
            let params = {
                organizationId: this.organizationId,
                attentionType: '1',
                userType: this.userType,
                objId: this.objId
            }
            this.$showLoading();
            this.$store.dispatch('attentionThings', params).then(rep => {
                this.$hideLoading();
                if (rep.retcode == 'SUCC') {
                    this.$toast(rep.errmsg)
                    if(rep.errmsg == '关注成功!'){
                        this.currentUserInfo.attentionStat = 1
                    }
                    if(rep.errmsg == '取消关注成功!'){
                        this.currentUserInfo.attentionStat = 0
                    }
                } else {
                    console.log(rep.errmsg || 'attentionThings接口返回失败！')
                }
            }).catch(e => {
                this.$hideLoading();
                this.$toast(e || '网络出小差，请稍后重试！')
            })
        },
    },
    activated() {
        let query = this.$route.query
        this.respondentId = query.respondentId
        this.userType = query.userType
        console.log('userType',this.userType);

        // this.getAidUserDetail();
        this.downLoading();
    },
    beforeRouteLeave (to, from, next) {
        this.navList = [
                {itemName:'全部', actived: true, type: 0},
                {itemName:'回复', actived: false, type: 2},
                {itemName:'点赞', actived: false, type: 3},
                {itemName:'提问', actived: false, type: 1}
            ];
        this.navIndex = 0;
        this.currentUserInfo = {};
        next();
    }
}
</script>
