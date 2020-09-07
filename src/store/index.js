import Vue from 'vue';
import Vuex from 'vuex';
import createPresistedState from 'vuex-persistedstate';
import {ajaxRequest} from '@/functions';
import {baseURL} from '@/global-vars';
import cards from './modules/cards';
import user from './modules/user';

const presistKey = 'transfr-vuex';
const presistStateConfig = {key: presistKey, storage: window.sessionStorage};

Vue.use(Vuex);

const state = () => ({
  csrf: '',
});

const getters = {
  CSRFHeader(state) {
    return {name: 'X-CSRF-TOKEN', value: state.csrf};
  },
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
  loadDataOnLogin({commit}) {
    const userDataURL = `${baseURL}/userdata/user`;
    const userDataPromise = ajaxRequest('GET', userDataURL);
    return userDataPromise.then((response) => {
      commit('user/setUserData', response.user);
      commit('cards/setCards', response.user.vcards);
    });
  },
  clear({commit}) {
    commit('clearCSRF');
    commit('user/clear');
    commit('cards/clear');
    window.sessionStorage.clear(presistKey);
  },
};

const store = new Vuex.Store({
  actions,
  getters,
  modules: {
    cards,
    user,
  },
  mutations,
  plugins: [createPresistedState(presistStateConfig)],
  state,
  strict: process.env.NODE_ENV !== 'production',
});

export default store;
