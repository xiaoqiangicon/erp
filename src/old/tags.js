/**
 * Created by yizhi on 2016/7/20.
 */
var Douban = {};
Douban.EventMonitor = function () {
    this.listeners = new Object()
};
var event_monitor = new Douban.EventMonitor();
function load_event_monitor(root,name) {
    var re = /a_(\w+)/;
    var fns = {};
    $(".j", root).each(function (i) {
        var m = re.exec(this.className);
        if (m) {
            var actionName = m[1],
                f = fns[actionName];
            if (!f) {
                f=null;
                f = eval("Douban.init_" + actionName);
                debugger;
                fns[actionName] = f

            }
            f && f(this,name);
        }
    })
}
Douban.init_interest_form = function (b,name) {
    //alert(name);
    var k = $(b),
        d = {},
        e = {},
        h = $(".share-label", b);
    //if (k.data("bind") === "true") {
    //} else {
    //    k.data("bind", "true")
    //}
    var j = function (n) {
        if (d[n]) {
            e[n] = true;
            $.each(d[n],
                function (p, o) {
                    $(o).removeClass("gract").addClass("rdact")
                })
        }
    };
    var g = function (n) {
        if (d[n]) {
            delete e[n];
            $.each(d[n],
                function (p, o) {
                    $(o).removeClass("rdact").addClass("gract")
                })
        }
    };
    var c = function () {
        //alert(name);
        var n = $.trim(b[name].value.toLowerCase()).split(" "),
            o = {};
        $.each(n,
            function (q, p) {
                if (p != "") {
                    j(p);
                    o[p] = true
                }
            });
        for (t in e) {
            if (!o[t]) {
                g(t)
            }
        }
    };
    var l = function () {
        var n = $("#inp-private"),
            o = n.parents("form").find(".share-label");
        debugger;
        checked = n.attr("checked");
        if (checked) {
            o.addClass("greyinput").find("input").each(function (p, q) {
                q.__checked = q.checked;
                q.disabled = true;
                q.checked = false
            })
        } else {
            o.removeClass("greyinput").find("input").each(function (p, q) {
                if ("__checked" in q) {
                    q.checked = q.__checked
                }
                q.disabled = false
            })
        }
    };
    var f = function (p) {
        var o = p.data.key,
            n = $("body").data(o);
        if (n == true) {
            n = false
        } else {
            n = true
        }
        $("body").data(o, n)
    };
    c();

    var jj =function(){
        $(".tagbtn", b).each(function (o) {
            var n = $(this).text().toLowerCase();
            if (d[n]) {
                d[n].push(this)
            } else {
                d[n] = [this]
            }
        }).unbind("click").click(function () {
            var n = $(this).text();
            var p = $.trim(b[name].value).split(" "),
                s = false,
                o = n.toLowerCase(),
                q;
            p = $.grep(p,
                function (v, u) {
                    if (v.toLowerCase() == o) {
                        g(o);
                        s = true;
                        return false
                    } else {
                        return true
                    }
                });
            if (!s) {
                p.push(n);
                j(o)
            }
            var r = p.join(" ");
            b[name].value = (r.length > 1) ? r + " " : r;
            b[name].focus();
        });
    };
    jj();
    c();
    var ss=function(){
        $(b[name]).keyup(c)
    };
    ss();
};
//$(function () {
//    load_event_monitor(document,"inherit");
//
//});
//$(function(){
//    load_event_monitor(document,"interestedWork");
//});

window.Douban = Douban;
