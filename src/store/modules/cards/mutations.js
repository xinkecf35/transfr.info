import Vue from 'vue';
import {normalize} from 'normalizr';
import {getRandomInt} from '@/functions';
import {profiles} from './schemas';


// Mutations for cards vuex module
export default {
  clear(state) {
    Object.keys(state).forEach((key) => delete state[key]);
  },
  addValueInArray(state, {id, attribute, type, value}) {
    const tempId = `temp-${id}-${getRandomInt(100, 1000)}`;
    Vue.set(state[attribute], tempId, {_id: tempId, type, value});
    const attrIdsForCard = state.profile[id][attribute];
    if (Array.isArray(attrIdsForCard) && attrIdsForCard.length) {
      state.profile[id][attribute].push(tempId);
    } else {
      state[id][attribute] = [tempId];
    }
  },
  removeValueInArray(state, {attrId, cardId, attribute}) {
    Vue.delete(state[attribute], attrId);
    const attrValues = state.profile[cardId][attribute];
    attrValues.splice(attrValues.indexOf(attrId), 1);
  },
  resetCard(state, {id, original}) {
    if (typeof original === 'string') {
      // For restoring from JSON
      Vue.set(state.profile, id, JSON.parse(original));
    } else {
      Vue.set(state.profile, id, original);
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
};
