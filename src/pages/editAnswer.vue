<style lang="less" scoped>
@import '../assets/style/pages/editAnswer';
</style>
<style lang="less" scoped>
textarea{
    text-align: left;
}

i.icon-chax1{
    font-size: 11px !important;
}
</style>

<template>
    <div class="editAnswer_page">
        <div class="myHomepageHeader">
            <div class="header-box bd-bottom">
                <div  class="header-back" @click="goBack">
                    <i class="icon-chax1 iconfont"></i>
                </div>
                <div class="header-title">
                    {{quesTitle}}
                </div>
            </div>
        </div>
        <!-- :rows="1" -->
        <div class="editAnserContent">
            <out-input
            class="editDiv"
            :full="true"
            v-model="checkHtml"
            :max="300"
            placeholder="请填写回答内容…"
          ></out-input>

            <div class="invoicePhoto" v-if="showPicData.length">
                <div class="img_item_box" :class="{'no_mr':(index==showPicData.length-1)}"
                        v-for="(item, index) in showPicData" :key="index" @click.prevent="showTackPic(item, index)"
                        v-if="showPicData.length>0">
                    <img class="img_item" :src="item" alt="">
                    <span class="del_icon_box" @click.prevent.stop="delImg(item, index)">
                    <img src="../assets/img/delete.png" class="del_icon" alt="">
                </span>
                </div>
                <div class="invoicePhoto-item" :class="{'ml-0':(showPicData.length<1)}"
                        v-if="showPicData.length < 3"  @click="addPhoto">
                    <i class="icon_add icon-tianjiax iconfont"></i>
                </div>
            </div>
        </div>

        <div class="editAnserFooter bd-top">
            <div class="footer-left">
                <div class="selectIcon" @click="getAnonymous" :class="{'line-40': isAnonymous}">
                    <img src="../assets/img/checked.png" alt="选中" class="checked-img"
                            v-if="isAnonymous">
                    <i class="icon-quanx iconfont checked-img" v-else></i>
                </div>
                <span>开启匿名</span>
                <div class="select-icon" @click="addPhoto">
                    <img src="../assets/img/photo.svg" class="checked-img" alt="">
                </div>
            </div>

            <div class="footer-right">
                <div class="closeButton" @click="pulishAnswer">发布</div>
            </div>

        </div>



        <!-- 拍照选择 -->
        <show-tack-pic
            :class="{'tackPicture_style':showDialog}"
            :showDialog="showDialog"
            :pictureNum="pictureNum"
            @on-cancel="cancelBottom"
            @cancel-tack="cancelTack"
            @tackPicture="tackPicture">
        </show-tack-pic>
        <!-- 拍照选择 -->

        <picture-preview
            :show="showInvoice"
            @on-hide="closePreview"
            :list="showPicData"
            :index="showIndex"
            :onlyLook="true">
        </picture-preview>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showInvoice: false, // 打卡预览图片
            showIndex: 0, // 预览图片索引
            showDialog: false, // 打开选择相册或者摄像头
            showPicData: [], // 照片显示数据
            pictureData: '', // 照片上报数据
            pictureNum: 0, // 图片数量
            isAnonymous: false,
            checkHtml: '',
            organizationId: '',
            questionId: '',
            replyId: '',
            quesTitle: '',
            edit: null,
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        // 处理用户取消拍照或者选择照片时的事件
        cancelTack() {
            var time = setTimeout(() => {
                this.showDialog = false;
                clearTimeout(time);
            }, 500)
        },
        // 关闭预览
        closePreview() {
            this.showInvoice = false;
        },
        // 打开预览
        showTackPic(item, ind) {
            this.showIndex = ind;
            this.showInvoice = true;
        },
        // 删除当前图片
        delImg(item, ind) {
            console.log(item)
            this.showPicData.splice(ind, 1);
            this.pictureNum = this.showPicData.length;
            this.pictureData = this.showPicData.join('mideaMmp2016').replace(/data:image\/jpeg;base64,/g, '');
        },
        // 关闭抽屉层
        cancelBottom() {
            this.pictureData = ''
            this.showDialog = false
        },
        // 添加发票
        addPhoto() {
            this.showDialog = true
        },
        // 拍照或者选择图片的回调
        tackPicture(picStr) {
            this.showDialog = false;
            this.$hideLoading();
            this.showPicData = this.showPicData.concat(picStr.split('mideaMmp2016'));
            this.pictureNum = this.showPicData.length;
            this.pictureData = this.showPicData.join('').replace(/data:image\/jpeg;base64,/g, 'mideaMmp2016');
            if(new RegExp("^(http://10.16).*$").test(this.pictureData)) {
                this.pictureData = this.showPicData.join('').replace(/http:/g, 'mideaMmp2016http:').replace(/data:image\/jpeg;base64,/g, 'mideaMmp2016')
            }
            this.pictureData = this.pictureData.substring(12); // 去掉首个'mideaMmp2016'
        },
        //是否匿名
        getAnonymous(){
            this.isAnonymous = !this.isAnonymous
        },
        //回复问题
        replyQuestion() {
            let params = {
                organizationId: this.organizationId,
                questionId: this.questionId,
                replyType: '1',
                replyContent: this.checkHtml,
                picture: this.pictureData,
                isAnonymous:this.isAnonymous?'1':'0', // 是否匿名(0:否 1:是)
            }
            this.$showLoading();
            this.$store.dispatch('replyQuestion', params).then(rep => {
                this.$hideLoading();
                if (rep.retcode == 'SUCC') {
                    this.$toast(rep.errmsg)
                    setTimeout(() => {
                        this.goBack();
                    }, 2000)
                } else {
                    console.log(rep.errmsg || 'replyQuestion接口返回失败！')
                }
            }).catch(e => {
                this.$hideLoading();
                this.$toast(e || '网络出小差，请稍后重试！')
            })
        },
        //编辑问题
        editReply() {
            let params = {
                organizationId: this.organizationId,
                replyId: this.replyId,
                replyType: '2',
                replyContent: this.checkHtml,
                picture: this.pictureData,
                isAnonymous:this.isAnonymous?'1':'0', // 是否匿名(0:否 1:是)
            }
            console.log(params)
            this.$showLoading();
            this.$store.dispatch('replyQuestion', params).then(rep => {
                this.$hideLoading();
                if (rep.retcode == 'SUCC') {
                    this.$toast(rep.errmsg)
                    this.storage.remove('answersDetailPic')
                    setTimeout(() => {
                        this.goBack();
                    }, 2000)
                } else {
                    console.log(rep.errmsg || 'replyQuestion接口返回失败！')
                }
            }).catch(e => {
                this.$hideLoading();
                this.$toast(e || '网络出小差，请稍后重试！')
            })
        },
        //校验
        pulishAnswer() {
            if(!this.checkHtml) return this.$toast('亲，您还没有填写回答内容哦！')
            if(this.edit){
                this.editReply();
            } else {
                this.replyQuestion();
            }
        }
    },
    activated() {
        let currentOrg = this.storage.get('organization')
        this.organizationId = currentOrg[0].baseDataId
        let query = this.$route.query
        this.questionId = query.quesID
        this.replyId = query.replyID
        this.quesTitle = query.quesTitle
        this.edit = query.edit
        if(this.edit){ //编辑的时候，不修改图片，是一个http路劲的图片数组，加mideaMmp2016分割
            this.showPicData = query.pictureList
            this.pictureNum = this.showPicData.length
            this.pictureData = this.showPicData.join('').replace(/http:/g, 'mideaMmp2016http:').substring(12)
        }
        this.checkHtml = query.replyContent
    },
    beforeRouteLeave (to, from, next) {
        this.showIndex = 0, // 预览图片索引
        this.showPicData = [], // 照片显示数据
        this.pictureData = '', // 照片上报数据
        this.pictureNum = 0, // 图片数量
        this.isAnonymous = false,
        this.checkHtml = '',
        this.organizationId = '',
        this.questionId = '',
        this.replyId = '',
        this.quesTitle = '',
        this.edit = null,
        next();
    },
}
</script>
