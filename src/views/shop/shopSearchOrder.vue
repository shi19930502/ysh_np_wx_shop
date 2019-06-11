<template>
	<div id="quickLookOrder">
		<yd-infinitescroll :callback="getOrderList" ref="infinitescrollDemo">
			<div class="order-list" v-for="d in list" slot="list">
				<div class="order-head flex flex-x-between">
					<div @click="toShopEvaluate(d)">
						<strong style="font-size: 0.28rem;">{{d.sellerName}}</strong>
						<img class="list_icon_right" src="../../assets/imgs/list_icon_right.png">
					</div>
					<div style="font-size: 0.24rem;">{{d.orderStatusName}}</div>
				</div>
				
				<div class="card-body" @click="toOrderDetails(d.id,d.orderUmber)">
					<div class="list_style">采购商：{{d.buyerName}}</div>
				<div class="list_style">订单号：<span>{{d.orderUmber.slice(0,12)}}</span><span  style="color: #FF3D15;font-weight: bold;font-size: 15px;">{{d.orderUmber.slice(12,16)}}</span></div>
					<div class="flex flex-x-between flex-y-center">
						<div class="flex">
							<template v-for="orderitem,key in d.orderitemList">
								<div class="product-img" v-if="key<4">
									<img v-if="orderitem.productPicUrl" :src="imgURL+orderitem.productPicUrl" alt="">
									<img v-else src="../../assets/imgs/img_moren@2x.png">
								</div>
							</template>
						</div>
						
						<div v-show="d.orderitemList.length>4">
							<img src="../../assets/imgs/icon_more.png" style="width: 0.5rem;height: 0.1rem;">
						</div>
						<div class="tar">
							<p class="price">
								<span v-if="d.sortingOrderTotal==null && d.inspectedOrderTotal==null">{{'￥'+priceFormat(d.orderTotal)}}</span>
								<span v-show="d.sortingOrderTotal>0 && d.inspectedOrderTotal==null">{{'￥'+priceFormat(d.sortingOrderTotal)}}</span>
								<span v-show="d.inspectedOrderTotal>0">{{'￥'+priceFormat(d.inspectedOrderTotal)}}</span>
							</p>
							<p class="sl" style="font-size: 0.24rem;">共{{d.orderitemList.length}}件</p>
						</div>
					</div>
				</div>
				<div class="order-foot flex flex-x-between flex-y-center">
					<span class="time">{{d.createdDate}}</span>
					<div class="flex flex-x-end">
						<btn v-show="d.orderStatusId == 0" name="取消订单" @click="orderCancel(d.id)"></btn>
						<btn v-if='false' v-show="d.orderStatusId == 4 || d.orderStatusId == 5" name="再来一单" @click="aginOrder(d)"></btn>
						<btn v-if='false' v-show="d.orderStatusId == 4 || d.orderStatusId == 5" name="我要评价" @click="toEvaluate(d.id,d.sellerId,d.orderUmber)"></btn>

						<btn v-if='false' v-show="d.orderStatusId == 8" name="再来一单" @click="aginOrder(d)"></btn>

						<span style="padding: 0.1rem 0;color:#ef4f4f;" v-show="d.orderStatusId == 7">订单已取消</span>
					</div>
				</div>
			</div>
			<span slot="doneTip">没有更多数据啦</span>
		</yd-infinitescroll>
	</div>
</template>
<script>
	import infoCardList from '../component/infoCardList.vue'
	import btn from '../component/btn.vue'
	import mixin from '../../utils/mixin.js'
	import mixin_store from '../../utils/mixin_store.js'

	export default {
		components: {
			infoCardList,
			btn
		},
		mixins: [mixin, mixin_store],
		data() {
			return {
				list: [],
				pageNum: 1,
				pageSize: 10,
				byOrderStatusId: false

			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '订单中心')
			// 获取统计页面查询订单状态为 5. 8单子
			if(this.$route.query.byOrderStatusId) {
				this.byOrderStatusId = true
			}
			this.getOrderList()
		},
		mounted() {},
		methods: {
			/**
			 * 再来一单
			 */
			aginOrder(d) {
				for(var i in d.orderitemList) {
					d.orderitemList[i].btnText = '备注'
					d.orderitemList[i].showRemarks = false
					d.orderitemList[i].name = d.orderitemList[i].skuName
					d.orderitemList[i].id = d.orderitemList[i].skuId
					d.orderitemList[i].spinner = d.orderitemList[i].quantity
					d.orderitemList[i].remark = d.orderitemList[i].comment
					d.orderitemList[i].promotionPrice = d.orderitemList[i].promotionPrice / 100
					d.orderitemList[i].price = d.orderitemList[i].price / 100
				}
				var settlementParam = {
					settlementGoods: d.orderitemList,
				}
				localStorage.setItem('settlementParam', JSON.stringify(settlementParam))
				this.$router.push({
					name: 'OrderSettlement',
					query: {
						sellerId: d.sellerId,
						sellerName: d.sellerName,
						distributionType: 0
					}
				})
			},
			/**
			 * 我要评价
			 */
			toEvaluate(orderId, sellerId, orderUmber, type) {
				var param = {
					orderId: orderId,
					sellerId: sellerId,
					orderUmber: orderUmber
				}
				if(type) {
					param.type = 1
				}
				this.$router.push({
					name: 'OrderEvaluate',
					query: param
				})
			},
			/**
			 * 获取订单列表
			 */
			getOrderList() {
				this.postRequest('order/listByUser', {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					checkType: 'buy'
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						const _list = resp.data.aaData
						this.list = [...this.list, ..._list];
						if(_list.length < this.pageSize) {
							/* 所有数据加载完毕 */
							this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
							return;
						}
						/* 单次请求数据完毕 */
						this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
						this.pageNum++;
					}
				})
			},
			/**
			 * 订单详情
			 */
			toOrderDetails(orderId, orderUmber) {
				this.$router.push({
					name: 'QuickOrderDetails',
					query: {
						orderId: orderId,
						orderUmber: orderUmber
					}
				})
			},
			/**
			 * 取消订单
			 */
			orderCancel(id) {
				this.$dialog.confirm({
					title: '提示',
					mes: '确定取消该订单吗？',
					opts: () => {
						this.postRequest('order/update', {
							id: [id],
							state: 7
						}).then(resp => {
							if(resp.data && resp.data.state == 0) {
								this.$dialog.toast({
									mes: '取消成功',
									timeout: 1200,
									icon: 'success',
									callback: () => {
										for(var item of this.list) {
											if(item.id == id) {
												item.orderStatusId = 7
											}
										}
									}
								});
							}
						})
					}
				});
			},
			/**
			 * 查看店铺详情
			 */
			toShopEvaluate(d) {
				this.$router.push({
					name: 'ShopDetails',
					query: {
						sellerid: d.sellerId
					}
				})
			}
		}
	};
</script>
<style lang="scss" scoped>
	#quickLookOrder {
		.list_style{
			font-size: .26rem;
			font-weight: 700;
			padding: 0rem 0rem .15rem 0;
		}
		.order-list {
			background: #fff;
			margin-bottom: 0.25rem;
			.order-head {
				padding: 0.25rem;
				strong {
					font-size: 0.3rem;
					color: #2F3927;
				}
				img.list_icon_right {
					width: 0.14rem;
					height: 0.24rem;
					margin-left: .17rem;
				}
			}
			.card-body {
				padding: 0.3rem 0.25rem;
				background: #f9f9fb;
			}
			.order-foot {
				padding: 0.15rem 0.25rem;
				.time {
					color: #797D77;
				}
				.btn {
					margin-left: 0.2rem;
				}
			}
		}
	}
</style>