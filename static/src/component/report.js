/**
 * @author senntyou <jiangjinbelief@163.com>
 */


let $ = require('jquery');
let env = require('../util/env');

// 只有正式机才上报错误
if (env.serverEnv === 3) {
    let title = $('title').html();
    let send = function (data) {
        // userAgent
        data.userAgent = window.navigator.userAgent;
        // location.href
        data.locationHref = window.location.href;
        // cookie
        data.cookie = window.document.cookie;

        $.post('/log/web', {title: title, content: JSON.stringify(data)}, function (res) {}, 'json');
    };

    $.ajaxSetup({
        complete: function (jqXHR, textStatus) {
            if (jqXHR.status === 200) return;

            var data = {
                type: 'ajaxError',
                status: jqXHR.status,
                statusText: jqXHR.statusText,
                readyState: jqXHR.readyState,
                responseText: jqXHR.responseText
            };

            send(data);
        }
    });

    window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
        var data = {
            type: 'scriptError',
            errorMessage: errorMessage,
            scriptURI: scriptURI,
            lineNumber: lineNumber,
            columnNumber: columnNumber,
            detailMessage: errorObj && errorObj.message || '',
            stack: errorObj && errorObj.stack || ''
        };

        send(data);
    };
}