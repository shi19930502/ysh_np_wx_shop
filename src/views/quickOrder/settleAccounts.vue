<template>
	<yd-layout>
		<div class="settleAccounts">
			<div v-if='buyer' class="header">
				<div class="name">订单配送至</div>
				<div class="addr" @click="goSelectAdd">{{addressInfo.completeAddress}}</div>
				<div><span>{{addressInfo.contacts}}</span>&nbsp;&nbsp;<span>{{addressInfo.phoneNumber}}</span></div>
				<div @click='selectPay' class="pay">
					<div>支付方式</div>
					<div>现金支付</div>
				</div>
			</div>
			<div v-else class="header caigoushang">
				<div class="addr">请选择采购商</div>
				<div @click='selectPay' class="pay">
					<div>支付方式</div>
					<div class="pay_list">按期支付</div>
				</div>
			</div>
			<div class="content">
				<div class="content_list"  v-for='(item,index) in quickSettlementParam'>
					<div class="c_header">
						<div class="henxian"></div>
						<div  class="name">{{item.name}}</div>
						<div class="henxian"></div>
					</div>
					<div class="c_content" :key='list.id' v-for='(list,listIndex) in item.spArr'>
						<div class="c_c_list" >
							<img v-if='list.skuPicUrl' :src="imgUrl+list.skuPicUrl" alt="" />
							<img v-else-if='list.proPicUrl' :src="imgUrl+list.proPicUrl" alt="" />
							<img v-else-if='list.catPic' :src="imgUrl+list.catPic" alt="" />
							<img v-else src="../../assets/imgs/img_moren.png">
							<div class="list_right">
								<div class="right_top">
									<div style="width: 3rem;flex-grow: 1;"><span>{{list.productName}}</span>&nbsp;{{list.skuName}}</div>
									<div style="text-align: right;font-weight: 700;width: 1rem;flex-grow: 0;" @click='remark(item,item.sp,listIndex)'>{{list.btnText}}</div>
								</div>
								<div class="right_bottom">
									<div class="money">￥&nbsp;{{list.promotionPrice}}/{{list.skuMeasureName}}</div>
									<div class="right_bottom_right">
										<div class="num">X&nbsp;{{list.quantity}}</div>
										<div class="xiaoji">￥{{(parseFloat(list.promotionPrice)*parseFloat(list.quantity)).toFixed(2)}}</div>
									</div>
								</div>
							</div>
						</div>
						<div class="remark" v-show='list.showRemarks'>
							<yd-input placeholder="输入商品备注信息"></yd-input>
						</div>
					</div>
					<div class="list_shop_all">共{{item.idArr.length}}件商品</div>
					<div class="dispatching">
						<div class="top">
							<div class="top_top">
								<div class="dispatching_top">
									<div class="name">配送</div>
									<div>到店自提</div>
								</div>
								<div class="select_time"> <yd-icon name="time" size=".28rem" color="#72B33D"></yd-icon>201531-2-126</div>
							</div>
							<img src="../../../static/imgs/list_icon_right.png" alt="" />
						</div>
						<div class="leave_word">
							<yd-input placeholder="选填：给商家留言"></yd-input>
						</div>
						<div class="small_money"><span>小计：</span><span class="money">￥5.00</span></div>
					</div>
				</div>
			</div>
		</div>
	</yd-layout>
</template>

<script>
	import configs from '../../configs'
	export default {
		data() {
			return {
				imgUrl: configs.imgURL,
				quickSettlementParam:[],
				localObj:{},
				buyer:true,
				addressInfo:{},
			}
		},
		computed: {

		},
		watch: {
			
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '订单结算')
			if(localStorage.getItem('quickSettlementParam')){
				this.quickSettlementParam = JSON.parse(localStorage.getItem('quickSettlementParam'))
				this.localObj=JSON.parse(localStorage.getItem('userInfo'))
				if(this.localObj.typeId=="merchant"){
					this.buyer=false
				}else{
					this.getAddress();
				}
				for(let a=0;a<this.quickSettlementParam.length;a++){
					for(let b =0 ;b<this.quickSettlementParam[a].sp.length;b++){
						this.quickSettlementParam[a].sp[b].btnText = '备注'
						this.quickSettlementParam[a].sp[b].showRemarks = false
					}
				}
			}else{
				this.$router.push({
					name: 'Enshrine'
				})
			}
			
		},
		mounted() {

		},
		methods: {
			//选择支付方式
			selectPay() {
			},
			//备注
			remark(item,list,index) {
				list[index].btnText=='备注'?list[index].btnText='收起':list[index].btnText='备注'
				if(item.sp[index].showRemarks){
					item.sp[index].showRemarks=false
					this.$set(item.sp, index, list[index])
				}else{
					item.sp[index].showRemarks=true
					this.$set(item.sp, index, list[index])
					
				}

			},
			//获取采购商的地址联系电话信息
			getAddress(id) {
				this.postRequest('address/queryByCustomerId', {
					customerId: this.localObj.typeCode
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						if(resp.data.aaData) {
							this.addressInfo = resp.data.aaData
						}
					}
				})
			},
			//选择地址
			goSelectAdd() {
				this.$router.push({
					name: 'UserAddress'
				})
			}
		}
	}
</script>

<style lang="scss">
	.settleAccounts {
		.header {
			width: 100%;
			padding: .3rem .3rem .74rem .3rem;
			min-height: 2.4rem;
			position: relative;
			margin: 0 0 .8rem 0;
			color: white;
			font-size: .24rem;
			text-align: center;
			background: -webkit-linear-gradient(to left, #B7DB68, #8CD362);
			/* Safari 5.1 - 6.0 */
			background: -o-linear-gradient(to left, #B7DB68, #8CD362);
			/* Opera 11.1 - 12.0 */
			background: -moz-linear-gradient(to left, #B7DB68, #8CD362);
			/* Firefox 3.6 - 15 */
			background: linear-gradient( to left, #B7DB68, #8CD362);
			/* 标准的语法 */
			.name {
				font-size: .28rem;
			}
			.addr {
				font-size: .3rem;
				padding: .18rem 0;
				&:after {
					content: '';
					display: inline-block;
					width: .14rem;
					height: .24rem;
					background: url(../../assets/imgs/icon_right.png) no-repeat;
					background-size: contain;
					margin: 0 0 0 .15rem;
				}
			}
			.pay {
				position: absolute;
				bottom: -.5rem;
				left: .16rem;
				border-radius: .04rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 7.18rem;
				height: 1rem;
				background: white;
				color: #2F3927;
				font-size: .28rem;
				padding: 0 .2rem;
				.pay_list {
					color: #2F3927;
					font-size: .24rem;
					&:after {
						content: '';
						display: inline-block;
						width: .14rem;
						height: .2rem;
						background: url(../../../static/imgs/list_icon_right.png) no-repeat;
						background-size: contain;
						margin: 0 0 0 .15rem;
					}
				}
			}
		}
		.caigoushang {
			/*display: flex;
			align-items: center;
			justify-content: center;*/
			padding: .6rem .3rem .3rem .3rem;
		}
		.content_list {
			width: 6.75rem;
			margin: 0 auto .3rem;
			background: white;
			border-radius: .04rem;
			padding: 0 .2rem .44rem .2rem;
			.c_header {
				align-items: center;
				display: flex;
				.henxian {
					flex-grow: 1;
					width: 1rem;
					height: 3px;
					border-bottom: 1px solid #D6D6D6;
					border-top: 1px solid #D6D6D6;
				}
				.name {
					color: #2F3927;
					flex-grow: 0;
					padding: .26rem .16rem;
					font-size: .28rem;
				}
			}
			.c_content{
				margin: 0 0 .25rem 0;
				.remark {
					margin: 0.1rem 0 0rem 0;
					height: 0.6rem;
					background: #FFEDBD;
					color: #989E92;
					padding-left: 0.1rem;
					border-radius: 5px;
				}
			}
			.c_c_list {
				display: flex;
				/*margin: 0 0 .2rem 0;*/
				img {
					width: .6rem;
					height: .6rem;
					margin: 0 .17rem 0 0;
					flex-grow: 0;
				}
				.list_right {
					width: 3rem;
					flex-grow: 1;
					font-size: .24rem;
					color: #2F3927;
					.right_top {
						display: flex;
						justify-content: space-between;
						span {
							font-weight: 700;
						}
					}
					.right_bottom {
						margin: .12rem 0 .1rem 0;
						display: flex;
						justify-content: space-between;
						.money {
							color: #989E92;
						}
						.right_bottom_right {
							display: flex;
							align-items: center;
							font-weight: 700;
							width: 2.5rem;
							.num {
								width: 1rem;
								flex-grow: 0;
							}
							.xiaoji{
								width: 1.2rem;
								flex-grow: 1;
								text-align: right;
							}
						}
					}
				}
			}
			.list_shop_all{
				width: 100%;
				height: .4rem;
				background: #EFEFF3;
				text-align: center;
				line-height: .4rem;
				color: #797D77;
				font-size: .24rem;
				border-radius: .04rem;
				margin: .2rem 0 .37rem 0;
			}
		}
		.dispatching{
			.top{
				display: flex;
				align-items: center;
				img{
					width: .14rem;
					height: .24rem;
					flex-grow: 0;
					margin: 0 0 0 .2rem;
				}
				.top_top{
					flex-grow: 1;
					width: 3rem;
					.dispatching_top{
						display: flex;
						align-items: center;
						font-size: .24rem;
						justify-content: space-between;
						color: #2F3927;
						.name{
							font-size: .28rem;
						}
					}
					.select_time{
						text-align: right;
					}
				}
			}
			.leave_word{
				height: .68rem;
				background:rgba(250,248,229,1);
				border-radius: .04rem;
				margin: .31rem 0;
				padding: 0 .21rem;
			}
			.small_money{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: .24rem;
				.money{
					font-size: .36rem;
					font-weight: 700;
				}
			}
		}
	}
</style>