export default {
  state: {
    user: {
      fullName: '',
      email: '',
    },
    cards: [],
  },
  mutations: {
    setUserDataFromAPI(state, data) {
      state.user.name = data.fullName;
      state.user.email = data.email;
      state.cards = data.vcards;
    },
    setName(state, fullName) {
      state.user.name = fullName;
    },
    setEmail(state, email) {
      state.user.email = email;
    },
    addCard(state, card) {
      state.cards.push(card);
    },
    removeCard(state, index) {
      state.card.splice(index, 1);
    },
    clearData(state) {
      state.user.name = '';
      state.user.email = '';
      state.cards = [];
      sessionStorage.removeItem('userdata');
    },
    initUserData(state) {
      const userdata = sessionStorage.getItem('userdata');
      if (userdata) {
        this.replaceState(state);
      }
    },
  },
};