<template>
  <yd-layout>
    <div id="OrderDetails" v-show="isLoad">
      <div class="header gradient">
        <div class="flex flex-y-center flex-x-center">
          <h1 v-show="orderDetail.orderStatusId == 0">新建订单，等待商家接单</h1>
          <h1 v-show="orderDetail.orderStatusId == 1">商家已接单，商品准备中</h1>
          <h1 v-show="orderDetail.orderStatusId == 2">拣货完成，等待配送</h1>
          <h1 v-show="orderDetail.orderStatusId == 3">已发货，配送员已接单</h1>
          <h1 v-show="orderDetail.orderStatusId == 4">已收货</h1>
          <h1 v-show="orderDetail.orderStatusId == 5 || orderDetail.orderStatusId == 8">订单已完成</h1>
          <h1 v-show="orderDetail.orderStatusId == 6">订单已拒绝</h1>
          <h1 v-show="orderDetail.orderStatusId == 7">订单已取消</h1>
          <h1 v-show="orderDetail.orderStatusId == 9">订单已删除</h1>

          <!-- <h1>{{orderDetail.orderStatusName}}</h1> -->
          <!-- <img src="../../assets/imgs/icon_right.png"> -->
        </div>
        <template v-if="orderDetail.distributionType != 0">
          <div
            class="p"
            v-if="orderDetail.orderStatusId == 4 || orderDetail.orderStatusId == 8"
          >感谢你的信任，欢迎再次光临</div>
          <div
            class="p"
            v-else-if="orderDetail.orderStatusId != 0 && orderDetail.orderStatusId != 7 && orderDetail.orderStatusId != 6"
          >
            预计送达时间
            <span
              v-if="orderDetail.distributionTimeEnd"
            >{{orderDetail.distributionTimeEnd.slice(0,orderDetail.distributionTimeEnd.length-3)}}</span>
          </div>
        </template>
        <template v-else>
          <div class="p">
            预计送达时间
            <span>自提</span>
          </div>
        </template>
        <div class="p" v-show="orderDetail.orderStatusId == 6">拒绝原因 {{orderDetail.cancelReason}}</div>
        <span
          @click="orderCancel(orderDetail.id,'qx')"
          class="btn"
          v-show="orderDetail.orderStatusId == 0"
          style="margin-top: 0.2rem"
        >取消订单</span>
        <span
          @click="orderCancel(orderDetail.id,'qrsh')"
          class="btn"
          v-show="orderDetail.orderStatusId == 3 && orderDetail.distributionType ==0"
        >确认收货</span>
        <span
          class="btn"
          v-show="orderDetail.orderStatusId == 4 || orderDetail.orderStatusId == 5 || orderDetail.orderStatusId == 8"
          @click="aginOrder"
        >再来一单</span>
        <span
          class="btn"
          v-show="orderDetail.orderStatusId == 4 || orderDetail.orderStatusId == 5"
          @click="toEvaluate(orderDetail.id,orderDetail.sellerId,orderDetail.orderUmber)"
        >我要评价</span>
      </div>
      <div class="content">
        <!--      <div class="card" v-show="orderDetail.orderStatusId == 3 || orderDetail.orderStatusId == 4">
        <div class="flex flex-x-between">
          <div class="flex flex-y-center">
            <div class="img">
              <img src="../../assets/imgs/head.jpg">
            </div>
            <div>
              <h3 style="font-size: 0.25rem;margin-bottom:0.1rem;">配送员姓名</h3>
              <span style="background:#6FB138;color:#fff;padding:1px 5px;border-radius:3px;">配送员</span>
            </div>
          </div>
          <div class="flex flex-y-center">
            <img src="../../assets/imgs/mine_icon_phone.png">
            <span style="color:#4D7BFE;margin-left: 0.1rem;">联系</span>
          </div>
        </div>
        </div>-->
        <div class="card">
          <div class="head flex flex-x-between flex-y-center" @click="toShopEvaluate">
            <h1>{{orderDetail.sellerName}}</h1>
            <yd-navbar-next-icon></yd-navbar-next-icon>
          </div>
          <ul class="product-list">
            <li v-for="d in orderDetail.orderitemList">
              <div class="flex flex-x-between flex-y-center">
                <div class="flex flex-item-5">
                  <div class="img">
                    <img v-if="d.skuPicUrl" :src="imgURL+d.skuPicUrl" alt>
                    <img v-else-if="d.productPicUrl" :src="imgURL+d.productPicUrl" alt>
                    <img v-else src="../../assets/imgs/img_moren.png">
                  </div>
                  <div>
                    <h3>{{d.productName+'['+d.skuName+']'}}</h3>
                    <template v-if="d.measureTypePro==1&&d.measureTypeSKU==2&&d.chargingModel ==1">
                      <div v-if="orderDetail.orderStatusId == '0'||orderDetail.orderStatusId == '1'">
                        <span>{{'￥'+priceFormat(d.price)+'/'+d.skuMeasureName}}</span>
                      </div>
                      <div v-else>
                        <!-- <span style="color: #989E92;text-decoration: line-through;">{{'￥'+priceFormat(d.price)+'/'+d.skuMeasureName}}</span> -->
                        <span style="color: #989E92">{{'￥'+priceFormat(d.oriPrice)+'/'+d.baseMeasureName}}</span>
                      </div>
                    </template>
                    <template v-else>
                      <span
                        style="color: #989E92"
                        v-if="d.promotionPrice>0 && d.promotionBasePrice>0"
                      >{{'￥'+priceFormat(d.promotionPrice)+'/'+d.skuMeasureName}}</span>
                      <span
                        style="color: #989E92"
                        v-else-if="d.price==0"
                      >{{'￥时价'+'/'+d.skuMeasureName}}</span>
                      <span style="color: #989E92" v-else>{{'￥'+priceFormat(d.price)+'/'+d.skuMeasureName}}</span>
                    </template>
                  </div>
                </div>
                <!-- <div class="tar" v-if="orderDetail.sortingOrderTotal !=null && orderDetail.inspectedOrderTotal !=null">
									<span class="line-through"> {{'x'+d.quantity}}</span>
									<p class="line-through">{{'￥'+priceFormat(d.itemTotal)}}</p>
                </div>-->
                <div
                  class="tar"
                  v-show="(orderDetail.sortingOrderTotal ==null || orderDetail.sortingOrderTotal ==0) && (orderDetail.inspectedOrderTotal ==null||orderDetail.inspectedOrderTotal ==0)"
                >
                  <strong>{{'x'+d.quantity}}</strong>
                  <p>
                    <strong>{{'￥'+ priceFormat(d.itemTotal)}}</strong>
                  </p>
                </div>
                <!-- 分拣 -->
                <div
                  class="tar"
                  style="margin-left: 0.2rem;"
                  v-show="orderDetail.sortingOrderTotal>0 && orderDetail.inspectedOrderTotal==0"
                >
                  <strong>{{d.sortingWeight!=null?'x'+d.sortingWeight:'x'+0}}</strong>
                  <p>
                    <strong>{{'￥'+priceFormat(d.sortingTotal)}}</strong>
                  </p>
                </div>
                <!-- 验收 -->
                <div
                  class="tar"
                  style="margin-left: 0.2rem;"
                  v-show="orderDetail.inspectedOrderTotal>0"
                >
                  <strong>{{'x'+d.inspectedWeight}}</strong>
                  <p>
                    <strong>{{'￥'+priceFormat(d.inspectedTotal)}}</strong>
                  </p>
                </div>
              </div>
              <div class="bzinput" v-show="d.comment">
                <yd-input readonly v-model="d.comment" :show-clear-icon="false"></yd-input>
              </div>
            </li>
          </ul>
          <div
            class="tongjisl"
            v-if="orderDetail.orderitemList"
          >共{{orderDetail.orderitemList.length}}件商品</div>
          <div class="smallplan flex flex-x-between flex-y-center">
            <div class="flex flex-y-center">
              <img
                src="../../assets/imgs/mine_icon_phone.png"
                style="width: 0.34rem;height: 0.34rem;"
              >
              <span style="color:#4D7BFE;margin-left: 0.1rem;">
                <a :href="'tel:'+orderDetail.sellerTel">联系商家</a>
              </span>
            </div>
            <div>
              <strong style="font-size: 0.24rem;">小计</strong>
              <!--实际验收小计-->
              <strong
                style="font-size: 0.36rem;"
                v-show="orderDetail.inspectedOrderTotal>0"
              >{{'￥'+priceFormat(orderDetail.inspectedOrderTotal)}}</strong>
              <!--实际分拣小计-->
              <strong
                style="font-size: 0.36rem;"
                v-show="orderDetail.sortingOrderTotal>0 && orderDetail.inspectedOrderTotal==0"
              >{{'￥'+priceFormat(orderDetail.sortingOrderTotal)}}</strong>
              <strong
                style="font-size: 0.36rem;"
                v-show="(orderDetail.sortingOrderTotal == null || orderDetail.sortingOrderTotal == 0) && (orderDetail.inspectedOrderTotal ==null||orderDetail.inspectedOrderTotal ==0)"
              >{{'￥'+priceFormat(orderDetail.orderTotal)}}</strong>
              <!-- <div class="line-through tar" v-else>{{'￥'+priceFormat(orderDetail.orderTotal)}}</div> -->
            </div>
            <!--<div>
            <span>验收合计</span>
            <strong>{{'￥'+priceFormat(orderDetail.inspectedOrderTotal)}}</strong>
            </div>-->
          </div>
        </div>
        <div class="card" v-if="orderDetail.orderStatusId == 8">
          <div
            class="flex flex-x-between"
            @click="toEvaluate(orderDetail.id,orderDetail.sellerId,orderDetail.orderUmber,'find')"
          >
            <h1>我的评价</h1>
            <yd-navbar-next-icon></yd-navbar-next-icon>
          </div>
        </div>
        <!-- 配送信息 -->
        <div class="card">
          <h1>配送信息</h1>
          <template v-if="orderDetail.distributionType == '1'">
            <div class="infoitem flex flex-x-between flex-y-center">
              <div>送达时间</div>
              <div>{{orderDetail.sdsj}}</div>
            </div>
            <div class="infoitem flex flex-x-between flex-y-center">
              <div>收货地址</div>
              <div class="tar" style="width: 50%;">{{orderDetail.shippingAdd}}</div>
              <!--收货人 联系方式-->
            </div>
          </template>
          <div class="infoitem flex flex-x-between flex-y-center">
            <div>配送方式</div>
            <div>{{orderDetail.distributionTypeName}}</div>
          </div>
        </div>
        <!-- 订单信息 -->
        <div class="card">
          <h1>订单信息</h1>
          <div class="infoitem flex flex-x-between flex-y-center">
            <div>订单号码</div>
            <div>{{orderDetail.orderUmber}}</div>
          </div>
          <div class="infoitem flex flex-x-between flex-y-center">
            <div>下单时间</div>
            <div class="tar" style="width: 50%;">{{orderDetail.createdDate}}</div>
          </div>
          <div class="infoitem flex flex-x-between flex-y-center">
            <div>支付方式</div>
            <div>{{orderDetail.payWayStatusName}}</div>
          </div>
          <div class="infoitem flex flex-x-between flex-y-center">
            <div>订单备注</div>
            <div class="tar" style="width: 70%;word-break:break-all;">{{orderDetail.comment}}</div>
          </div>
        </div>
      </div>
    </div>
  </yd-layout>
</template>
<script>
import infoCardList from "../component/infoCardList.vue";
import btn from "../component/btn.vue";
import mixin from "../../utils/mixin.js";
import mixin_store from "../../utils/mixin_store.js";

export default {
  components: {
    infoCardList,
    btn
  },
  mixins: [mixin, mixin_store],
  data() {
    return {
      isLoad: false,
      orderId: "",
      orderUmber: "",
      // 总价
      totalPrice: 0,
      // 订单详情
      orderDetail: {}
    };
  },
  created() {
    this.$store.dispatch("changeNavBarTitle", "订单详情");
    this.$dialog.loading.open("数据加载中");
    this.orderId = this.$route.query.orderId;
    this.orderUmber = this.$route.query.orderUmber;
    // 推送订单查看订单详情获取openId
    if (
      window.location.href.indexOf("?") >= 0 &&
      window.location.href.split("?")[1].split("&")[2]
    ) {
      var openId = window.location.href
        .split("?")[1]
        .split("&")[2]
        .split("=")[1];
      this.postRequest(
        "",
        {
          openId: openId,
          systemId: 8,
          flag: 1,
          authCode: ""
        },
        true
      ).then(resp => {
        if (resp.data && resp.data.state == 0) {
          let userInfo = resp.data.sessionUser;
          userInfo.token = resp.data.token;
          if (userInfo.typeId == "buyer") {
            this.$store.commit("login", userInfo);
            this.getOrderDetailById();
          }
        }
      });
    } else {
      this.getOrderDetailById();
    }
  },
  mounted() {},
  methods: {
    /**
     * 获取订单详情
     */
    async getOrderDetailById() {
      let distributedDate = await this.getPsEndTime(this.orderUmber);
      this.postRequest("order/listByUser", {
        orderUmber: this.orderUmber,
        checkType: "buy"
      }).then(d => {
        this.$dialog.loading.close();
        if (d.data && d.data.state == 0) {
          if (d.data.aaData.length > 0) {
            this.isLoad = true;
            var datestr, startTime, endTime;
            if (d.data.aaData[0].distributionTimeEnd) {
              datestr = d.data.aaData[0].distributionTimeEnd.split(" ")[0];
            }
            if (d.data.aaData[0].distributionTimeBegin) {
              startTime = d.data.aaData[0].distributionTimeBegin.split(" ")[1];
            }
            if (d.data.aaData[0].distributionTimeEnd) {
              endTime = d.data.aaData[0].distributionTimeEnd.split(" ")[1];
            }
            this.orderDetail = d.data.aaData[0];
            if (datestr) {
              if (distributedDate) {
                this.orderDetail.sdsj = distributedDate;
              } else {
                this.orderDetail.sdsj = `${datestr} ${startTime.slice(
                  0,
                  startTime.length - 3
                )}~${endTime.slice(0, endTime.length - 3)}`;
              }
            }

            this.getOrderItemById(this.orderDetail.id).then(orderItem => {
              this.orderDetail.orderitemList = orderItem;
            });
          } else {
            this.$dialog.alert({
              mes: "没有查找到该订单信息!",
              callback: () => {
                this.$router.push({
                  name: "Order"
                });
              }
            });
          }
        }
      });
    },
    /**
     * 获取配送完成时间
     */
    getPsEndTime(deliveryNo) {
      return new Promise((res, rej) => {
        this.postRequest("/distribute/distributionOrderitem/list", {
          deliveryNo: deliveryNo,
          distributionStatus: 2
        }).then(resp => {
          if (resp.data && resp.data.state == 0) {
            if (resp.data.aaData.length > 0) {
              res(resp.data.aaData[0].distributedDate);
            } else {
              res(null);
            }
          }
        });
      });
    },
    /**
     * 取消订单
     */
    orderCancel(id, type) {
      var orderStatusId = 7;
      if (type == "qrsh") {
        orderStatusId = 4;
      }
      this.$dialog.confirm({
        title: "提示",
        mes: "请确认订单操作",
        opts: () => {
          this.postRequest("order/update", {
            id: id,
            orderStatusId: orderStatusId
          }).then(resp => {
            if (resp.data && resp.data.state == 0) {
              this.$dialog.toast({
                mes: "操作成功",
                timeout: 1200,
                icon: "success",
                callback: function() {
                  this.getOrderDetailById();
                }.bind(this)
              });
            }
          });
        }
      });
    },
    /**
     * 再来一单
     */
    aginOrder() {
      this.clearCartBySellerId(this.orderDetail);
    },
    /**
     * 清空指定采购商在指定供应商下的购物车数据
     */
    clearCartBySellerId(orderDetail) {
      this.$dialog.loading.open("正在生成订单");
      this.postRequest("shippingcar/batchDeleteBySellerIdAndBuyerId", {
        buyerid: orderDetail.buyerid,
        sellerid: orderDetail.sellerid
      }).then(resp => {
        if (resp.data && resp.data.state == 0) {
          let mes = "";
          let createCount = 0;
          this.createCarForOgrinOrder(createCount, orderDetail, mes);
        }
      });
    },
    /**
     * 再来一单加入购物车
     */
    createCarForOgrinOrder(createCount, orderDetail, mes) {
      let param;
      if (createCount < orderDetail.orderitemList.length) {
        param = {
          buyerId: orderDetail.buyerId,
          productId: orderDetail.orderitemList[createCount].productId,
          productName: orderDetail.orderitemList[createCount].productName,
          skuId: orderDetail.orderitemList[createCount].skuId,
          skuName: orderDetail.orderitemList[createCount].skuName,
          quantity: orderDetail.orderitemList[createCount].quantity,
          comment: orderDetail.orderitemList[createCount].comment || "",
          sellerId: orderDetail.sellerId
        };
        // 将订单中的商品加入购物车
        this.postRequest("shippingcar/create", param).then(d => {
          if (d.data && d.data.state == 0) {
            // console.log(d.data.state)
          } else {
            // if(createCount<=3){
            //   mes = d.data.msg + "</br>" + mes + '..';
            // }
            mes = "部份商品已下架，请重新选择商品！";
          }
          createCount++;
          this.createCarForOgrinOrder(createCount, orderDetail, mes);
        });
      } else {
        if (!mes == "") {
          this.$dialog.alert({
            mes: mes
          });
        }
        this.$dialog.loading.close();
        this.$router.push({
          name: "UserShoppingCart"
        });
      }
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
    /**
     * 查看店铺详情
     */
    toShopEvaluate() {
      this.$router.push({
        name: "ShopDetails",
        query: {
          sellerid: this.orderDetail.sellerId
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#OrderDetails {
  .mr20 {
    margin-right: 0.2rem;
  }

  /*贯穿线*/
  .line-through {
    font-size: 0.24rem;
    text-decoration: line-through;
    color: #989e92;
  }

  .header {
    text-align: center;
    color: #fff;
    font-size: 0.27rem;
    padding: 0.3rem 0.25rem;

    h1 {
      font-size: 0.3rem;
      margin-right: 0.2rem;
    }

    .p {
      margin: 0.18rem 0;
    }

    .btn {
      display: inline-block;
      border: 1px solid #fff;
      border-radius: 3px;
      padding: 0.1rem 0.25rem;
    }
  }

  .content {
    .yd-next-icon:before {
      font-size: 0.2rem !important;
    }

    padding: 0.2rem;

    .card {
      margin-bottom: 0.2rem;
      border-radius: 5px;
      padding: 0.3rem 0.25rem;
      background: #fff;

      .head {
        border-bottom: 1px solid #ddd;
        padding-bottom: 0.25rem;
      }

      .img {
        height: 0.75rem;
        width: 0.75rem;
        border-radius: 100px;
        margin-right: 0.2rem;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      h1 {
        font-size: 0.3rem;
      }

      p {
        color: #797d77;
        line-height: 0.4rem;
        margin-bottom: 0.1rem;
      }

      .cu {
        background: #f07373;
        color: #fff;
        padding: 0.06rem;
        border-radius: 2px;
        margin-right: 0.1rem;
      }

      .zhe {
        background: #f1884f;
        color: #fff;
        padding: 0.06rem;
        border-radius: 2px;
        margin-right: 0.1rem;
      }

      .infoitem {
        padding: 0.3rem 0;
        border-bottom: 1px solid #ddd;

        div:nth-child(1) {
          font-size: 0.27rem;
        }

        div:nth-child(2) {
          color: #797d77;
        }
      }
    }

    ul.product-list {
      margin-top: 0.25rem;

      li {
        margin-bottom: 0.25rem;

        h3 {
          margin-bottom: 0.08rem;
        }

        .img {
          height: 0.75rem;
          width: 0.75rem;
          border-radius: 2px;
          margin-right: 0.2rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .tar {
          .sl {
            margin-right: 1rem;
          }
        }

        .bzinput {
          margin-top: 0.16rem;
          height: 0.6rem;
          background: #ffedbd;
          color: #989e92;
          padding-left: 0.1rem;
          border-radius: 5px;
        }
      }
    }

    .tongjisl {
      background: #efeff3;
      padding: 0.08rem;
      text-align: center;
    }

    .smallplan {
      padding: 0.2rem 0 0;

      strong {
        font-size: 0.3rem;
      }
    }
  }
}
</style>
