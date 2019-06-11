<template>
  <yd-layout>
    <div id="UserCustomerService">
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">
            <div class="flex flex-y-center item">
              <img src="../../assets/imgs/m_call.png" alt="" class="icon">
              <div>
                <p>客服电话：
                  <span style="font-size: 14px;">(工作日:9:00-17:30)</span>
                </p>
                <p style="color: #72b943;">400-8558-783</p>
              </div>
            </div>
          </span>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">
            <div class="flex flex-y-center item">
              <img src="../../assets/imgs/m_message.png" alt="" class="icon">
              <div>
                <p>客服邮箱：</p>
                <p style="color: #8f8f94;">yuanshenghuii@163.com</p>
              </div>
            </div>
          </span>
        </yd-cell-item>
      </yd-cell-group>
      <div class="tac">
        <p v-show="cityName=='yinchuan'" style="color: #8f8f94;padding: 0 0 0.3rem;">点击下面的按钮可以给源生汇反馈意见</p>
        <p v-show="cityName=='linyi'" style="color: #8f8f94;padding: 0 0 0.3rem;">点击下面的按钮可以给临沂追溯反馈意见</p>
        <p v-show="cityName=='yantai'" style="color: #8f8f94;padding: 0 0 0.3rem;">点击下面的按钮可以给烟台追溯反馈意见</p>
				<p v-show="cityName=='beihuan'" style="color: #8f8f94;padding: 0 0 0.3rem;">点击下面的按钮可以给晒上农鲜汇反馈意见</p>
				<img src="../../assets/imgs/m_wx.png" alt="" style="width: 1rem;height: 1rem;">
      </div>
    </div>
  </yd-layout>
</template>
<script>
	import configs from '../../configs'
  export default {
    data() {
      return {
        cityName: configs.cityName
      }
    },
    created() {
      this.$store.dispatch('changeNavBarTitle', '呼叫客服')
    },
    mounted() {

    },
    methods: {

    }
  };
</script>
<style lang="scss">
  #UserCustomerService {
    .item {
      padding: 0.2rem 0;
      .icon {
        width: 0.67rem;
        height: 0.66rem;
        margin-right: 0.2rem;
      }
    }
  }
</style>
