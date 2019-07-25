/**
 * Created by Linfe on 2017/5/22.
 */
define(['juicer'], function() {
  var app_model_dispose = {};
  // 方法（函数）
  app_model_dispose.method = {};
  app_model_dispose.method.add_default_title_prompt_text = function(
    my_json,
    my_model
  ) {
    /*给常用附言加默认标题*/
    switch (my_json['inputType']) {
      case '4':
        if (my_json['name'] == '') my_json['name'] = '联系人';
        // if(my_json['prompt_text'] == "") {
        //     my_json['prompt_text'] = "请填写联系人姓名（方便寺院与您联系）";
        //     my_model.set('prompt_text','请填写联系人姓名（方便寺院与您联系）');
        // }
        break;
      case '8':
        if (my_json['name'] == '') my_json['name'] = '性别';
        break;
      case '9':
        if (my_json['name'] == '') my_json['name'] = '出生日期';
        break;
      case '5':
        if (my_json['name'] == '') my_json['name'] = '手机号码';
        // if(my_json['prompt_text'] == "") {
        //     my_json['prompt_text'] = "请填写联系人电话（方便寺院与您联系）";
        //     my_model.set('prompt_text','请填写联系人电话（方便寺院与您联系）');
        // }
        break;
      case '6':
        if (my_json['name'] == '') my_json['name'] = '地址';
        // if(my_json['prompt_text'] == "") {
        //     my_json['prompt_text'] = "请填写您常用的居住地址";
        //     my_model.set('prompt_text','请填写您常用的居住地址');
        // }
        break;
      case '10':
        if (my_json['name'] == '') my_json['name'] = '阳上人';
        // if(my_json['prompt_text'] == "") {
        //     my_json['prompt_text'] = "请填写功德主姓名（在世）";
        //     my_model.set('prompt_text','请填写功德主姓名（在世）');
        // }
        break;
      case '11':
        if (my_json['name'] == '') my_json['name'] = '往生者';
        // if(my_json['prompt_text'] == "") {
        //     my_json['prompt_text'] = "请填写已故者姓名（已去世）";
        //     my_model.set('prompt_text','请填写已故者姓名（已去世）');
        // }
        break;
      case '12':
        if (my_json['name'] == '') my_json['name'] = '功德芳名';
        // if(my_json['prompt_text'] == "") {
        //     my_json['prompt_text'] = "请填写功德主姓名";
        //     my_model.set('prompt_text','请填写功德主姓名');
        // }
        break;
      case '15':
        if (my_json['name'] == '') my_json['name'] = '心愿';
        // if(my_json['prompt_text'] == "") {
        //     my_json['prompt_text'] = "请填写功德主姓名";
        //     my_model.set('prompt_text','请填写功德主姓名');
        // }
        break;
      default:
        break;
    }
  };
  app_model_dispose.method.change_prompt_text = function(my_type, my_model) {
    /*改变下拉菜单时触发，改变附言的inputType后, 改变name和prompt_text*/
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
    /*给常用规格加默认标题*/
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
    /*改变下拉菜单时触发, 改变name使改变下拉菜单时更新name进而更新文本框的value*/
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
  return app_model_dispose;
});
