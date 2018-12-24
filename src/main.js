import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  beforeCreate() {
    this.$store.commit('csrf/initCSRF');
    this.$store.commit('userdata/initUserData');
  },
  render: (h) => h(App),
}).$mount('#app');
