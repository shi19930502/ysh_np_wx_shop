<template>
  <yd-layout>
    <div id="ShopDetails">
      <div class="headbg gradient"></div>
      <div class="header">
        <yd-flexbox direction="vertical">
          <div class="img">
            <img v-if="storeInfo.headPicUrl" :src="imgURL+storeInfo.headPicUrl">
            <img v-else src="../../assets/imgs/img_dianpu.png">
          </div>
          <h1>{{storeInfo.storeName}}</h1>
          <p>营业时间：{{storeInfo.openStart+':00'+'-'+storeInfo.openEnd+':00'}}</p>
          <div class="flex" style="margin:0.25rem">
            <yd-rate v-model="reputationVal" size="0.2rem" readonly active-color="#FFBB00"></yd-rate>
            <span style="padding: 0 0.2rem 0 0.1rem;">评分{{reputationLevel}}</span>
          </div>
          <div class="rate flex flex-y-center">
            <yd-badge
              style="margin-right:0.2rem"
              shape="square"
              type="hollow"
              bgcolor="#FE971D"
              v-show="storeInfo.distributionToday == 1"
            >支持当天配送</yd-badge>
            <yd-badge
              style="margin-right:0.2rem"
              shape="square"
              type="hollow"
              bgcolor="#FE971D"
              v-show="storeInfo.distributionToday == 0"
            >次日配送</yd-badge>
            <yd-badge shape="square" type="hollow" bgcolor="#FE971D">预定周期{{storeInfo.period}}天</yd-badge>
          </div>
        </yd-flexbox>
        <!-- <div class="gonggao">
        <span>[公告]</span>
        <span>欢迎选购，本店优惠多多</span>
        </div>-->
      </div>
      <div class="content">
        <div class="card">
          <h1>配送信息</h1>
          <p
            v-show="storeInfo.distributionToday == 1"
          >支持当天配送，当天{{storeInfo.distributionEnd-2}}点前下单,可支持当日{{storeInfo.distributionEnd || 12}}点前送达，{{storeInfo.distributionEnd-2 || 12}}时后下单支持次日{{storeInfo.distributionEnd || 12}}点前送达</p>
          <p
            v-show="storeInfo.distributionToday == 0"
          >当天下单支持次日{{storeInfo.distributionEnd || 12}}点前送达</p>
        </div>
        <!--  <div class="card">
        <h1>促销活动</h1>
        <p><span class="cu">促</span>下单立减10元</p>
        <p><span class="zhe">折</span>全场8.8折</p>
      </div>
      <div class="card flex flex-x-between flex-y-center">
        <h1 style="padding-bottom:0">商家评分</h1>
        <div>{{rate}}</div>
        </div>-->
        <div class="card">
          <h1>商家信息</h1>
          <div class="infoitem flex flex-x-between flex-y-center">
            <div>联系人</div>
            <div>{{storeInfo.contacts}}</div>
          </div>
          <div class="infoitem flex flex-x-between flex-y-center">
            <div>联系电话</div>
            <div>{{storeInfo.phoneNumber}}</div>
          </div>
          <!-- <div class="infoitem flex flex-x-between flex-y-center">
          <div>地址</div>
          <div>成都高新区天府大道xxxxxx xxxxxxxxxx</div>
          </div>-->
          <div class="infoitem flex flex-x-between flex-y-center">
            <div>店铺介绍</div>
            <div>{{storeInfo.storeSuggest}}</div>
          </div>
        </div>
      </div>
    </div>
  </yd-layout>
</template>
<script>
import mixin from "../../utils/mixin.js";

export default {
  mixins: [mixin],
  data() {
    return {
      rate: 4.8,
      storeInfo: {},
			reputationLevel: 'A',
			reputationVal: 5,
    };
  },
  created() {
    this.$store.dispatch("changeNavBarTitle", "店铺详情");
    this.getReputation(this.$route.query.sellerid);
    this.postRequest("store/queryBySellerId", {
      sellerId: this.$route.query.sellerid
    },false,false,"数据加载中").then(resp => {
      if (resp.data && resp.data.state == 0) {
        this.storeInfo = resp.data.aaData;
      }
    });
  },
  mounted() {},
  methods: {
    // 店铺评分
    getReputation(sellerId) {
      this.postRequest("reputation/list", {
        customerId: sellerId
      }).then(resp => {
        if (resp.data && resp.data.state == 0) {
          if (resp.data.aaData.length > 0) {
            switch (resp.data.aaData[0].reputationLevel) {
              case "A":
                this.reputationVal = 5;
                this.reputationLevel = "A";
                break;
              case "B":
                this.reputationVal = 4;
                this.reputationLevel = "B";
                break;
              case "C":
                this.reputationVal = 3;
                this.reputationLevel = "C";
                break;
              case "D":
                this.reputationVal = 2;
                this.reputationLevel = "D";
                break;
              default:
                this.reputationVal = 1;
                this.reputationLevel = "E";
                break;
            }
          } else {
            this.reputationVal = 5;
            this.reputationLevel = "A";
          }
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
#ShopDetails {
  .headbg {
    width: 100%;
    height: 1rem;
    position: absolute;
    top: 0;
    z-index: 100;
  }
  .header {
    padding: 1.8rem 0.25rem 0;
    background: #fff;
    .img {
      background: url(../../assets/imgs/img_dianpu.png);
      background-size: 100% 100%;
      width: 1.68rem;
      height: 1.68rem;
      position: absolute;
      z-index: 1001;
      top: 0.2rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
    }
    h1 {
      font-size: 0.33rem;
      padding: 0.25rem 0;
    }
    .rate {
      padding-bottom: 0.25rem;
    }
    .gonggao {
      padding: 0.25rem 0;
      color: #797d77;
      border-top: 1px solid #ddd;
      background: #fff;
      font-size: 0.27rem;
    }
  }
  .content {
    padding: 0.2rem;
    .card {
      margin-bottom: 0.2rem;
      border-radius: 5px;
      padding: 0.3rem 0.25rem;
      background: #fff;
      h1 {
        font-size: 0.3rem;
        padding-bottom: 0.25rem;
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
  }
}
</style>