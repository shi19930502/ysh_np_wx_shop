const state = {
  // 确认订单选择支付方式及时间参数
  payParams: null,
  orderListScrollTop: 0
}

/**
 * getters
 */
const getters = {
  getPayParams: state => state.payParams,
  getOrderListScrollTop: state => state.orderListScrollTop
}

/**
 * actions
 */
const actions = {
  setPayParams({
    commit
  }, payParams) {
    commit('setPayParams', payParams)
  },
  SAVE_ORDER_LIST_SCROLLTOP({
    commit
  }, scollTop) {
    commit('saveOrderListScollTop', scollTop)
  }
}

/**
 * mutations
 */
const mutations = {
  setPayParams(state, payParams) {
    state.payParams = payParams
  },
  saveOrderListScollTop(state,scollTop){
    state.orderListScrollTop = scollTop
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
