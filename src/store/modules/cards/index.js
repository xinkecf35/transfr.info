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
  getIdsForAttribute: (state) => (id, attr) => {
    return state.profile[id][attr];
  },
  getValueFromArray: (state) => (id, attr, field) => {
    return state[attr][id][field];
  },
};

const mutations = {
  clear(state) {
    Object.keys(state).forEach((key) => delete state[key]);
  },
  removeValueInArray(state, {attrId, cardId, attribute}) {
    delete state[attribute][attrId];
    const attrValues = state.profile[cardId][attribute];
    attrValues.splice(attrValues.indexOf(attrId), 1);
  },
  updateAttributeForId(state, {id, attribute, value}) {
    const card = state.profile[id];
    card[attribute] = value;
  },
  updateValueInArray(state, {id, attr, field, value}) {
    state[attr][id][field] = value;
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
