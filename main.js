import Vue from 'vue'
import App from './App'
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)



import store from './store'
import {
	get,
	post
} from './interface'
//把vuex定义成全局组件
Vue.prototype.$store = store
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
