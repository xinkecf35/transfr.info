const baseURL = process.env.NODE_ENV === 'development' ?
  'https://api.transfr.test/v1' :
  'https://api.transfr.info/v1';

const state = () => {};

const actions = {
  loadCards({commit}) {

  },
};

const mutations = {

};

export default {
  namespaced: true,
  actions,
  mutations,
  state,
};
