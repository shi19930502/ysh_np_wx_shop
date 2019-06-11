<template>
  <yd-layout>
    <div id="OrderCheckoutSuccess">
      <div class="header gradient-y">
        <div class="flex flex-x-center flex-y-center">
          <img
            src="../../assets/imgs/listd_icon_succes.png"
            style="width: 0.42rem;height: 0.42rem;"
          >
          <div class="h1">下单成功</div>
        </div>
        <div class="tipstext">安全，健康，放心，以溯源为纽带，创造舌尖上的诚信世界。</div>
        <div class="flex flex-x-center">
          <div class="lookbtn" @click="toOrderDetails">查看订单</div>
          <div class="lookbtn" @click="backHome" style="margin-left: 0.2rem;">返回首页</div>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <div class="youlike-list">
        <div class="flex flex-y-center">
          <div class="flex-item-2"></div>
          <div class="flex-item-2 line"></div>
          <div class="title">
            <h1>你可能喜欢</h1>
          </div>
          <div class="flex-item-2 line"></div>
          <div class="flex-item-2"></div>
        </div>
      </div>
      <yd-scrolltab>
        <div class="scrolltab-content" style="height: 100%;overflow-y: auto;">
          <yd-infinitescroll :callback="getSellerNewProductList" ref="productList">
            <ul class="list flex flex-x-center" slot="list">
              <li v-for=" d in sellerNewProductList">
                <div class="img">
                  <img v-if="d.f_product_pic_url" :src="imgURL+d.f_product_pic_url">
                  <img v-else src="../../assets/imgs/img_moren@2x.png">
                </div>
                <h3>{{d.f_name}}</h3>
              </li>
            </ul>
            <span slot="doneTip">没有更多数据啦</span>
          </yd-infinitescroll>
        </div>
      </yd-scrolltab>
    </div>
  </yd-layout>
</template>
<script>
import mixin from "../../utils/mixin.js";
export default {
  mixins: [mixin],
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      orderId: "",
      orderUmber: "",
      sellerNewProductList: []
    };
  },
  created() {
    this.$store.dispatch("changeNavBarTitle", "下单成功");
    this.orderId = this.$route.query.orderId;
    this.orderUmber = this.$route.query.orderUmber;

    this.getSellerNewProductList();
  },
  mounted() {},
  methods: {
    /**
     * 订单详情
     */
    toOrderDetails() {
      this.$router.push({
        name: "Order"
      });
    },
    /**
     * 返回首页
     */
    backHome() {
      this.$router.push({
        name: "Home"
      });
    },
    /**
     * 获取推荐商品
     */
    getSellerNewProductList() {
      this.postRequest("product/sellerNewProductList", {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        customerId: this.userInfo.typeCode
      }).then(d => {
        if (d.data && d.data.state == 0) {
          if (this.pageNum == 1) {
            this.sellerNewProductList = d.data.aaData;
          } else {
            this.sellerNewProductList = [
              ...this.sellerNewProductList,
              ...d.data.aaData
            ];
          }

          if (this.sellerNewProductList.length >= d.data.dataCount) {
            /* 所有数据加载完毕 */
            this.$refs.productList.$emit("ydui.infinitescroll.loadedDone");
            return;
          }
          /* 单次请求数据完毕 */
          this.$refs.productList.$emit("ydui.infinitescroll.finishLoad");
          this.pageNum++;
        }
      });
    },
    /**
     * 获取推荐热卖商品
     */
    getSellerNewProductList_new() {
      this.postRequest("orderitem/queryBestSellerProduct", {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        customerId: this.userInfo.typeCode
      }).then(d => {
        if (d.data && d.data.state == 0) {
          if (this.pageNum == 1) {
            this.sellerNewProductList = d.data.aaData;
          } else {
            this.sellerNewProductList = [
              ...this.sellerNewProductList,
              ...d.data.aaData
            ];
          }

          if (this.sellerNewProductList.length >= d.data.dataCount) {
            /* 所有数据加载完毕 */
            this.$refs.productList.$emit("ydui.infinitescroll.loadedDone");
            return;
          }
          /* 单次请求数据完毕 */
          this.$refs.productList.$emit("ydui.infinitescroll.finishLoad");
          this.pageNum++;
        }
      });
    }
  }
};
</script>
<style lang="scss">
#OrderCheckoutSuccess {
  .scrolltab-content::-webkit-scrollbar {
    display: none;
  }
  .yd-scrolltab {
    top: 5rem;
  }
  .yd-scrolltab-content {
    padding: 0 0 0 0;
  }
  .header {
    color: #fff;
    padding: 0.76rem;
    .h1 {
      font-size: 0.4rem;
      margin-left: 0.1rem;
    }
    .tipstext {
      text-align: center;
      padding: 0.3rem 0;
    }
    .lookbtn {
      border-radius: 2px;
      border: 1px solid #fff;
      width: 2.4rem;
      text-align: center;
      line-height: 0.68rem;
      font-size: 0.3rem;
    }
  }
  .youlike-list {
    background: #fff;
    h1 {
      font-size: 0.3rem;
      padding: 0.3rem;
    }
    .line {
      height: 1px;
      background: #ddd;
    }
  }
  ul.list::-webkit-scrollbar {
    display: none;
  }
  ul.list {
    height: 100%;
    overflow-y: auto;
    flex-wrap: wrap;
    li {
      margin-bottom: 0.2rem;
      padding: 0 0.1rem;
      .img {
        width: 3.4rem;
        height: 3.4rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      h3 {
        padding: 0.25rem;
        width: 3.4rem;
        background: #e6e6e6;
      }
    }
  }
}
</style>
