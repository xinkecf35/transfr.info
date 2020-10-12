import Vue from 'vue';
import isObject from 'lodash.isobject';
import {normalize} from 'normalizr';
import {getRandomInt} from '@/functions';
import {complexAttributes, simpleAttributes} from '@/global-vars';
import {profiles, profileSchema} from './schemas';


// Mutations for cards vuex module
export default {
  clear(state) {
    Object.keys(state).forEach((key) => delete state[key]);
  },
  addNewCard(state, {id, description}) {
    const newCard = {
      profileId: id,
    };
    complexAttributes.forEach((attr) => newCard[attr] = []);
    simpleAttributes.forEach((attr) => newCard[attr] = '');
    newCard.description = description;
    Vue.set(state.profile, id, newCard);
    state.ids.push(id);
  },
  addCard(state, card) {
    const {entities, result} = normalize(card, profileSchema);
    Object.keys(entities).forEach((key) => {
      state[key] = Object.assign({}, state[key], entities[key]);
    });
    state.ids.push(result);
  },
  addValueInArray(state, {id, attribute, type, value}) {
    const tempId = `temp-${id}-${getRandomInt(10000, 100000)}`;
    // directly pushing on to array as normalization should guarantee array
    Vue.set(state[attribute], tempId, {_id: tempId, type, value});
    state.profile[id][attribute].push(tempId);
  },
  clearDirtyFlag(state, id) {
    state.profile[id].dirty = false;
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
    state.currentCardId = state.ids[0];
  },
  setCurrentCardId(state, id) {
    state.currentCardId = id;
  },
  updateAttributeForId(state, {id, attribute, value}) {
    const card = state.profile[id];
    card[attribute] = value;
    card.dirty = true;
  },
  updateValueInArray(state, {profileId, id, attribute, field, value}) {
    state[attribute][id][field] = value;
    state.profile[profileId].dirty = true;
  },
  updateCardFromPatch(state, {id, card}) {
    const {entities} = normalize(card, profileSchema);
    Object.keys(entities).forEach((key) => {
      state[key] = Object.assign({}, state[key], entities[key]);
    });
  },
};
