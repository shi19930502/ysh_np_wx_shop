// initial state
const state = {
	// 选择收货地址信息
  selectedAddress: null,
	
	// 省级列表
	comAreaList: []
	
}

// getters
const getters = {
  getSelectedAddress: state => state.selectedAddress
}

// actions
const actions = {
  setSelectedAddress({
    commit
  }, d) {
    commit('setSelectedAddress', d)
  }
}

// mutations
const mutations = {
  setSelectedAddress(state, d) {
    state.selectedAddress = d
  },
	setComAreaList(state){
		this.postRequest('comArea/list').then(d => {
			console.log(d)
		})
	}
}

export default {
  state,
  getters,
  actions,
  mutations
}
