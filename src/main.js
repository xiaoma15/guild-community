// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import store from './store'
import ajax from './store/ajax'
import routes from './router'
import { storage, methods } from './js/common'
import Loading from './components/loading'
import Toast from './components/toast'
import global from './components/global'
import filters from './js/filters'
import renderHeadPic from './js/renderPic'

Vue.use(VueRouter)
Vue.use(Loading)
Vue.use(Toast)

const router = new VueRouter({
    routes
})


for(let key in filters){
    Vue.filter(key, filters[key])
}

// 全局 配置 公共组件
Vue.prototype.storage = storage
Vue.prototype.comMethods = methods
Vue.prototype.renderHeadPic = renderHeadPic

FastClick.attach(document.body);

FastClick.prototype.focus = function (targetElement) {
    'use strict';
    targetElement.focus();
};

// 为了能够正确执行转场动画，跳转页面的方法需要做一层包装
VueRouter.prototype.$go = function(noAnimate) {
    this.noAnimate = noAnimate || false;
    this.goTo = false;
    this.go(-1);
};
VueRouter.prototype.$push = function(location, noAnimate, onComplete, onAbort) {
    this.noAnimate = noAnimate || false;
    this.goTo = true;
    this.push(location, onComplete, onAbort);
};
VueRouter.prototype.$replace = function(location, noAnimate, onComplete, onAbort) {
    this.noAnimate = noAnimate || false;
    this.goTo = true;
    this.replace(location, onComplete, onAbort);
};

// 判断是否支持0.5px
let body = document.querySelector('body')
if (window.devicePixelRatio && devicePixelRatio >= 2) {
    let testElem = document.createElement('div')

    testElem.style.border = '.5px solid transparent';
    body.appendChild(testElem);
    if (testElem.offsetHeight >= 1) {
        body.classList.add('half-border');
    } else {
        body.classList.add('full-border');
    }
    document.body.removeChild(testElem);
} else {
    body.classList.add('full-border');
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
