<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">联系我们</block>
		</cu-custom>
		<view class='margin-xl bg-white padding-xl radius shadow-lg'>
		    <view class='text-content'>
		        <view>Hi！</view>
		        <view class='margin-top-sm'>该项目是基于ColorUI组件库，借用九天气小程序UI，使用uniapp重构的小程序项目,天气查询接口由天气API提供本项目所有资源来源网上，如有侵权,请选择以下方式联系我删除，谢谢支持！！</view>
		       <view class='margin-top-sm'>
		            <text class="iconfont icon-icon" style="font-size:26rpx;color:#71c5f2;"></text>
		            <text class="margin-left">2486697327</text>
		        </view>
		        <view class='margin-top-sm'>
		            <text class="cuIcon-weixin text-green" ></text>
		            <text class="margin-left">13588283103</text>
		        </view>
		    </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:''
			};
		}
	}
</script>

<style lang="less">

</style>
