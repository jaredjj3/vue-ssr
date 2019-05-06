import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

Vue.use(Vuex);

export const createStore = () => {
  return new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
  });
};
