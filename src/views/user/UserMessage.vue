<template>
  <yd-layout>
    <div id="UserMessage">
      <template v-if="dataList.length>0">
        <yd-infinitescroll :callback="getUserMessage" ref="getUserMessageRef">
          <ul slot="list">
            <li v-for="d in dataList" @click="readyMsg(d)">
              <div class="flex flex-x-between flex-y-center">
                <div class="flex flex-item-6">
                  <div class="icon">
                    <img
                      src="../../assets/imgs/message_icon_laba.png"
                      style="width: 0.4rem;height: 0.4rem;"
                    >
                    <div class="dot" v-show="d.f_notice_status == 0"></div>
                  </div>
                  <h1>{{d.f_title}}</h1>
                </div>
                <p style="padding-left: 15px">{{d.f_published_date}}</p>
              </div>
              <div class="msg">{{d.f_comment}}</div>
              <div class="msg flex flex-x-end">发送人：{{d.f_created_person_name}}</div>
            </li>
          </ul>
          <span slot="doneTip">没有更多数据啦</span>
        </yd-infinitescroll>
      </template>

      <div v-else class="flex flex-x-center flex-y-center" style="height: 100%;">
        <div>
          <img src="../../assets/imgs/my_default_img.png">
          <p style="color: #999;" class="tac">还没有收到消息</p>
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
      pageNum: 1,
      pageSize: 8,
      dataList: [],
      dataCount: 0
    };
  },
  created() {
    this.$store.dispatch("changeNavBarTitle", "消息");
    this.getUserMessage();
  },
  mounted() {},
  methods: {
    // 获取消息列表
    getUserMessage() {
      this.postRequest("platformnoticeflow/queryMsgFileByPage", {
        customerId: this.userInfo.typeCode,
        userId: this.userInfo.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      },false,false,"消息加载中").then(d => {
        if (d.data && d.data.state == 0) {
          if (this.pageNum == 1) {
            this.dataList = d.data.aaData;
          } else {
            this.dataList = [...this.dataList, ...d.data.aaData];
          }

          if (this.dataList.length >= d.data.dataCount) {
            /* 所有数据加载完毕 */
            if (this.$refs.getUserMessageRef) {
              this.$refs.getUserMessageRef.$emit(
                "ydui.infinitescroll.loadedDone"
              );
            }
            return;
          }

          /* 单次请求数据完毕 */
          if (this.$refs.getUserMessageRef) {
            this.$refs.getUserMessageRef.$emit(
              "ydui.infinitescroll.finishLoad"
            );
          }
          this.pageNum++;
        }
      });
    },
    /**
     * 读取消息
     */
    readyMsg(d) {
      let mes = "";
      // mes = d.f_comment
      if (d.files.length > 0) {
        let filestr = "";
        for (let i of d.files) {
          filestr += `<a download href="${this.imgURL}${i.filePath}?${
            i.fileName
          }">${i.fileName}</a><br>`;
        }
        mes = `${d.f_comment}<p style="margin-top: .1rem">附件：</p>${filestr}`;
      } else {
        mes = d.f_comment;
      }
      this.$dialog.confirm({
        title: d.f_title,
        mes: mes,
        opts: [
          {
            txt: "已读",
            color: true,
            callback: () => {
              if (d.f_notice_status == 0) {
                // 更新消息已读状态
                this.postRequest("platformnoticeflow/update", {
                  id: d.f_id,
                  noticeStatus: 1
                }).then(res => {
                  if (res.data && res.data.state == 0) {
                    d.f_notice_status = 1;
                  }
                });
              }
            }
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss">
.yd-scrollview:after {
  display: none !important;
}
#UserMessage {
  height: 100%;
  li {
    margin-bottom: 0.25rem;
    background: #fff;
    padding: 0.25rem;
    h1 {
      font-size: 0.3rem;
    }
    .icon {
      margin-right: 0.2rem;
      position: relative;
      .dot {
        width: 0.16rem;
        height: 0.16rem;
        background: #ff3d15;
        border-radius: 0.08rem;
        position: absolute;
        top: -0.05rem;
        right: -0.05rem;
      }
    }
    p {
      color: #989e92;
    }
    .msg {
      word-wrap: break-word;
      margin-top: 0.1rem;
      padding-left: 0.66rem;
      color: #989e92;
    }
  }
  li:last-child {
    margin-bottom: 0;
  }
}
</style>