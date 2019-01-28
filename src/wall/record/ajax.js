/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'lunar-calendar', 'lib/jquery.seeAjax'], function(
  $,
  LunarCalendar
) {
  var requestKeysOuter = {
    detail: {
      id: 'wallId',
    },
    cellInfo: {
      id: 'wallId',
      row: 'row',
      column: 'col',
    },
    onlineCellInfo: {
      id: 'wallId',
      row: 'row',
      column: 'col',
    },
    add: {
      regionId: 'wallId',
      row: 'row',
      column: 'col',
      endTime: 'endTime',
      writeName: 'writeName',
      contactList: 'contacts',
      yangShangRen: 'alivePeople',
      wangShengZhe: 'deadman',
      wish: 'wish',
    },
    edit: {
      id: 'id',
      regionId: 'wallId',
      row: 'row',
      column: 'col',
      endTime: 'endTime',
      writeName: 'writeName',
      contactList: 'contacts',
      yangShangRen: 'alivePeople',
      wangShengZhe: 'deadman',
      wish: 'wish',
    },
  };
  var responseRefactorOuter = {
    regions: {
      data: [
        {
          memoConfig: 'postScript',
          _memoConfig: [
            {
              type: 'input_type',
              tip: 'prompt_text',
              length: 'font_length',
            },
          ],
        },
      ],
    },
    detail: {
      data: {
        recordSeats: 'noSeatOfflineArray',
        onlineSeats: 'noSeatOnlineArray',
        seats: 'numberText',
      },
    },
    cellInfo: {
      data: {
        sequence: 'number',
        yangShangRen: 'alivePeople',
        wangShengZhe: 'deadman',
      },
    },
    onlineCellInfo: {
      data: {
        sequence: 'number',
        contactList: [
          {
            phone: 'mobile',
            birth: 'birthday',
            lunar: 'isLunar',
          },
        ],
        yangShangRen: 'alivePeople',
        wangShengZhe: 'deadman',
      },
    },
  };
  var preHandleOuter = {
    add: function(req) {
      var contactList = req.contacts || [];
      var pureContactList = [];
      contactList.map(function(contact) {
        var text = '';
        if (contact.name || contact.phone) {
          text = (contact.name || '') + '|' + (contact.phone || '');

          // 如果是农历，需要有年月日，如果是阳历，需要有日期
          if (
            (contact.lunar && contact.year && contact.month && contact.day) ||
            (!contact.lunar && contact.birth)
          ) {
            text += '|';
            if (!contact.lunar) {
              text += contact.birth + '-0';
            } else {
              // 农历需要把数据转换成阳历，然后传给服务器
              var lunarData = LunarCalendar.lunarToSolar(
                contact.year,
                contact.month,
                contact.day
              );
              text +=
                lunarData.year +
                '-' +
                (lunarData.month > 9
                  ? lunarData.month
                  : '0' + lunarData.month) +
                '-' +
                (lunarData.day > 9 ? lunarData.day : '0' + lunarData.day) +
                '-1';
            }
          }
        }
        text && pureContactList.push(text);
      });
      req.contacts = pureContactList.join(',');
    },
    edit: function(req) {
      var contactList = req.contacts || [];
      var pureContactList = [];
      contactList.map(function(contact) {
        var text = '';
        if (contact.name || contact.phone) {
          text = (contact.name || '') + '|' + (contact.phone || '');

          // 如果是农历，需要有年月日，如果是阳历，需要有日期
          if (
            (contact.lunar && contact.year && contact.month && contact.day) ||
            (!contact.lunar && contact.birth)
          ) {
            text += '|';
            if (!contact.lunar) {
              text += contact.birth + '-0';
            } else {
              // 农历需要把数据转换成阳历，然后传给服务器
              var lunarData = LunarCalendar.lunarToSolar(
                contact.year,
                contact.month,
                contact.day
              );
              text +=
                lunarData.year +
                '-' +
                (lunarData.month > 9
                  ? lunarData.month
                  : '0' + lunarData.month) +
                '-' +
                (lunarData.day > 9 ? lunarData.day : '0' + lunarData.day) +
                '-1';
            }
          }
        }
        text && pureContactList.push(text);
      });
      req.contacts = pureContactList.join(',');
    },
  };
  var postHandleOuter = {
    common: function(res) {
      res.success = res.result >= 0;
      res.msg && (res.message = res.msg);
    },
    regions: function(res) {
      res.data &&
        res.data.length &&
        res.data.map(function(item) {
          var nameArray = item.name.split('-');
          // 把第一个去掉
          nameArray.shift();
          // 产品要求把前面的大殿名去掉
          item.shortedName = nameArray.join('-');
        });
    },
    cellInfo: function(res) {
      var contactList = res.data.contactList;
      res.data.contactList = [];
      if (contactList) {
        var contactListArray = contactList.split(',');
        contactListArray.map(function(item) {
          var itemArray = item.split('|');

          var birth = '';
          var birthData = itemArray[2];
          var birthDataArray = [];
          var year = 0;
          var month = 0;
          var day = 0;
          var lunar = 0;
          var lunarData = {};

          if (birthData) {
            birthDataArray = birthData.split('-');
            lunar = parseInt(birthDataArray[3]);
            year = parseInt(birthDataArray[0]);
            month = parseInt(birthDataArray[1]);
            day = parseInt(birthDataArray[2]);
            birth =
              birthDataArray[0] +
              '-' +
              birthDataArray[1] +
              '-' +
              birthDataArray[2];

            // 阴历，后台birth存的阳历数据
            if (lunar) {
              lunarData = LunarCalendar.solarToLunar(year, month, day);

              year = lunarData.lunarYear;
              month = lunarData.lunarMonth;
              day = lunarData.lunarDay;
              birth =
                year +
                '-' +
                (month > 9 ? month : '0' + month) +
                '-' +
                (day > 9 ? day : '0' + day);
            }
          }
          res.data.contactList.push({
            name: itemArray[0],
            phone: itemArray[1],
            birth: birth,
            lunar: lunar,
            year: year,
            month: month,
            day: day,
          });
        });
      }
    },
    onlineCellInfo: function(res) {
      var contactList = res.data.contactList;
      res.data.contactList = [];
      if (contactList) {
        contactList.map(function(item) {
          var birth = item.birth;
          var birthDataArray = [];
          var year = 0;
          var month = 0;
          var day = 0;
          var lunar = item.lunar;
          var lunarData = {};

          if (birth) {
            birthDataArray = birth.split('-');
            year = parseInt(birthDataArray[0]);
            month = parseInt(birthDataArray[1]);
            day = parseInt(birthDataArray[2]);

            // 阴历，后台birth存的阳历数据
            if (lunar) {
              lunarData = LunarCalendar.solarToLunar(year, month, day);

              year = lunarData.lunarYear;
              month = lunarData.lunarMonth;
              day = lunarData.lunarDay;
              birth =
                year +
                '-' +
                (month > 9 ? month : '0' + month) +
                '-' +
                (day > 9 ? day : '0' + day);
            }
          }
          res.data.contactList.push({
            name: item.name,
            phone: item.phone,
            birth: birth,
            lunar: lunar,
            year: year,
            month: month,
            day: day,
          });
        });
      }
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      // 大殿列表
      houses: 'houses',
      // 请求区域列表
      regions: 'regions',
      // 请求一个区域的详细信息
      detail: 'detail',
      // 单元格详细信息
      cellInfo: 'cellInfo',
      // 线上订单单元格详情
      onlineCellInfo: 'onlineCellInfo',
      // 添加
      add: 'add',
      // 编辑
      edit: 'edit',
      // 编辑线上数据
      editOnline: 'editOnline',
    },
    //url请求地址
    url: {
      houses: [
        '/zzhadmin/buddhaWall_hallList/',
        '/src/wall/record/mock/houses_server.json',
        '/src/wall/record/mock/houses.json',
      ],
      regions: [
        '/zzhadmin/buddhaWallWallList/',
        '/src/wall/record/mock/regions_server.json',
        '/src/wall/record/mock/regions.json',
      ],
      detail: [
        '/zzhadmin/buddhaWall_seatChart/',
        '/src/wall/record/mock/detail_server.json',
        '/src/wall/record/mock/detail.json',
      ],
      cellInfo: [
        '/zzhadmin/buddhaWall_getRecord/',
        '/src/wall/record/mock/cell_info_server.json',
        '/src/wall/record/mock/cell_info.json',
      ],
      onlineCellInfo: [
        '/zzhadmin/buddhaWall_getOrder/',
        '/src/wall/record/mock/online_cell_info_server.json',
        '/src/wall/record/mock/online_cell_info.json',
      ],
      add: [
        '/zzhadmin/buddhaWall_addrecord/',
        '/src/wall/record/mock/add_server.json',
        '/src/wall/record/mock/add.json',
      ],
      edit: [
        '/zzhadmin/buddhaWall_editrecord/',
        '/src/wall/record/mock/edit_server.json',
        '/src/wall/record/mock/edit.json',
      ],
      editOnline: [
        '/zzhadmin/buddhaWall_editorder/',
        '/src/wall/record/mock/edit_online_server.json',
        '/src/wall/record/mock/edit_online.json',
      ],
    },
    // 请求参数
    requestKeys: {
      detail: [
        requestKeysOuter.detail,
        requestKeysOuter.detail,
        {
          id: 'id',
        },
      ],
      cellInfo: [
        requestKeysOuter.cellInfo,
        requestKeysOuter.cellInfo,
        {
          id: 'id',
          row: 'row',
          column: 'column',
        },
      ],
      onlineCellInfo: [
        requestKeysOuter.onlineCellInfo,
        requestKeysOuter.onlineCellInfo,
        {
          id: 'id',
          row: 'row',
          column: 'column',
        },
      ],
      add: [
        requestKeysOuter.add,
        requestKeysOuter.add,
        {
          regionId: 'regionId',
          row: 'row',
          column: 'column',
          endTime: 'endTime',
          writeName: 'writeName',
          contactList: 'contactList',
          yangShangRen: 'yangShangRen',
          wangShengZhe: 'wangShengZhe',
          wish: 'wish',
        },
      ],
      edit: [
        requestKeysOuter.edit,
        requestKeysOuter.edit,
        {
          id: 'id',
          regionId: 'regionId',
          row: 'row',
          column: 'column',
          endTime: 'endTime',
          writeName: 'writeName',
          contactList: 'contactList',
          yangShangRen: 'yangShangRen',
          wangShengZhe: 'wangShengZhe',
          wish: 'wish',
        },
      ],
      editOnline: [
        requestKeysOuter.edit,
        requestKeysOuter.edit,
        {
          id: 'id',
          regionId: 'regionId',
          row: 'row',
          column: 'column',
          endTime: 'endTime',
          writeName: 'writeName',
          contactList: 'contactList',
          yangShangRen: 'yangShangRen',
          wangShengZhe: 'wangShengZhe',
          wish: 'wish',
        },
      ],
    },
    // 重新格式化json数据
    responseRefactor: {
      regions: [responseRefactorOuter.regions, responseRefactorOuter.regions],
      detail: [responseRefactorOuter.detail, responseRefactorOuter.detail],
      cellInfo: [
        responseRefactorOuter.cellInfo,
        responseRefactorOuter.cellInfo,
      ],
      onlineCellInfo: [
        responseRefactorOuter.onlineCellInfo,
        responseRefactorOuter.onlineCellInfo,
      ],
    },
    //ajax请求前置处理
    preHandle: {
      add: [preHandleOuter.add, preHandleOuter.add],
      edit: [preHandleOuter.edit, preHandleOuter.edit],
      editOnline: [preHandleOuter.edit, preHandleOuter.edit],
    },
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
      regions: [postHandleOuter.regions, postHandleOuter.regions],
      cellInfo: [postHandleOuter.cellInfo, postHandleOuter.cellInfo],
      onlineCellInfo: [
        postHandleOuter.onlineCellInfo,
        postHandleOuter.onlineCellInfo,
      ],
    },
  });
});
