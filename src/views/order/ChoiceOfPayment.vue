<template>
  <yd-layout>
    <div id="ChoiceOfPayment" v-if="this.$route.params.payParams">
      <!--<div class="group">
				<h1>支付方式</h1>
				<div class="btns">
					<template v-for="d,index in payType">
						<yd-badge v-if="d.selected" shape="square" bgcolor="#6FB138" color="#FFF" @click.native="selectPayWay(d)">{{d.name}}</yd-badge>
						<yd-badge v-else shape="square" color="#FFF" @click.native="selectPayWay(d)">{{d.name}}</yd-badge>
					</template>
				</div>
      </div>-->
      <div class="group">
        <h1>配送方式</h1>
        <div class="btns">
          <template v-for="d,index in logisticsType">
            <yd-badge
              v-if="d.selected"
              shape="square"
              bgcolor="#6FB138"
              color="#FFF"
              @click.native="selectWiLiuWay(d)"
            >{{d.name}}</yd-badge>
            <yd-badge
              v-else
              shape="square"
              color="#FFF"
              @click.native="selectWiLiuWay(d)"
            >{{d.name}}</yd-badge>
          </template>
        </div>
      </div>
      <div class="group" v-show="showTime">
        <h1>配送时间</h1>
        <div class="btns">
          <template v-for="d,index in distributionType">
            <yd-badge
              v-if="d.selected"
              shape="square"
              bgcolor="#6FB138"
              color="#FFF"
              @click.native="selectdistributionWay(d)"
            >{{d.name}}</yd-badge>
            <yd-badge
              v-else
              shape="square"
              color="#FFF"
              @click.native="selectdistributionWay(d)"
            >{{d.name}}</yd-badge>
          </template>
        </div>
        <div class="updatedate flex flex-x-between flex-y-center">
          <div>{{result}}</div>
          <div class="flex flex-y-center" @click="datePicker">
            <span>选择时间</span>
            <img
              src="../../assets/imgs/peistime_icon_right.png"
              style="width: 0.14rem;height: 0.24rem;"
            >
          </div>
        </div>
      </div>
      <div class="flex flex-x-center">
        <yd-button
          class="okbtn"
          size="large"
          bgcolor="#6FB138"
          color="#fff"
          @click.native="toOrderCheckoutSuccess"
        >确定</yd-button>
      </div>

      <yd-popup v-model="showDate" position="bottom" height="50%">
        <!--<dateTime :callback="getDateTime" v-model="result" :startTime="storeInfo.distributionStart" :endTime="storeInfo.distributionEnd" :period="storeInfo.period" :istody="istody" />-->
        <div id="selectDateTime">
          <div class="popup-top flex flex-x-between">
            <span></span>
            <strong>送达时间</strong>
            <span @click="setValue">确定</span>
          </div>
          <yd-scrolltab>
            <div class="popup-content flex">
              <div class="left">
                <ul>
                  <template v-for="d,index in dateArr">
                    <!--<li :class="d.isActive ? 'active' : ''" @click="setLeftDate(d)">-->
                    <li :class="d.isActive ? 'active' : ''" @click="setLeftDate(d)">
                      <div class="tac">
                        <p>{{d.value}}</p>
                      </div>
                    </li>
                  </template>
                </ul>
              </div>
              <div class="right">
                <ul>
                  <template v-for="d,index in timeArr">
                    <!--<li@click="setRightTime(d)">-->
                    <li :class="d.isActive ? 'active' : ''" @click="setRightTime(d)">
                      <div class="flex flex-x-between flex-y-center">
                        <div>{{d.value}}</div>
                        <img
                          src="../../assets/imgs/peis_icon_right.png"
                          style="height: 0.36rem; width: 0.36rem;"
                        >
                      </div>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
          </yd-scrolltab>
        </div>
      </yd-popup>
    </div>
  </yd-layout>
</template>
<script>
import dateTime from "../component/selectDateTime.vue";
import mixin from "../../utils/mixin.js";
import dateTimet from "../component/dateTime.vue";

export default {
  components: {
    dateTime,
    dateTimet
  },
  mixins: [mixin],
  data() {
    return {
      showDate: false,
      result: "",
      payParams: {},
      storeInfo: {},
      istody: 0,
      dateArr: [],
      timeArr: [],
      currentDate: "",
      currentTime: "",
      showTime: true
    };
  },
  async created() {
    this.$store.dispatch("changeNavBarTitle", "选择支付配送方式");
    this.server_date = await this.getServerTime()
    // 获取支付方式
    if (this.$route.params.payParams) {
      let nowTime = new Date(this.server_date);
      // let nowTime = this.server_date 
      let nt = nowTime.getHours() + 1;
      this.storeInfo = this.$route.params.storeInfo;
      this.payParams = this.$route.params.payParams;
      this.istody = this.payParams.distributionType;
      for (var i in this.distributionType) {
        if (
          this.distributionType[i].distributionType ==
          this.payParams.distributionType
        ) {
          this.distributionType[i].selected = true;
        } else {
          this.distributionType[i].selected = false;
        }
      }

      for (var i in this.payType) {
        if (this.payType[i].type == this.payParams.payType) {
          this.payType[i].selected = true;
        } else {
          this.payType[i].selected = false;
        }
      }

      for (var i in this.logisticsType) {
        if (this.logisticsType[i].type == this.payParams.wuliutype) {
          this.logisticsType[i].selected = true;
        } else {
          this.logisticsType[i].selected = false;
        }
      }

      this.result = `${this.payParams.distributionDate} ${
        this.payParams.distributionTimeBegin
      }~${this.payParams.distributionTimeEnd}`;
    } else {
      this.$router.go(-1);
    }
  },
  methods: {
    /**
     * 选择时间
     */
    datePicker() {
      this.initLeftDate();
      this.initRightTime(this.storeInfo, this.currentDate);
      this.showDate = true;
    },
    /**
     * 根据所选今日配送还是次日配送初始化左边日期
     */
    initLeftDate() {
      this.dateArr = [];
      if (this.istody == 0) {
        for (var i = 1; i <= this.storeInfo.period; i++) {
          let o = {
            value: this.GetDateStr(i,this.server_date).date
          };
          if (this.result.split(" ")[0] == this.GetDateStr(i,this.server_date).date) {
            o.isActive = true;
          } else {
            o.isActive = false;
          }
          this.dateArr.push(o);
        }
      } else {
        let nowTime = new Date(this.server_date);
        // let nowTime = this.server_date 
        let nt = nowTime.getHours() + 1;
        let i = 0;
        nt >= this.storeInfo.distributionEnd ? (i = 1) : (i = 0);
        for (var j = i; j <= this.storeInfo.period; j++) {
          let o = {
            value: this.GetDateStr(j,this.server_date).date
          };
          if (this.result.split(" ")[0] == this.GetDateStr(j,this.server_date).date) {
            o.isActive = true;
          } else {
            o.isActive = false;
          }
          this.dateArr.push(o);
        }
      }
      this.currentDate = this.result.split(" ")[0];
    },
    /**
     * 封装时间段数据
     */
    initRightTime(storeInfo, currentDate) {
      this.timeArr = [];
      let start = storeInfo.distributionStart;
      let nowTime = new Date(this.server_date);
      // let nowTime = this.server_date 

      if (this.istody == 1 && currentDate == this.GetDateStr(0,this.server_date).date) {
        //如果当日配送开始时间不能小于当前时间1小时
        start = nowTime.getHours() + 1;
        if (start > storeInfo.distributionEnd) {
          start = storeInfo.distributionStart;
        }
      }

      while (start < storeInfo.distributionEnd) {
        let timeStr;
        let toTime = start + 1;
        let startStr;
        let toTimeStr;

        start < 10 ? (startStr = `0${start}:00`) : (startStr = `${start}:00`);
        toTime < 10
          ? (toTimeStr = `0${toTime}:00`)
          : (toTimeStr = `${toTime}:00`);

        timeStr = `${startStr}~${toTimeStr}`;
        start += 1;

        var o = {
          value: timeStr
        };
        if (timeStr == this.result.split(" ")[1]) {
          o.isActive = true;
        } else {
          o.isActive = false;
        }
        this.timeArr.push(o);
      }
      this.currentTime = this.result.split(" ")[1];
    },
    setLeftDate(d) {
      this.initRightTime(this.storeInfo, d.value);
      for (var i in this.timeArr) {
        // 每次获取新的一天默认选择第一个时间段配送
        this.timeArr[i].isActive = false;
      }
      this.timeArr[0].isActive = true;
      this.currentTime = this.timeArr[0].value;
      for (var i in this.dateArr) {
        this.dateArr[i].isActive = false;
      }
      if (!d.isActive) {
        d.isActive = true;
      }
      console.log();
      this.currentDate = d.value;
    },
    setRightTime(d) {
      for (var i in this.timeArr) {
        this.timeArr[i].isActive = false;
      }
      if (!d.isActive) {
        d.isActive = true;
      }
      this.currentTime = d.value;
    },
    /**
     * 选择支付方式
     */
    selectPayWay(d) {
      if (!d.selected) {
        d.selected = true;
        for (var i in this.payType) {
          if (d.type != this.payType[i].type) {
            this.payType[i].selected = false;
          }
        }
      }
    },
    /**
     * 选择物流方式
     */
    selectWiLiuWay(d) {
      d.type == 1 ? (this.showTime = true) : (this.showTime = false),
        console.log(this.showTime);

      if (!d.selected) {
        d.selected = true;
        for (var i in this.logisticsType) {
          if (d.type != this.logisticsType[i].type) {
            this.logisticsType[i].selected = false;
          }
        }
      }
    },
    /**
     * 选择配送方式
     */
    selectdistributionWay(d) {
      if (this.storeInfo.distributionToday == 0) {
        this.$dialog.alert({
          mes: "该店铺不支持当日配送"
        });
      } else {
        let nowTime = new Date(this.server_date);
        // let nowTime = this.server_date 
        let nt = nowTime.getHours() + 1;
        console.log(nt);
        if (nt >= this.storeInfo.distributionEnd) {
          this.$dialog.alert({
            mes: "已超过该店铺今日配送时间段，只能选择次日配送"
          });
          return false;
        }

        if (!d.selected) {
          d.selected = true;
          if (d.distributionType == 0) {
            this.istody = 0;
            this.payParams.distributionDate = this.GetDateStr(1,this.server_date).date;

            let start = this.storeInfo.distributionStart;

            let toTime = start + 1;
            let startStr;
            let toTimeStr;
            start < 10
              ? (startStr = `0${start}:00`)
              : (startStr = `${start}:00`);
            toTime < 10
              ? (toTimeStr = `0${toTime}:00`)
              : (toTimeStr = `${toTime}:00`);

            this.payParams.distributionTimeBegin = startStr;
            this.payParams.distributionTimeEnd = toTimeStr;

            this.result = `${this.payParams.distributionDate} ${
              this.payParams.distributionTimeBegin
            }~${this.payParams.distributionTimeEnd}`;
          } else {
            this.istody = 1;
            this.payParams.distributionDate = this.GetDateStr(0,this.server_date).date;

            var nowTime = new Date(this.server_date);
            // let nowTime = this.server_date 
            let start = nowTime.getHours() + 1;
            let toTime = start + 1;
            let startStr;
            let toTimeStr;

            start < 10
              ? (startStr = `0${start}:00`)
              : (startStr = `${start}:00`);
            toTime < 10
              ? (toTimeStr = `0${toTime}:00`)
              : (toTimeStr = `${toTime}:00`);

            this.payParams.distributionTimeBegin = startStr;
            this.payParams.distributionTimeEnd = toTimeStr;

            this.result = `${this.payParams.distributionDate} ${
              this.payParams.distributionTimeBegin
            }~${this.payParams.distributionTimeEnd}`;
          }

          for (var i in this.distributionType) {
            if (
              d.distributionType != this.distributionType[i].distributionType
            ) {
              this.distributionType[i].selected = false;
            }
          }
        }
      }
    },
    /**
     * 确定
     */
    toOrderCheckoutSuccess() {
      var o = {};
      for (var i in this.payType) {
        if (this.payType[i].selected) {
          o.payType = this.payType[i].type;
        }
      }

      for (var i in this.distributionType) {
        if (this.distributionType[i].selected) {
          o.distributionType = this.distributionType[i].distributionType;
        }
      }

      for (var i in this.logisticsType) {
        if (this.logisticsType[i].selected) {
          o.wuliutype = this.logisticsType[i].type;
        }
      }

      if (o.distributionTimeEnd == "" || o.distributionTimeBegin == "") {
        this.$dialog.alert({
          mes: "请选择配送时间段"
        });
        return false;
      }

      o.distributionType == 0
        ? (o.distributionDate = this.GetDateStr(1,this.server_date).date)
        : (o.distributionDate = this.GetDateStr(0,this.server_date).date);

      // 选择日期重新赋值
      if (this.result != "") {
        o.distributionDate = this.result.split(" ")[0];
        o.distributionTimeBegin = this.result.split(" ")[1].split("~")[0];
        o.distributionTimeEnd = this.result.split(" ")[1].split("~")[1];
      }
      this.$store.dispatch("setPayParams", o);
      // this.$router.back();
      this.$router.push({
        name: "OrderSettlement",
        params: {
          sellerId: this.$route.params.shopCarParam.sellerId,
          sellerName: this.$route.params.shopCarParam.storeName,
          distributionType: this.$route.params.shopCarParam.distributionToday
        }
      });
    },
    /**
     * 选择时间
     */
    setValue() {
      this.result = `${this.currentDate} ${this.currentTime}`;
      this.showDate = false;
    }
  }
};
</script>
<style lang="scss">
#ChoiceOfPayment {
  .group {
    background: #fff;
    padding: 0.3rem;
    margin-bottom: 0.2rem;
    h1 {
      font-size: 0.3rem;
    }
    .btns {
      padding: 0.25rem 0 0;
      .yd-badge {
        /*padding: 4px 8px;*/
        margin-right: 0.2rem;
      }
    }
    .updatedate {
      margin-top: 0.25rem;
      img {
        margin-left: 0.1rem;
      }
    }
  }
  .okbtn {
    width: 4rem;
    height: 0.8rem;
    position: absolute;
    bottom: 1rem;
    left: 50%;
    margin-left: -2rem;
  }
  #selectDateTime {
    .popup-top {
      width: 100%;
      font-size: 0.3rem;
      background: #efeff3;
      padding: 0.2rem;
    }
    .yd-scrolltab {
      .yd-scrolltab-content {
        padding: 0;
      }
      top: 0.8rem;
      .popup-content {
        ul::-webkit-scrollbar {
          display: none;
        }
        height: 100%;
        .left {
          width: 4rem;
          height: 100%;
          background: #efeff3;
          ul {
            height: 100%;
            overflow-y: auto;
            li {
              padding: 0.2rem 0;
            }
            li.active {
              background: #fff;
            }
          }
        }
        .right {
          height: 100%;
          width: 100%;
          ul {
            height: 100%;
            overflow-y: auto;
            padding: 0 0 0 0.2rem;
            li {
              border-bottom: 1px solid #ddd;
              padding: 0.2rem 0;
              padding-right: 0.2rem;
              img {
                opacity: 0;
              }
            }
            li.active {
              img {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
}
</style>