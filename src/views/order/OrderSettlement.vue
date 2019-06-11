<template>
	<yd-layout slot="tabbar" style="height: 100%;" id="OrderSettlement">
		<div class="header gradient">
			<template v-if="payParams.wuliutype == 1">
				<div>订单配送至</div>
				<div class="flex flex-y-center flex-x-center">
					<h1 @click="goSelectAdd">{{addressInfo.completeAddress || '请选择收货地址' }}</h1>
					<img src="../../assets/imgs/icon_right.png" style="width: 7px;height: 12px;">
				</div>
				<div>{{addressInfo.contacts}} {{addressInfo.phoneNumber}}</div>
			</template>
			<template v-else>
				<h1>自提，无需配送</h1>
				<div>{{addressInfo.contacts}} {{addressInfo.phoneNumber}}</div>
			</template>
		</div>
		<div class="content">
			<div class="psinfocard flex flex-x-between" @click="toConfirmOrder">
				<div>
					<h1>支付配送</h1>
				</div>
				<div class="tar flex flex-y-center">
					<div>
						<template v-if="payParams.wuliutype == 1">
							<p>{{payParams.payType == 0 ? '现金支付' : payParams.payType == 1 ? 'POS刷卡' : payParams.payType == 2 ? '微信支付' : '支付宝支付'}}</p>
							<p>{{payParams.wuliutype == 0 ? '自提' : '物流配送'}}</p>
							<p>{{payParams.distributionType == 0 ? '次日配送' : '今日配送'}}</p>
							<p class="flex flex-y-center">
								<img src="../../assets/imgs/listd_icon_time.png" style="margin-right: 0.1rem;height: 14px;width: 14px;">
								<span>{{payParams.distributionDate + ' ' + payParams.distributionTimeBegin + '~' + payParams.distributionTimeEnd}}</span>
							</p>
						</template>
						<template v-else>
							<p>{{payParams.payType == 0 ? '现金支付' : payParams.payType == 1 ? 'POS刷卡' : payParams.payType == 2 ? '微信支付' : '支付宝支付'}}</p>
							<p>{{payParams.wuliutype == 0 ? '自提' : '物流配送'}}</p>
						</template>
					</div>
					<div style="margin-left: 0.16rem;">
						<img src="../../assets/imgs/list_icon_right.png" style="width: 7px;height: 12px;">
					</div>
				</div>
			</div>
			<div class="prolist">
				<div class="flex flex-y-center">
					<div class="flex-item-2 line"></div>
					<div class="title">
						<h1>{{storeInfo.storeName}}</h1>
					</div>
					<div class="flex-item-2 line"></div>
				</div>
				<ul class="product-list">
					<li v-for="d in settlementGoods">
						<div class="flex flex-x-between flex-y-center">
							<div class="flex">
								<div class="img">
									<img v-if="d.skuPicUrl" :src="imgURL+d.skuPicUrl">
									<img v-else-if="d.proPicUrl" :src="imgURL+d.proPicUrl">
									<img v-else-if="d.productPicUrl" :src="imgURL+d.productPicUrl">
									<img v-else src="../../assets/imgs/img_moren.png">
								</div>
								<div>
									<!--商品名&规格名-->
									<template v-if="d.skuWeight">
										<div v-if="d.skuMethodType == 1">
											<h3>{{d.productName+'['+d.skuMeasureName+']'}}</h3>
										</div>
										<div v-else>
											<h3 v-if="d.proMeasureName != d.skuMeasureName">{{d.productName+'['+d.skuWeight+d.proMeasureName+'/'+d.skuMeasureName+']'}}</h3>
											<h3 v-else>{{d.productName+'['+d.skuMeasureName+']'}}</h3>
										</div>
									</template>
									<template v-else>
										<h3>{{d.productName+'['+d.skuMeasureName+']'}}</h3>
									</template>

									<span v-if="d.promotionPrice>0 && d.promotionBasePrice>0" style="color: #989E92">
										<span>{{'￥'+d.promotionPrice}}</span>
										<span>/{{d.skuMeasureName}}</span>
										<span class="sl">{{'x'+d.quantity}}</span>
									</span>
									<span v-else style="color: #989E92">
										<span v-if="d.price==0">￥时价</span>
										<span v-else>{{'￥'+d.price}}</span>

										<span>/{{d.skuMeasureName}}</span>
										<span class="sl">{{'x'+d.quantity}}</span>
									</span>
								</div>
							</div>
							<div class="tar">
								<h3 @click="showRemarks(d)">{{d.btnText}}</h3>
								<strong v-if="d.promotionPrice>0 && d.promotionBasePrice>0">{{'￥'+(d.quantity*(d.promotionPrice*100)/100-0).toFixed(2)}}</strong>
								<strong v-else-if="d.price ==0">￥时价</strong>
								<strong v-else>{{'￥'+(d.quantity*(d.price*100)/100-0).toFixed(2)}}</strong>
							</div>
						</div>
						<div class="bzinput" v-show="d.showRemarks">
							<yd-input v-model="d.remark" placeholder="输入商品备注信息" :max="200" :show-success-icon="false"></yd-input>
						</div>
					</li>
				</ul>
				<div class="tongjisl">共{{settlementGoods.length}}件商品</div>
				<div class="leavingaMsg">
					<yd-input v-model="comment" placeholder="选填：给商家留言" :max="200" :show-success-icon="false"></yd-input>
				</div>
				<div class="tar smallplan">小计
					<strong>{{'￥'+(orderTotal/100-0).toFixed(2)}}</strong>
				</div>
			</div>
		</div>
		<!-- 底部 -->
		<yd-tabbar slot="tabbar">
			<div class="yd-tabbar">
				<div class="tabbar flex">
					<div class="flex flex-y-center">
						<span class="tips">
							<span>{{'￥'+(orderTotal/100-0).toFixed(2)}}</span>
							<span>{{'种类'+settlementGoods.length+'数量'+aQuantity}}</span>
						</span>
					</div>
					<div>
						<div class="tabbar-btn" @click="toOrderCheckoutSuccess">确认订单</div>
					</div>
				</div>
			</div>
		</yd-tabbar>
	</yd-layout>
</template>
<script>
	import menuTab from '../component/menu.vue'
	import mixin from '../../utils/mixin.js'
	import mixin_store from '../../utils/mixin_store.js'

	export default {
		components: {
			menuTab
		},
		mixins: [mixin, mixin_store],
		data() {
			return {
				clickNum: 0,
				// 已选商品
				settlementGoods: [],
				// 供应商信息
				sellerInfo: {},
				// 供应商店铺信息
				storeInfo: {},
				// 收货人地址联系人信息
				addressInfo: {},
				// 支付方式配送时间参数
				payParams: {
					payType: 0,
					distributionType: 1,
					distributionDate: this.GetDateStr(0,this.server_date).date,
					distributionTimeBegin: '09:00',
					distributionTimeEnd: '10:00',
					wuliutype: 1
				},
				// 统计总价
				orderTotal: 0,
				// 统计数量
				aQuantity: 0,
				// 封装订单数据
				createOrderObj: {},
				// 订单备注
				comment: '',
				isChoiceOfPaymentBack: false
			}
		},
		async created() {
			this.$store.dispatch('changeNavBarTitle', '订单结算')
			this.server_date = await this.getServerTime()
			// 获取地址
			this.getAddress()
			// fixed bug#2341
			if(this.$route.params.sellerId == null){
				this.$router.replace({name:'UserShoppingCart'})
				return false
			}

			// 获取店铺信息
			this.getStore(this.$route.params.sellerId, store => {
				this.storeInfo = store
				this.setPayParams(store)
				this.sellerInfo = this.$route.params
				// 获取选择支付方式页面参数
				if (this.$store.getters.getPayParams) {
					this.payParams = this.$store.getters.getPayParams
				}
			})
			// 获取选择商品参数
			if (localStorage.getItem('settlementParam')) {
				let settlementGoods = JSON.parse(localStorage.getItem('settlementParam')).settlementGoods
				// 再来一单的商品价格为原价 ，如果在将来的某一天要按订单里面的价格就把这个for注释掉—0-
				// 				for (var sku of settlementGoods) {
				// 					this.postRequest('productsku/querySkuPriceById', {
				// 						skuId: sku.skuId
				// 					}).then(resp => {
				// 						if (resp.data && resp.data.state == 0) {
				// 							sku.price = resp.data.aaData.price
				// 						}
				// 					})
				// 				}
				this.settlementGoods = settlementGoods
			} else {
				// 判断是否是门店快速购买进入
				if (sessionStorage.getItem('f_index') == '1') {
					sessionStorage.removeItem('f_index')
					window.location.href = 'http://ssbh.yshfresh.com/quick_order/#/f_index'
				} else {
					this.$router.push({
						name: 'Home'
					})
				}
			}

			// 获取选择地址参数
			if (this.$store.getters.getSelectedAddress) {
				this.addressInfo = this.$store.getters.getSelectedAddress
			}

			// 计算总价总
			for (var sku of this.settlementGoods) {
				// 				this.postRequest('productsku/querySkuPriceById', {
				// 					skuId: sku.skuId
				// 				}).then(resp => {
				// 					if (resp.data && resp.data.state == 0) {
				// 						sku.price = resp.data.aaData.price
				// 						if (sku.promotionPrice > 0 && sku.promotionBasePrice > 0) {
				// 							this.orderTotal += sku.quantity * (sku.promotionPrice.mul(100))
				// 						} else {
				// 							this.orderTotal += sku.quantity * (sku.price.mul(100))
				// 						}
				// 						this.aQuantity += sku.quantity
				// 					}
				// 				})
				// 如果在将来的某一天要按订单里面的价格就把这个注释放开上面的注释掉—0-
				if (sku.promotionPrice > 0 && sku.promotionBasePrice > 0) {
					this.orderTotal += sku.quantity * (sku.promotionPrice.mul(100))
				} else {
					this.orderTotal += sku.quantity * (sku.price.mul(100))
				}
				this.aQuantity += sku.quantity
			}
		},
		mounted() {},
		methods: {
			/**
			 * 初始化配送参数
			 */
			setPayParams(storeInfo) {
				let nowTime = new Date(this.server_date)
				// let nowTime = this.server_date 
				let nt = nowTime.getHours() + 1
				// 设置默认配送时间
				this.payParams.distributionType = storeInfo.distributionToday

				if (this.payParams.distributionType == 0) { // 如果店铺不支持当天配送distributionType == 0，只能选择第二天的日期
					this.payParams.distributionDate = this.GetDateStr(1,this.server_date).date
					this.payParams.distributionTimeBegin = storeInfo.distributionStart < 10 ?
						`0${storeInfo.distributionStart}:00` : `${storeInfo.distributionStart}:00`
					this.payParams.distributionTimeEnd = storeInfo.distributionStart + 1 < 10 ?
						`0${storeInfo.distributionStart+1}:00` : `${storeInfo.distributionStart+1}:00`
				} else {
					if (nt >= storeInfo.distributionEnd) { // 如果店铺支持当天配送distributionType == 1，但是超过结束配送时间，只能选择第二天的日期
						this.payParams.distributionType = 0
						this.payParams.distributionDate = this.GetDateStr(1,this.server_date).date
						this.payParams.distributionTimeBegin = storeInfo.distributionStart < 10 ?
							`0${storeInfo.distributionStart}:00` : `${storeInfo.distributionStart}:00`
						this.payParams.distributionTimeEnd = storeInfo.distributionStart + 1 < 10 ?
							`0${storeInfo.distributionStart+1}:00` : `${storeInfo.distributionStart+1}:00`
					} else {
						this.payParams.distributionDate = this.GetDateStr(0,this.server_date).date
						let start = nt
						this.payParams.distributionTimeBegin = start < 10 ? `0${start}:00` : `${start}:00`
						this.payParams.distributionTimeEnd = start + 1 < 10 ? `0${start+1}:00` : `${start+1}:00`
					}
				}

			},
			/**
			 * 填写商品明细备注
			 */
			showRemarks(d) {
				d.btnText == '备注' ? d.btnText = '收起' : d.btnText = '备注';
				d.showRemarks == true ? d.showRemarks = false : d.showRemarks = true;
			},
			/**
			 * 选择支付方式
			 */
			toConfirmOrder() {
				this.$router.push({
					name: 'ChoiceOfPayment',
					params: {
						payParams: this.payParams,
						storeInfo: this.storeInfo,
						shopCarParam: {
							sellerId: this.$route.params.sellerId,
              sellerName: this.$route.params.storeName,
              distributionType: this.$route.params.distributionToday
						}
					}
				})
			},
			/**
			 * 确认订单
			 */
			toOrderCheckoutSuccess() {
				this.$dialog.loading.open("正在生成订单")
				this.createOrderObj.buyerId = this.userInfo.typeCode
				this.createOrderObj.buyerName = this.userInfo.loginName
				this.createOrderObj.sellerId = this.sellerInfo.sellerId
				this.createOrderObj.sellerName = this.sellerInfo.sellerName
				this.createOrderObj.comment = this.comment

				this.createOrderObj.shippingAdd = this.addressInfo.completeAddress // 配送地址
				this.createOrderObj.shippingAddId = this.addressInfo.id // 配送地址id

				// 自提无需填写收货地址
				if (this.payParams.wuliutype != 0 && (this.createOrderObj.shippingAdd == undefined || this.createOrderObj.shippingAddId == undefined)) {
					this.$dialog.alert({
						mes: '请选择收货地址',
						callback: () => {
							this.$dialog.loading.close()
						}
					})
					return false
				}

				this.createOrderObj.distributionType = this.payParams.wuliutype // 配送方式
				this.createOrderObj.payType = this.payParams.payType // 支付类型
				this.createOrderObj.distributionTimeEnd = `${this.payParams.distributionDate} ${this.payParams.distributionTimeEnd}:00` // 配送开始时间
				this.createOrderObj.distributionTimeBegin = `${this.payParams.distributionDate} ${this.payParams.distributionTimeBegin}:00` // 配送结束时间

				var arr = []
				for (var i in this.settlementGoods) {
					var o = {
						productId: this.settlementGoods[i].productId,
						productName: this.settlementGoods[i].productName,
						skuId: this.settlementGoods[i].skuId,
						skuName: this.settlementGoods[i].skuName,
						skuMeasure: this.settlementGoods[i].skuMeasure,
						skuMeasureName: this.settlementGoods[i].skuMeasureName,

						quantity: this.settlementGoods[i].quantity,
						comment: this.settlementGoods[i].remark,
						chargingModel: this.settlementGoods[i].chargingModel
					}
					if (this.settlementGoods[i].promotionPrice > 0 && this.settlementGoods[i].promotionBasePrice > 0) {
						o.oriPrice = this.settlementGoods[i].promotionBasePrice.mul(100)
						o.price = this.settlementGoods[i].promotionPrice.mul(100)
					} else {
						if(this.settlementGoods[i].basePrice){
							o.oriPrice = this.settlementGoods[i].basePrice.mul(100)
						} else {
							o.oriPrice = this.settlementGoods[i].oriPrice.mul(100)
						}
						o.price = this.settlementGoods[i].price.mul(100)
					}

					arr.push(o)
				}
				this.createOrderObj.orderitems = JSON.stringify(arr)

				// 如果为自提 配送地址和配送时间不用存入数据库 
				if (this.createOrderObj.distributionType == 0) {
					delete this.createOrderObj.distributionTimeBegin
					delete this.createOrderObj.distributionTimeEnd
					delete this.createOrderObj.shippingAddId
					delete this.createOrderObj.shippingAdd
				}
				this.createOrder(this.createOrderObj)
				// 获取报价单起配金额
				//         this.postRequest('quotation/listWithCount', {
				//           customerId: this.sellerInfo.sellerId,
				//           buyersId: this.userInfo.typeCode
				//         }).then(resp => {
				//           if (resp.data && resp.data.state == 0) {
				//             if (resp.data.aaData && resp.data.aaData[0]) {
				//               if (this.orderTotal / 100 < resp.data.aaData[0].startAmount) {
				//                 this.$dialog.loading.close()
				//                 this.$dialog.alert({
				//                   mes: `订单金额必须大于等于起配金额(￥${resp.data.aaData[0].startAmount})`
				//                 })
				//               } else {
				//                 this.createOrder(this.createOrderObj)
				//               }
				//             } else { // 不用判断报检单起配金额
				//             }
				//           }
				//         })
			},
			/**
			 * 创建订单
			 */
			createOrder(params) {
				this.postRequest('order/orderCreateByWebChatMall', params).then(resp => {
					if (resp.data && resp.data.state == 0) {
						this.$dialog.loading.close()
						this.$dialog.toast({
							mes: '保存成功',
							timeout: 1200,
							icon: 'success',
							callback: () => {
								this.del(params.sellerId)
								localStorage.removeItem('settlementParam')
								this.$router.push({
									name: 'OrderCheckoutSuccess',
									query: {
										orderId: resp.data.aaData[0].id,
										orderUmber: resp.data.aaData[0].orderUmber
									}
								})
							}
						});
					} else {
						this.$dialog.loading.close()
					}
				})
			},
			/**
			 * 获取收货人地址联系电话信息
			 */
			getAddress(id) {
				this.postRequest('address/queryByCustomerId', {
					customerId: this.userInfo.typeCode
				}).then(resp => {
					if (resp.data && resp.data.state == 0) {
						if (resp.data.aaData) {
							this.addressInfo = resp.data.aaData
						}
					}
				})
			},
			/**
			 * 删除购物车
			 */
			del(sellerId) {
				this.postRequest('shippingcar/queryGrouplist', {
					buyerId: this.userInfo.typeCode,
					sellerId: sellerId
				}).then(d => {
					if (d.data && d.data.state == 0) {
						for (var i in d.data.aaData) {
							if (sellerId == i) { //如果卖家id等于购物车中的卖家id就删除
								var items = d.data.aaData[i]
								for (var j in items) {
									this.deleteShopCarById(items[j].id)
								}
							}
						}
					}
				})
			},
			/**
			 * 删除购物车byId
			 */
			deleteShopCarById(id) {
				this.postRequest('shippingcar/delete', {
					id: id
				}).then(d => {
					if (d.data && d.data.state == 0) {}
				})
			},
			/**
			 * 选择收货地址
			 */
			goSelectAdd() {
				this.$router.push({
					name: 'UserAddress'
				})
			}
		}
	};
</script>
<style lang="scss">
	#OrderSettlement {
		.header {
			text-align: center;
			color: #fff;
			font-size: 0.27rem;
			padding: 0.3rem 0.25rem 1rem;

			h1 {
				font-size: 0.3rem;
				padding: 0.15rem 0;
				margin-right: 0.2rem;
			}
		}

		.content {
			margin-top: -0.8rem;
			width: 100%;
			padding: 0 0.16rem 0.16rem;

			.psinfocard {
				border-radius: 5px;
				padding: 0.16rem;
				background: #fff;

				h1 {
					font-size: 0.3rem;
				}

				.tar {
					color: #2F3927;

					p {
						padding: 0.05rem 0;
					}
				}
			}

			.prolist {
				border-radius: 5px;
				padding: 0.16rem;
				background: #fff;
				margin-top: 0.2rem;

				.title {
					h1 {
						font-size: 0.28rem;
						padding: 0 0.2rem;
					}
				}

				.line {
					height: 1px;
					background: #ddd;
				}

				ul.product-list {
					margin-top: 0.25rem;

					li {
						margin-bottom: 0.25rem;

						h3 {
							margin-bottom: 0.08rem;
						}

						.img {
							height: 0.75rem;
							width: 0.75rem;
							border-radius: 2px;
							margin-right: 0.2rem;
							overflow: hidden;

							img {
								width: 100%;
								height: 100%;
							}
						}

						.bzinput {
							margin-top: 0.16rem;
							height: 0.6rem;
							background: #FFEDBD;
							color: #989E92;
							padding-left: 0.1rem;
							border-radius: 5px;
						}

						.sl {
							padding-left: 10px;
						}
					}
				}

				.tongjisl {
					background: #EFEFF3;
					padding: 0.08rem;
					text-align: center;
				}

				.leavingaMsg {
					height: 0.8rem;
					border-bottom: 1px solid #ddd;
				}

				.smallplan {
					padding-top: 0.16rem;

					strong {
						font-size: 0.3rem;
					}
				}
			}
		}

		/**底部*/
		.yd-tabbar {
			padding: 0 !important;
			/*position: fixed;
			bottom: 0;
			z-index: 100000;*/
		}

		.tabbar {
			height: 0.98rem;

			.tips {
				padding-left: 0.25rem;
				color: #989E92;

				span:nth-child(1) {
					font-size: 0.35rem;
					color: #FF3D15;
					font-weight: 600;
					margin-right: 0.1rem;
				}
			}

			.tabbar-btn {
				height: 100%;
				padding: 0 0.66rem;
				line-height: 0.98rem;
				background: #FE971D;
				color: #fff;
				font-size: 0.3rem;
				position: absolute;
				right: 0;
			}
		}
	}
</style>
