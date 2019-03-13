import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selected: [],

    detailDialogVisible: false,

    printerDialogVisible: false,

    logisticsDialogVisible: false,
  },
  mutations: {
    updateSelected(state, payload) {
      state.selected = payload.state;
    },
    updateDetailVisible(state, payload) {
      state.detailDialogVisible = payload.state;
    },
    updatePrinterVisible(state, payload) {
      state.printerDialogVisible = payload.state;
    },
    updateLogisticsDialogVisible(state, payload) {
      state.logisticsDialogVisible = payload.state;
    },
  },
});

export default store;
