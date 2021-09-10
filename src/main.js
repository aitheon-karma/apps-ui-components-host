import Vue from 'vue';
import App from '@/App.vue';
import store from '@/store';
import router from '@/router';

import '@/directives';

// setting Vue globally is required for web-components work.
window.Vue = window.vue = Vue;

Vue.config.productionTip = false;
window.Vuejscharts = require('vue-chartjs');

new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app');
