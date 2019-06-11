<template>
	<yd-popup v-model="show" position="bottom" height="50%">
		<div id="selectDateTime" v-if="show">
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
								<li :class="d.isActive ? 'active' : ''" @click="changeLeftDate(d)">
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
								<li :class="d.isActive ? 'active' : ''" @click="changeRightTime(d)">
									<div class="flex flex-x-between flex-y-center">
										<div>{{d.value}}</div>
										<img src="../../assets/imgs/peis_icon_right.png" style="height: 0.36rem; width: 0.36rem;">
									</div>
								</li>
							</template>
						</ul>
					</div>
				</div>
			</yd-scrolltab>
		</div>
	</yd-popup>
</template>
<script>
	import mixin from '../../utils/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				value: '',
				dateArr: [],
				timeArr: [],
				show: false,
				currentDate: '',
				currentTime: ''
			}
		},
		methods: {
			render() {
				console.log("render")
				console.log(this.endTime)
				console.log(this.value)

				//				this.setValue()
			},
			init() {
				this.initLeftDate()
				this.initRightTime()
			},
			setValue() {
				let value = `${this.currentDate} ${this.currentTime}`;
				this.$emit('pickerConfirm', value);
				this.close();
			},
			/**
			 * 封装日期数据
			 */
			initLeftDate() {
				let startdate = -1
				let isTody = this.isTody
				let period = this.period

				if(isTody == 0) {
					startdate = 0
				}
				for(var i = startdate; i < period; i++) {
					let o = {
						value: this.GetDateStr(i).date
					}
					if(this.value.split(' ')[0] == this.GetDateStr(i).date) {
						o.isActive = true
					} else {
						o.isActive = false
					}
					this.dateArr.push(o)
				}
				this.currentDate = this.value.split(' ')[0]
			},
			changeLeftDate(d) {
				for(var i in this.dateArr) {
					this.dateArr[i].isActive = false
				}
				if(!d.isActive) {
					d.isActive = true
				}
				this.currentDate = d.value
			},
			changeRightTime(d) {
				for(var i in this.timeArr) {
					this.timeArr[i].isActive = false
				}
				if(!d.isActive) {
					d.isActive = true
				}
				this.currentTime = d.value
			},
			/**
			 * 封装时间段数据
			 */
			initRightTime() {

				let start = this.startTime

				while(start < this.endTime) {
					let timeStr;
					let toTime = start + 1
					let startStr;
					let toTimeStr;

					start < 10 ? startStr = `0${start}:00` : startStr = `${start}:00`
					toTime < 10 ? toTimeStr = `0${toTime}:00` : toTimeStr = `${toTime}:00`

					timeStr = `${startStr}~${toTimeStr}`
					start += 1;

					var o = {
						value: timeStr
					}
					if(timeStr == this.value.split(' ')[1]) {
						o.isActive = true
					} else {
						o.isActive = false
					}
					this.timeArr.push(o)
				}
				this.currentTime = this.value.split(' ')[1]
			},
			open() {
				this.show = true;
			},
			close() {
				this.show = false;
			}
		},
		created() {
			this.init();
		},
		mounted() {
			this.$nextTick(this.render());
		},
		beforeDestroy() {
			console.log("beforeDestroy")
		}
	}
</script>
<style lang="scss">
	.mask {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		position: fixed;
		top: 0;
		left: 0;
	}
	#selectDateTime {
		.popup-top {
			width: 100%;
			font-size: 0.3rem;
			background: #EFEFF3;
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
					background: #EFEFF3;
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
</style>