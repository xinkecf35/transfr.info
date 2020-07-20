import Vue from 'vue';
import Vuex from 'vuex';

// const baseURL = process.env.NODE_ENV === 'development' ?
//   'https://api.transfr.test/v1' :
//   'https://api.transfr.info/v1';

Vue.use(Vuex);

const state = () => {
  return {csrf: ''};
};

const mutations = {
  clearCSRF(state) {
    state.csrf = '';
  },
  setCSRF(state, token) {
    state.csrf = token;
  },
};

const actions = {
  loadDataOnLogin({commit, dispatch}) {

  },
};

const store = new Vuex.Store({
  actions,
  modules: {
  },
  mutations,
  state,
  strict: process.env.NODE_ENV !== 'production',
});

export default store;
