/**
 * Created by kang on 2017/9/18.
 */

define([], function() {
  var data = {
    ifHasSub: false, // 是否有选择项 获取页面列表数据时即可获取的标志位 存储于 每行的打印机列的data-ifHasSub中 打开展示打印机设置modal进行赋值
    getListParams: {
      // 请求列表数据的全局变量初始值
      page: 0,
      pageSize: 25,
      typeId: -1,
      filterType: 0,
      searchText: '',
      orderByJoinNum: '',
      orderByCollectMoney: '',
    },
    getListRes: {},
    handleListData: {}, // 处理后的返回值，id:{}的键值对组成的对象
    getPrinterConfig: {}, // 存储获取的佛事打印机配置
    currentPrinterConfig: {}, // 存储有规格打印机的当前打印机页配置

    getPrinterListRes: {}, // 获取的打印机列表
    getSubListRes: {}, // 获取的佛事选择项列表
    localPrtCfg: {}, // 生成的本地打印机配置格式

    curBuddhistId: 0, // 当前佛事id
    buddhistScheduleListHandleData: {}, // {id: {...}}

    isSubmit: 0, // 是否正在向服务器提交数据标志位

    videoPlayer: '', // 播放器
  };

  return data;
});
