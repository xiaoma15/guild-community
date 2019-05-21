<style lang="less" scoped>
@import "../assets/style/pages/myFans";
</style>
<style>
.fansPhoto img{
    height: 100% !important;
}
</style>
<template>
  <div class="myFans_page">
    <v-header title="我的粉丝"></v-header>

    <div class="myFansContent">
      <scroller
        ref="scroller"
        class="my-scroller"
        :pullDown="true"
        @pullDown="downLoading()"
        :pullUp="page.isMore"
        @pullUp="upLoading()"
      >
        <div class="myFans-box">
          <div class="block bd-bottom" v-for="(item, index) in list" :key="index">
            <div class="block-left">
              <div class="fansPhoto" @click="userDetail(item)">
                <img :src="renderHeadPic(item.respondentId)" alt="">
              </div>
              <div>
                <div>
                  <span class="fansName">{{item.employeeName}}</span>
                </div>
                <div class="fansInfo">
                  <span>粉丝 {{item.fansNum}}</span>
                  <span>回答 {{item.replyNum}}</span>
                  <span>点赞 {{item.praiseNum}}</span>
                </div>
              </div>
            </div>
            <div class="block-right">
              <!-- <div class="concernButton" @click="addAttenion(item)">
                <i class="icon-guanzhu iconfont"></i>{{changeStaus(item.attentionStat)}}
              </div> -->
              <!-- <div class="payAttentionButton">互相关注</div> -->
                <div class="concernButton"  @click="addAttenion(item)" v-if="item.attentionStat == 0"><i class="icon-guanzhu iconfont"></i>关注</div>
                <div class="payAttentionButton"  @click="addAttenion(item)" v-if="item.attentionStat == 2">互相关注</div>
            </div>
          </div>
        </div>
      </scroller>
    </div>

    <div class="no_data" v-show="notResouce && list.length == 0">
        <img class="no_data_img" src="../assets/img/no-data.png" alt="">
        <div class="no_data_content">暂无数据哦~</div>
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
        organizationId: '', //事业部id
        objId: '', //问题id
        userType: '', //[题主类型](10: 导购  40:业务员)
        isAttention: false
    };
  },
  methods: {
    // 下拉刷新
    downLoading() {
      this.page.pageNum = 1;
      this.list = [];
      this.myFansMethod();
    },
    // 上拉刷新
    upLoading() {
        if(this.page.pageNum==1) return false;
        this.myFansMethod();
    },
    // 加关注
    addAttenion(val){
        let param = {
            organizationId: val.organizationId,
            attentionType: '1',
            userType: val.userType,
            objId: val.respondentId,
        }
        this.$showLoading();
        this.$store.dispatch('attentionThings',param).then(rep=>{
            this.$hideLoading();
             if (rep.retcode == 'SUCC') {
                this.$toast(rep.errmsg)
                if(rep.errmsg == '关注成功!') {
                    this.list = this.list.map(item => {
                        if(item == val){
                            item.attentionStat = 2;
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
        },e=>{
             this.$hideLoading();
             this.$toast(e);
        })
    },
    /** 我的粉丝 */
    myFansMethod() {
      this.$showLoading();
      let param = {
        organizationId: "",
        listType: "2",
        page:this.page.pageNum,
        limit:this.page.pageSize
      };
      this.$store.dispatch("getAttentionUserList", param).then(
        rep => {
          console.log(rep);
          this.$hideLoading();
          if (rep.retcode == "SUCC"  && rep.attentionList && rep.attentionList.length) {
            this.notResouce = false;
            if (this.page.pageNum === 1) {
              this.list = [];
            }
            if (rep.attentionList && rep.attentionList.length < this.page.pageSize) {
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
            this.$toast("获取数据失败,请稍后再试！");
          }
        },
        e => {
          this.$hideLoading();
          this.$toast(e);
        }
      );
    },
     /** 个人详细 */
    userDetail(value){
        this.goPage('myHomepage', {respondentId:value.respondentId,userType:value.userType})
    },
    goPage(url, param) {
        this.$router.$push({
            name: url,
            query: param
        })
    },
  },
  activated() {
    this.downLoading();
  }
};
</script>
