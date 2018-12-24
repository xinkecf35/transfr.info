import Vue from 'vue';
import Vuex from 'vuex';
import csrf from './modules/csrf';
import userdata from './modules/userdata';
import localStorage from './localStorage';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    csrf,
    userdata,
  },
  plugins: [localStorage],
});
