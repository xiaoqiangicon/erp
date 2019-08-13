import $ from 'jquery';
import _ from 'underscore';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from '../data';
import tpl from '../tpl';
import func from '../function';
import '../ajax';
import 'lib/jquery.seeView';
$.seeView({
  events: {
    '!click #content-edit-tag': 'onClickContentEditTag',
    'click [data-tag-popup-cell]': 'onClickTagPopupCell',
    'click [data-tag-popup-cell-delete]': 'onClickTagPopupCellDelete',
    '!click #tag-popup-ok': 'onClickTagPopupOk',
  },
  onClickContentEditTag: function(e) {
    var currentTagIds = [];
    var currentTagNames = [];
    $('[data-content-tag]').map(function() {
      var $this = $(this);
      currentTagIds.push(parseInt($this.attr('data-content-tag')));
      currentTagNames.push($this.text());
    });
    $('[data-tag-popup-cell]').map(function() {
      var $this = $(this),
        id = parseInt($this.attr('data-tag-popup-cell'));
      if (currentTagIds.indexOf(id) > -1) $this.removeClass('unselected');
      else $this.addClass('unselected');
    });
    var newValue = currentTagNames.join(' ');
    $('#tag-popup-input').val(newValue);
    data.lastTagPopupInputLength = newValue.length;
    $('#tag-popup').show();
    $('body').addClass('overflow-hidden');
  },
  onClickTagPopupCell: function(e) {
    var $this = $(e.currentTarget),
      tagName = $this.attr('data-name'),
      $input = $('#tag-popup-input');
    var newValue;
    if ($this.hasClass('unselected')) {
      newValue = [$input.val(), tagName].join(' ');
      $input.val(newValue);
      $this.removeClass('unselected');
    } else {
      var currentTagsArray = $input.val().split(' ');
      var index = currentTagsArray.indexOf(tagName);
      index > -1 && currentTagsArray.splice(index, 1);
      newValue = currentTagsArray.join(' ');
      $input.val(newValue);
      $this.addClass('unselected');
    }
    data.lastTagPopupInputLength = newValue.length;
  },
  onClickTagPopupCellDelete: function(e) {
    e.stopPropagation();
    var $this = $(e.target),
      id = parseInt($this.attr('data-tag-popup-cell-delete')),
      name = $this.parent().attr('data-name'),
      $input = $('#tag-popup-input'),
      input = $input.val(),
      tagsArray = input.split(' '),
      index = tagsArray.indexOf(name);
    commonFunc.confirm('确定删除这个标签吗', function() {
      $.seeAjax.post(
        'deleteTag',
        {
          id: id,
        },
        function(res) {
          if (res.success) {
            $this.parent().remove();
            if (index > -1) {
              tagsArray.splice(index, 1);
              var newValue = tagsArray.join(' ');
              $input.val(newValue);
              data.lastTagPopupInputLength = newValue.length;
            }
          } else {
            toastr.error('标签删除失败，请稍后重试');
          }
        },
        !0
      );
    });
  },
  onClickTagPopupOk: function(e) {
    var self = this,
      $this = $(e.target),
      handling =
        $this.attr('data-handling') && !!parseInt($this.attr('data-handling')),
      $input = $('#tag-popup-input'),
      tagsArray = _.without(_.uniq($input.val().split(' ')), '');
    if (handling) return;
    if (tagsArray.length > 4) {
      commonFunc.dialog('最多只能添加4个标签');
      return;
    }
    var tagBeyond4length;
    tagsArray.map(function(name) {
      name.length > 4 && !tagBeyond4length && (tagBeyond4length = name);
    });
    if (tagBeyond4length) {
      commonFunc.dialog(
        '标签 ' + tagBeyond4length + ' 超过4个字，请修改后再保存'
      );
      return;
    }
    var allTagsArray = [];
    var allTagIdsArray = [];
    $('[data-tag-popup-cell]').map(function() {
      var $this = $(this);
      allTagsArray.push($this.attr('data-name'));
      allTagIdsArray.push(parseInt($this.attr('data-tag-popup-cell')));
    });
    var notExistTags = [];
    var tagIdsArray = [];
    tagsArray.map(function(name, posIndex) {
      var index = allTagsArray.indexOf(name);
      if (index < 0) {
        notExistTags.push({
          index: posIndex,
          name: name,
        });
        tagIdsArray.push(0);
      } else {
        tagIdsArray.push(allTagIdsArray[index]);
      }
    });
    if (notExistTags.length) {
      $this
        .attr({
          'data-handling': 1,
        })
        .text('正在保存标签...');
      var $tagsContainer = $('#tag-popup-my');
      var createdTagsCount = 0;
      notExistTags.map(function(item) {
        $.seeAjax.post(
          'createTag',
          {
            name: item.name,
          },
          function(res) {
            if (res.success) {
              createdTagsCount += 1;
              data.tags[res.id] = {
                id: res.id,
                name: item.name,
                type: 2,
              };
              $tagsContainer.append(tpl.tagPopupCell.render(data.tags[res.id]));
              tagIdsArray[item.index] = res.id;
              if (createdTagsCount >= notExistTags.length) {
                self.onSaveAllTagsSuccess(tagIdsArray);
                $this
                  .attr({
                    'data-handling': 0,
                  })
                  .text('确定');
              }
            }
          },
          !0
        );
      });
    } else {
      self.onSaveAllTagsSuccess(tagIdsArray);
    }
  },
  onSaveAllTagsSuccess: function(tagIdsArray) {
    var $container = $('#content-tags');
    $container.html('');
    tagIdsArray.map(function(id) {
      $container.append(tpl.tagCell.render(data.tags[id]));
    });
    $('#tag-popup').hide();
    $('body').removeClass('overflow-hidden');
  },
});
