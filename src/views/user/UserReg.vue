<template>
  <yd-layout>
    <div id="UserReg">
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">
            <div class="lable">
              <strong>手机号码</strong>
            </div>
          </span>
          <yd-input v-model="form.telephone" slot="right" :max="11" placeholder="请输入手机号码" :show-success-icon="false"></yd-input>
          <div slot="right" class="getcodebtn" v-if="showGetCodeBtn" @click="sendMesCode">获取验证码</div>
          <div slot="right" class="getcodebtn" v-else>重新获取({{mesCodeTime}})</div>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">
            <div class="lable">
              <strong>验证码</strong>
            </div>
          </span>
          <yd-input v-model="form.mseCode" slot="right" max="20" placeholder="请输入验证码" :show-success-icon="false"></yd-input>
        </yd-cell-item>
      </yd-cell-group>

      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">
            <div class="lable">
              <strong>用户昵称</strong>
            </div>
          </span>
          <yd-input v-model="form.name" slot="right" max="20" placeholder="请输入昵称" :show-success-icon="false"></yd-input>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">
            <div class="lable">
              <strong>密码</strong>
            </div>
          </span>
          <yd-input
            v-model="form.password"
            type="password"
            slot="right"
            :max="20"
            :show-success-icon="false"
            placeholder="请输入密码"
          ></yd-input>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">
            <div class="lable">
              <strong>确认密码</strong>
            </div>
          </span>
          <yd-input v-model="repassword" type="password" slot="right" :max="20" placeholder="请确认密码" :show-success-icon="false"></yd-input>
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">
            <div class="lable">
              <strong>邀请码</strong>
            </div>
          </span>
          <yd-input v-model="form.invitationCode" slot="right" :max="20" placeholder="请输入邀请码" :show-success-icon="false"></yd-input>
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group v-show="gysActive">
        <yd-cell-item arrow>
          <span slot="left">
            <div class="lable">
              <strong>渠道</strong>
            </div>
          </span>
          <select slot="right" v-model="form.channelCode">
            <option :value="d.code" v-for="d in ChannelList">{{d.name}}</option>
          </select>
        </yd-cell-item>
      </yd-cell-group>
      <div class="flex flex-x-center" style="padding: 0 0.24rem;">
        <div @click="save" class="loginbtn flex flex-y-center flex-x-center">
          <span>立即注册</span>
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
      cgsActive: false,
      gysActive: false,
      showGetCodeBtn: true,
      mesCodeTime: 180,
      timer1: null,
      form: {
        name: "",
        telephone: "",
        key: "",
        password: "",
        channelCode: "",
        invitationCode: "",
        loginName: "",
        mseCode: "",
        codeId: ""
      },
      repassword: "",
      ChannelList: []
    };
  },
  created() {
    this.$store.dispatch("changeNavBarTitle", "注册");
    // this.getChannelList();
  },
  methods: {
    /**
     * 获取渠道
     */
    getChannelList() {
      this.postRequest("channel/list", {
        level: 1
      }).then(d => {
        if (d.data && d.data.state == 0) {
          if (d.data.aaData) {
            this.ChannelList = d.data.aaData;
          }
        }
      });
    },
    /**
     * 保存
     */
    save() {
      let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/;

      if (this.form.telephone == "") {
        this.$dialog.alert({
          mes: "请填写手机号码"
        });
        return;
      }
      if (this.form.mseCode == "") {
        this.$dialog.alert({
          mes: "请输入验证码"
        });
        return;
      }
      if (this.form.name == "") {
        this.$dialog.alert({
          mes: "请填写用户昵称"
        });
        return;
      }
      if (this.form.password == "") {
        this.$dialog.alert({
          mes: "请填写密码"
        });
        return;
      } else if (!reg.test(this.form.password)) {
        this.$dialog.alert({
          mes:
            "密码长度应为6-16位, 数字, 字母, 字符至少包含两种, 同时不能包含中文和空格"
        });
        return;
      }
      if (this.form.repassword == "") {
        this.$dialog.alert({
          mes: "请确认密码"
        });
        return;
      }
      if (this.repassword != this.form.password) {
        this.$dialog.alert({
          mes: "两次密码不一致"
        });
        return;
      }
      if (this.invitationCode == "") {
        this.$dialog.alert({
          mes: "请输入邀请码"
        });
        return;
      }
      // 验证短信验证码

      this.postRequest("/reg/auth/smscodecheck", {
        smsCode: this.form.mseCode,
        codeId: this.form.codeId
      }).then(d => {
        if (d.data && d.data.state == 0) {
          this.showGetCodeBtn = true;
          clearInterval(this.timer1);
          // 保存
          this.postRequest("customer/customerRegist", {
            name: this.form.name,
            telephone: this.form.telephone,
            key: "buyer",
            invitationCode: this.form.invitationCode,
            password: this.form.password
          }).then(d => {
            if (d.data && d.data.state == 0) {
              this.$dialog.toast({
                mes: "保存成功",
                timeout: 1200,
                icon: "success",
                callback: function() {
                  this.$router.go(-1);
                }.bind(this)
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    /**
     * 获取短信验证码模板
     */
    getSmstemplate() {
      return new Promise((resolve, reject) => {
        this.postRequest("smstemplate/list?smsType=2", {}).then(d => {
          if (d.data && d.data.state == 0) {
            if (d.data.aaData.length > 0) {
              resolve(d.data.aaData[0].comment);
            }
          } else {
            resolve(d.data);
          }
        });
      });
    },
    /**
     * 获取短信验证码
     */
    getSmsCode(temp) {
      this.postRequest("/reg/auth/smscode", {
        phone: this.form.telephone,
        temp: temp
      }).then(d => {
        if (d.data && d.data.state == 0) {
          this.$dialog.alert({
            mes: "发送成功！请注意查看手机短信。"
          });
          this.showGetCodeBtn = false;
          this.form.codeId = d.data.aaData.codeId;
          this.timer1 = setInterval(() => {
            this.mesCodeTime--;
            if (this.mesCodeTime == 0) {
              clearInterval(this.timer1);
              this.showGetCodeBtn = true;
            }
          }, 1000);
        }
      });
    },
    /**
     * 发送短信验证码
     */
    sendMesCode() {
      if (this.form.telephone == "") {
        this.$dialog.alert({
          mes: "请输入手机号码！"
        });
        return false;
      }
      // 验证手机号码是否注册
      this.postRequest("customer/telephoneMatche", {
        telephone: this.form.telephone
      }).then(async d => {
        if (d.data && d.data.state == 1) {
          let temp = await this.getSmstemplate();
          this.getSmsCode(temp);
        } else {
          this.$dialog.alert({
            mes: `${d.data.msg}!`
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
#UserReg {
  .yd-cell-item:not(:last-child):after,
  .yd-cell:after {
    border: 0.01rem solid #e4e4e4;
    background-image: none;
  }
  .getcodebtn {
    width: 3rem;
    line-height: 0.66rem;
    background: #6fb138;
    text-align: center;
    color: #fff;
  }
  select {
    color: #333;
    padding-left: 5px;
  }
  .lable {
    width: 1.8rem;
    font-size: 0.3rem;
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
  .sfbtns {
    padding: 0.1rem 0 0.2rem;
    .yd-radio {
      display: block;
    }
    .yd-radio-icon {
      color: #6fb138 !important;
    }
    span.text {
      font-size: 0.28rem;
    }
  }
  .sfbtn {
    border: 1px solid #c6c6c6;
    padding: 3px 10px;
    border-radius: 3px;
    margin-right: 5px;
  }
  .sfbtn.active {
    border: 1px solid #6fb138;
    background: #6fb138;
    color: #fff;
  }
}
</style>
