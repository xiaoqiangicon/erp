/**
 * @author senntyou <jiangjinbelief@163.com>
 */

const $ = require('jquery');
const seeView = require('see-view');
const zzhUtil = require('@zzh/util');

const checkStartEndDate = require('util/check_start_end_date');
const dialog = require('util/dialog');

let data = require('./data');
let requestList = require('./util/request_list');

seeView({
    events: {
        // 点击搜索
        'click #main-search': 'onClickMainSearch',
        // 点击导出
        'click #main-export': 'onClickMainExport'
    },
    // 点击搜索
    onClickMainSearch: e => {
        let startDate = $('[data-date-input="1"]').val();
        let endDate = $('[data-date-input="2"]').val();

        if (!checkStartEndDate(startDate, endDate)) {
            dialog('开始时间不能大于结束时间，请重新选择');
            return;
        }

        data.search.startDate = startDate;
        data.search.endDate = endDate;

        requestList();
    },
    // 点击导出
    onClickMainExport: e => {
        let startDate = $('[data-date-input="1"]').val();
        let endDate = $('[data-date-input="2"]').val();

        if (!checkStartEndDate(startDate, endDate)) {
            dialog('开始时间不能大于结束时间，请重新选择');
            return;
        }

        location.href = `/zzhadmin/charityOrderList/?charityId=${zzhUtil.urlParams.id}&startTime=${startDate}&endTime=${endDate}`;
    }
});

