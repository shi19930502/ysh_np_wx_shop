<template>
	<yd-layout>
		<div class="Enshrine">
			<!-- 菜单导航 -->
			<!-- <menuTab></menuTab> -->
			<menuTab :item-click="menuclick" :dataList="menu"></menuTab>
			<ul class="list" v-show="showSellerList" v-if="sellerList.length>0">
				<li v-for="(d,index) in sellerList">
					<div class="flex flex-x-between flex-y-center">
						<div class="list-img">
							<img v-if="d.headPicUrl" :src="imgURL+d.headPicUrl" />
							<img v-else src="../../assets/imgs/img_dianpu.png">
						</div>
						<div class="flex-item-5 time">
							<p class="name"><strong>{{d.storeName}}</strong></p>
							<p style="color:#989E92">采购时间：{{d.distributionStart}}:00~{{d.distributionEnd}}:00</p>
							<div class="flex flex-y-center contact_sj">
								<img src="../../assets/imgs/mine_icon_phone.png">
								<span style="color:#4D7BFE;margin-left: 0.1rem;">
				            		<a :href="'tel:'+d.phoneNumber">联系商家</a>
				            	</span>
							</div>
						</div>
						<div class="flex-item-2 tar ">
							<div class="goShop" @click='goShop(d.sellerId)'>
								进店
							</div>
						</div>
					</div>
				</li>
			</ul>
			<div v-else class="empty" v-show="showSellerList">还没有收藏店铺 </div>
			<!-- 收藏商品  productcollection.length>0-->
			<yd-infinitescroll   v-if="showProductcollection" :callback="getProductcollection" ref="infinitescrollDemo">
				<ul class="list" slot="list" v-if="showProductcollection">
					<!--:key="d.id"-->
					<li v-for="(d,index) in productcollection" >
						<div class="flex flex-x-between flex-y-center">
							<div class="list-img">
								<img v-if="d.skuPic" :src="imgURL + d.skuPic ">
								<img v-else-if="d.proPic" :src="imgURL + d.proPic ">
								<img v-else-if="d.catPic" :src="imgURL + d.catPic ">
								<img v-else src="../../assets/imgs/img_moren.png">
							</div>
							<div class="flex-item-5 time">
								<p class="name_1"><strong>{{d.productName}}</strong></p>
								<p class="name_2">{{d.sellerName}}</p>
								<p v-if='d.price-d.promotionPrice>0' class="name_3">促销</p>
								<div class="name_4">
									<div :style="name_4Style(d.price-d.promotionPrice>0)">
										<span>￥</span>{{d.price}}
									</div>
									&nbsp;
									<div v-if='d.price-d.promotionPrice>0'>
										<span>￥</span>{{d.promotionPrice}}
									</div>
								</div>
							</div>
							<div class="flex-item-3 settleMoney tar">
								<template v-if='d.quantity==""||d.quantity>0'>
									<img @click='countQuantity(d,index,0)' class="minus" src="../../assets/imgs/caigou_icon_jian.png">
									<yd-input max='6' @change.native="countQuantity(d,index,2)" type="number"  class='input' v-model="d.quantity" :show-clear-icon='false' :show-success-icon='false' :show-error-icon='false'></yd-input>
								</template>
								<img @click='countQuantity(d,index,1)' class="add" src="../../assets/imgs/caigou_icon_add.png">
							</div>
						</div>
					</li>
				</ul>
				<span slot="doneTip">没有更多商品啦</span>
			</yd-infinitescroll>
			<div v-else class="empty" v-show="showProductcollection">还没有收藏商品 </div>
			<div v-show='showProductcollection' class="kong_div"></div>
			<div v-show='showProductcollection'  class="go_shop_car">
				<div class="go_shop_car_top">
					<div class="all_money">￥{{shopCar.shopMoney}}</div>
					<div class="shop_number">商家<span>{{shopCar.shopNum}}</span>/商品<span>{{shopCar.commodityNum}}</span></div>
				</div>
				<div @click='goShopCar' class="go_shop_car_btn">购物车<span>({{shopCar.commodityNum}})</span></div>
			</div>
		</div>
		
	</yd-layout>
</template>
<script>
	import menuTab from '../component/menu.vue'
	import mixin from '../../utils/mixin.js'
	import mixin_store from '../../utils/mixin_store.js'

	export default {
		mixins: [mixin, mixin_store],
		components: {
			menuTab,
		},
		data() {
			return {
				pageNum : 1,
                pageSize: 10,
				menu: ['收藏商品', '收藏商家'],
				showSellerList: false,
				sellerList: [],
				showProductcollection: true,
				productcollection: [],
				shopCar:{
					shopNum:0,
					commodityNum:0,
					shopMoney:"0.00",
				}
			}
		},
		created() {
			this.getQueryGrouplist()
		},
		mounted() {
			this.$store.dispatch('changeNavBarTitle', '我的收藏')
		},
		methods: {
			/**
			 * 请求购物车数据
			 */
			getQueryGrouplist(flg) {
				this.postRequest('shippingcar/queryGrouplist', {
					buyerId: this.userInfo.typeCode,
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						var shopNum=0;
						this.queryGrouplist=[];
						this.shopCar.shopMoney='0.00'
						for(var key in resp.data.aaData){
							shopNum++
							this.queryGrouplist=this.queryGrouplist.concat(resp.data.aaData[key]) 
						}
						//footer购物车 店铺数量，总价格，商品数量
						this.shopCar.shopNum=shopNum
						this.shopCar.commodityNum=this.queryGrouplist.length
						for(let a=0;a<this.queryGrouplist.length;a++){  
							var money=parseFloat(this.queryGrouplist[a].price)*parseFloat(this.queryGrouplist[a].quantity)
							this.shopCar.shopMoney=(parseFloat(this.shopCar.shopMoney)+money).toFixed(2)
						}
						if(flg){
							this.addQuantity(this.productcollection,this.queryGrouplist)
						}else{
							this.getProductcollection(true)
						}
						
					}
				})
			},
			/**
			 * 点击商品分类
			 */
			menuclick(index) {
				if(index == 1) {
					this.showSellerList = true
					this.showProductcollection = false
					this.getSellerList()
				} else {
					this.showProductcollection = true
					this.showSellerList = false
					this.productcollection=[]
					this.pageNum=1
					this.getProductcollection(true)
				}
			},
			/**
			 * 获取收藏的供应商
			 */
			getSellerList() {
				var vm = this
				vm.sellerList = [];
				this.postRequest('suppliercollection/querySellerByCustomerId', {
					customerId: this.userInfo.typeCode,
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						if(resp.data.aaData) {
							for(let i in resp.data.aaData) {
								this.getStore(resp.data.aaData[i].sellerId, function(store) {
									var o = Object.assign(store, resp.data.aaData[i])
									vm.sellerList.push(o)
								})
							}
						}
					}
				})
			},
			/**
			 * 获取收藏品
			 */
			getProductcollection(flg) {
//				this.$dialog.loading.open('商品加载中');
                this.postRequest('Productcollection/querylistByCustomerId', {
					customerId: this.userInfo.typeCode,
					pageNum : this.pageNum,
                    pageSize : this.pageSize,
				}).then( (resp) =>{
                    if(resp.data && resp.data.state == 0) {
						this.addQuantity(resp.data.aaData,this.queryGrouplist)
						this.productcollection = [...this.productcollection, ...resp.data.aaData];

	                    if (this.productcollection.length >= resp.data.dataCount) {
	                        /* 所有数据加载完毕 */
	                        this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
	                        return;
	                    }
	                    /* 单次请求数据完毕 */
	                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
	                    this.pageNum++;
					}
                    
                });
            },
            /**
			 * 给productcollection加quantity参数和update的id
			 */
            addQuantity(productcollectionArr,queryGrouplistArr){
            	for(let m = 0; m < productcollectionArr.length; m++) {
					for(let n = 0; n < queryGrouplistArr.length; n++) {
						if(productcollectionArr[m].skuId == queryGrouplistArr[n].skuId) {
							if(queryGrouplistArr[n].quantity!=null&&queryGrouplistArr[n].quantity){
								productcollectionArr[m].quantity = queryGrouplistArr[n].quantity.toFixed(2)
							}
							productcollectionArr[m].id = queryGrouplistArr[n].id
						}
					}
				}
            },
			/**
			 * 添加和减少商品数量
			 */
			//0为减，1为加
			countQuantity(d, index,flgNum) {
				var param={};
				var url = '';
				if(flgNum==2&&d.quantity==''){
					
				}
				param={
					buyerId:d.customerId,
					productId:d.productId,
					productName:d.productName,
					skuId:d.skuId,
					skuName:d.skuName,
					quantity:1,
					comment:'',
					sellerId:d.sellerId, 
				}
				if(d.quantity && d.quantity > 0) {
					url = 'shippingcar/update'
					if(flgNum==1){
						d.quantity = (parseFloat(d.quantity)  + 1).toFixed(2);
					}else if(flgNum==0){
						d.quantity = (parseFloat(d.quantity)  - 1).toFixed(2);
						d.quantity<0?d.quantity=0:d.quantity=d.quantity
						if(d.quantity==0){
							url = 'shippingcar/delete'
						}
					}
					param.quantity=d.quantity
					Object.assign(param,{id:d.id})
				} else if(flgNum == 2) {
					param.quantity=d.quantity
					Object.assign(param,{id:d.id})
					url = 'shippingcar/delete'
				}else{
					url = 'shippingcar/create'
				}
				this.postRequest(url, param).then((resp) => {
					if( resp.data.state == 0&& resp.data.msg=='success'){
//						this.getQueryGrouplist()
						this.getQueryGrouplist(true)
					}
				})
			},
			name_4Style(flg) {
				if(flg) {
					return {
						textDecoration: ' line-through',
						color: 'rgb(121, 125, 119)',
						fontSize: '.24rem'
					}
				}
				return {}
			},
			/**
			 * 跳转到商店
			 */
			goShop(sellerId) {
				this.$router.push({name:'Merchant',query:{sellerId:sellerId}})
			},
			goShopCar(){
				this.$router.push({name:'ShopCar'})
			}
		}
	};
</script>
<style lang="scss">
	.Enshrine {
		ul.list {
			li {
				padding: 0.25rem;
				border-bottom: 1px solid #ddd;
				.list-img {
					flex-grow: 0;
					width: 1.52rem;
					margin-right: 0.25rem;
					width: 1.52rem;
					height: 1.52rem;
					img {
						width: 100%;
						height: 100%;
					}
				}
				.time,
				.tar {
					width: 2rem;
				}
				p {
					line-height: .4rem;
				}
				p.name {
					font-size: 0.27rem;
					padding-bottom: 0.06rem;
				}
				.name_1 {
					color: #2F3927;
					font-size: .3rem;
				}
				.name_2 {
					color: #797D77;
					font-size: .2rem;
				}
				.name_3 {
					display: inline-block;
					padding: .03rem;
					margin: 0 0 .11rem 0;
					font-size: .2rem;
					line-height: .24rem;
					color: white;
					border-radius: 2px;
					background: -webkit-linear-gradient(180deg, #FF3D15, #FF7316);
					/* Safari 5.1 - 6.0 */
					background: -o-linear-gradient(180deg, #FF3D15, #FF7316);
					/* Opera 11.1 - 12.0 */
					background: -moz-linear-gradient(180deg, #FF3D15, #FF7316);
					/* Firefox 3.6 - 15 */
					background: linear-gradient( 180deg, #FF3D15, #FF7316);
					/* 标准的语法 */
				}
				.name_4 {
					color: #FF3D15;
					font-size: .32rem;
					line-height: .4rem;
					display: flex;
					span {
						font-size: .24rem;
						padding-right: .03rem;
					}
				}
			}
			background: #fff;
		}
		.settleMoney {
			display: flex;
			justify-content: flex-end;
			img {
				width: .56rem;
				height: .56rem;
			}
			.input {
				width: 1.1rem;
				height: .56rem;
				background: rgba(242, 242, 242, 1);
				border-radius: 4px;
				text-align: center;
				input {
					text-align: center;
				}
			}
		}
		.contact_sj {
			width: 1.4rem;
			height: .36rem;
			display: flex;
			border: 1px solid #4D7BFE;
			border-radius: .04rem;
			align-items: center;
			margin: .1rem;
			img {
				width: .2rem;
				height: .2rem;
				margin-left: .01rem;
			}
		}
		.goShop {
			width: 1.2rem !important;
			height: .56rem;
			color: #6FB138;
			text-align: center;
			margin: auto;
			line-height: .56rem;
			border: 1px solid #6FB138;
			border-radius: 0.08rem;
		}
		.kong_div{
			width: 100%;
			height: .98rem;
			height: .98rem;
			background: transparent;
		}
		.go_shop_car{
			display: flex;
			align-items: center;
			padding: 0 0 0 .31rem;
			width: 100%;
			height: .98rem;
			position: fixed;
			bottom: 0;
			background:rgba(59, 110, 17, 0.2);
			background: white;
			z-index: 99999;
			.go_shop_car_top{
				width: 4rem;
				flex-grow: 1;
				align-items: center;
				display: flex;
				.all_money{
					color: #FF3D15;
					font-size: .36rem;
					margin: 0 .18rem 0 0 ;
				}
				.shop_number{
					/*width: 1.35rem;*/
					font-size:.2rem;
					color: #797D77;
				}
			}
			.go_shop_car_btn{
				background: #FE971D;
				color: white;
				font-size: .36rem;
				height: .98rem;
				line-height: .98rem;
				padding: 0 .53rem;
				span{
					font-size: .28rem;
				}
			}
		}
	}
</style>