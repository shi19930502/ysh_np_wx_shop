<template>
	<yd-layout id="ShopCar">
		<div class="list" v-for='(item,index) in allShopArr'>
			<div>
				<div class="select_a_shop">
					<div class="select_a_shop_name">
						<van-checkbox @change='selectAll(item,item.checkAll,item.idArr)' v-model="item.checkAll"></van-checkbox>
						<div class="name">{{item.name}}&nbsp;></div>
					</div>
					<yd-icon name="delete" @click.native="delShop(item)" size="0.36rem"></yd-icon>
				</div>
				<div class="check_box">
					<van-checkbox-group @change='selectOne(item,item.idArr)' v-model="item.idArr">
						<van-checkbox :label-disabled='true' v-for="(list, index) in item.sp" :key="list.id" :name="list.id">
							<div class="left">
								<img v-if='list.skuPicUrl' :src="imgUrl+list.skuPicUrl" alt="" />
								<img v-else-if='list.proPicUrl' :src="imgUrl+list.proPicUrl" alt="" />
								<img v-else-if='list.catPic' :src="imgUrl+list.catPic" alt="" />
								<img v-else src="../../assets/imgs/img_moren.png">
								<div class="commodity">
									<div class="commodity_1">{{list.productName}}</div>
									<div class="commodity_2">{{list.skuName}}</div>
									<div class="commodity_3">￥{{list.promotionPrice}}</div>
								</div>
							</div>
							<div class="numjiajian flex flex-x-end">
								 <van-stepper @change='addOrMinus(list,list.quantity)' v-model="list.quantity"  integer :max="9999" />
							</div>
						</van-checkbox>
					</van-checkbox-group>
				</div>
			</div>
			<div class="small_money">
				<div>小计：</div><span>￥{{item.smallMoney}}</span>
			</div>
		</div>
		<div class="kong_div"></div>
		<div class="footer">
			<div class="footer_all">
				<div>
					<van-checkbox @change='selectAllShop(checkAllFlg)' v-model="checkAllFlg">全选</van-checkbox>
				</div>
				<div class="footer_money">
					<div class="footer_money_all">合计: <span>￥{{shopCar.shopAllMoney}}</span></div>
					<div class="shop_number">商家<span>{{shopCar.shopNum}}</span>/商品<span>{{shopCar.commodityNum}}</span></div>
				</div>
			</div>
			<div @click='goSettle' class="go_js_btn">去结算<span>({{shopCar.commodityNum}})</span></div>
		</div>
	</yd-layout>
</template>

<script>
	import Vue from 'vue'
	import configs from '../../configs'
	import mixin_quick from '../../utils/mixin_quick.js'
	import { Checkbox, CheckboxGroup ,Stepper } from 'vant';
	Vue.use(Checkbox).use(CheckboxGroup).use(Stepper);
	export default {
		mixins: [mixin_quick],
		data() {
			return {
				imgUrl: configs.imgURL,
				isCheckAll: false,
				allShopArr: [],
				shopName: [],
				flgAll:true,
				count:0,
				shopNameArr:[],
				checkAllFlg:true,
				shopCar:{
					shopNum:0,
					commodityNum:0,
					shopAllMoney:"0.00",
				}
			}
		},
		watch: {
			allShopArr:{
				handler(val) {
					var flg=true;
					for(let a=0;a<val.length;a++){
						if(!val[a].checkAll){
							flg=false
							break
						}
					}
					this.checkAllFlg=flg
					this.countFooter(val);
				},
				deep: true
			}
		},
		computed: {

		},
		created() {
			
		},
		mounted() {
			this.$store.dispatch('changeNavBarTitle', '购物车')
			this.getShopCar(true)
		},
		methods: {
			/*请求购物车数据*/
			getShopCar(flg){
				this.quickQueryGrouplist().then((d) => {
					var allArr=[]
					for(let key in d.aaData) {
						var o = {};
						o.checkAll = true
						o.flgAll= true
						o.sp = d.aaData[key]
						var arr = [];
						for(let a = 0; a < d.aaData[key].length; a++) {
							arr.push(d.aaData[key][a].id)
						}
						o.idArr = arr
						o.oldIdArr=arr
						o.smallMoney=this.countMoney(d.aaData[key])
						o.oldSmallMoney=this.countMoney(d.aaData[key])
						o.shopId=key
						allArr.push(o)
					}
					if(flg){
						this.count=0;
					}else{
						this.count=allArr.length;
					}
					this.getShopMessage(allArr,flg);
				})
			},
			/*请求商家信息*/
			getShopMessage(arr,flg){
				if(this.count>=arr.length){
						this.allShopArr=arr;
						for(let a=0;a<this.allShopArr.length;a++){
							this.allShopArr[a].name=this.shopNameArr[a]
						}
				}else if(flg){
					this.postRequest('customer/queryById', {
						id: arr[this.count].shopId,
					}).then(resp => {
						this.shopNameArr.push(resp.data.aaData.name)
						this.count++
						this.getShopMessage(arr,flg)
					})
				}
			},
			//店铺全选
			selectAll(item,checkAll,val,index) {
				if(!checkAll){
					if(item.flgAll){
						item.idArr=[]
						item.smallMoney='0.00'
					}
				}else{
					item.flgAll=true
					item.idArr=item.oldIdArr
					item.smallMoney=item.oldSmallMoney
				}
			},
			//店铺单选
			selectOne(item,val,index){
				if(val.length==item.oldIdArr.length){
					item.checkAll=true
				}else{
					item.checkAll=false
					item.flgAll=false;
					var arr=[]
					if(val.length>0){
						for(let a =0;a<val.length;a++){
							for(let b=0;b<item.sp.length;b++){
								if(val[a]==item.sp[b].id){
									arr.push(item.sp[b])
								}
							}
						}
						item.smallMoney=this.countMoney(arr)
					}else{
						item.smallMoney='0.00'
					}
				}
			},
			//加减
			addOrMinus(d,val){
				var param={
					buyerId:d.buyerId,
					productId:d.productId,
					productName:d.productName,
					skuId:d.skuId,
					skuName:d.skuName,
					quantity:val,
					comment:d.comment,
					sellerId:d.sellerId, 
					id:d.id
				}
				this.postRequest('shippingcar/update',param).then(resp => {
					if( resp.data.state == 0&& resp.data.msg=='success'){
						this.getShopCar()
					}
				})
			},
			countMoney(arr) {
				var money = '0.00';
				for(let a = 0; a < arr.length; a++) {
					money = parseFloat(money)+ parseFloat(arr[a].promotionPrice) * parseFloat(arr[a].quantity)
				}
				return money.toFixed(2)
			},
			//删除商品
			delShop(item) {
				if(item.idArr.length>0){
					this.$dialog.confirm({
	                    title: '确定移除所选商品？',
	                    opts: () => {
							this.postRequest('shippingcar/delete', {
								id: item.idArr,
							}).then(resp => {
								if(item.checkAll){
									this.getShopCar(true);
								}else{
									this.getShopCar();
									
								}
//								this.getShopCar(true);
							})
						}
	               });
					
				}else{
					this.$dialog.alert({mes: '请选择需要移除的商品'});
				}
			},
			//footerAll
			selectAllShop(val) {
				if(val){
					for(let a=0;a<this.allShopArr.length;a++){
						this.allShopArr[a].checkAll=true
					}
				}else{
					var arrFlg=[];
					for(let a=0;a<this.allShopArr.length;a++){
						if(this.allShopArr[a].checkAll){
							arrFlg.push(this.allShopArr[a].checkAll)
						}
					}
					if(arrFlg.length==this.allShopArr.length){
						for(let a=0;a<this.allShopArr.length;a++){
							this.allShopArr[a].checkAll=false;
						}
					}
				}
			},
			//计算结算
			countFooter(val){
				this.shopCar={
					shopNum:0,
					commodityNum:0,
					shopAllMoney:"0.00",
				}
				for(let a=0;a<val.length;a++){
					this.shopCar.shopAllMoney=(parseFloat(this.shopCar.shopAllMoney)+parseFloat(val[a].smallMoney)).toFixed(2)
					if(val[a].idArr.length>0){
						this.shopCar.shopNum++
					}
					this.shopCar.commodityNum+=val[a].idArr.length
				}
			},
			//去结算页面
			goSettle(){
				var flg=false
				for(let a =0;a<this.allShopArr.length;a++){  //不这样会this.allShopArr会watch
					if(this.allShopArr[a].idArr.length>0){
						flg=true
						break
					}
				}
				if(!flg){
					this.$dialog.alert({
						mes: '请选择需要结算的商品'
					})
				}else{
					var arr=[];
					for(let m=0;m<this.allShopArr.length;m++){
						arr.push(this.allShopArr[m])
					}
					for(let a=0;a<arr.length;a++){ //循环arr
						var spArr=[]
						var money='0.00'
						var obj={}
							for(let b=0;b<arr[a].sp.length;b++){
								for(let c=0;c<arr[a].idArr.length;c++){
									if(arr[a].sp[b].id==arr[a].idArr[c]){
										spArr.push(arr[a].sp[b])   //不这样会this.allShopArr会watch
										money= (parseFloat(money)+parseFloat(arr[a].sp[b].promotionPrice)*parseFloat(arr[a].sp[b].quantity)).toFixed(2)
									}
								}
							}
							arr[a].spArr=spArr
							arr[a].settleMoney=money
					}
					localStorage.setItem('quickSettlementParam', JSON.stringify(arr))
					this.$router.push({name:'settleAccounts'})
				}
			},
		}
	}
</script>

<style lang='scss'>
	#ShopCar {
		.list {
			margin: 0 0 .2rem 0;
			background: white;
		}
		.select_a_shop {
			padding: .28rem .24rem;
			display: flex;
			align-items: center;
			background: white;
			justify-content: space-between;
			.select_a_shop_name {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				font-size: .28rem;
				color: #2F3927;
				.name{
					margin: 0 0 0 .27rem;
					font-weight: 700;
				}
			}
		}
		.check_box{
			box-sizing: border-box;
			background: white;
			padding: 0 .24rem;
			.van-checkbox{
				display: flex;
				align-items: center;
				padding: .3rem 0;
				border-bottom: 1px solid #D6D6D6;
			}
			/*.van-checkbox:last-child{
				border-bottom: none ;
			}*/
			img{
				width: 1.28rem;
				height: 1.28rem;
			}
			.van-checkbox__label{
				display: flex;
				width: 2rem;
				flex-grow: 1;
				justify-content: space-between;
				.left{
					display: flex;
					width: 2rem;
					flex-grow: 1;
					.commodity{
						padding: 0 .24rem;
						line-height: .4rem;
						color: #2F3927;
						font-size: .3rem;
						.commodity_1{
							font-weight: 700;
						}
						.commodity_2{
							color: #797D77;
							padding: 0 0 .2rem 0;
							font-size: .2rem;
						}
						.commodity_3{
							color: #FF3D15;
						}
					}
				}
			}
			.numjiajian{
				width: 2.4rem;
				flex-grow: 0;
				.van-stepper__minus, .van-stepper__plus{
					width: 33px !important;
				}
			}
		}
		.select_list {
			background: white;
			label {
				display: block;
			}
		}
		.small_money{
			display: flex;
			font-size: .28rem;
			color: #2F3927;
			justify-content: flex-end;
			align-items: center;
			padding: .3rem .3rem;
			span{
				font-size: .3rem;
				color: #FF3D15;
				font-weight: 700;
			}
		}
		.kong_div{
			height: .98rem;
			width: 100%;
		}
		.footer{
			position: fixed;
			bottom: 0;
			width: 100%;
			height: .98rem;
			display: flex;
			background: white;
			align-items: center;
			justify-content: space-between;
			padding: 0 0 0 .24rem;
			.footer_all{
				display: flex;
				align-items: center;
				.footer_money{
					padding: 0 .24rem;
					.footer_money_all{
						font-size: .36rem;
						span{
							font-weight: 700;
							color: #FF3D15;
						}
					}
					.shop_number{
						font-size: .2rem;
						color: #797D77;
					}
				}
			}
			.go_js_btn{
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