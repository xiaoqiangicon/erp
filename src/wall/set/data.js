/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery'], function($) {
  var data = {
    // 编辑器示例
    editor: void 0,
    // 佛像数据集合
    buddhas: {},
    // 标签数据（系统标签和自定义标签都是用的同一个表）
    tags: {},
    // 是否是编辑操作
    editAction: !1,
    // 默认随喜金额
    defaultRandomMoney:
      '5,5,5,5.55,5.88,6,6,6.66,6.68,6.88,7.77,8,8.88,9.66,9.99,10,10,10,10,10.01,10.88,11.11,13.14,13.88,15.68,16,16.66,16.88,18,18.18,18.88,19.19,19.88,20,20,20,20.66,22,22.22,25.55,26.66,26.88,28,28.88,33.33,36,38.88,46.66,49.99,50,66.66,68.68,88.88,99.99,100,108,168',
    // 当前弹出框正在处理的附言弹出框
    currentMemoType: 0,
    // 当前的打印联数（默认2联）
    currentPrinterPages: 2,
    // 上一次输入的计数
    lastTagPopupInputLength: 0,
    // 默认分享标题
    defaultShareTitle: '万佛认供功德无量，诸佛护持福慧双收',
    // 默认分享内容
    defaultShareContent:
      '认供佛像不仅个人得益，还能全家蒙福，更愿是超祖灵，亦使下庇远孙。',
    // 默认分享图片
    defaultShareImage: 'https://pic.zizaihome.com/1490854229282.jpg',
  };

  return data;
});
