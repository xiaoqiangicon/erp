import $ from 'jquery';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import Data from './data';
import api from './api';
import tpl from './tpl';
import func from './function';
import toastr from 'toastr';
import '../../../pro-com/src/libs-es5/jquery-qrcode';
import 'jquery-confirm';
import './ajax';
import seeView from 'see-view';
seeView({
  events: {
    'click #all-tab': 'onClickAllTab',
    'click #tag-tab': 'onClickTagTab',
    'changed.bs.select #filter-select': 'onChangedFilterSelect',
    'click #search-submit': 'onClickSearchSubmit',
    'click #search-reset': 'onClickSearchReset',
    'click [data-ele="show-add-to-follow-modal"]':
      'onClickShowAddToFollowModal',
    'click #save-add-to-follow': 'onClickSaveAddToFollow',
    'click #exportExcel': 'onClickExportExcel',
    'click [data-ele="table-title-collect-money"]': 'sortByMoney',
    'click [data-ele="table-title-total-amount"]': 'sortByTotalAmount',
    'click [data-ele="select-all"]': 'onClickSelectAll',
    'click [data-ele="select-merit-checkbox"]': 'onClickSelectMeritCheckox',
    'click [data-ele="tag-list"]': 'onClickTagList',
    'click [data-ele="add-tag"]': 'onClickAddTag',
    'keyup #add-tag-input': 'onKeyupAddTagInput',
    'mousedown #save-add-tag': 'onMousedownSaveAddTag',
    'blur #add-tag-input': 'onBlurAddTagInput',
    'click [data-opt="rename-tag"]': 'onClickRenameTag',
    'keyup #edit-tag-input': 'onKeyupEditTagInput',
    'blur #edit-tag-input': 'onBlurEditTagInput',
    'mousedown #save-edit-tag': 'onMousedownSaveEditTag',
    'click [data-opt="del-tag"]': 'onClickDelTag',
    'click [data-ele="remove-from-tag"]': 'onClickRemoveFromTag',
  },
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
        Data.getListParams.tagId = Data.getTagRes.data[0].id;
        Data.getListParams.page = 0;
        api.getList(Data.getListParams, function() {
          func.renderTagTbody(Data.getListRes);
        });
        $tagTableCtnr.show();
      } else {
        $tagTableCtnr.hide();
      }
    });
  },
  onChangedFilterSelect: function(e) {
    var $filterInput = $('#filter-input');
    $filterInput.val('');
  },
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
      delete Data.getListParams.number;
      Data.getListParams.searchText = inputVal;
    } else if (selectVal === 2) {
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
      tagIds = $select.val(),
      userIds = [];
    if (tagIds) {
      tagIds = tagIds.join(',');
      $selectCheckbox.map(function() {
        userIds.push(parseInt($(this).attr('data-userId')));
      });
      console.log(userIds);
      userIds = userIds.join(',');
      api.addMeritToGroup(
        {
          tagIds: tagIds,
          userIds: userIds,
        },
        function() {
          toastr.success('添加成功！');
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
        }
      );
    } else {
      toastr.error('请选择分组！');
    }
  },
  onClickExportExcel: function(e) {
    window.open('/zzhadmin/getMeritUserInfoExcel/');
  },
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
  onClickSelectMeritCheckox: function(e) {
    var $curTar = $(e.currentTarget),
      $curTable = $curTar.parents('table'),
      $selectNum = $('[data-ele="select-num"]'),
      checkedNum = $curTable.find('[data-ele="select-merit-checkbox"]:checked')
        .length,
      ifExistSelect = !!checkedNum;
    $selectNum.html(checkedNum);
  },
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
  onClickAddTag: function(e) {
    var $addTagCtnr = $('#add-tag-ctnr'),
      $addTagInput = $('#add-tag-input');
    $addTagCtnr.show();
    $addTagInput.focus();
  },
  onKeyupAddTagInput: function(e) {
    var $saveAddTag = $('#save-add-tag'),
      keyCode = e.keyCode;
    if (keyCode === 13) {
      $saveAddTag.trigger('mousedown');
    }
  },
  onMousedownSaveAddTag: function(e) {
    Data.lockBlur = !!1;
    var $addTagCtnr = $('#add-tag-ctnr'),
      $addTagInput = $('#add-tag-input'),
      $listCtnr = $('#list-ctnr'),
      name = $.trim($addTagInput.val());
    if (name.length) {
      api.updateTag(
        {
          tagId: 0,
          tagName: name,
        },
        function(res) {
          toastr.success('修改成功！');
          $addTagInput.val('');
          $addTagCtnr.hide();
          api.getTag({}, function() {
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
        }
      );
    } else {
      toastr.error('请填写分组名');
      Data.lockBlur = !!0;
    }
  },
  onBlurAddTagInput: function(e) {
    if (!Data.lockBlur) {
      var $addTagCtnr = $('#add-tag-ctnr'),
        $addTagInput = $('#add-tag-input');
      $addTagInput.val('');
      $addTagCtnr.hide();
    }
  },
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
  onKeyupEditTagInput: function(e) {
    var $saveEditTag = $('#save-edit-tag'),
      keyCode = e.keyCode;
    if (keyCode === 13) {
      $saveEditTag.trigger('mousedown');
    }
  },
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
  onMousedownSaveEditTag: function(e) {
    Data.lockBlur = !!1;
    var $editTagCtnr = $('#edit-tag-ctnr'),
      $editTagInput = $('#edit-tag-input'),
      tagId = parseInt($editTagInput.attr('data-id')),
      name = $.trim($editTagInput.val()),
      handleData = Data.getTagHandleData,
      $curTagName = $('[data-ele="cur-tag-name"]');
    if (name.length) {
      api.updateTag(
        {
          tagId: tagId,
          tagName: name,
        },
        function() {
          toastr.success('修改成功！');
          handleData[tagId].name = name;
          $editTagCtnr.replaceWith(tpl.tagList.render(handleData[tagId]));
          var $curTag = $('[data-ele="tag-list"][data-id="' + tagId + '"]');
          $curTag.addClass('active');
          $curTagName.html(name);
          Data.lockBlur = !!0;
        }
      );
    } else {
      toastr.error('请输入分组名！');
      Data.lockBlur = !!0;
    }
  },
  onClickDelTag: function(e) {
    var $curTag = $('[data-ele="tag-list"].active'),
      $tagTableCtnr = $('#tag-table-ctnr'),
      tagId = parseInt($curTag.attr('data-id')),
      handleData = Data.getTagHandleData;
    commonFunc.confirm('确定删除吗？', function() {
      api.delTag(
        {
          tagId: tagId,
        },
        function() {
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
        }
      );
    });
  },
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
        api.delMeritFromGroup(
          {
            tagId: tagId,
            userIds: userIds,
          },
          function() {
            toastr.success('移除成功！');
          }
        );
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
