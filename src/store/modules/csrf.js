export default {
  state: {
    state: '',
  },
  mutations: {
    setToken(state, token) {
      state=token;
      sessionStorage.setItem('csrf', token);
    },
    clearToken(state) {
      state='';
      sessionStorage.removeItem('csrf');
    },
    initCSRF(state) {
      const token = sessionStorage.getItem('csrf');
      if (token) {
        this.replaceState(token);
      }
    },
  },
};
