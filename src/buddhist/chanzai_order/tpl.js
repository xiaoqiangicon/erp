/**
 * Created by root on 2017/9/13.
 */
require('juicer');

var tpl = {
  selectOption: `
        <option value="\${id}">\${name}</option>
    `,
  cellContainerEmpty: `
        <tr class="cell-content-empty"><td colspan="8">暂无数据</td></tr>
    `,
  tableCell: `
        <tr>
            <td style="width:10px"><input class="select-single-order" type="checkbox" data-id="\${id}" /></td>
            <td class="nowrapBox">
            <div style="text-align: left">
            <img src="\${productImg} " class="productImg" style="float: left" alt="商品图片"/>
            <p title="\${productName}">\${productName}</p>
            <p title="\${productSize}">\${productSize}</p>
            </div>
            </td>
            <td><p style="margin-bottom: 2px">\${customerName}</p><p>\${customerTel}</p></td>
            <td><p>\${buy_num}</p></td>
            <td><p>\${productSumPrice}</p></td>
            <td><p>\${orderTime}</p></td>
            {@if is_print === 1}
                <td><p>已打印</p></td>
            {@else}
                <td><p>未打印</p></td>
            {@/if}
            <td><p class="green pro-detail" data-id="\${id}" data-toggle="modal" data-target="#order-detail-modal">详情</p></td>
        </tr>
    `,
  imageCell: `
        <div class="image-cell" data-id="\${id}" data-src="\${src}" data-type="\${type}">
            <img src="\${src}">
            <button class="clean-button image-cell-delete">X</button>
        </div>
    `,
  noSelectPrinterList: `
    <div class="printer-div mgt10"> 
        <input type="checkbox" class="printer-checkbox" data-id="\${id}"> 
        <span class="printer-name">\${address}</span> 
        <span class="exception-tip mgl10"></span> 
    </div>
    `,
  orderDetail: `
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
        {@if order_qrcode != ""}
        <div class="qrcode-container">
            <p>订单二维码：</p>
            <div id="qrcode" data-src="\${qrcode}"></div>
        </div>
        {@/if}
        <hr>
        
        {@if dispose_pic_url !== ""}
        <p class="fwb">反馈图：</p>
        <div class="mgb10 image-container" data-ele="image-container" data-id="\${id}" style="display: inline-block;vertical-align: top;">
            {@each dispose_pic_url.split(',') as image}
            <div class="image-cell" data-src="\${image}" >
                <img class="csp" data-action="scaleImg" src="\${image}">
                <button class="clean-button image-cell-delete" data-ele="image-cell-delete">X</button>
            </div>
            {@/each}
        </div>
        <p class="upload_wrap">
        <a class="myupload upload_box" href="javascript:;">
        <span class="picture add-feed-back-pic" data-ele="add-feed-back-pic" data-modal="#order-detail-modal">点击添加</span>
        </a>
        </p>
        {@else}
        <p class="fwb">反馈图：</p>
        <div class="image-cell no-feed-back-container" data-src="http://erptest.zizaihome.com/static/images/noPic.jpg" >
            <img class="csp" data-action="scaleImg" src="http://erptest.zizaihome.com/static/images/noPic.jpg">
        </div>
        <div class="mgb10 image-container" data-ele="image-container" data-id="\${id}" style="display: inline-block;vertical-align: top;">
        </div>
        <p class="upload_wrap">
        <a class="myupload upload_box" href="javascript:;">
        <span class="picture add-feed-back-pic" data-ele="add-feed-back-pic" data-modal="#order-detail-modal">点击添加</span>
        </a>
        </p>
        {@/if}
        <hr>
        
        <p class="fwb">附言信息</p>
        <div class="customList">
        {@if posiscript.length>0}
            {@each posiscript as item,index}
                {@if item.type == 14 && item.value != ""}
                <p class="single_info single_image_info"><span class="fl">\${item.name}：</span>
                    {@each item.value.split(",") as subItem,subIndex}
                        <img class="breakLine postScriptImage csp" data-action="scaleImg" src="\${subItem}">
                    {@/each}
                </p>
                {@else}
                <p class="single_info"><span class="fl">\${item.name}：</span><span class="breakLine">\${item.value}</span></p>
                {@/if}
            {@/each}
            </div>
        {@/if}
        <hr>
        
        <p class="fwb">功德主信息</p>
        {@if user.name!= "" || user.name!= null}
        <p class="single_info"><span class="fl">购买人：</span><span id="customerName" class="breakLine">\${user.name}</span></p>
        {@/if}
        {@if user.mobile!= "" || user.mobile!= null}
        <p class="single_info"><span class="fl">联系手机：</span><span id="customerTel" class="breakLine">\${user.mobile}</span></p>
        {@/if}
    `,
};

var compiledTpl = {};

Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});

module.exports = compiledTpl;
