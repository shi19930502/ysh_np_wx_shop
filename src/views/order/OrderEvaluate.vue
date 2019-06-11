<template>
  <yd-layout>
    <div id="OrderEvaluate">
      <section class="store flex flex-y-center flex-x-between">
        <div class="flex flex-y-center">
          <img v-if="storeInfo.headPicUrl" :src="imgURL+storeInfo.headPicUrl" alt="" class="store-img">
          <img v-else src="../../assets/imgs/img_dianpu.png" alt="" class="store-img">
          <div class="store-name">{{storeInfo.storeName}}</div>
        </div>
        <div class="pftext">
          <p>{{reputationLevel}}</p>
          <p>信用等级</p>
        </div>
      </section>
      <section class="card">
        <div class="card-title">订单信息</div>
        <div class="card-item">
          <span>订单号：{{orderInfo.orderUmber}}</span>
        </div>
        <div class="card-item">
          <span v-if="index<2" v-for="d,index in orderInfo.orderitemList">
            <template>
              {{d.skuName}}
            </template>
            <template v-if="d.inspectedWeight != null">
              {{'['+d.inspectedWeight+d.baseMeasureName+'/'+d.skuMeasureName+']' + '、'}}
            </template>
            <template v-else-if="d.sortingWeight != null">
              {{'['+d.sortingWeight+d.baseMeasureName+'/'+d.skuMeasureName+']' + '、'}}
            </template>
            <template v-else>
              {{'['+d.weight+d.baseMeasureName+'/'+d.skuMeasureName+']' + '、'}}
            </template>
          </span>
          <span v-if="orderInfo.orderitemList">等{{orderInfo.orderitemList.length}}件商品</span>
        </div>
      </section>
      <section class="card">
        <div class="card-title">订单评价</div>
        <div class="card-item flex flex-x-between flex-y-center" v-if="type == 1">
          <span>综合满意度</span>
          <yd-rate slot="left" readonly v-model="productrate" size="0.42rem" active-color="#FE971D"></yd-rate>
        </div>
        <yd-textarea v-if="type == 1" readonly maxlength="200" v-model="reviewContent" style="color: #222; opacity: 1" ></yd-textarea>
        <yd-textarea placeholder="谈谈你中肯的评价..." v-else maxlength="200" v-model="reviewContent"></yd-textarea>

      </section>
      <section class="card">
        <div class="card-title">质量与配送评价</div>
        <div class="card-item flex flex-x-between flex-y-center" v-for="d in reviewtypeList">
          <span>{{d.reviewName}}</span>
          <yd-rate slot="left" v-if="type == 1" readonly v-model="d.productrate" size="0.42rem" active-color="#FE971D"></yd-rate>
          <yd-rate slot="left" v-else v-model="d.productrate" size="0.42rem" active-color="#FE971D"></yd-rate>

        </div>
      </section>
      <!-- <section class="text">你的评价将匿名发送给商家</section> -->
    </div>
    <yd-tabbar slot="tabbar" v-if="type != 1">
      <div class="yd-tabbar">
        <div class="bottombar flex flex-x-between flex-y-center">
          <div class="text">感谢你的支持~</div>
          <div class="btn flex flex-y-center flex-x-center" @click="save">提交评价</div>
        </div>
      </div>
    </yd-tabbar>
  </yd-layout>
</template>
<script>
  import mixin from '../../utils/mixin.js'
  import mixin_store from '../../utils/mixin_store.js'

  export default {
    mixins: [mixin, mixin_store],
    data() {
      return {
        reviewContent: '',
        productrate: 0,
        reviewtypeList: [],
        storeInfo: '',
        type: 0,
        reputationLevel: 'A',
        orderInfo: {}
      }
    },
    created() {
      this.$store.dispatch('changeNavBarTitle', '订单评价')
      // 获取店铺信息
      this.getStore(this.$route.query.sellerId, (storeInfo) => {
        this.storeInfo = storeInfo
      })
      // 获取订单信息
      this.getOrderDetailById(this.$route.query.orderUmber)
      // 获取店铺评分
      this.getReputation(this.$route.query.sellerId)

      this.type = this.$route.query.type
      // 获取评价分数
      if (this.type == 1) {
        // 获取分数
        this.postRequest('orderitemreview/queryReviewAndScore', {
          orderId: this.$route.query.orderId
        }).then(d => {
          if (d && d.data.state == 0) {
            if (d.data.aaData && d.data.aaData[0]) {
              this.reviewContent = d.data.aaData[0].reviewContent
            }
            if (d.data.aaData && d.data.aaData[1]) {
              let productrate = 0
              for (var i in d.data.aaData[1]) {
                d.data.aaData[1][i].productrate = d.data.aaData[1][i].score / 20
                productrate += d.data.aaData[1][i].productrate
              }
              console.log(productrate)
              this.productrate = Math.round(productrate / d.data.aaData[1].length)
              console.log(this.productrate)

              this.reviewtypeList = d.data.aaData[1]
            }
          }
        })
      } else {
        // 获取评价类型
        this.getReviewtype()
      }
    },
    mounted() {

    },
    methods: {
      /**
       * 获取订单信息
       */
      getOrderDetailById(orderUmber) {
        this.postRequest('order/listByUser', {
          orderUmber: orderUmber,
					checkType: 'buy'
        }).then(d => {
          if (d.data && d.data.state == 0) {
            if (d.data.aaData.length > 0) {
              this.orderInfo = d.data.aaData[0]
            }
          }
        })
      },
      /**
       * 获取订单商品明细
       */
      getOrderItemById(orderId) {
        this.postRequest('orderitem/list', {
          orderId: orderId
        }).then(d => {
          if (d.data && d.data.state == 0) {
            this.OrderItem = d.data.aaData
          }
        })
      },
      /**
       * 评分类型
       */
      getReviewtype() {
        this.postRequest('reviewtype/list', {
          enabled: 1,
          deleted: 0
        }).then(d => {
          if (d && d.data.state == 0) {
            for (var i in d.data.aaData) {
              d.data.aaData[i].productrate = 0
            }
            this.reviewtypeList = d.data.aaData
          }
        })
      },
      // 店铺评分
      getReputation(sellerId) {
        this.postRequest('reputation/list', {
          customerId: sellerId
        }).then(resp => {
          if (resp.data && resp.data.state == 0) {
            if (resp.data.aaData && resp.data.aaData.length > 0) {
              this.reputationLevel = resp.data.aaData[0].reputationLevel
            } else {
              this.reputationLevel = 'A'
            }
          }
        })
      },
      /**
       * 保存
       */
      save() {
        var str = ''
        for (var i of this.reviewtypeList) {
          str += i.reviewCode + ':' + i.productrate + ','
          if(i.productrate == 0){
            this.$dialog.alert({
              mes: `你还没有输入${i.reviewName}评价!`
            })
            return false
          }
        }

        var params = {
          orderId: this.$route.query.orderId,
          reviewContent: this.reviewContent,
          reviewScoreJson: str.slice(0, str.length - 1)
        }

        if (params.reviewContent == '') {
          this.$dialog.alert({
            mes: '你还没有输入评价内容'
          })
          return false
        }
        this.postRequest('orderitemreview/create', params).then(d => {
          if (d.data && d.data.state == 0) {
            this.$dialog.toast({
              mes: '提交成功',
              timeout: 1200,
              icon: 'success',
              callback: () => {
                this.$router.push({
                  name: 'OrderEvaluateSuccess',
                })
              }
            });
          } else {
            this.$dialog.alert({
              mes: d.data.msg
            })
          }
        })

      }
    }
  };
</script>
<style lang="scss">

  .yd-tabbar {
    padding: 0 !important;
    height: 1rem;
  }

  .bottombar {
    .text {
      padding-left: 0.24rem;
      color: #797D77;
    }
    .btn {
      background: #6FB138;
      color: #fff;
      font-size: 0.36rem;
      height: 1rem;
      width: 2.4rem;
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  #OrderEvaluate {
    textarea:diabled {
      -webkit-text-fill-color: #000;
      -webkit-opacity: 1;
      color: #000 !important;
    }
    .store {
      margin-bottom: 0.24rem;
      background: #fff;
      padding: 0 0.24rem;
      height: 1.2rem;
      img.store-img {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 2px;
      }
      .store-name {
        font-size: 0.28rem;
        padding-left: 0.24rem;
        font-weight: 600;
      }
      .pftext {
        text-align: center;
        font-size: 0.24rem;
        p:nth-child(1) {
          color: #FE971D;
          font-weight: 600;
        }
        p:nth-child(2) {
          color: #989E92;
        }
      }
    }
    .card {
      padding: 0.24rem;
      margin-bottom: 0.24rem;
      background: #fff;
      .card-title {
        font-size: 0.28rem;
        font-weight: 600;
        margin-bottom: 0.12rem;
      }
      .card-item {
        span {
          font-size: 0.26rem;
        }
      }
      .yd-textarea {
        margin-top: 0.18rem;
        background: #EFEFF3;
        padding: 0.2rem;
        textarea {
          font-family: 'PingFang-SC-Medium';
          font-size: 0.24rem;
        }
      }
    }
    .text {
      font-size: 0.24rem;
      color: #797D77;
      padding: 0 0.24rem;
    }
  }
</style>
