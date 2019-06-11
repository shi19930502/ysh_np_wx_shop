<template>
  <yd-layout>
    <div
      style="position: absolute;height: 100%;top: 0;width: 100%;color: #626262;text-align: center;padding-top:10.5rem;"
      class="flex flex-y-end flex-x-center version-wrap"
    >
      <div>
        <div>成都九洲电子信息系统股份有限公司</div>
        <div style="margin: 0.10rem 0;">版本号{{version}}</div>
      </div>
    </div>
    <div v-if="showLogin" :class="cityName=='beihuan'?'beihuan_login':'Login'">
      <div class="logo flex flex-x-center">
        <img v-show="cityName=='yantai'" src="../assets/imgs/logo_ysh@2x.png" alt>
        <img v-show="cityName=='yinchuan'" src="../assets/imgs/logo_ysh@2x.png" alt>
        <img v-show="cityName=='linyi'" src="../assets/imgs/linyi_logo.png" alt>
        <img
          v-show="cityName=='beihuan'"
          src="../assets/imgs/beihuan_logo.png"
          alt
          style="width: 2.61rem;height: 2.84rem;"
        >
      </div>

      <div class="form">
        <div class="flex form-group">
          <img
            v-if="cityName=='beihuan'"
            src="../assets/imgs/beihuan_login_icon_user@2x.png"
            alt
            class="pswicon"
          >
          <img v-else src="../assets/imgs/login_icon_user@2x.png" alt class="pswicon">

          <yd-input
            style="padding-left: 10px"
            type="text"
            v-model="username"
            :show-success-icon="false"
            max="20"
            placeholder="请输入注册手机号"
          ></yd-input>
        </div>
        <div class="flex form-group">
          <img
            v-if="cityName=='beihuan'"
            src="../assets/imgs/beihuan_login_icon_password@2x.png"
            alt
            class="pswicon"
          >
          <img v-else src="../assets/imgs/login_icon_password@2x.png" alt class="pswicon">

          <yd-input
            style="padding-left: 10px"
            type="password"
            :show-success-icon="false"
            v-model="password"
            max="20"
            placeholder="请输入密码"
          ></yd-input>
        </div>
        <div class="flex flex-x-between flex-y-center forget">
          <yd-checkbox size="14" v-model="isRemember" class="flex flex-y-center">
            <span>记住账号</span>
          </yd-checkbox>
          <!-- <span>忘记密码？</span> -->
        </div>
        <div class="flex flex-x-center">
          <div
            v-if="cityName=='beihuan'"
            @click="login"
            class="loginbtn flex flex-y-center flex-x-center"
            style="background:#018BE6"
          >
            <span>登录</span>
          </div>
          <div v-else @click="login" class="loginbtn flex flex-y-center flex-x-center">
            <span>登录</span>
          </div>
        </div>
      </div>
      <div class="reg">
        还没有账号？
        <span @click="reg">立即注册</span>
      </div>
    </div>
  </yd-layout>
</template>
<script>
import configs from "../configs";
export default {
  data() {
    return {
      cityName: configs.cityName,
      showLogin: false,
      openId: "",
      username: "",
      password: "",
      isRemember: true,
      reloadNum: 0,
      version: "V0.0.0.1"
    };
  },
  created() {
    // 检查是否有记住密码
    let up = JSON.parse(localStorage.getItem("up"));
    if (up) {
      this.username = up.u;
      this.password = up.p;
    }
    if (window.location.href.indexOf("?") >= 0) {
      var code = window.location.href.split("?")[1].split("&")[0];
      var o = {};
      o[code.split("=")[0]] = code.split("=")[1];
      // 获取openId
      this.postRequest("customer/wxAuthor", {
        code: o.code
      }).then(res => {
        if (res.data.state == 0 && res.data.aaData.openid) {
          // 获取openId登录
          this.openId = res.data.aaData.openid;
          this.postRequest(
            "",
            {
              openId: res.data.aaData.openid,
              systemId: 8,
              flag: 1,
              authCode: "",
              nac: "y"
            },
            true
          ).then(resp => {
            if (resp && resp.status == 200 && resp.data.state == 0) {
              if (resp.data && resp.data.state == 0) {
                let userInfo = resp.data.sessionUser;
                userInfo.token = resp.data.token;
                if (userInfo.typeId.indexOf("buyer") != -1) {
                  this.getUserType(userInfo.typeCode).then(d => {
                    userInfo.userType = d.extend;
                    this.$store.commit("login", userInfo);
                    this.$router.push({
                      name: "Home"
                    });
                  });
                } else {
                  this.showLogin = true;
                  this.$dialog.alert({
                    mes:
                      "你的微信绑定为供应商账号，请重新使用采购商账号登录绑定微信！"
                  });
                }
              }
            } else {
              this.showLogin = true;
            }
          });
        } else {
          this.showLogin = true;
        }
      });
    } else {
      this.showLogin = true;
    }

    // 测试绑定微信openId登录
    // this.testOpenIdLogin()
    this.getVersion();
  },
  mounted() {
    this.$store.dispatch("changeNavBarTitle", "登录");
    // 关闭会话超时后loading圈
    if (document.getElementsByClassName("yd-dialog-white-mask")[0]) {
      document.getElementsByClassName("yd-dialog-white-mask")[0].remove();
    }
  },
  methods: {
    /**
     * 获取版本号
     */
    getVersion() {
      this.postRequest("datadic/list", {
        ket: "01",
        dataType: "SYSTEM_VERSION"
      }).then(d => {
        if (d.data && d.data.state == 0 && d.data.aaData.length > 0) {
          this.version = d.data.aaData[0].value;
        }
      });
    },
    /**
     * 测试绑定微信openId登录
     */
    testOpenIdLogin() {
      this.postRequest(
        "",
        {
          openId: "oS3kmt1QwJKK9709L4HCKtwOfazg",
          systemId: 8,
          flag: 1,
          authCode: "",
          nac: "y"
        },
        true
      ).then(resp => {
        if (resp && resp.status == 200 && resp.data.state == 0) {
          if (resp.data && resp.data.state == 0) {
            let userInfo = resp.data.sessionUser;
            userInfo.token = resp.data.token;
            if (userInfo.typeId.indexOf("buyer") != -1) {
              this.getUserType(userInfo.typeCode).then(d => {
                userInfo.userType = d.extend;
                this.$store.commit("login", userInfo);
                this.$router.push({
                  name: "Home"
                });
              });
            } else {
              this.showLogin = true;
              this.$dialog.alert({
                mes:
                  "你的微信绑定为供应商账号，请重新使用采购商账号登录绑定微信！"
              });
            }
          }
        } else {
          this.showLogin = true;
        }
      });
    },
    /**
     * 注册
     */
    reg() {
      let name = "UserReg";
      if (configs.isBeiHuan) {
        name = "NorthUserReg";
      }
      this.$router.push({
        name: name
      });
    },
    /**
     * 记住账号
     */
    rememberUser(u) {
      if (this.isRemember) {
        let o = {
          u: u
        };
        localStorage.setItem("up", JSON.stringify(o));
      } else {
        if (localStorage.getItem("up")) {
          localStorage.removeItem("up");
        }
      }
    },
    getUserType(userId) {
      return new Promise((resolve, reject) => {
        this.postRequest("customer/queryById", {
          id: userId
        }).then(resp => {
          if (resp.data && resp.data.state == 0) {
            if (resp.data.aaData) {
              resolve(resp.data.aaData);
            } else {
              resolve(resp.data.msg);
            }
          }
        });
      });
    },
    /**
     * 登录
     */
    login() {
      if (this.username == "") {
        this.$dialog.alert({
          mes: "请输入注册手机号"
        });
        return false;
      }
      if (this.password == "" || this.password == undefined) {
        this.$dialog.alert({
          mes: "请输入密码"
        });
        return false;
      }

      this.postRequest(
        "",
        {
          loginName: this.username,
          password: this.password,
          systemId: 8,
          flag: 1,
          authCode: "",
          nac: "y"
        },
        true,
        false,
        "登录中，请稍后"
      ).then(resp => {
        if (resp && resp.status == 200) {
          if (resp.data && resp.data.state == 0) {
            let userInfo = resp.data.sessionUser;
            userInfo.token = resp.data.token;
            if (userInfo.typeId.indexOf("buyer") != -1) {
              this.getUserType(userInfo.typeCode).then(d => {
                userInfo.userType = d.extend;
                this.$store.commit("login", userInfo);
                this.rememberUser(this.username);
                // 测试用
                // this.openId = 'oS3kmt1QwJKK9709L4HCKtwOfazg'
                if (this.openId) {
                  this.postRequest(
                    "user/updateMyDetail",
                    {
                      wxopenid: this.openId,
                      userId: resp.data.sessionUser.userId,
                      token: resp.data.token
                    },
                    false,
                    true
                  ).then(res => {
                    this.$router.push({
                      name: "Home"
                    });
                  });
                } else {
                  this.$router.push({
                    name: "Home"
                  });
                }
              });
            } else {
              this.$dialog.alert({
                mes: "该账号注册为供应商账号，请使用采购商账号登录！"
              });
            }
          }
        }
      });
    }
  }
};
</script>
<style lang="scss">
.yd-scrollview:after {
  height: 0;
}
.version-wrap {
  background: url(../assets/imgs/bg@2x.png);
  background-size: 100% 100%;
}
.Login,
.beihuan_login {
  .yd-checkbox {
    input {
      position: absolute;
    }
  }
  input {
    font-family: "PingFang-SC-Medium";
    font-size: 0.28rem;
  }
  height: 100%;
  // background: url(../assets/imgs/bg@2x.png);
  // background-size: 100% 100%;
  position: absolute;
  top: 0;
  width: 100%;
  .logo {
    padding-top: 1.74rem;
    img {
      width: 4.78rem;
      height: 2.37rem;
    }
  }
  .form {
    width: 5.3rem;
    margin: 0 auto;
    padding-top: 1.2rem;
    .form-group {
      .yd-input {
        height: 0.46rem;
        font-size: 0.28rem;
      }
      border-bottom: 1px solid #c6c6c6;
      padding: 0.18rem 0;
      margin-bottom: 0.15rem;
      img.pswicon {
        width: 0.4rem;
        height: 0.46rem;
      }
    }
    .loginbtn {
      width: 100%;
      margin-top: 0.3rem;
      height: 0.78rem;
      background: #00a3ff;
      border-radius: 0.39rem;
      color: #fff;
      font-size: 0.31rem;
      text-align: center;
    }
  }
  .reg {
    padding-top: 0.5rem;
    width: 100%;
    text-align: center;
    span {
      color: #00a3ff;
    }
  }
  .forget {
    color: #626262;
    span {
      font-size: 0.26rem;
    }
  }
}
.beihuan_login {
  background: url(../assets/imgs/beihuan_bg.png);
  background-size: 100% 100%;
}
</style>
