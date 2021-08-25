import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import 'github-markdown-css'
import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue';
Vue.use(Antd);
// import { Input,Icon,Affix,Empty,Space,BackTop,Notification } from 'ant-design-vue'
// Vue.use(Input).use(Icon).use(Affix).use(Empty).use(Space).use(BackTop).use(Notification)
Vue.prototype.$axios = axios
Vue.config.productionTip = false

axios.defaults.baseURL = '/api'
new Vue({
  render: h => h(App),
}).$mount('#app')
