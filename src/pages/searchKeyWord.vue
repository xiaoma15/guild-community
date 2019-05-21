<style lang="less" scoped>
@import "../assets/style/pages/myQUestions";
</style>
<style lang="less">
input {
  font-size: 14px;
  color: #999;
  font-family: PingFangSC-Regular;
}
</style>
<template>
  <div class="myQUestions_page">
    <my-header class="my-header">
      <div slot="middle" class="middle">
        <div class="search-box">
          <div class="inputBox">
            <i class="iconfont icon-chaxunx"></i>
            <input
              type="search"
              :placeholder="placeholder"
              v-model="condition"
              @keyup.prevent.stop="searchWord($event,condition)"
              :class="{'col-333': condition}"
              ref="onInput"
            >
            <i class="iconfont icon-chax" v-if="condition.length" @click.prevent.stop="clear"></i>
          </div>
        </div>
      </div>
      <div slot="right" class="right" @click="$router.go(-2)">取消</div>
    </my-header>

    <div class="myQUestionsContent">
      <div class="detail-box">
        <div class="communicationBox">
          <scroller
            ref="scroller"
            class="my-scroller"
            :pullDown="true"
            @pullDown="downLoading()"
            :pullUp="page.isMore"
            @pullUp="upLoading()"
            style="top : 45px"
          >
            <div class="block" v-for="(item, index) in list" :key="index">
              <div class="block-status" v-if="false">
                <img src="../assets/img/caina.png" alt>
              </div>
              <div class="block-content" @click="goPage('problemDetails',{problemDetails: item.questionId})">
                <div class="title">
                  <i>{{item.issuesTag}}</i>
                  {{item.questionTitle}}
                </div>
                <div class="time">
                  <span>{{item.proposeTime}}</span>
                  <span v-if="item.respondentNum">{{item.respondentNum}}人已回答</span>
                </div>
                <div class="discount">{{item.questionDescribe}}</div>
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
      condition: "", //查询条件
      placeholder: "输入关键词搜索",
      transitionName: "",
      noAnimate: true,
      page: {
        isMore: true,
        pageSize: 10,
        pageNum: 1
      },
      list: [],
      timer: null
    };
  },
  methods: {
    // 确认搜索
    searchWord(e, val) {

      this.condition = val;
      if (e.keyCode === 13) {
        this.downLoading();
      }else{
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.downLoading();
        }, 800);
      }

    },

    //跳问题详情
    toProblemDetails(param){
          this.$router.push({
            path:'/problemDetails',
            query:param
        })
    },
    goPage(url,param){
        this.$router.$push({
            name:url,
            query: param
        })
    },
    // 取消搜索
    clear() {
      this.condition = "";
      this.downLoading();
    },

    // 下拉刷新
    downLoading() {
      this.page.pageNum = 1;
      this.list = [];
      this.getAidSearchList();
    },
    // 上拉刷新
    upLoading() {
      this.getAidSearchList();
    },
    //调用接口获取我的提问
    getAidSearchList() {
      let params = {
        search: this.condition,
        page: this.page.pageNum,
        limit: this.page.pageSize,
    }

    this.$showLoading();

    this.$store
      .dispatch("getAidSearchList", params)
      .then(rep => {
          this.$hideLoading();
          if (
            rep.retcode == "SUCC" &&
            rep.searchList &&
            rep.searchList.length
          ) {
            this.notResouce = false;
            if (this.page.pageNum === 1) {
              this.list = [];
            }
            if (
              rep.searchList &&
              rep.searchList.length < this.page.pageSize
            ) {
              this.page.isMore = false;
            } else {
              this.page.isMore = true;
              this.page.pageNum++;
            }

            this.list = this.list.concat(rep.searchList);

            this.$nextTick(() => {
              this.$refs.scroller.refresh();
            });
          } else {
            if (this.page.pageNum == 1) {
              this.notResouce = true;
            }
            console.log(rep.errmsg || "getAidSearchList接口返回失败！");
          }
        })
        .catch(e => {
          this.$hideLoading();
          this.$toast(e || "网络出小差，请稍后重试！");
        });
    }
  },
  activated() {
    this.$refs.onInput.focus();
    // this.downLoading();
    //获取查询关键字
    let {keyword} = this.$route.query;
    
    console.log("searchkey",keyword);

    if(this.condition == '' && keyword){
      this.condition = keyword;
    }

    this.downLoading();

  }
};
</script>

