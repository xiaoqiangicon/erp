const tpl = `
  <td class="sortable-handle" style="cursor: pointer;line-height: 36px;text-align: center">
    <img src="https://pic.zizaihome.com/bb8ca7d8-23a1-11e9-9b75-00163e0c001e.png" data-id="\${inputId}" alt="换位置">
  </td>
  <td>
    <select name="additionType" class="additionType selectpicker sizePosSelect" data-cid="\${cid}">
      <option value="4">联系人</option>
      <option value="12">功德芳名</option>
      <option value="15">心愿</option>
      <option value="8">性别</option>
      <option value="9">出生日期</option>
      <option value="5">手机号码</option>
      <option value="6">地址</option>
      <option value="10">阳上人</option>
      <option value="11">往生者</option>
      <option value="13">自定义-提示框</option>
      <option value="1">自定义-单行文本框</option>
      <option value="2">自定义-日期选择</option>
      <option value="3">自定义-下拉列表</option>
      <option value="7">自定义-多行文本框</option>
      <option value="14">自定义-图片上传</option>
    </select>
  </td>
  <td>
    {@if inputType==13}
      <input type="text" class="form-control additionName" data-cid="\${cid}" value="" disabled="disabled">
    {@else}
      <input type="text" class="form-control additionName" data-cid="\${cid}" maxlength="30" value="\${name}" placeholder="请输入不超过30个文字">
    {@/if}
  </td>
  <td>
    {@if inputType==2 || inputType==9}
      <div class="col-sm-12" style="width: 100%;padding: 0">
        {@if name}<span class="preview posTitle">\${name}</span>{@/if}
        <input type="text" class="form-control datePreview birthday_icon" style="width: 220px;margin-left: 15px" data-cid="\${cid}" disabled="disabled">
      </div>
    {@else if inputType==3}
      {@if name}<span class="preview posTitle">\${name}</span>{@/if}
      {@if dataType == 1}
        <select name="additionTypes" class="additionTypes selectpicker" data-cid="\${cid}" multiple>
      {@else}
        <select name="additionTypes" class="additionTypes selectpicker" data-cid="\${cid}">
      {@/if}
      {@each selectInput as item, index}<option>\${item}</option>{@/each}</select>
    {@else}
      {@if name}<span class="preview posTitle">\${name}</span>{@/if}
      <input type="text" class="form-control additionPreview" style="width: 220px;margin-left: 15px" data-cid="\${cid}" placeholder="\${prompt_text}" disabled="disabled">
    {@/if}
  </td>
  <td style="line-height: 34px;text-align: center">
    {@if inputType==2 || inputType==9}
      <span class="green tagbtn additionOperation">
        <span class="additionDateSetting" data-toggle="modal" data-target="#dateAdditionModal" data-cid="\${cid}">设置</span>--
        <span class="additionRemove" data-cid="\${cid}">删除</span>
      </span>
    {@else if inputType==8}
      <span class="green tagbtn additionOperation">
        <span class="additionRadioSetting" data-toggle="modal" data-target="#radioAdditionModal" data-cid="\${cid}">设置</span>--
        <span class="additionRemove" data-cid="\${cid}">删除</span>
      </span>
    {@else if inputType==3}
      <span class="green tagbtn additionOperation">
        <span class="additionSelectSetting" data-toggle="modal" data-target="#selectAdditionModal" data-cid="\${cid}">设置</span>--
        <span class="additionRemove" data-cid="\${cid}">删除</span>
      </span>
    {@else if inputType==13}
      <span class="green tagbtn additionOperation">
        <span class="additionInstuctSetting" data-toggle="modal" data-target="#instuctAdditionModal" data-cid="\${cid}">设置</span>--
        <span class="additionRemove" data-cid="\${cid}">删除</span>
      </span>
    {@else if inputType==14}
      <span class="green tagbtn additionOperation">
        <span class="additionImagesSetting" data-toggle="modal" data-target="#imagesAdditionModal" data-cid="\${cid}">设置</span>--
        <span class="additionRemove" data-cid="\${cid}">删除</span>
      </span>
    {@else}
      <span class="green tagbtn additionOperation">
        <span class="additionInputSetting " data-toggle="modal" data-target="#inputAdditionModal"  data-cid="\${cid}">设置</span>--
        <span class="additionRemove" data-cid="\${cid}">删除</span>
      </span>
    {@/if}
  </td>
  `;
export default tpl;
