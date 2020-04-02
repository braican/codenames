import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import '@/static/styles/globals.scss';

Vue.config.productionTip = false;

Vue.use(VueClipboard);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
