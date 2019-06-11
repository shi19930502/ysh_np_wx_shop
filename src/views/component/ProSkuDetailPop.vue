<template>
    <yd-popup v-model="showPop" position="bottom" height="60%" :close-on-masker="false">
      sdfsf
      <yd-button type="danger" style="margin: 30px;" @click.native="close">Close Right Popup</yd-button>
    </yd-popup>
  </div>
</template>

<script>
  export default {
    name: 'pro-detail',
    props: {
      modal: {
        default: false
      },
      params: {
        default: function () {
          return {}
        }
      }
    },
    data() {
      let showPop = this.modal
      return {
        showPop: showPop
      }
    },
    created() {
      console.log(this.params)
    },
    mounted() {

    },
    methods: {
      close() {
        this.showPop = false
				this.$emit('getShowPop',this.showPop)
      }
    }
  }
</script>

<style lang="scss">
  .ProSkuDetailPop {}
</style>
