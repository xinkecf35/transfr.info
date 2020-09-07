import actions from './actions';
import getters from './getters';
import mutations from './mutations';


const state = function() {
  return {
    profile: {},
    ids: [],
    address: {},
    email: {},
    telephone: {},
    currentCardId: '',
  };
};

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};
