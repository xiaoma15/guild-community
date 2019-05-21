<template>
    <div>
        <confirm :show="confirmObj.show"
                 :stressTxt="confirmObj.confirmText"
                 :showImg="false"
                 :onlySure="true"
                 @on-confirm="exit">
        </confirm>
    </div>
</template>
<script>

import {api} from '../store/api';
import ajax from '../store/ajax'
import {ccsInstance} from '../store/ajax';
// 平台资料
import platform from '../platform/index.js'
import { storage ,methods} from '../js/common'
import { mapActions, mapGetters } from 'vuex'

export default {
    data(){
        return{
             confirmObj: {
                show: false,
                confirmText: '网络出小差，请稍后重试！'
            },
        }
    },
    created () {
        this.$showLoading();
        //请求（初始化）拿到用户信息
        this.initPlatform().then(()=>{
            console.log(0)
            ajax.setDefault();
        }).then(()=>{
            console.log(1)
            // 业务员身份校验
            // this.addBurialPoint();
            return this.getBaseDataNew();
        }).then(() => {
            this.$router.$replace({path:'/community'});
            document.addEventListener('deviceready',()=>{
                platform.getExtra(["com.midea.msd.guideCommunity"]).then((data) => {
                    console.log("跳转问题详情",data.extra);
                    switch (data.extra.action) {
                        case 'interactiveForumAdoption': //回答被采纳 --- 回答详情
                            this.$router.$replace({ // 参数replyId
                                name: "answersDetail",
                                query: {
                                    replyId: data.extra.id,
                                    comFrom: data.extra.comFrom,
                                    bookId: data.extra.bookId
                                }
                            });
                            break;
                        case 'interactiveForumReply': //回复有了新评论 -- 全部评论
                            this.$router.$replace({ // 参数replyId
                                name: "allCommont",
                                query: {
                                    replyId: data.extra.id,
                                    comFrom: data.extra.comFrom,
                                    bookId: data.extra.bookId
                                }
                            });
                            break;
                        case 'interactiveForumQuestion':  //问题有了新回复--- 问题详情
                            this.$router.$replace({ // 参数replyId
                                name: "answersDetail",
                                query: {
                                    replyId: data.extra.id,
                                    comFrom: data.extra.comFrom,
                                    bookId: data.extra.bookId
                                }
                            });
                            break;
                        default:
                            this.$router.$replace({path:'/community'});
                            break;
                    }
                })
            })
        })
        .catch(e=>{
             this.$hideLoading();
             this.confirmObj.show = true;
             this.confirmObj.confirmText = e ? e : '网络出小差，请稍后重试！';
        })
    },
    methods: {
        ...mapActions([
            'addBurialPoint',
            'getBaseData'
        ]),
        // 退出
        exit() {
            platform.exit();
        },
        // 埋点跟踪
        // addBurialPoint() {
        //     console.log('埋点')
        //     return new Promise((resolve, reject) => {
        //         let param = {
        //             functionPoint: 'FUC00017'
        //         };
        //         this.$store.dispatch('addBurialPoint', param).then(data => {
        //             if (data.retcode == 'SUCC') {
        //                 console.log('埋点成功！')
        //             } else {
        //                 console.log(data.errmsg)
        //             }
        //         }).catch(e => {
        //             console.log(e.errmsg);
        //         });
        //     })
        // },

        /** 获取用户信息 */
        async initPlatform(){
            return new Promise((resolve, reject) =>{
                console.log('init')
                if($conf.isPcTest) {
                    var hadBaseInfo = storage.get('baseInfo.user') ? storage.get('baseInfo.user') : '';
                    if (hadBaseInfo.uid != $conf.fakeUser.user.uid) {
                        storage.clear();
                        storage.set('baseInfo', {user: $conf.fakeUser.user, device:$conf.fakeUser.device});
                    };
                    resolve();
                    } else {
                        // 获取用户信息
                        document.addEventListener('deviceready', function () {
                            platform.setBounces(0);
                            Promise.all([platform.getUser(), platform.getDeviceInfo(),platform.webview()]).then(rep => {
                                console.log(rep)
                                rep[0].uid = rep[0].uid.split("@")[0];
                                var hadBaseInfo = storage.get('baseInfo.user') ? storage.get('baseInfo.user') : '';
                                if (hadBaseInfo.uid != rep[0].uid) {
                                    storage.clear();
                                    storage.set('baseInfo', {user: rep[0], device: rep[1]});
                                    storage.set('clientSize',rep[2]);
                                };
                                resolve();
                            })
                        }, false);
                    }
            })
        },

        getBaseDataNew() {
            return new Promise((resolve, reject) => {
                var curTime = new Date();
                var y = curTime.getFullYear()
                var m = (curTime.getMonth() + 1) > 9 ? (curTime.getMonth() + 1) : '0' + (curTime.getMonth() + 1);
                var d = curTime.getDate() > 9 ? curTime.getDate() : '0' + curTime.getDate();
                var hh = curTime.getHours() > 9 ? curTime.getHours() : '0' + curTime.getHours();
                var mm = curTime.getMinutes() > 9 ? curTime.getMinutes() : '0' + curTime.getMinutes();
                var ss = curTime.getSeconds() > 9 ? curTime.getSeconds() : '0' + curTime.getSeconds();
                var firstTime = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
                let updateTime = this.storage.get('updateTime') ? this.storage.get('updateTime').updateTime : firstTime;
                this.$store.dispatch('getBaseData', {updateTime: updateTime}).then(rep=>{
                    this.$hideLoading();
                    if(rep) {
                        storage.set('updateTime', {updateTime: rep.replyTime});
                        console.log(rep[51])
                        if (rep.hasOwnProperty("12")) {
                            let tempArr = []
                            rep[12].forEach(item => {
                                if(item.baseDataId != '19'){
                                    tempArr.push(item)
                                }
                                this.$set(item, 'checked', false)
                            });
                            storage.set('organization', tempArr);
                        }
                        if (rep.hasOwnProperty("51")) {
                            storage.set('questionSign', rep[51]);
                        }
                        return resolve()
                    } else {
                        reject(rep.errmsg);
                    }
                }).catch(err=> {
                    console.error(err)
                    throw(err || '获取用户基本信息异常')
                })
            })
        },
    }
}
</script>
