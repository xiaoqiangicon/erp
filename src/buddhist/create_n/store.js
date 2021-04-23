import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // 分类列表
    ceremonyTypes: [],
    // 是否显示编辑分类
    typesDialogShowing: false,
  },
});

export default store;
