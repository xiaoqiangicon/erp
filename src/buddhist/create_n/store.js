import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // 分类列表
    ceremonyTypes: [],
    // 是否显示编辑分类
    typesDialogShowing: false,
    // 附言组件数据改变标志（因为在规格组件中改变数据，附言组件并不会变化）
    fuYanComponentDataChange: 1,
  },
});

export default store;
