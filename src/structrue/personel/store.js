import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    detailDialogVisible: !1,
    roleList: [],
  },
  mutations: {
    updateDetailVisible(state, payload) {
      state.detailDialogVisible = payload.state;
    },
  },
});

export default store;
