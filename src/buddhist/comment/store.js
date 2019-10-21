import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    replyDialogVisible: false,
  },
  mutations: {
    updateReplyVisible(state, payload) {
      state.replyDialogVisible = payload.state;
    },
  },
});

export default store;
