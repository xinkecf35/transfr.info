import Vue from 'vue';
import App from './App.vue';
import eventBus from './event-bus';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  eventBus,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
