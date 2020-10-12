import {denormalize} from 'normalizr';
import {isEmptyOrNull} from '@/functions';
import {profileSchema} from './schemas';

export default {
  cardsArray(state) {
    return state.ids.map((id) => state.profile[id]);
  },
  getDenormalizedCard: (state) => (id) => {
    return denormalize(state.profile[id], profileSchema, state);
  },
  getIdsForAttribute: (state) => (id, attr) => {
    return state.profile[id][attr] || [];
  },
  getObjectValues: (state) => (profileId, attribute) => {
    const attrIds = state.profile[profileId][attribute];
    const values = attrIds.map((id) => state[attribute][id] || undefined);
    return values.filter((value) => !isEmptyOrNull(value));
  },
  getValueFromArray: (state) => (id, attr, field) => {
    return state[attr][id][field];
  },
  isCardDirty: (state) => (profileId) => state.profile[profileId].dirty,
};
