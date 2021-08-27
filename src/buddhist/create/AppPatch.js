import { Message, MessageBox } from 'element-ui';
import { defaultPaySuccessHtml, shareData } from './data';
import { isInt, isPrice } from '../../utils/num';
import { removeTmpFieldDeep } from './utils';
import { numOfDateTime } from '../../../../pro-com/src/utils';

function confirmInt(val, defaultValue) {
  // 未设置，给初始化值
  if (typeof val === 'undefined') return defaultValue;
  if (typeof val === 'boolean') return val ? 1 : 0;
  return parseInt(val, 10);
}

function handleFuYanItem(item) {
  if (item.inputType === 3) {
    /**
     * 提示文字
     *
     * 1. 如果是下拉列表，这里是数组，装载下拉选择项
     * 2. 保存时接口参数是 ['str1', 'str2', ...]
     * 3. 接口时数据是 [{id: 1, name: 'str1'}, {id: 2, name: 'str2'}, ...]
     */
    if (Array.isArray(item.prompt_text)) {
      if (!item.prompt_text.length) item.prompt_text = '';
      else if (typeof item.prompt_text[0] === 'object') {
        item.prompt_text = item.prompt_text.map(i => i.name).join('\n');
      } else item.prompt_text = item.prompt_text.join('\n');
    }
  }

  // 往生者、功德芳名
  if ([11, 12].indexOf(item.inputType) > -1) {
    if ([1, 2, 3, 4, 5, 6].indexOf(item.pic_num) === -1) item.pic_num = 4;
  }
  // 阳上人、往生者、功德芳名
  if ([10, 11, 12].indexOf(item.inputType) > -1) {
    if ([3, 4, 6, 8].indexOf(item.font_length) === -1) item.font_length = 5;
  }
}

function handleGuiGeItem(item) {
  if (typeof item.price === 'undefined') item.price = '';
  else if (typeof item.price === 'number') {
    // 价格需要改成字符串
    item.price = item.price ? item.price + '' : '';
  }
  // 数组价格
  else if (Array.isArray(item.price)) {
    item.price = item.price.join(',');
  }
  // 带前后方括号的价格
  else if (item.price.slice(0, 1) === '[') {
    item.price = item.price.slice(1, -1);
  }

  // -1表示无限制
  if (item.stock === -1) item.stock = '';

  item.name = item.name || '';
  if ([1, 2, 3, 4].indexOf(item.subdivide_type) === -1) item.subdivide_type = 1;
  item.pic = item.pic || '';
  item.isAutoFinish = confirmInt(item.isAutoFinish, 1);

  // 1 天、2 月、3 年
  if (!item.durationDay) {
    item.durationDay = '';
    item._durationDayType = 1;
  } else {
    item.durationDay = parseInt(item.durationDay, 10);
    item._durationDayType = 1;
    if (item.durationDay % 365 === 0) {
      item.durationDay = item.durationDay / 365;
      item._durationDayType = 3;
    } else if (item.durationDay % 30 === 0) {
      item.durationDay = item.durationDay / 30;
      item._durationDayType = 2;
    }
  }

  if (!item.postScript) item.postScript = [];
  item.postScript.forEach(item2 => {
    handleFuYanItem(item2);
  });
}

/**
 * 渲染已有的数据
 * @param s form数据
 * @param isSystemTemplate 是否是系统模板
 * @param isDelay 是否延后加载
 */
export function renderCreatedData(s, isSystemTemplate, isDelay) {
  const d = shareData.createdData;

  s.title = d.title || '';
  s.allow_showVistNum = confirmInt(d.allow_showVistNum, 1);
  s.ceremonyTypeId = parseInt(d.ceremonyTypeId, 10) || null;
  s.pics = d.pics || [];
  s.video = d.video || [];
  s.custom_introduce = d.custom_introduce || '';

  if (isDelay) {
    if (d.subdivideStr && d.subdivideStr.length)
      s.subdivideStr.push(...d.subdivideStr);
    if (d.postScript && d.postScript.length) s.postScript.push(...d.postScript);
  } else {
    s.subdivideStr = d.subdivideStr || [];
    s.postScript = d.postScript || [];
  }

  if (typeof d.price === 'undefined') {
    s.price = '';
    s._needPay = 1;
  } else if (typeof d.price === 'number') {
    // 价格需要改成字符串
    s.price = d.price ? d.price + '' : '';
    s._needPay = s.price ? 1 : 0;
  }
  // 数组价格
  else if (Array.isArray(d.price)) {
    s.price = d.price.join(',');
    s._needPay = 1;
  }
  // 带前后方括号的价格
  else if (d.price.slice(0, 1) === '[') {
    s.price = d.price.slice(1, -1);
    s._needPay = 1;
  }

  s.isAutoFinish = confirmInt(d.isAutoFinish, 1);
  // -1表示无限制
  s.stock = d.stock === -1 ? '' : d.stock;
  s.opName = d.opName || '';
  s.showClient = confirmInt(d.showClient, 1);

  s.showStatictics = confirmInt(d.showStatictics, 1);
  if (s.showStatictics > 0) {
    s._showStat = 1;
    s._statStyle = s.showStatictics;
  } else {
    s._showStat = 0;
    s._statStyle = 1;
  }

  s.targetAmount = d.targetAmount || '';
  s.startTime = d.startTime || '';
  s.endTime = d.endTime || '';
  s.showEndTime = confirmInt(d.showEndTime, 0);

  s.feedbackType = confirmInt(d.feedbackType, 1);
  if (s.feedbackType > 0) {
    s._showFeedback = 1;
  } else {
    s._showFeedback = 0;
    s.feedbackType = 1;
  }

  s.pay_succ_details_flag = confirmInt(d.pay_succ_details_flag, 0);
  if (!isSystemTemplate) {
    s.detail = d.detail || '';
    s.payDetail = d.payDetail || '';
  } else {
    s.detail = d.details || '';
    s.payDetail = d.pay_succ_details || '';
  }

  // 嵌套数据出炉
  s.subdivideStr.forEach(item => {
    handleGuiGeItem(item);
  });
  s.postScript.forEach(item => {
    handleFuYanItem(item);
  });
}

function checkFuYanItem(item, index, guiGeIndex) {
  const guiGeSeqText = `第${guiGeIndex + 1}个选择项的`;
  let seqText = `第${index + 1}个附言的`;
  let seqText2 = `第${index + 1}个附言，`;
  if (typeof guiGeIndex !== 'undefined') {
    seqText = guiGeSeqText + seqText;
    seqText2 = guiGeSeqText + seqText2;
  }

  if (item.inputType !== 13 && !item.name) {
    MessageBox.alert(`请填写${seqText}标题！`);
    return false;
  }

  // 图片、提示、下拉、心愿
  if (item.inputType === 3) {
    /**
     * 提示文字
     *
     * 1. 如果是下拉列表，这里是数组，装载下拉选择项
     * 2. 保存时接口参数是 ['str1', 'str2', ...]
     * 3. 接口时数据是 [{id: 1, name: 'str1'}, {id: 2, name: 'str2'}, ...]
     */
    const selections = item.prompt_text
      .split('\n')
      .map(s => s.trim())
      .filter(s => !!s);
    if (selections.length < 2) {
      MessageBox.alert(`${seqText2}请至少输入2个选择项`);
      return false;
    }

    item.prompt_text = selections;
  }
  if (item.inputType === 13 && !item.prompt_text) {
    MessageBox.alert(`请输入${seqText}提示内容`);
    return false;
  }

  if (item.inputType === 14) {
    if (!isInt(item.pic_num) || parseInt(item.pic_num) < 1) {
      MessageBox.alert(`${seqText2}最大上传数需输入大于0的整数`);
      return false;
    }
  }
  if (item.inputType === 15) {
    if (!isInt(item.font_length) || parseInt(item.font_length) < 1) {
      MessageBox.alert(`${seqText2}填写字数需输入大于0的整数`);
      return false;
    }
  }

  return true;
}

function checkGuiGeItem(item, index) {
  const seqText = `第${index + 1}个选择项的`;

  if (!item.name) {
    MessageBox.alert(`请填写${seqText}选择项名称！`);
    return false;
  }

  if (!item.price) item.price = 0;
  else {
    // 中文逗号换成英文逗号，去除所有空格
    item.price = item.price.replace(/，/g, ',').replace(/\s+/g, '');
    const prices = item.price.split(',');
    for (let i = 0, il = prices.length; i < il; i++) {
      const price = prices[i];
      if (!isPrice(price)) {
        MessageBox.alert(`${seqText}价格 ${price} 不合法，请重新输入！`);
        return false;
      }
    }

    // 如果是逗号分隔的多个随喜价格，前后需要用方括号包裹
    if (prices.length > 1) item.price = '[' + item.price + ']';
  }

  if (item.stock || item.stock === 0) {
    if (!isInt(item.stock) || parseInt(item.stock, 10) < 0) {
      MessageBox.alert(`${seqText}库存需输入大于或等于0的整数，请重新添加！`);
      return false;
    }
    item.stock = parseInt(item.stock, 10);
  }
  // 不填表示无限制，用 -1 表示
  else item.stock = -1;

  // 1 天、2 月、3 年
  if (!item.durationDay) item.durationDay = 0;
  else {
    item.durationDay = parseInt(item.durationDay, 10);
    if (item._durationDayType === 2) item.durationDay *= 30;
    else if (item._durationDayType === 3) item.durationDay *= 365;
  }

  for (let i = 0, il = item.postScript.length; i < il; i++) {
    const fuYan = item.postScript[i];
    if (!checkFuYanItem(fuYan, i, index)) return false;
  }

  return true;
}

// 生成用于提交的数据
export function generateSubmitData(form) {
  // 复制一份数据，不要在原来的数据上改
  const s = JSON.parse(JSON.stringify(form));

  if (!s.title) {
    MessageBox.alert('请填写标题！');
    return false;
  }

  if (!s.ceremonyTypeId) {
    MessageBox.alert('请添加佛事分类！');
    return false;
  }

  if (!s.pics.length) {
    MessageBox.alert('请至少添加一张封面图！');
    return false;
  }

  if (!s.pics.length) {
    MessageBox.alert('请至少添加一张封面图！');
    return false;
  }

  if (!s.detail) {
    MessageBox.alert('请添加详情！');
    return false;
  }

  // 有选择项
  if (s.subdivideStr.length) {
    for (let i = 0, il = s.subdivideStr.length; i < il; i++) {
      const guiGe = s.subdivideStr[i];
      // 添加sort字段
      guiGe.sort = i;

      if (!checkGuiGeItem(guiGe, i)) return false;
    }

    s.price = 0;
  }
  // 无选择项
  else {
    if (!s._needPay) s.price = 0;
    else {
      if (!s.price) {
        MessageBox.alert('请添加支付价格！');
        return false;
      }

      // 中文逗号换成英文逗号，去除所有空格
      s.price = s.price.replace(/，/g, ',').replace(/\s+/g, '');
      const prices = s.price.split(',');
      for (let i = 0, il = prices.length; i < il; i++) {
        const price = prices[i];
        if (!isPrice(price)) {
          MessageBox.alert(`价格 ${price} 不合法，请重新输入！`);
          return false;
        }
      }

      // 如果是逗号分隔的多个随喜价格，前后需要用方括号包裹
      if (prices.length > 1) s.price = '[' + s.price + ']';
    }
  }

  if (s.stock || s.stock === 0) {
    if (!isInt(s.stock) || parseInt(s.stock, 10) < 0) {
      MessageBox.alert('库存需输入大于或等于0的整数，请重新添加！');
      return false;
    }
    s.stock = parseInt(s.stock, 10);
  }
  // 不填表示无限制，用 -1 表示
  else s.stock = -1;

  for (let i = 0, il = s.postScript.length; i < il; i++) {
    const fuYan = s.postScript[i];
    if (!checkFuYanItem(fuYan, i)) return false;
  }

  if (!s.opName) s.opName = '随喜功德';

  if (!s._showStat) s.showStatictics = 0;
  else s.showStatictics = s._statStyle;

  // 众筹样式
  if (s.showStatictics === 2) {
    if (!s.targetAmount) {
      MessageBox.alert('请添加目标筹款金额！');
      return false;
    }
    if (!isPrice(s.targetAmount)) {
      MessageBox.alert(`目标筹款金额不合法，请重新输入！`);
      return false;
    }
    s.targetAmount = parseFloat(s.targetAmount);
  } else s.targetAmount = 0;

  // 开始时间与结束时间
  if (s.startTime && s.endTime) {
    const startTimeNum = numOfDateTime(s.startTime);
    const endTimeNum = numOfDateTime(s.endTime);
    if (startTimeNum > endTimeNum) {
      MessageBox.alert('开始时间不能大于结束时间！');
      return false;
    }
  }

  if (!s._showFeedback) s.feedbackType = 0;

  if (s.pay_succ_details_flag && !s.payDetail) {
    s.payDetail = defaultPaySuccessHtml;
  }

  // 移除所有的_开头的临时字段，包括深层
  removeTmpFieldDeep(s);

  // 这个字段没什么用，但后端要这个字段
  s.explain = '';

  return s;
}

// 填充打印机到提交数据中
export function fillPrinterToSubmitData(s, printerList) {
  if (!s.subdivideStr.length) return;

  const pl = JSON.parse(JSON.stringify(printerList));
  pl.forEach(item => {
    item.setting.printerId = item.id;
  });

  s.subdivideStr.forEach((item, index) => {
    item.printer = [];
    pl.forEach(item2 => {
      if (item2.guiGeIndexes.indexOf(index) > -1) {
        item.printer.push(item2.setting);
      }
    });
  });
}

function formatGuiGeItemForCache(item) {
  if (!item.price) item.price = '';
  // 中文逗号换成英文逗号，去除所有空格
  item.price = item.price.replace(/，/g, ',').replace(/\s+/g, '');

  // 1 天、2 月、3 年
  if (!item.durationDay) item.durationDay = 0;
  else {
    item.durationDay = parseInt(item.durationDay, 10);
    if (item._durationDayType === 1) item.durationDay *= 30;
    else if (item._durationDayType === 2) item.durationDay *= 365;
  }
}

// 生成用于缓存的数据
export function generateCacheData(form) {
  // 复制一份数据，不要在原来的数据上改
  const s = JSON.parse(JSON.stringify(form));

  if (s.subdivideStr.length) {
    for (let i = 0, il = s.subdivideStr.length; i < il; i++) {
      formatGuiGeItemForCache(s.subdivideStr[i]);
    }
  }

  if (!s.price) s.price = '';
  // 中文逗号换成英文逗号，去除所有空格
  s.price = s.price.replace(/，/g, ',').replace(/\s+/g, '');

  if (!s.opName) s.opName = '随喜功德';

  if (!s._showStat) s.showStatictics = 0;
  else s.showStatictics = s._statStyle;

  if (!s._showFeedback) s.feedbackType = 0;

  // 移除所有的_开头的临时字段，包括深层
  removeTmpFieldDeep(s);

  return s;
}
