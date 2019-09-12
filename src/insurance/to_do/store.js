import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selected: [],
    insuranceIdItem: [],

    detailDialogVisible: false,
    distributeDialogVisible: false,
    repulseDialogVisible: false,
    setBatchDialogVisible: false,
  },
  mutations: {
    updateSelected(state, payload) {
      state.selected = payload.state;
    },
    updateInsuranceIdItem(state, payload) {
      state.insuranceIdItem = payload.state;
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
    updateBatchVisible(state, payload) {
      state.setBatchDialogVisible = payload.state;
    },
  },
});

export default store;
