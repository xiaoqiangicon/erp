import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selected: [],

    detailDialogVisible: false,

    printerDialogVisible: false,

    logisticsDialogVisible: false,

    videoPlayerVisible: false,
    // 佛事列表
    buddhistList: [],
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
    updateVideoPlayerVisible(state, payload) {
      state.videoPlayerVisible = payload.state;
    },
  },
});

export default store;
