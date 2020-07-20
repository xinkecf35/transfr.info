// const baseURL = process.env.NODE_ENV === 'development' ?
//   'https://api.transfr.test/v1' :
//   'https://api.transfr.info/v1';

const state = () => ({});

const actions = {

};

const mutations = {
  setUserData(state, user) {
    state.fullName = user.name;
    state.email = user.email;
  },
};

export default {
  namespaced: true,
  actions,
  mutations,
  state,
};
