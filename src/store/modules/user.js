// const baseURL = process.env.NODE_ENV === 'development' ?
//   'https://api.transfr.test/v1' :
//   'https://api.transfr.info/v1';

const state = () => ({});

const actions = {};

const getters = {
  displayName(state) {
    const [lastName='', firstName=''] = state.fullName.split(';');
    return `${firstName} ${lastName}`;
  },
  firstName(state) {
    return state.fullName.split(';')[1] || '';
  },
  lastName(state) {
    return state.fullName.split(';')[0] || '';
  },
};

const mutations = {
  clear(state) {
    Object.keys(state).forEach((key) => delete state[key]);
  },
  setUserData(state, user) {
    state.fullName = user.name;
    state.email = user.email;
  },
  setEmail(state, email) {
    state.email = email;
  },
  setName(state, name) {
    state.fullName = name;
  },
};

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};
