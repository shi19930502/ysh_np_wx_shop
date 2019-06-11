<template>
  <yd-layout>
    <router-view></router-view>
    <yd-tabbar slot="tabbar">
      <yd-tabbar-item title="首页" link="Home">
        <!--<yd-icon name="home" slot="icon" size="0.48rem"></yd-icon>-->
				<img slot="icon" class="tj-icon" src="../assets/imgs/tab_home@2x.png" style="width: 0.48rem;height:0.48rem;">
				<img slot="icon" class="tj-icon-active" src="../assets/imgs/tab_home_a@2x.png" style="width: 0.48rem;height:0.48rem;">
      </yd-tabbar-item>
      <yd-tabbar-item title="订单" link="Order">
				<img slot="icon" class="tj-icon" src="../assets/imgs/tab_list@2x.png" style="width: 0.48rem;height:0.48rem;">
				<img slot="icon" class="tj-icon-active" src="../assets/imgs/tab_list_a@2x.png" style="width: 0.48rem;height:0.48rem;">
      </yd-tabbar-item>
      <yd-tabbar-item title="" link="ProSkuList" v-if="!isBeiHuan">
        <img slot="icon" src="../assets/imgs/icon_add@2x.png" style="width: 0.8rem;height:0.8rem;">
      </yd-tabbar-item>
			<yd-tabbar-item title="" link="NorthShop" v-else-if="userInfo.userType=='003'">
				<img slot="icon" src="../assets/imgs/icon_add@2x.png" style="width: 0.8rem;height:0.8rem;">
			</yd-tabbar-item>
			<yd-tabbar-item title="" link="NorthDoorStore" v-else>
				<img slot="icon" src="../assets/imgs/icon_add@2x.png" style="width: 0.8rem;height:0.8rem;">
			</yd-tabbar-item>
      <yd-tabbar-item title="统计" link="Statistics">
        <img slot="icon" class="tj-icon" src="../assets/imgs/tab_tongj@2x.png" style="width: 0.48rem;height:0.48rem;">
        <img slot="icon" class="tj-icon-active" src="../assets/imgs/tab_tongj_a@2x.png" style="width: 0.48rem;height:0.48rem;">
      </yd-tabbar-item>
      <yd-tabbar-item title="我的" link="User">
				<img slot="icon" class="tj-icon" src="../assets/imgs/tab_mine@2x.png" style="width: 0.48rem;height:0.48rem;">
				<img slot="icon" class="tj-icon-active" src="../assets/imgs/tab_icon_mine_a@2x.png" style="width: 0.48rem;height:0.48rem;">
      </yd-tabbar-item>
    </yd-tabbar>
  </yd-layout>
</template>
<script>
	import mixin from '../utils/mixin.js'
	import configs from '../configs'
  export default {
		mixins:[mixin],
    data() {
      return {
				isBeiHuan: configs.isBeiHuan,
			}
    },
    created() {},
    mounted() {},
    methods: {},
  };
</script>
<style lang="scss">
  .router-link-active {
    color: #6FB138 !important;
  }

  .router-link-active .tj-icon-active {
    display: block;
  }

  .router-link-active .tj-icon,
  .tj-icon-active {
    display: none;
  }
</style>
