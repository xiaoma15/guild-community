import Vue from 'vue'
import LoadingVue from './index.vue'

export default {
    install(Vue, defaultOptions = {}) {
        const loadingCompoenents = Vue.extend(LoadingVue)
        const cache = {}
        Object.assign(LoadingVue.DEFAULT_OPT, defaultOptions)
        function loading(options = {}) {
            let loading = cache['loading'] || (cache['loading'] = new loadingCompoenents)
            if (!loading.$el) {
                let vm = loading.$mount();
                document.querySelector('body').appendChild(vm.$el)
            }
            if(options && typeof options === 'object') {
                loading.option = options;
            }
            loading.show();
            return loading
        }
        function hideLoading(duration = 70, callback) {
            let loading = cache['loading'];
            if(!loading) return;
            loading.hide(duration, callback);
        }
        Vue.showLoading = Vue.prototype.$showLoading = loading;
        Vue.hideLoading = Vue.prototype.$hideLoading = hideLoading;
    }
}