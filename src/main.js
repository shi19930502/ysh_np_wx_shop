import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import { getRequest } from './utils/api'
import { postRequest } from './utils/api'
import { deleteRequest } from './utils/api'
import { putRequest } from './utils/api'

import ydui from 'vue-ydui';
/***/
import { Loading } from 'vue-ydui/dist/lib.rem/dialog'
import 'vue-ydui/dist/ydui.rem.css'
/**重写样式表*/
import './assets/css/flex.css'
import './assets/css/overwrite.scss'
/**处理js计算精度*/
import './utils/mathfix.js'

import { Stepper } from 'vant';
import configs from './configs.js'

Vue.use(ydui);
Vue.use(Stepper);

Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;

router.beforeEach((route, redirect, next) => {
	
	// 设置页面title
  Loading.open();

	// 原来的路由跳转控制
	if (route.name == 'Login') {
		next();
		return;
	}
	if(route.name != 'UserReg'){
		// 微信推送openid直接进入订单详情
		if (store.state.userInfo.name == '未登录' && route.name != 'OrderDetails' && configs.cityName != 'beihuan') {
			next({ path: '/Login' })
		} else {
			next();
		}
	} else {
		next();
	}
  // next();
});

// 解决Error: Loading chunk 33 failed.路由不跳转
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});

router.afterEach(route => {
	if(document.getElementsByClassName('yd-dialog-white-mask')[0]){
		document.getElementsByClassName('yd-dialog-white-mask')[0].remove()
	}
	if(Loading){
		Loading.close();
	}
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
