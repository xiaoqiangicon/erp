import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selected: [],

    detailDialogVisible: false,

    printerDialogVisible: false,
    printerDialogType: 'set', // 设置：set 打印：print

    logisticsDialogVisible: false,

    videoPlayerVisible: false,
  },
  mutations: {
    updateSelected(state, payload) {
      state.selected = payload.state;
    },
    updateDetailVisible(state, payload) {
      state.detailDialogVisible = payload.state;
    },
    updatePrinterDialog(state, payload) {
      state.printerDialogVisible = payload.visible;
      state.printerDialogType = payload.type || 'set';
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
