import $ from 'jquery';

//冒泡提示信息: msg:提示内容, duration:停留时间,isfadeOut:是否自动隐藏
// status 1表示成功（默认), 0表示失败
var Toast = function(msg, status, duration, isfadeOut) {
    //add by cmj -- start   不让Toast重复显示
    var toastEls = document.getElementsByClassName('toastDiv');
    if (toastEls.length > 0) {
        for (var i = 0; i < toastEls.length; i++) {
            document.body.removeChild(toastEls[i]);
        }
    }
    //add by cmj -- end
    status = isNaN(status) ? 1 : status;
    duration = isNaN(duration) ? 2000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    switch (status){
        // success 绿
        case 1:
            m.style.cssText = "width:60%; min-width:150px; background:#43b548; opacity:0.9; color:#fff; line-height:30px; text-align:center; border-radius:5px;font-size:20px; position:fixed; top:80%; left:20%; z-index:999999;padding:5px";
            break;
        // error 黑
        case 0:
            m.style.cssText = "width:60%; min-width:150px; background:#bd362f; opacity:0.9; color:#fff; line-height:30px; text-align:center; border-radius:5px;font-size:20px; position:fixed; top:80%; left:20%; z-index:999999;padding:5px";
            break
        // warning 橙
        case 2:
            m.style.cssText = "width:60%; min-width:150px; background:#f89406; opacity:0.9; color:#fff; line-height:30px; text-align:center; border-radius:5px;font-size:20px; position:fixed; top:80%; left:20%; z-index:999999;padding:5px";
            break
    }
    m.className = "toastDiv";
    document.body.appendChild(m);
    if (!isfadeOut) {
        setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() {
                //add by cmj -- start   不让Toast重复显示
                var toastEls = document.getElementsByClassName('toastDiv');
                if (toastEls.length > 0) {
                    for (var i = 0; i < toastEls.length; i++) {
                        document.body.removeChild(toastEls[i]);
                    }
                }
                //add by cmj -- end

                // document.body.removeChild(m);
            }, d * 1000);
        }, duration);

    }
    if (isfadeOut) {
        return m;
    }
};
export default Toast;
