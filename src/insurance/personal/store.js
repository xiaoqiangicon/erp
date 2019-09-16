import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selected: [],

    detailDialogVisible: false,
    setDeleteDialogVisible: false,
    setWithdrawDialogVisible: false,
    setRenewDialogVisible: false,
  },
  mutations: {
    updateSelected(state, payload) {
      state.selected = payload.state;
    },
    updateDetailVisible(state, payload) {
      state.detailDialogVisible = payload.state;
    },
    updateSetDeleteVisible(state, payload) {
      state.setDeleteDialogVisible = payload.state;
    },
    updateSetWithdrawVisible(state, payload) {
      state.setWithdrawDialogVisible = payload.state;
    },
    updateSetRenewVisible(state, payload) {
      state.setRenewDialogVisible = payload.state;
    },
  },
});

export default store;
