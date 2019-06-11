<template>
  <div class="cart">
    
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    // ...mapGetters({
    //   products: 'cartProducts',
    //   checkoutStatus: 'checkoutStatus',
    //   total: 'cartTotalPrice'
    // })
  },
  methods: {
    // checkout(products) {
    //   this.$store.dispatch('checkout', products)
    // }
  },
  created() {
    this.$store.dispatch('changeNavBarTitle', '购物车')
  }
}

</script>
