<template>
  <div class="card-body">
    <div class="flex flex-x-between flex-y-center">
      <div class="flex">
        <div class="product-img"><img src="../../assets/imgs/example_2.png"></div>
        <div class="product-img"><img src="../../assets/imgs/example_2.png"></div>
        <div class="product-img"><img src="../../assets/imgs/example_2.png"></div>
        <div class="product-img"><img src="../../assets/imgs/example_2.png"></div>
      </div>
      <div><img src="../../assets/imgs/icon_more.png"></div>
      <div class="tar">
        <p class="price"><strong>￥55055</strong></p>
        <p class="sl">共5件</p>
        <p>
          <yd-badge shape="square" :bgcolor="bgcolor" color="#FFF">当天配送</yd-badge>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    price: {
      default: ''
    },
    moreBtnText: {
      default: '查看全部'
    },
    bgcolor: {
      default: '#FE971D'
    }
  },
  methods: {

  }
}

</script>
<style scoped lang="scss">
.card-body {
  padding: 0 0 0.25rem;
  .product-img {
    width: 1.1rem;
    height: 1.1rem;
    margin-right: 0.15rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .price {
    color: #FF3D15;
    font-size: 0.35rem;
  }
  p.sl {
    font-size: 0.12rem;
    color: #797D77;
    padding: 0.1rem 0;
  }
}

</style>
