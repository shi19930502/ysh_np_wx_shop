<template>
  <div id="sellerCol">
    <ul class="list collection" v-if="sellerList.length>0">
      <li v-for="d in sellerList" @click="toSellerShop(d.sellerId)">
        <div class="flex flex-x-between flex-y-center">
          <div class="list-img">
            <img v-if="d.headPicUrl" :src="imgURL+d.headPicUrl" />
            <img v-else src="../../../assets/imgs/img_dianpu.png">
          </div>
          <div class="flex-item-5">
            <p class="name">
              <strong>{{d.storeName}}</strong>
            </p>
            <yd-badge shape="square" bgcolor="#FE971D" style="padding: 0 6px;">{{d.distributionToday==1?'支持当天配送':'次日配送'}}</yd-badge>
            <p style="color:#989E92;margin-top: 3px;">配送时间：{{d.distributionStart}}:00~{{d.distributionEnd}}:00</p>
          </div>
          <div class="tar">
            <div class="flex flex-y-center">
              <img src="../../../assets/imgs/mine_icon_phone.png" style="width: 0.34rem;height: 0.34rem;">
              <span style="color:#4D7BFE;margin-left: 0.1rem;">
                <a :href="'tel:'+d.phoneNumber">联系商家</a>
              </span>
            </div>
          </div>
        </div>
      </li>
      <li class="tac" v-if="dataCount>5" style="color: #6FB138;">更多收藏</li>
    </ul>
    <div v-else class="flex flex-x-center flex-y-center" style="height: 3.5rem">
      <div>
        <img src="../../../assets/imgs/my_default_img.png" />
        <p style="color: #999;" class="tac">还没有收藏商家</p>
      </div>
    </div>
  </div>
</template>
<script>
  import mixin from '../../../utils/mixin.js'
  import mixin_store from '../../../utils/mixin_store.js'

  export default {
    components: {},
    mixins: [mixin, mixin_store],
    data() {
      return {
        sellerList: [],
      }
    },
    created() {
      this.getSellerList()
    },
    methods: {
      /**
       * 获取收藏的供应商
       */
      getSellerList() {
        this.postRequest('suppliercollection/querySellerByCustomerId', {
          customerId: this.userInfo.typeCode,
          pageSize: 2,
          pageNum: 1
        }).then(resp => {
          if (resp.data && resp.data.state == 0) {
            if (resp.data.aaData) {
              var a = []
              for (var i in resp.data.aaData) {
                ((seller) => {
                  this.getStore(seller.sellerId, function (store) {
                    var o = Object.assign(store, seller)
                    a.push(o)
                  })
                })(resp.data.aaData[i])
              }
              this.sellerList = a
              this.dataCount = resp.data.dataCount
            }
          }
        })
      },
      /**
       * 跳转供应商商品
       */
      toSellerShop(sellerId) {
        this.$router.push({
          name: 'Shop',
          query: {
            sellerId: sellerId
          }
        })
      },
    }
  }
</script>
<style lang="scss">
  .yd-scrollview:after {
    display: none;
  }

  #sellerCol {
		margin-bottom: 0.5rem;
	}
</style>
