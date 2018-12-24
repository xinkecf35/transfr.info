import Vue from 'vue';
import Vuex from 'vuex';
import csrf from './modules/csrf';
import userdata from './modules/userdata';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    csrf,
    userdata,
  },
});

export default store;
