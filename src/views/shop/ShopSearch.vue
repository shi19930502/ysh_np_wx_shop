<template>
  <div id="ShopSearch">
    <yd-layout>
      <div class="flex flex-x-between" style="background-color:#efeff4;">
        <yd-search v-model="searchValue" placeholder="请输入商品关键字" class="flex-item-8"></yd-search>
        <div class="quxbtn" @click="initSearch">返回</div>
      </div>
      <yd-scrolltab style="top: 1rem;">
        <div class="search-pro">
          <yd-infinitescroll
            :callback="getProductList"
            ref="productListsearch"
            v-if="productList.length>0"
          >
            <ul class="product-list" v-if="productList.length>0" slot="list">
              <li class="flex flex-y-center flex-x-between" v-for="d in productList">
                <div class="flex flex-y-center">
                  <div class="imgwarp">
                    <img
                      v-if="d.isCollection==0"
                      src="../../assets/imgs/sc-icon.png"
                      class="scpic"
                      @click="createProductcollection(d)"
                    >
                    <img
                      v-if="d.isCollection==1"
                      src="../../assets/imgs/sc-icon_a.png"
                      class="scpic"
                      @click="createProductcollection(d)"
                    >
                    <img class="goodpic" v-if="d.skuPicUrl" :src="imgURL+d.skuPicUrl" alt>
                    <img class="goodpic" v-else src="../../assets/imgs/img_moren@2x.png">
                    <!--下单不限制库存，值限制下单量-->
                    <!--<div v-if="d.canUseQuantity<0" class="quehuo-s flex flex-x-center flex-y-center">
											<span>缺货</span>
                    </div>-->
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
                    <p v-if="d.name">规格名：{{d.name}}</p>
                    <!--描述-->
                    <p v-if="d.f_remark">
                      <template v-if="d.f_remark.length>6">{{d.f_remark.substring(0,6)+'...'}}</template>
                      <template v-else>{{d.f_remark}}</template>
                    </p>
                    <p v-else>暂无描述</p>
                    <!--库存-->
                    <!-- <p>计量方式：{{d.skuMethodType == 1 ?'计重':'计件'}}</p> -->
                    <p>{{d.stockLimit == '0' ? '库存充足' : d.canUseQuantity>0 ? '库存量：'+d.canUseQuantity/100 : '库存较少'}}</p>
                    <p>{{d.supplierName}}</p>
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
              <p style="color: #999;" class="tac">没有搜索到商品</p>
            </div>
          </div>
        </div>
      </yd-scrolltab>
      <!--搜索全部商品的时候底部购物状态 -->
      <yd-tabbar slot="tabbar">
        <div class="yd-tabbar">
          <div class="tabbar flex">
            <div class="flex flex-y-center">
              <span class="price-tips">
                <strong ref="shopCarshopMoney">￥{{shopCar.shopMoney}}</strong>
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
import mixin from "../../utils/mixin.js";
import mixin_category from "../../utils/mixin_category.js";
import mixin_shop from "../../utils/mixin_shop.js";
import mixin_store from "../../utils/mixin_store.js";
import configs from "../../configs";
export default {
  data() {
    return {
      searchValue: "",
      pageNum: 1,
      pageSize: 10,
      productList: []
    };
  },
  mixins: [mixin, mixin_shop, mixin_category, mixin_store],
  watch: {
    searchValue: "searchProduct"
  },
  created() {
    this.getShippingcarList();
    this.getProductList();
  },
  mounted() {},
  methods: {
    /**
     * 获取客户类型
     */
    getisChoiceSupplier(cb) {
      this.postRequest("customer/queryById", {
        id: this.userInfo.typeCode
      }).then(resp => {
        if (resp.data && resp.data.aaData) {
          cb && cb(resp.data.aaData.isChoiceSupplier);
        }
      });
    },
    /**
     * 获取商品列表
     */
    getProductList() {
      var param = {
        code: "",
        purchaserId: this.userInfo.typeCode,
        supplierId: this.$route.query.sellerId,
        keyWord: this.searchValue,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      var purl = "productsku/getSkuByQuotation";

      // 临沂跨店铺搜索
      if (configs.cityName == "linyiAll") {
        purl = "productsku/getSkuOverStore";
        delete param.supplierId;
        delete param.code;
        this.productApi(purl, param);
      } else {
        // 如果根据用户能不能搜索全部渠道商品的
        this.getisChoiceSupplier(d => {
          if (d == 1) {
            // 能搜索全部渠道的商品
            purl = "productsku/getSkuByOftenBuyOverChannel";
            delete param.supplierId;
            delete param.code;
          } else {
            purl = "productsku/getSkuByQuotation";
          }
          this.productApi(purl, param);
        });
      }
    },
    /**
     * api
     */
    productApi(purl, param) {
      this.$dialog.loading.open("商品加载中");
      this.postRequest(purl, param).then(resp => {
        if (resp.data && resp.data.state == 0) {
          this.$dialog.loading.close();
          if (resp.data.aaData.length > 0) {
            for (var i in resp.data.aaData) {
              // 初始化商品数量
              resp.data.aaData[i].quantity = 0;
              // 计重商品输入小于1的数量
              resp.data.aaData[i].showjianBtn = false;
              // 获取购物车数已经选择了的商品的数量
              if (this.queryGrouplist.length > 0) {
                for (var j in this.queryGrouplist) {
                  if (
                    this.queryGrouplist[j].skuId == resp.data.aaData[i].skuId ||
                    this.queryGrouplist[j].skuId == resp.data.aaData[i].id
                  ) {
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
              this.productList = resp.data.aaData;
            } else {
              this.productList = [...this.productList, ...resp.data.aaData];
            }

            if (this.productList.length >= resp.data.dataCount) {
              if (this.$refs.productListsearch) {
                /* 所有数据加载完毕 */
                this.$refs.productListsearch.$emit(
                  "ydui.infinitescroll.loadedDone"
                );
              }
              return;
            }
            /* 单次请求数据完毕 */
            if (this.$refs.productListsearch) {
              this.$refs.productListsearch.$emit(
                "ydui.infinitescroll.finishLoad"
              );
            }
            this.pageNum++;
          } else {
            this.productList = [];
          }
        }
      });
    },
    /**
     * 搜索商品
     */
    searchProduct(value) {
      this.pageNum = 1;
      if (this.$refs.productListsearch) {
        this.$refs.productListsearch.$emit("ydui.infinitescroll.reInit");
      }
      this.getProductList(value);
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
        this.createShippingcar(d);
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
     * 关联供应商
     */
    updateSupplierRelete(sku, cb) {
      // 先判断是否关联了该供应商
      var param = {
        customerName: this.userInfo.nickName,
        customerId: this.userInfo.typeCode,
        joininCustomerIdsString: sku.supplierId,
        sellerName: sku.supplierName,
        type: 1
      };
      this.postRequest("suppliercollection/updateSupplierRelete", param).then(
        resp => {
          if (resp.data && resp.data.state == 0) {
            cb && cb();
          }
        }
      );
    },
    /**
     * 返回
     */
    initSearch() {
      if (this.$route.query.backnum) {
        this.$router.go(-2);
      } else {
        this.$router.back();
      }
    },
    /**
     * 收藏商品
     */
    createProductcollection(d) {
      var data = d;
      console.log(data)
      if (d.isCollection == 0) {
        var param = {
          customerId: this.userInfo.typeCode - 0,
          sellerId: d.supplierId || this.sellerId || this.$route.query.sellerId,
          sellerName: d.supplierName,
          productId: d.productId,
          productName: d.productName,
          skuId: d.id,
          skuName: d.name
        };
        this.postRequest("Productcollection/create", param).then(d => {
          if (d.data && d.data.state == 0) {
            this.$dialog.toast({
              mes: "收藏成功",
              timeout: 1200,
              icon: "success",
              callback: () => {
                data.isCollection = 1;
              }
            });
          }
        });
      } else {
        this.postRequest("productcollection/deleteByCustomerIdAndSkuId", {
          customerId: this.userInfo.typeCode - 0,
          skuId: d.id
        }).then(d => {
          if (d.data && d.data.state == 0) {
            this.$dialog.toast({
              mes: "取消收藏",
              timeout: 1200,
              icon: "success",
              callback: () => {
                data.isCollection = 0;
              }
            });
          }
        });
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
#ShopSearch {
  height: 100%;
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
  .yd-scrolltab-content {
    padding-bottom: 0;
    padding-right: 0;
  }
  .yd-search-input {
    background-color: #80c551;
  }
  .yd-search-input > .cancel-text {
    display: none !important;
  }
  .search-pro {
    height: 100%;
    overflow-y: auto;
  }
  .search-pro::-webkit-scrollbar {
    display: none;
  }
  ul.product-list {
    padding-top: 0;
    li {
      padding-left: 0.2rem;
    }
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
  .quxbtn {
    white-space: nowrap;
    padding-left: 10px;
    line-height: 30px;
    color: #fff;
    background: #80c551;
    font-size: 14px;
    padding-right: 10px;
    margin-left: -10px;
    padding: 10px;
  }
}
</style>
