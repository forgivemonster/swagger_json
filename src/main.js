import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import 'github-markdown-css'
// import 'ant-design-vue/dist/antd.css';
// import Antd from 'ant-design-vue';
// Vue.use(Antd);
import { Input,Icon,Affix,Empty } from 'ant-design-vue'
Vue.use(Input).use(Icon).use(Affix).use(Empty)
Vue.prototype.$axios = axios
Vue.config.productionTip = false

axios.defaults.baseURL = '/api'
new Vue({
  render: h => h(App),
}).$mount('#app')
