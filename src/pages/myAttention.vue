<style lang="less" scoped>
@import "../assets/style/pages/myFans";
div.concernButton{
    background: rgba(17,191,244,0.08);
    color: #11BFF4;
    box-shadow:none;
}
</style>
<style>
.fansPhoto img{
    height: 100% !important;
}
</style>
<template>
  <div class="myFans_page">
    <v-header title="我关注的人" ></v-header>

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
                  <span class="fansName">{{item.employeeName}}</span>（{{item.organizationId | orgFilter}}）
                </div>
                <div class="fansInfo">
                  <span>粉丝 {{item.fansNum}}</span>
                  <span>回答 {{item.replyNum}}</span>
                  <span>点赞 {{item.praiseNum}}</span>
                </div>
              </div>
            </div>
            <div class="block-right">
              <!-- <div class="payAttentionButton">{{item.attentionStat=='2'?"互相关注":"已关注"}}</div> -->
              <!-- <div class="concernButton"  @click="addAttenion(item)" v-if="item.attentionStat == 0"><i class="icon-guanzhu iconfont"></i>关注</div> -->
              <div class="concernButton"  @click="addAttenion(item)" v-if="item.attentionStat == 1">已关注</div>
              <div class="payAttentionButton"  @click="addAttenion(item)" v-if="item.attentionStat == 2">互相关注</div>
            </div>
          </div>
        </div>
      </scroller>
    </div>

    <div class="no_data" v-show="notResouce && !list.length">
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
      // this.list = [];
      this.myAttentionMethod();
    },
    // 上拉刷新
    upLoading() {
      if (this.page.pageNum == 1) return false;
      this.myAttentionMethod();
    },

    // 加关注
    addAttenion(val){
        console.log(val)
        this.organizationId = val.organizationId
        this.userType = val.userType || '10'
        this.objId = val.respondentId
        this.clickConcern(val);
    },
    /** 点击关注 */
    clickConcern(val) {
      console.log("关注");
      this.$showLoading();
      let param = {
        organizationId: this.organizationId,
        attentionType: "1",
        userType: this.userType,
        objId: this.objId
      };
      this.$store.dispatch('attentionThings',param).then(rep=>{
          this.$hideLoading();
            if (rep.retcode == 'SUCC') {
                  this.$toast(rep.errmsg)
                  if(rep.errmsg == '取消关注成功!'){
                    this.list = this.list.filter(item => {
                      return item != val;
                    })
                    this.downLoading();
                    // if(this.list && this.list.length == 0){
                    //   this.myAttentionMethod();
                    // }
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
    myAttentionMethod() {
      this.$showLoading();
      let param = {
        organizationId: "",
        listType:'1',
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
    userDetail(item){
        this.goPage('myHomepage', {respondentId:item.respondentId,userType:item.userType})
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
