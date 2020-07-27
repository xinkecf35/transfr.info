import {normalize} from 'normalizr';
import {isEmptyOrNull} from '@/functions';
import {profiles} from './schemas';

// const baseURL = process.env.NODE_ENV === 'development' ?
//   'https://api.transfr.test/v1' :
//   'https://api.transfr.info/v1';

const state = () => {};

const actions = {};

const getters = {
  cardsArray(state) {
    return Object.values(state.profile);
  },
  getObjectValues: (state) => (profileId, attribute) => {
    const attrIds = state.profile[profileId][attribute];
    const values = attrIds.map((id) => state[attribute][id] || undefined);
    return values.filter((value) => !isEmptyOrNull(value));
  },
};

const mutations = {
  clear(state) {
    Object.keys(state).forEach((key) => delete state[key]);
  },
  updateAttributeForId(state, {id, attribute, value}) {
    const card = state.profile[id];
    card[attribute] = value;
  },
  // Takes the cards array and flattens it a little
  // basically profileId is mapped to the cards
  setCards(state, cards) {
    const {entities, result} = normalize(cards, profiles);
    Object.keys(entities).forEach((key) => state[key] = entities[key]);
    state.ids = result;
  },
};

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};
