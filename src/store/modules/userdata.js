const state = {
  fullName: null,
  email: null,
  cards: [],
};
const mutations = {
  setUserDataFromAPI(state, data) {
    sessionStorage.removeItem('userdata');
    state.fullName = data.name;
    state.email = data.email;
    state.cards = data.vcards;
    sessionStorage.setItem('userdata', JSON.stringify(state));
  },
  setName(state, fullName) {
    state.fullName = fullName;
    sessionStorage.setItem('userdata', JSON.stringify(state));
  },
  setEmail(state, email) {
    state.email = email;
    sessionStorage.setItem('userdata', JSON.stringify(state));
  },
  addCard(state, card) {
    state.cards.push(card);
    sessionStorage.setItem('userdata', JSON.stringify(state));
  },
  removeCard(state, index) {
    state.cards.splice(index, 1);
    sessionStorage.setItem('userdata', JSON.stringify(state));
  },
  clearData(state) {
    state.fullName = '';
    state.email = '';
    state.cards = [];
    sessionStorage.removeItem('userdata');
  },
  initUserData(state) {
    const userdata = JSON.parse(sessionStorage.getItem('userdata'));
    if (userdata) {
      this.replaceState(state);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
