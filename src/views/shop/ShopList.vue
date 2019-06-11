<template>
  <yd-layout id="ShopList">
    <yd-scrolltab v-show="isLoad" ref="shopListWrapper">
      <!-- yd-scrolltab组件下用div高度100%y轴方向滚动不会报错 -->
      <div class="scrolltab-content" style="height: 100%;overflow-y: auto;" id="shopListWrapper">
        <div class="header gradient" v-if="isLoad">
          <div class="search flex flex-y-center">
            <div class="select-pfs flex-item-4 flex flex-y-center ellipsis">
              <!-- <yd-icon name="refresh" style="font-size:0.14rem;"></yd-icon> -->
              <van-icon name="exchange-record" size="18px"/>
              <!-- <span>选择批发商</span> -->
              <select style="border: none;color: #fff;" @change="changeSeller" v-model="sellerId">
                <template v-for="d,index in sellerList">
                  <option :value="d.sellerId">{{d.sellerName}}</option>
                </template>
              </select>
              <!-- <img
                src="../../assets/imgs/icon_up.png"
                style="display: block;width: 0.24rem;height: 0.14rem;"
              >-->
            </div>
            <div>
              <!--<yd-icon @click.native="showSearchFNC" name="search" color="#fff" size="0.4rem"></yd-icon>-->
              <yd-icon @click.native="tosearchpage" name="search" color="#fff" size="0.4rem"></yd-icon>
              <img class="close-icon" src="../../assets/imgs/tab_close.png" @click="backHome">
            </div>
          </div>

          <div class="header-content">
            <div class="flex flex-y-center">
              <div class="headimg">
                <img v-if="storeInfo.headPicUrl" :src="imgURL+storeInfo.headPicUrl">
                <img v-else src="../../assets/imgs/img_dianpu.png">
              </div>
              <div class="info">
                <p class="name flex-y-center" @click="toShopDetails">
                  <strong>{{storeInfo.storeName || ' '}}</strong>
                  <img
                    src="../../assets/imgs/icon_right.png"
                    alt
                    style="display: inline-block;width: 0.14rem;height: 0.24rem;"
                  >
                </p>
                <p
                  class="time"
                >配送时间：{{storeInfo.distributionStart+':00'+'-'+storeInfo.distributionEnd+':00'}}</p>
                <yd-badge
                  shape="square"
                  bgcolor="#FE971D"
                  v-if="storeInfo.distributionToday==1"
                >支持当天配送</yd-badge>
                <yd-badge shape="square" bgcolor="#FE971D" v-else>次日配送</yd-badge>
              </div>
              <div class="scbtn" v-show="sellerInfo.isChoiceSupplier == 1">收藏</div>
            </div>
          </div>
        </div>
        <!-- 信用评分 -->
        <div class="credit-score flex flex-x-between flex-y-center" v-if="isLoad">
          <div class="left flex flex-y-center">
            <img src="../../assets/imgs/icon_xinyong.png">
            <span>
              信用等级
              <span class="score">{{reputationLevel}}</span>
            </span>
          </div>
          <div class="right flex flex-y-center">
            <span @click="toShopEvaluate">查看详情 ></span>
          </div>
        </div>

        <!-- 菜单导航 -->
        <div class="classify flex-y-start">
          <div id="storName" class="flex flex-y-center">
            <strong>{{storeInfo.storeName}}</strong>
          </div>
          <!-- 商品分类列表 -->
          <div class="menu">
            <div class="menu-tab" style="overflow-x: auto">
              <ul class="flex">
                <template v-for="(d, index) in categoryList">
                  <li
                    :class="d.isActive?'active':''"
                    :style="'min-width: ' + (d.name.length*0.3 +0.5) + 'rem'"
                    @click="menuClick(d)"
                  >
                    <strong>{{d.name}}</strong>
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <div class="flex" :style="'height:'+scrollheight">
            <div class="left" v-if="secondCategoryList.length>0">
              <template v-for="d,index in secondCategoryList">
                <div
                  v-if="d.isActive"
                  class="item active"
                  @click="secondCategoryListClick(d,d.gbgoodsId)"
                >
                  <div class="iteminner">{{d.name}}</div>
                </div>
                <div v-else class="item" @click="secondCategoryListClick(d,d.gbgoodsId)">
                  <div class="iteminner">{{d.name}}</div>
                </div>
              </template>
            </div>
            <div class="right flex-item-6" id="rightScrolltab">
              <yd-infinitescroll
                :callback="getProductList"
                ref="productList"
                v-if="productList.length>0"
              >
                <ul class="product-list" slot="list" v-if="productList.length>0">
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
                        <img
                          class="goodpic"
                          v-if="d.skuPicUrl"
                          :src="imgURL+d.skuPicUrl"
                          alt
                          @click="showProDetailfuc(d)"
                        >
                        <img
                          class="goodpic"
                          v-else
                          src="../../assets/imgs/img_moren@2x.png"
                          @click="showProDetailfuc(d)"
                        >
                        <!--下单不限制库存，值限制下单量-->
                        <!--<div v-if="d.stockLimit==1 && d.canUseQuantity<=0" class="quehuo-s flex flex-x-center flex-y-center">
												<span>缺货</span>
                        </div>-->
                      </div>
                      <div class="info flex-item-1">
                        <!--商品名&规格名-->
                        <template v-if="d.skuMethodType == 1">
                          <h1>{{d.productName+'['+d.skuMeasureName+']'}}</h1>
                        </template>
                        <template v-else>
                          <h1
                            v-if="d.proMeasureName != d.skuMeasureName"
                          >{{d.productName+'['+d.skuWeight+d.proMeasureName+'/'+d.skuMeasureName+']'}}</h1>
                          <h1 v-else>{{d.productName+'['+d.skuMeasureName+']'}}</h1>
                        </template>
                        <p>规格名：{{d.name}}</p>
                        <!--描述-->
                        <p v-if="d.remark">
                          <template v-if="d.remark.length>6">{{d.remark.substring(0,6)+'...'}}</template>
                          <template v-else>{{d.remark}}</template>
                        </p>
                        <p v-else>暂无描述</p>
                        <!--库存-->
                        <!-- <p>计量方式：{{d.skuMethodType == 1 ?'计重':'计件'}}</p> -->
                        <p>{{d.stockLimit == '0' ? '库存充足' : d.canUseQuantity>0 ? '库存量：'+d.canUseQuantity/100 : '库存较少'}}</p>

                        <!--价格-->
                        <template v-if="d.promotionPrice < d.price">
                          <span class="active-status">促销</span>
                          <span
                            style="text-decoration: line-through;color: #797D77;"
                          >{{'￥'+d.price}}</span>
                        </template>
                        <h3
                          v-if="d.promotionPrice>0 && d.promotionBasePrice>0"
                        >{{'￥'+d.promotionPrice}}</h3>
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
                          :max="5"
                          type="number"
                          :show-success-icon="false"
                          :show-clear-icon="false"
                          class="quantity-input"
                        ></yd-input>
                      </template>
                      <div @click="add(d,true)" :ref="'proSku_'+d.id">
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
                          :max="5"
                          type="number"
                          :show-success-icon="false"
                          :show-clear-icon="false"
                          class="quantity-input"
                        ></yd-input>
                      </template>
                      <div @click="add(d,true)" :ref="'proSku_'+d.id">
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
                  <p style="color: #999;" class="tac">暂无商品</p>
                </div>
              </div>
              <!--<div v-else style="height: 100%" class="flex flex-y-center flex-x-center">暂无商品信息</div>-->
            </div>
          </div>
        </div>
      </div>
    </yd-scrolltab>

    <!-- 当前店铺的购物车 -->
    <yd-popup v-model="showShopCar" position="bottom" height="70%" class="currentCatpop">
      <!-- <yd-scrolltab v-show="isLoad" ref="productList"> -->
      <!-- yd-scrolltab组件下用div高度100%y轴方向滚动不会报错 -->
      <!-- <div class="scrolltab-content" style="height: 100%;overflow-y: auto;"> -->
      <div
        slot="top"
        class="flex flex-x-between"
        style="padding: 0.2rem;border-bottom: 1px solid #ddd;"
      >
        <yd-checkbox v-model="isCheckAll" shape="circle" :change="checkAll">全选</yd-checkbox>
        <yd-icon name="delete" @click.native="del" size="0.36rem"></yd-icon>
      </div>
      <yd-checklist v-model="carSettlementGoods" ref="checklistDemo" :callback="change">
        <div v-for="d in alreadyChosenGoods" class="flex flex-x-between flex-y-center">
          <yd-checklist-item :val="d.id" class="flex-item-6">
            <div style="padding: 12px 0;" class="flex flex-x-between flex-y-center">
              <!--商品名&规格名-->
              <template v-if="d.skuMethodType == 1">
                <span>{{d.productName+'['+d.skuMeasureName+']'}}</span>
              </template>
              <template v-else>
                <span
                  v-if="d.proMeasureName != d.skuMeasureName"
                >{{d.productName+'['+d.skuWeight+d.proMeasureName+'/'+d.skuMeasureName+']'}}</span>
                <span v-else>{{d.productName+'['+d.skuMeasureName+']'}}</span>
              </template>
            </div>
            <div></div>
          </yd-checklist-item>
          <div class="flex" style="padding: 0 0.2rem;">
            <div
              v-if="d.promotionPrice>0 && d.promotionBasePrice>0"
              class="popred"
            >{{'￥'+(d.promotionPrice*100*d.quantity/100 -0).toFixed(2)}}</div>
            <div v-else-if="d.price==0" class="popred">￥时价</div>
            <div v-else class="popred">{{'￥'+(d.price*100*d.quantity/100-0).toFixed(2)}}</div>

            <div class="flex flex-y-center" v-if="d.skuMethodType == 2">
              <template v-if="d.quantity>0 || d.quantity===''">
                <div @click="jian(d)">
                  <img
                    src="../../assets/imgs/caigou_icon_jian.png"
                    style="display: block;width: 0.44rem;height: 0.44rem;"
                  >
                </div>
                <yd-input
                  @change.native="quantityInput(d)"
                  v-model="d.quantity"
                  :max="5"
                  type="number"
                  :show-success-icon="false"
                  :show-clear-icon="false"
                  class="quantity-input"
                ></yd-input>
              </template>
              <div @click="add(d)">
                <img
                  src="../../assets/imgs/caigou_icon_add.png"
                  style="display: block;width: 0.44rem;height: 0.44rem;"
                >
              </div>
            </div>
            <!--计重-->
            <div class="flex flex-y-center" v-if="d.skuMethodType == 1">
              <!--<template v-if="d.showjianBtn">-->
              <div @click="jian(d)">
                <img
                  src="../../assets/imgs/caigou_icon_jian.png"
                  style="display: block;width: 0.44rem;height: 0.44rem;"
                >
              </div>
              <yd-input
                @change.native="quantityInput(d)"
                v-model="d.quantity"
                :max="5"
                type="number"
                :show-success-icon="false"
                :show-clear-icon="false"
                class="quantity-input"
              ></yd-input>
              <!--</template>-->
              <div @click="add(d)">
                <img
                  src="../../assets/imgs/caigou_icon_add.png"
                  style="display: block;width: 0.44rem;height: 0.44rem;"
                >
              </div>
            </div>
          </div>
        </div>
      </yd-checklist>
      <div class="yd-tabbar" slot="bottom">
        <div class="tabbar flex">
          <div class="flex flex-y-center">
            <div
              class="status-icon flex flex-y-center flex-x-center"
              :style="carSettlementGoods.length == 0 ? 'background:#C2C2C2' : 'background:#6FB138'"
            >
              <img src="../../assets/imgs/icon_caigou.png" style="width: 0.5rem;height:0.5rem;">
              <yd-badge
                class="badge"
                v-show="carSettlementGoods.length != 0"
                bgcolor="#FF3D15"
              >{{carSettlementGoods.length}}</yd-badge>
            </div>
            <span class="tips" v-if="carSettlementGoods.length == 0">暂未选择商品</span>
            <span v-else class="price-tips">
              <strong>￥{{orderTotalUp}}</strong>
            </span>
          </div>
          <div>
            <!-- 未营业 -->
            <div v-show="!isOpen" class="tabbar-btn flex flex-y-center flex-x-center">
              <div>
                <p>未营业</p>
              </div>
            </div>
            <div v-show="!isOpenTime && isOpen" class="tabbar-btn flex flex-y-center flex-x-center">
              <div>
                <p>未到营业时间</p>
              </div>
            </div>
            <div
              v-show="orderTotalUp<startAmountUp && isOpenTime && isOpen"
              class="tabbar-btn flex flex-y-center flex-x-center"
            >
              <div>
                <p>起配金额</p>
                <p>￥{{startAmountUp}}</p>
              </div>
            </div>
            <div
              v-show="isOpen && isOpenTime && orderTotalUp>=startAmountUp"
              class="tabbar-btn tabbarbtn-active flex flex-y-center flex-x-center"
              @click="toOrderSettlement2"
            >去结算</div>
            <!-- <div :class="carSettlementGoods.length == 0 ? 'tabbar-btn' : 'tabbar-btn tabbarbtn-active' " @click="toOrderSettlement2">去结算</div> -->
          </div>
        </div>
      </div>
      <!-- </div> -->
      <!-- </yd-scrolltab> -->
    </yd-popup>
    <!-- <pro-detail v-if="showProDetail" :modal="showProDetail" :params="proDetailParams" @getShowPop="closeProDetail"></pro-detail> -->
    <!-- 显示商品详情-->
    <yd-popup v-model="showProDetail" position="bottom" height="70%" class="ProSkuDetailPop">
      <div class="prodet-info flex flex-y-end">
        <div class="prodet-img">
          <img v-if="proDetailParams.skuPicUrl" :src="imgURL+proDetailParams.skuPicUrl" alt>
          <img v-else src="../../assets/imgs/img_moren@2x.png">
        </div>
        <div class="prodetpn">
          <p
            class="prodet-price"
            v-if="proDetailParams.promotionPrice>0 && proDetailParams.promotionBasePrice>0"
          >{{'￥'+proDetailParams.promotionPrice}}</p>
          <p class="prodet-price" v-else-if="proDetailParams.price==0">￥时价</p>
          <p class="prodet-price" v-else>{{'￥'+proDetailParams.price}}</p>

          <!--商品名&规格名-->
          <template v-if="proDetailParams.skuMethodType == 1">
            <p
              class="prodet-name"
            >{{proDetailParams.productName+'['+proDetailParams.skuMeasureName+']'}}</p>
          </template>
          <template v-else>
            <p
              class="prodet-name"
              v-if="proDetailParams.proMeasureName != proDetailParams.skuMeasureName"
            >{{proDetailParams.productName+'['+proDetailParams.skuWeight+proDetailParams.proMeasureName+'/'+proDetailParams.skuMeasureName+']'}}</p>
            <p
              class="prodet-name"
              v-else
            >{{proDetailParams.productName+'['+proDetailParams.skuMeasureName+']'}}</p>
          </template>
          <!-- <p class="prodet-skuname">规格名：{{proDetailParams.name}}</p> -->
        </div>
      </div>
      <div class="conteng-bg">
        <div class="closebtn" @click="showProDetail=false">
          <img src="../../assets/imgs/icon_close.png" alt>
        </div>
        <div class="line"></div>
        <p class="remark">{{proDetailParams.remark || '暂无描述'}}</p>
      </div>
    </yd-popup>
    <!-- 底部 -->
    <yd-tabbar slot="tabbar">
      <div class="yd-tabbar">
        <div class="tabbar flex">
          <div class="flex flex-y-center">
            <!-- @click="getShopCar" -->
            <div
              @click="getShopCar"
              ref="gouwuche"
              class="status-icon flex flex-y-center flex-x-center"
              :style="alreadyChosenGoods.length == 0 ? 'background:#C2C2C2' : 'background:#6FB138'"
            >
              <img src="../../assets/imgs/icon_caigou.png" style="width: 0.5rem;height:0.5rem;">
              <yd-badge
                class="badge"
                v-show="alreadyChosenGoods.length != 0"
                bgcolor="#FF3D15"
              >{{alreadyChosenGoods.length}}</yd-badge>
            </div>
            <span class="tips" v-if="alreadyChosenGoods.length == 0">暂未选择商品</span>
            <span v-else class="price-tips">
              <strong>￥{{orderTotal}}</strong>
            </span>
          </div>
          <div>
            <div
              style="right:1.6rem;border-right: 1px solid;background: #fff;"
              class="tabbar-btn flex flex-y-center flex-x-center"
            >
              <yd-icon @click.native="addShopCar" name="shopcart-outline" color="#FE971D"></yd-icon>
            </div>
            <!-- 未营业 -->
            <div v-show="!isOpen" class="tabbar-btn flex flex-y-center flex-x-center">
              <div>
                <p>未营业</p>
              </div>
            </div>
            <!-- 不在营业时间内 -->
            <div v-show="!isOpenTime && isOpen" class="tabbar-btn flex flex-y-center flex-x-center">
              <div>
                <p>未到营业时间</p>
              </div>
            </div>
            <!-- 在营业时间内部满足起配金额 -->
            <div
              v-show="orderTotal<startAmount && isOpenTime && isOpen"
              class="tabbar-btn flex flex-y-center flex-x-center"
            >
              <div>
                <p>起配金额</p>
                <p>￥{{startAmount}}</p>
              </div>
            </div>
            <!-- 在营业时间内满足起配金额 -->
            <div
              v-show="isOpen && isOpenTime && orderTotal >= startAmount"
              class="tabbar-btn tabbarbtn-active flex flex-y-center flex-x-center"
              @click="toOrderSettlement"
            >去结算</div>
          </div>
        </div>
      </div>
    </yd-tabbar>
  </yd-layout>
</template>
<script>
import menuTab from "../component/menu.vue";
import proDetail from "../component/ProSkuDetailPop.vue";

import mixin from "../../utils/mixin.js";
import mixin_category from "../../utils/mixin_category.js";
import mixin_shop from "../../utils/mixin_shop.js";
import mixin_store from "../../utils/mixin_store.js";
import Btn from "./product/Btn.js";
import Vue from "vue";

import { Icon } from "vant";

Vue.use(Icon);
export default {
  components: {
    menuTab,
    proDetail
  },
  mixins: [mixin, mixin_shop, mixin_category, mixin_store],
  data() {
    return {
      proDetailParams: {},
      showProDetail: false,
      meunIndex: 0,
      isLoad: false,
      // 上拉购物车
      carSettlementGoods: [],
      isCheckAll: false,
      showShopCar: false,
      // 选择的供应商
      sellerId: "",
      // 商品列表
      productList: [],
      // 已选商品总价
      orderTotal: 0,
      orderTotalUp: 0,
      startAmountUp: 1,
      settlementGoods: [],
      pageNum: 1,
      pageSize: 10,
 
      scrollheight: "calc(100% - (0.71rem + 3px))",
      // 是否在营业时间内
      isOpenTime: false,
      isOpen: false
    };
  },
  watch: {
    // 上拉购物车选择商品
    showShopCar: "reloadProductList",
    carSettlementGoods: {
      async handler(newValue) {
        var aaaaa = [];
        for (var i in this.alreadyChosenGoods) {
          for (var j in newValue) {
            if (newValue[j] == this.alreadyChosenGoods[i].id) {
              aaaaa.push(this.alreadyChosenGoods[i]);
            }
          }
        }
        // 选择上拉购物车如果有时价商品则不验证
        let startAmountUp = await this.getStartAmount(this.sellerId)
        if(this.showShopCar){
          this.startAmountUp = startAmountUp.startAmount
          for(let obj of aaaaa){
            if(obj.price == 0){
              this.startAmountUp = 0
            }
          }
        } else {
          this.startAmountUp = startAmountUp.startAmount
        }
        // 获取上拉购物车选中商品小计
        this.orderTotalUp = this.getOrderTotal(aaaaa).priceTotal;
      },
      deep: true
    }
  },
  async created() {
    this.$store.dispatch("changeNavBarTitle", "选购商品");
    this.server_date = await this.getServerTime()
    this.getSellers();
    // 获取购物车数据
    this.getShippingcarList();
    // 判断是否为个人中心进入
    if (this.$route.query.isUserEnter) {
      this.isUserEnter = this.$route.query.isUserEnter;
      this.gbgoodsId = "";
      this.isOftenBuy = true;
    }
    if (this.$route.query.sellerId) {
      this.sellerId = this.$route.query.sellerId;
    }
  },
  mounted() {
    //       // 获取滚动条的位置
    //       const scrolltab = document.getElementById('shopListWrapper')
    //       const scrolltabR = document.getElementById('rightScrolltab')
    //       // 一定程度禁止最外层滚动
    //       scrolltab.onscroll = (e) => {
    //         console.log(scrolltab.scrollTop);
    //         if (scrolltab.scrollTop >= 167) {
    //           document.getElementById('storName').style.display = 'block'
    //           this.scrollheight = 'calc(100% - (1.71rem + 3px))'
    //           // scrolltab.style.overflow = 'hidden'
    //         } else {
    //           document.getElementById('storName').style.display = 'none'
    //           this.scrollheight = 'calc(100% - (0.71rem + 3px))'
    //         }
    //       }
  },
  methods: {
    showProDetailfuc(d) {
      this.showProDetail = true;
      this.proDetailParams = d;
    },
    closeProDetail(showPop) {
      this.showProDetail = showPop;
    },
    /**
     * 搜索商品
     */
    searchProduct(value) {
      this.pageNum = 1;
      this.getProductList(value);
    },
    /**
     * 获取登录用户的供应商列表
     */
    getSellers() {
      this.postRequest("suppliercollection/querySellerByCustomerId", {
        customerId: this.userInfo.typeCode
      }).then(resp => {
        if (resp.data && resp.data.state == 0) {
          this.sellerList = resp.data.aaData;
          if (this.sellerId) {
            // 获取商品分类规格信息
            this.getCategoryList();
            // 获取起配金额
            this.setStartAmount(this.sellerId);
          } else {
            if (resp.data.aaData[0]) {
              this.sellerId = resp.data.aaData[0].sellerId;
              // 获取商品分类规格信息
              this.getCategoryList();
              // 获取起配金额
              this.setStartAmount(this.sellerId);
            }
          } // 获取登录用户供应商店铺
          this.getCustomerById();
        }
      });
    },
    /**
     * 获取登录用户供应商
     */
    async getCustomerById() {
      if (this.sellerId) {
        this.postRequest("customer/queryById", {
          id: this.sellerId
        }).then(resp => {
          if (resp.data && resp.data.state == 0) {
            // 获取店铺信息
            this.getStore(this.sellerId, store => {
              this.isLoad = true;
              this.storeInfo = store;
              this.isOpen = store.enabled == 1?true:false
              // 获取当前时间小时
              let h = new Date(this.server_date).getHours();
              if (h < store.openStart || h >= store.openEnd) {
                this.isOpenTime = false;
              } else {
                this.isOpenTime = true;
              }
            });
            this.countVisits();
            // 获取供应商信息
            if (resp.data.aaData) {
              this.sellerInfo = resp.data.aaData;
            }
            this.getReputation(this.sellerId);
          }
        });
      } else {
        let choiceSupplier = await this.getisChoiceSupplier();
        if (choiceSupplier == 1) {
          this.$router.push({
            name: "ShopSearch",
            query: {
              backnum: 1
            }
          });
        } else {
          this.$dialog.alert({
            mes: "未设置指定的供应商!",
            callback: () => {
              this.$router.back();
            }
          });
        }
      }
    },
    /**
     * 获取客户类型
     */
    getisChoiceSupplier() {
      return new Promise((resolve, reject) => {
        this.postRequest("customer/queryById", {
          id: this.userInfo.typeCode
        }).then(resp => {
          if (resp.data && resp.data.aaData) {
            resolve(resp.data.aaData.isChoiceSupplier);
          }
        });
      });
    },
    reloadProductList(){
      this.pageNum = 1
      if (this.$refs.productList) {
        this.$refs.productList.$emit('ydui.infinitescroll.reInit');
      }
      this.getProductList()
    },
    /**
     * 获取商品列表
     */
    getProductList() {
      var param = {
        code: this.gbgoodsId,
        purchaserId: this.userInfo.typeCode,
        supplierId: this.sellerId,
        keyWord: "",
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };

      // 是否为常买商品
      var purl;
      if (this.isOftenBuy) {
        purl = "productsku/getSkuByOftenBuy";
      } else {
        purl = "productsku/getSkuByQuotation";
      }
      this.productApi(purl, param);
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
              if (this.alreadyChosenGoods.length > 0) {
                for (var j in this.alreadyChosenGoods) {
                  if (
                    this.alreadyChosenGoods[j].skuId == resp.data.aaData[i].id
                  ) {
                    resp.data.aaData[i].quantity = this.alreadyChosenGoods[
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
              if (this.$refs.productList) {
                this.$refs.productList.$emit("ydui.infinitescroll.loadedDone");
              }
              return;
            }
            /* 单次请求数据完毕 */
            if (this.$refs.productList) {
              this.$refs.productList.$emit("ydui.infinitescroll.finishLoad");
            }
            this.pageNum++;
          } else {
            this.productList = [];
          }
        }
      });
    },
    /**
     * 结算
     */
    toOrderSettlement() {
      if (this.alreadyChosenGoods.length == 0) {
        this.$dialog.alert({
          mes: "暂未选择商品"
        });
      } else {
        for (var i in this.alreadyChosenGoods) {
          this.alreadyChosenGoods[i].btnText = "备注";
          this.alreadyChosenGoods[i].showRemarks = false;
        }
        var settlementParam = {
          settlementGoods: this.alreadyChosenGoods
        };
        var priceTotal = this.getOrderTotal(this.alreadyChosenGoods).priceTotal;
        var quantityTotal = this.getOrderTotal(this.alreadyChosenGoods)
          .quantityTotal;

        this.$dialog.confirm({
          title: this.storeInfo.storeName,
          mes: `共${
            this.alreadyChosenGoods.length
          }件商品,总数量${quantityTotal},总价:￥${priceTotal}`,
          opts: () => {
            localStorage.setItem(
              "settlementParam",
              JSON.stringify(settlementParam)
            );
            this.$router.push({
              name: "OrderSettlement",
              params: {
                sellerId: this.sellerInfo.id,
                sellerName: this.storeInfo.storeName,
                distributionType: this.storeInfo.distributionToday
              }
            });
          }
        });
      }
    },
    /**
     * 上拉购物车结算
     */
    toOrderSettlement2() {
      if (this.carSettlementGoods.length == 0) {
        this.$dialog.alert({
          mes: "请选择需要结算的商品"
        });
      } else {
        var a = [];
        for (var i in this.carSettlementGoods) {
          for (var j in this.alreadyChosenGoods) {
            if (this.carSettlementGoods[i] == this.alreadyChosenGoods[j].id) {
              a.push(this.alreadyChosenGoods[j]);
            }
          }
        }

        for (var i in a) {
          a[i].btnText = "备注";
          a[i].showRemarks = false;
        }
        var settlementParam = {
          settlementGoods: a
        };
        var priceTotal = this.getOrderTotal(this.alreadyChosenGoods).priceTotal;
        var quantityTotal = this.getOrderTotal(this.alreadyChosenGoods)
          .quantityTotal;
        this.$dialog.confirm({
          title: this.storeInfo.storeName,
          mes: `共${
            this.alreadyChosenGoods.length
          }件商品,总数量${quantityTotal},总价:￥${priceTotal}`,
          opts: () => {
            localStorage.setItem(
              "settlementParam",
              JSON.stringify(settlementParam)
            );
            this.$router.push({
              name: "OrderSettlement",
              params: {
                sellerId: this.sellerInfo.id,
                sellerName: this.storeInfo.storeName,
                distributionType: this.storeInfo.distributionToday
              }
            });
          }
        });
      }
    },
    /**
     * 二级分类获取商品
     */
    secondCategoryListClick(d, gbgoodsId) {
      this.pageNum = 1;
      this.gbgoodsId = gbgoodsId;
      this.getProductList();

      for (var i in this.secondCategoryList) {
        if (this.secondCategoryList[i].isActive) {
          this.secondCategoryList[i].isActive = false;
        }
      }
      d.isActive = true;
    },
    /**
     * 显示购物车
     */
    async getShopCar() {
      if (this.alreadyChosenGoods.length > 0) {
        this.pageNum = 1;
        this.showShopCar = true;
        if (
          this.alreadyChosenGoods.length > this.carSettlementGoods.length &&
          this.isCheckAll
        ) {
          var arr = [];
          for (let a = 0; a < this.alreadyChosenGoods.length; a++) {
            arr.push(this.alreadyChosenGoods[a].id);
          }
          this.carSettlementGoods = arr;
        }
      } else {
        this.$dialog.alert({
          mes: "暂未选择任何商品"
        });
      }
    },
    /**
     * 加入购物车
     */
    addShopCar() {
      this.$router.push({
        name: "UserShoppingCart"
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
      
      // 输入过限
      this.checkQuantityMax(d);
    },
    /**
     * 输入过限
     */
    checkQuantityMax(data) {
      if (data.quantity <= 999999) {
        this.createShippingcar(data);
      } else {
        data.quantity = 999999;
        this.createShippingcar(data);
        this.$dialog.notify({
          mes: "输入数量超出最大限制（999999）",
          timeout: 1200
        });
      }

      // 解决输入商品数量点击结算按钮数量不能及时更新问题
      for (var sku of this.alreadyChosenGoods) {
        if (sku.skuId == data.id) {
          sku.quantity = data.quantity;
        }
      }
    },
    /**
     * 加商品
     */
    add(d, isBtn) {
      if (d.skuMethodType == 1) {
        // 计重可以下小于1的
        d.quantity = (d.quantity - 0 + 1).toFixed(2) - 0;
        d.showjianBtn = true;
      } else {
        d.quantity = (d.quantity - 0 + 1).toFixed(2) - 0;
      }

      /**
       * 输入过限
       */
      if (d.quantity <= 999999) {
        if (isBtn) {
          let ele = `proSku_${d.id}`;
          // 获取当前点击元素位置
          let currentEle = this.$refs[ele][0].getBoundingClientRect();
          // 获取购物车位置
          let carEle = this.$refs.gouwuche.getBoundingClientRect();
          let startPoint = {
            X: currentEle.x + currentEle.width / 2 - currentEle.width / 2,
            Y: currentEle.y + currentEle.height / 2 - currentEle.height / 2
          };
          let targetPoint = {
            X: carEle.x + carEle.width / 2 - currentEle.width / 2,
            Y: carEle.y + carEle.height / 2 - currentEle.height / 2
          };
          if (startPoint.X) {
            let btn = new Btn(
              "new" + d.id,
              startPoint,
              targetPoint,
              7,
              d.skuPicUrl,
              "left",
              () => {
                this.createShippingcar(d);
              }
            );
            btn.create();
          } else {
            this.createShippingcar(d);
          }
        } else {
          this.createShippingcar(d);
        }
      } else {
        d.quantity = 999999;
        this.$dialog.notify({
          mes: "输入数量超出最大限制（999999）",
          timeout: 1200
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
     * 改变供应商
     */
    changeSeller() {
      this.alreadyChosenGoods = [];
      this.pageNum = 1;
      this.productList = [];
      if (this.$refs.productList) {
        this.$refs.productList.$emit("ydui.infinitescroll.reInit");
      }
      this.getCategoryList();
      this.getCustomerById();
      // 获取购物车数据
      this.getShippingcarList();
      // 获取起配金额
      this.setStartAmount(this.sellerId);

      for (var i of this.categoryList) {
        if (i.isActive) {
          if (i.childList) {
            this.secondCategoryList = i.childList;
            this.gbgoodsId = this.secondCategoryList[0].gbgoodsId;
            this.getProductList();
          } else {
            this.secondCategoryList = [];
            this.gbgoodsId = i.gbgoodsId;
            this.getProductList();
          }
        }
      }
    },
    /**
     * 全选
     */
    change: function(value, isCheckAll) {
      this.isCheckAll = isCheckAll;
    },
    /**
     * 全选添加
     */
    checkAll: function() {
      this.isCheckAll = !this.isCheckAll;
      this.$refs.checklistDemo.$emit(
        "ydui.checklist.checkall",
        this.isCheckAll
      );
    },
    /**
     * 收藏商品
     */
    createProductcollection(d) {
      var data = d;
      if (d.isCollection == 0) {
        var param = {
          customerId: this.userInfo.typeCode - 0,
          sellerId: this.sellerId,
          sellerName: this.sellerInfo.name,
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
          } else {
            this.$dialog.alert({
              mes: d.data.msg
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
     * 删除购物车
     */
    del() {
      this.postRequest("shippingcar/queryGrouplist", {
        buyerId: this.userInfo.typeCode,
        sellerId: this.sellerId
      }).then(d => {
        if (d.data && d.data.state == 0) {
          for (var i in d.data.aaData) {
            if (this.sellerId == i) {
              //如果卖家id等于购物车中的卖家id就删除
              if (this.carSettlementGoods.length > 0) {
                for (var k in this.carSettlementGoods) {
                  this.deleteShopCarById(this.carSettlementGoods[k]);
                }
              } else {
                this.$dialog.alert({
                  mes: "请选择需要移除的商品"
                });
              }
            }
          }
        }
      });
    },
    /**
     * 删除购物车byId
     */
    deleteShopCarById(id) {
      this.postRequest("shippingcar/delete", {
        id: id
      }).then(d => {
        if (d.data && d.data.state == 0) {
          this.getShippingcarList();
          this.carSettlementGoods = [];
          this.isCheckAll = false;
        }
      });
    },
    /**
     * 查看店铺详情
     */
    toShopEvaluate() {
      this.$router.push({
        name: "ShopEvaluateList",
        query: {
          storeId: this.storeInfo.id
        }
      });
    },
    /**
     * 返回主页
     */
    backHome() {
      this.$router.back();
    },
    /**
     * 搜索
     */
    tosearchpage() {
      this.$router.push({
        name: "ShopSearch",
        query: {
          sellerId: this.sellerId
        }
      });
    }
  }
};
</script>
<style lang="scss">
.quantity-input {
  background: #eeeeee;
  width: 0.8rem;
  height: 0.44rem;
  margin: 0 2px;

  input {
    text-align: center;
  }
}

#ShopList {
  .yd-badge {
    line-height: 1;
  }

  .scrolltab-content::-webkit-scrollbar {
    display: none;
  }

  .yd-search-input > .cancel-text {
    display: none !important;
  }

  select {
    font-family: "Avenir", Helvetica, Arial, sans-serif;

    option {
      background: #8cd362;
      border: none;
    }
  }

  .yd-spinner {
    border: none;

    a:nth-child(1) {
      background: #fff;
      border: 1px solid #6fb138;
    }

    a:nth-child(1):after {
      color: #6fb138;
    }
  }

  .yd-spinner > a {
    background: #6fb138;
    border-radius: 100px;
    width: 30%;
  }

  .yd-spinner > a:after {
    color: #fff;
    top: 53%;
  }

  .yd-spinner > input {
    width: 40%;
  }

  /**重写scrolltab*/
  .yd-scrolltab-content {
    padding: 0 0 0 0;
  }

  .yd-popup-content {
    .yd-scrolltab-content {
      padding-bottom: 1rem;
    }
  }

  .yd-scrolltab {
    top: 0rem;
    bottom: 0;
  }

  .yd-tabbar {
    padding: 0 !important;
  }

  .quxbtn {
    white-space: nowrap;
    padding-left: 10px;
    height: 30px;
    line-height: 32px;
    color: #0bb20c;
    font-size: 14px;
    padding-right: 10px;
    margin-left: -10px;
    padding: 10px;
  }

  /***/
  height: 100%;

  .header {
    padding: 0.25rem 0.25rem 0.2rem;

    .search {
      margin-bottom: 0.15rem;

      .select-pfs {
        color: #fff;
        font-size: 0.3rem;

        img {
          margin-left: 0.1rem;
        }
      }

      .close-icon {
        width: 0.3rem;
        height: 0.3rem;
        margin-left: 0.1rem;
      }
    }

    .header-content {
      color: #fff;
      position: relative;

      .headimg {
        background: url(../../assets/imgs/img_dianpu.png);
        background-size: 100% 100%;
        position: absolute;
        height: 1.68rem;
        width: 1.68rem;
        border-radius: 5px;
        bottom: -0.4rem;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .info {
        padding-left: 1.93rem;

        p.name {
          font-size: 0.3rem;

          img {
            margin-left: 0.1rem;
          }
        }

        p.time {
          padding: 0.12rem 0;
        }
      }

      .scbtn {
        background: #fe971d;
        width: 1rem;
        height: 0.44rem;
        line-height: 0.44rem;
        text-align: center;
        border-radius: 0.22rem 0 0 0.22rem;
        position: absolute;
        right: -0.23rem;
      }
    }
  }

  /**信用评分*/
  .credit-score {
    background: #fff;
    padding: 0.45rem 0.25rem 0.2rem;
    color: #989e92;
    font-size: 0.24rem;

    .left {
      img {
        margin-right: 0.1rem;
        width: 0.26rem;
        height: 0.26rem;
      }

      .score {
        color: #fe971d;
      }
    }

    .right {
      img {
        margin-left: 0.1rem;
        width: 0.14rem;
        height: 0.08rem;
      }
    }
  }

  /**分类*/
  .searchbox {
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

  .classify {
    #storName {
      height: 1rem;
      padding: 0 0.25rem;
      display: none;

      strong {
        font-size: 0.28rem;
      }
    }

    height: 100%;

    .left::-webkit-scrollbar {
      display: none;
    }

    .left {
      height: 100%;
      overflow-y: auto;
      width: 1.6rem;
      background: #f8f8f8;

      .item {
        text-align: center;
        padding: 0 0.25rem;
        color: #797d77;

        .iteminner {
          padding: 0.4rem 0;
          border-bottom: 1px solid #ddd;
        }
      }

      .item.active {
        background: #fff;
        font-weight: 700;
        color: #000 !important;

        .iteminner {
          border-bottom: none;
        }
      }
    }

    .right::-webkit-scrollbar {
      display: none;
    }

    .right {
      height: 100%;
      overflow-y: auto;
      background: #fff;
      padding-left: 0.25rem;

      .top {
        position: fixed;
        width: 100%;
        z-index: 100;
        background: #fff;
        padding: 0.15rem 0;
        border-bottom: 1px solid #ddd;

        strong {
          font-size: 0.2rem;
          padding-right: 0.25rem;
        }

        span {
          font-size: 12px;
          color: #797d77;
        }
      }
    }
  }

  /**底部*/
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
      font-size: 0.3rem;
      color: #989e92;
      padding-left: 1.62rem;
    }

    .price-tips {
      font-size: 0.3rem;
      color: #ff3d15;
      padding-left: 1.62rem;
    }

    .tabbar-btn {
      height: 100%; // line-height: 0.98rem;
      width: 2rem;
      text-align: center;
      background: #989e92;
      color: #fff;
      font-size: 0.3rem;
      position: absolute;
      right: 0;

      p {
        font-size: 12px;
      }
    }

    .tabbarbtn-active {
      background: #fe971d;
    }
  }

  .popred {
    font-size: 14px;
    color: red;
    font-weight: 600;
    margin-right: 0.3rem;
    padding: 10px 0;
  }

  .currentCatpop {
    .yd-tabbar:after {
      height: 0;
    }
  }
}
</style>
