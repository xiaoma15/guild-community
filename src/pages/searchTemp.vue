<style lang="less" scoped>
@import "../assets//style/pages/searchTemp";
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
              v-model.trim="condition"
              @keyup.prevent.stop="searchWord($event,condition)"
              :class="{'col-333': condition}"
              ref="onInput"
            >
            <i class="iconfont icon-chax" v-if="condition.length" @click.prevent.stop="clear"></i>
          </div>
        </div>
      </div>
      <div slot="right" class="right" @click="$router.back()">取消</div>
    </my-header>

    <div  class="history bd-bottom">
        <div class="history-header">
            <div class="title">历史搜索</div>
            <div class="clean-btn  iconfont icon-lajitongx" @click.stop="cleanHistory"></div>
        </div>
        <div v-if="searchHistory.length" class="history-content">
            <div v-for="(item,idx) in searchHistory" :key='idx' >
                <div class="history_item">
                    <span @click="toSearchPage(item)">{{item}}</span>
                    <i class="iconfont icon-chax" @click.prevent.stop="clearSearchHistory(item)"></i>
                </div>
            </div>
        </div>
        
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      condition:'',
      placeholder: "输入关键词搜索",
      timer:null,
      searchHistory: []
    };
  },

  methods: {
    cleanHistory(){
      this.searchHistory = [];
      localStorage.removeItem('searchHistory');
    },

    //点击历史记录去到搜索页
    toSearchPage(keyword){
      this.$router.push({path : 'searchKeyWord',query : {keyword}});
    },


    //跳转搜索结果页
    searchWord(e, keyword) {

      if(e.keyCode == 13 && keyword != ''){

          //存入缓存,且只存入5个最新搜索记录
          if( this.searchHistory.indexOf(keyword) == -1){
              this.searchHistory.unshift(keyword);
              this.searchHistory = this.searchHistory.filter((item,idx) => {
                  return idx < 5;
              })
              localStorage.setItem('searchHistory',this.searchHistory);
          }

          console.log("temp",keyword);
          
          this.$router.replace({path : 'searchKeyWord',query : {keyword}});
      }
    },

    clear() {
      this.condition = "";
    },

    clearSearchHistory(keyword){
       this.searchHistory = this.searchHistory.filter(item => {
           return item != keyword
       })
       localStorage.setItem('searchHistory',this.searchHistory);
    }

  },

    //跳转聚焦,获取历史查询记录
    activated() {
        
        let searchStr = localStorage.getItem("searchHistory");
        if(searchStr){
            this.searchHistory = searchStr.split(',');
        }else{
            this.searchHistory = [];
        }
        this.$refs.onInput.focus();
    },

    deactivated(){
      this.condition = '';
    },

    

};
</script>

