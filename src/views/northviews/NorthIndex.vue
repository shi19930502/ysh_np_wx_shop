<template>
	<div id="northIndex">
		<div class="header">
			<div class="logo-wrap flex flex-x-between flex-y-center">
				<div class="logo"><img src="../../assets/imgs/northring/logo@2x.png" alt=""></div>
				<div class="loginbtn flex flex-y-center flex-x-center" @click="toLogin">立即登录</div>
			</div>
			<div class="logo-text">
				<img src="../../assets/imgs/northring/logo_text.png" alt="">
			</div>
			<div class="texts">
				<p>塞上农鲜汇是宁夏农鲜汇农业科技发展有限公司倾力打造的</p>
				<p>生鲜网上批发市场品牌，以银川北环批发市场为依托，</p>
				<p>以”互联网+”及新零售思想为载体，以信息化技术为手段，通过线上线下融合模式，</p>
				<p>实现从一批到餐桌的全流程溯源管理</p>
			</div>
		</div>

		<section class="QR-wrap">
			<div class="QR-bg flex flex-x-center flex-y-center">
				<img src="../../assets/imgs/northring/sys_text@2x.png" class="sys_text">
				<img src="../../assets/imgs/northring/QR.png" class="QR">
				<img src="../../assets/imgs/northring/yjkj_text@2x.png" class="yjkj_text">
			</div>
			<div class="slogans flex flex-x-center">
				<div class="item">
					<img src="../../assets/imgs/northring/icon_spanq.png" alt="">
					<p>食品安全</p>
					<p>保证</p>
				</div>
				<div class="item">
					<img src="../../assets/imgs/northring/icon_wul@2x.png" alt="">
					<p>专业物流</p>
					<p>配送</p>
				</div>
				<div class="item">
					<img src="../../assets/imgs/northring/icon_bjxd@2x.png" alt="">
					<p>便捷在线</p>
					<p>下单</p>
				</div>
				<div class="item">
					<img src="../../assets/imgs/northring/icon_znyj@2x.png" alt="">
					<p>智能硬件</p>
					<p>支持</p>
				</div>
			</div>
		</section>
		<!-- 批发中心 -->
		<div class="item-title">
			<img src="../../assets/imgs/northring/name_di@2x.png" class="bg">
			<div class="title-text">批发中心</div>
		</div>
		<section class="pfzx-wrap">
			<div class="h3">简要介绍</div>
			<p class="jyjsp">以市场监管为依托，严格控制入场交易的商品来源信息。将
				一批的商品交易行情在平台展示，为一批和二批提供撮合服
				务，线上线下均可交易。</p>
			<div class="h3">我们的优势</div>
			<div class="youshi">
				<div class="flex" style="margin-top: 0.2rem;">
					<img src="../../assets/imgs/northring/icon_zishikekao@2x.png" class="icon">
					<div>
						<strong>资质可靠</strong>
						<p>所有一级批发商必须提交资质证明方可入驻平台</p>
					</div>
				</div>
				<div class="flex" style="margin-top: 0.2rem;">
					<img src="../../assets/imgs/northring/icon_laiyuan@2x.png" class="icon">
					<div>
						<strong>来源可溯</strong>
						<p>所有纳入平台的商品必须有来源证明</p>
					</div>
				</div>
				<div class="flex" style="margin-top: 0.2rem;">
					<img src="../../assets/imgs/northring/icon_jiage@2x.png" class="icon">
					<div>
						<strong>价格透明</strong>
						<p>线上线下统一价，线下可扫码购买线上可远程订购</p>
					</div>
				</div>
				<div class="flex" style="margin-top: 0.2rem;">
					<img src="../../assets/imgs/northring/icon_dianzi@2x.png" class="icon">
					<div>
						<strong>电子结算</strong>
						<p>农批交易电子化，多种支付方式集成告别手工记账，告别手抄单据</p>
					</div>
				</div>
				<div class="flex" style="margin-top: 0.2rem;">
					<img src="../../assets/imgs/northring/icon_peis@2x.png" class="icon">
					<div>
						<strong>配送服务</strong>
						<p>平台为采购商提供配送服务再也不用凌晨跑批发市场拉货</p>
					</div>
				</div>
			</div>
			<div class="regbtn gradient flex flex-x-center flex-y-center" @click="toReg">立即注册</div>
		</section>
		<!-- 团体采购 -->
		<div class="item-title">
			<img src="../../assets/imgs/northring/name_di@2x.png" class="bg">
			<div class="title-text">团体采购</div>
		</div>
		<section class="ttcg-wrap">
			<div class="h3">简要介绍</div>
			<p class="jyjsp">为餐饮店、机关食堂、学校食堂提供一站式的采购及配送服
				务，平台将场内交易的行情在平台发布，让团体单位也能享
				受到一批的价格。</p>
			<div class="h3">适用单位</div>
			<div>
				<img src="../../assets/imgs/northring/img_canting@2x.png" style="width: 100%;margin-top: 0.4rem;">
				<div class="flex flex-x-between">
					<img src="../../assets/imgs/northring/img_shiy@2x.png" style="width: 2.91rem; height: 2rem;margin-top: 0.2rem;">
					<img src="../../assets/imgs/northring/imgqiye@2x.png" style="width: 2.91rem;height: 2rem;margin-top: 0.2rem;">
				</div>
			</div>
			<div class="regbtn gradient flex flex-x-center flex-y-center" @click="toReg">立即注册</div>
		</section>
		<section>
			<img src="../../assets/imgs/northring/img_huabian@2x.png" style="width: 100%;">
		</section>
		<section class="grcg-wrap">
			<!-- 团体采购 -->
			<div class="item-title">
				<img src="../../assets/imgs/northring/name_di@2x.png" class="bg">
				<div class="title-text">个人采购</div>
			</div>
			<div style="width: 6.8rem; padding: 0 0.24rem;margin: 0 auto;">
				<p class="jyjsp">平台纳入优质社区门店为个人及家庭用户服务，社区门店入驻平台，可在线销售从批发中心采购的商品，并为个人及家庭用户提供最后一公里的配送服务。</p>
				<div class="regbtn gradient flex flex-x-center flex-y-center" @click="toReg">立即注册</div>
			</div>
		</section>
		<!--商品分类列表 -->
		<!--商品分类列表 -->
		<div class="category-list">
			<div class="menu">
				<div class="menu-tab" style="overflow-x: auto;min-height: calc(0.81rem + 5px);">
					<ul class="flex">
						<template v-for="(d, index) in home_categoryList">
							<li :class="d.isActive?'active':''" :style="'min-width: ' + (d.name.length*0.3 +0.5) + 'rem'" @click="lv1CategoryChange(d)">
								<strong>{{d.name}}</strong>
							</li>
						</template>
					</ul>
				</div>
			</div>
		</div>
		<section class="todays-wrap">
			<div class="h3">商品价格走势</div>
			<div id="priceChart"></div>
			<div class="h3">行情明细</div>
			<table class="todays-table">
				<thead>
					<tr>
						<th width="40%">商品</th>
						<th width="20%">最低价(元)</th>
						<th width="20%">最高价(元)</th>
						<th width="20%">平均价(元)</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="d in tableData" v-if="tableData.length>0">
						<td>{{d.productName}}</td>
						<td>{{d.minPrice}}</td>
						<td>{{d.maxPrice}}</td>
						<td>{{d.avgPrice}}</td>
					</tr>
					<tr>
						<td colspan="4">暂无数据</td>
					</tr>
				</tbody>
			</table>
		</section>
		<section class="footer flex flex-x-center flex-y-center">版权所有：宁夏农鲜汇农业科技发展有限公司</section>
	</div>
</template>
<script>
	import mixin from '../../utils/mixin.js'
	import echarts from 'echarts'
	export default {
		mixins: [mixin],
		data() {
			return {
				pageNum: 1,
				pageSize: 10,
				tableDataCount: 0,
				tableData: [],
				pageTatol: 0,
				// 客户类型 个人005
				customerProperty: '',
				stores: [],
				home_categoryList: [],
				gbgoodsId: ''
			}
		},
		watch: {
			gbgoodsId: 'renderPriceChart'
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '塞上农鲜汇')
			this.queryMoreProductPrice()
			this.getCategoryList()
		},
		mounted() {
			this.renderPriceChart()
		},
		methods: {
			/**
			* 处理是否选择数据
			*/
			addActiveStatus(arr) {
				var activeCount = 0
				for (var i in arr) {
					if (i == activeCount) {
						arr[i].isActive = true
					} else {
						arr[i].isActive = false
					}
				}
				return arr
			},
			/**
			 * 一级分类点击
			 */
			lv1CategoryChange(d) {
				if (!d.isActive) {
					d.isActive = true
				}
				for (var item of this.home_categoryList) { // 选中
					if (d.id != item.id) {
						item.isActive = false
					}
				}
				this.gbgoodsId = d.gbgoodsId
			},
			/**
			 * 获取分类列表
			 */
			getCategoryList(sellerId) {
				this.postRequest('category/childList', {
					parentCategoryId: 'top',
					filteEnabled: 1,
					filteDeleted: 0,
					orderField: 't.f_id',
					supplierId: sellerId || '',
					onlyLv2: true
				}).then(resp => {
					if (resp && resp.data && resp.data.state == 0) {
						this.home_categoryList = this.addActiveStatus(resp.data.aaData)
					}
				})
			},
			/**
			 * 立即注册
			 */
			toReg() {
				this.$router.push({
					name: 'NorthUserReg'
				})
			},
			/**
			 * 立即登录
			 */
			toLogin() {
				this.$router.push({
					name: 'Login'
				})
			},
			/**
			 * 今日行情
			 */
			queryMoreProductPrice() {
				this.postRequest('productsku/queryMoreProductPrice', {
					channelCode: this.channelCode,
					productType: this.gbgoodsId || '0',
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then((resp) => {
					if (resp.data && resp.data.state == 0) {
						if (resp.data.aaData) {
							this.tableData = resp.data.aaData
							this.tableDataCount = resp.data.dataCount
						}
					}
				})
			},
			/**
			 * 价格走势
			 */
			queryProductPrice() {
				let params = {
					channelCode: this.channelCode,
					productType: this.gbgoodsId || '0',
					startTime: this.GetDateStr(-30).date,
					endTime: this.GetDateStr(0).date
				}
				return new Promise((resolve, reject) => {
					this.postRequest('productsku/queryProductPrice', params).then((resp) => {
						if (resp.data && resp.data.state == 0) {
							if (resp.data.aaData) {
								resolve(resp.data.aaData)
							} else {
								resolve(resp.data.msg)
							}
						}
					})
				})
			},
			/**
			 * 渲染价格图表
			 */
			async renderPriceChart() {
				// 基于准备好的dom，初始化echarts实例
				let priceData = await this.queryProductPrice()
				let legendData = []
				let xAxisData = []
				let seriesData = []
				for (let i in priceData) {
					let obj = {
						name: i,
						type: 'line',
						stack: '价格',
						data: priceData[i][1]
					}
					seriesData.push(obj)
					legendData.push(i)
					xAxisData = priceData[i][0]
				}


				let myChart = echarts.init(document.getElementById('priceChart'));
				let option = {
					// 					title: {
					// 						text: '商品价格走势',
					// 						textStyle:{
					// 							fontSize: 16
					// 						}
					// 					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						// data: ['邮件营销', '联盟广告', '视频广告']
						data: legendData
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						top: '3%'
						// containLabel: true
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						// data: ['周一', '周二', '周三']
						data: xAxisData
					},
					yAxis: {
						type: 'value'
					},
					series: seriesData
					// 					[{
					//               name: '羊肉',
					//               type: 'line',
					//               stack: '总量',
					//               data: [120, 132, 101]
					//             }
					//           ]
				};
				myChart.setOption(option);
			},
		}
	};
</script>
<style lang="scss">
	@import "./north-index.scss";
</style>
