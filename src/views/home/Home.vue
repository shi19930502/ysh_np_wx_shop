<template>
  <div id="Home">
    <yd-scrolltab ref="productList">
      <div class="scrolltab-content" style="height: 100%;overflow-y: auto;">
        <div class="header gradient">
          <!-- <div class="search">
            <yd-icon name="search" color="#fff" size="0.5rem"></yd-icon>
          </div>-->
          <yd-flexbox direction="vertical">
            <yd-flexbox-item>
              <div id="main"></div>
            </yd-flexbox-item>
            <yd-flexbox-item @click.native="lookMesg">
              <div class="rollnotice flex flex-x-between flex-y-center">
                <div class="iconwrap">
                  <div class="rollnotice-icon flex flex-y-center">
                    <img
                      src="../../assets/imgs/img_xitgg@2x.png"
                      style="width: 0.42rem; height: 0.42rem;"
                    >
                  </div>
                </div>
                <div class="flex-item-5">
                  <yd-rollnotice autoplay="5000" height="40">
                    <template v-if="msgdataList.length>0">
                      <yd-rollnotice-item
                        v-for="d in msgdataList"
                        :key="d.f_id"
                      >{{d.f_comment.length>23?d.f_comment.substring(0,23)+'...':d.f_comment}}</yd-rollnotice-item>
                    </template>
                    <template v-else>
                      <yd-rollnotice-item>暂无系统公告</yd-rollnotice-item>
                    </template>
                  </yd-rollnotice>
                </div>
              </div>
            </yd-flexbox-item>
          </yd-flexbox>
        </div>
        <!-- 最新采购 -->
        <div class="zxcg">
          <info-card
            title="最新采购"
            moreBtnText="全部采购"
            @click="toAllPurchase"
            :showmoreBtn="newestOrder.sellerName?true:false"
          >
            <template v-if="newestOrder.sellerName">
              <div class="heade flex flex-y-center">
                <div class="img">
                  <img
                    v-if="newestOrder.storeInfo.headPicUrl"
                    :src="imgURL+newestOrder.storeInfo.headPicUrl"
                    alt
                  >
                  <img v-else src="../../assets/imgs/img_dianpu.png">
                </div>
                <div class="flex-item-6">
                  <p class="name flex flex-x-between">
                    <strong>{{newestOrder.sellerName}}</strong>
                    <span>{{newestOrder.orderStatusName}}</span>
                  </p>
                  <p style="color:#989E92">{{newestOrder.createdDate}}</p>
                </div>
              </div>
              <div class="card-body" @click="toOrderDetails(newestOrder.id,newestOrder.orderUmber)">
                <div class="flex flex-x-between flex-y-center">
                  <div class="flex">
                    <template v-for="orderitem,key in newestOrder.orderitemList">
                      <div class="product-img" v-if="key<4">
                        <img
                          v-if="orderitem.skuPicUrl"
                          :src="imgURL+orderitem.skuPicUrl"
                          alt
                        >
                        <img
                          v-else-if="orderitem.productPicUrl"
                          :src="imgURL+orderitem.productPicUrl"
                          alt
                        >
                        <img v-else src="../../assets/imgs/img_moren.png">
                      </div>
                    </template>
                  </div>
                  <div v-if="newestOrder.sl>4">
                    <img
                      src="../../assets/imgs/icon_more.png"
                      style="width: 0.5rem;height: 0.1rem;"
                    >
                  </div>
                  <div class="tar">
                    <p class="price">
                      <span
                        v-show="newestOrder.sortingOrderTotal==null || newestOrder.sortingOrderTotal==0  && newestOrder.inspectedOrderTotal==null"
                      >{{'￥'+priceFormat(newestOrder.orderTotal)}}</span>
                      <span
                        v-show="newestOrder.sortingOrderTotal>0 && newestOrder.inspectedOrderTotal==null"
                      >{{'￥'+priceFormat(newestOrder.sortingOrderTotal)}}</span>
                      <span
                        v-show="newestOrder.inspectedOrderTotal>0"
                      >{{'￥'+priceFormat(newestOrder.inspectedOrderTotal)}}</span>
                    </p>
                    <p class="sl" style="font-size: 0.24rem;">共{{newestOrder.sl}}件</p>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex flex-x-center flex-y-center" style="height: 3.5rem">
                <div>
                  <img src="../../assets/imgs/my_default_img.png">
                  <p style="color: #999;" class="tac">暂无采购数据</p>
                </div>
              </div>
            </template>
          </info-card>
        </div>
        <!-- 收藏 -->
        <userCollection></userCollection>
      </div>
    </yd-scrolltab>
  </div>
</template>
<script>
import infoCard from "../component/infoCard.vue";
import infoCardList from "../component/infoCardList.vue";
import list from "../component/list.vue";
import menuTab from "../component/menu.vue";
import userCollection from "../user/UserCollection.vue";

import echarts from "echarts";
import mixin from "../../utils/mixin.js";
import mixin_store from "../../utils/mixin_store.js";

export default {
  components: {
    infoCard,
    infoCardList,
    list,
    menuTab,
    userCollection
  },
  mixins: [mixin, mixin_store],
  data() {
    return {
      newestOrder: {},
      showSellerList: true,
      sellerList: [],
      showProductcollection: false,
      productcollection: [],
      menu: ["收藏商家", "收藏商品"],
      msgdataList: [],
      activeItem: 0,
      showmoreBtn: true
    };
  },
  created() {
    this.$store.dispatch("changeNavBarTitle", "首页");
    if (this.$route.name == "productCol") {
      this.activeItem = 1;
    } else {
      this.activeItem = 0;
    }
    this.getnewestOrder();
    this.getUserMessage();
  },
  mounted() {
    this.getOrderSum();
  },
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
     * 全部结算
     */
    toAllBill() {
      this.$router.push({
        name: "Statistics"
      });
    },
    /**
     * 全部采购
     */
    toAllPurchase() {
      this.$router.push({
        name: "Order"
      });
    },
    /**
     * 获取最近七天订单走势图
     */
    getOrderSum() {
      this.postRequest("order/getOrderSum", {
        startTime: this.GetDateStr(-7).date,
        endTime: this.GetDateStr(0).date,
        buyerId: this.userInfo.typeCode
      }).then(d => {
        if (d.data && d.data.state == 0) {
          if (d.data.aaData.length > 0) {
            // 横坐标数据
            var xAxisData = [];
            // 纵坐标数据
            var seriesData = [];
            for (var i in d.data.aaData) {
              xAxisData.push(d.data.aaData[i].orderDate.substr(5, 9));
              if (d.data.aaData[i].orderTotal) {
                if (d.data.aaData[i].orderTotal.toString().indexOf(",") > 0) {
                  d.data.aaData[i].orderTotal = d.data.aaData[
                    i
                  ].orderTotal.replace(",", "");
                }
                seriesData.push(Number(d.data.aaData[i].orderTotal));
              } else {
                seriesData.push(0);
              }
            }
            this.setChartData(xAxisData, seriesData);
          } else {
            var xAxisData = [];
            var seriesData = [];
            for (var i = -6; i < 1; i++) {
              xAxisData.push(this.GetDateStr(i).date.substr(5, 9));
              seriesData.push(0);
            }
            this.setChartData(xAxisData, seriesData);
          }
        } else {
          var xAxisData = [];
          var seriesData = [];
          for (var i = -6; i < 1; i++) {
            xAxisData.push(this.GetDateStr(i).date.substr(5, 9));
            seriesData.push(0);
          }
          this.setChartData(xAxisData, seriesData);
        }
      });
    },
    /**
     * 设置图表
     */
    setChartData(xAxisData, seriesData) {
      var myChart = echarts.init(document.getElementById("main"));
      var max = Math.max.apply(Math, seriesData);
      // 图表左边的距离
      var xLeft = 0;
      if (max <= 1) {
        xLeft = 35;
      } else if (max >= 10 && max < 100) {
        xLeft = 33;
      } else if (max >= 100 && max < 1000) {
        xLeft = 40;
      } else if (max >= 1000 && max < 10000) {
        xLeft = 45;
      } else if (max > 10000000) {
        xLeft = 65;
      } else {
        xLeft = 26;
      }
      var option = {
        grid: {
          left: xLeft,
          bottom: 35,
          right: 12,
          top: 30,
          borderWidth: 1
        },
        title: {
          text: "近七日采购金额统计（元）",
          textStyle: {
            fontSize: 14,
            color: "#fff"
          },
          left: "center",
          top: 0
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          },
          splitLine: {
            show: true,
            //  改变轴线颜色
            lineStyle: {
              // 使用深浅的间隔色
              color: ["#fff"],
              opacity: 0.2
            }
          },
          axisLabel: {
            formatter: function(value, index) {
              if (value >= 10000 && value < 10000000) {
                value = value / 10000 + "万";
              } else if (value >= 10000000) {
                value = value / 10000000 + "千万";
              }
              return value;
            }
          }
        },
        series: [
          {
            data: seriesData,
            type: "line",
            areaStyle: {
              opacity: 0.4
            },
            smooth: true,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "top",
                  formatter: "{c}",
                  textStyle: {
                    color: "#fff",
                    fontSize: 10
                  }
                }
              }
            }
          }
        ],
        color: "#fff",
        textStyle: {
          color: "#fff"
        }
      };

      myChart.setOption(option);
    },
    /**
     * 获取消息列表
     */
    getUserMessage() {
      this.postRequest("platformnoticeflow/queryMsgFileByPage", {
        customerId: this.userInfo.typeCode,
        userId: this.userInfo.userId,
        pageNum: 1,
        pageSize: 3
      }).then(d => {
        if (d.data && d.data.state == 0) {
          this.msgdataList = d.data.aaData;
        }
      });
    },
    /**
     * 查看消息
     */
    lookMesg() {
      this.$router.push({
        name: "UserMessage"
      });
    },
    /**
     * 最新采购
     */
    getnewestOrder() {
      this.$dialog.loading.open("最新采购加载中")
      this.postRequest("order/listByUser", {
        pageNum: 1,
        pageSize: 1,
        orderField: "f_created_date desc",
        checkType: "buy"
      }).then(async resp => {
        this.$dialog.loading.close()
        if (resp.data && resp.data.state == 0) {
          if (resp.data.aaData.length > 0) {
            let aaData = resp.data.aaData[0];
            let storeInfo = await this.getStoreAsync(
              aaData.sellerId
            );
            aaData.storeInfo = storeInfo;
            if (aaData.orderitemList) {
              aaData.sl = aaData.orderitemList.length;
            }

            this.newestOrder = aaData;
          }
        }
      });
    },
    /**
     * 最新结算
     */
    getNewestBillInfo() {
      this.postRequest("/settle/billInfo/list", {
        startTime: this.GetDateStr(-7).date,
        endTime: this.GetDateStr(0).date,
        pageNum: 1,
        pageSize: 10,
        orderField: "f_create_date"
      }).then(resp => {
        if (resp.data && resp.data.state == 0) {
          if (resp.data.aaData) {
            this.NewestBillInfo = resp.data.aaData[0];
          }
        }
      });
    }
  }
};
</script>
<style lang="scss">
.yd-scrollview:after {
  display: none;
}

#Home {
  .scrolltab-content::-webkit-scrollbar {
    display: none;
  }
  height: 100%;
  .yd-scrolltab-content {
    padding: 0;
    background: #efeff3;
  }
  .menu-tab {
    border-bottom: none !important;
  }
  .header {
    .search {
      position: absolute;
      right: 0.1rem;
      top: 0.1rem;
    }
    padding: 0.1rem 0.1rem 0;
    #main {
      width: 100%;
      height: 4rem;
    }
    .rollnotice {
      font-size: #2f3927;
      .iconwrap {
        background: rgba(255, 255, 255, 0.4);
      }
      .rollnotice-icon {
        padding: 0 0.2rem;
        background: rgba(255, 255, 255, 0.4);
        height: 40px;
      }
    }
    .yd-rollnotice,
    .yd-rollnotice-item {
      background: rgba(255, 255, 255, 0.4) !important;
    }
  }
  .yc-tab {
    background: #fff;
    p {
      font-size: 0.3rem;
      padding: 0.25rem;
    }
    p.active strong {
      display: inline-block;
      border-bottom: 2px solid #6fb138;
      padding-bottom: 0.05rem;
    }
  }
  .heade {
    padding: 0.2rem 0;
    .img {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.2rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .name {
      padding-bottom: 0.1rem;
      font-size: 0.27rem;
    }
  }
  .listwrap {
    background: #fff;
    padding: 0 0.25rem;
  }
  .collection {
    /*height: 200px;*/
    overflow: hidden;
  }
}
</style>
