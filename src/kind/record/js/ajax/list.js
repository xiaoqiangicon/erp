import seeAjax from 'see-ajax';
import zzhUtil from '../../../../../old-com/util/src';
const requestKeys = {
  page: 'pageNum',
  startDate: 'startTime',
  endDate: 'endTime',
};
const responseRefactor = {
  data: [
    {
      name: 'nickName',
      avatar: 'headImg',
      money: 'price',
      time: 'addTime',
    },
  ],
};
const preHandle = req => {
  req.charityId = zzhUtil.urlParams.id;
  req.pageNum -= 1;
  req.pageSize = 20;
};
const postHandle = res => {
  res.totalPages = Math.ceil((res.total || 0) / 20);
};
seeAjax.config('list', {
  url: [
    '/zzhadmin/charityOrderList/',
    '/src/kind/record/data/list_server.json',
    '/src/kind/record/data/list.json',
  ],
  requestKeys: [requestKeys, requestKeys],
  responseRefactor: [responseRefactor, responseRefactor],
  preHandle: [preHandle, preHandle],
  postHandle: [postHandle, postHandle],
});
