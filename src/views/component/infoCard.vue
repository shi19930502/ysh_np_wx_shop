<template>
  <div class="card">
    <h3 class="card-title">{{title}}</h3>
    <slot></slot>
    <div class="card-more" @click="click" v-show="showmoreBtn">{{moreBtnText}}</div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      default: ''
    },
    moreBtnText: {
      default: '查看全部'
    },
		showmoreBtn:{
			default: true
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
.card {
  background: #fff;
  padding: 0.48rem 0.25rem 0;
  margin-bottom: 0.25rem;
  .card-title {
    padding-bottom:0.18rem;
    font-size: 0.31rem;
  }
  .card-head {
    padding: 0.25rem 0;
    .card-head-img {
      margin-right: 0.25rem;
      width: 0.66rem;
      height: 0.66rem;
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
  .card-more {
    height: 0.8rem;
    line-height: 0.8rem;
    color: #6FB138;
    text-align: center;
    border-top: 1px solid #DDD;
  }
}

</style>
