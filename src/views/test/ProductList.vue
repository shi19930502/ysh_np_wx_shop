<template>
  <yd-pullrefresh :callback="getProducts" ref="pullrefreshDemo">
    <yd-list theme="4">
      <yd-list-item v-for="item, key in products" :key="key">
        <img slot="img" :src="item.img">
        <span slot="title">{{item.title}}</span>
        <yd-list-other slot="other">
          <div>
            <span class="list-price"><em>¥</em>{{item.marketprice}}</span>
            <span class="list-del-price">¥{{item.productprice}}</span>
          </div>
          <div>content</div>
        </yd-list-other>
      </yd-list-item>
    </yd-list>
  </yd-pullrefresh>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: mapGetters({
    products: 'allProducts'
  }),
  methods: mapActions([
    'addProductToCart',
    'getProducts'
  ]),
  created() {
    this.$store.dispatch('getProducts')
    this.$store.dispatch('changeNavBarTitle', '商品列表')
  }
}

</script>
