import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import 'github-markdown-css'
import Button from 'ant-design-vue/lib/button';
import 'ant-design-vue/dist/antd.css';
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.component(Button.name, Button);
axios.defaults.baseURL = '/api'
new Vue({
  render: h => h(App),
}).$mount('#app')
