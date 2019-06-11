import {
	Alert
} from 'vue-ydui/dist/lib.rem/dialog'
export default {
	data() {
		return {
			carIds: [], // 创建购物车返回的id
			ShippingcarList: [], // 购物车数据
			alreadyChosenGoods: [], // 购物车当前供应商已经选择的商品
			orderTotal: 0, // 当前店铺选择商品总价
			shopCar: {
				shopNum: 0,
				commodityNum: 0,
				shopAllMoney: "0.00",
			},
			queryGrouplist: [],
			// 店铺起配金额
			startAmount: 0
		}
	},
	methods: {
		/**
		 * 创建购物车
		 */
		createShippingcar(sku) {
			var saveUrl;
			var params = {
				buyerId: this.userInfo.typeCode,
				productId: sku.productId,
				productName: sku.productName,
				skuId: sku.id,
				skuName: sku.name,
				quantity: sku.quantity,
				comment: sku.remark || '',
				sellerId: this.sellerId || this.$route.query.sellerId || sku.sellerId,
			}

			if (sku.supplierId) { // 如果搜索的是全不供应商的商品加入购物车
				params.sellerId = sku.supplierId
			}

			if (sku.skuId) {
				params.skuId = sku.skuId
			}
			if (sku.skuName) {
				params.skuName = sku.skuName
			}

			// 判断是否新增是否更新
			var skuIdsArr = []
			for (var item of this.carIds) {
				skuIdsArr.push(item.skuId)
			}

			if (!this.isInArray(skuIdsArr, params.skuId)) {
				saveUrl = 'shippingcar/create'
				this.postRequest(saveUrl, params).then(d => {
					if (d.data && d.data.state == 0) {
						var o = {
							skuId: sku.id || sku.skuId,
							carId: d.data.aaData.id
						}
						this.carIds.push(o)
						this.getShippingcarList()
					} else {
						Alert({
							mes: d.data.msg,
							callback: () => {
								sku.quantity = 0
								sku.showjianBtn = false
								console.log(sku.quantity == 0)
							}
						})
					}
				})
			} else {
				if (sku.quantity == 0) {
					saveUrl = 'shippingcar/delete'
				} else {
					saveUrl = 'shippingcar/update'
				}
				for (var i in this.carIds) {
					if (this.carIds[i].skuId == sku.id || this.carIds[i].skuId == sku.skuId) {
						params.id = this.carIds[i].carId
					}
				}
				this.postRequest(saveUrl, params).then(d => {
					if (d.data && d.data.state == 0) {
						this.getShippingcarList()
					}
				})
			}
		},
		/**
		 * 店铺获取购物车
		 */
		getShippingcarList() {
			this.postRequest('shippingcar/queryGrouplist', {
				buyerId: this.userInfo.typeCode,
				sellerId: this.sellerId
			}).then(d => {
				if (d.data && d.data.state == 0) {
					this.setStartAmount(this.sellerId)
					this.ShippingcarList = d.data.aaData

					var carIds = []
					this.alreadyChosenGoods = []
					for (var i in d.data.aaData) {
						if (this.sellerId == i) {
							for (var oo of d.data.aaData[i]) {
								oo.showjianBtn = false
							}
							this.alreadyChosenGoods = d.data.aaData[i]
						}
						for (var item of d.data.aaData[i]) {
							var o = {
								skuId: item.skuId,
								carId: item.id
							}
							carIds.push(o)
						}
					}
					this.carIds = carIds
					// 计算总价
					var selectGoodsArr = []
					for (let a = 0; a < this.alreadyChosenGoods.length; a++) {
						for (let b = 0; b < this.carSettlementGoods.length; b++) {
							if (this.alreadyChosenGoods[a].id == this.carSettlementGoods[b]) {
								selectGoodsArr.push(this.carSettlementGoods[b])
							}
						}
					}
					this.carSettlementGoods = selectGoodsArr
					if (this.showShopCar && this.carSettlementGoods.length <= 0) {
						this.isCheckAll = false
						this.$refs.checklistDemo.$emit('ydui.checklist.checkall', this.isCheckAll);
					}
					this.orderTotal = this.getOrderTotal(this.alreadyChosenGoods).priceTotal
					if (this.$route.name == 'ShopSearch' || this.$route.name == 'ProSkuList' || this.$route.name == 'UserCollection' ||
						this.$route.name == 'Home') { // 如果是搜索页面不能及时更新总价
						this.getSearchProCar(d.data.aaData)
					}
				}
			})
		},
		/**
		 * 收搜商品和收藏页面请求购物车数据
		 */
		getSearchProCar(arr) {
			var shopNum = 0;
			this.queryGrouplist = [];
			this.shopCar.shopMoney = '0.00'
			for (var key in arr) {
				shopNum++
				this.queryGrouplist = this.queryGrouplist.concat(arr[key])
			}
			//footer购物车 店铺数量，总价格，商品数量
			this.shopCar.shopNum = shopNum
			this.shopCar.commodityNum = this.queryGrouplist.length
			for (let a = 0; a < this.queryGrouplist.length; a++) {
				var money = parseFloat(this.queryGrouplist[a].promotionPrice) * parseFloat(this.queryGrouplist[a].quantity)
				this.shopCar.shopMoney = (parseFloat(this.shopCar.shopMoney) + money).toFixed(2)
			}
			if (this.$refs.shopCarshopMoney) {
				this.$refs.shopCarshopMoney.innerHTML = `￥${this.shopCar.shopMoney}`
			}
		},
		/**
		 * 计算商品总价
		 */
		getOrderTotal(arr) {
			var priceTotal = 0;
			var quantityTotal = 0;
			for (var i in arr) {
				quantityTotal += arr[i].quantity

				if (arr[i].promotionPrice > 0 && arr[i].promotionBasePrice > 0) {
					priceTotal += arr[i].quantity * (arr[i].promotionPrice.mul(100))
				} else {
					priceTotal += arr[i].quantity * (arr[i].price.mul(100))
				}
			}

			return {
				priceTotal: (priceTotal / 100).toFixed(2),
				quantityTotal: (quantityTotal - 0).toFixed(2)
			}
		},
		/**
		 * 判断数组是否存在某个元素
		 */
		isInArray(arr, element) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] == element) {
					return true;
				}
			}
			return false;
		},
		/**
		 * 统计店铺访问人数
		 */
		countVisits() {
			this.postRequest('store/countVisits', {
				sellerId: this.sellerId
			}).then(d => {
				if (d.data && d.data.state == 0) {}
			})
		},
    /**
     * 设置起配金额
     */
    async setStartAmount(sellerId) {
      let obj = await this.getStartAmount(sellerId);
			this.startAmount = obj.startAmount;
			for(let o of this.alreadyChosenGoods){
				if(o.price == 0){
					this.startAmount = 0 
					break
				}
			}
    },
    /**
     * 获取店铺起配金额
     */
    getStartAmount(sellerId) {
      return new Promise((resolve, reject) => {
        this.postRequest("quotation/listWithCount", {
          customerId: sellerId,
          buyersId: this.userInfo.typeCode
        }).then(resp => {
          if (resp.data && resp.data.state == 0) {
            if (resp.data.aaData && resp.data.aaData[0]) {
              resolve(resp.data.aaData[0]);
            } else {
              resolve(resp.data.msg);
            }
          }
        });
      });
    }
	}
}
