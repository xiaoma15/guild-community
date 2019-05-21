import {api} from '../api';
import ajax from '../ajax';
import { pureAjax } from '../ajax'
// import md5 from 'js-md5'
import { storage } from '../../js/common'

const state ={

};
const getters ={

};

const actions ={
    // 业务员身份校验
    getBaseData ({commit}, param) {
        return ajax.post(api.getBaseData, param).then(rep => {           
            if (rep.retcode == 'SUCC' && rep.baseData) {
                storage.set('updateTime', {updateTime: rep.replyTime});
                if (rep.baseData.hasOwnProperty("12")) {
                    rep.baseData[12].forEach(item => {
                        item.actived = false
                    })
                    commit('SET_BOOKIS', rep.baseData[12][0].baseDataId);
                    storage.set('organization', rep.baseData[12]);
                }
                return Promise.resolve(rep.baseData)
            } else {
                throw(rep.errmsg || '获取用户基础信息失败');
            }
        }).catch(err=> {
            console.error(err)
            throw(err || '获取用户基本信息失败')
        })

    },
};
const mutations ={

}
export default {
    state,
    getters,
    actions,
    mutations
}
