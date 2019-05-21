import Vue from 'vue'
import toastVue from './index.vue'

export default {
    install(Vue, defaultOptions = {}) {
        const constCompoenents = Vue.extend(toastVue)
        const cache = {}
        Object.assign(toastVue.DEFAULT_OPT, defaultOptions)
        function toast(msg, options = {}) {
            if(!msg || typeof msg != 'string') return;
            options.message = msg
            let toast = cache[options.id] || (cache[options.id] = new constCompoenents)
            if (!toast.$el) {
                let vm = toast.$mount()
                document.querySelector(options.parent || 'body').appendChild(vm.$el)
            }
            toast.queue.push(options)
        }
        Vue.toast = Vue.prototype.$toast = toast;
    }
}