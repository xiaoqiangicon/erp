export default {
    // 默认配置
    defaultOption: {
      onChange(pageToChange) {}, // 切换页码回调函数，页面以 1 开始索引
      showDesc: !1, // 是否显示左边（共多少条，每页多少条的信息）
      showGoTo: !1, // 是否显示右边跳转到某一页
      currentPage: 1, // 初始化当前页
      totalPages: 0, // 总页数
      totalCount: 0, // 总条数
      perPage: 0, // 每页条数
    },
    // 组件计数
    componentCount: 1,
    // 组件的配置集合
    componentsOptions: {},
  };
