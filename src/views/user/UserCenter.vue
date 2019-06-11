<template>
	<yd-layout>
		<div id="UserCenter">
			<yd-cell-group>
				<yd-cell-item type="link" href="#" style="height:1.2rem">
					<span slot="left">头像</span>
					<span slot="right">
          <img src="../../assets/imgs/mine_icon_toux.png" style="height: 0.9rem; width: 0.9rem;">
        </span>
				</yd-cell-item>
				<yd-cell-item arrow type="link" href="#">
					<span slot="left">客户名称</span>
					<span slot="right">团体采购单位</span>
				</yd-cell-item>
				<yd-cell-item arrow type="link" href="#">
					<span slot="left">证件号码</span>
					<span slot="right">180****5688</span>
				</yd-cell-item>
				<yd-cell-item arrow type="a">
					<span slot="left">地址</span>
					<span slot="right">男</span>
				</yd-cell-item>
			</yd-cell-group>
			<yd-popup v-model="show1" position="bottom" height="100%">
				<div style="background-color:#fff;">
					<div style="border-bottom: 1px solid #d9d9d9;padding: 0.2rem" class="flex flex-x-end">
						<yd-icon name="error" @click.native="show1=false" size="0.5rem"></yd-icon>
					</div>
					<yd-cell-group>
						<yd-cell-item>
							<span slot="left">原密码：</span>
							<yd-input slot="right" type="password" required v-model="oldPassword" max="20" placeholder="请输入旧密码"></yd-input>
						</yd-cell-item>
						<yd-cell-item>
							<span slot="left">新密码：</span>
							<yd-input slot="right" type="password" required v-model="newPassword" placeholder="请输入新密码"></yd-input>
						</yd-cell-item>
						<yd-cell-item>
							<span slot="left">确认密码：</span>
							<yd-input slot="right" type="password" required v-model="newPassword2" placeholder="请再次输入新密码"></yd-input>
						</yd-cell-item>
					</yd-cell-group>
					<yd-button size="large" type="primary" @click.native="updateMyPassword">确认修改</yd-button>
				</div>
			</yd-popup>

			<!--  <yd-cell-group>
      
      <yd-cell-item arrow type="link" href="#">
        <span slot="left">联系电话</span>
        <span slot="right">成都市</span>
      </yd-cell-item>
    </yd-cell-group> -->
			<!--  <yd-cell-group>
      <yd-cell-item arrow type="link" href="#">
        <span slot="left">邀请码</span>
        <span slot="right"></span>
      </yd-cell-item>
    </yd-cell-group> -->
		</div>
	</yd-layout>
</template>
<script>
	export default {
		data() {
			return {
				show1: false
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '个人中心')
		},
		mounted() {

		},
		methods: {

		}
	};
</script>
<style lang="scss">
	#UserCenter {
		.yd-cell-arrow:after {
			font-size: 0.25rem;
			margin-left: 0.1rem;
		}
	}
</style>