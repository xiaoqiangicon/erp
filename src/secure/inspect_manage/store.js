import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    detailDialogVisible: false,
  },
  mutations: {
    updateDetailVisible(state, payload) {
      state.detailDialogVisible = payload.state;
    },
  },
});

export default store;
