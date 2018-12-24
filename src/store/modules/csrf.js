const state = {
  csrf: '',
};
const mutations = {
  setToken(state, token) {
    sessionStorage.removeItem('csrf');
    state.csrf=token;
    sessionStorage.setItem('csrf', JSON.stringify(state));
  },
  clearToken() {
    csrf='';
    sessionStorage.removeItem('csrf');
  },
  initCSRF(csrf) {
    let token = JSON.parse(sessionStorage.getItem('csrf'));
    if (token) {
      this.replaceState(token);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
