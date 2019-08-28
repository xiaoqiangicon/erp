import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    setValidDialogVisible: false,
    setDeleteDialogVisible: false,
    setWithdrawDialogVisible: false,
    setEndTimeDialogVisible: false,
    setInsuranceIdDialogVisible: false,
    noticeDialogVisible: false,
  },
  mutations: {
    updateSetValidVisible(state, payload) {
      state.setValidDialogVisible = payload.state;
    },
    updateSetDeleteVisible(state, payload) {
      state.setDeleteDialogVisible = payload.state;
    },
    updateSetWithdrawVisible(state, payload) {
      state.setWithdrawDialogVisible = payload.state;
    },
    updateSetEndTimeVisible(state, payload) {
      state.setEndTimeDialogVisible = payload.state;
    },
    updateSetInsranceIdVisible(state, payload) {
      state.setInsuranceIdDialogVisible = payload.state;
    },
    updateNoticeVisible(state, payload) {
      state.noticeDialogVisible = payload.state;
    },
  },
});

export default store;
