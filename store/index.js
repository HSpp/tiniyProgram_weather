import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		userInfor:{},
		likeTotal:0,
		commentsTotal:0,
		queryCity:'',
		currentCity:'',
		queryHistory:{}
	},
    mutations: {
		SET_USERIFOR(state,parmas){
			state.userInfor=parmas
		},
		SET_QUERYHISTORY(state,data){
			state.queryHistory[data.city]=data
		},
		SET_CURRENTCITY(state,city){
			state.currentCity=city
		},
		SET_QUERYCITY(state,city){
			state.queryCity=city
		},
		SET_LIKETOTAL(state,number){
			state.likeTotal=number
		},
		SET_COMMENTSTOTAL(state,number){
			state.commentsTotal=number
		}
	},
    actions: {
		
		
	}
})
export default store