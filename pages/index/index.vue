<template>
	<view class="content">
		<scroll-view scroll-y class="DrawerPage" :class="{show:modalName=='viewModal'}">
			<view class="big-box">
				<!-- #ifdef MP-WEIXIN -->
				<image v-if="weatherData.wea_img" :src="'cloud://study-1ko1q.7374-study-1ko1q-1300829142/images/'+weatherData.wea_img+'.jpg'"
				 mode="aspectFill">
				</image>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<image v-if="weatherData.wea_img" :src="'/common/images/'+weatherData.wea_img+'.jpg'" mode="aspectFill">
				</image>
				<!-- #endif -->
				<view class="small-box">
					<view style="overflow: auto;">
						<view class="head">
							<view :style="{height:CustomBar+'px'}">
								<icon style="font-size:36rpx; position: relative;" :style="{top:(Custom.top)+'px',
								left:(ScreenWidth-Custom.width-Custom.left)+'px'}"
								 class="iconfont icon-shezhi " @tap="showModal" data-target="viewModal"></icon>
							</view>
						</view>
						<view class="main text-lg">
							<view class="main-top">
								<view @tap="chosenCity">
									<text style="margin-right:5rpx;" class="iconfont icon-icon-test text-lg"></text>
									<text>{{weatherData.city}}</text>
								</view>
								<text style="margin-top:10rpx;">{{weatherData.update_time}}更新</text>
							</view>
							<view class="main-content">
								<view>
									<text>{{weatherData.tem}}</text>
									<text class="du">°</text>
								</view>
								</image>
							</view>
							<view class="main-bottom">
								<view style="margin-bottom:10rpx;">
									<text style="margin-right:10rpx;">{{weatherData.date}}</text>
									<text style="margin:0;">{{weatherData.week}}</text>
								</view>
								<view>
									<text>{{weatherData.wea}}</text>
									<text>|</text>
									<text>空气{{weatherData.air_level}}</text>
								</view>
							</view>
							<view class="index-list cu-list grid col-2">
								<view class="cu-item">
									<text class="iconfont icon-app_icons--"></text>
									<text>温度</text>
									<text>{{weatherData.tem}}℃</text>
								</view>
								<view class="cu-item">
									<text style="font-size:55rpx;" class="iconfont icon-kongqishidu"></text>
									<text>湿度</text>
									<text>{{weatherData.humidity}}</text>
								</view>
								<view class="cu-item">
									<text class="iconfont icon-fengxiangbiao"></text>
									<text>{{weatherData.win}}</text>
									<text>{{weatherData.win_speed}}</text>
								</view>
								<view class="cu-item">
									<text style="font-size:55rpx;" class="iconfont icon-qiya"></text>
									<text>气压</text>
									<text>{{weatherData.pressure}}hPa</text>
								</view>
							</view>
						</view>
						<view class="notice-box margin-top">
							<swiper class="swiper_container" vertical="true" autoplay="true" circular="true" interval="4000">
								<block v-for="(item,index) in msgList" :key="index">
									<navigator open-type="navigate">
										<swiper-item style="width:100%;">
											<view class="swiper_item">
												<text class="cuIcon-notification lg text-white" style="margin-right:5rpx;margin-left:40rpx;"></text>
												<text>{{item.content}}</text>
											</view>
										</swiper-item>
									</navigator>
								</block>
							</swiper>
						</view>
						<view class="bottom">
							<swiper class="screen-swiper square-dot" indicator-dots="true" circular="true" interval="5000" duration="500">
								<swiper-item v-for="(item,index) in swiperList" :key="index">
									<!-- <image src="{{item.url}}" mode="aspectFill" wx:if="{{item.type=='image'}}"></image> -->
									<view class="text-box" style="box-sizing: border-box;padding: 40rpx;">
										<view>
											<text class="text-xl">{{item.content}}</text>
										</view>
										<view class="source text-lg">
											<view>
												<text>一</text>
												<text class="margin-left-xs">by {{item.author}}</text>
											</view>
											<view>
												<text>{{item.like}}</text>
												<text @tap="changeZan" v-if="item.isZan" :data-idx="index" :data-id="item._id" class="cuIcon-likefill margin-left-xs text-red"></text>
												<text @tap="changeZan" :data-idx="index" :data-id="item._id" v-else class="cuIcon-like margin-left-xs"></text>
											</view>
										</view>
									</view>
								</swiper-item>
							</swiper>
						</view>
					</view>

				</view>
				<view v-if="load" class="loading-box">
					<image src="https://image.weilanwl.com/gif/loading-white.gif"></image>
				</view>
			</view>
		</scroll-view>
		<view class="DrawerClose" :class="{show:modalName=='viewModal'}" @tap="hideModal">
			<text class="cuIcon-pullright"></text>
		</view>
		<scroll-view scroll-y class="DrawerWindow" :class="{show:modalName=='viewModal'}" style="background:url('https://cdn.nlark.com/yuque/0/2019/jpeg/280373/1553234997376-assets/web-upload/88695068-5581-4eb1-a8b0-55276904b34f.jpeg') no-repeat;background-size: auto 100%;">
			<view class="set-head">
				<view class="cu-avatar xl round margin-bottom bg-white">
					<image v-if="isLogin" mode="scaleToFill" :src="userInfo.avatarUrl"></image>
					<!-- #ifdef MP-WEIXIN -->
					<button class="login text-sm text-black" v-else open-type="getUserInfo" @getuserinfo="onGetUserInfo">点击登录</button>
					<!-- #endif -->

				</view>
				<text class="text-white">{{userInfo.nickName}}</text>
				<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
			</view>
			<view class="nav padding flex text-center text-grey bg-white shadow-warp">
				<view class="flex flex-sub flex-direction solid-right">
					<view class="text-xxl text-orange">{{likeTotal}}</view>
					<view class="margin-top-sm" @tap.stop="thumbs">
						<text class="cuIcon-likefill" :class="{'text-orange':userInfo.isZan}"></text> 喜欢
					</view>
				</view>
				<view class="flex flex-sub flex-direction">
					<view class="text-xxl text-green">{{commentsTotal}}</view>
					<view class="margin-top-sm">
						<navigator url="../comment/comment" hover-class="none">
							<text class="cuIcon-writefill"></text> 评论
						</navigator>
					</view>
				</view>
			</view>
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
				<view class="cu-item arrow">
					<navigator class="content" url="/pages/suggest/suggest" hover-class="none">
						<text class="cuIcon-writefill text-cyan"></text>
						<text class="text-grey">留言反馈</text>
					</navigator>
				</view>
				<view class="cu-item arrow">
					<view class="content" @tap="showQrcode">
						<text class="cuIcon-appreciatefill text-yellow"></text>
						<text class="text-grey">赞赏支持</text>
					</view>
				</view>
				<view class="cu-item arrow">
					<navigator class="content" url="/pages/contact/contact" hover-class="none">
						<text class="cuIcon-weixin text-green"></text>
						<text class="text-grey">联系我们</text>
					</navigator>
				</view>

				<navigator class="margin flex justify-center flex-direction" open-type="exit" target="miniProgram">
					<button class="cu-btn bg-orange margin-tb-sm lg" hover-class="none">退出登录</button>
				</navigator>
			</view>
		</scroll-view>
		<modalTip ref='modaltip'></modalTip>
	</view>
	
</template>
<script>
	import URL from '../../interface'
	import modalTip from './modal.vue'
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		components:{
			modalTip
		},
		data() {
			return {
				city: '北京市',
				CustomBar: '',
				Custom: '',
				likeTotal:0,
				commentsTotal:0,
				ScreenWidth: '',
				StatusBar: '',
				weatherData: {},
				cardCur: 0,
				modalName: '',
				swiperList: [],
				load: true,
				userInfo: {},
				isLogin: false,
				msgList: []
			}
		},
		computed:{
			...mapState(['queryCity','queryHistory'])
		},
		onLoad() {
			// #ifndef APP-PLUS || H5
			let capsule = uni.getMenuButtonBoundingClientRect()
			uni.getSystemInfo({
				success: data => {
					let Custom = 0,
						CustomBar = 0;
					if (capsule) {
						Custom = capsule;
						CustomBar = capsule.bottom + capsule.top - data.statusBarHeight;
					} else {
						CustomBar = data.statusBarHeight + 50;
					}
					Object.assign(this, {
						CustomBar: CustomBar,
						Custom: Custom,
						ScreenWidth: data.screenWidth,
						StatusBar: data.statusBarHeight
					})
				}
			})
			//#endif
			this.getWeatch();
			this.getLikeTotal();
			this.getCommentsTotal();
		},
		methods: {
			...mapMutations(['SET_USERIFOR','SET_QUERYHISTORY','SET_QUERYCITY']),
			getWeatch() {
				let city=this.queryCity;
				let history=city?this.queryHistory[city]:'',
					update_time=history?parseInt(history.update_time):'',
					now=(new Date()).getHours();
				//没有查询城市（初始化）或当前城市没有查询历史或当前城市数据是两小时以前的
				if(!city||!history||update_time+2>=now){
					this.updateWeather(this.queryCity)
				}else{
					this.weatherData=history
					this.load = false
				}	
			},
			updateWeather(city){
				let _this = this;
				let url = 'https://www.tianqiapi.com/api/?version=v6&appid=93146859&appsecret=c6s2Em65';
				if (city) {
					url += `&city=${city}`
				}
				uni.request({
					url: url,
					success(res) {
						let data = res.data;
						_this.weatherData = data
						_this.SET_QUERYCITY(data.city)
						_this.SET_QUERYHISTORY(data)
						setTimeout(() => {
							_this.load = false
						}, 1000)
					},
					fail(err) {
						console.log(err)
					},
				})
				
			},
			
			getLikeTotal() {
				this.$get(URL.getThumbsTotal).then(res => {
					if (res.success) {
						this.likeTotal=res.total
					}
				})
			},
			getCommentsTotal() {
				this.$get(URL.getCommentsTotal).then(res => {
					if (res.success) {
						this.commentsTotal=res.total
					}
				})
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			onGetUserInfo(e) {
				let userInfo = e.detail.userInfo;
				if (userInfo) {
					this.platform_Login({
						nickName: userInfo.nickName,
						avatarUrl: userInfo.avatarUrl
					})
				}

			},
			chosenCity() {
				uni.navigateTo({
					url: '../chosenCity/chosenCity'
				})
			},
			platform_Login(userInfo) {
				let platform = this.Platform[0]
				uni.login({
					provider: platform,
					success: (loginRes) => {
						this.getOpenid(Object.assign(userInfo, {
							code: loginRes.code,
							platform: platform
						}))
					}
				});
			},
			getOpenid(params) {
				this.$post(URL.platformLogin,params).then(res=>{
					if (res.success) {
						Object.assign(this, {
							userInfo: res.data,
							isLogin: true
						})
						this.SET_USERIFOR(res.data)
					}
				})
				/*
				uni.request({
					url: 'http://47.96.253.222:3000/api/platformLogin',
					data: params,
					header: {
						'content-type': 'application/json'
					},
					method: 'POST',
					success: (data) => {
						let userInfo = data.data;
						if (userInfo.success) {
							Object.assign(this, {
								userInfo: userInfo.data,
								isLogin: true
							})
							this.SET_USERIFOR(userInfo.data)
						}

					}
				})*/
			},

			thumbs() {
				let openid = this.userInfo.openid,
					isZan = this.userInfo.isZan;
				if (!openid) {
					this.$refs.modaltip.showModal('请先登录！')
				} else if (isZan) {
					this.$refs.modaltip.showModal('不可重复点赞！')
				} else {
					this.$post(URL.thumbsApp, {
						openid: openid
					}).then(res => {
						if (res.success) {
							this.SET_LIKETOTAL(this.likeTotal+1)
							this.userInfo.isZan = true
						}
					})
					/*
					uni.request({
						header: {
							'content-type': 'application/json'
						},
						method: 'POST',
						data: {
							openid: openid
						},
						url: 'http://localhost:3000/api/thumbsApp',
						success: (res) => {
							let data = res.data;
							if (data.success) {
								this.likeTotal += 1;
								this.userInfo.isZan = true
							}
						}
					})*/

				}
			}
		}
	}
</script>
<style>
	.big-box {
		width: 100%;
		height: 100%;
		color: #fff;
		position: relative;
		overflow: hidden;
	}

	.big-box>image {
		height: 100%;
		width: 100%;
		position: absolute;
		left: 0;
		right: 0;
		z-index: 2;
	}

	.small-box {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 8;
		background: rgba(0, 0, 0, 0.1);
	}

	.small-box>view {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.loading-box {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 9;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.head {
		/* background: #51c4d3; */
		position: relative;
		top: 0;
		left: 0;
		z-index: 8;
	}

	/* .head > image {
	    position: absolute;
	    width: 100%;
	    bottom: 0;
	    left: 0;
	    z-index: 99;
	    mix-blend-mode: screen;
	    height: 100rpx;
	}
	
	.head > .loction {
	    width: 100%;
	    position: relative;
	} */

	.main {
		/* border: 1px solid red; */
		display: flex;
		flex-direction: column;
		/* border: 1px solid red; */
	}

	.main-top {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 25rpx;
	}

	.main-content {
		display: flex;
		justify-content: center;
		position: relative;
	}

	.main-content>view {
		font-size: 200rpx;
		position: relative;
	}

	.main-content>view>.du {
		position: absolute;
	}

	.main-content>image {
		position: absolute;
		bottom: 35rpx;
		left: 500rpx;
	}

	.main-bottom {
		display: flex;
		flex-direction: column;
		margin-bottom: 40rpx;
	}

	.main-bottom>view {
		display: flex;
		justify-content: center;
	}

	.main-bottom>view:nth-child(1) {
		align-items: center;
	}

	.main-bottom>view>text:nth-child(2) {
		margin: 0 10rpx;
	}

	.main>.index-list {
		/* flex: 1; */
		/* border: 1px solid yellowgreen; */
		box-sizing: border-box;
		padding: 0 40rpx;
		background: rgba(0, 0, 0, 0);
	}

	.main>.index-list .cu-item {
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, 0.5);
	}

	.main>.index-list .cu-item::after {
		border-color: #fff;
	}

	.main>.index-list .cu-item:nth-last-child(1)::after,
	.main>.index-list .cu-item:nth-last-child(2)::after {
		border-bottom: none;
	}

	.main>.index-list .cu-item:nth-last-child(1)::after,
	.main>.index-list .cu-item:nth-last-child(3)::after {
		border-right: none;
	}

	.main>.index-list .cu-item>text {
		color: #fff;
	}

	.main>.index-list .cu-item>.iconfont {
		font-size: 40rpx;
	}

	.bottom {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.bottom swiper {
		width: 100%;
		height: 270rpx !important;
		min-height: 270rpx !important;
	}

	.text-box {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-weight: 600;
	}

	.text-box>.source {
		display: flex;
		justify-content: space-between;
		font-weight: 500;
	}

	/* 流星CSS */

	.space {
		position: absolute;
		top: 0;
		left: 0;
	}

	.planet {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		background: #333;
		position: absolute;
		left: 50%;
		top: 50%;
		margin: -75rpx 0 0 -75rpx;
		overflow: hidden;
		z-index: 2;
	}

	.planet_shadow {
		position: absolute;
		border-radius: 50%;
		height: 100%;
		width: 100%;
		top: -40%;
		right: -10%;
		border: 35rpx solid rgba(0, 0, 0, 0.15);
	}

	.star {
		display: block;
		width: 5rpx;
		height: 5rpx;
		border-radius: 50%;
		background: #fff;
		top: 100rpx;
		left: 400rpx;
		position: relative;
		transform-origin: 100% 0;
		animation: star-ani 6s infinite ease-out;
		box-shadow: 0 0 5rpx 5rpx rgba(255, 255, 255, 0.3);
		opacity: 0;
		z-index: 2;
	}

	.star:after {
		content: '';
		display: block;
		top: 0rpx;
		left: 4rpx;
		border: 0rpx solid #fff;
		border-width: 0rpx 90rpx 2rpx 90rpx;
		border-color: transparent transparent transparent rgba(255, 255, 255, 0.3);
		transform: rotate(-45deg) translate3d(1rpx, 3rpx, 0);
		box-shadow: 0 0 1rpx 0 rgba(255, 255, 255, 0.1);
		transform-origin: 0% 100%;
		animation: shooting-ani 3s infinite ease-out;
	}

	.white {
		top: 50rpx;
		left: 600rpx;
		background: #fff;
		animation-delay: 5.8s;
	}

	.white:after {
		border-color: transparent transparent transparent #fff;
		animation-delay: 5.8s;
	}

	@keyframes star-ani {
		0% {
			opacity: 0;
			transform: scale(0) rotate(0) translate3d(0, 0, 0);
			-webkit-transform: scale(0) rotate(0) translate3d(0, 0, 0);
			-moz-transform: scale(0) rotate(0) translate3d(0, 0, 0);
		}

		50% {
			opacity: 1;
			transform: scale(1) rotate(0) translate3d(-200rpx, 200rpx, 0);
			-webkit-transform: scale(1) rotate(0) translate3d(-200rpx, 200rpx, 0);
			-moz-transform: scale(1) rotate(0) translate3d(-200rpx, 200rpx, 0);
		}

		100% {
			opacity: 0;
			transform: scale(1) rotate(0) translate3d(-300rpx, 300rpx, 0);
			-webkit-transform: scale(1) rotate(0) translate3d(-300rpx, 300rpx, 0);
			-moz-transform: scale(1) rotate(0) translate3d(-300rpx, 300rpx, 0);
		}
	}

	page {
		/* background-image: var(--gradualBlue); */
		background: rgba(255, 255, 255, 0.9);
		width: 100vw;
		overflow: hidden;
	}

	.DrawerPage {
		position: fixed;
		width: 100vw;
		height: 100vh;
		left: 0vw;
		background-color: #f1f1f1;
		transition: all 0.4s;
	}

	.DrawerPage.show {
		transform: scale(0.9, 0.9);
		left: 85vw;
		box-shadow: 0 0 60rpx rgba(0, 0, 0, 0.2);
		transform-origin: 0;
	}

	.DrawerWindow {
		position: absolute;
		width: 85vw;
		height: 100vh;
		left: 0;
		top: 0;
		transform: scale(0.9, 0.9) translateX(-100%);
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
	}

	.DrawerWindow.show {
		transform: scale(1, 1) translateX(0%);
		opacity: 1;
		pointer-events: all;
	}

	.DrawerClose {
		position: absolute;
		width: 40vw;
		height: 100vh;
		right: 0;
		top: 0;
		color: transparent;
		padding-bottom: 30rpx;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.6));
		letter-spacing: 5px;
		font-size: 50rpx;
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
	}

	.DrawerClose.show {
		opacity: 1;
		pointer-events: all;
		width: 15vw;
		color: #fff;
	}

	.DrawerPage .cu-bar.tabbar .action button.icon {
		width: 64rpx;
		height: 64rpx;
		line-height: 64rpx;
		margin: 0;
		display: inline-block;
	}

	.DrawerPage .cu-bar.tabbar .action .cu-avatar {
		margin: 0;
	}

	.DrawerPage .nav {
		flex: 1;
	}

	.DrawerPage .nav .cu-item.cur {
		border-bottom: 0;
		position: relative;
	}

	.DrawerPage .nav .cu-item.cur::after {
		content: "";
		width: 10rpx;
		height: 10rpx;
		background-color: currentColor;
		position: absolute;
		bottom: 10rpx;
		border-radius: 10rpx;
		left: 0;
		right: 0;
		margin: auto;
	}

	.DrawerPage .cu-bar.tabbar .action {
		flex: initial;
	}

	.set-head {
		height: 500rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.set-head>.cu-avatar {
		height: 150rpx;
		width: 150rpx;
		border-radius: 50%;
		overflow: hidden;
	}

	.set-head .login {
		height: 150rpx;
		line-height: 150rpx;
		background: #fff;
		color: #333;
		text-align: center;
	}

	.set-head .login::after {
		border: none;
		border-radius: 0;
	}

	.set-head>.cu-avatar image {
		width: 100%;
		height: 100%;
	}

	.set-head .gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	.DrawerWindow {
		/* background-repeat: no-repeat;
	    background-size: auto 100%;
	    background-position: center center; */
	}

	/* 公告 */
	.notice-box {
		height: 55rpx;
	}

	.swiper_container {
		height: 55rpx;
		width: 100%;
	}

	.swiper_item {
		font-size: 25rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		letter-spacing: 2px;
	}

	.nav {
		height: 164rpx;
	}

	.tower-swiper .tower-item {
		transform: scale(calc(0.5 + var(--index) / 10));
		margin-left: calc(var(--left) * 100rpx - 150rpx);
		z-index: var(--index);
	}
</style>
