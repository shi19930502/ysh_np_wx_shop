export default{
	data(){
		return {
			userInfo: JSON.parse(localStorage.getItem('userInfo')),
		}
	},
	created(){
		
	},
	mounted(){
		
	},
	methods:{
		quickQueryGrouplist(){
			return new Promise((resolve,reject)=>{
				this.postRequest('shippingcar/queryGrouplist', {
					buyerId: this.userInfo.typeCode,
				},false,false,"数据加载中").then(resp => {
					if(resp.data && resp.data.state == 0) {
						resolve(resp.data)
					}else{
						resolve(resp)
					}
				})
			})
		},
		ceshi(){
			console.log(3)
		}
	}
}
