<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">评论列表</block>
		</cu-custom>
		<view class="cu-bar bg-white">
			<view class="action line-title">全部评论
			</view>
		</view>
		<view class="cu-list menu-avatar comment solids-top">
			<view class="cu-item" v-for="(comment,index) in comment_lists" :key='index'>
				<view class="cu-avatar round" @longpress='callSomeone(comment.commentmsgid,comment.c_nickname,index)' :style="{backgroundImage:'url('+comment.c_avatar+')'}"></view>
				<view class="content">
					<view class="align-center flex justify-between margin-bottom-sm">
						<view class="text-cyan">
							{{comment.c_nickname}}
						</view>
						<view @tap.stop="thumbsComments(comment.commentmsgid,index)">
							<text class="text-gray cuIcon-appreciate"></text>
							<text class="text-grey margin-left-sm">{{comment.thumbs}}</text>
						</view>
					</view>
					<view class="text-gray text-content text-df ">
						<view class="comment-content">
							{{comment.content}}
						</view>
						<view class="allCommet bg-white" v-if="comment.content.length>200">
							<text class="spot">...</text>
							<text class="text-blue">展开</text>
						</view>
					</view>
					<view class="margin-top-sm flex justify-between">
						<view class="text-gray text-df">
							<text>{{comment.commentTime.split('T')[0]}}</text>
							<text class="margin-left-xs">·</text>
							<text class="margin-left-xs">{{comment.location}}</text>
							<text class="cu-tag radius margin-left-xs" v-if="comment.reply.length>0">{{comment.reply.length}}回复</text>
						</view>
					</view>
					<view class="padding-sm radius text-center shadow-blur bg-gray margin-top-sm" v-if="comment.reply.length>0">
						<view class="comment-list margin-bottom-sm" v-for="(replyMsg,index) in comment.reply" :key='index' v-if='index<1'>
							<view class="text-content text-left">
								<text class="critic text-bold">
									{{replyMsg.r_nickname}}:
								</text>
								<text class="text-left">
									{{replyMsg.replycontent}}
								</text>
								<!-- 
								<view class="allCommet bg-gray text-left">
									<text class="spot">...</text>
									<text class="text-blue">展开</text>
								</view> -->
							</view>
						</view>
						<view class="text-blue text-left" @tap="showAll">
							<text>查看全部回复</text>
							<text class="cuIcon-right"></text>
						</view>

					</view>
				</view>
			</view>
		</view>
		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<input class="solid-bottom" :adjust-position="false" @input="inputFun" v-model="comments" :focus="false" maxlength="300"
			 cursor-spacing="10"></input>
			<view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button class="cu-btn bg-green shadow" @tap.stop="send">发送</button>
		</view>
		<modalTip ref='modaltip'></modalTip>
	</view>
</template>

<script>
	import URL from '../../interface'
	import modalTip from '../index/modal.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components:{
			modalTip
			
		},
		data() {
			return {
				InputBottom: 0,
				comment_lists: [],
				comments: '',
				reply: {
					nickname: '',
					msgId: '',
					list_index: ''
				}
			};
		},
		computed: {
			...mapState(['userInfor','commentsTotal'])
		},
		onLoad() {
			this.comment_list();
		},
		methods: {
			...mapMutations(['SET_COMMENTSTOTAL']),
			inputFun(e) {
				let value = e.target.value
				let nickname = this.reply.nickname
				if (value.length <= nickname.length + 1) {
					this.comments = ''
					this.reply = {
						nickname: '',
						msgId: '',
						list_index: ''
					}
				}
			},
			send() {

				if (!this.comments) {
					this.$refs.modaltip.showModal('评论内容不能为空！！')
				} else if (!this.userInfor.openid) {
					this.$refs.modaltip.showModal('请先登录！！')

				} else {
					//回复某人
					if (this.reply.msgId) {
						this.replySomeone()

					} else { //发表评论
						this.sendComments({
							openid: this.userInfor.openid,
							content: this.comments,
							location: '上海'

						})

					}

				}
			},
			sendComments(params) {
				this.$post(URL.setComment, params).then(res => {
					if (res.success) {
						this.comments = '';
						this.comment_list()
						this.SET_COMMENTSTOTAL(this.commentsTotal+1)
					}
				})
				/*
				uni.request({
					url: 'http://47.96.253.222:3000/api/setComment',
					data:params,
					header: {
						'content-type': 'application/json'
					},
					method: 'POST',
					success: (res) => {
						let data = res.data
						if (data.success) {
							this.comments = '';
							this.comment_list()
						}
					}
				})*/

			},
			replySomeone() {
				let content = this.comments.split(this.reply.nickname + ' ')[1];
				if (!content) return
				this.$post(URL.replySomeone, {
					replycommentsid: this.reply.msgId,
					replycontent: content,
					replyid: this.userInfor.openid
				}).then(res => {
					if (res.success) {
						this.comments = '';
						this.comment_lists[this.reply.list_index]['reply'].unshift({
							r_nickname: this.userInfor.nickName,
							replycontent: content
						})
						this.reply = {
							nickname: '',
							msgId: '',
							list_index: ''
						}
					}
				})
				/*
				uni.request({
					url: 'http://47.96.253.222:3000/api/replySomeone',
					data:{
						replycommentsid:this.reply.msgId,
						replycontent:content,
						replyid:this.userInfor.openid
					},
					header: {
						'content-type': 'application/json'
					},
					method: 'POST',
					success:(res)=>{
						let data = res.data
						if (data.success) {
							this.comments = '';
							this.comment_lists[this.reply.list_index]['reply'].unshift({
								r_nickname:this.userInfor.nickName,
								replycontent:content
							})
							this.reply={
								nickname: '',
								msgId: '',
								list_index: ''	
							}
						}
					}
					
				})*/

			},
			comment_list() {
				this.$post(URL.comments_lists, {
					openid: this.userInfor.openid,
					commentmsgid: 3
				}).then(res => {
					if (res.success) {
						this.comment_lists = res.data
					}
				})
				/*
				uni.request({
					url: 'http://47.96.253.222:3000/api/comments_lists',
					data: {
						openid: this.userInfor.openid,
						commentmsgid: 3
					},
					header: {
						'content-type': 'application/json'
					},
					method: 'POST',
					success: (res) => {
						let result = res.data
						if (result.success) {
							this.comment_lists = result.data
						}
					}

				})*/

			},
			thumbsComments(msgId, index) {
				this.$post(URL.thumbsComment, {
					openid: this.userInfor.openid,
					commentmsgid: msgId
				}).then(res => {
					if (res.success) {
						this.comment_lists[index]['thumbs'] += 1
					}

				})
				/*
				uni.request({
					url: 'http://47.96.253.222:3000/api/thumbsComment',
					data: {
						openid: this.userInfor.openid,
						commentmsgid: msgId
					},
					header: {
						'content-type': 'application/json'
					},
					method: 'POST',
					success: (res) => {
						let data = res.data
						if (data.success) {
							this.comment_lists[index]['thumbs'] += 1
						}
					}

				})*/

			},
			callSomeone(msgId, nickname, index) {
				if (this.userInfor.openid) {
					this.reply = Object.assign(this.reply, {
						nickname: nickname,
						msgId: msgId,
						list_index: index
					})
					this.comments = '@' + nickname + ' '

				}


			}
		}
	}
</script>

<style lang="less">
	.cu-bar .action.line-title:first-child {
		margin-left: 60rpx;
	}

	.menu-avatar {
		padding-bottom: 55px;
	}

	.text-content {
		position: relative;
		max-height: 80px;
		line-height: 20px;
		overflow: hidden;

		.allCommet {
			position: absolute;
			bottom: 0;
			right: 0;
			width: 50%;
		}

	}

	.line-title {
		position: relative;

		&:before {
			content: '';
			position: absolute;
			width: 3px;
			height: 100%;
			left: -30rpx;
			top: 0;
			background: #0081ff;
		}

	}
</style>
