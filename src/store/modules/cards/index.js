import actions from './actions';
import getters from './getters';
import mutations from './mutations';


// const baseURL = process.env.NODE_ENV === 'development' ?
//   'https://api.transfr.test/v1' :
//   'https://api.transfr.info/v1';

const state = () => {};

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};
