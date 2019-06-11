<template>
  <span class="btn" @click="click">{{name}}</span>
</template>
<script>
export default {
  props: {
    name: {
      default: 'btn'
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
.btn {
  display: inline-block;
  padding: 0.1rem 0.24rem;
  color: #6FB138;
  border-radius: 2px;
  border: 1px solid #6FB138;
}

</style>
