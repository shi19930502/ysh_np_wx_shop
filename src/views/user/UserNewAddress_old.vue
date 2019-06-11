<template>
  <yd-layout>
    <yd-scrolltab style="bottom: 1rem">
      <div id="UserNewAddress">
        <yd-cell-group>
          <yd-cell-item>
            <span slot="left">
              <div class="lable">
                <strong>联系人</strong>
              </div>
            </span>
            <yd-input
              slot="right"
              v-model="form.contacts"
              max="20"
              placeholder="请输入联系人"
              :show-success-icon="false"
            ></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">
              <div class="lable">
                <strong>电话</strong>
              </div>
            </span>
            <yd-input
              slot="right"
              v-model="form.phoneNumber"
              max="20"
              placeholder="请输入联系电话"
              :show-success-icon="false"
            ></yd-input>
          </yd-cell-item>
          <yd-cell-item arrow>
            <span slot="left">
              <div class="lable">
                <strong>省</strong>
              </div>
            </span>
            <select v-model="form.provinceCode" slot="right" @change="changeProvinceList">
              <option value disabled selected>请选择省</option>
              <option :value="d.areaCode" v-for="d in ProvinceList">{{d.areaName}}</option>
            </select>
            <!--<yd-input slot="right" readonly @click.native="showAddress = true" v-model="resultAddress" max="20" placeholder="选择收货地址"></yd-input>-->
          </yd-cell-item>
          <yd-cell-item arrow>
            <span slot="left">
              <div class="lable">
                <strong>市</strong>
              </div>
            </span>
            <select v-model="form.cityCode" slot="right" @change="changeCityList">
              <option value disabled selected>请选择市</option>
              <option :value="d.areaCode" v-for="d in CityList">{{d.areaName}}</option>
            </select>
          </yd-cell-item>
          <yd-cell-item arrow>
            <span slot="left">
              <div class="lable">
                <strong>区/县</strong>
              </div>
            </span>
            <select v-model="form.districCode" slot="right" @change="changeDistricList">
              <option value disabled selected>请选择区/县</option>
              <option :value="d.areaCode" v-for="d in DistricList">{{d.areaName}}</option>
            </select>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">
              <div class="lable">
                <strong>详细地址</strong>
              </div>
            </span>
            <yd-input
              slot="right"
              v-model="form.detailedAddress"
              max="20"
              placeholder="例：XX街道XX号"
              :show-success-icon="false"
              @input="setcompleteAddress"
            ></yd-input>
          </yd-cell-item>
          <yd-cell-item class="textarea">
            <span slot="left">
              <div class="lable">
                <strong>完整信息</strong>
              </div>
            </span>
            <!--<span slot="left">{{form.completeAddress}}</span>-->
            <yd-textarea
              slot="right"
              readonly
              placeholder="完整信息"
              v-model="form.completeAddress"
              maxlength="200"
            ></yd-textarea>
          </yd-cell-item>
          <yd-cell-item class="textarea">
            <span slot="left">
              <div class="lable">
                <strong>备注</strong>
              </div>
            </span>
            <yd-textarea
              slot="right"
              placeholder="请输入备注信息"
              v-model="form.comment"
              maxlength="100"
              :show-success-icon="false"
            ></yd-textarea>
          </yd-cell-item>
        </yd-cell-group>
      </div>
    </yd-scrolltab>

    <!--<div class="flex flex-x-center" style="padding: 0 0.24rem;position: absolute;bottom: 0;width: 100%;">
			<div @click="save" class="loginbtn flex flex-y-center flex-x-center">
				<span>保存</span>
			</div>
    </div>-->
    <yd-button
      @click.native="save"
      size="large"
      bgcolor="#6FB138"
      color="#fff"
      style="padding: 0 0.24rem;position: absolute;bottom: 0;width: 100%;"
    >确定</yd-button>
  </yd-layout>
</template>
<script>
import mixin from "../../utils/mixin.js";
export default {
  mixins: [mixin],
  data() {
    return {
      type: "add",
      form: {
        id: "",
        districtName: "",
        detailedAddress: "",
        completeAddress: "",
        contacts: "",
        phoneNumber: "",
        customerId: "",

        provinceCode: "",
        cityCode: "",
        districCode: "",
				comment: "",
				
				provinceName: "",
        cityName: "",
        districName: ""
      },
      ProvinceList: [],
      CityList: [],
      DistricList: []
    };
  },
  created() {
    this.init();

    // var addressInfo = this.$store.getters.getSelectedAddress
    var addressInfo = JSON.parse(
      window.sessionStorage.getItem("setSelectedAddress")
    );
    if (addressInfo) {
      this.type = "edit";
    }

    if (this.type == "add") {
      this.$store.dispatch("changeNavBarTitle", "新增地址");
    } else {
      this.$store.dispatch("changeNavBarTitle", "编辑地址");
      this.form = addressInfo;

      this.getCityList();
      this.getDistricList();
    }
  },
  mounted() {},
  methods: {
    /**
     * 初始化
     */
    init() {
      this.getProvinceList();
    },
    /**
     * 获取省列表
     */
    getProvinceList() {
      this.postRequest("comArea/list", {
        level: 1
      }).then(d => {
        if (d.data && d.data.state == 0) {
          this.ProvinceList = d.data.aaData;
        }
      });
    },
    changeProvinceList() {
      this.form.cityCode = ""
			this.form.districCode = ""

			this.form.cityName = "";
      this.form.districName = "";
      for (let a of this.ProvinceList) {
        if (this.form.provinceCode == a.areaCode) {
          this.form.provinceName = a.areaName;
        }
      }
			this.setcompleteAddress()
			this.getCityList();

    },
    /**
     * 获取市列表
     */
    getCityList() {
      this.postRequest("comArea/list", {
        parentAreaCode: this.form.provinceCode,
        level: 2
      }).then(d => {
        if (d.data && d.data.state == 0) {
          this.CityList = d.data.aaData;
        }
      });
    },
    changeCityList() {
			this.form.districCode = "";
			this.form.districName = "";
      for (let a of this.CityList) {
        if (this.form.cityCode == a.areaCode) {
          this.form.cityName = a.areaName;
        }
      }
      this.setcompleteAddress();
      this.getDistricList();
    },
    /**
     * 获取县区列表
     */
    getDistricList() {
      this.postRequest("comArea/list", {
        parentAreaCode: this.form.cityCode,
        level: 3
      }).then(d => {
        if (d.data && d.data.state == 0) {
          this.DistricList = d.data.aaData;
        }
      });
		},
		changeDistricList() {
      for (let a of this.DistricList) {
        if (this.form.districCode == a.areaCode) {
          this.form.districName = a.areaName;
        }
      }
      this.setcompleteAddress();
    },
    setcompleteAddress() {
      this.form.completeAddress =
        this.form.provinceName +
        this.form.cityName +
        this.form.districName +
        this.form.detailedAddress;
    },
    /**
     * 保存
     */
    save() {
      var param = {
        id: this.form.id,
        provinceCode: this.form.provinceCode,
        cityCode: this.form.cityCode,
        districCode: this.form.districCode,
        detailedAddress: this.form.detailedAddress,
        contacts: this.form.contacts,
        phoneNumber: this.form.phoneNumber,
        customerId: this.form.customerId,
        comment: this.form.comment
      };
      if (param.contacts == "") {
        this.$dialog.alert({
          mes: "请填写收货人"
        });
        return;
      }
      if (param.phoneNumber == "") {
        this.$dialog.alert({
          mes: "请填写联系电话"
        });
        return;
      }
      if (param.provinceCode == "") {
        this.$dialog.alert({
          mes: "请选择省"
        });
        return;
      }
      if (param.cityCode == "") {
        this.$dialog.alert({
          mes: "请选择市"
        });
        return;
      }
      if (param.districCode == "") {
        this.$dialog.alert({
          mes: "请选择县/区"
        });
        return;
      }
      if (param.detailedAddress == "") {
        this.$dialog.alert({
          mes: "请填写详细地址"
        });
        return;
      }

      var url = "address/create";

      if (this.type == "edit") {
        url = "address/update";
      } else {
        param.customerId = this.userInfo.typeCode;
      }

      this.postRequest(url, param).then(d => {
        if (d.data && d.data.state == 0) {
          this.$dialog.toast({
            mes: "保存成功",
            timeout: 1200,
            icon: "success",
            callback: function() {
              this.$router.go(-1);
              window.sessionStorage.removeItem("setSelectedAddress");
            }.bind(this)
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
#UserNewAddress {
  height: 100%;
  overflow: auto;
  textarea {
    font-family: "PingFang-SC-Medium";
  }
  /**重写scrolltab*/

  .yd-scrolltab-content {
    padding: 0 0 0 0;
  }
  .yd-scrolltab {
    top: 0rem;
    bottom: 1rem;
  }
  .loginbtn {
    width: 100%;
    height: 0.78rem;
    background: #6fb138;
    border-radius: 0.39rem;
    color: #fff;
    font-size: 0.31rem;
    text-align: center;
  }
  .textarea {
    .yd-cell-left {
      -webkit-box-align: start;
      -moz-align-items: start;
      -webkit-align-items: start;
      align-items: start;
      padding: 0.2rem 0;
    }
  }
  select {
    color: #333;
    padding-left: 5px;
    font-family: "PingFang-SC-Medium";
  }
  .lable {
    width: 1.8rem;
    font-size: 0.3rem;
  }
}
#UserNewAddress::-webkit-scrollbar {
  display: none;
}
</style>