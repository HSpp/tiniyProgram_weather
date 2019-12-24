<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">选择城市</block>
		</cu-custom>
		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="输入搜索的关键词" v-model="searchValue"  confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-blue shadow-blur round" @tap.stop="search">搜索</button>
			</view>
		</view>

		<scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-'+ listCurID" :style="[{height:'calc(100vh - '+ CustomBar + 'px - 50px)'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true">
			<view class="location">
				<view style="height: 32px;line-height: 32px;padding: 0 10px;">
					定位城市
				</view>
				<view class="position radius shadow bg-white" @tap.stop="selectCity(currentCityCN)">
					{{currentCityCN}}
				</view>
			</view>
			<block v-for="(item,index) in list" :key="index">
				<view :class="'indexItem-' + item.letter" :id="'indexes-' + item.letter" :data-index="item.letter">
					<view class="padding" style="padding: 12rpx;" v-if='item.citys.length>0'>{{item.letter}}</view>
					<view class="cu-list menu-avatar no-padding">
						<view class="indexes-item cu-item" v-for="(city,sub) in item.citys" :key="sub" @tap.stop="selectCity(city)">
							<view class="cityNameCN">{{city.nameCN}}</view>
							<view class="cityNameEN">{{city.nameEN}}</view>
						</view>
						<!-- <view class="cu-item" v-for="(items,sub) in 2" :key="sub">
							<view class="cu-avatar round lg">{{item.name}}</view>
							<view class="content">
								<view class="text-grey">{{item.name}}<text class="text-abc">{{list[sub].name}}</text>君</view>
								<view class="text-gray text-sm">
									有{{sub+2}}个主子需要伺候
								</view>
							</view>
						</view> -->
					</view>
				</view>
			</block>
		</scroll-view>
		<view class="indexBar" :style="[{height:'calc(100vh - ' + CustomBar + 'px - 50px)'}]">
			<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove.stop="tMove">
				<view class="indexBar-item" v-for="(item,index) in list" :key="index" :id="item.letter" @touchstart="getCur"
				 @touchend="setCur">
					{{item.letter}}</view>
			</view>
		</view>
		<!--选择显示-->
		<view v-show="!hidden" class="indexToast">
			{{listCur}}
		</view>
		<modalTip ref='modaltip'></modalTip>

	</view>
</template>

<script>
	import cityLists from '../../common/citys'
	import modalTip from '../index/modal.vue'
	import {
		mapMutations,
		mapState
	} from 'vuex'
	let citys=cityLists.map(city=>city.citys)
	const assemble=[].concat(...citys);
	export default {
		components:{
			modalTip
			
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				hidden: true,
				listCurID: '',
				list: cityLists,
				listCur: '',
				currentCityCN: '',
				searchValue: ''

			};
		},
		computed: {
			...mapState(['currentCity'])
		},
		onLoad() {
			if (this.currentCity) {
				this.currentCityCN = this.currentCity
			} else {
				let _this = this;
				let url = 'https://www.tianqiapi.com/api/?version=v6&appid=93146859&appsecret=c6s2Em65';
				uni.request({
					url: url,
					success(res) {
						let data = res.data;
						_this.currentCityCN = data.city
						_this.SET_CURRENTCITY(data.city)
					},
				})

			}


		},
		onReady() {
			let that = this;
			uni.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
				that.boxTop = res.top
			}).exec();
			uni.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
				that.barTop = res.top
			}).exec()
		},
		methods: {
			...mapMutations(['SET_QUERYCITY', 'SET_CURRENTCITY']),
			//获取文字信息
			getCur(e) {
				this.hidden = false;
				this.listCur = e.target.id;
			},
			setCur(e) {
				this.hidden = true;
				this.listCur = this.listCur
			},
			//滑动选择Item
			tMove(e) {
				let y = e.touches[0].clientY,
					offsettop = this.boxTop,
					that = this;
				//判断选择区域,只有在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 20);
					this.listCur = that.list[num].letter
				};
			},

			//触发全部开始选择
			tStart() {
				this.hidden = false
			},

			//触发结束选择
			tEnd() {
				this.hidden = true;
				this.listCurID = this.listCur
			},
			input(e) {
				let value = e.detail.value;
				if (value[0] && value[0].charCodeAt() >= 97 &&
					value[0].charCodeAt() <= 122) {
					this.listCur = value[0].toLocaleUpperCase()
					this.tEnd()
				}
			},
			indexSelect(e) {
				let that = this;
				let barHeight = this.barHeight;
				let list = this.list;
				let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
				for (let i = 0; i < list.length; i++) {
					if (scrollY < i + 1) {
						that.listCur = list[i].name;
						that.movableY = i * 20
						return false
					}
				}
			},
			search() {
				let result=assemble.filter(city=>city.nameCN==this.searchValue)
				if(result[0]){
					this.SET_QUERYCITY(result[0]['nameCN'])
					uni.navigateTo({
						url: '../index/index'
					})	
				}else{
					this.$refs.modaltip.showModal('没有找到此城市！')
				}
			},
			selectCity(city) {
				let cityName = city.nameCN || this.currentCity
				this.SET_QUERYCITY(cityName)
				uni.navigateTo({
					url: '../index/index'
				})
			}
		}
	}
</script>

<style>
	page {
		padding-top: 100upx;
	}

	.location {
		height: 60px;
	}

	.location .position {
		height: 25px;
		width: 60px;
		background: #fff;
		display: block;
		margin-left: 6px;
		text-align: center;
		border-radius: 4px;
		line-height: 25px;

	}

	.indexes {
		position: relative;
	}

	.cu-list.menu-avatar>.cu-item.indexes-item {
		display: flex;
		justify-content: flex-start;
		height: auto;
		padding: 10px 6px;
	}

	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 0px;
		padding: 20upx 20upx 20upx 60upx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}
</style>
