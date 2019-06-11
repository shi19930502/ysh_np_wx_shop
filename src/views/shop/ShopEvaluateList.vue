<template>
	<yd-layout>
		<div id="ShopEvaluateList">
			<section class="head flex flex-x-center flex-y-center">
				<div class="item tac">
					<div style="color: #FF0000;">{{totalScore}}</div>
					<div>综合评分</div>
				</div>
				<div class="item tac">
					<div>{{reviewList.length}}</div>
					<div>评论条数</div>
				</div>
			</section>
			<section class="content">
				<div class="item" v-for="d in reviewList">
					<div class="list flex flex-y-center">
						<div class="headimg">
							<img src="../../assets/imgs/mine_icon_toux@2x.png">
						</div>
						<div class="flex-item-5">
							<div class="flex flex-x-between">
								<strong style="font-size: 0.26rem;color: #2F3927;">{{d.reviewPersonName}}</strong>
								<span style="font-size: 0.22rem;color: #989E92;">{{d.reviewDate}}</span>
							</div>
							<div>
								<yd-rate readonly size="0.2rem" color="#E8E8E8" active-color="#FE971D" v-model="d.totalScore"></yd-rate>
							</div>
						</div>
					</div>
					<div class="ptext">{{d.reviewContent}}</div>
				</div>
			</section>
		</div>
	</yd-layout>
</template>
<script>
	export default {
		data() {
			return {
				storeId: '',
				reviewList: [],
				totalScore: 0
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '店铺评价详情')
			this.storeId = this.$route.query.storeId
			this.queryReviewlistByStore()
		},
		mounted() {

		},
		methods: {
			queryReviewlistByStore() {
				this.postRequest('store/queryReviewlistByStore', {
					id: this.storeId
				},false,false,"数据加载中").then(d => {
					if(d && d.data.state == 0) {
						if(d.data.aaData && d.data.aaData.length > 0) {
							var totalScore = 0
							for(var item of d.data.aaData) {
								totalScore += item.totalScore / 20
								item.totalScore = Math.round(item.totalScore / 20)
								item.reviewPersonName = `${item.reviewPersonName.slice(0,1)}******${item.reviewPersonName.slice(item.reviewPersonName.length-1,item.reviewPersonName.length)}`
							}
							this.totalScore = Math.round(totalScore / d.data.aaData.length)
							this.reviewList = d.data.aaData
						}
					}
				})
			}
		}
	};
</script>
<style lang="scss">
	#ShopEvaluateList {
		.head {
			height: 1.4rem;
			background: #fff;
			.item {
				width: 50%;
				div:nth-child(1) {
					font-size: 0.5rem;
					color: #2F3927;
					font-weight: 600;
				}
				div:nth-child(2) {
					font-size: 0.2rem;
					color: #797D77;
					margin-top: 0.1rem;
				}
			}
		}
		.content {
			margin-top: 0.25rem;
			.headimg {
				margin-right: 0.2rem;
				width: 0.64rem;
				height: 0.64rem;
				border-radius: 0.32rem;
				overflow: hidden;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.item {
				background: #fff;
				padding: 0 0.24rem;
				border-bottom: 1px solid #ddd;
				.list {
					height: 1.2rem;
				}
				.ptext {
					font-size: 0.26rem;
					color: #2F3927;
					padding-left: 0.84rem;
					padding-bottom: 0.28rem;
					word-wrap: break-word;
				}
			}
		}
	}
</style>