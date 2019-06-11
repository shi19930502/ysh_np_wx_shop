<template>
  <div id="UserCollection">
    <yd-layout>
      <!-- 菜单导航 -->
      <menuTab :item-click="menuclick" :dataList="menu" slot="navbar"></menuTab>
      <!-- 收藏商家 -->
      <div v-show="showSellerList" style="height: 100%;">
        <template v-if="sellerList.length>0">
          <yd-infinitescroll :callback="getSellerStoreList" ref="sellerListScoll">
            <ul class="list" slot="list">
              <li
                v-for="d in sellerList"
                :class="!d.storeItem.isOpenTime || d.storeItem.enabled == 0?'disabled':'undisabled'"
                v-if="d.storeItem"
              >
                <div class="flex flex-x-between flex-y-center">
                  <div class="list-img">
                    <img v-if="d.storeItem.headPicUrl" :src="imgURL+d.storeItem.headPicUrl">
                    <img v-else src="../../assets/imgs/img_dianpu.png">
                    <div
                      v-show="!d.storeItem.isOpenTime || d.storeItem.enabled == 0"
                      style="position: absolute;height:100%;width:100%;top:0;left:0;color:#fff;background: rgba(0, 0, 0, 0.5)"
                      class="flex flex-x-center flex-y-center"
                    >休息中</div>
                  </div>
                  <div class="flex-item-5">
                    <p class="name">
                      <strong>{{d.storeItem.storeName}}</strong>
                    </p>
                    <div class="flex flex-y-center">
                      <img
                        v-if="d.storeItem.isOpenTime && d.storeItem.enabled == 1"
                        src="../../assets/imgs/icon_open.png"
                        alt
                        style="width:0.26rem;height:0.26rem;"
                      >
                      <img
                        v-else
                        src="../../assets/imgs/icon_close_store.png"
                        alt
                        style="width:0.26rem;height:0.26rem;"
                      >
                      <p
                        style="color:#989E92;margin-left:0.2rem;"
                      >营业时间：{{d.storeItem.openStart}}:00~{{d.storeItem.openEnd}}:00</p>
                    </div>
                    <p
                      style="color:#989E92"
                    >配送时间：{{d.storeItem.distributionStart}}:00~{{d.storeItem.distributionEnd}}:00</p>
                  </div>
                  <div class="flex-item-3 tar">
                    <div
                      class="status-btns flex flex-x-end flex-y-center"
                      v-if="d.storeItem.isOpenTime && d.storeItem.enabled == 1"
                    >
                      <div class="open-status">营业中</div> 
                      <div class="enterbtn" @click="toSellerShop(d.f_seller_id)">我要进店</div>
                    </div>
                    <p style="color:#797D77">{{d.storeItem.distributionToday==1?'支持当天配送':'次日配送'}}</p>
                  </div>
                </div>
              </li>
            </ul>
            <span slot="doneTip">没有更多数据啦</span>
          </yd-infinitescroll>
        </template>

        <div v-else class="flex flex-x-center flex-y-center" style="height: 100%;">
          <div>
            <img src="../../assets/imgs/my_default_img.png">
            <p style="color: #999;" class="tac">还没有收藏商家</p>
          </div>
        </div>
      </div>

      <!-- getSellerList() -->
      <!-- <div v-show="showSellerList" style="height: 100%;">
        <ul class="list" v-if="sellerList.length>0">
          <li v-for="d in sellerList" :class="!d.isOpenTime?'disabled':'undisabled'">
            <div class="flex flex-x-between flex-y-center">
              <div class="list-img">
                <img v-if="d.headPicUrl" :src="imgURL+d.headPicUrl">
                <img v-else src="../../assets/imgs/img_dianpu.png">
                <div
                  v-show="!d.isOpenTime"
                  style="position: absolute;height:100%;width:100%;top:0;left:0;color:#fff;background: rgba(0, 0, 0, 0.5)"
                  class="flex flex-x-center flex-y-center"
                >休息中</div>
              </div>
              <div class="flex-item-5">
                <p class="name">
                  <strong>{{d.storeName}}</strong>
                </p>
                <div class="flex flex-y-center">
                  <img
                    v-if="d.isOpenTime"
                    src="../../assets/imgs/icon_open.png"
                    alt
                    style="width:0.26rem;height:0.26rem;"
                  >
                  <img
                    v-else
                    src="../../assets/imgs/icon_close_store.png"
                    alt
                    style="width:0.26rem;height:0.26rem;"
                  >
                  <p
                    style="color:#989E92;margin-left:0.2rem;"
                  >营业时间：{{d.openStart}}:00~{{d.openEnd}}:00</p>
                </div>
                <p style="color:#989E92">配送时间：{{d.distributionStart}}:00~{{d.distributionEnd}}:00</p>
              </div>
              <div class="flex-item-3 tar">
                <div class="status-btns flex flex-x-end flex-y-center" v-if="d.isOpenTime">
                  <div class="open-status">营业中</div>
                  <div class="enterbtn" @click="toSellerShop(d.sellerId)">我要进店</div>
                </div>
                <p style="color:#797D77">{{d.distributionToday==1?'支持当天配送':'次日配送'}}</p>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="flex flex-x-center flex-y-center" style="height: 100%;">
          <div>
            <img src="../../assets/imgs/my_default_img.png">
            <p style="color: #999;" class="tac">还没有收藏商家</p>
          </div>
        </div>
      </div>-->
      <!-- 收藏商品 -->
      <div v-show="showProductcollection" style="height: 100%;">
        <yd-infinitescroll
          :callback="getProductcollection"
          ref="productcollection"
          v-if="productcollection.length>0"
        >
          <ul class="product-list" slot="list">
            <li class="flex flex-y-center flex-x-between" v-for="d in productcollection">
              <div class="flex flex-y-center">
                <!-- 图片 -->
                <div class="imgwarp">
                  <img class="goodpic" v-if="d.proPic" :src="imgURL+d.proPic" alt>
                  <img class="goodpic" v-else src="../../assets/imgs/img_moren.png">
                </div>
                <div class="info">
                  <!--商品名&规格名-->
                  <template v-if="d.skuMethodType == 1">
                    <h1>{{d.productName+'['+d.skuMeasureName+']'}}</h1>
                  </template>
                  <template v-else>
                    <h1
                      v-if="d.proMeasureName != d.skuMeasureName"
                    >{{d.productName+'['+d.skuWeight+d.proMeasureName+'/'+d.skuMeasureName+']'}}</h1>
                    <h1 v-else>{{d.productName+'['+d.proMeasureName+']'}}</h1>
                  </template>
                  <!--供应商-->
                  <p>{{d.sellerName}}</p>
                  <!--库存-->
                  <!-- <p>计量方式：{{d.skuMethodType == 1 ?'计重':'计件'}}</p> -->
                  <p>{{d.stockLimit == '0' ? '库存充足' : d.canUseQuantity>0 ? '库存量：'+d.canUseQuantity/100 : '库存较少'}}</p>
                  <!--价格-->
                  <template v-if="d.promotionPrice < d.price">
                    <span class="active-status">促销</span>
                    <span style="text-decoration: line-through;color: #797D77;">{{'￥'+d.price}}</span>
                  </template>
                  <h3 v-if="d.promotionPrice>0 && d.promotionBasePrice>0">{{'￥'+d.promotionPrice}}</h3>
                  <h3 v-else-if="d.price==0">￥时价</h3>
                  <h3 v-else>{{'￥'+d.price}}</h3>
                </div>
              </div>
              <!--<div class="caigou_icon" v-if="(d.stockLimit==1 &&  d.canUseQuantity>0) || d.stockLimit==0"></div>-->
              <div class="caigou_icon flex flex-y-center" v-if="d.skuMethodType == 2">
                <template v-if="d.quantity>0 || d.quantity=== ''">
                  <div @click="jian(d)">
                    <img src="../../assets/imgs/caigou_icon_jian.png">
                  </div>
                  <yd-input
                    @change.native="quantityInput(d)"
                    v-model="d.quantity"
                    max="6"
                    type="number"
                    :show-success-icon="false"
                    :show-clear-icon="false"
                    class="quantity-input"
                  ></yd-input>
                </template>
                <div @click="add(d)">
                  <img src="../../assets/imgs/caigou_icon_add.png">
                </div>
              </div>
              <!--计重的时候可以输入小于1的数字-->
              <div class="caigou_icon flex flex-y-center" v-if="d.skuMethodType == 1">
                <template v-if="d.showjianBtn">
                  <div @click="jian(d)">
                    <img src="../../assets/imgs/caigou_icon_jian.png">
                  </div>
                  <yd-input
                    @change.native="quantityInput(d)"
                    v-model="d.quantity"
                    max="6"
                    type="number"
                    :show-success-icon="false"
                    :show-clear-icon="false"
                    class="quantity-input"
                  ></yd-input>
                </template>
                <div @click="add(d)">
                  <img src="../../assets/imgs/caigou_icon_add.png">
                </div>
              </div>
            </li>
          </ul>
          <span slot="doneTip">没有更多商品啦</span>
        </yd-infinitescroll>
        <div v-else class="flex flex-x-center flex-y-center" style="height: 100%;">
          <div>
            <img src="../../assets/imgs/my_default_img.png">
            <p style="color: #999;" class="tac">还没有收藏商品</p>
          </div>
        </div>
      </div>

      <!--搜索全部商品的时候底部购物状态 -->
      <yd-tabbar slot="tabbar">
        <div class="yd-tabbar">
          <div class="tabbar flex">
            <div class="flex flex-y-center">
              <span class="price-tips">
                <strong>￥{{shopCar.shopMoney}}</strong>
              </span>
              <span class="sjtips">商家{{shopCar.shopNum}}/商品{{shopCar.commodityNum}}</span>
            </div>
            <div>
              <div class="tabbar-btn tabbarbtn-active" @click="goShopCar">
                <span>购物车</span>
                ({{shopCar.commodityNum}})
              </div>
            </div>
          </div>
        </div>
      </yd-tabbar>
    </yd-layout>
  </div>
</template>
<script>
import menuTab from "../component/menu.vue";
import list from "../component/list.vue";
import mixin from "../../utils/mixin.js";
import mixin_store from "../../utils/mixin_store.js";
import mixin_shop from "../../utils/mixin_shop.js";

export default {
  mixins: [mixin, mixin_store, mixin_shop],
  components: {
    menuTab,
    list
  },
  data() {
    return {
      menu: ["收藏商家", "收藏商品"],
      showSellerList: true,
      sellerList: [],
      showProductcollection: false,
      pageNum: 1,
      pageSize: 10,
      sellersPageNum: 1,
      sellersPageSize: 10,
      productcollection: [],

      // 搜索商品购物车状态
      shopCar: {
        shopNum: 0,
        commodityNum: 0,
        shopMoney: "0.00"
      }
    };
  },
  async created() {

    if (this.$router.name == "UserCollection") {
      this.$store.dispatch("changeNavBarTitle", "我的收藏");
    }
    this.server_date = await this.getServerTime()
    this.getShippingcarList();
    this.getSellerStoreList();
  },
  methods: {
    /**
     * 点击商品分类
     */
    menuclick(index) {
      if (this.$refs.productcollection) {
        this.$refs.productcollection.$emit("ydui.infinitescroll.reInit");
      }
      if (index == 1) {
        this.showProductcollection = true;
        this.showSellerList = false;
        this.pageNum = 1;
        this.productcollection = [];
        this.getProductcollection();
      } else {
        this.showSellerList = true;
        this.showProductcollection = false;
        this.sellersPageNum = 1;
        this.sellerList = [];
        this.getSellerStoreList();
      }
    },
    /**
     * 跳转供应商商品
     */
    toSellerShop(sellerId) {
      this.$router.push({
        name: "Shop",
        query: {
          sellerId: sellerId
        }
      });
    },
    /**
     * 获取收藏的供应商
     */
    getSellerList() {
      this.postRequest("suppliercollection/querySellerByCustomerId", {
        customerId: this.userInfo.typeCode
      }).then(resp => {
        if (resp.data && resp.data.state == 0) {
          if (resp.data.aaData) {
            var a = [];
            for (var i in resp.data.aaData) {
              (seller => {
                this.getStore(seller.sellerId, function(store) {
                  // 获取当前时间小时
                  let h = new Date(this.server_date).getHours();

                  if (h < store.openStart || h >= store.openEnd) {
                    store.isOpenTime = false;
                  } else {
                    store.isOpenTime = true;
                  }
                  var o = Object.assign(store, seller);
                  a.push(o);
                });
              })(resp.data.aaData[i]);
            }
            this.sellerList = a;
          }
        }
      });
    },
    /**
     * 获取供应商列表店铺信息
     */
    getSellerStoreList() {
      this.postRequest("suppliercollection/queryStoreBySellerId", {
        customerId: this.userInfo.typeCode,
        pageNum: this.sellersPageNum,
        pageSize: this.sellersPageSize
      },false,false,"数据加载中").then(resp => {
        if (resp.data && resp.data.state == 0) {
          for (let a of resp.data.aaData) {
            if (a.storeItem) {
              // 获取当前时间小时
              let h = new Date(this.server_date).getHours();

              if (h < a.storeItem.openStart || h >= a.storeItem.openEnd) {
                a.storeItem.isOpenTime = false;
              } else {
                a.storeItem.isOpenTime = true;
              }
            }
          }

          if (this.sellersPageNum == 1) {
            this.sellerList = resp.data.aaData;
          } else {
            this.sellerList = [...this.sellerList, ...resp.data.aaData];
          }

          if (this.sellerList.length >= resp.data.dataCount) {
            /* 所有数据加载完毕 */
            if (this.$refs.sellerListScoll) {
              this.$refs.sellerListScoll.$emit(
                "ydui.infinitescroll.loadedDone"
              );
            }
            return;
          }

          /* 单次请求数据完毕 */
          if (this.$refs.sellerListScoll) {
            this.$refs.sellerListScoll.$emit("ydui.infinitescroll.finishLoad");
          }
          this.sellersPageNum++;
        }
      });
    },
    /**
     * 获取收藏品
     */
    getProductcollection() {
      this.postRequest("productcollection/querylistByCustomerId", {
        customerId: this.userInfo.typeCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      },false,false,"数据加载中").then(resp => {
        if (resp.data && resp.data.state == 0) {

          for (var i in resp.data.aaData) {
            // 初始化商品数量
            resp.data.aaData[i].quantity = 0;
            // 计重商品输入小于1的数量
            resp.data.aaData[i].showjianBtn = false;
            // 获取购物车数已经选择了的商品的数量
            if (this.queryGrouplist.length > 0) {
              for (var j in this.queryGrouplist) {
                if (this.queryGrouplist[j].skuId == resp.data.aaData[i].skuId) {
                  resp.data.aaData[i].quantity = this.queryGrouplist[
                    j
                  ].quantity;
                  if (
                    resp.data.aaData[i].skuMethodType == 1 &&
                    resp.data.aaData[i].quantity > 0
                  ) {
                    resp.data.aaData[i].showjianBtn = true;
                  }
                }
              }
            }
          }

          if (this.pageNum == 1) {
            this.productcollection = resp.data.aaData;
          } else {
            this.productcollection = [
              ...this.productcollection,
              ...resp.data.aaData
            ];
          }

          if (this.productcollection.length >= resp.data.dataCount) {
            if (this.$refs.productcollection) {
              /* 所有数据加载完毕 */
              this.$refs.productcollection.$emit(
                "ydui.infinitescroll.loadedDone"
              );
            }
            return;
          }
          /* 单次请求数据完毕 */
          if (this.$refs.productcollection) {
            this.$refs.productcollection.$emit(
              "ydui.infinitescroll.finishLoad"
            );
          }
          this.pageNum++;
        }
      });
    },
    /**
     * 输入商品
     */
    quantityInput(d) {
      if (d.skuMethodType == 1) {
        // 计重可以下小于1的
        d.quantity = (d.quantity - 0).toFixed(2) - 0;
        if (d.quantity == 0) {
          d.showjianBtn = false;
        }
      } else {
        if (d.quantity == "") {
          d.quantity = 1;
        } else {
          // 计件的商品只能输入整数
          d.quantity = parseInt(d.quantity) - 0;
        }
      }
      /**
       * 限制最大输入数量
       */
      if (d.quantity <= 999999) {
        this.createShippingcar(d);
      } else {
        d.quantity = 999999;
        this.createShippingcar(d);
        this.$dialog.notify({
          mes: "输入数量超出最大限制（999999）",
          timeout: 2000
        });
      }
    },
    /**
     * 加商品
     */
    add(d) {
      if (d.skuMethodType == 1) {
        // 计重可以下小于1的
        d.quantity = (d.quantity - 0 + 1).toFixed(2) - 0;
        d.showjianBtn = true;
      } else {
        d.quantity = (d.quantity - 0 + 1).toFixed(2) - 0;
      }

      if (d.quantity <= 999999) {
        this.createShippingcar(d, "add");
      } else {
        d.quantity = 999999;
        this.$dialog.notify({
          mes: "输入数量超出最大限制（999999）",
          timeout: 2000
        });
      }
    },
    /**
     * 减商品
     */
    jian(d) {
      if (d.skuMethodType == 1) {
        // 计重可以下小于1的
        d.quantity = (d.quantity - 0 - 1).toFixed(2) - 0;
        if (d.quantity <= 0) {
          d.quantity = 0;
          d.showjianBtn = false;
        }
      } else {
        d.quantity = (d.quantity - 0 - 1).toFixed(2) - 0;
      }
      if (d.quantity >= 0) {
        this.createShippingcar(d);
      }
    },
    /**
     * 跳转搜索页面购物车
     */
    goShopCar() {
      if (this.shopCar.commodityNum > 0) {
        this.$router.push({
          name: "searchCar"
        });
      } else {
        this.$dialog.toast({
          mes: "购物车还没有数据哟",
          timeout: 1500
        });
      }
    }
  }
};
</script>
<style lang="scss">
#UserCollection {
  height: 100%;
  .yd-scrollview:after {
    display: none;
  }
  /**底部*/
  .yd-tabbar {
    padding: 0 !important;
  }
  .tabbar {
    height: 0.98rem;
    .status-icon {
      .badge {
        position: absolute;
        top: -3px;
        right: -0.1rem;
      }
      height: 1.12rem;
      width: 1.12rem;
      border: 3px solid #fff;
      background: #c2c2c2;
      border-radius: 1rem;
      position: absolute;
      top: -0.3rem;
      left: 0.25rem;
      z-index: 100;
    }
    .tips {
      font-size: 0.3.6rem;
      color: #989e92; // padding-left: 1.62rem;
      padding-left: 0.25rem;
    }
    .price-tips {
      font-size: 0.36rem;
      color: #ff3d15;
      padding-left: 0.3rem;
    }
    .sjtips {
      padding-left: 0.25rem;
      color: #797d77;
    }
    .tabbar-btn {
      span {
        font-size: 0.36rem;
      }
      height: 100%;
      line-height: 0.98rem;
      width: 2.4rem;
      text-align: center;
      background: #989e92;
      color: #fff;
      font-size: 0.3rem;
      position: absolute;
      right: 0;
    }
    .tabbarbtn-active {
      background: #fe971d;
    }
  }
  ul.list {
    li.disabled {
      .flex-item-5 {
        opacity: 0.5;
      }
    }
    li {
      padding: 0.25rem;
      border-bottom: 1px solid #ddd;
      .list-img {
        margin-right: 0.25rem;
        width: 1rem;
        height: 1rem;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
      }
      p.name {
        font-size: 0.27rem;
        padding-bottom: 0.06rem;
      }
      .status-btns {
        margin-bottom: 0.1rem;
        height: 0.36rem;
        .open-status {
          border: 1px solid #6fb138;
          padding: 0 0.08rem;
          color: #6fb138;
          border-radius: 2px 0 0 2px;
        }
        .enterbtn {
          border: 1px solid #6fb138;
          padding: 0 0.05rem;
          background: #6fb138;
          color: #fff;
          border-radius: 0 2px 2px 0;
        }
      }
    }
    background: #fff;
  }

  ul.product-list {
    padding-top: 0rem;
    li {
      padding: 0.2rem 0;
      border-bottom: 1px solid #ddd;
      position: relative;
      .imgwarp {
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 2px;
        overflow: hidden;
        position: relative;
        img.goodpic {
          width: 100%;
          height: 100%;
        }
        img.scpic {
          position: absolute;
          top: 0;
          width: 0.32rem;
          height: 0.36rem;
        }
        .quehuo-s {
          width: 100%;
          height: 100%;
          position: absolute;
          background: rgba(0, 0, 0, 0.5);
          top: 0;
          left: 0;
          color: #fff;
        }
      }
      .caigou_icon {
        position: absolute;
        right: 0.25rem;
        // top: 50%;
        // margin-top: -0.22rem;
        bottom: 0.2rem;

        input {
          font-size: 0.3rem;
        }
        img {
          display: block;
          width: 0.44rem;
          height: 0.44rem;
        }
        .quantity-input {
          background: #eeeeee;
          width: 0.8rem;
          height: 0.44rem;
          margin: 0 2px;
          input {
            text-align: center;
          }
        }
      }
      .info {
        padding-left: 0.25rem;
        h1 {
          font-size: 0.3rem;
        }
        p {
          color: #797d77;
          padding: 0.02rem 0;
        }
        h3 {
          font-size: 0.3rem;
          color: #ff3d15;
        }
      }
      .addicon {
        position: absolute;
        right: 0.25rem;
      }
    }
  }
  ul.product-list {
    padding-top: 0;
    li {
      padding-left: 0.25rem;
      background: #fff;
    }
  }
}
</style>
