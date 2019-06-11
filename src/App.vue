<template>
  <div id="app" :style="{minHeight: appMinHeight}">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      appMinHeight: "479px"
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    }
  },
  mounted() {
    // this.appMinHeight = `${window.screen.height}px`
    // alert(this.isWeiXin())
  },
  methods: {
    //判断是否是微信浏览器的函数
    isWeiXin() {
      //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
      var ua = window.navigator.userAgent.toLowerCase();
      //通过正则表达式匹配ua中是否含有MicroMessenger字符串
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  /*font-family: 'PingFang-SC-Medium';*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2f3927;
  height: 100%;
  font-size: 0.24rem;
  min-height: 479px;
}
</style>
