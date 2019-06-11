<template>
  <div id="NorthDoorStore">
    <div class="position gradient flex flex-y-center flex-x-center">
      <template v-if="AddressInfo">
        <img src="../../assets/imgs/dianpu_icon_dingwei@2x.png" class="dianpu_icon">
        <span>{{AddressInfo.completeAddress}}</span>
        <img src="../../assets/imgs/icon_up@2x.png" style="width: 0.28rem;height: 0.16rem;">
      </template>
      <span v-else>请设置收货地址</span>
    </div>
    <yd-scrolltab style="top: 1rem;">
      <div class="scrolltab-wrap">
        <yd-infinitescroll :callback="getStoreByChannel" ref="infinitescrollDemo">
          <ul class="door-store-list" slot="list">
            <li class="flex flex-y-center" v-for="d in stores" @click="enterStore(d.f_seller_id)">
              <div class="store-img">
                <img v-if="d.f_head_pic_url" :src="imgURL+d.f_head_pic_url" alt="">
                <img v-else src="../../assets/imgs/img_dianpu.png" alt="">
              </div>
              <div class="store-info flex-item-5">
                <div class="store-name flex flex-x-between flex-y-center">
                  <p>
                    <strong>{{d.f_store_name}}</strong>
                  </p>
                  <p v-if="d.distatce == 0">-</p>
                  <p v-else-if="d.distatce >= 1">{{d.distatce.toFixed(1)}}km</p>
                  <p v-else>{{(d.distatce*1000).toFixed(0)}}m</p>
                </div>
                <div class="store-pingfen flex flex-y-center">
                  <yd-rate v-model="rate1" readonly size="0.24rem" active-color="#FEA527"></yd-rate>
                  <span>5分</span>
                  <span>成交 {{d.dealCount}}</span>
                </div>
                <div class="store-mainsell flex flex-y-center">
                  <img src="../../assets/imgs/icon_img_zhuy@2x.png" style="width: 0.3rem;height: 0.3rem;">
                  <!-- <span>时令蔬菜、新鲜水果、米面粮油、调料干货</span> -->
                  <template v-for="item,index in d.listCategory">
                    <span v-if="index!=d.listCategory.length-1">{{item.name+'、'}}</span>
                    <span v-else>{{item.name}}</span>
                  </template>
                </div>
              </div>
            </li>
          </ul>
          <span slot="doneTip">没有更多数据啦</span>
        </yd-infinitescroll>
      </div>
    </yd-scrolltab>
  </div>
</template>
<script>
  import mixin from '../../utils/mixin.js'
  export default {
    mixins: [mixin],
    data() {
      return {
        rate1: 5,
        pageNum: 1,
        pageSize: 10,
        pageTatol: 0,
        customerProperty: '001',
        stores: [],
        channelCode: '',
        AddressInfo: {}
      }
    },
    created() {
      this.$store.dispatch('changeNavBarTitle', '店铺列表')
      this.getStoreByChannel()
    },
    mounted() {},
    methods: {
      /**
       * 获取店铺
       */
      async getStoreByChannel() {
        let AddressInfo = await this.getUserAddressInfo()
        this.AddressInfo = AddressInfo
        console.log(AddressInfo)
        if (AddressInfo) {
          let param = {
            channelCode: this.channelCode,
            customerProperty: this.userInfo.userType == '005' ? '004' :'001' ,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          }
					if(AddressInfo.latitude){
						param.latitude = AddressInfo.latitude 
						param.longitude = AddressInfo.longitude 
					}
          this.getStoreByChannelRequest(param)
        } else {
          this.$dialog.alert({
            mes: '还没有设置收货地址,请添加收货地址!',
            callback: () => {
              this.$router.push({
                name: 'UserNewAddress',
                query: {
                  fromRouter: this.$route.name
                }
              })
            }
          })
        }
      },
      /**
       * 掉接口
       */
      getStoreByChannelRequest(param) {
        this.postRequest('store/getStoreByChannel', param).then((d) => {
          if (d.data && d.data.state == 0) {
            if (d.data.aaData) {
              const _list = d.data.aaData
              this.stores = [...this.stores, ..._list];
              if (_list.length < this.pageSize) {
                /* 所有数据加载完毕 */
                if (this.$refs.infinitescrollDemo)
                  this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                return;
              }
              /* 单次请求数据完毕 */
              if (this.$refs.infinitescrollDemo)

                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
              this.pageNum++;
            }
          }
        })
      },
      /**
       * 获取登录人地址信息
       */
      getUserAddressInfo() {
        return new Promise((resolve, reject) => {
          this.postRequest('address/queryByCustomerId', {
            customerId: this.userInfo.typeCode
          }).then((d) => {
            if (d.data && d.data.state == 0) {
              resolve(d.data.aaData)
            }
          })
        })
      },
      enterStore(sellerId) {
        this.$router.push({
          name: 'NorthShop',
          query: {
            sellerId: sellerId
          }
        })
      }
    },
  };
</script>
<style lang="scss">
  #NorthDoorStore {
    .position {
      height: 1rem;
      color: #fff;
      span {
        font-size: 0.28rem;
        padding: 0 0.24rem;
        display: inline-block;
        max-width: 80%;
      }
      .dianpu_icon {
        width: 0.28rem;
        height: 0.32rem;
      }
    }
    .yd-scrolltab-content {
      padding: 0;
    }
    .scrolltab-wrap {
      height: 100%;
      overflow-y: auto;
    }
    .scrolltab-wrap::-webkit-scrollbar {
      display: none;
    }
    .door-store-list {
      background: #fff;
      padding: 0 0.25rem;
      li {
        padding: 0.3rem 0;
        border-bottom: 1px solid #ddd;
        .store-name {
          strong {
            font-size: 0.3rem;
          }
        }
        .store-img {
          width: 1.2rem;
          height: 1.2rem;
          margin-right: 0.25rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .store-pingfen {
          padding: 0.08rem 0;
          font-size: 0.24rem;
          color: #797D77;
          span {
            padding: 0 0.05rem;
          }
        }
        .store-mainsell {
          img {
            margin-right: 0.2rem;
          }
        }
      }
    }
  }
</style>
