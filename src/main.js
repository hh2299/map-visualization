import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.less';
import App from './App.vue'
import router from './router'
import store from './store'

// import echarts from 'echarts';
import * as echarts from 'echarts'; // 如果安装的是echarts 5以上版本，则需此种方式引入

const setHtmlFontSize = () => {
  const htmlDom = document.getElementsByTagName('html')[0];
  let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
  let htmlHeight = document.documentElement.clientHeight || document.body.clientHeight;
  store.state.deviceMode = (htmlWidth > htmlHeight) ? 1 : 0;
  // if (htmlWidth >= 1920) {
  //   htmlWidth = 1920;
  // }
  // if (htmlWidth <= 320) {
  //   htmlWidth = 320;
  // }

  // htmlDom.style.fontSize = `${htmlWidth / 19.2}px`;
}
// const setDeviceMode = () => {
//   const htmlDom = document.getElementsByTagName('html')[0];
//   let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
//   let htmlHeight = document.documentElement.clientHeight || document.body.clientHeight;
//   if (htmlWidth >= htmlHeight) {
//
//   }
//
// }

window.onresize = setHtmlFontSize;
setHtmlFontSize();




Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

