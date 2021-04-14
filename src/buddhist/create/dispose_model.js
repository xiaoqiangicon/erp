import juicer from 'juicer';
var app_model_dispose = {};
app_model_dispose.method = {};
app_model_dispose.method.add_default_title_prompt_text = function(
  my_json,
  my_model
) {
  switch (my_json['inputType']) {
    case '4':
      if (my_json['name'] == '') my_json['name'] = '联系人';
      break;
    case '8':
      if (my_json['name'] == '') my_json['name'] = '性别';
      break;
    case '9':
      if (my_json['name'] == '') my_json['name'] = '出生日期';
      break;
    case '5':
      if (my_json['name'] == '') my_json['name'] = '手机号码';
      break;
    case '6':
      if (my_json['name'] == '') my_json['name'] = '地址';
      break;
    case '10':
      if (my_json['name'] == '') my_json['name'] = '阳上人';
      break;
    case '11':
      if (my_json['name'] == '') my_json['name'] = '往生者';
      break;
    case '12':
      if (my_json['name'] == '') my_json['name'] = '功德芳名';
      break;
    case '15':
      if (my_json['name'] == '') my_json['name'] = '心愿';
      break;
    case '16':
      if (my_json['name'] == '') my_json['name'] = '是否邮寄';
      break;
    case '17':
      if (my_json['name'] == '') my_json['name'] = '普通邮寄';
      break;
    default:
      break;
  }
};
app_model_dispose.method.change_prompt_text = function(my_type, my_model) {
  switch (my_type) {
    case '4':
      my_model.set('name', '联系人');
      my_model.set('prompt_text', '请填写联系人姓名（方便寺院与您联系）');
      break;
    case '5':
      my_model.set('name', '手机号码');
      my_model.set('prompt_text', '请填写联系人电话（方便寺院与您联系）');
      break;
    case '6':
      my_model.set('name', '地址');
      my_model.set('prompt_text', '请填写您常用的居住地址');
      break;
    case '10':
      my_model.set('name', '阳上人');
      my_model.set('prompt_text', '请填写功德主姓名（在世）');
      break;
    case '11':
      my_model.set('name', '往生者');
      my_model.set('prompt_text', '请填写已故者姓名（已去世）');
      break;
    case '12':
      my_model.set('name', '功德芳名');
      my_model.set('prompt_text', '请填写功德主姓名');
      break;
    case '15':
      my_model.set('name', '心愿');
      my_model.set('prompt_text', '请填写您的心愿');
      break;
    case '8':
      my_model.set('name', '性别');
      my_model.set('prompt_text', '');
      break;
    case '9':
      my_model.set('name', '出生日期');
      my_model.set('prompt_text', '');
      break;
    case '16':
      my_model.set('name', '是否邮寄');
      my_model.set('prompt_text', '是否邮寄');
      break;
    case '17':
      my_model.set('name', '普通邮寄');
      my_model.set('prompt_text', '普通邮寄');
      break;
    default:
      my_model.set('name', '');
      my_model.set('prompt_text', '');
      break;
  }
};
app_model_dispose.method.add_default_size_title_prompt_text = function(
  my_json,
  my_model
) {
  switch (my_json['subdivide_type']) {
    case '1':
      if (my_json['name'] == '') my_json['name'] = '普通佛事';
      break;
    case '2':
      if (my_json['name'] == '') my_json['name'] = '往生牌位 ';
      break;
    case '3':
      if (my_json['name'] == '') my_json['name'] = '祈福牌位';
      break;
    default:
      break;
  }
};
app_model_dispose.method.change_size_name = function(my_type, my_model) {
  switch (my_type) {
    case '1':
      my_model.set('name', '普通佛事');
      break;
    case '2':
      my_model.set('name', '往生牌位');
      break;
    case '3':
      my_model.set('name', '祈福牌位');
      break;
    default:
      my_model.set('name', '');
      break;
  }
};
export default app_model_dispose;
