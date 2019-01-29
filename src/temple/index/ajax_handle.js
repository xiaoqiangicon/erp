/**
 * Created by senntyou on 2017/8/18.
 */

define(['jquery', './data', 'common/env_data', 'lib/jquery.seeAjax'], function(
  $,
  indexData,
  envData
) {
  var handle = {};

  var urlReplacement = [
    {
      target: 'http://wx.zizaihome.com',
      replacement: 'https://wx.zizaihome.com',
    },
  ];

  // 外部的ajax requestKeys
  handle.outerRequestKeys = {
    buddhist: {
      page: 'pageNumber',
      componentId: 'imageTextId',
    },
    article: {
      page: 'pageNumber',
      componentId: 'imageTextId',
    },
    save: {
      data: 'subassembly',
    },
    calendarBuddhist: {
      page: 'pageNumber',
    },
    calendarNewTitle: {
      text: 'text',
    },
    deleteActivityOfCalendar: {
      date: 'eventDate',
      //type: 'type',
      // 根据后台的接口更改
      componentId: 'calendarId',
      id: 'eventId',
    },
    activitiesOfCalendar: {
      page: 'pageNumber',
      date: 'dateList',
      componentId: 'calendarId',
    },
    deleteComponent: {
      id: 'id',
      sortId: 'sortId',
    },
    updateSort: {
      data: 'subassembly',
    },
  };
  handle.outerResponseRefactor = {
    buddhist: {
      totalCount: 'listCnt',
      perPage: 'listLength',
      totalPages: 'pageCnt',
      data: [
        {
          //selected: 'isChoose!bool',
          image: 'pic',
          content: 'name',
          status: 'progressType',
        },
      ],
    },
    article: {
      totalCount: 'listCnt',
      perPage: 'listLength',
      totalPages: 'pageCnt',
      data: [
        {
          image: 'pic',
          content: 'title',
        },
      ],
    },
    save: {
      url: 'templeWebsiteUrl',
    },
    buddhistTypes: {
      data: [
        {
          images: 'pics',
          _images: [
            {
              name: 'title',
              status: 'progressType',
            },
          ],
        },
      ],
    },
    activitiesOfCalendar: {
      totalPages: 'total',
    },
    articleTypes: {
      data: [
        {
          images: 'picList',
          _images: [
            {
              name: 'title',
              url: 'pic',
            },
          ],
        },
      ],
    },
    appTypes: {
      data: [
        {
          type: 'link_type',
          subTypes: 'linkList',
          _subTypes: [
            {
              id: 'message_id',
            },
          ],
        },
      ],
    },
  };
  handle.outerPreHandle = {
    buddhist: function(data) {
      data.pageNumber -= 1;
    },
    article: function(data) {
      data.pageNumber -= 1;
    },
    calendarBuddhist: function(data) {
      data.pageNumber -= 1;
    },
    activitiesOfCalendar: function(data) {
      data.pageNumber -= 1;
      // 每页条数，目前设置为5条
      //data.pageSize = 5;
    },
  };
  handle.outerPostHandle = {
    common: function(res) {
      res.success = res.result >= 0;
      res.message = res.msg || '';
    },
    upload: function(res) {
      res.files = [];
      res.files.push({
        url: res.url,
      });
    },
    buddhist: function(res) {
      res.currentPage = res.pageNumber >= 0 ? res.pageNumber : res.totalPages;
      // 格式化所有图片的尺寸
      res.data.map(function(cell) {
        var markIndex = cell.image.indexOf('?');
        markIndex > -1
          ? (cell.image =
              cell.image.slice(0, markIndex) + indexData.imagesParams[3][2])
          : (cell.image += indexData.imagesParams[3][2]);

        cell.ended = cell.isEnd === 1;
        cell.unStarted = cell.isEnd === -1;
      });
    },
    article: function(res) {
      res.currentPage = res.pageNumber >= 0 ? res.pageNumber : res.totalPages;
      // 格式化所有图片的尺寸
      res.data.map(function(cell) {
        var markIndex = cell.image.indexOf('?');
        markIndex > -1
          ? (cell.image =
              cell.image.slice(0, markIndex) + indexData.imagesParams[3][2])
          : (cell.image += indexData.imagesParams[3][2]);
      });
    },
    activitiesOfCalendar: function(res) {
      // 本来我要的是页数，但后台传给我的是条数，故在此更改
      res.totalPages = Math.ceil(res.totalPages / 5);
      // 当前页
      res.currentPage = res.pageNumber < 0 ? res.totalPages : res.pageNumber;
      // 活动项目
      res.dayItems = [];
      !!res.list &&
        res.list.map(function(dateItem) {
          var dateArray = dateItem.date.split('-'),
            data = {
              year: parseInt(dateArray[0]),
              month: parseInt(dateArray[1]),
              day: parseInt(dateArray[2]),
              activities: [],
            };
          dateItem.events.map(function(activity) {
            var isBuddhist = !!activity.commodityId; // 是否是佛事
            //var activityData = {
            //    id:  isBuddhist? activity.commodityId : activity.id,
            //    title: isBuddhist ? activity.commodityName : activity.title,
            //    type: isBuddhist ? 1 : 2,
            //    image: isBuddhist ? activity.commodityPic : ''
            //};
            // 由于后台给的接口不一致，故在此更改
            var activityData = {
              id: activity.id, // 后台不需要佛事id，故去掉
              title: isBuddhist ? activity.commodityName : activity.title,
              type: isBuddhist ? 1 : 2, // 这个字段无用，保留无害
              image: isBuddhist ? activity.commodityPic : '',
            };
            data.activities.push(activityData);
          });

          res.dayItems.push(data);
        });
    },
    buddhistTypes: function(res) {
      // 格式化所有图片的尺寸
      res.data.map(function(cell) {
        cell.images.map(function(subCell) {
          subCell.url.indexOf('?') < 0 &&
            (subCell.url += indexData.imagesParams[3][0]);
        });
      });
    },
    articleTypes: function(res) {
      // 格式化所有图片的尺寸
      res.data.map(function(cell) {
        cell.images.map(function(subCell) {
          subCell.url.indexOf('?') < 0 &&
            (subCell.url += indexData.imagesParams[3][0]);
        });
      });
    },
    appTypes: function(res) {
      var itemIndexToBeRemove = [];
      res.data.map(function(cell, index) {
        if (!cell.url && (!cell.subTypes || !cell.subTypes.length)) {
          itemIndexToBeRemove.push(index);
          return;
        }

        !!cell.url &&
          urlReplacement.map(function(item) {
            cell.url = cell.url.replace(item.target, item.replacement);
          });

        // 佛历链接需要加上templeName
        cell.type == 1 &&
          (cell.url += '&templeName=' + window.localStorage['templename']);

        !!envData.envParamMark &&
          !!cell.url &&
          cell.url.indexOf('isTest') < 0 &&
          (cell.url +=
            (cell.url.indexOf('?') < 0 ? '?' : '&') + envData.envParamMark);
        !!cell.subTypes &&
          !!cell.subTypes.length &&
          cell.subTypes.map(function(subCell) {
            !!envData.envParamMark &&
              !!subCell.url &&
              subCell.url.indexOf('isTest') < 0 &&
              (subCell.url +=
                (subCell.url.indexOf('?') < 0 ? '?' : '&') +
                envData.envParamMark);
            !!subCell.url &&
              urlReplacement.map(function(item) {
                subCell.url = subCell.url.replace(
                  item.target,
                  item.replacement
                );
              });
          });
      });
      // 去掉没有url 子类型也为空的项目
      itemIndexToBeRemove.map(function(idx, index) {
        res.data.splice(idx - index, 1);
      });
    },
  };

  return handle;
});
