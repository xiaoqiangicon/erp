import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selected: [],

    detailDialogVisible: false,
    distributeDialogVisible: false,
    repulseDialogVisible: false,
  },
  mutations: {
    updateSelected(state, payload) {
      state.selected = payload.state;
    },
    updateDetailVisible(state, payload) {
      state.detailDialogVisible = payload.state;
    },
    updateDistributeVisible(state, payload) {
      state.distributeDialogVisible = payload.state;
    },
    updateRepulseVisible(state, payload) {
      state.repulseDialogVisible = payload.state;
    },
  },
});

export default store;
