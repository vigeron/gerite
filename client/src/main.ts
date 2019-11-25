import Vue from 'vue';
import i18n from './i18n';
import App from './App.vue';
import store from './store';
import http from './plugins/axios';
import router from './router';
import vuetify from './plugins/vuetify';
import '@babel/polyfill';

Vue.config.productionTip = false;

Vue.prototype.$http = http;

new Vue({
  i18n,
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');
