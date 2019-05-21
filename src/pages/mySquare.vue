<style lang="less" scoped>
@import '../assets/style/pages/myFans';
</style>
<style>
.fansPhoto img{
    height: 100% !important;
}
</style>

<template>
    <div class="myFans_page">
        <v-header title="用户广场"></v-header>

        <div class="myFansContent">
                <scroller ref="scroller" class="my-scroller"  :pullDown="true" @pullDown="downLoading()" :pullUp="page.isMore" @pullUp='upLoading()'>
                    <div class="myFans-box">
                        <div class="block bd-bottom" v-for="(item, index) in list" :key="index">
                            <div class="block-left">
                                <div class="fansPhoto" @click="goPage('myHomepage', {respondentId: item.employeeId, userType: item.userType})">
                                    <img :src="renderHeadPic(item.employeeId)" alt="">
                                </div>
                                <div>
                                    <div><span class="fansName">{{item.employeeName}}</span><span v-if="item.organizationId">（{{item.organizationId | orgFilter}}）</span></div>
                                    <div class="fansInfo"><span>粉丝 {{item.attentionNum || 0}}</span><span class="replySpan">回答 {{item.replyNum}}</span><span>点赞 {{item.praiseNum || 0}}</span></div>
                                </div>
                            </div>
                            <div class="block-right">
                                <div class="concernButton" @click="addAttenion(item, index)" v-if="item.attentionStat == 0"><i class="icon-guanzhu iconfont"></i>关注</div>
                                <!-- <div class="payAttentionButton" @click="addAttenion(item, index)" v-if="item.attentionStat == 1">互相关注</div> -->
                            </div>
                        </div>
                    </div>
                </scroller>

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            notResouce: false,
            page: {
                isMore: true,
                pageSize: 10,
                pageNum: 1
            },
            list: [],
            userType: '',
            objId: '',
            repMsg: ''
        }
    },
    methods: {
        // 下拉刷新
        downLoading() {
            this.page.pageNum = 1;
            // this.list = [];
            this.getUserSquareList();
        },
        // 上拉刷新
        upLoading() {
            this.getUserSquareList();
        },
        //调用接口获取数据
        getUserSquareList(){
            let params = {
                search: this.condition,
                page: this.page.pageNum,
                limit: this.page.pageSize
            }
            this.$showLoading();
            this.$store.dispatch('getUserSquareList', params).then(rep => {
                this.$hideLoading();
                console.log(rep, 111)
                if (rep.retcode == 'SUCC' && rep.userList && rep.userList.length) {
                    this.notResouce = false;
                    if (this.page.pageNum == 1) {
                        this.list = [];
                    }
                    if ((rep.userList && rep.userList.length < this.page.pageSize)) {
                        this.page.isMore = false;
                    } else {
                        this.page.isMore = true;
                        this.page.pageNum++;
                    }
                    this.list = this.list.concat(rep.userList);
                    this.$nextTick(() => {
                        this.$refs.scroller.refresh();
                    });
                } else {
                    if (this.page.pageNum == 1) {
                        this.notResouce = true;
                    }
                    console.log(rep.errmsg || 'getUserSquareList接口返回失败！')
                }
            }).catch(e => {
                this.$hideLoading();
                this.$toast(e || '网络出小差，请稍后重试！')
            })
        },
        //+关注
        addAttenion(val){
            console.log(val)
            this.userType = val.userType
            this.objId = val.employeeId
            let params = {
                attentionType: '1',
                userType: this.userType,
                objId: this.objId
            }
            this.$showLoading();
            this.$store.dispatch('attentionThings', params).then(rep => {
                this.$hideLoading();
                if (rep.retcode == 'SUCC') {
                    this.$toast(rep.errmsg);
                    if(rep.errmsg == '关注成功!') {
                        this.list = this.list.filter(item => {
                            return item != val;
                        });
                        this.downLoading();
                    } 
                    // else {
                    //     this.list = this.list.map(item => {
                    //         if(item == val){
                    //             item.attentionStat = 0;
                    //         }
                    //         return item;
                    //     });
                    // }
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
                query: param
            })
        },
    },
    activated() {
        // this.downLoading();
        this.getUserSquareList();
    }
}
</script>
