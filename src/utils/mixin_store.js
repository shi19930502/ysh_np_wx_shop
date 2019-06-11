export default {
	data() {
		return {
			// 供应商列表
			sellerList: [],
			// 供应商信息
			sellerInfo: {},
			// 供应商店铺信息
			storeInfo: {},
			// 供应商店铺评分 
			reputationLevel: 'A',
		}
	},
	methods: {
		/**
		 * 获取店铺信息
		 */
		getStore(sellerId, cb) {
			this.postRequest('store/queryBySellerId', {
				sellerId: sellerId
			}).then(resp => {
				if(resp.data && resp.data.state == 0) {
					if(resp.data.aaData) {
						cb && cb(resp.data.aaData)
					} else {
						this.$dialog.alert({
							mes: '未找到店铺信息',
							// callback: () => {
							// 	this.$router.push({
							// 		name: 'Home'
							// 	})
							// }
						})
					}
				}
			})
		},
		/**
		 * 获取店铺信息
		 */
		getStoreAsync(sellerId) {
			return new Promise((resolve, reject) => {
				this.postRequest('store/queryBySellerId', {
					sellerId: sellerId
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						if(resp.data.aaData) {
							resolve(resp.data.aaData)
						} else {
							this.$dialog.alert({
								mes: '未找到店铺信息',
								// callback: () => {
								// 	this.$router.push({
								// 		name: 'Home'
								// 	})
								// }
							})
						}
					}
				})
			})
		},
		/**
		 * 查看店铺详情
		 */
		toShopDetails() {
			this.$router.push({
				name: 'ShopDetails',
				query: {
					sellerid: this.sellerId
				}
			})
		},
		/**
		 * 店铺评分
		 */
		getReputation(sellerId) {
			this.postRequest('reputation/list', {
				customerId: sellerId
			}).then(resp => {
				if(resp.data && resp.data.state == 0) {
					if(resp.data.aaData.length > 0) {
						this.reputationLevel = resp.data.aaData[0].reputationLevel
					} else {
						this.reputationLevel = 'A'
					}
				}
			})
		},
		/**
		* 获取订单明细
		*/
		getOrderItemById(orderId) {
			return new Promise((resolve,reject)=>{
				this.postRequest('orderitem/list', {
					orderId: orderId
				}).then(resp => {
					if (resp.data && resp.data.state == 0) {
						resolve(resp.data.aaData)
					} else {
						resolve(resp.data.msg)
					}
				})
			})
		}
	}
}