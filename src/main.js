import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import toast from 'components/common/toast'
import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

// 安装Toast插件
Vue.use(toast)
// 安装vue-lazyload懒加载插件
Vue.use(VueLazyLoad, {
  loading: require('assets/img/common/placeholder.png')
})

// 解决移动端300ms延迟
FastClick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
