import shop from '../../api/shop'

// initial state
const state = {
	productList: []
}

// getters
const getters = {
	allProducts: state => state.productList
}

// actions
const actions = {
	getProducts({
		commit
	}) {
		shop.getProducts(products => {
			commit('setProducts', products)
		})
	}
}

// mutations
const mutations = {
	setProducts(state, products) {
		state.productList = products
		console.log(products)
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}