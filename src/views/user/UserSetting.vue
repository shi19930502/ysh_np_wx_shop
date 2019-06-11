<template>
  <yd-layout>
    <div id="UserSetting">
      <yd-cell-group>
        <yd-cell-item arrow @click.native="show1=true">
          <span slot="left">修改密码</span>
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group>
        <yd-cell-item arrow type="link" href="#">
          <span slot="left">意见反馈</span>
        </yd-cell-item>
        <yd-cell-item arrow type="link" href="#">
          <span slot="left">关于</span>
        </yd-cell-item>
      </yd-cell-group>
      <yd-button @click.native="logOut" size="large" type="hollow">切换账号</yd-button>
      <yd-button @click.native="logOut" size="large" type="hollow">退出登录</yd-button>
      <yd-popup v-model="show1" position="bottom" height="100%">
        <div class="popup">
          <div class="popup-title flex flex-x-end flex-y-center">
            <!--<strong>修改密码</strong>-->
            <yd-icon name="error" @click.native="show1=false" size="0.45rem"></yd-icon>
          </div>
          <yd-cell-group>
            <yd-cell-item>
              <span slot="left">
                <div class="lable">
                  <strong>原密码</strong>
                </div>
              </span>
              <yd-input
                slot="right"
                type="password"
                v-model="oldPassword"
                max="20"
                :show-success-icon="false"
                placeholder="请输入旧密码"
              ></yd-input>
            </yd-cell-item>

            <yd-cell-item>
              <span slot="left">
                <div class="lable">
                  <strong>新密码</strong>
                </div>
              </span>
              <yd-input
                slot="right"
                type="password"
                v-model="newPassword"
                placeholder="请输入新密码"
                :show-success-icon="false"
              ></yd-input>
            </yd-cell-item>

            <yd-cell-item>
              <span slot="left">
                <div class="lable">
                  <strong>确认密码</strong>
                </div>
              </span>
              <yd-input
                slot="right"
                type="password"
                v-model="newPassword2"
                placeholder="请再次输入新密码"
                :show-success-icon="false"
              ></yd-input>
            </yd-cell-item>
          </yd-cell-group>
        </div>
        <div class="flex flex-x-center" style="padding: 0 0.24rem;">
          <div @click="updateMyPassword" class="loginbtn flex flex-y-center flex-x-center">
            <span>确认修改</span>
          </div>
        </div>
      </yd-popup>
    </div>
  </yd-layout>
</template>
<script>
import mixin from "../../utils/mixin.js";
export default {
  mixins: [mixin],
  data() {
    return {
      show1: false,
      oldPassword: "",
      newPassword: "",
      newPassword2: ""
    };
  },
  created() {
    this.$store.dispatch("changeNavBarTitle", "设置");
  },
  methods: {
    /**
     * 修改密码
     */
    updateMyPassword() {
      let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/;
      var o = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        newPassword2: this.newPassword2
      };

      if (o.oldPassword == "") {
        this.$dialog.alert({
          mes: "请输入旧密码"
        });
        return false;
      }

      if (o.newPassword == "") {
        this.$dialog.alert({
          mes: "请输入新密码"
        });
        return false;
      } else if (!reg.test(o.newPassword)) {
        this.$dialog.alert({
          mes:
            "密码长度应为6-16位, 数字, 字母, 字符至少包含两种, 同时不能包含中文和空格"
        });
        return;
      }

      if (o.newPassword2 == "") {
        this.$dialog.alert({
          mes: "请再次输入新密码"
        });
        return false;
      }
      if (o.newPassword2 != o.newPassword) {
        this.$dialog.alert({
          mes: "两次输入密码不一致"
        });
        return false;
      }

      this.postRequest(
        "user/updateMyPassword",
        {
          oldPassword: o.oldPassword,
          newPassword: o.newPassword
        },
        false,
        true
      ).then(resp => {
        if (resp.data && resp.data.state == 0) {
          this.$dialog.toast({
            mes: "修改成功",
            timeout: 1200,
            icon: "success",
            callback: function() {
              this.logOut();
              this.show1 = false;
            }.bind(this)
          });
        } 
      });
    },
    /**
     * 退出登录
     */
    logOut() {
      localStorage.removeItem("userInfo");
      // 退出删除绑定的微信openId
      this.postRequest(
        "user/updateMyDetail",
        {
          wxopenid: "",
          userId: this.userInfo.userId,
          token: this.userInfo.token
        },
        false,
        true
      ).then(res => {
        this.$router.push({
          name: "Login",
          redirect: {
            name: "Login"
          }
        });
      });
    }
  }
};
</script>
<style lang="scss">
#UserSetting {
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
  color: #2f3927;
  .yd-cell-arrow:after {
    margin-left: 0.1rem;
  }
  .yd-btn-hollow {
    border: none;
  }
}
</style>