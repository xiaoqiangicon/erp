import $ from "jquery";
import indexData from "./data";
import envData from "common/env_data";
import "lib/jquery.seeAjax";
var handle = {};
var urlReplacement = [{
  target: "http://wx.zizaihome.com",
  replacement: "https://wx.zizaihome.com"
}];
handle.outerRequestKeys = {
  buddhist: {
    page: "pageNumber",
    componentId: "imageTextId"
  },
  article: {
    page: "pageNumber",
    componentId: "imageTextId"
  },
  save: {
    data: "subassembly"
  },
  calendarBuddhist: {
    page: "pageNumber"
  },
  calendarNewTitle: {
    text: "text"
  },
  deleteActivityOfCalendar: {
    date: "eventDate",
    componentId: "calendarId",
    id: "eventId"
  },
  activitiesOfCalendar: {
    page: "pageNumber",
    date: "dateList",
    componentId: "calendarId"
  },
  deleteComponent: {
    id: "id",
    sortId: "sortId"
  },
  updateSort: {
    data: "subassembly"
  }
};
handle.outerResponseRefactor = {
  buddhist: {
    totalCount: "listCnt",
    perPage: "listLength",
    totalPages: "pageCnt",
    data: [{
      image: "pic",
      content: "name",
      status: "progressType"
    }]
  },
  article: {
    totalCount: "listCnt",
    perPage: "listLength",
    totalPages: "pageCnt",
    data: [{
      image: "pic",
      content: "title"
    }]
  },
  save: {
    url: "templeWebsiteUrl"
  },
  buddhistTypes: {
    data: [{
      images: "pics",
      _images: [{
        name: "title",
        status: "progressType"
      }]
    }]
  },
  activitiesOfCalendar: {
    totalPages: "total"
  },
  articleTypes: {
    data: [{
      images: "picList",
      _images: [{
        name: "title",
        url: "pic"
      }]
    }]
  },
  appTypes: {
    data: [{
      type: "link_type",
      subTypes: "linkList",
      _subTypes: [{
        id: "message_id"
      }]
    }]
  }
};
handle.outerPreHandle = {
  buddhist: function (data) {
    data.pageNumber -= 1;
  },
  article: function (data) {
    data.pageNumber -= 1;
  },
  calendarBuddhist: function (data) {
    data.pageNumber -= 1;
  },
  activitiesOfCalendar: function (data) {
    data.pageNumber -= 1;
  }
};
handle.outerPostHandle = {
  common: function (res) {
    res.success = res.result >= 0;
    res.message = res.msg || "";
  },
  upload: function (res) {
    res.files = [];
    res.files.push({
      url: res.url
    });
  },
  buddhist: function (res) {
    res.currentPage = res.pageNumber >= 0 ? res.pageNumber : res.totalPages;
    res.data.map(function (cell) {
      var markIndex = cell.image.indexOf("?");
      markIndex > -1 ? cell.image = cell.image.slice(0, markIndex) + indexData.imagesParams[3][2] : cell.image += indexData.imagesParams[3][2];
      cell.ended = cell.isEnd === 1;
      cell.unStarted = cell.isEnd === -1;
    });
  },
  article: function (res) {
    res.currentPage = res.pageNumber >= 0 ? res.pageNumber : res.totalPages;
    res.data.map(function (cell) {
      var markIndex = cell.image.indexOf("?");
      markIndex > -1 ? cell.image = cell.image.slice(0, markIndex) + indexData.imagesParams[3][2] : cell.image += indexData.imagesParams[3][2];
    });
  },
  activitiesOfCalendar: function (res) {
    res.totalPages = Math.ceil(res.totalPages / 5);
    res.currentPage = res.pageNumber < 0 ? res.totalPages : res.pageNumber;
    res.dayItems = [];
    !!res.list && res.list.map(function (dateItem) {
      var dateArray = dateItem.date.split("-"), data = {
        year: parseInt(dateArray[0]),
        month: parseInt(dateArray[1]),
        day: parseInt(dateArray[2]),
        activities: []
      };
      dateItem.events.map(function (activity) {
        var isBuddhist = !!activity.commodityId;
        var activityData = {
          id: activity.id,
          title: isBuddhist ? activity.commodityName : activity.title,
          type: isBuddhist ? 1 : 2,
          image: isBuddhist ? activity.commodityPic : ""
        };
        data.activities.push(activityData);
      });
      res.dayItems.push(data);
    });
  },
  buddhistTypes: function (res) {
    res.data.map(function (cell) {
      cell.images.map(function (subCell) {
        subCell.url.indexOf("?") < 0 && (subCell.url += indexData.imagesParams[3][0]);
      });
    });
  },
  articleTypes: function (res) {
    res.data.map(function (cell) {
      cell.images.map(function (subCell) {
        subCell.url.indexOf("?") < 0 && (subCell.url += indexData.imagesParams[3][0]);
      });
    });
  },
  appTypes: function (res) {
    var itemIndexToBeRemove = [];
    res.data.map(function (cell, index) {
      if (!cell.url && (!cell.subTypes || !cell.subTypes.length)) {
        itemIndexToBeRemove.push(index);
        return;
      }
      !!cell.url && urlReplacement.map(function (item) {
        cell.url = cell.url.replace(item.target, item.replacement);
      });
      cell.type == 1 && (cell.url += "&templeName=" + window.localStorage["templename"]);
      !!envData.envParamMark && !!cell.url && cell.url.indexOf("isTest") < 0 && (cell.url += (cell.url.indexOf("?") < 0 ? "?" : "&") + envData.envParamMark);
      !!cell.subTypes && !!cell.subTypes.length && cell.subTypes.map(function (subCell) {
        !!envData.envParamMark && !!subCell.url && subCell.url.indexOf("isTest") < 0 && (subCell.url += (subCell.url.indexOf("?") < 0 ? "?" : "&") + envData.envParamMark);
        !!subCell.url && urlReplacement.map(function (item) {
          subCell.url = subCell.url.replace(item.target, item.replacement);
        });
      });
    });
    itemIndexToBeRemove.map(function (idx, index) {
      res.data.splice(idx - index, 1);
    });
  }
};
export default handle;
