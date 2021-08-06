import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import 'github-markdown-css'
Vue.prototype.$axios = axios
Vue.config.productionTip = false
axios.defaults.baseURL = '/api'
new Vue({
  render: h => h(App),
}).$mount('#app')
