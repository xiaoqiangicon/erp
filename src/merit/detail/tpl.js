import 'juicer';
var tpl = {
  selectOption: `
        <option value="\${id}">\${name}</option>  
    `,
  cellContainerEmpty: `
        <tr class="cell-content-empty"><td colspan="5">暂无数据</td></tr>
    `,
  tableCell: `
        <tr data-type="single-coupon" id="table-cell-\${id}">
        <td>
        <div class="table-cell-common mgt10">
        <p class="table-cell-buddhist-type nonMargin">\${type}</p>
        </div>
        </td>
        <td>
        <div class="table-cell-buddhist">
        <div class="table-cell-buddhist-text">
        <p class="table-cell-buddhist-title">\${title}</p>
        <p class="table-cell-buddhist-content nonMargin color989898">\${detail}</p>
        </div>
        </div>
        </td>
        <td>
        <div class="table-cell-common">
        <p class="mgt10">¥\${price}</p>
        </div>
        </td>
        <td>
        <div class="table-cell-common">
        <p class="mgt10">\${addTime}</p>
        </div>
        </td>
        <td>
            <div class="table-cell-common mgt10">
                {@if typeId === 2 || typeId === 4}
                <span class="green csp" data-opt="detl" data-typeId="\${typeId}" data-orderId="\${orderId}">详情</span>
                {@/if}
            </div>
        </td>
        </tr>
    `,
  userDetailEmpty: `
        <p><span class="mgl20 mgr20">此功德主暂时未在系统录入过资料,你可在轨迹中查看“详情”寻找</span></p>
    `,
  userDetail: `
        <p><span class="mgl20 mgr20">姓名</span>\${name}
        {@if normal === 1}
        <span style="color:#f96;margin-left: 300px">常用</span>
        {@/if}
        </p>
        <p><span class="mgl20 mgr20">性别</span>{@if sex === 1}男{@else if sex === 2}女{@else}未知{@/if}</p>
        <p><span class="mgl20 mgr20">生辰</span>\${birthday}</p>
        <p><span class="mgl20 mgr20">电话</span>\${mobile}</p>
        <p><span class="mgl20 mgr20">地址</span>\${address}</p>
    `,
  noTagCell: `
        <div>您还未为此用户添加关注分组</div>
    `,
  tagCell: `
        <div class="tag-cell">\${name}</div>    
    `,
  contactCell: `
        <div class="clearfix">
            <p><span>联系人：</span><span>\${name}</span></p>
            <p><span>联系电话：</span><span>\${phone}</span></p>
            {@if birth}<p><span>出生日期：</span><span>\${birth}{@if !!lunar}（农历）{@/if}</span></p>{@/if}
        </div>
    `,
  imgCell: `
        <div class="detail-popup-feed-item" data-feed-image-item="1" data-image="\${image}">
            <img src="\${image}">
        </div>
    `,
  BuddhistOrderDetl: `
        <p class="fwb">\${productName}</p>
        <hr>
        <p><span>规格：</span><span id="productSize">\${productSize}</span></p>
        <p><span>数量：</span><span id="buy_num">\${buy_num}</span></p>
        <p><span>支付：</span><span id="price">\${price}</span></p>
        <p><span>下单时间：</span><span id="orderTime">\${orderTime}</span></p>
        <p id="orderNumberBox"><span>订单号：</span><span id="order_number">\${order_number}</span></p>
        <p id="accomplishTimeBox" class="hide"><span>完成时间：</span><span id="accomplishTime">\${accomplish_time}</span></p>
        <p><span>外部订单号：</span><span id="outer_order_number">\${outer_order_number}</span></p>
        <p><span>支付流水号：</span><span id="running_number">\${running_number}</span></p>
        <p>
        <p>订单二维码：</p>
        <span class="inline-block" id="buddhist-popup-qr-code"></span></p>
        <hr>
        <p><span class="fwb">反馈图片</span></p>
        <div class="clearfix" id="buddhist-popup-feed-images"></div>
        <hr>
        <p class="fwb">附言信息</p>
        <div class="customList">
        {@if posiscript.length>0}
            {@each posiscript as item, index}
                {@if item.type == 14 && item.value != ""}
                <p class="single_info single_image_info"><span class="pull-left">\${item.name}：</span>
                    {@each item.value.split(",") as subItem,subIndex}
                        <img class="breakLine postScriptImage csp" data-action="scaleImg" src="\${subItem}">
                    {@/each}
                </p>
                {@else}
                <p class="single_info"><span class="pull-left">\${item.name}：</span><span class="breakLine">\${item.value}</span></p>
                {@/if}
            {@/each}
        {@/if}
        </div>
        <hr>
        <p class="fwb">功德主信息</p>
        {@if user.name!= "" || user.name!= null}
        <p class="single_info"><span class="pull-left">购买人：</span><span id="customerName" class="breakLine">\${user.name}</span></p>
        {@/if}
        {@if user.mobile!= "" || user.mobile!= null}
        <p class="single_info"><span class="pull-left">联系手机：</span><span id="customerTel" class="breakLine">\${user.mobile}</span></p>
        {@/if}
        <hr>
        <p><span class="fwb">备注</span></p>
        <div id="buddhist-popup-memo"></div>
    `,
};
var compiledTpl = {};
Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
