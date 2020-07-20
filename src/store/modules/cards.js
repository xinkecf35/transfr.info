// const baseURL = process.env.NODE_ENV === 'development' ?
//   'https://api.transfr.test/v1' :
//   'https://api.transfr.info/v1';

const state = () => {};

const actions = {};

const getters = {
  cardsArray(state) {
    return Object.values(state);
  },
};

const mutations = {
  clear(state) {
    Object.keys(state).forEach((key) => delete state[key]);
  },
  // Takes the cards array and flattens it a little
  // basically profileId is mapped to the cards
  setCards(state, cards) {
    if (cards instanceof Array) {
      cards.forEach((card) => {
        const profileId = card.profileId;
        state[profileId] = card;
      });
    }
  },
};

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};
