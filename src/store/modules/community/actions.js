import {api} from './api';
import ajax from '../../ajax';

const actions = {
    // 埋点跟踪
    addBurialPoint ({commit}, data) {
        return ajax.post(api.addBurialPoint, data)
    },
    //角标（getAidQuesationNum）
    getAidQuestionNum ({commit}, data) {
        return ajax.post(api.getAidQuestionNum, data)
    },
    //提问（raiseQuestion）
    raiseQuestion ({commit}, data) {
        return ajax.post(api.raiseQuestion, data)
    },
    //查询我的关注（getAttentionList）
    getAttentionList ({commit}, data) {
        return ajax.post(api.getAttentionList, data)
    },
    //查询问题列表（getAidQuestionList）
    getAidQuestionList ({commit}, data) {
        return ajax.post(api.getAidQuestionList, data)
    },
    //查询问题详情（getAidDetailInfo）
    getAidDetailInfo ({commit}, data) {
        return ajax.post(api.getAidDetailInfo, data)
    },
    //回复（replyQuestion）
    replyQuestion ({commit}, data) {
        return ajax.post(api.replyQuestion, data)
    },
    //回复评论列表（getCommentList）
    getCommentList ({commit}, data) {
        return ajax.post(api.getCommentList, data)
    },
    //关注问题|题主（attentionThings）
    attentionThings ({commit}, data) {
        return ajax.post(api.attentionThings, data)
    },
    //查询用户广场列表（getUserSquareList）
    getUserSquareList ({commit}, data) {
        return ajax.post(api.getUserSquareList, data)
    },
    //查询用户详情（getAidUserDetail）
    getAidUserDetail ({commit}, data) {
        return ajax.post(api.getAidUserDetail, data)
    },
    //查询关注|粉丝列表（getAttentionUserList）
    getAttentionUserList ({commit}, data) {
        return ajax.post(api.getAttentionUserList, data)
    },
    //查询关键字（getAidSearchList）
    getAidSearchList ({commit}, data) {
        return ajax.post(api.getAidSearchList, data)
    },
};
export default actions;
