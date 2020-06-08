const tpl = `
    <td class="sortable-handle" style="cursor: pointer;line-height: 50px;text-align: center" data-id="\${id}">
      <img src="https://pic.zizaihome.com/bb8ca7d8-23a1-11e9-9b75-00163e0c001e.png" alt="换位置">
    </td>
    <td class="tac">
      <select name="sizeType" style="mgl0" class="sizeType selectpicker sizePosSelect" data-cid="\${cid}" \${conversionSubdivide === 1 ? 'disabled' : ''}>
        <option value="1">普通佛事</option>
        <option value="2">往生牌位</option>
        <option value="3">祈福牌位</option>
        <option value="4">邮寄佛事</option>
      </select>
    </td>
    <td>
      <input type="text" class="form-control proSizeName" data-cid="\${cid}" value="\${name}" maxlength="24" placeholder="不超过24个文字" \${conversionSubdivide === 1 ? 'disabled' : ''}>
    </td>
    <td style="position: relative">
      <!--由switch生成dom结构-->
      {@if isSingleMoney === 1}
        <div class="hide" style="display: inline-block; position: absolute; top:0; right:2px; background-color: #fff; border: 1px solid #ddd; border-radius: 20px;">
        <label class="mgb0 pdl10" data-id="autoFinishOrder" data-rid="\${cid}" style="padding:0 1px">自动处理订单：</label>
        <input class="autoFinishSwitch" type="checkbox" \${conversionSubdivide === 1 ? 'disabled' : ''}>
        </div>
      {@else}
        <div style="display: inline-block; position: absolute; top:0; right:2px; background-color: #fff; border: 1px solid #ddd; border-radius: 20px;">
        <label class="mgb0 pdl10" data-id="autoFinishOrder" data-rid="\${cid}" style="padding:0 1px">自动处理订单：</label>
        <input class="autoFinishSwitch" type="checkbox" \${conversionSubdivide === 1 ? 'disabled' : ''}>
        </div>
      {@/if}
      <button type="button" data-id="generateRandomPrice" data-rid="\${cid}" class="btn btn-success backgroundGreen hide" style="position: absolute; top:-10px; right:2px;padding:0 1px" \${conversionSubdivide === 1 ? 'disabled' : ''}>自动生成随喜金额</button>
      <input type="text" id="money\${cid}" name="money\${cid}" class="form-control proPrice" data-cid="\${cid}" data-isAutoFinish="\${isAutoFinish}" placeholder="为0或不填为无需支付" value="\${price}" \${conversionSubdivide === 1 ? 'disabled' : ''}>
    </td>
    <td class="stock_td">
      <input type="number" name="\${cid}" class="form-control proStock" data-cid="\${cid}" value="\${stock}" \${conversionSubdivide === 1 ? 'disabled' : ''}>
    </td>
    <td class="text-center">
      <a class="upload_box" style="height: 50px;margin: 0; position: relative;" href="javascript:;" >
        {@if conversionSubdivide === 1}
          <div style="width: 100%; height: 100%; position: absolute; left: 0; top: 0; z-index: 100; cursor: not-allowed;"></div>
        {@/if}
        <input name="file" data-cid="\${cid}" class="btn btn-sm btn-primary smallPicture" id="sizePic0" style="width:50px;height:50px;opacity: 0; padding: 0" \${conversionSubdivide === 1 ? 'disabled' : ''}/>
      </a>
    </td>
    <td class="text-center">
      <span 
        class="green tagbtn mgr10" 
        data-cid="\${cid}" 
        data-sub-type="\${subdivide_type}" 
        data-toggle="modal" 
        data-target="#sizesPostModal"
        data-ele="tooltip" 
        data-placement="left" 
        title="设置信众参与此项时需填写的信息"
        >
        附言
      </span>
      <span class="green tagbtn" data-cid="\${cid}" data-toggle="modal" data-target="#sub-set-modal">设置</span>
      <br>
      <span class="green tagbtn copyProSize mgr10" data-cid="\${cid}">复制</span>
      
        <span class="green tagbtn removeProSize" data-cid="\${cid}">删除</span>

      <br>
    </td>
  `;
export default tpl;
