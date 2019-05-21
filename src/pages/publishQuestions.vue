<style lang="less" scoped>
@import '../assets/style/pages/publishQuestions';
</style>

<template>
    <div class="publishQuestions_page">
        <v-header title="发布提问"></v-header>

        <div class="publishQuestionsContent">
            <div class="item-box">
                <div>标题<span>*</span></div>
            </div>
            <div class="wordCount bd-bottom">
                <textarea
                    placeholder="请输入标题"
                    class="wordCount-area wordCount-note"
                    maxlength="50"
                    :class="{'font_col':questionsTitle}"
                    v-model.trim="questionsTitle">
                </textarea>
                <span class="wordwrap"><span class="word">{{questionsTitle.length}}</span>/50</span>
            </div>

            <div class="item-box">
                <div>描述内容<span>*</span></div>
            </div>
            <div class="wordCount bd-bottom">
                <textarea
                    placeholder="请输入详细问题描述"
                    class="wordCount-area wordCount-note"
                    maxlength="300"
                    :class="{'font_col':note}"
                    v-model.trim="note">
                </textarea>
                <span class="wordwrap"><span class="word">{{note.length}}</span>/300</span>
            </div>
            <!-- 如果只有一个事业部默认显示  <i class="iconfont icon-back rotate180"></i>-->
            <div class="item-box bd-bottom" v-if="orgList.length == 1">
                <div>事业部<span>*</span></div>
                <div class="item-sele font_col"> {{orgList[0].baseDataName}}</div>
            </div>

            <div class="item-box bd-bottom"  v-else @click="showMuiltple(type=1)">
                <div>事业部<span>*</span></div>
                <div class="item-sele" :class="{'font_col': orgName}">{{orgName?orgName:'请填写事业部'}}<i class="iconfont icon-back rotate180"></i></div>
            </div>
            <div class="item-box bd-bottom"  @click="showMuiltple(type=2)">
                <div>问题标签<span>*</span></div>
                <div class="item-sele" :class="{'font_col': signName}">{{signName?signName:'请选择问题标签'}}<i class="iconfont icon-back rotate180"></i></div>
            </div>
            <div class="item-box bd-bottom">
                <div>是否匿名</div>
                <div class="item-sele">
                    <my-switch @confirmSwitch="confirmSwitch"></my-switch>
                </div>
            </div>

            <div class="item-box">
                <div>照片（最多3张）</div>
            </div>

            <div class="invoicePhoto bd-bottom">
                <div class="img_item_box" :class="{'no_mr':(index==showPicData.length-1)}"
                        v-for="(item, index) in showPicData" :key="index" @click.prevent="showTackPic(item, index)"
                        v-if="showPicData.length>0">
                    <img class="img_item" :src="item" alt="">
                    <span class="del_icon_box" @click.prevent.stop="delImg(item, index)">
                    <!-- <i class="del_icon icon-chax iconfont"></i> -->
                    <img src="../assets/img/shanchu.png" class="del_icon" alt="">
                </span>
                </div>
                <div class="invoicePhoto-item" :class="{'ml-0':(showPicData.length<1)}"
                        v-if="showPicData.length < 3" @click="addInvoice">
                    <i class="icon_add icon-tianjiax iconfont"></i>
                </div>
            </div>
        </div>
        <div class="publishQuestionsFooter bd-top" @click="publishQuestions">
            <div class="submitButton">提交</div>
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
        <!-- 图片选择 -->
        <picture-preview
            :show="showInvoice"
            @on-hide="closePreview"
            :list="showPicData"
            :index="showIndex"
            :onlyLook="true">
        </picture-preview>
        <!-- 标签选择 -->
        <multiple-choice
            :show="showMultiple"
            :title="title"
            :multipleChoiceArray="multipleChoiceArray"
            @cancelModal="cancelModal"
            @comfirmSelect="comfirmSelect">
        </multiple-choice>
    </div>
</template>

<script>
import platform from '../platform/index'
import { mapActions, mapGetters } from 'vuex'

export default {
    data() {
        return {
            questionsTitle: '', //标题
            note: '', //描述内容
            orgID: '', //事业部id
            signQue: '', //问题标签
            signId: '', //标签id
            showInvoice: false, // 打卡预览图片
            showIndex: 0, // 预览图片索引
            showDialog: false, // 打开选择相册或者摄像头
            showPicData: [], // 照片显示数据
            pictureData: '', // 照片上报数据
            pictureNum: 0, // 图片数量
            switchModel: false, //开关状态
            showMultiple: null, // 是否显示组件
            title: '',
            muiltType: null,
            multipleChoiceArray: [], // 标签list
            orgShow: true,
            orgList: [],
            orgName: null,
            signShow: true,
            signObj: {},
            signList: [{itemName: '销售技巧', checked: false},{itemName: '产品卖点', checked: false}],
            signName: null, // 问题标签
        }
    },
    methods: {
        ...mapActions([
            "raiseQuestion"
        ]),
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
            this.showPicData.splice(ind, 1);
            this.pictureNum = this.showPicData.length;
            this.pictureData = this.showPicData.join('').replace(/data:image\/jpeg;base64,/g, 'mideaMmp2016');
            this.pictureData = this.pictureData.substring(12); // 去掉首个'mideaMmp2016'
        },
        // 关闭抽屉层
        cancelBottom() {
            this.pictureData = ''
            this.showDialog = false
        },
        // 添加图片
        addInvoice() {
            this.showDialog = true
        },
        // 拍照或者选择图片的回调
        tackPicture(picStr) {
            this.showDialog = false;
            this.$hideLoading();
            this.showPicData = this.showPicData.concat(picStr.split('mideaMmp2016'));
            this.pictureNum = this.showPicData.length;
            this.pictureData = this.showPicData.join('').replace(/(data:image\/jpeg;base64,)(http)/g, 'mideaMmp2016');
            this.pictureData = this.pictureData.substring(12); // 去掉首个'mideaMmp2016'
        },
        //选择标签
        cancelModal() {
            this.showMultiple = false
        },
        showMuiltple(type){
            if(this.orgList.length != 1) {
                if(!this.orgName &&  type != 1) {
                    this.$toast('请先选择事业部！')
                    return false
                }
                this.muiltType = type
                if(type == 2) {
                    this.showMultiple = this.signShow
                    this.title = '请选择问题标签'
                    this.multipleChoiceArray = this.signList
                } else {
                    this.showMultiple = this.orgShow
                    this.title = '请选择事业部'
                    this.multipleChoiceArray = this.orgList
                }
            } else {
                if(type == 2) {
                    this.orgID = this.orgList[0].baseDataId
                    this.muiltType = type
                    this.showMultiple = this.signShow
                    this.title = '请选择问题标签'
                    this.multipleChoiceArray = this.signObj[this.orgList[0].baseDataId]
                }
            }
        },
        comfirmSelect(selItem) {
            this.multipleChoiceArray.forEach(ele => {
                ele.checked = false
            });
            this.multipleChoiceArray[selItem.idx].checked = true
            // 事业部
            if(this.muiltType == 1){
                this.orgName = selItem.infoItem.baseDataName
                this.orgID = selItem.infoItem.baseDataId
                this.signList = this.signObj[this.orgID]
                this.showMultiple = false
            }
            // 问题标签
            if(this.muiltType == 2) {
                this.signName = selItem.infoItem.basedataname
                this.signId = selItem.infoItem.basedataid
                this.showMultiple = false
            }
        },
        //开关控制
        confirmSwitch(val) {
            this.switchModel = val
        },
        //校验
        checkoutAll(){
            if(!this.questionsTitle) return this.$toast('亲，您的标题还没有填写!')
            if(!this.note) return this.$toast('亲，您的描述还没有填写!')
            if(this.orgList.length!=1 && !this.orgID) return this.$toast('亲，您还没还没有选择事业部!')
            if(!this.signName) return this.$toast('亲，您还没有选择问题标签!')
            return true
        },
        /**提问 */
        raiseQuestionMethod(){
            let params = {
                questionTitle: this.questionsTitle,
                questionDescribe:this.note,
                organizationId: this.orgID,
                issuesTag:this.signId,
                isAnonymous:this.switchModel?'1':'0', // 是否匿名(0:否 1:是)
                picture: this.pictureData
            }
            this.$showLoading();
            this.raiseQuestion(params).then(rep=>{
                this.$hideLoading();
                if (rep.retcode == 'SUCC') {
                    this.$toast('发布问题成功');
                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 2000)
                }
            }).catch(e=>{
                this.$toast(e || "网络出小差，请稍后重试！");
            });
        },
        //提交问题
        publishQuestions(){
            if(!this.checkoutAll()) return false
            this.raiseQuestionMethod();
        }
    },
    activated() {
        let org = this.storage.get('organization')
        this.orgList = org
        let queSign = this.storage.get('questionSign')
        this.signObj = queSign
    },
    beforeRouteLeave (to, from, next) {
        this.orgID = ''
        this.orgList = []
        this.signList = []
        this.questionsTitle = ''
        this.note = ''
        this.orgID = ''
        this.orgName = ''
        this.signId = ''
        this.signName = ''
        this.switchModel = false
        this.pictureData = []
        this.signObj = {}
        this.pictureNum = 0
        this.showPicData = []
        next();
    }
}
</script>
