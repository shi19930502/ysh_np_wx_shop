<template>
	<div id="selectDateTime">
		<div class="popup-top flex flex-x-between">
			<span></span>
			<strong>送达时间</strong>
			<span @click="resultstr">确定</span>
			<!-- <yd-icon name="error-outline" size="0.3rem" @click.native="showDate = false"></yd-icon> -->
		</div>
		<yd-scrolltab>
			<div class="popup-content flex">
				<div class="left">
					<ul>
						<template v-for="d,index in datearr">
							<li @click="leftclick(index)" ref="left" :class="index == 0 ? 'active' : ''">
								<div class="tac">
									<p>{{d.date}}</p>
								</div>
							</li>
						</template>
					</ul>
				</div>
				<div class="right">
					<ul>
						<template v-for="d,index in time">
							<li @click="rightclick(index)" ref="right" :class="index == 0 ? 'active' : ''">
								<div class="flex flex-x-between flex-y-center">
									<div>{{d}}</div>
									<img src="../../assets/imgs/peis_icon_right.png" style="height: 0.36rem; width: 0.36rem;">
								</div>
							</li>
						</template>
					</ul>
				</div>
			</div>
		</yd-scrolltab>
	</div>
</template>
<script>
	import mixin from '../../utils/mixin.js'
	export default {
		mixins: [mixin],
		props: {
			value:{
				default: ''
			},
			startTime: { // 配送开始时间
				default: 5
			},
			endTime: { // 配送结束时间
				default: 17
			},
			period: { // 控制配送天数
				default: 0
			},
			istody: {
				default: 0
			},
			callback: Function
		},
		data() {
			/**封装时间段数据*/
			let time = [];
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
				time.push(timeStr)
			}

			/**封装日期数据*/
			let startdate = -1
			let istody = this.istody
			if(istody == 0) {
				startdate = 0
			}
			let datearr = [];
			let period = this.period
			while(startdate < period) {
				startdate++;
				datearr.push(this.GetDateStr(startdate))
			}

			return {
				time: time,
				datearr: datearr,
				datestr: `${datearr[0].date}`,
				timestr: `${time[0]}`,
				result: ''
			}
		},
		methods: {
			rightclick(index) {
				for(var i in this.$refs.right) {
					this.$refs.right[i].removeAttribute('class')
				}
				this.$refs.right[index].setAttribute('class', 'active')
				this.timestr = this.time[index]
			},
			leftclick(index) {
				for(var i in this.$refs.left) {
					this.$refs.left[i].removeAttribute('class')
				}
				this.$refs.left[index].setAttribute('class', 'active')
				this.datestr = `${this.datearr[index].date}`
			},
			resultstr() {
				this.result = `${this.datestr} ${this.timestr}`
				this.callback && this.callback(`${this.datestr} ${this.timestr}`)
			}
		}
	}
</script>
<style lang="scss">
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