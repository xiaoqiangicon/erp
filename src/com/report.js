/**
 * js 错误上报组件
 */
import request from 'reqwest';
import { serverEnv } from '../util/env';
import { now, refreshNow } from '../../../pro-com/src/utils';

// 最大上报错误个数
const maxReportCount = 10;
// 已上报错误个数
let reportedCount = 0;
// 上报记录
const logs = [];
// 上次上报时间

let interval;
let errorOccurred = !1;

const report = () => {
  if (reportedCount >= maxReportCount) {
    if (interval) clearInterval(interval);
    return;
  }
  if (!logs.length) return;

  const logsToReport = [];
  while (logs.length) {
    logsToReport.push(logs.shift());
    reportedCount += 1;
    if (reportedCount >= maxReportCount) {
      if (interval) clearInterval(interval);
      break;
    }
  }

  request({
    url: '/webLog/api/errorLog/createMulti',
    method: 'post',
    type: 'json',
    contentType: 'application/json',
    data: JSON.stringify(logsToReport),
    success: res => {
      console.log(res);
    },
  });
};

const start = () => {
  window.onerror = (message, source, line, column, error) => {
    refreshNow();

    logs.push({
      href: window.location.href,
      userAgent: window.navigator.userAgent,
      cookie: window.document.cookie,
      message,
      source,
      line,
      column,
      error: error ? error.message : '',
      stack: error ? error.stack : '',
      time: now.dateTime,
    });

    if (!errorOccurred) {
      errorOccurred = !0;
      // 每隔10秒检查一次
      report();
      interval = setInterval(report, 10000);
    }
  };
};

// 只有正式机才上报错误
if (serverEnv === 3) {
  start();
}
