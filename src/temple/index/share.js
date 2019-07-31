define(function() {
  return {
    // 高僧法师的数据（最多只有一个组件）
    figureComponent: {
      components: [],
    },
    // 当前正在编辑的高僧法师组件
    editFigureId: 0,
    // 殿堂场景的数据（最多只有一个组件）
    houseComponent: {
      houses: [],
    },
    // 当前正在编辑的殿堂场景组件
    editHouseId: 0,
  };
});
