<template>
  <div id="productCol">
    <ul class="list collection" v-if="productcollection.length>0">
      <li v-for="d in productcollection">
        <div class="flex flex-x-between flex-y-center">
          <div class="list-img">
            <img v-if="d.skuPic" :src="imgURL + d.skuPic ">
            <img v-else-if="d.proPic" :src="imgURL+d.proPic" />
            <img v-else src="../../../assets/imgs/img_moren.png">
          </div>
          <div class="flex-item-5">
            <p class="name">
              <strong>{{d.productName+'['+d.skuName+']'}}</strong>
            </p>
            <p style="color:#989E92">{{d.sellerName}}</p>
          </div>
        </div>
      </li>
      <li class="tac" v-if="dataCount>5" style="color: #6FB138;" @click="toUserCollection">更多收藏</li>
    </ul>

    <div v-else class="flex flex-x-center flex-y-center" style="height: 3.5rem">
      <div>
        <img src="../../../assets/imgs/my_default_img.png" />
        <p style="color: #999;" class="tac">还没有收藏商品</p>
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
        productcollection: [],
        dataCount: 0
      }
    },
    created() {
      this.getProductcollection()
    },
    mounted() {

    },
    methods: {
      /**
       * 获取收藏品
       */
      getProductcollection() {
        this.postRequest('productcollection/list', {
          customerId: this.userInfo.typeCode,
          pageNum: 1,
          pageSize: 5
        }).then(resp => {
          if (resp.data && resp.data.state == 0) {
            this.productcollection = resp.data.aaData
            this.dataCount = resp.data.dataCount
          }
        })
      },
			/**
			* 全部收藏
			*/
			toUserCollection() {
				this.$router.push({
					name: 'UserCollection'
				})
			}
    }
  }
</script>
<style lang="scss">
	.yd-scrollview:after {
		display: none;
	}
  #productCol {
		margin-bottom: 0.5rem;
	}
</style>
