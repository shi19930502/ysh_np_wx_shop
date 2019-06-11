<template>
  <div class="menu">
    <div class="menu-tab" style="overflow-x: auto">
      <ul class="flex">
        <template v-for="(d, index) in dataList">
          <li ref="li" :class="index == activeItem ? 'active' : ''" :style="'min-width: ' + (d.length*0.3 +0.5) + 'rem'" @click="click(index)">
            <strong>{{d}}</strong>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      isborder: {
        default: false
      },
      dataList: {
        default: function () {
          return ['菜单一', '常买', '菜单二', '米面粮油', '菜单三', '菜单四', '菜单五', '菜单2']
        }
      },
      itemClick: Function,
      activeItem: {
        default: 0
      }
    },
    methods: {
      click(index) {
        for (var i in this.$refs.li) {
          this.$refs.li[i].removeAttribute('class')
        }
        this.$refs.li[index].setAttribute('class', 'active')
        this.itemClick && this.itemClick(index)
      }
    }
  }
</script>
<style scoped lang="scss">
  .menu {
    .menu-tab {
      border-bottom: 1px solid #ddd;
      padding-bottom: 0.11rem;
      background: #fff;
      ul {
        li {
          font-size: 0.3rem;
          text-align: center;
          padding: 0.25rem 0 0;
          strong {
            display: inline-block;
            border-bottom: 2px solid #fff;
            padding-bottom: 0.05rem;
            font-size: 0.31rem;
          }
        }
        li.active {
          color: #6FB138;
          strong {
            display: inline-block;
            border-bottom: 2px solid #6FB138;
            padding-bottom: 0.05rem;
            font-size: 0.31rem;
          }
        }
      }
    }
    .menu-tab::-webkit-scrollbar {
      display: none;
    }
  }
</style>
