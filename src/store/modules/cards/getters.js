import {isEmptyOrNull} from '@/functions';

export default {
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
