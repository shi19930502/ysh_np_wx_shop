<template>
  <div>
    <yd-layout>
      <div class="settleAccounts">
        <div v-if='buyer' class="header">
          <template v-if="orderObj.distributionType ==1">
            <div class="name">订单配送至</div>
            <template v-if="buyerInfo.contacts">
              <div class="addr" @click="goSelectAdd">{{buyerInfo.completeAddress}}</div>
            </template>
            <template v-else>
              <div class="addr" @click="goSelectAdd">请选择收货地址</div>
            </template>
            <div>
              <span>{{buyerInfo.contacts}}</span>&nbsp;&nbsp;
              <span>{{buyerInfo.phoneNumber}}</span>
            </div>
          </template>
          <template v-else>
            <div style="font-size: 0.3rem;height: 1.3rem;line-height: 1.3rem;font-weight: 600;">自提，无需配送</div>
          </template>
          <div class="pay_father">
            <div class="pay">
              <div>支付方式</div>
              <div>现金支付</div>
            </div>
          </div>
        </div>
        <div v-else class="header caigoushang">
          <div class="addr tel">
            <div class="span">添加采购商</div>
            <yd-input ref='procurementPhone' :on-focus='openSearch' class='right_input' slot="right" v-model="procurementPhone" regex="mobile"
              placeholder="请输入手机号码"></yd-input>

          </div>
          <div>
            <yd-popup v-model="searchShow" position="bottom" height="100%">

              <div class="phone_input">
                <div class="input_father">
                  <input type="number" ref='selectPhoneInput' v-model='phoneVal' placeholder="请输入手机号码" oninput="if(value.length>11)value=value.slice(0,11)"
                  />
                  <yd-icon @click.native='errorClick' v-show='flgError' size=".32rem" class='yd-icon-error-c' color='#989E92' name="error"></yd-icon>
                </div>
                <div class="cancel_search_input" @click='cancelSearchInput'>取消</div>
              </div>
              <div class="phone_header">{{phoneList.length>0?'最佳匹配结果':'暂无已有采购商'}}</div>

              <div class="phone_list">
                <template v-if='phoneList.length>0'>
                  <div class="have_list" v-for='item in phoneList' @click='selectBuyer(item)'>
                    <p class="have_list_name">{{item.f_name}}</p>
                    <p class="have_list_addr">{{item.f_complete_address}}</p>
                    <div class="have_list_tel">
                      <span>{{item.f_contacts}}</span>&nbsp;&nbsp;
                      <span>{{item.f_tel}}</span>
                    </div>
                  </div>
                </template>

                <div v-else-if='phoneVal.length>=11&&phoneList.length<=0' @click='registerTle' class="none_list">
                  <img src="../../assets/imgs/icon_add_phone.png" alt="" />
                  <div>立即注册添加：{{phoneVal}}</div>
                </div>
              </div>
            </yd-popup>
          </div>
          <div class="pay_father">
            <div class="pay">
              <div>支付方式</div>
              <div>现金支付</div>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="content_list" v-for='(item,index) in quickSettlementParam'>
            <div class="c_header">
              <div class="henxian"></div>
              <div class="name">{{item.name}}</div>
              <div class="henxian"></div>
            </div>
            <div class="c_content" :key='list.id' v-for='(list,listIndex) in item.spArr'>
              <div class="c_c_list">
                <img v-if='list.skuPicUrl' :src="imgUrl+list.skuPicUrl" alt="" />
                <img v-else-if='list.proPicUrl' :src="imgUrl+list.proPicUrl" alt="" />
                <img v-else-if='list.catPic' :src="imgUrl+list.catPic" alt="" />
                <img v-else src="../../assets/imgs/img_moren@2x.png">
                <div class="list_right">
                  <div class="right_top">
                    <div style="width: 3rem;flex-grow: 1;">
                      <span>{{list.productName}}</span>&nbsp;{{list.skuName}}</div>
                    <div style="text-align: right;font-weight: 700;width: 1rem;flex-grow: 0;" @click='remark(item,item.spArr,listIndex)'>{{list.btnText}}</div>
                  </div>
                  <div class="right_bottom">
                    <div class="money" v-if="list.promotionPrice==0">￥&nbsp;时价/{{list.skuMeasureName}}</div>
                    <div class="money" v-else>￥&nbsp;{{list.promotionPrice}}/{{list.skuMeasureName}}</div>
                   
                    <div class="right_bottom_right">
                      <div class="num">X&nbsp;{{list.quantity}}</div>
                      <div class="xiaoji" v-if="list.promotionPrice==0">￥时价</div>
                      <div class="xiaoji" v-else>￥{{(parseFloat(list.promotionPrice)*parseFloat(list.quantity)).toFixed(2)}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="remark" v-show='list.showRemarks'>
                <yd-input v-model='list.commentBz' placeholder="输入商品备注信息" :max="200" :show-success-icon="false"></yd-input>
              </div>
            </div>
            <div class="list_shop_all">共{{item.idArr.length}}件商品</div>
            <div class="dispatching">
              <div class="top">
                <div v-if='item.timeObj.date&&userInfo.typeId=="buyer"' @click='selectTime(item.shopId,item,index)' class="top_top">
                  <div class="dispatching_top">
                    <div class="name">配送信息</div>
                    <div>{{item.timeObj.distributionType==1?"物流配送":"自提"}}</div>
                  </div>
                  <div class="select_time" v-show="orderObj.distributionType == 1">
                    <div v-if='item.timeObj.distributionToday'>{{item.timeObj.distributionToday==1?'当日配送':'次日配送'}}</div>
                    <yd-icon name="time" size=".28rem" color="#72B33D"></yd-icon>&nbsp;{{item.timeObj.date}}</div>
                </div>
                <div v-else-if='userInfo.typeId=="merchant"' class="top_top">
                  <div class="dispatching_top">
                    <div class="name">配送信息</div>
                    <div>自提&nbsp;&nbsp;</div>
                  </div>
                </div>
                <div v-else @click='selectTime(item.shopId,item,index)' class="top_top">
                  <div class="dispatching_top">
                    <div class="name">配送信息</div>
                    <div>请选择</div>
                  </div>
                </div>
                <img v-if='userInfo.typeId=="buyer"' src="../../../static/imgs/list_icon_right.png" alt="" />
              </div>
              <div class="leave_word">
                <yd-input v-model='item.comment' placeholder="选填：给商家留言" :max="200" :show-success-icon="false"></yd-input>
              </div>
              <div class="small_money">
                <span>小计：</span>
                <span class="money">{{item.settleMoney}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="footer_kong"></div>
        <div class="footer">
          <div class="footer_money">
            <div>￥{{settleMoney.money}}</div>
            <div class="footer_shop">商家{{settleMoney.num}}/商品{{settleMoney.goods}}</div>
          </div>
          <div class="footer_order" @click="submitOrder">确认订单</div>
        </div>
      </div>

    </yd-layout>
    <van-popup class='showPopup' v-model="showPopup" position="right" :overlay="false">
      <div class="dispatching_p">
        <div class="name">配送方式</div>
        <yd-radio-group v-model="orderObj.distributionType">
          <yd-radio val="0">自提</yd-radio>
          <yd-radio val="1">物流配送</yd-radio>
        </yd-radio-group>
      </div>
      <div class="dispatching_p" v-show="orderObj.distributionType == 1">
        <div class="name">配送时间</div>
        <yd-radio-group v-model="orderObj.distributionToday">
          <yd-radio :disabled='timeObj.distributionToday==0' val="1">当日配送</yd-radio>
          <yd-radio val="0">次日配送</yd-radio>
        </yd-radio-group>
        <div class="time">
          <div class="show_time">
            <span>{{orderObj.date}}</span>
          </div>
          <div class="select_time" @click='getTime'>请选择时间</div>
        </div>
      </div>
      <div class="closeShowPopupRight">
        <div @click='closeShowPopupRight' class="children">确认</div>
      </div>
      <yd-popup :close-on-masker='false' v-model="footerShow" position="bottom" height="60%">
        <div class="p_header">
          <div class="p_header_btn_y" v-if='dateTimeArr.length>0' @click='getSelectTime'>确认</div>
          <div v-else style='width: 1rem;'></div>
          <div class="p_header_name">送达时间</div>
          <div class="p_header_btn_c" @click="footerShow = false">取消</div>
        </div>
        <!--<yd-scrolltab>-->
        <div class="all_time_father">
          <div class="all_time">
            <div class="all_time_left">
              <div class="children" :class="item.className" @click='selectDateDay(item,dateDayArr,index)' v-for='(item,index) in dateDayArr'>{{item.date}}</div>
            </div>
            <div class="all_time_right">
              <template v-if='dateTimeArr.length>0'>
                <div class="children" @click='selectDateTime(item,dateTimeArr,index)' v-for='(item,index) in dateTimeArr'>
                  <div>{{item.date}}</div>
                  <img v-show='item.show' src="../../assets/imgs/peis_icon_right.png" alt="" />
                </div>
              </template>

              <div v-else style="font-size: .26rem;color: red;padding: .2rem;">
                现在时间超过配送时间，请选择次日配送！
              </div>
            </div>
          </div>
        </div>
        <!--</yd-scrolltab>-->

      </yd-popup>
    </van-popup>
  </div>

</template>

<script>
  import configs from '../../configs'
  import Vue from 'vue'
  import {
    Popup
  } from 'vant';
  import mixin from '../../utils/mixin.js'
  Vue.use(Popup);
  export default {
    mixins: [mixin],

    data() {
      return {
        imgUrl: configs.imgURL,
        quickSettlementParam: [],
        localObj: {},
        buyer: true,
        buyerInfo: {},
        showPopup: false,
        footerShow: false,
        radio2: '',
        timeObj: {},
        orderObj: {
          date: ''
        },
        orderTime: [],
        dateDayArr: [],
        dateTimeArr: [],
        isFirstDistributionToday: false,
        dateDayArrIndex: 0,
        dateTimeArrIndex: 0,
        settleMoney: {
          money: '0.00',
          num: 0,
          goods: 0,
        },
        creatOrderNum: 0,
        failMessage: [],
        procurementPhone: '',
        procurementPhone_1: '',
        btnQR: true,
        searchShow: false,
        phoneVal: '',
        flgError: false,
        phoneList: [],
      }
    },
    computed: {
      
    },
    watch: {
      phoneVal(val) {
        if (val) {
          this.flgError = true
        } else {
          this.flgError = false
        }
        this.getPhoneList(val)
      },
      quickSettlementParam: {
        handler(val) {

        },
        deep: true
      },
      'orderObj.distributionToday': {
        handler(val) {
          //判断切换
          if (this.isFirstDistributionToday) {
            //						this.orderObj.date = ''
            this.dateDayArrIndex = 0
            this.dateTimeArrIndex = 0
          } else {
            this.isFirstDistributionToday = true
          }
          this.countTime(val, this.dateDayArrIndex, this.dateTimeArrIndex)
          if (this.dateTimeArr.length <= 0) {
            this.orderObj.date = '现在时间超过配送时间，请选择次日配送！'
          } else {
            this.$nextTick(() => {
              this.getSelectTime();
            })
          }
        },
        deep: true
      },

    },
    async created() {
      this.$store.dispatch('changeNavBarTitle', '订单结算')
      this.server_date = await this.getServerTime()
      if (localStorage.getItem('quickSettlementParam')) {
        this.quickSettlementParam = JSON.parse(localStorage.getItem('quickSettlementParam'))
        if (this.quickSettlementParam.length > 0) {
          this.localObj = JSON.parse(localStorage.getItem('userInfo'))
          if (this.localObj.typeId == "merchant") {
            this.buyer = false
          } else {
            this.getAddress(this.localObj.typeCode);
          }
          var money = 0,
            goods = 0;
          for (let a = 0; a < this.quickSettlementParam.length; a++) {
            for (let b = 0; b < this.quickSettlementParam[a].spArr.length; b++) {
              this.quickSettlementParam[a].spArr[b].btnText = '备注'
              this.quickSettlementParam[a].spArr[b].showRemarks = false
              this.quickSettlementParam[a].spArr[b].commentBz = ''
            }
            money = (parseFloat(money) + parseFloat(this.quickSettlementParam[a].settleMoney)).toFixed(2)
            goods = goods + this.quickSettlementParam[a].spArr.length
            this.postRequest('store/queryBySellerId', {
              sellerId: this.quickSettlementParam[a].shopId
            }).then(resp => {
              //设置默认初始时间，
              this.quickSettlementParam[a].store = resp.data.aaData
              this.selectTime(this.quickSettlementParam[a].shopId, this.quickSettlementParam[a], a, true)
              this.getSelectTime();
              this.closeShowPopupRight()
            })

          }
          //footer的确认订单
          this.settleMoney.num = this.quickSettlementParam.length
          this.settleMoney.money = money
          this.settleMoney.goods = goods
        } else {
          this.$router.back();
        }
      } else {
        this.$router.push({
          name: 'Enshrine'
        })
      }

    },
    //离开页面后销毁quickSettlementParam
    destroyed() {
      //不能销毁，不然选地址有毛病。。。
    },
    mounted() {

    },
    methods: {
      //加载供应商下面的采购商
      getPhoneList(val) {
        this.postRequest('customer/queryCustomerByTelAndSellerId', {
          tel: val,
          sellerId: this.userInfo.typeCode
        }).then(resp => {
          if (resp.data.state == 0) {
            this.phoneList = resp.data.aaData.customerList;
          }
        })
      },
      //打开搜索框
      openSearch() {
        this.searchShow = true;
        this.$refs.selectPhoneInput.focus()
        this.phoneVal = this.procurementPhone
        if (this.phoneVal) {
          this.getPhoneList(this.phoneVal)
        }
      },
      //关闭搜索框
      cancelSearchInput() {
        this.searchShow = false;
      },
      //清空搜索框
      errorClick() {
        this.phoneVal = '';
      },
      //选择采购商
      selectBuyer(item) {
        this.procurementPhone = item.f_tel
        this.buyerInfo = {
          customerId: item.f_id,
          completeAddress: '',
          id: '',
          loginName: item.f_tel,
        }
        this.searchShow = false;
      },
      //注册采购商
      registerTle() {
        this.$dialog.loading.open('加载中...');
        var reg = /^1[34578]\d{9}$/
        if (reg.test(this.phoneVal)) {
          //一.查询改号码是否注册，
          //二.1注册了，直接使用，2未注册，快速注册
          this.postRequest('customer/QueryCustomerRolelist', {
            tel: this.phoneVal
          }).then(resp => {
            this.$dialog.loading.close();
            if (resp.data.state == 0 && resp.data.aaData.length > 0) {
              if (resp.data.aaData[0].roler == 'merchant') {

                this.$dialog.alert({
                  mes: '该手机号码是供应商，请重新输入'
                })
              } else {
                this.$dialog.confirm({
                  title: '提示',
                  mes: '该手机号码已经注册过了哟，快去下单吧',
                  opts: () => {
                    this.searchShow = false;
                    this.procurementPhone = this.phoneVal
                  }
                });
              }

            } else {
              this.$dialog.confirm({
                title: '提示',
                mes: `是否立即注册手机号${this.phoneVal}为采购商`,
                opts: () => {
                  this.$dialog.loading.open('注册中...');
                  //没有的时候创建
                  //1.直接注册，并且不需要code.,2.获取刚刚注册的采购商的id
                  this.postRequest('customer/customerRegist', {
                    name: this.phoneVal,
                    telephone: this.phoneVal,
                    key: 'buyer',
                    password: '123456',
                    channelCode: '',
                    invitationCode: '',
                  }).then(re => {
                    this.$dialog.loading.close();
                    if (re.data.state == 0 && re.data.msg == 'success') {
                      this.postRequest('customer/list', {
                        tel: this.phoneVal
                      }).then(r => {
                        if (r.data.state == 0 && r.data.aaData.length > 0) {
                          this.$dialog.confirm({
                            title: '提示',
                            mes: `注册成功，快去下单吧`,
                            opts: [{
                              txt: '确定',
                              color: true,
                              callback: () => {
                                this.searchShow = false;
                                this.procurementPhone = this.phoneVal
                                this.buyerInfo = {
                                  customerId: r.data.aaData[0].id,
                                  completeAddress: '',
                                  id: '',
                                  loginName: this.phoneVal,
                                }
                              }
                            }]
                          })
                        }
                      })
                    } else {
                      this.$dialog.toast({
                        mes: `失败!${re.data.msg}`,
                        timeout: 1500
                      });
                    }

                  })
                }
              });
            }
          })
        } else {
          this.$dialog.toast({
            mes: '请输入正确的手机号码！',
            timeout: 1500
          });
        }
      },
      //搜索采购商
      searchTel() {
        const input = this.$refs.procurementPhone;
        if (this.procurementPhone && input.valid) {
          this.postRequest('customer/list', {
            tel: this.procurementPhone
          }).then(resp => {
            //有的时候   如果不是供应商不是采购商的收藏，就调用收藏接口
            if (resp.data.aaData.length > 0) {
              this.postRequest('suppliercollection/getListBySellerId', {
                sellerId: this.userInfo.typeCode
              }).then(res => {
                var flg = false
                for (let a = 0; a < res.data.aaData.length; a++) {
                  if (res.data.aaData[a].customerId == resp.data.aaData[0].id) {
                    flg = true;
                    break
                  }
                }
                //真的时候，说明已经关联
                if (flg) {
                  this.$dialog.toast({
                    mes: '该采购商已和你关联，快去下单吧',
                    timeout: 1500,
                  });
                  this.buyerInfo = {
                    customerId: resp.data.aaData[0].id,
                    completeAddress: '',
                    id: '',
                    loginName: this.procurementPhone,
                  }
                } else {
                  this.postRequest('suppliercollection/updateSellerRelete', {
                    sellerId: this.userInfo.typeCode,
                    sellerName: this.userInfo.loginName,
                    joininCustomerIdsString: resp.data.aaData[0].id,
                    customerName: resp.data.aaData[0].name,
                    type: 1,
                  }).then(re => {
                    if (re.data.state == 0) {
                      this.$dialog.toast({
                        mes: '关联成功，快去下单吧',
                        timeout: 1500,
                      });
                      this.buyerInfo = {
                        customerId: resp.data.aaData[0].id,
                        completeAddress: '',
                        id: '',
                        loginName: this.procurementPhone,
                      }
                    } else {
                      this.$dialog.toast({
                        mes: re.data.msg,
                        timeout: 1500,
                      });
                    }

                  })
                }
              })

            } else {
              this.$dialog.confirm({
                title: '提示',
                mes: '该手机号未注册为采购商，是否立即注册',
                opts: () => {
                  //没有的时候创建
                  //1.首先获取供应商code,2.通过手机号码注册，3.请求采购商的id,4.激活
                  this.postRequest('customer/list', {
                    id: this.userInfo.typeCode
                  }).then(res => {
                    if (res.data.state == 0 && res.data.aaData.length > 0) {
                      this.postRequest('customer/customerRegist', {
                        name: this.procurementPhone,
                        telephone: this.procurementPhone,
                        key: 'buyer',
                        password: '123456',
                        channelCode: '',
                        invitationCode: res.data.aaData[0].code,
                      }).then(re => {
                        if (re.data.state == 0 && re.data.msg == 'success') {
                          this.postRequest('customer/list', {
                            tel: this.procurementPhone
                          }).then(r => {
                            if (r.data.state == 0 && r.data.aaData.length > 0) {
                              this.postRequest('customer/update', {
                                id: r.data.aaData[0].id,
                                enabled: 1,
                              }).then(_resp => {
                                if (_resp.data.state == 0 && _resp.data.msg == 'success') {
                                  this.$dialog.toast({
                                    mes: '注册成功，快去下单吧',
                                    timeout: 1500,
                                  });
                                  this.buyerInfo = {
                                    customerId: r.data.aaData[0].id,
                                    completeAddress: '',
                                    id: '',
                                    loginName: this.procurementPhone,
                                  }
                                }
                              })
                            }
                          })

                        }
                      })
                    } else {
                      this.$dialog.toast({
                        mes: `未找到id为${this.userInfo.typeCode }的供应商,查看local是否正确`,
                        timeout: 1500
                      });
                    }
                  })
                }
              });
            }
          })
        } else {
          this.$dialog.toast({
            mes: '请输入正确的手机号码',
            timeout: 1500,
          });
        }
      },
      //备注
      remark(item, list, index) {
        list[index].btnText == '备注' ? list[index].btnText = '收起' : list[index].btnText = '备注'
        if (item.spArr[index].showRemarks) {
          item.spArr[index].showRemarks = false
          this.$set(item.spArr, index, list[index])
        } else {
          item.spArr[index].showRemarks = true
          this.$set(item.spArr, index, list[index])
        }

      },
      //获取采购商的地址联系电话信息
      getAddress(id) {
        this.postRequest('address/queryByCustomerId', {
          customerId: id
        }).then(resp => {
          if (resp.data && resp.data.state == 0) {
            if (resp.data.aaData) {
              this.buyerInfo = resp.data.aaData
            }
          }
        })
      },
      //选择地址
      goSelectAdd() {
        this.$router.push({
          name: 'UserAddress'
        })
      },
      //选择时间
      selectTime(sellerId, item, index, flgDia) {
        this.dateDayArr = []
        this.dateTimeArr = []
        if (!flgDia) {
          this.showPopup = true;
        }
        this.countNum = index
        this.timeObj = item.store
        //this.timeObj.distributionToday == 0表示不能当天配送
        if (!item.timeObj.distributionToday) {
          item.timeObj.distributionToday = '1'
        }
        if (this.timeObj.distributionToday == 0) {
          item.timeObj.distributionToday = '0'
        }
        this.orderObj = Object.assign({}, this.orderObj, item.timeObj)
        this.dateDayArrIndex = item.timeObj.dateDayArrIndex
        this.dateTimeArrIndex = item.timeObj.dateTimeArrIndex
        this.countTime(item.timeObj.distributionToday, this.dateDayArrIndex, this.dateTimeArrIndex)
      },
      closeShowPopupRight() {
        if (this.orderObj.date != '现在时间超过配送时间，请选择次日配送！') {
          this.quickSettlementParam[this.countNum].timeObj = this.orderObj
          this.showPopup = false;
          this.isFirstDistributionToday = false
        } else {
          if (this.dateTimeArr == 0) {
            this.$dialog.alert({
              mes: '现在时间超过配送时间，请选择次日配送！'
            })
          } else {
            this.$dialog.alert({
              mes: '请选择配送时间'
            })
          }
        }
      },
      //打开上拉时间
      getTime() {
        this.footerShow = true;
      },
      //得到选择footer的时间
      getSelectTime() {
        for (let a = 0; a < this.dateDayArr.length; a++) {
          if (this.dateDayArr[a].className == 'active') {
            this.orderObj.distributionTimeBegin = this.dateDayArr[a].date
            this.orderObj.distributionTimeEnd = this.dateDayArr[a].date
            this.orderObj.date = this.dateDayArr[a].date
            this.orderObj.dateDayArrIndex = a
            break
          }
        }
        if (this.dateTimeArr.length > 0) {
          for (let b = 0; b < this.dateTimeArr.length; b++) {
            if (this.dateTimeArr[b].show) {
              this.orderObj.distributionTimeBegin = this.orderObj.distributionTimeBegin + ' ' + this.dateTimeArr[b].date
                .split('~')[0] + ':00'
              this.orderObj.distributionTimeEnd = this.orderObj.distributionTimeEnd + ' ' + this.dateTimeArr[b].date.split(
                '~')[1] + ':00'
              this.orderObj.date = this.orderObj.date + ' ' + this.dateTimeArr[b].date
              this.orderObj.dateTimeArrIndex = b
              break
            }
          }
        } else {
          this.orderObj.distributionToday = '0'
          this.$nextTick(() => {
            this.getSelectTime();
          })
        }
        this.footerShow = false;
      },
      //选择天数，日期2012-05-02
      selectDateDay(item, arr, index) {
        for (let a = 0; a < arr.length; a++) {
          if (a == index) {
            arr[index].className = 'active'
          } else {
            arr[a].className = ''
          }
        }
      },
      //得到小时区间  22：00~21：00
      selectDateTime(item, arr, index) {
        for (let a = 0; a < arr.length; a++) {
          if (a == index) {
            arr[index].show = true
          } else {
            arr[a].show = false
          }
        }
      },
      yugi(n) {
        var now = new Date(this.server_date);
        // var now = this.server_date;
        now.setDate(now.getDate() + n);
        var nowY = now.getFullYear();
        var nowM = now.getMonth() + 1;
        var nowD = now.getDate();
        var enddate = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
        return enddate;
      },
      //计算显示时间区域范围
      countTime(val, dateDayArrIndex, dateTimeArrIndex) {
        this.dateDayArr = [];
        this.dateTimeArr = []
        if (val == 0) { //不能当天配送 period，后面延长多少天
          for (let a = 0; a < this.timeObj.period; a++) {
            var o = {};
            o.className = ''
            if (a == dateDayArrIndex) {
              o.className = 'active'
            }
            o.date = this.yugi(a + 1)
            this.dateDayArr.push(o)
          }
          for (let b = 0; b < this.timeObj.distributionEnd - this.timeObj.distributionStart; b++) {
            var str = '';
            var o = {}
            str = (this.timeObj.distributionStart + b) + ':00~' + (this.timeObj.distributionStart + b + 1) + ':00'
            o.date = str;
            o.show = false
            if (b == dateTimeArrIndex) {
              o.show = true
            }
            this.dateTimeArr.push(o)
          }
        } else {
          //当天配送
          var o = {};
          var d = new Date(this.server_date);
          
          o.date = this.yugi(0)
          o.className = 'active'
          this.dateDayArr.push(o)

          //超过最后的时间
          if (this.timeObj.distributionEnd < d.getHours() && val != 0) {
            this.dateTimeArr = []
            //未超过最后，超过了开始
          } else if (this.timeObj.distributionStart < d.getHours() && val != 0) {
            for (let b = 0; b < this.timeObj.distributionEnd - d.getHours(); b++) {
              var str = '';
              var o = {}
              str = (d.getHours() + b) + ':00~' + (d.getHours() + b + 1) + ':00'
              o.date = str;
              o.show = false
              if (b == dateTimeArrIndex) {
                o.show = true
              }
              this.dateTimeArr.push(o)
            }
          }
        }
      },
      submitOrder() {
				if(this.orderObj.distributionType !=0 && this.buyerInfo.completeAddress == undefined && this.buyerInfo.id == undefined){
					this.$dialog.alert({
						mes: '请先选择收货地址！',
					})
					return false
				}

        //第一次循环，判断订单是否都选择了日期
        var flg = false
        for (let a = 0; a < this.quickSettlementParam.length; a++) {
          if (!this.quickSettlementParam[a].timeObj.date && this.userInfo.typeId == 'buyer') {
            this.$dialog.toast({
              mes: `未选择${this.quickSettlementParam[a].name}的配送信息`,
              timeout: 1500
            });
            flg = false
            break
          } else {
            flg = true
          }
        }
        //第二次，循环发送订单请求
        if (flg) {
          if (this.userInfo.typeId == 'buyer') {
						this.$dialog.loading.open('创建订单中，请稍后...');
            this.creatOrder()
          } else {
            if (this.buyerInfo.customerId) {
							this.$dialog.loading.open('创建订单中，请稍后...');
              this.creatOrder()
            } else {
              this.$dialog.toast({
                mes: '未选择采购商哟',
                timeout: 1500
              });
            }
          }

        }
      },
      creatOrder() {
        if (this.creatOrderNum >= this.quickSettlementParam.length) {
					this.$dialog.loading.close();
          if (this.failMessage.length > 0) {
            this.creatOrderNum = 0
            //删除成功的，并且更新loca
            var str = ''
            var newArr = [];
            for (let a = 0; a < this.failMessage.length; a++) {
              str = str + `<div>${this.failMessage[a].message}</div>`;
              for (let b = 0; b < this.quickSettlementParam.length; b++) {
                if (this.failMessage[a].index == b) {
                  newArr.push(this.quickSettlementParam[this.failMessage[a].index])
                }
              }
            }
            localStorage.setItem('quickSettlementParam', JSON.stringify(newArr))
            var optsArr = [{
                txt: '确定',
                color: false,
              },
              {
                txt: '去重新选购',
                color: true,
                callback: () => {
                  this.$router.back();
                }
              },
            ]
            if (this.$route.query.deleteGoods == 1) {
              optsArr = [{
                txt: '确定',
                color: false,
              }, {
                txt: '返回订单详情',
                color: true,
                callback: () => {
                  this.$router.back();
                }
              }, {
                txt: '去首页选购',
                color: '#4d7bfe',
                callback: () => {
                  this.$router.push({
                    name: 'Enshrine'
                  });
                }
              }, ]
            }

            this.$dialog.confirm({
              title: str,
              opts: optsArr
            })
            this.quickSettlementParam = JSON.parse(localStorage.getItem('quickSettlementParam'))
            this.failMessage = [];
          } else {
            //所有成功的时候跳转
            localStorage.setItem('quickSettlementParam', JSON.stringify([]))
            this.$router.push({
              name: 'quickSuccess'
            });
          }
        } else {
          var param = {
            buyerId: this.userInfo.typeCode, //typecode
            shippingAdd: this.buyerInfo.completeAddress,
            shippingAddId: this.buyerInfo.id,
            buyerName: this.localObj.typeId == 'buyer' ? this.localObj.loginName : this.buyerInfo.loginName,
            sellerId: this.quickSettlementParam[this.creatOrderNum].shopId,
            sellerName: this.localObj.typeId == 'buyer' ? this.quickSettlementParam[this.creatOrderNum].name : this.localObj
              .nickName,
            comment: this.quickSettlementParam[this.creatOrderNum].comment,
            distributionType: this.localObj.typeId == 'buyer' ? this.quickSettlementParam[this.creatOrderNum].timeObj
              .distributionType : 0,
            payType: 0,
            distributionTimeEnd: this.quickSettlementParam[this.creatOrderNum].timeObj.distributionTimeEnd,
            distributionTimeBegin: this.quickSettlementParam[this.creatOrderNum].timeObj.distributionTimeBegin,
            orderitems: JSON.stringify(this.fliterSpArr(this.quickSettlementParam[this.creatOrderNum].spArr)),
          }

          // 如果为自提 配送地址和配送时间不用存入数据库 
          if (this.orderObj.distributionType == 0) {
            delete param.distributionTimeBegin
            delete param.distributionTimeEnd
            delete param.shippingAddId
            delete param.shippingAdd
          }
          //创建订单
          this.postRequest('order/orderCreateByWebChatMall', param).then(resp => {
            if (resp.data && resp.data.state == 0) {
              var arr = [];
              for (let a = 0; a < this.quickSettlementParam[this.creatOrderNum].spArr.length; a++) {
                arr.push(this.quickSettlementParam[this.creatOrderNum].spArr[a].id)
              }
              var params = {};
              params.id = resp.data.aaData[0].id;
              params.orderStatusId = 3;
              //删除成功下单的    false表示再来一单
              if (this.$route.query.deleteGoods != 1) {
                this.postRequest('shippingcar/delete', {
                  id: arr
                }).then(r => {
                  if (r.data && r.data.state == 0) {
                    this.creatOrderNum++;
                    this.creatOrder();
                    if (this.$root.typeId == 'merchant') {
                      this.orderUpdate(params);
                    }
                  } else {
                    this.$dialog.loading.close();
                    this.$dialog.alert({
                      mes: '购物车商品不存在，请重新选择商品！',
                      callback: () => {
                        this.$router.push({
                          name: 'searchCar'
                        });
                      }
                    })
                  }
                })
              } else {
                this.creatOrderNum++;
                this.creatOrder();
                if (this.$root.typeId == 'merchant') {
                  this.orderUpdate(params);
                }
              }
            } else {
              var o = {};
              o.message = `${this.quickSettlementParam[this.creatOrderNum].name}${resp.data.msg}`;
              o.index = this.creatOrderNum;
              this.failMessage.push(o);
              this.creatOrderNum++;
              this.creatOrder();
            }
          })
        }
      },
      orderUpdate(params) {
        //0.新建，1.受理，2.已分拣，3.已发货
        this.postRequest('order/update', params).then(resp => {

        })
      },
      fliterSpArr(arr) {
        var newArr = [];
        for (let a = 0; a < arr.length; a++) {
          var o = {
            "productId": arr[a].productId,
            "productName": arr[a].productName,
            "skuId": arr[a].skuId,
            "skuName": arr[a].skuName,
            "skuMeasure": arr[a].skuMeasure,
            "comment": arr[a].commentBz,
            "skuMeasureName": arr[a].skuMeasureName,
            "quantity": arr[a].quantity,
            "chargingModel": arr[a].chargingModel,
            "oriPrice": parseInt(parseFloat(arr[a].promotionBasePrice).mul(100)),
            "price": parseInt(parseFloat(arr[a].promotionPrice).mul(100)),
          };
          newArr.push(o)
        }
        return newArr
      }
    }
  }
</script>

<style lang="scss">
  .yd-dialog-black-mask {
    z-index: 9999;
  }

  p {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }

  .settleAccounts {
    .header {
      width: 100%;
      padding: .3rem .3rem .74rem .3rem;
      min-height: 2.4rem;
      position: relative;
      margin: 0 0 .8rem 0;
      color: white;
      font-size: .24rem;
      text-align: center;
      background: -webkit-linear-gradient(to left, #B7DB68, #8CD362);
      /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(to left, #B7DB68, #8CD362);
      /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(to left, #B7DB68, #8CD362);
      /* Firefox 3.6 - 15 */
      background: linear-gradient( to left, #B7DB68, #8CD362);
      /* 标准的语法 */
      .name {
        font-size: .28rem;
      }
      .addr {
        font-size: .3rem;
        padding: .18rem 0;
        &:after {
          content: '';
          display: inline-block;
          width: .14rem;
          height: .24rem;
          background: url(../../assets/imgs/icon_right.png) no-repeat;
          background-size: contain;
          margin: 0 0 0 .15rem;
        }
      }
      .yd-popup-content {
        background: #EFEFF3;
      }
      .phone_header {
        color: #989E92;
        font-size: .26rem;
        padding: .27rem 0 .1rem 0;
      }
      .phone_list {
        color: #2F3927;
        background: white;
        padding: 0 .33rem;
        .have_list {
          line-height: .4rem;
          text-align: left;
          border-bottom: 1px solid #DDDDDD;
          box-sizing: border-box;
          font-size: .24rem;
          padding: .37rem 0rem .27rem 0rem;
          .have_list_name {
            font-size: .3rem;
            color: #2F3927;
            font-weight: bold;
          }
          .have_list_addr {
            color: #2F3927;
            padding: .22rem 0 .39rem 0;
            font-weight: 700;
          }
          .have_list_tel {
            color: #989E92;
          }
        }
        .none_list {
          display: flex;
          align-items: center;
          padding: .37rem .32rem;
          font-weight: 700;
          font-size: .3rem;
          img {
            width: .8rem;
            height: .8rem;
            margin: 0 .33rem 0 0;
          }
        }
      }
      .tel {
        padding: 0rem 0;
        align-items: center;
        /*display: flex;*/
        .right_input {
          margin: .2rem 0;
          flex-grow: 1;
          input {
            border: 1px solid white;
            padding: .1rem;
            border-radius: .08rem;
            width: 100%;
            max-width: 750px;
            text-indent: .5rem;
            background-color: white;
            background-image: url(../../assets/imgs/fangdajing.png);
            background-repeat: no-repeat;
            background-size: contain;
            background-size: .4rem .4rem;
            background-position: .1rem .08rem;
          }
        }
        .search {
          width: 1.2rem;
          border: 1px solid white;
          line-height: .53rem;
          border-radius: .08rem;
        }
        .span {
          width: 2rem;
          flex-grow: 0;
          font-size: .32rem;
          line-height: .4rem;
          text-align: left;
        }
        &:after {
          display: none;
        }
      }
      .phone_input {
        display: flex;
        max-width: 750px;
        width: 100%;
        background: #80C551;
        box-sizing: border-box;
        padding: .1rem .1rem;
        .input_father {
          width: 2rem;
          position: relative;
          flex-grow: 1;
          .yd-icon-error-c {
            position: absolute;
            right: .2rem;
            top: .2rem;
          }
        }
        input {
          border-radius: .08rem;
          border: 1px solid white;
          width: 100%;
          padding: .15rem;
          font-size: .32rem;
          color: #2F3927;
          text-indent: .5rem;
          background-color: white;
          background-image: url(../../assets/imgs/fangdajing.png);
          background-repeat: no-repeat;
          background-size: contain;
          background-size: .4rem .4rem;
          background-position: .1rem .12rem;
        }
        .cancel_search_input {
          width: 1rem;
          text-align: center;
          color: white;
          font-size: .34rem;
          display: flex;
          align-items: center;
          margin: 0 0 0 .24rem;
        }
      }
      .pay_father {
        width: 100%;
        position: absolute;
        bottom: -.5rem;
        left: 0;
      }
      .pay {
        border-radius: .04rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 7.18rem;
        width: 95%;
        margin: auto;
        height: 1rem;
        background: white;
        color: #2F3927;
        font-size: .28rem;
        padding: 0 .2rem;
        .pay_list {
          color: #2F3927;
          font-size: .24rem;
          &:after {
            content: '';
            display: inline-block;
            width: .14rem;
            height: .2rem;
            background: url(../../../static/imgs/list_icon_right.png) no-repeat;
            background-size: contain;
            margin: 0 0 0 .15rem;
          }
        }
      }
    }
    .caigoushang {
      /*display: flex;
			align-items: center;
			justify-content: center;*/
      padding: .36rem .3rem .3rem .3rem;
    }
    .content_list {
      width: 7.18rem;
      width: 95%;
      margin: 0 auto .3rem;
      background: white;
      border-radius: .04rem;
      padding: 0 .2rem .44rem .2rem;
      .c_header {
        align-items: center;
        display: flex;
        .henxian {
          flex-grow: 1;
          width: 1rem;
          height: 3px;
          border-bottom: 1px solid #D6D6D6;
          border-top: 1px solid #D6D6D6;
        }
        .name {
          color: #2F3927;
          flex-grow: 0;
          padding: .26rem .16rem;
          font-size: .28rem;
        }
      }
      .c_content {
        margin: 0 0 .25rem 0;
        .remark {
          margin: 0.1rem 0 0rem 0;
          height: 0.6rem;
          background: #FFEDBD;
          color: #989E92;
          padding-left: 0.1rem;
          border-radius: 5px;
        }
      }
      .c_c_list {
        display: flex;
        /*margin: 0 0 .2rem 0;*/
        img {
          width: .6rem;
          height: .6rem;
          margin: 0 .17rem 0 0;
          flex-grow: 0;
        }
        .list_right {
          width: 3rem;
          flex-grow: 1;
          font-size: .24rem;
          color: #2F3927;
          .right_top {
            display: flex;
            justify-content: space-between;
            span {
              font-weight: 700;
            }
          }
          .right_bottom {
            margin: .12rem 0 .1rem 0;
            display: flex;
            justify-content: space-between;
            .money {
              color: #989E92;
            }
            .right_bottom_right {
              display: flex;
              align-items: center;
              font-weight: 700;
              width: 2.5rem;
              .num {
                width: 1rem;
                flex-grow: 0;
              }
              .xiaoji {
                width: 1.2rem;
                flex-grow: 1;
                text-align: right;
              }
            }
          }
        }
      }
      .list_shop_all {
        width: 100%;
        height: .4rem;
        background: #EFEFF3;
        text-align: center;
        line-height: .4rem;
        color: #797D77;
        font-size: .24rem;
        border-radius: .04rem;
        margin: .2rem 0 .37rem 0;
      }
    }
    .dispatching {
      .top {
        display: flex;
        align-items: center;
        img {
          width: .14rem;
          height: .24rem;
          flex-grow: 0;
          margin: 0 0 0 .2rem;
        }
        .top_top {
          flex-grow: 1;
          width: 3rem;
          .dispatching_top {
            display: flex;
            align-items: center;
            font-size: .24rem;
            justify-content: space-between;
            color: #2F3927;
            .name {
              font-size: .28rem;
            }
          }
          .select_time {
            text-align: right;
          }
        }
      }
      .leave_word {
        height: .68rem;
        background: rgba(250, 248, 229, 1);
        border-radius: .04rem;
        margin: .31rem 0;
        padding: 0 .21rem;
      }
      .small_money {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: .24rem;
        .money {
          font-size: .36rem;
          font-weight: 700;
        }
      }
    }
    .footer_kong {
      width: 100%;
      height: .98rem;
      background: transparent;
    }
    .footer {
      position: fixed;
      background: white;
      bottom: 0;
      z-index: 99;
      display: flex;
      width: 100%;
      max-width: 750px;
      justify-content: space-between;
      align-items: center;
      padding: 0 0 0 .41rem;
      .footer_money {
        color: #FF3D15;
        display: flex;
        align-items: center;
        font-size: .36rem;
        .footer_shop {
          margin-left: .22rem;
          color: #989E92;
          font-size: .24rem;
        }
      }
      .footer_order {
        width: 2.19rem;
        text-align: center;
        line-height: .98rem;
        color: white;
        background: #FE971D;
        font-size: .36rem;
      }
    }
  }

  .showPopup {
    width: 100%;
    height: 100%;
    background: #efeff3;
    .dispatching_p {
      .name {
        font-size: .3rem;
        font-weight: 700;
        margin: 0 0 .2rem 0;
      }
      padding: .3rem;
      background: white;
      margin-bottom: .25rem;
    }
    .time {
      display: flex;
      margin: .2rem 0;
      justify-content: space-between;
    }
    .footerShow {
      /*height: ;*/
    }
    .p_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: .2rem;
      font-size: .3rem;
      background: #EFEFF3;
      .p_header_name {
        text-align: center;
        font-weight: 700;
      }
      .p_header_btn_y,
      .p_header_btn_c {
        width: 1rem;
        padding: .05rem;
        border: 1px solid white;
        text-align: center;
        border-radius: .04rem;
        background: #6FB138;
        color: white;
        border-radius: .04rem;
      }
    }
    .all_time_father {
      width: 100%;
      height: 7rem;
      .all_time_left {
        height: 7rem;
        overflow: auto;
        .active {
          background: white;
        }
      }
      .all_time_right {
        height: 7rem;
        overflow: auto;
      }
    }
    .all_time {
      width: 100%;
      display: flex;
      font-size: .24rem;
      .all_time_left {
        width: 2.6rem;
        flex-grow: 0;
        background: #EFEFF3;
        .children {
          padding: .2rem;
        }
      }
      .all_time_right {
        width: 5rem;
        flex-grow: 1;
        padding: 0 .2rem;
        .children {
          border-bottom: 1px solid #ddd;
          line-height: .4rem;
          padding: .2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          img {
            width: .36rem;
            height: .36rem;
          }
        }
        .children:last-child {
          border-bottom: none;
        }
      }
    }
    .closeShowPopupRight {
      width: 100%;
      padding: .3rem;
      position: relative;
      top: 4rem;
      line-height: .4rem;
      .children {
        width: 4rem;
        margin: auto;
        background: rgb(111, 177, 56);
        color: white;
        text-align: center;
        font-size: .3rem;
        padding: .2rem;
        border-radius: .08rem;
      }
    }
  }
</style>
