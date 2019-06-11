import axios from 'axios'
import {
  Alert,
  Loading
} from 'vue-ydui/dist/lib.rem/dialog'
import configs from '../configs'
import router from '../router'

axios.interceptors.request.use(config => {
  return config;
}, err => {
  Alert({
    mes: '请求超时!'
  })
  return Promise.resolve(err);
})

axios.interceptors.response.use(data => {
  Loading.close()
  if (data.status && data.status == 200) {

    if (data.request.responseURL.indexOf('telephoneMatche') != -1) {
      // 判断手机号码是否被注册
    } else if(data.request.responseURL.indexOf('createOrder') != -1){
			// 搜索商品结算购物车的时候弹窗两次
		} else if(data.request.responseURL.indexOf('trade/shippingcar/create') != -1){
			// 创建多个商品加入购物车需要循环提示
    } else if(data.request.responseURL.indexOf('shippingcar/delete') != -1){
			// 创建订单删除购物车商品提示
    } else {
			if (data.data.state != 0) {
				Alert({
					mes: data.data.msg,
					callback: () => {
						if (data.data.state == 97) {
							router.push({
								name: 'Login'
							})
						} else {
							console.log(data.data.msg)
						}
					}
				})
			}
		}
  }
  return data;
}, err => {
  Loading.close()
  if (err.response) {
    if (err.response.status == 504 || err.response.status == 404) {
      Alert({
        mes: '服务器错误⊙﹏⊙∥'
      })
    } else if (err.response.status == 403) {
      Alert({
        mes: '权限不足,请联系管理员!'
      })
    } else {
      Alert({
        mes: '数据加载失败!'
      });
    }
    return Promise.resolve(err);
  } else {
    Alert({
      mes: '数据加载失败!'
    });
  }
})

export const postRequest = (url, params, isLogin, isUser, lodingMsg) => {
  let urlp;
  // 数据接口请求较慢的需要加上等待圈
  if(lodingMsg){
    Loading.open(lodingMsg)
  }
  // 处理请求的url
  if (isLogin) { //是否登录调用
    urlp = `${configs.loginAPI}${url}`
  } else {
    if (url.split('/').length > 2) {
      urlp = `${configs.api}${url}`
    } else {
      if (isUser) {
        urlp = `${configs.userAPI}${url}`
      } else {
        urlp = `${configs.rootAPI}${url}`
      }
    }
  }
  // 获取token
  let userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo) {
    params.token = userInfo.token
  }
  if(url.indexOf('/reg/auth/smscode') >=0 ){
		urlp = `${configs.ROOT_API}${url}`
		delete params.token
	}

  return axios({
    method: 'post',
    url: urlp,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: `${configs.api}${url}`
  });
}

export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${configs.rootAPI}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${configs.rootAPI}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${configs.rootAPI}${url}`
  });
}
