import Vue from 'vue';
import isObject from 'lodash.isobject';
import {normalize} from 'normalizr';
import {getRandomInt} from '@/functions';
import {profiles, profileSchema} from './schemas';


// Mutations for cards vuex module
export default {
  clear(state) {
    Object.keys(state).forEach((key) => delete state[key]);
  },
  addValueInArray(state, {id, attribute, type, value}) {
    const tempId = `temp-${id}-${getRandomInt(10000, 100000)}`;
    Vue.set(state[attribute], tempId, {_id: tempId, type, value});
    const attrIdsForCard = state.profile[id][attribute];
    if (Array.isArray(attrIdsForCard) && attrIdsForCard.length) {
      state.profile[id][attribute].push(tempId);
    } else {
      state.profile[id][attribute] = [tempId];
    }
  },
  removeAllTempValues(state) {
    // Removes all created temporary values,
    // Does not introspect into individual card/profiles attributes
    Object.keys(state).forEach((attr) => {
      if (Array.isArray(state[attr])) {
        state[attr] = state[attr].filter((val) => val.indexOf('temp') === -1);
      } else if (isObject(state[attr])) {
        Object.keys(state[attr])
          .filter((key) => key.indexOf('temp') > -1)
          .forEach((key) => Vue.delete(state[attr], key));
      }
    });
  },
  removeValueInArray(state, {attrId, cardId, attribute}) {
    Vue.delete(state[attribute], attrId);
    const attrValues = state.profile[cardId][attribute];
    attrValues.splice(attrValues.indexOf(attrId), 1);
  },
  resetCard(state, {id, original}) {
    if (typeof original === 'string') {
      // For restoring from JSON
      const {entities} = normalize(JSON.parse(original), profileSchema);
      Object.keys(entities).forEach((key) => {
        state[key] = Object.assign({}, state[key], entities[key]);
      });
    } else {
      const {entities} = normalize(original, profileSchema);
      Object.keys(entities).forEach((key) => {
        state[key] = Object.assign({}, state[key], entities[key]);
      });
    }
  },
  // Takes the cards array and flattens it a little
  // basically profileId is mapped to the cards
  setCards(state, cards) {
    const {entities, result} = normalize(cards, profiles);
    Object.keys(entities).forEach((key) => state[key] = entities[key]);
    state.ids = result;
  },
  updateAttributeForId(state, {id, attribute, value}) {
    const card = state.profile[id];
    card[attribute] = value;
  },
  updateValueInArray(state, {id, attribute, field, value}) {
    state[attribute][id][field] = value;
  },
  updateCardFromPatch(state, {id, card}) {
    const {entities} = normalize(card, profileSchema);
    Object.keys(entities).forEach((key) => {
      state[key] = Object.assign({}, state[key], entities[key]);
    });
  },
};
