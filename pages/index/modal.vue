<template>
	<view class="cu-modal" @tap="hideModal" :class="modalName=='DialogModal1'?'show':''">
		<view class="cu-dialog" style="width: 270px;">
			<view class="cu-bar bg-white justify-center">
				<view class="text-center text-blue text-bold">{{tipContent}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				modalName:'',
				tipContent:''
				
			}
		},
		methods:{
			hideModal(){
				this.modalName=''
			},
			showModal(msg){
				this.tipContent=msg
				this.modalName='DialogModal1'
			}
			
		}
	}
</script>

<style>
</style>
