import Toast from './toast';

    Date.prototype.format = function(fmt){
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ?
                    (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }

    var getMonthFirstDay = function(){
        var date_ = new Date();
        date_.setDate(1);
        var firstdate = date_.format('yyyy-MM-dd');
        return firstdate;
    }

    var Utils = {
        isEmpty : function (v) {
            switch (typeof v) {
                case 'undefined':
                    return true;
                case 'string':
                    if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
                    break;
                case 'boolean':
                    if (!v) return true;
                    break;
                case 'number':
                    if (0 === v || isNaN(v)) return true;
                    break;
                case 'object':
                    if (null === v || v.length === 0) return true;
                    for (var i in v) {
                        return false;
                    }
                    return true;
            }
            return false;
        },
        //验证是电话号码是否正确
        _isPhoneNumber : function(_tel){
            return /^1(5[0-35-9]|8[0-9]|3[0-9]|47)\d{8}$/.test(_tel);
        },
        showPrice : function(fee){
            return (parseInt(fee)/100).toFixed(2);
        },
        getUrlParam : function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        },
        getStr:function(val,defVal){
            if(Utils.isEmpty(val)){
                return defVal;
            }
            return val;
        }
    }


    /*  AJAX   */
    var doRequest = function(cmd, req, handler, errorHandler, ifasync){
        if(typeof (ifasync) == "undefined"){
            var async = true;
        } else {
            var async = ifasync;
        }
        doRequestwithheader(cmd,req,{},handler,errorHandler, async);
    }

    var doReuestWitchButton = function(btn,cmd, req, header,handler, ehandler){
        var cls = "btn-process-submit";
        var obj = $(btn);
        if(obj.hasClass(cls)){
            return false;
        }
        obj.addClass(cls);
        var sucessHandler = function(data){
            obj.removeClass(cls);
            if(handler){
                handler(data);
            }
        };
        var errorHandler = function(xhr, type){
            obj.removeClass(cls);
            if(ehandler){
                ehandler(xhr, type);
            }
        };
        doRequestwithheader(cmd,req,header,sucessHandler, errorHandler);
    };

    var doRequestwithheader = function(cmd, req, header,handler, errorHandler, async){
        $.ajax({
            type: 'POST',
            url: cmd,
            data: JSON.stringify(req),
            dataType: 'json',
            async: async,
            timeout: 180000,
            headers:header,
            success: function(data){
                cando =true;
                if(data){
                    var result = data.result;
                    var msg 	= data.msg;
                    if(result >= 0){
                        handler( data );
                    }else{
                        if(errorHandler){
                            errorHandler(data);
                        }
                        //showMsg(msg);
                        // toastr.error(msg)
                    }
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                /*if(errorHandler){
                    errorHandler(XMLHttpRequest);
                }*/
                //$.pop('网络请求失败，请稍后再试!');
                Toast('网络请求失败，请稍后再试!',0)
            }
        });
    }

    var getRadioCheckValue = function(name){
        var chkObjs = document.getElementsByName(name);
        for(var i=0;i<chkObjs.length;i++){
            if(chkObjs[i].checked){
                return chkObjs[i].value;
            }
        }
        return "";
    }

    var setRadioCheck = function(name,value){
        var chkObjs = document.getElementsByName(name);
        for(var i=0;i<chkObjs.length;i++){
            $(chkObjs[i]).parent().removeClass("checked");
            $(chkObjs[i]).attr("checked","");
        }
        for(var i=0;i<chkObjs.length;i++){
            if(chkObjs[i].value == value){
                $(chkObjs[i]).parent().addClass("checked");
                $(chkObjs[i]).attr("checked","checked");
                break;
            }
        }
    }

    var sleep = function(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    }


    var isEnable = function(param){
        var num = Number(param);
        if(num ==1){
            return "是";
        }else if(num ==2){
            return "否";
        }
        return "未设置";
    }

//点击回车按钮事件
    var clickTheEnter = function(param){
        $(document).keydown(function(e){
            if (!e)
                e = window.event;
            if ((e.keyCode || e.which) == 13) {
                $(param).click();
            }
        })
    }
    export default doRequest;

