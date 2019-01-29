/**
 * Created by kang on 2017/11/8.
 */

define([
  'jquery',
  'common/function',
  'common/variables',
  './data',
  './api',
  './tpl',
  './function',
  'toastr',
  '@zzh/jquery-qrcode',
  'jquery-confirm',
  './ajax',
  'lib/jquery.seeView',
], function($, commonFunc, commonVars, Data, api, tpl, func, toastr) {
  $.seeView({
    events: {
      // 点击全部
      'click #all-tab': 'onClickAllTab',
      // 点击已关注
      'click #tag-tab': 'onClickTagTab',
      // 切换搜索项
      'changed.bs.select #filter-select': 'onChangedFilterSelect',
      // 点击搜索按钮
      'click #search-submit': 'onClickSearchSubmit',
      // 点击重置按钮
      'click #search-reset': 'onClickSearchReset',
      // 点击加入关注分组按钮
      'click [data-ele="show-add-to-follow-modal"]':
        'onClickShowAddToFollowModal',
      // 点击保存功德主为某些关注分组
      'click #save-add-to-follow': 'onClickSaveAddToFollow',
      // 点击导出excel
      'click #exportExcel': 'onClickExportExcel',
      // 点击按照善款金额排序
      'click [data-ele="table-title-collect-money"]': 'sortByMoney',
      // 点击按照总捐款次数排序
      'click [data-ele="table-title-total-amount"]': 'sortByTotalAmount',
      // 点击全选
      'click [data-ele="select-all"]': 'onClickSelectAll',
      // 点击单选
      'click [data-ele="select-merit-checkbox"]': 'onClickSelectMeritCheckox',
      // 点击标签
      'click [data-ele="tag-list"]': 'onClickTagList',
      // 点击添加标签
      'click [data-ele="add-tag"]': 'onClickAddTag',
      // 添加标签input输入文本
      'keyup #add-tag-input': 'onKeyupAddTagInput',
      // 点击添加标签icon
      'mousedown #save-add-tag': 'onMousedownSaveAddTag',
      // 添加标签输入框失去焦点
      'blur #add-tag-input': 'onBlurAddTagInput',
      // 点击重命名
      'click [data-opt="rename-tag"]': 'onClickRenameTag',
      // 重命名输入框输入文本
      'keyup #edit-tag-input': 'onKeyupEditTagInput',
      // 重命名输入框失去焦点
      'blur #edit-tag-input': 'onBlurEditTagInput',
      // 点击重命名输入框icon
      'mousedown #save-edit-tag': 'onMousedownSaveEditTag',
      // 点击删除分组
      'click [data-opt="del-tag"]': 'onClickDelTag',
      // 点击移出分组
      'click [data-ele="remove-from-tag"]': 'onClickRemoveFromTag',
    },
    // 点击全部
    onClickAllTab: function(e) {
      var $tabs = $('.tab'),
        $allTab = $('#all-tab'),
        $allCtnr = $('#all-ctnr'),
        $tagCtnr = $('#tag-ctnr');
      $tabs.removeClass('active');
      $allTab.addClass('active');
      $allCtnr.show();
      $tagCtnr.hide();
      if (typeof Data.getListParams.tagId !== 'undefined') {
        delete Data.getListParams.tagId;
      }
      Data.getListParams.page = 0;
      api.getList(Data.getListParams, function(res) {
        func.renderAllTbody(Data.getListRes);
      });
    },
    // 点击已关注
    onClickTagTab: function(e) {
      var $tabs = $('.tab'),
        $tagTab = $('#tag-tab'),
        $allCtnr = $('#all-ctnr'),
        $tagCtnr = $('#tag-ctnr'),
        $tagTableCtnr = $('#tag-table-ctnr');
      $tabs.removeClass('active');
      $tagTab.addClass('active');
      $allCtnr.hide();
      $tagCtnr.show();
      api.getTag({}, function(res) {
        func.renderTagList(Data.getTagHandleData);
        if (Data.getTagRes.data.length) {
          // 存在分组
          Data.getListParams.tagId = Data.getTagRes.data[0].id;
          Data.getListParams.page = 0;
          api.getList(Data.getListParams, function() {
            func.renderTagTbody(Data.getListRes);
          });
          $tagTableCtnr.show();
        } else {
          // 不存在分组
          $tagTableCtnr.hide();
        }
      });
    },
    // 切换搜索项
    onChangedFilterSelect: function(e) {
      var $filterInput = $('#filter-input');
      $filterInput.val('');
    },
    // 点击搜索按钮
    onClickSearchSubmit: function(e) {
      e.preventDefault();
      var $filterSelect = $('#filter-select'),
        selectVal = parseInt($filterSelect.val()),
        $filterInput = $('#filter-input'),
        inputVal = $.trim($filterInput.val()),
        $allCtnr = $('#all-ctnr'),
        $tagCtnr = $('#tag-ctnr');
      Data.getListParams.page = 0;
      if (selectVal === 1) {
        // 功德主昵称
        delete Data.getListParams.number;
        Data.getListParams.searchText = inputVal;
      } else if (selectVal === 2) {
        // 自在家号
        if (isNaN(parseInt(inputVal))) {
          toastr.error('自在家号应为数字');
          return;
        }
        delete Data.getListParams.searchText;
        Data.getListParams.number = parseInt(inputVal);
      }
      api.getList(Data.getListParams, function(res) {
        if (typeof Data.getListParams.tagId !== 'undefined') {
          func.renderTagTbody(Data.getListRes);
        } else {
          func.renderAllTbody(Data.getListRes);
        }
      });
    },
    // 点击重置按钮
    onClickSearchReset: function(e) {
      e.preventDefault();
      var $filterInput = $('#filter-input'),
        $searchSubmit = $('#search-submit'),
        $allCtnr = $('#all-ctnr'),
        $tagCtnr = $('#tag-ctnr');
      $filterInput.val('');
      Data.getListParams.page = 0;
      delete Data.getListParams.searchText;
      delete Data.getListParams.number;
      api.getList(Data.getListParams, function(res) {
        if (typeof Data.getListParams.tagId !== 'undefined') {
          func.renderTagTbody(Data.getListRes);
        } else {
          func.renderAllTbody(Data.getListRes);
        }
      });
    },
    // 点击加入关注分组按钮
    onClickShowAddToFollowModal: function(e) {
      var curTabId = $('[data-ele="tab"].active').attr('id'),
        $tagTab = $('#tag-tab'),
        $curTable = curTabId === 'all-tab' ? $('#all-table') : $('#tag-table'),
        $selectCheckbox = $curTable.find(
          '[data-ele="select-merit-checkbox"]:checked'
        ),
        $modal = $('#add-to-follow-modal');
      if ($selectCheckbox.length) {
        api.getTag({}, function(res) {
          if (res.data.length) {
            func.renderTagSelect(Data.getTagHandleData);
            $modal.modal('show');
          } else {
            commonFunc.confirm('当前无任何分组,是否前往添加！', function() {
              $tagTab.click();
            });
          }
        });
      } else {
        toastr.error('请选择功德主');
      }
    },
    // 点击保存功德主为某些关注分组
    onClickSaveAddToFollow: function(e) {
      var curTabId = $('[data-ele="tab"].active').attr('id'),
        $curTable = curTabId === 'all-tab' ? $('#all-table') : $('#tag-table'),
        $selectCheckbox = $curTable.find(
          '[data-ele="select-merit-checkbox"]:checked'
        ),
        $modal = $('#add-to-follow-modal'),
        $select = $modal.find('[data-ele="tag-select"]'),
        $curTag = $('[data-ele="tag-list"].active'),
        curTagId = parseInt($curTag.attr('data-id')),
        tagIds = $select.val(), // 单个也字符串数组 未选中为null
        userIds = [];
      if (tagIds) {
        tagIds = tagIds.join(',');
        $selectCheckbox.map(function() {
          userIds.push(parseInt($(this).attr('data-userId')));
        });
        console.log(userIds);
        userIds = userIds.join(',');
        api.addMeritToGroup({ tagIds: tagIds, userIds: userIds }, function() {
          toastr.success('添加成功！');
          // 刷新已关注人数显示
          api.getList(Data.getListRes, function(res) {
            $('#follow-num').html(res.members);
          });
          if (curTabId === 'all-tab') {
            func.init();
          } else {
            api.getTag({}, function() {
              func.renderTagList(Data.getTagHandleData, curTagId);
            });
          }
          $modal.modal('hide');
        });
      } else {
        toastr.error('请选择分组！');
      }
    },
    // 点击导出excel
    onClickExportExcel: function(e) {
      window.open('/zzhadmin/getMeritUserInfoExcel/');
    },
    // 点击按照善款金额排序
    sortByMoney: function(e) {
      var $curTar = $(e.currentTarget),
        $curTable = $curTar.parents('table'),
        $titleMoney = $curTable.find('[data-ele="table-title-collect-money"]'),
        $titleAmount = $curTable.find('[data-ele="table-title-total-amount"]'),
        $allCtnr = $('#all-ctnr'),
        $tagCtnr = $('#tag-ctnr');
      if ($titleMoney.hasClass('desc')) {
        $titleMoney.removeClass('desc').addClass('unsort');
        $titleAmount.removeClass('unsort').addClass('desc');
        Data.getListParams.type = 2;
      } else {
        $titleMoney.removeClass('unsort').addClass('desc');
        $titleAmount.removeClass('desc').addClass('unsort');
        Data.getListParams.type = 1;
      }
      Data.getListParams.page = 0;

      api.getList(Data.getListParams, function(res) {
        if (typeof Data.getListParams.tagId !== 'undefined') {
          $allCtnr.hide();
          $tagCtnr.show();
          func.renderTagTbody(Data.getListRes);
        } else {
          func.renderAllTbody(Data.getListRes);
        }
      });
    },
    // 点击按照总捐款次数排序
    sortByTotalAmount: function(e) {
      var $curTar = $(e.currentTarget),
        $curTable = $curTar.parents('table'),
        $titleMoney = $curTable.find('[data-ele="table-title-collect-money"]'),
        $titleAmount = $curTable.find('[data-ele="table-title-total-amount"]'),
        $allCtnr = $('#all-ctnr'),
        $tagCtnr = $('#tag-ctnr');
      if ($titleMoney.hasClass('desc')) {
        $titleMoney.removeClass('desc').addClass('unsort');
        $titleAmount.removeClass('unsort').addClass('desc');
        Data.getListParams.type = 2;
      } else {
        $titleMoney.removeClass('unsort').addClass('desc');
        $titleAmount.removeClass('desc').addClass('unsort');
        Data.getListParams.type = 1;
      }
      Data.getListParams.pageNumber = 0;
      api.getList(Data.getListParams, function(res) {
        if (typeof Data.getListParams.tagId !== 'undefined') {
          $allCtnr.hide();
          $tagCtnr.show();
          func.renderTagTbody(Data.getListRes);
        } else {
          func.renderAllTbody(Data.getListRes);
        }
      });
    },
    // 点击全选
    onClickSelectAll: function(e) {
      var $curTar = $(e.currentTarget),
        $curTable = $curTar.parents('table'),
        $selectNum = $('[data-ele="select-num"]'),
        ifChecked = $curTar.prop('checked'),
        $selectMeritCheckbox = $curTable.find(
          '[data-ele="select-merit-checkbox"]'
        );
      $selectMeritCheckbox.prop('checked', ifChecked);
      var checkedNum = $curTable.find(
        '[data-ele="select-merit-checkbox"]:checked'
      ).length;
      $selectNum.html(checkedNum);
    },
    // 点击单选
    onClickSelectMeritCheckox: function(e) {
      var $curTar = $(e.currentTarget),
        $curTable = $curTar.parents('table'),
        $selectNum = $('[data-ele="select-num"]'),
        checkedNum = $curTable.find(
          '[data-ele="select-merit-checkbox"]:checked'
        ).length,
        ifExistSelect = !!checkedNum;
      $selectNum.html(checkedNum);
    },
    // 点击标签
    onClickTagList: function(e) {
      var $curTar = $(e.currentTarget),
        $tagLists = $('[data-ele="tag-list"]'),
        $curTagName = $('[data-ele="cur-tag-name"]'),
        $tagTableCtnr = $('#tag-table-ctnr'),
        $selectNum = $tagTableCtnr.find('[data-ele="select-num"]'),
        tagId = parseInt($curTar.attr('data-id'));
      $tagLists.removeClass('active');
      $curTar.addClass('active');
      $curTagName.html(Data.getTagHandleData[tagId].name);
      $selectNum.html(0);
      Data.getListParams.tagId = tagId;
      api.getList(Data.getListParams, function() {
        func.renderTagTbody(Data.getListRes);
        $tagTableCtnr.show();
      });
    },
    // 点击添加标签
    onClickAddTag: function(e) {
      var $addTagCtnr = $('#add-tag-ctnr'),
        $addTagInput = $('#add-tag-input');
      $addTagCtnr.show();
      $addTagInput.focus();
    },
    // 添加标签input输入文本
    onKeyupAddTagInput: function(e) {
      var $saveAddTag = $('#save-add-tag'),
        keyCode = e.keyCode;
      if (keyCode === 13) {
        $saveAddTag.trigger('mousedown');
      }
    },
    // 点击添加标签icon
    onMousedownSaveAddTag: function(e) {
      // 打开开关 阻止blur事件执行
      Data.lockBlur = !!1;
      var $addTagCtnr = $('#add-tag-ctnr'),
        $addTagInput = $('#add-tag-input'),
        $listCtnr = $('#list-ctnr'),
        name = $.trim($addTagInput.val());
      if (name.length) {
        api.updateTag({ tagId: 0, tagName: name }, function(res) {
          toastr.success('修改成功！');
          $addTagInput.val('');
          $addTagCtnr.hide();
          api.getTag({}, function() {
            // 此处如果接口成功时返回添加的id可以省去很多事
            var handleData = Data.getTagHandleData;
            Object.keys(handleData).map(function(key) {
              if (handleData[key].name === name) {
                if (Data.getTagRes.data.length === 1) {
                  $listCtnr.html(tpl.tagList.render(handleData[key]));
                } else {
                  $listCtnr.append(tpl.tagList.render(handleData[key]));
                }
              }
            });
          });
          Data.lockBlur = !!0;
        });
      } else {
        toastr.error('请填写分组名');
        Data.lockBlur = !!0;
      }
    },
    // 添加标签输入框失去焦点
    onBlurAddTagInput: function(e) {
      if (!Data.lockBlur) {
        var $addTagCtnr = $('#add-tag-ctnr'),
          $addTagInput = $('#add-tag-input');
        $addTagInput.val('');
        $addTagCtnr.hide();
      }
    },
    // 点击重命名
    onClickRenameTag: function(e) {
      var $curTag = $('[data-ele="tag-list"].active');
      if ($curTag.length) {
        var tagId = parseInt($curTag.attr('data-id')),
          handleData = Data.getTagHandleData;
        $curTag.replaceWith(tpl.editTagCtnr.render(handleData[tagId]));
        var $editTagInput = $('#edit-tag-input');
        $editTagInput.focus();
      }
    },
    // 重命名输入框输入文本
    onKeyupEditTagInput: function(e) {
      var $saveEditTag = $('#save-edit-tag'),
        keyCode = e.keyCode;
      if (keyCode === 13) {
        $saveEditTag.trigger('mousedown');
      }
    },
    // 重命名输入框失去焦点
    onBlurEditTagInput: function(e) {
      console.log(e.target);
      if (!Data.lockBlur) {
        var $editTagCtnr = $('#edit-tag-ctnr'),
          $editTagInput = $('#edit-tag-input'),
          tagId = parseInt($editTagInput.attr('data-id')),
          hanleData = Data.getTagHandleData;
        $editTagCtnr.replaceWith(tpl.tagList.render(hanleData[tagId]));
        $('[data-ele="tag-list"][data-id="' + tagId + '"]').addClass('active');
      }
    },
    // 点击重命名输入框icon
    onMousedownSaveEditTag: function(e) {
      // 打开开关 阻止blur事件执行
      Data.lockBlur = !!1;
      var $editTagCtnr = $('#edit-tag-ctnr'),
        $editTagInput = $('#edit-tag-input'),
        tagId = parseInt($editTagInput.attr('data-id')),
        name = $.trim($editTagInput.val()),
        handleData = Data.getTagHandleData,
        $curTagName = $('[data-ele="cur-tag-name"]');
      if (name.length) {
        api.updateTag({ tagId: tagId, tagName: name }, function() {
          toastr.success('修改成功！');
          handleData[tagId].name = name;
          $editTagCtnr.replaceWith(tpl.tagList.render(handleData[tagId]));
          var $curTag = $('[data-ele="tag-list"][data-id="' + tagId + '"]');
          $curTag.addClass('active');
          $curTagName.html(name);
          Data.lockBlur = !!0;
        });
      } else {
        toastr.error('请输入分组名！');
        Data.lockBlur = !!0;
      }
    },
    // 点击删除分组
    onClickDelTag: function(e) {
      var $curTag = $('[data-ele="tag-list"].active'),
        $tagTableCtnr = $('#tag-table-ctnr'),
        tagId = parseInt($curTag.attr('data-id')),
        handleData = Data.getTagHandleData;
      commonFunc.confirm('确定删除吗？', function() {
        api.delTag({ tagId: tagId }, function() {
          toastr.success('删除成功！');
          delete handleData[tagId];
          func.renderTagList(handleData);
          var $newCurTag = $('[data-ele="tag-list"].active');
          if ($newCurTag.length) {
            var newTagId = parseInt($newCurTag.attr('data-id'));
            Data.getListParams.tagId = newTagId;
            api.getList(Data.getListParams, function(res) {
              $('#follow-num').html(res.members);
              func.renderTagTbody(Data.getListRes);
            });
            $tagTableCtnr.show();
          } else {
            $('#follow-num').html(0);
            $tagTableCtnr.hide();
          }
        });
      });
    },
    // 点击移出分组
    onClickRemoveFromTag: function(e) {
      var $tagTable = $('#tag-table'),
        $curTag = $('[data-ele="tag-list"].active'),
        $selectCheckbox = $tagTable.find(
          '[data-ele="select-merit-checkbox"]:checked'
        ),
        tagId = parseInt($curTag.attr('data-id')),
        userIds = [];
      if ($selectCheckbox.length) {
        commonFunc.confirm('确定将功德主移除分组吗？', function() {
          $selectCheckbox.map(function() {
            userIds.push(parseInt($(this).attr('data-userid')));
          });
          userIds = userIds.join(',');
          api.delMeritFromGroup({ tagId: tagId, userIds: userIds }, function() {
            toastr.success('移除成功！');
          });
          // 刷新关注人数
          api.getTag({}, function() {
            func.renderTagList(Data.getTagHandleData, tagId);
          });
          api.getList(Data.getListParams, function(res) {
            $('#follow-num').html(res.members);
            func.renderTagTbody(res);
          });
        });
      } else {
        toastr.error('请选择功德主');
      }
    },
  });
});
