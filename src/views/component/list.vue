<template>
  <ul class="list">
    <li v-for="d in 2">
      <div class="flex flex-x-between flex-y-center">
        <div class="list-img">
          <img src="../../assets/imgs/example_1.png">
        </div>
        <div class="flex-item-5">
          <p class="name"><strong>银川云泉谷批发市场</strong></p>
          <p style="color:#989E92">营业时间:10:00 - 11:00</p>
        </div>
        <div class="flex-item-2 tar">
          <span>买过1次</span>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    isborder: {
      default: false
    },
    dataList: {
      default: function() {
        return {
          imgurl: '',
          name: '',
          time: '',
          status: '',
        }
      }
    }
  },
  methods: {
    click() {
      this.$emit('click')
    }
  }
}

</script>
<style scoped lang="scss">
ul.list {
  li {
    padding: 0.25rem;
    border-bottom: 1px solid #ddd;
    .list-img {
      margin-right: 0.25rem;
      width: 1rem;
      height: 1rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    p.name {
      font-size: 0.27rem;
      padding-bottom: 0.06rem;
    }
  }
  background: #fff;
}

</style>
