import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    setValidDialogVisible: false,
    setDeleteDialogVisible: false,
    setWithdrawDialogVisible: false,
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
  },
});

export default store;
