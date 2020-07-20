import Vue from 'vue';
import Vuex from 'vuex';
import {ajaxRequest} from '@/functions';
import cards from './modules/cards';
import user from './modules/user';

const baseURL = process.env.NODE_ENV === 'development' ?
  'https://api.transfr.test/v1' :
  'https://api.transfr.info/v1';

Vue.use(Vuex);

const state = () => ({
  csrf: '',
});

const mutations = {
  clearCSRF(state) {
    state.csrf = '';
  },
  setCSRF(state, token) {
    state.csrf = token;
  },
};

const actions = {
  loadDataOnLogin({commit}) {
    const userDataURL = `${baseURL}/userdata/user`;
    const userDataPromise = ajaxRequest('GET', userDataURL);
    userDataPromise.then((response) => {
      commit('user/setUserData', response.user);
      commit('cards/setCards', response.user.vcards);
    });
  },
};

const store = new Vuex.Store({
  actions,
  modules: {
    cards,
    user,
  },
  mutations,
  state,
  strict: process.env.NODE_ENV !== 'production',
});

export default store;
