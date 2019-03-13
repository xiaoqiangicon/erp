/**
 * Created by Linfe on 2017/3/23.
 */
define(['juicer'], function() {
  var appConfig = {
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
  };
  // url
  appConfig.urls = appConfig.urls || {};
  // url列表
  var commodityList = [
      '/zzhadmin/getCommodityNameList/',
      '/src/buddhist/mock/commodity_list_get_data.json',
    ],
    commoditySelectionList = [
      '/zzhadmin/getCommoditySubtypeList/',
      '/src/buddhist/mock/selection_list_get_data.json',
    ],
    printerList = [
      '/zzhadmin/getPrinterList/',
      '/src/buddhist/mock/printer_list.json',
    ],
    printerStatus = [
      '/zzhadmin/getPrinterStatus/',
      '/src/buddhist/mock/printer_status.json',
    ],
    printOrders = [
      '/zzhadmin/printAppointOrder/',
      '/src/buddhist/mock/print_orders.json',
    ],
    // 批量处理订单接口
    finishMultiOrder = [
      '/zzhadmin/finishMoreOrder/',
      '/src/buddhist/mock/finish_multi_order.json',
    ],
    unFinishMultiOrder = [
      '/zzhadmin/finishMoreOrder/',
      '/src/buddhist/mock/un_finish_multi_order.json',
    ],
    finishOrder = [
      '/zzhadmin/finishOrder/',
      '/src/buddhist/mock/finish_order.json',
    ],
    orderList = [
      '/zzhadmin/ceremonyGetList/',
      '/src/buddhist/mock/order_list.json',
    ],
    updateFeedBackPic = ['/zzhadmin/updateDisposePic/', ''];

  // 标签url
  appConfig.urls.order = {};
  appConfig.urls.order.commodity = commodityList[appConfig.environment];
  appConfig.urls.order.selection =
    commoditySelectionList[appConfig.environment];
  appConfig.urls.order.printer = printerList[appConfig.environment];
  appConfig.urls.order.status = printerStatus[appConfig.environment];
  appConfig.urls.order.printOrder = printOrders[appConfig.environment];

  // 订单处理接口
  appConfig.urls.order.finishMulti = finishMultiOrder[appConfig.environment];
  // appConfig.urls.order.unFinishMulti = unFinishMultiOrder[appConfig.environment];
  appConfig.urls.order.finish = finishOrder[appConfig.environment];

  appConfig.urls.order.list = orderList[appConfig.environment];
  appConfig.urls.order.updateFBP = updateFeedBackPic[appConfig.environment];
  // 模板组件
  appConfig.template = appConfig.template || {};
  appConfig.template.component = {};
  // 订单详情模板
  appConfig.template.component.orderDetailBox_tmp = [
    '<p class="fwb">${productName}</p>',
    '<hr>',
    '<p><span>规格：</span><span id="productSize">${productSize}</span></p>',
    '<p><span>数量：</span><span id="buy_num">${buy_num}</span></p>',
    '<p><span>支付：</span><span id="price">${price}</span></p>',
    '<p><span>下单时间：</span><span id="orderTime">${orderTime}</span></p>',
    '<p id="orderNumberBox"><span>订单号：</span><span id="order_number">${order_number}</span></p>',
    '<p id="accomplishTimeBox" class="hide"><span>完成时间：</span><span id="accomplishTime">${accomplish_time}</span></p>',
    '<p><span>外部订单号：</span><span id="outer_order_number">${outer_order_number}</span></p>',
    '<p><span>支付流水号：</span><span id="running_number">${running_number}</span></p>',
    '{@if order_qrcode != ""}',
    '<p>',
    '<p><span>订单二维码: </span></p>',
    '<span id="order_qrcode"></span>',
    '</p>',
    '{@/if}',
    '<hr>',

    '{@if dispose_pic_url != ""}',
    '<p class="fwb">反馈图：</p>',
    '<div class="mgb10 images-content" data-id="${id}">',
    '{@each images as image}',
    '<div class="image-cell" data-type="feedback_item" data-src="${image}" data-image-cell="1">',
    '<img src="${image}" data-ele="feedback-image" data-image-cell-image="1">',
    '<button class="clean-button image-cell-delete" data-image-cell-delete="1">X</button>',
    '</div>',
    '{@/each}',
    '</div>',
    '<p class="upload_wrap inline-block" id="feed_back_pic_box">',
    '<a class="myupload upload_box" href="javascript:;">',
    '<span id="upload_feed_back_pic_${id}" data-action="upload_feed_back_pic" data-id="${id}" class="picture">点击添加</span>',
    '</a>',
    '</p>',
    '{@else}',
    '<p class="fwb">反馈图：</p>',
    '<img id="feed_back_pic" src="https://pic.zizaihome.com/9ccf25dc-23a1-11e9-9b75-00163e0c001e.jpg" width="100" height="100"/>',
    '<div class="mgb10 images-content" data-id="${id}">',
    '</div>',
    '<p class="upload_wrap inline-block" id="feed_back_pic_box">',
    '<a class="myupload upload_box" href="javascript:;">',
    '<span id="upload_feed_back_pic_${id}" data-action="upload_feed_back_pic" data-id="${id}" class="picture">点击上传</span>',
    '</a>',
    '</p>',
    '{@/if}',
    '<hr>',

    '<p class="fwb">反馈视频</p>',
    '{@if dispose_video_url !== ""}',
    '{@each videos as video, index}',
    '<div class="video-cell" data-ele="video-cell">',
    '<video src="${video}" data-ele="video"></video>',
    '<img class="video-play" data-ele="video-play" src="https://pic.zizaihome.com/7788d7f2-8007-11e8-b517-00163e0c001e.png">',
    '</div>',
    '{@/each}',
    '{@else}',
    '暂无反馈视频',
    '{@/if}',
    '<hr>',

    '<p class="fwb">附言信息</p>',
    '<div class="customList">',
    '{@if posiscript.length>0}',
    '{@each posiscript as item,index}',
    '{@if item.type == 14 && item.value != ""}',
    '<p class="single_info single_image_info"><span class="fl">${item.name}：</span>',
    '{@each item.value.split(",") as subItem,subIndex}',
    '<img class="breakLine postScriptImage" data-type="postScriptImage" src="${subItem}">',
    '{@/each}',
    '</p>',
    '{@else}',
    '<p class="single_info"><span class="fl">${item.name}：</span><span class="breakLine">${item.value}</span></p>',
    '{@/if}',
    '{@/each}',
    '{@/if}',
    '</div>',
    '<hr>',

    '<p class="fwb">功德主信息</p>',
    '{@if user.name!= "" || user.name!= null}',
    '<p class="single_info"><span class="fl">购买人：</span><span id="customerName" class="breakLine">${user.name}</span></p>',
    '{@/if}',
    '{@if user.mobile!= "" || user.mobile!= null}',
    '<p class="single_info"><span class="fl">联系手机：</span><span id="customerTel" class="breakLine">${user.mobile}</span></p>',
    '{@/if}',
    // '{@if user.address!= "" || user.address!= null}',
    // '<p class="single_info"><span class="fl">地址：</span><span id="customerAddress" class="breakLine">${user.address}</span></p>',
    // '{@/if}'
  ].join(' ');
  // 统计列表模板
  appConfig.template.component.all_list = [
    '{@if data.length>0}',
    '{@each data as item,index}',
    '<tr>',
    '<td style="width:10px"><input name="order_id" class="orderCheck" type="checkbox" value="${item.id}" /></td>',
    '<td class="nowrapBox">',
    '<div style="text-align: left">',
    '<img src="${item.productImg} " class="productImg" style="float: left" alt="商品图片"/>',
    '<p title="${item.productName}">${item.productName}</p>',
    '<p title="${item.productSize}">${item.productSize}</p>',
    '</div>',
    '</td>',
    '<td><p style="margin-bottom: 2px">${item.customerName}</p><p>${item.customerTel}</p></td>',
    '<td><p>${item.buy_num}</p></td>',
    '<td><p>${item.productSumPrice}</p></td>',
    '<td><p>${item.orderTime}</p></td>',
    '{@if item.is_print === 1}',
    '<td><p>已打印</p></td>',
    '{@else}',
    '<td><p>未打印</p></td>',
    '{@/if}',
    '<td><p class="green proDetail" data-id="${item.id}" data-pagename="${pageName}" data-toggle="modal" data-target="#orderDetailModal">详情</p></td>',
    '</tr>',
    '{@/each}',
    '{@/if}',
  ].join(' ');
  // 小票打印中的打印机列表模板
  appConfig.template.component.print_list = [
    '{@each data as item, index}',
    '<div class="printer_div mgt10">',
    '<input type="checkbox" class="printer_checkbox" data-id="${item.id}" data-type="printer_div">',
    '<span class="printer_content">${item.address}</span>',
    '<span data-type="exception_tip" class="exception_tip mgl10"></span>',
    '</div>',
    '{@/each}',
  ].join(' ');
  appConfig.template.component.imageCell = [
    '<div class="image-cell" data-type="feedback_item" data-src="${image}" data-image-cell="1">',
    '<img src="${image}" data-image-cell-image="1" data-ele="feedback-image">',
    '<button class="clean-button image-cell-delete" data-image-cell-delete="1">X</button>',
    '</div>',
  ].join('');
  return appConfig;
});
