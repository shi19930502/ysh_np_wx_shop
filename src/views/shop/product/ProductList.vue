<template>
  <div id="ProductList">
    <yd-layout>
      <!-- 搜索框 -->
      <div class="flex flex-x-between" style="background-color:#efeff4;">
        <yd-search v-model="searchValue" placeholder="请输入商品关键字" class="flex-item-8"></yd-search>
        <div class="quxbtn" @click="$router.push({name:'Home'})">返回</div>
      </div>
      <!--商品分类列表 -->
      <div class="category-list">
        <div class="menu">
          <div class="menu-tab" style="overflow-x: auto;min-height: calc(0.81rem + 5px);">
            <ul class="flex" ref="menulist">
              <template v-for="(d, index) in productPageCategoryList">
                <li
                  :class="d.isActive?'active':''"
                  :style="'min-width: ' + (d.name.length*0.3 +0.5) + 'rem'"
                  @click="lv1CategoryChange(d)"
                >
                  <strong>{{d.name}}</strong>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
      <yd-scrolltab style="top: calc(1.81rem + 5px);">
        <div class="flex classify">
          <!-- 二级商品分类 -->
          <div class="left" v-if="productPageSecondCategoryList.length>0">
            <template v-for="d,index in productPageSecondCategoryList">
              <div v-if="d.isActive" class="item active" @click="lv2CategoryChange(d,d.gbgoodsId)">
                <div class="iteminner">{{d.name}}</div>
              </div>
              <div v-else class="item" @click="lv2CategoryChange(d,d.gbgoodsId)">
                <div class="iteminner">{{d.name}}</div>
              </div>
            </template>
          </div>
          <!-- 商品列表 -->
          <div class="right flex-item-6" id="rightScrolltab">
            <!-- <ul class="product-list">
              <li v-for="d in 3">
                <div class="flex flex-x-between flex-y-center store">
                  <div class="store-name">石继贤生鲜店</div>
                  <div class="enterbtn">进店 ></div>
                </div>
                <div class="flex flex-y-center">
                  <div class="imgwarp">
                    <img class="goodpic" src="../../../assets/imgs/img_moren@2x.png">
                  </div>
                  <div class="info flex-item-1">
                    <h1>商品名字</h1>
                    <p>规格名：d.name</p>
                    <span class="active-status">促销</span>
                    <span style="text-decoration: line-through;color: #797D77;">'￥'+d.price</span>
                    <h3>'￥'+d.price</h3>
                  </div>
                </div>
              </li>
            </ul>-->
            <yd-infinitescroll
              :callback="getProductSkuList"
              ref="productList"
              v-if="productList.length>0"
            >
              <ul class="product-list" slot="list" v-if="productList.length>0">
                <li v-for="d in productList">
                  <div class="flex flex-x-between flex-y-center store">
                    <div class="store-name">{{d.supplierName}}</div>
                    <div class="enterbtn" @click="toSellerShop(d.supplierId)">进店 ></div>
                  </div>
                  <div class="flex flex-y-center flex-x-between">
                    <div class="flex flex-y-center" style="position: relative;width: 100%;">
                      <div class="imgwarp" :ref="'proSku_'+d.skuId">
                        <img
                          v-if="d.isCollection==0"
                          src="../../../assets/imgs/sc-icon.png"
                          class="scpic"
                          @click="createProductcollection(d)"
                        >
                        <img
                          v-if="d.isCollection==1"
                          src="../../../assets/imgs/sc-icon_a.png"
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
                          src="../../../assets/imgs/img_moren@2x.png"
                          @click="showProDetailfuc(d)"
                        >
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
                        <p>规格名：{{d.skuName}}</p>
                        <!--描述-->
                        <p v-if="d.remark">
                          <template v-if="d.remark.length>6">{{d.remark.substring(0,6)+'...'}}</template>
                          <template v-else>{{d.remark}}</template>
                        </p>
                        <p v-else>暂无描述</p>
                        <!--促销价格-->
                        <template v-if="d.promotionPrice < d.price">
                          <span class="active-status">促销</span>
                          <span
                            style="text-decoration: line-through;color: #797D77;"
                          >{{'￥'+d.price}}</span>
                        </template>
                        <!-- 价格 -->
                        <h3
                          v-if="d.promotionPrice>0 && d.promotionBasePrice>0"
                        >{{'￥'+d.promotionPrice}}</h3>
                        <h3 v-else-if="d.price == 0">￥时价</h3>
                        <h3 v-else>{{'￥'+d.price}}</h3>
                      </div>
                      <div class="caigou_icon flex flex-y-center" v-if="d.skuMethodType == 2">
                        <template v-if="d.quantity>0 || d.quantity=== ''">
                          <div @click="jian(d)">
                            <img src="../../../assets/imgs/caigou_icon_jian.png">
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
                        <div @click="add(d,true)" ref="addicon">
                          <img src="../../../assets/imgs/caigou_icon_add.png">
                        </div>
                      </div>
                      <!--计重的时候可以输入小于1的数字-->
                      <div class="caigou_icon flex flex-y-center" v-if="d.skuMethodType == 1">
                        <template v-if="d.showjianBtn">
                          <div @click="jian(d)">
                            <img src="../../../assets/imgs/caigou_icon_jian.png">
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
                        <div @click="add(d,true)" ref="addicon">
                          <img src="../../../assets/imgs/caigou_icon_add.png">
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <span slot="doneTip">没有更多商品啦</span>
            </yd-infinitescroll>
            <div v-else class="flex flex-x-center flex-y-center" style="height: 100%;">
              <div>
                <img src="../../../assets/imgs/my_default_img.png">
                <p style="color: #999;" class="tac">暂无商品</p>
              </div>
            </div>
          </div>
        </div>
      </yd-scrolltab>
      <!-- 显示商品详情-->
      <yd-popup v-model="showProDetail" position="bottom" height="70%" class="ProSkuDetailPop">
        <div class="prodet-info flex flex-y-end">
          <div class="prodet-img">
            <img v-if="proDetailParams.skuPicUrl" :src="imgURL+proDetailParams.skuPicUrl" alt>
            <img v-else src="../../../assets/imgs/img_moren@2x.png">
          </div>
          <div class="prodetpn">
            <p
              class="prodet-price"
              v-if="proDetailParams.promotionPrice>0 && proDetailParams.promotionBasePrice>0"
            >{{'￥'+proDetailParams.promotionPrice}}</p>
            <p class="prodet-price" v-else-if="proDetailParams.price == 0">￥时价</p>
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
            <img src="../../../assets/imgs/icon_close.png" alt>
          </div>
          <div class="line"></div>
          <p class="remark">{{proDetailParams.remark || '暂无描述'}}</p>
        </div>
      </yd-popup>
      <div class="gouwuche" @click="goShopCar" ref="gouwuche">
        <el-badge :value="shopCar.commodityNum" class="item" :max="99">
          <img src="../../../assets/imgs/icon_gouwuche.png" alt>
        </el-badge>
        <!-- <div class="cartcount">
          <yd-badge bgcolor="#6FB138" color="#FFF">1000</yd-badge>
        </div>-->
      </div>
    </yd-layout>
  </div>
</template>

<script>
import mixin from "../../../utils/mixin.js";
import mixin_category from "../../../utils/mixin_category.js";
import mixin_shop from "../../../utils/mixin_shop.js";
import mixin_store from "../../../utils/mixin_store.js";
import configs from "../../../configs";
import { Badge } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Btn from "./Btn.js";
export default {
  components: {
    [Badge.name]: Badge
  },
  data() {
    return {
      proDetailParams: {},
      showProDetail: false,
      searchValue: "",
      pageNum: 1,
      pageSize: 10,
      productList: [],
      productPageCategoryList: [],
      productPageSecondCategoryList: [],
      isUserEnter: true,
      showProDetail: false,
      cartCount: 0
    };
  },
  mixins: [mixin, mixin_shop, mixin_category, mixin_store],
  watch: {
    searchValue: "searchProduct"
  },
  computed: {
    //       productPageCategoryList: async function () {
    // 				let allCategoryList = await this.queryCategoryList()
    // 				console.log(allCategoryList)
    // 				return allCategoryList
    //       }
  },
  created() {
    this.pageInit();
  },
  mounted() {},
  methods: {
    /**
     * 搜索商品
     */
    searchProduct() {
      this.pageNum = 1;
      if (this.$refs.productList) {
        this.$refs.productList.$emit("ydui.infinitescroll.reInit");
      }
      // 搜索的时候调到全部分类
      if (this.searchValue) {
        this.gbgoodsId = "";
        this.productList = [];
        this.productPageSecondCategoryList = [];

        for (let i = 0; i < this.productPageCategoryList.length; i++) {
          if (i == 0) {
            this.productPageCategoryList[i].isActive = true;
          } else {
            this.productPageCategoryList[i].isActive = false;
          }
        }
      }

      this.getProductSkuList();
    },
    /**
     * 查看商品详情
     */
    showProDetailfuc(d) {
      this.showProDetail = true;
      this.proDetailParams = d;
    },
    /**
     * 初始化
     */
    async pageInit() {
      //         this.queryCartCount().then((d) => {
      //           this.cartCount = d
      //         })
      let allCategoryList = await this.queryCategoryList();
      this.productPageCategoryList = this.addActiveStatus(allCategoryList);
      this.setSecondCategoryList(this.productPageCategoryList);
      this.getShippingcarList();
    },
    /**
     * 获取商品分类列表
     */
    queryCategoryList() {
      return new Promise((resolve, reject) => {
        this.postRequest(
          "category/childList",
          {
            parentCategoryId: "top",
            filteEnabled: 1,
            filteDeleted: 0,
            orderField: "t.f_id",
            supplierId: this.sellerId || "",
            onlyLv2: true
          },
          false,
          false,
          "商品分类加载中"
        ).then(resp => {
          if (resp && resp.data && resp.data.state == 0) {
            // 添加全部选项
            resp.data.aaData.unshift({
              name: "全部",
              gbgoodsId: ""
            });
            resolve(resp.data.aaData);
          }
        });
      });
    },
    /**
     * 获取二级分类
     */
    setSecondCategoryList(categoryList) {
      // 添加二级分类isActive
      for (let i in categoryList) {
        if (categoryList[i].childList) {
          // 如果存在二级分类
          for (let j in categoryList[i].childList) {
            categoryList[i].childList[j].isActive = false;
          }
        }
      }
      // 默认选择第一个分类
      if (categoryList.length > 1 && categoryList[0].childList) {
        this.productPageSecondCategoryList = categoryList[0].childList;
        this.gbgoodsId = categoryList[0].gbgoodsId;
        this.getProductSkuList();
      } else {
        this.productPageSecondCategoryList = [];
        if (categoryList.length > 1) {
          this.gbgoodsId = categoryList[0].gbgoodsId;
          this.getProductSkuList();
        }
      }
    },
    /**
     * 获取商品列表
     */
    getProductSkuList() {
      var param = {
        code: this.gbgoodsId,
        purchaserId: this.userInfo.typeCode,
        // supplierId: this.sellerId,
        keyWord: this.searchValue,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      if (this.gbgoodsId) {
      }
      this.productApi("productsku/getSkuOverStore", param);
    },
    /**
     * api
     */
    productApi(purl, param) {
      this.postRequest(purl, param, false, false, "商品加载中").then(resp => {
        if (resp.data && resp.data.state == 0) {
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
     * 一级分类点击
     */
    lv1CategoryChange(d) {
      this.pageNum = 1;
      this.productList = [];
      this.searchValue = "";
      if (this.$refs.productList) {
        this.$refs.productList.$emit("ydui.infinitescroll.reInit");
      }
      if (!d.isActive) {
        d.isActive = true;
      }
      for (var item of this.productPageCategoryList) {
        // 选中
        if (d.id != item.id) {
          item.isActive = false;
        }
      }
      // 获取二级分类
      if (d.childList) {
        this.productPageSecondCategoryList = d.childList;
        for (var i in this.productPageSecondCategoryList) {
          if (i != 0 && this.productPageSecondCategoryList[i].isActive) {
            this.productPageSecondCategoryList[i].isActive = false;
          }
        }
        // 查找商品
        this.gbgoodsId = d.gbgoodsId;
        this.getProductSkuList();
      } else {
        this.productPageSecondCategoryList = [];
        this.gbgoodsId = d.gbgoodsId;
        this.getProductSkuList();
      }
    },
    /**
     * 二级分类获取商品
     */
    lv2CategoryChange(d, gbgoodsId) {
      this.pageNum = 1;
      this.productList = [];
      if (this.$refs.productList) {
        this.$refs.productList.$emit("ydui.infinitescroll.reInit");
      }
      this.gbgoodsId = gbgoodsId;
      this.getProductSkuList();

      for (let i in this.productPageSecondCategoryList) {
        if (this.productPageSecondCategoryList[i].isActive) {
          this.productPageSecondCategoryList[i].isActive = false;
        }
      }
      d.isActive = true;
    },
    /**
     * 显示商品详情
     */
    showProDetailfuc(d) {
      this.showProDetail = true;
      this.proDetailParams = d;
    },
    /**
     * 收藏商品
     */
    createProductcollection(d) {

      var data = d;
      if (d.isCollection == 0) {
        var param = {
          customerId: this.userInfo.typeCode - 0,
          sellerId: d.supplierId,
          sellerName: d.supplierName,
          productId: d.productId,
          productName: d.productName,
          skuId: d.skuId,
          skuName: d.skuName
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
        console.log(d)
        this.postRequest("productcollection/deleteByCustomerIdAndSkuId", {
          customerId: this.userInfo.typeCode - 0,
          skuId: d.skuId
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
     * 跳转搜索页面购物车
     */
    goShopCar() {
      this.$router.push({
        name: "searchCar"
      });
    },
    /**
     * 加商品
     */
    //       add(sku) {
    //         let ele = `proSku_${d.skuId}`
    //         // 获取当前点击元素位置
    //         let currentEle = this.$refs[ele][0].getBoundingClientRect()
    //         // 获取购物车位置
    //         let carEle = this.$refs.gouwuche.getBoundingClientRect()
    //         let addiconEle = this.$refs.addicon[0].getBoundingClientRect()
    //         let startPoint = {
    //           X: currentEle.x + currentEle.width / 2 - addiconEle.width / 2,
    //           Y: currentEle.y + currentEle.height / 2 - addiconEle.height / 2
    //         }
    //         let targetPoint = {
    //           X: carEle.x + carEle.width / 2 - addiconEle.width / 2,
    //           Y: carEle.y + carEle.height / 2 - addiconEle.height / 2
    //         }
    //         let params = {
    //           buyerId: this.userInfo.typeCode,
    //           productId: sku.productId,
    //           productName: sku.productName,
    //           skuId: sku.skuId,
    //           skuName: sku.skuName,
    //           quantity: sku.quantity,
    //           comment: sku.remark || '',
    //           sellerId: sku.supplierId
    //         }
    //         let btn = new Btn('new' + sku.skuId, startPoint, targetPoint, 8, sku.skuPicUrl, 'right',() => {
    // 					let saveUrl = 'shippingcar/create'
    // 					this.postRequest(saveUrl, params).then(d => {
    // 						if (d.data && d.data.state == 0) {
    // 							if (d.data.aaData) {
    // 								this.$dialog.notify({
    // 									mes: '操作成功，可在购物车中查看！',
    // 									timeout: 2000,
    // 								});
    // 								this.queryCartCount().then((d) => {
    // 									this.cartCount = d
    // 								})
    // 							}
    // 						}
    // 					})
    //         })
    //         btn.create()
    //       },
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
          let ele = `proSku_${d.skuId}`;
          // 获取当前点击元素位置
          let currentEle = this.$refs[ele][0].getBoundingClientRect();
          // 获取购物车位置
          let carEle = this.$refs.gouwuche.getBoundingClientRect();
          let addiconEle = this.$refs.addicon[0].getBoundingClientRect();
          let startPoint = {
            X: currentEle.x + currentEle.width / 2 - addiconEle.width / 2,
            Y: currentEle.y + currentEle.height / 2 - addiconEle.height / 2
          };
          let targetPoint = {
            X: carEle.x + carEle.width / 2 - addiconEle.width / 2,
            Y: carEle.y + carEle.height / 2 - addiconEle.height / 2
          };

          let params = {
            buyerId: this.userInfo.typeCode,
            productId: d.productId,
            productName: d.productName,
            skuId: d.skuId,
            skuName: d.skuName,
            quantity: d.quantity,
            comment: d.remark || "",
            sellerId: d.supplierId
          };

          if (startPoint.X) {
            // 微信电脑版浏览器不支持getBoundingClientRect，不能体现抛物线效果
            let btn = new Btn(
              "new" + d.id,
              startPoint,
              targetPoint,
              7,
              d.skuPicUrl,
              "right",
              () => {
                this.createShippingcar(d);
                this.queryCartCount().then(d => {
                  this.cartCount = d;
                });
              }
            );
            btn.create();
          } else {
            this.createShippingcar(d);
            this.queryCartCount().then(d => {
              this.cartCount = d;
            });
          }
        } else {
          this.createShippingcar(d);
          this.queryCartCount().then(d => {
            this.cartCount = d;
          });
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
     * 获取购物车商品数量
     */
    queryCartCount() {
      return new Promise((resolve, reject) => {
        this.postRequest("shippingcar/queryCartCount", {
          buyerId: this.userInfo.typeCode
        }).then(d => {
          if (d.data && d.data.state == 0) {
            if (d.data.aaData) {
              resolve(d.data.aaData);
            }
          }
        });
      });
    }
  }
};
</script>

<style lang="scss">
#ProductList {
  .yd-badge {
    line-height: 1;
  }
  height: 100%;
  .gouwuche {
    position: absolute;
    right: 0.25rem;
    bottom: 0.25rem;
    width: 1.02rem;
    height: 1.02rem;
    font-size: 0;
    img {
      height: 100%;
      width: 100%;
    }
    .el-badge__content.is-fixed {
      position: absolute;
      top: 0.2rem;
      right: 0.5rem;
    }
    .el-badge__content {
      background: #6fb138;
    }
    .cartcount {
    }
  }
  .yd-scrolltab-content {
    padding: 0;
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
      .store {
        padding-bottom: 0.2rem;
        padding-right: 0.25rem;
        .store-name {
          color: #797d77;
        }
      }
    }
  }
  ul.product-list {
    padding-top: 0rem;
    li {
      padding: 0.2rem 0 0.2rem 0;
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
        bottom: 0;
        input {
          font-size: 0.3rem;
        }
        // top: 50%;
        // margin-top: -0.22rem;
        img {
          display: block;
          width: 0.48rem;
          height: 0.48rem;
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
}
</style>
