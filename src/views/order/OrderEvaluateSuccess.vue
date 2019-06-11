<template>
  <yd-layout>
    <div id="OrderEvaluateSuccess">
      <section class="header">
        <div class="flex flex-y-center flex-x-center">
          <img
            src="../../assets/imgs/listd_icon_succes_a.png"
            style="width: 0.42rem; height: 0.42rem;"
            alt
          >
          <div class="suc-text">评价成功</div>
        </div>
        <p class="p">你的评价将是其他用户选购前的重要参考</p>
        <div class="backbtn flex flex-y-center flex-x-center" @click="toOrderList">返回订单</div>
      </section>
      <section class="fgx">感谢你的用心评价~继续评价</section>
      <yd-scrolltab style="top: 4.45rem;">
        <div class="orderlistwrap">
          <yd-infinitescroll :callback="getOrderList" ref="infinitescrollDemo">
            <div class="order-list" v-for="d in list" slot="list">
              <div class="order-head flex flex-x-between">
                <div>
                  <strong style="font-size: 0.28rem;">{{d.sellerName}}</strong>
                  <img class="list_icon_right" src="../../assets/imgs/list_icon_right.png">
                </div>
                <div style="font-size: 0.24rem;">{{d.orderStatusName}}</div>
              </div>
              <div class="card-body" @click="toOrderDetails(d.id,d.orderUmber)">
                <div class="flex flex-x-between flex-y-center">
                  <div class="flex">
                    <template v-for="orderitem,key in d.orderitemList">
                      <div class="product-img" v-if="key<4">
                        <img
                          v-if="orderitem.productPicUrl"
                          :src="imgURL+orderitem.productPicUrl"
                          alt
                        >
                        <img v-else src="../../assets/imgs/img_moren.png">
                      </div>
                    </template>
                  </div>
                  <div v-show="d.orderitemList.length>4">
                    <img
                      src="../../assets/imgs/icon_more.png"
                      style="width: 0.5rem;height: 0.1rem;"
                    >
                  </div>
                  <div class="tar">
                    <p class="price">
                      <!--<strong>{{'￥'+priceFormat(d.orderTotal)}}</strong>-->
                      <span
                        v-if="d.sortingOrderTotal==null && d.inspectedOrderTotal==null"
                      >{{'￥'+priceFormat(d.orderTotal)}}</span>
                      <span
                        v-show="d.sortingOrderTotal>0 && d.inspectedOrderTotal==null"
                      >{{'￥'+priceFormat(d.sortingOrderTotal)}}</span>
                      <span v-show="d.inspectedOrderTotal>0">{{'￥'+priceFormat(d.inspectedOrderTotal)}}</span>
                    </p>
                    <p class="sl" style="font-size: 0.24rem">共{{d.orderitemList.length}}件</p>
                  </div>
                </div>
              </div>
              <div class="order-foot flex flex-x-between flex-y-center">
                <span class="time">{{d.createdDate}}</span>
                <div class="flex flex-x-end">
                  <btn
                    v-show="d.orderStatusId == 5"
                    name="立即评价"
                    @click="toEvaluate(d.id,d.sellerId,d.orderUmber)"
                  ></btn>
                </div>
              </div>
            </div>
            <span slot="doneTip">没有更多数据啦</span>
          </yd-infinitescroll>
        </div>
      </yd-scrolltab>
    </div>
  </yd-layout>
</template>
<script>
import btn from "../component/btn.vue";
import mixin from "../../utils/mixin.js";
export default {
  components: {
    btn
  },
  mixins: [mixin],
  data() {
    return {
      productrate: 0,
      pageNum: 1,
      pageSize: 10,
      list: []
    };
  },
  created() {
    this.$store.dispatch("changeNavBarTitle", "订单评价");
    this.getOrderList();
  },
  mounted() {},
  methods: {
    /**
     * 订单详情
     */
    toOrderDetails(orderId, orderUmber) {
      this.$router.push({
        name: "OrderDetails",
        query: {
          orderId: orderId,
          orderUmber: orderUmber
        }
      });
    },
    /**
     * 我要评价
     */
    toEvaluate(orderId, sellerId, orderUmber, type) {
      var param = {
        orderId: orderId,
        sellerId: sellerId,
        orderUmber: orderUmber
      };
      if (type) {
        param.type = 1;
      }
      this.$router.push({
        name: "OrderEvaluate",
        query: param
      });
    },
    toOrderList() {
      this.$router.go(-2);
    },
    /**
     * 获取订单详情
     */
    getOrderList() {
      this.postRequest("order/listByUser", {
        orderStatusId: 5,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        checkType: "buy"
      }).then(d => {
        if (d.data && d.data.state == 0) {
          const _list = d.data.aaData;
          this.list = [...this.list, ..._list];
          if (_list.length < this.pageSize) {
            /* 所有数据加载完毕 */
            this.$refs.infinitescrollDemo.$emit(
              "ydui.infinitescroll.loadedDone"
            );
            return;
          }
          /* 单次请求数据完毕 */
          this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.finishLoad");
          this.pageNum++;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.yd-scrolltab-content {
  padding: 0;
  background: #efeff3;
}
#OrderEvaluateSuccess {
  .orderlistwrap {
    height: 100%;
    overflow-y: auto;
  }
  .orderlistwrap::-webkit-scrollbar {
    display: none;
  }
  .header {
    background: #fff;
    padding: 0.71rem 0.58rem;
    .suc-text {
      color: #2f3927;
      font-size: 0.42rem;
      padding-left: 0.2rem;
    }
    .p {
      font-size: 0.24rem;
      color: #989e92;
      text-align: center;
      padding: 0.2rem 0 0.45rem;
    }
    .backbtn {
      width: 2.4rem;
      height: 0.68rem;
      background: #6fb138;
      color: #fff;
      border-radius: 3px;
      font-size: 0.32rem;
      margin: 0 auto;
    }
  }
  .fgx {
    text-align: center;
    padding: 0.25rem;
  }
  .order-list {
    background: #fff;
    border-bottom: #f9f9fb 1px solid;
    .order-head {
      padding: 0.25rem;
      strong {
        font-size: 0.3rem;
        color: #2f3927;
      }
      img.list_icon_right {
        width: 0.14rem;
        height: 0.24rem;
        margin-left: 0.17rem;
      }
    }
    .card-body {
      padding: 0.3rem 0.25rem;
      background: #f9f9fb;
    }
    .order-foot {
      padding: 0.15rem 0.25rem;
      .time {
        color: #797d77;
      }
      .btn {
        margin-left: 0.2rem;
      }
    }
  }
}
</style>