import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$http = axios.create({
    baseURL: '/api',
})

Vue.prototype.$http.interceptors.response.use(response => {
  return response
}, ({response: {data: error}}) => {
  store.dispatch('showError', {error})
  return Promise.reject(error);
});

new Vue({
  // router,
  store,
  render: h => h(App)
}).$mount('#app')
