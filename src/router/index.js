const init = resolve => require(['../pages/init.vue'], resolve);
const community = resolve => require(['../pages/communityHome.vue'], resolve);
const askMeQuestions = resolve => require(['../pages/askMeQuestions.vue'], resolve);
const myAnswers = resolve => require(['../pages/myAnswers.vue'], resolve);
const myQuestions = resolve => require(['../pages/myQuestions.vue'], resolve);
const myFans = resolve => require(['../pages/myFans.vue'], resolve);
const myAttention = resolve => require(['../pages/myAttention.vue'], resolve);
const mySquare = resolve => require(['../pages/mySquare.vue'], resolve);
const publishQuestions = resolve => require(['../pages/publishQuestions.vue'], resolve);
// const myProblemDetails = resolve => require(['../pages/myProblemDetails.vue'], resolve);
const problemDetails = resolve => require(['../pages/problemDetails.vue'], resolve);
const answersDetail = resolve => require(['../pages/answersDetail.vue'], resolve);
const myHomepage = resolve => require(['../pages/myHomepage.vue'], resolve);
const editAnswer = resolve => require(['../pages/editAnswer.vue'], resolve);
const allCommont = resolve => require(['../pages/allCommont.vue'], resolve);
const moreAnswers = resolve => require(['../pages/moreAnswers.vue'], resolve);

const searchKeyWord = resolve => require(['../pages/searchKeyWord.vue'], resolve);
const searchTemp = resolve => require(['../pages/searchTemp.vue'], resolve);


let routes = [{
    path: '/',
    component: init,
    name: 'init'
},{
    path: '/community',
    component: community,
    name: 'community'
},{
    path: '/askMeQuestions',
    component: askMeQuestions,
    name: 'askMeQuestions'
},{
    path: '/myAnswers',
    component: myAnswers,
    name: 'myAnswers'
},{
    path: '/myQuestions',
    component: myQuestions,
    name: 'myQuestions'
},{
    path: '/myFans',
    component: myFans,
    name: 'myFans'
},{
    path: '/myAttention',
    component: myAttention,
    name: 'myAttention'
},{
    path: '/mySquare',
    component: mySquare,
    name: 'mySquare'
},{
    path: '/publishQuestions',
    component: publishQuestions,
    name: 'publishQuestions'
}, {
    path: '/problemDetails',
    component: problemDetails,
    name: 'problemDetails'
},{
    path: '/answersDetail',
    component: answersDetail,
    name: 'answersDetail'
},{
    path: '/myHomepage',
    component: myHomepage,
    name: 'myHomepage'
},{
    path: '/editAnswer',
    component: editAnswer,
    name: 'editAnswer'
},{
    path: '/allCommont',
    component: allCommont,
    name: 'allCommont'
},{
    path: '/moreAnswers',
    component: moreAnswers,
    name: 'moreAnswers'
},{
    path: '/searchTemp',
    component: searchTemp,
    name: 'searchTemp'
},{
    path: '/searchKeyWord',
    component: searchKeyWord,
    name: 'searchKeyWord'
},];
routes = routes.concat([{
    path: '*',
    redirect: '/'
}]);
export default routes
