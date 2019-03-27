define([], function() {
  // 选择项附言模板
  // type 1 普通选择项
  // type 2 往生选择项 inputType 10 阳上人 11 往生者
  // type 3 祈福选择项 inputType 12 功德芳名 15 心愿
  // type 4 快递选择项 inputType 4 联系人 5 手机号码 6 地址

  // 前两列
  const td12 = `
    {@if subType == 3}
      {@if inputType == 12}
        <td style="line-height: 36px;text-align: center">可视化项</td>
        <td class="text-center"><img class="spcl-sub-ps-preview" data-ele="preview-spcl-sub-ps" src="https://pic.zizaihome.com/7d424d78-0d6f-11e8-8feb-00163e0c001e.png" data-index="12" data-src="https://pic.zizaihome.com/478059f6-0bfc-11e8-91da-00163e0c001e.png" alt="功德芳名"></td>
      {@else if inputType == 15}
        <td style="line-height: 36px;text-align: center">可视化项</td>
        <td class="text-center"><img class="spcl-sub-ps-preview" data-ele="preview-spcl-sub-ps" src="https://pic.zizaihome.com/7d424d78-0d6f-11e8-8feb-00163e0c001e.png" data-index="15" data-src="https://pic.zizaihome.com/574a0f44-0bfc-11e8-91da-00163e0c001e.png" alt="心愿"></td>
      {@else}
        <td class="sortable-handle" style="cursor: pointer;line-height: 36px;text-align: center"><img src="https://pic.zizaihome.com/bb8ca7d8-23a1-11e9-9b75-00163e0c001e.png" data-id="\${inputId}" alt="换位置"></td>
        <td>
          <select name="additionType" class="additionType sizePosSelect selectpicker" data-cid="\${cid}">
            <option value="4">联系人</option>
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
      {@/if}
    {@else if subType == 2}
      {@if inputType == 10}
        <td style="line-height: 36px;text-align: center">可视化项</td>
        <td class="text-center"><img class="spcl-sub-ps-preview" data-ele="preview-spcl-sub-ps" src="https://pic.zizaihome.com/7b7c6276-0d6f-11e8-8feb-00163e0c001e.png" data-index="10" data-src="https://pic.zizaihome.com/fd4dd4da-0bfb-11e8-91da-00163e0c001e.png" alt="阳上人"></td>
      {@else if inputType == 11}
        <td style="line-height: 36px;text-align: center">可视化项</td>
        <td class="text-center"><img class="spcl-sub-ps-preview" data-ele="preview-spcl-sub-ps" src="https://pic.zizaihome.com/7b7c6276-0d6f-11e8-8feb-00163e0c001e.png" data-index="11" data-src="https://pic.zizaihome.com/0b34c996-0bfc-11e8-91da-00163e0c001e.png" alt="往生者"></td>
      {@else}
        <td class="sortable-handle" style="cursor: pointer;line-height: 36px;text-align: center"><img src="https://pic.zizaihome.com/bb8ca7d8-23a1-11e9-9b75-00163e0c001e.png" data-id="\${inputId}" alt="换位置"></td>
        <td>
          <select name="additionType" class="additionType sizePosSelect selectpicker" data-cid="\${cid}">
            <option value="4">联系人</option>
            <option value="12">功德芳名</option>
            <option value="15">心愿</option>
            <option value="8">性别</option>
            <option value="9">出生日期</option>
            <option value="5">手机号码</option>
            <option value="6">地址</option>
            <option value="13">自定义-提示框</option>
            <option value="1">自定义-单行文本框</option>
            <option value="2">自定义-日期选择</option>
            <option value="3">自定义-下拉列表</option>
            <option value="7">自定义-多行文本框</option>
            <option value="14">自定义-图片上传</option>
          </select>
        </td>
      {@/if}
    {@else if subType == 4}
      {@if inputType == 4 || inputType == 5 || inputType == 6}
        <td style="line-height: 36px;text-align: center">固定项</td>
        <td class="text-center">邮寄佛事</td>
      {@else}
        <td class="sortable-handle" style="cursor: pointer;line-height: 36px;text-align: center"><img src="https://pic.zizaihome.com/bb8ca7d8-23a1-11e9-9b75-00163e0c001e.png" data-id="\${inputId}" alt="换位置"></td>
        <td>
          <select name="additionType" class="additionType sizePosSelect selectpicker" data-cid="\${cid}">
            <option value="12">功德芳名</option>
            <option value="15">心愿</option>
            <option value="8">性别</option>
            <option value="9">出生日期</option>
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
      {@/if}
    {@else}
      <td class="sortable-handle" style="cursor: pointer;line-height: 36px;text-align: center"><img src="https://pic.zizaihome.com/bb8ca7d8-23a1-11e9-9b75-00163e0c001e.png" data-id="\${inputId}" alt="换位置"></td>
      <td>
        <select name="additionType" class="additionType sizePosSelect selectpicker" data-cid="\${cid}">
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
    {@/if}
  `;

  // 第三列
  const td3 = `
    <td class="tac">
      {@if 
        ((subType == 2) && (inputType == 10 || inputType == 11)) || 
        ((subType == 3) && (inputType == 12 || inputType == 15)) ||
        ((subType == 4) && (inputType == 4 || inputType == 5 || inputType == 6))
      }
        \${name}
      {@else if inputType == 13}
        <input type="text" class="form-control sizeAdditionName" data-cid="\${cid}" value="" disabled="disabled">
      {@else}
        <input type="text" class="form-control sizeAdditionName" data-cid="\${cid}" maxlength="30" value="\${name}" placeholder="请输入不超过30个文字">
      {@/if}
    </td>
  `;

  // 第四列
  const td4 = `
    <td>
      {@if inputType == 2 || inputType == 9}
        <div class="col-sm-12" style="width: 100%;padding: 0">
        <span class="preview">\${name}</span>
        <input type="text" class="form-control datePreview birthday_icon" data-cid="\${cid}" disabled="disabled">
        </div>
      {@else if inputType == 3}
        <span class="preview">\${name}</span>
        {@if dataType == 1}
          <select name="additionTypes" class="additionTypes selectpicker" data-cid="\${cid}" multiple>
        {@else}
          <select name="additionTypes" class="additionTypes selectpicker" data-cid="\${cid}">
        {@/if}
        {@each selectInput as item, index}
          <option>\${item}</option>
        {@/each}
        </select>
      {@else}
        <span class="preview">\${name}</span>
        <input type="text" class="form-control additionPreview"
        data-cid="\${cid}" placeholder="\${prompt_text}" disabled="disabled">
      {@/if}
    </td>
  `;

  // 第五列
  const td5 = `
  <td style="line-height: 34px;text-align: center">
    {@if 
      (subType == 3 && (inputType == 12 || inputType == 15)) || 
      (subType == 2 && (inputType == 10 || inputType == 11)) ||
      ((subType == 4) && (inputType == 4 || inputType == 5 || inputType == 6))
    }
      <span class="green tagbtn additionOperation">
      <span class="sizeAdditionInputSetting " data-toggle="modal" data-target="#inputSizeAdditionModal" data-cid="\${cid}">设置</span>
      </span>
    {@else if inputType == 2 || inputType == 9}
      <span class="green tagbtn additionOperation">
      <span class="sizeAdditionDateSetting " data-toggle="modal" data-target="#dateSizeAdditionModal" data-cid="\${cid}">设置</span>
      --<span class="sizesAdditionRemove" data-cid="\${cid}">删除</span></span>
    {@else if inputType == 8}
      <span class="green tagbtn additionOperation">
      <span class="sizeAdditionRadioSetting" data-toggle="modal" data-target="#radioSizeAdditionModal" data-cid="\${cid}">设置</span>--
      <span class="sizesAdditionRemove" data-cid="\${cid}">删除</span></span>
    {@else if inputType == 3}
      <span class="green tagbtn additionOperation">
      <span class="sizeAdditionSelectSetting" data-toggle="modal" data-target="#selectSizeAdditionModal" data-cid="\${cid}">设置</span>--
      <span class="sizesAdditionRemove" data-cid="\${cid}">删除</span></span>
    {@else if inputType == 13}
      <span class="green tagbtn additionOperation">
      <span class="sizeAdditionInstuctSetting" data-toggle="modal" data-target="#instuctSizeAdditionModal" data-cid="\${cid}">设置</span>--
      <span class="sizesAdditionRemove" data-cid="\${cid}">删除</span></span>
    {@else if inputType == 14}
      <span class="green tagbtn additionOperation">
      <span class="sizeAdditionImagesSetting" data-toggle="modal" data-target="#imagesSizeAdditionModal" data-cid="\${cid}">设置</span>--
      <span class="sizesAdditionRemove" data-cid="\${cid}">删除</span></span>
    {@else}
      <!--1 4 5 6 7 10 11 12 15自定义单行文本框 联系人 手机号码 地址 自定义多行文本框 阳上人 往生者 功德芳名 心愿  => 调用单行文本狂-->
      <span class="green tagbtn additionOperation"><span class="sizeAdditionInputSetting " data-cid="\${cid}" data-toggle="modal" data-target="#inputSizeAdditionModal">设置</span>--
      <span class="sizesAdditionRemove" data-cid="\${cid}">删除</span></span>
    {@/if}
    </td>
  `;

  const tpl = td12 + td3 + td4 + td5;

  return tpl;
});
