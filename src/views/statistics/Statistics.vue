<template>
	<div id="Statistics">
		<div class="top flex flex-x-between">
			<div class="item">
				<p>采购支出(元)</p>
				<strong>{{totalAmount}}</strong>
			</div>
			<!--<div class="line"></div>
      <div class="item">
        <p>账户余额</p>
        <strong style="color:#FF6A16">4856532.00</strong>
      </div>-->
		</div>
		<div class="chart">
			<yd-tab v-model="tab" :callback="fn" :prevent-default="false" :item-click="itemClick">
				<yd-tab-panel label="采购金额统计(元)">
					<div id="main" style="height:5rem;"></div>
				</yd-tab-panel>
				<yd-tab-panel label="采购重量统计(千克)">
					<div id="main2" style="height:5rem;"></div>
				</yd-tab-panel>
			</yd-tab>
		</div>
		<!-- 账单明细 -->
		<div class="zdmx-warp">
			<h1>账单明细</h1>
			<template v-if="list.length>0">
				<ul>
					<li v-for="d in list" class="flex flex-x-between flex-y-center">
						<div class="flex">
							<div class="tac">
								<div>{{d.createdDate.split(' ')[0]}}</div>
								<div>{{d.createdDate.split(' ')[1]}}</div>
							</div>
							<div class="img">
								<img v-if="d.orderitemList.length>0&&d.orderitemList[0].productPicUrl" :src="imgURL+d.orderitemList[0].productPicUrl" alt="">
								<img v-else src="../../assets/imgs/img_moren.png">
							</div>
							<div>
								<h3 v-if="d.orderitemList.length>0">{{d.orderitemList[0].productName}}等{{d.orderitemList.length}}件商品</h3>
								<h3 v-else>{{d.orderitemList.length}}件商品</h3>

								<p>{{d.sellerName}}</p>
							</div>
						</div>
						<div>
							<strong>{{'￥'+priceFormat(d.inspectedOrderTotal)}}</strong>
						</div>
					</li>
				</ul>
				<div class="btn tac" @click="toAllPurchase">查看全部</div>
			</template>
			<template v-else>
				<div class="flex flex-x-center flex-y-center" style="height: 3.5rem">
					<div>
						<img src="../../assets/imgs/my_default_img.png" />
						<p style="color: #999;" class="tac">暂无账单明细</p>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>
<script>
	import echarts from 'echarts'
	import mixin from '../../utils/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				tab: 0,
				list: [],
				totalAmount: 0
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '统计分析')
			this.getOrderList()
			this.buyTotalPriceByTimeInterval()
		},
		mounted() {
			this.buyDayTotalPriceByTimeInterval()

		},
		methods: {
			fn(label, key) {
				if(key == 1) {
					this.buyDayTotalWeightByTimeInterval()
				} else {
					this.buyDayTotalPriceByTimeInterval()
				}
			},
			itemClick(key) {
				this.$dialog.loading.open('数据加载中');
				setTimeout(() => {
					this.tab = key;
					this.$dialog.loading.close();
				}, 100);
			},
			/**
			 * 获取采购总金额
			 */
			buyTotalPriceByTimeInterval() {
				this.postRequest('order/buyTotalPriceByTimeInterval', {
					buyerId: this.userInfo.typeCode,
//					startTime: this.GetDateStr(-7).date,
//					endTime: this.GetDateStr(0).date,
				}).then(d => {
					if(d.data && d.data.state == 0) {
						if(d.data.aaData && d.data.aaData[0]) {
							this.totalAmount = d.data.aaData[0].totalAmount
						}
					}
				})
			},
			/**
			 * 全部采购
			 */
			toAllPurchase() {
				this.$router.push({
					name: 'Order',
					query: {
						byOrderStatusId: true
					}
				})
			},
			/**
			 * 获取订单列表
			 */
			getOrderList() {
				this.postRequest('order/listByUser', {
					//					pageNum: 1,
					//					pageSize: 20
					startTime: this.GetDateStr(-7).date,
					endTime: this.GetDateStr(0).date,
					checkType: 'buy'
				}).then(d => {
					if(d.data && d.data.state == 0) {
						var a = []
						for(var item of d.data.aaData) {
							if(item.orderStatusId == 5 || item.orderStatusId == 8) {
								if(a.length < 5) {
									a.push(item)
								}
							}
						}
						this.list = a
					}
				})
			},
			/**
			 * 获取采购金额统计
			 */
			buyDayTotalPriceByTimeInterval() {
				this.postRequest('order/buyDayTotalPriceByTimeInterval', {
					buyerId: this.userInfo.typeCode,
					startTime: this.GetDateStr(-7).date,
					endTime: this.GetDateStr(0).date,
				}).then(d => {
					if(d.data && d.data.state == 0) {
						if(d.data.aaData.length > 0) {
							// 横坐标数据
							var xAxisData = []
							// 纵坐标数据
							var seriesData = []
							for(var i in d.data.aaData) {
								xAxisData.push(d.data.aaData[i].f_date.substr(5, 9))
								if(d.data.aaData[i].day_totalAmount) {
									seriesData.push(d.data.aaData[i].day_totalAmount)
								} else {
									seriesData.push(0)
								}
							}
							this.setChartData('main', xAxisData, seriesData)
						} else {
							var xAxisData = []
							var seriesData = []
							for(var i = -6; i > 1; i--) {
								xAxisData.push(this.GetDateStr(i).date.substr(5, 9))
								seriesData.push(0)
							}
							this.setChartData('main', xAxisData, seriesData)
						}
					} else {
						var xAxisData = []
						var seriesData = []
						for(var i = -6; i > 1; i--) {
							xAxisData.push(this.GetDateStr(i).date.substr(5, 9))
							seriesData.push(0)
						}
						this.setChartData('main', xAxisData, seriesData)
					}
				})
			},
			/**
			 * 获取采购重量统计
			 */
			buyDayTotalWeightByTimeInterval() {
				this.postRequest('order/buyDayTotalWeightByTimeInterval', {
					buyerId: this.userInfo.typeCode,
					startTime: this.GetDateStr(-7).date,
					endTime: this.GetDateStr(0).date,
				}).then(d => {
					if(d.data && d.data.state == 0) {
						if(d.data.aaData.length > 0) {
							// 横坐标数据
							var xAxisData = []
							// 纵坐标数据
							var seriesData = []
							for(var i in d.data.aaData) {
								xAxisData.push(d.data.aaData[i].f_date.substr(5, 9))
								if(d.data.aaData[i].day_totalWeight) {
									seriesData.push(d.data.aaData[i].day_totalWeight)
								} else {
									seriesData.push(0)
								}
							}
							this.setChartData('main2', xAxisData, seriesData)
						} else {
							var xAxisData = []
							var seriesData = []
							for(var i = -6; i > 1; i--) {
								xAxisData.push(this.GetDateStr(i).date.substr(5, 9))
								seriesData.push(0)
							}
							this.setChartData('main2', xAxisData, seriesData)
						}
					} else {
						var xAxisData = []
						var seriesData = []
						for(var i = -6; i > 1; i--) {
							xAxisData.push(this.GetDateStr(i).date.substr(5, 9))
							seriesData.push(0)
						}
						this.setChartData('main2', xAxisData, seriesData)
					}
				})
			},
			/**
			 * 设置图表
			 */
			setChartData(id, xAxisData, seriesData) {
				var myChart = echarts.init(document.getElementById(id));
				// 图表左边的距离
				var max = Math.max.apply(null, seriesData);
				var xLeft = 0
				if(max <= 1) {
					xLeft = 35
				} else if(max >= 10 && max < 100) {
					xLeft = 33
				} else if(max >= 100 && max < 1000) {
					xLeft = 40
				} else if(max >= 1000 && max < 10000) {
					xLeft = 45
				} else if(max > 10000000) {
					xLeft = 65
				} else {
					xLeft = 45
				}
				var option = {
					grid: {
						x: xLeft,
						y: 20,
						x2: 15,
						y2: 65,
						borderWidth: 1
					},
					title: {
						text: '近一周采购走势统计',
						textStyle: {
							fontSize: 14,
							color: '#6FB138'
						},
						left: 'center',
						bottom: 10
					},
					xAxis: {
						type: 'category',
						data: xAxisData,
						axisLine: {
							lineStyle: {
								color: '#6FB138',
							}
						}
					},
					yAxis: {
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#6FB138',
							}
						},
						splitLine: {
							show: true,
							//  改变轴线颜色
							lineStyle: {
								// 使用深浅的间隔色
								color: ['#6FB138'],
								opacity: 0.2
							}
						},
						axisLabel: {
							formatter: function(value, index) {
								if(value >= 10000 && value < 10000000) {
									value = value / 10000 + "万";
								} else if(value >= 10000000) {
									value = value / 10000000 + "千万";
								}
								return value;
							}
						},
					},
					series: [{
						data: seriesData,
						type: 'line',
						areaStyle: {
							opacity: 0.4
						},
						itemStyle: {
							normal: {
								label: {
									show: true,
									position: 'top',
									formatter: '{c}',
									textStyle: {
										color: '#6FB138 ',
										fontSize: 10,
									}
								},
							}
						},
						smooth: true
					}],
					color: '#6FB138',
					textStyle: {
						color: '#6FB138'
					}
				};
				myChart.setOption(option);
			},
		}
	};
</script>
<style lang="scss">
	#Statistics {
		.yd-tab-nav-item.yd-tab-active{
			color: #6FB138 !important;
		}
		.yd-tab-nav {
			color: #6FB138 !important;
		}
		.top {
			margin-bottom: 0.2rem;
			background: #fff;
			padding: 0.5rem 0;
			.line {
				width: 1px;
				height: 0.85rem;
				background: #ddd;
			}
			.item {
				width: 100%;
				padding-left: 0.25rem;
				p {
					color: #797D77;
					margin-bottom: 0.1rem;
				}
				strong {
					font-size: 0.56rem;
				}
			}
			.chart {
				.yd-tab-nav-item:not(:last-child):after {
					border-right: none !important;
				}
			}
		}
		.zdmx-warp {
			h1 {
				font-size: 0.33rem;
				padding: 0.25rem;
				background: #fff;
			}
			ul {
				li:nth-child(odd) {
					background: #F9F9F9;
				}
				li:nth-child(even) {
					background: #fff;
				}
				li {
					padding: 0.25rem;
					.img {
						width: 0.6rem;
						height: 0.6rem;
						border-radius: 0.3rem;
						margin: 0 0.2rem;
						img {
							width: 100%;
							height: 100%;
						}
					}
					p {
						color: #989E92;
					}
					strong {
						font-size: 0.3rem;
					}
				}
			}
		}
		.btn {
			padding: 0.25rem;
			color: #6FB138;
			background: #fff;
		}
	}
</style>