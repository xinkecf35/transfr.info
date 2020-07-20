// const baseURL = process.env.NODE_ENV === 'development' ?
//   'https://api.transfr.test/v1' :
//   'https://api.transfr.info/v1';

const state = () => {};

const actions = {
};

const mutations = {
  // Takes the cards array and flattens it a little
  // basically profileId is mapped to the cards instead
  // of the old style of using array indexes
  setCards(state, cards) {
    if (cards instanceof Array) {
      cards.forEach((card) => {
        const profileId = card.profileId;
        delete card.profileId;
        state[profileId] = card;
      });
    }
  },
};

export default {
  namespaced: true,
  actions,
  mutations,
  state,
};
