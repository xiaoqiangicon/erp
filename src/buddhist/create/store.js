import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // 分类列表
    ceremonyTypes: [],
    // 是否显示编辑分类
    typesDialogShowing: false,
    // 附言组件数据改变标志，每次变化+1（因为在规格组件中改变数据，附言组件并不会变化）
    fuYanComponentDataChange: 1,
    // 规格列表长度，因为规格列表的个数变化不会更新App.vue的视图，这里做一个hack
    guiGeListLength: 0,
    // 所有组件数据改变标志，每次变化+1
    allComponentsChange: 1,
    // 剩余短信数量，初始化为-1
    remainMsgCount: -1,
  },
});

export default store;
