import Vue from 'vue'
import Router from 'vue-router'
import configs from '../configs.js'

// 北环首页根路径
let INDEX_PATH = '/'
let BEI_INDEX_PATH = '/index'
if(configs.cityName == 'beihuan'){
	INDEX_PATH = '/index'
	BEI_INDEX_PATH = '/'
}

Vue.use(Router)
export default new Router({
	routes: [{
		path: INDEX_PATH,
		name: 'Index',
		redirect: '/Login',
		component: resolve => require(['../views/Index.vue'], resolve),
		children: [{
			path: '/Home',
			name: 'Home',
			component: resolve => require(['../views/home/Home.vue'], resolve),
		}, {
			path: '/Order',
			name: 'Order',
			component: resolve => require(['../views/order/OrderList.vue'], resolve),
		}, {
			path: '/Statistics',
			name: 'Statistics',
			component: resolve => require(['../views/statistics/Statistics.vue'], resolve),
		}, {
			path: '/User',
			name: 'User',
			component: resolve => require(['../views/user/User.vue'], resolve),
		}]
	}, { //北环首页
		path: BEI_INDEX_PATH,
		name: 'northIndex',
		component: resolve => require(['../views/northviews/NorthIndex.vue'], resolve),
	}, { //北环注册
		path: '/NorthShop',
		name: 'NorthShop',
		component: resolve => require(['../views/northviews/NorthShopList.vue'], resolve),
	}, { //北环个人客户门店列表页面
		path: '/NorthDoorStore',
		name: 'NorthDoorStore',
		component: resolve => require(['../views/northviews/NorthDoorStore.vue'], resolve),
	}, { //北环注册
		path: '/NorthUserReg',
		name: 'NorthUserReg',
		component: resolve => require(['../views/northviews/NorthUserReg.vue'], resolve),
	}, {
		path: '/Login',
		name: 'Login',
		component: resolve => require(['../views/Login.vue'], resolve)
	}, {
		path: '/ShopSearch',
		name: 'ShopSearch',
		component: resolve => require(['../views/shop/ShopSearch.vue'], resolve)
	}, {
		path: '/ProSkuList',
		name: 'ProSkuList',
		component: resolve => require(['../views/shop/product/ProductList.vue'], resolve)
	}, {
		path: '/Shop',
		name: 'Shop',
		component: resolve => require(['../views/shop/ShopList.vue'], resolve),
	}, {
		path: '/ShopDetails',
		name: 'ShopDetails',
		component: resolve => require(['../views/shop/ShopDetails.vue'], resolve),
	}, {
		path: '/ShopEvaluateList',
		name: 'ShopEvaluateList',
		component: resolve => require(['../views/shop/ShopEvaluateList.vue'], resolve)
	}, {
		path: '/OrderSettlement',
		name: 'OrderSettlement',
		component: resolve => require(['../views/order/OrderSettlement.vue'], resolve),
	}, {
		path: '/OrderTracking',
		name: 'OrderTracking',
		component: resolve => require(['../views/order/OrderTracking.vue'], resolve),
	}, {
		path: '/OrderDetails',
		name: 'OrderDetails',
		component: resolve => require(['../views/order/OrderDetails.vue'], resolve),
	}, {
		path: '/OrderEvaluate',
		name: 'OrderEvaluate',
		component: resolve => require(['../views/order/OrderEvaluate.vue'], resolve),
	}, {
		path: '/OrderEvaluateSuccess',
		name: 'OrderEvaluateSuccess',
		component: resolve => require(['../views/order/OrderEvaluateSuccess.vue'], resolve),
	}, {
		path: '/ChoiceOfPayment',
		name: 'ChoiceOfPayment',
		component: resolve => require(['../views/order/ChoiceOfPayment.vue'], resolve),
	}, {
		path: '/OrderCheckoutSuccess',
		name: 'OrderCheckoutSuccess',
		component: resolve => require(['../views/order/OrderCheckoutSuccess.vue'], resolve),
	}, {
		path: '/UserSetting',
		name: 'UserSetting',
		component: resolve => require(['../views/user/UserSetting.vue'], resolve),
	}, {
		path: '/UserCenter',
		name: 'UserCenter',
		component: resolve => require(['../views/user/UserCenter.vue'], resolve),
	}, {
		path: '/UserShoppingCart',
		name: 'UserShoppingCart',
		component: resolve => require(['../views/user/UserShoppingCart.vue'], resolve),
	}, {
		path: '/UserMessage',
		name: 'UserMessage',
		component: resolve => require(['../views/user/UserMessage.vue'], resolve),
	}, {
		path: '/UserCollection',
		name: 'UserCollection',
		component: resolve => require(['../views/user/UserCollection.vue'], resolve),
	}, {
		path: '/UserAddress',
		name: 'UserAddress',
		component: resolve => require(['../views/user/UserAddress.vue'], resolve),
	}, {
		path: '/UserNewAddress',
		name: 'UserNewAddress',
		component: resolve => require(['../views/user/UserNewAddress_old.vue'], resolve),
	}, {
		path: '/selectAddr',
		name: 'selectAddr',
		component: resolve => require(['../views/user/selectAddr.vue'], resolve),
	}, {
		path: '/UserReg',
		name: 'UserReg',
		component: resolve => require(['../views/user/UserReg.vue'], resolve),
	}, {
		path: '/UserCustomerService',
		name: 'UserCustomerService',
		component: resolve => require(['../views/user/UserCustomerService.vue'], resolve)
	}, {
		path: '/Test',
		name: 'Test',
		component: resolve => require(['../views/test/Test.vue'], resolve)
	}, {
		path: '/ShoppingCart',
		name: 'ShoppingCart',
		component: resolve => require(['../views/test/ShoppingCart.vue'], resolve)
	}, {
		path: '/ProductList',
		name: 'ProductList',
		component: resolve => require(['../views/test/ProductList.vue'], resolve)
	}, {
		path: '/searchCar',
		name: 'searchCar',
		component: resolve => require(['../views/shop/ShopSearchCar.vue'], resolve)
	}, {
		path: '/ShopSearchCarSettle',
		name: 'ShopSearchCarSettle',
		component: resolve => require(['../views/shop/ShopSearchCarSettle.vue'], resolve)
	}, {
		path: '/quickSuccess',
		name: 'quickSuccess',
		component: resolve => require(['../views/shop/shopSearchSuccess.vue'], resolve)
	}, {
		path: '/QuickLookOrder',
		name: 'QuickLookOrder',
		component: resolve => require(['../views/shop/shopSearchOrder.vue'], resolve)
	}, {
		path: '/QuickOrderDetails',
		name: 'QuickOrderDetails',
		component: resolve => require(['../views/shop/shopSearchOrderDetails.vue'], resolve)
	}]
})
