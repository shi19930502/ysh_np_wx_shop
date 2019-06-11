<template>
	<yd-layout>
		<div id="UserReg">
			<yd-cell-group>
				<yd-cell-item>
					<span slot="left">
						<div class="lable">
							<strong>用户昵称</strong>
						</div>
					</span>
					<yd-input v-model="form.name" slot="right" max="20" placeholder="请输入昵称"></yd-input>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">
						<div class="lable">
							<strong>身份</strong>
						</div>
					</span>
					<span slot="left">
						<div class="sfbtns">
							<yd-radio-group v-model="form.customerProperty" size="16">
								<yd-radio val="001">
									<span class="text">一批</span>
								</yd-radio>
								<yd-radio val="002">
									<span class="text">二批</span>
								</yd-radio>
								<yd-radio val="003">
									<span class="text">餐饮店/团体单位</span>
								</yd-radio>
								<yd-radio val="004">
									<span class="text">门店</span>
								</yd-radio>
								<yd-radio val="005">
									<span class="text">个人</span>
								</yd-radio>
							</yd-radio-group>
						</div>
					</span>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">
						<div class="lable">
							<strong>手机号码</strong>
						</div>
					</span>
					<yd-input v-model="form.telephone" slot="right" max="20" placeholder="请输入联系电话"></yd-input>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">
						<div class="lable">
							<strong>密码</strong>
						</div>
					</span>
					<yd-input v-model="form.password" type="password" slot="right" max="20" placeholder="请输入密码"></yd-input>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">
						<div class="lable">
							<strong>确认密码</strong>
						</div>
					</span>
					<yd-input v-model="repassword" type="password" slot="right" max="20" placeholder="请确认密码"></yd-input>
				</yd-cell-item>
			</yd-cell-group>
			<!--完善资料 -->
			<template v-if="form.customerProperty != ''">

				<yd-cell-group title="完善资料">
					<yd-cell-item v-if="form.customerProperty !='005'">
						<span slot="left">
							<div class="lable">
								<strong style="font-size: 0.24rem;">营业执照号码</strong>
							</div>
						</span>
						<yd-input v-model="form.regId" slot="right" max="20" placeholder="请输入营业执照号码"></yd-input>
					</yd-cell-item>
					<yd-cell-item v-if="form.customerProperty !='005'">
						<span slot="left">
							<div class="lable">
								<strong style="font-size: 0.24rem;"></strong>
							</div>
						</span>
						<el-upload slot="left" :action="uploadURL+'/imgUpload'" :on-error="uploadError" :show-file-list="false" :data="uploadData"
						 :on-success="businessLicensePicSuccess" :before-upload="beforeAvatarUpload" :file-list="fileList">
							<yd-button type="primary" bgcolor="#6FB138" color="#fff">上传营业执照</yd-button>
						</el-upload>
					</yd-cell-item>
					<div class="uploadimgPre" v-if="businessLicensePic && form.customerProperty !='005'">
						<img :src="businessLicensePic" alt="">
					</div>
					<yd-cell-item v-if="form.customerProperty !='005'">
						<span slot="left">
							<div class="lable">
								<strong style="font-size: 0.24rem;">法人名称</strong>
							</div>
						</span>
						<yd-input v-model="form.legalpepresent" slot="right" max="20" placeholder="请输入法人名称"></yd-input>
					</yd-cell-item>
					<yd-cell-item v-if="form.customerProperty !='005'">
						<span slot="left">
							<div class="lable">
								<strong style="font-size: 0.24rem;"></strong>
							</div>
						</span>
						<el-upload slot="left" :action="uploadURL+'/imgUpload'" :on-error="uploadError" :show-file-list="false" :data="uploadData"
						 :on-success="legalpepresentPicSuccess" :before-upload="beforeAvatarUpload" :file-list="fileList">
							<yd-button type="primary" bgcolor="#6FB138" color="#fff">上传法人照片</yd-button>
						</el-upload>
					</yd-cell-item>
					<div class="uploadimgPre" v-if="legalpepresentPic && form.customerProperty !='005'">
						<img :src="legalpepresentPic" alt="">
					</div>
					<yd-cell-item v-if="form.customerProperty =='003'">
						<span slot="left">
							<div class="lable">
								<strong style="font-size: 0.24rem;">门头照片</strong>
							</div>
						</span>
						<el-upload slot="left" :action="uploadURL+'/imgUpload'" :on-error="uploadError" :show-file-list="false" :data="uploadData"
						 :on-success="storePicSuccess" :before-upload="beforeAvatarUpload" :file-list="fileList">
							<yd-button type="primary" bgcolor="#6FB138" color="#fff">上传门头照片</yd-button>
						</el-upload>
					</yd-cell-item>
					<div class="uploadimgPre" v-if="storePic && form.customerProperty =='003'">
						<img :src="storePic" alt="">
					</div>
					<!-- 门店个人用户需要地图选择位置 -->
					<yd-cell-item arrow v-if="form.customerProperty =='004' || form.customerProperty =='005'">
						<span slot="left">
							<div class="lable">
								<strong style="font-size: 0.24rem;">地址</strong>
							</div>
						</span>
						<span slot="right" @click="openMapWX" v-if="form.address">{{form.address}}</span>
						<span slot="right" @click="openMapWX" v-else>地图选择位置</span>
					</yd-cell-item>
					<!-- 非门店个人用户不用地图选择位置 -->
					<yd-cell-item v-else>
						<span slot="left">
							<div class="lable">
								<strong style="font-size: 0.24rem;">地址</strong>
							</div>
						</span>
						<yd-input v-model="form.address" type="text" slot="right" max="20" placeholder="请填写地址"></yd-input>
					</yd-cell-item>
				</yd-cell-group>
			</template>

			<div class="flex flex-x-center" style="padding: 0 0.24rem;">
				<div @click="save" class="loginbtn flex flex-y-center flex-x-center">
					<span>注册</span>
				</div>
			</div>
		</div>
	</yd-layout>
</template>
<script>
	import mixin from '../../utils/mixin.js'
	import 'element-ui/lib/theme-chalk/index.css';
	import {
		Upload
	} from 'element-ui';
	export default {
		mixins: [mixin],
		components: {
			[Upload.name]: Upload,
		},
		data() {
			return {
				cgsActive: false,
				gysActive: false,
				businessLicensePic: '',
				legalpepresentPic: '',
				storePic: '',
				form: {
					name: '',
					telephone: '',
					password: '',
					// 五类客户类型
					customerProperty: '',
					// 完善资料字段
					regId: '', //营业执照号码
					businessLicensePic: '', //执照照片
					legalpepresent: '', //法人
					legalpepresentPic: '', //法人照片
					storePic: '', //门头照片
					address: '',
				},
				fileList: [],
				uploadData: {
					savePath: 'registerNewtwo'
				},
				repassword: '',
				ChannelList: [],
				userTypeList: [{
					name: '一批',
					value: '001',
					isActive: false
				}, {
					name: '二批',
					value: '002',
					isActive: false
				}, {
					name: '餐饮店/团体单位',
					value: '003',
					isActive: false
				}, {
					name: '门店',
					value: '004',
					isActive: false
				}, {
					name: '个人',
					value: '005',
					isActive: false
				}]
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '注册')
			// 获取用户已经填写的个人信息
			if (sessionStorage.getItem('jz_saveInputInfo')) {
				this.form = JSON.parse(sessionStorage.getItem('jz_saveInputInfo'))
			}
			// 获取用户选择的地址
			if (sessionStorage.getItem('getAddr')) {
				var getAddrByMap = JSON.parse(sessionStorage.getItem('getAddr'))
				this.userSelectAddressInfo = getAddrByMap
				this.selectedAddressStr =
					`${getAddrByMap.pname}${getAddrByMap.cityname}${getAddrByMap.adname}${getAddrByMap.address}`
				if (this.form.customerProperty == '004' || this.form.customerProperty == '005') {
					this.form.address = this.selectedAddressStr
				}
			}
		},
		methods: {
			/**
			 * 上传执照图片成功回调
			 */
			businessLicensePicSuccess(res, file) {
				this.$dialog.loading.close()
				if (res.state == 0 && res.aaData) {
					this.businessLicensePic = URL.createObjectURL(file.raw);
					this.form.businessLicensePic = res.aaData.path
				}
			},
			/**
			 * 上传法人成功回调
			 */
			legalpepresentPicSuccess(res, file) {
				this.$dialog.loading.close()
				if (res.state == 0 && res.aaData) {
					this.legalpepresentPic = URL.createObjectURL(file.raw);
					this.form.legalpepresentPic = res.aaData.path
				}
			},
			/**
			 * 上传men点图成功回调
			 */
			storePicSuccess(res, file) {
				this.$dialog.loading.close()
				if (res.state == 0 && res.aaData) {
					this.storePic = URL.createObjectURL(file.raw);
					this.form.storePic = res.aaData.path
				}
			},
			/**
			 * 上传图片之前的操作
			 */
			beforeAvatarUpload(file) {
				this.$dialog.loading.open("图片上传中请稍后...")
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
			},
			/**
			 * 获取渠道
			 */
			getChannelList() {
				this.postRequest('channel/list', {
					level: 1
				}).then(d => {
					if (d.data && d.data.state == 0) {
						if (d.data.aaData) {
							this.ChannelList = d.data.aaData
						}
					}
				})
			},
			/**
			 * 保存
			 */
			async save() {
				if (this.form.name == '') {
					this.$dialog.alert({
						mes: '请填写用户昵称'
					});
					return
				}
				if (this.form.customerProperty == '') {
					this.$dialog.alert({
						mes: '请填选择身份'
					});
					return
				}
				if (this.form.telephone == '') {
					this.$dialog.alert({
						mes: '请填写联系电话'
					});
					return
				}
				if (this.form.password == '') {
					this.$dialog.alert({
						mes: '请填写密码'
					});
					return
				}
				if (this.form.repassword == '') {
					this.$dialog.alert({
						mes: '请确认密码'
					});
					return
				}
				if (this.repassword != this.form.password) {
					this.$dialog.alert({
						mes: '两次密码不一致'
					});
					return
				}
				if (this.form.address == '') {
					this.$dialog.alert({
						mes: '请填写地址'
					});
					return
				}
				console.log(this.form)

				// 保存
				let matcheResult = await this.telephoneMatche()
				if (matcheResult.state == 1) {
					// 如果是门店或个人必要通过地图选择位置获取经纬度
					if (this.form.customerProperty == '004' || this.form.customerProperty == '005') {
						this.regPost(true)
					} else {
						this.regPost()
					}
					// 									this.postRequest('customer/customerRegist', this.form).then(d => {
					// 										if (d.data && d.data.state == 0) {
					// 											this.$dialog.toast({
					// 												mes: '保存成功',
					// 												timeout: 1200,
					// 												icon: 'success',
					// 												callback: () => {
					// 													this.$router.go(-1)
					// 												}
					// 											});
					// 										}
					// 									})
				} else {
					this.$dialog.alert({
						mes: matcheResult.msg
					})
				}
			},
			/**
			 * 调用接口
			 * @param 是否个人门店注册 
			 */
			regPost(isgrOrMd) {
				this.form.isGetId = 1
				this.postRequest('customer/customerRegist', this.form).then(d => {
					if (d.data && d.data.state == 0) {
						// 门店个人注册需要添加地址信息
						if (isgrOrMd) {
							if (this.userSelectAddressInfo) {
								this.createUserAddress(d.data.aaData.id)
							}
						} else {
							this.$dialog.toast({
								mes: '保存成功',
								timeout: 1200,
								icon: 'success',
								callback: () => {
									if (this.form.customerProperty == '004' || this.form.customerProperty == '005') {
										this.$router.go(-2)
									} else {
										this.$router.go(-1)
									}
								}
							});
						}
					}
				})
			},
			/**
			 * 添加地址
			 */
			createUserAddress(customerId) {
				var url = 'address/create'
				var param = {
					provinceCode: this.userSelectAddressInfo.pcode,
					cityCode: this.userSelectAddressInfo.cityCode,
					districCode: this.userSelectAddressInfo.adcode,
					detailedAddress: this.form.address,
					contacts: this.form.name,
					phoneNumber: this.form.telephone,
					customerId: customerId,
					comment: '',
					latitude: this.userSelectAddressInfo.location.lat,
					longitude: this.userSelectAddressInfo.location.lng,
				}
				// 获取cityCode
				this.postRequest('comArea/list', {
					parentAreaCode: param.provinceCode,
					level: 2
				}).then(d => {
					if (d.data && d.data.state == 0) {
						for (let a = 0; a < d.data.aaData.length; a++) {
							if (d.data.aaData[a].areaName == this.userSelectAddressInfo.cityname) {
								param.cityCode = d.data.aaData[a].areaCode
								break
							}
						}
						// 调用新增地址接口
						this.postRequest(url, param).then(d => {
							if (d.data && d.data.state == 0) {
								this.$dialog.toast({
									mes: '保存成功',
									timeout: 1200,
									icon: 'success',
									callback: () => {
										if (this.form.customerProperty == '004' || this.form.customerProperty == '005') {
											this.$router.go(-2)
										} else {
											this.$router.go(-1)
										}
									}
								});
								sessionStorage.removeItem('jz_getAddrByMap')
								sessionStorage.removeItem('jz_saveInputInfo')
							}
						})
					}
				})
			},
			/**
			 * 选择采购商
			 */
			cgsClick() {
				this.form.key = 'buyer'
				this.cgsActive = true
				this.gysActive = false
			},
			/**
			 * 选择供应商商
			 */
			gysClick() {
				this.form.key = 'merchant'
				this.cgsActive = false
				this.gysActive = true
			},
			/**
			 * 验证手机号码
			 */
			telephoneMatche() {
				return new Promise((resolve, reject) => {
					this.postRequest('customer/telephoneMatche', {
						telephone: this.form.telephone
					}).then(d => {
						if (d.data) {
							resolve(d.data)
						}
					})
				})
			},
			/**
			 * 打开地图选地址
			 */
			openMapWX() {
				window.sessionStorage.setItem('jz_saveInputInfo', JSON.stringify(this.form))
				this.$router.push({
					name: 'selectAddr',
					query: {
						from: 'reg'
					}
				})
			},
			/**
			 * 上传失败
			 */
			uploadError() {
				this.$dialog.loading.close()
				this.$dialog.toast({
					mes: '上传失败',
					timeout: 1200,
					icon: 'error'
				});
			}
		}
	};
</script>
<style lang="scss">
	#UserReg {
		.uploadimgPre {
			width: 121px;
			height: 121px;
			border-radius: 3px;
			margin: 10px 10px 10px 2.04rem;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.yd-cell-item:not(:last-child):after,
		.yd-cell:after {
			border: 0.01rem solid #e4e4e4;
			background-image: none;
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
			background: #6FB138;
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
				color: #6FB138 !important;
			}

			span.text {
				font-size: 0.28rem;
			}
		}

		.sfbtn {
			border: 1px solid #C6C6C6;
			padding: 3px 10px;
			border-radius: 3px;
			margin-right: 5px;
		}

		.sfbtn.active {
			border: 1px solid #6FB138;
			background: #6FB138;
			color: #fff;
		}
	}
</style>
