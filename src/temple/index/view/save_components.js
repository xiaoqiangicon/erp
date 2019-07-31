/**
 * Created by senntyou on 2017/2/27.
 */
define([
  'jquery',
  'toastr',
  'common/function',
  '../data',
  'clipboard',
  '../save_reverse',
  '../tpl/common',
  '@zzh/promotion',
  '@zzh/handling',
  'util/confirm',
  '../share',
  'jquery-confirm',
  'lib/jquery.seeView',
  '../ajax',
  'clone',
], function(
  $,
  toastr,
  commonFunc,
  indexData,
  Clipboard,
  saveReverse,
  commonTpl,
  promotion,
  zzhHandling,
  confirm,
  share
) {
  zzhHandling.setOnClickCloseCallback(function() {
    commonFunc.alert('正在保存微站数据，请勿操作或关闭页面。');
  });

  // 组件数据
  var componentData;
  // 当前保存组件的 id
  var currentSaveId;
  // 当前保存组件的 type
  var currentSaveType;
  // 当前保存组件是否是更新
  var currentSaveIsUpdate;

  $.seeView({
    events: {
      // 点击保存组件
      'click [data-action="save-component"]': 'onClickSaveComponent',
    },
    // 点击保存组件
    onClickSaveComponent: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-id')),
        type = parseInt($this.attr('data-type')),
        $displayComponent = $(
          '[data-container="component-display"][data-type="' +
            type +
            '"][data-id="' +
            id +
            '"]'
        ),
        isUpdate = !!parseInt($displayComponent.attr('data-is-update')),
        sortId = parseInt($displayComponent.attr('data-server-sort-id')),
        componentIndex = 0;

      var $allDisplayComponents = $('[data-container="component-display"]');
      $allDisplayComponents.map(function(index) {
        var $this = $(this),
          thisType = parseInt($this.attr('data-type')),
          thisId = parseInt($this.attr('data-id'));

        thisId === id && thisType === type && (componentIndex = index + 1);
      });

      // 检查不过，直接返回
      if (
        !self.checkComponentCompleteness(
          id,
          type,
          componentIndex,
          isUpdate,
          sortId
        )
      )
        return !1;

      currentSaveId = id;
      currentSaveType = type;
      currentSaveIsUpdate = isUpdate;

      self.preHandleComponentsData();

      // 因为 高僧法师组件更新也需要刷新
      // if (isUpdate) {
      //   self.save();
      // }
      // else {
      //   confirm('您正在保存的组件是新建的组件，保存成功之后将会刷新当前的页面，您其他还未保存的组件数据将会丢失。确认保存这个组件吗？', function () {
      //     self.save()
      //   });
      // }

      confirm(
        '即将保存您正在操作的组件，保存成功之后将会刷新当前的页面，您其他还未保存的组件数据将会丢失。确认保存这个组件吗？',
        function() {
          self.save();
        }
      );
    },
    // 保存
    save: function() {
      zzhHandling.show();
      $.seeAjax.post(
        'save',
        {
          data: JSON.stringify(componentData),
        },
        function(res) {
          zzhHandling.hide();

          if (res.success) {
            // 因为 高僧法师组件更新也需要刷新
            // if (currentSaveIsUpdate) toastr.success('组件更新成功');
            // else {
            //   commonFunc.removeCloseWindowHint();
            //   location.reload();
            // }

            commonFunc.removeCloseWindowHint();
            location.reload();
          } else {
            $.alert({
              title: false,
              content:
                (!!res.message ? res.message : '未知错误') + '，请重新尝试',
              buttons: { ok: { text: '确定' } },
              theme: 'white',
            });
          }
        }
      );
    },
    /**
     * 检查组件完整性
     * @param id 组件id
     * @param type 组件类型
     * @param index 组件排序序号，从1开始
     * @param isUpdate
     * @param sortId
     * @returns {*}
     */
    checkComponentCompleteness: function(id, type, index, isUpdate, sortId) {
      var self = this;
      switch (type) {
        // 寺院介绍
        case 1:
          return self.checkComponentCompletenessForIntroduction(
            id,
            index,
            isUpdate,
            sortId
          );
          break;
        // 高僧法师说
        case 2:
          return self.checkComponentCompletenessForPersonSaying(
            id,
            index,
            isUpdate,
            sortId
          );
          break;
        // 图文组件
        case 3:
          return self.checkComponentCompletenessForSwipeList(
            id,
            index,
            isUpdate,
            sortId
          );
          break;
        // 功德榜
        case 4:
          return self.checkComponentCompletenessForDonateChart(
            id,
            index,
            isUpdate,
            sortId
          );
          break;
        // 佛历
        case 5:
          return self.checkComponentCompletenessForCalendar(
            id,
            index,
            isUpdate,
            sortId
          );
          break;
        // 快捷入口
        case 6:
          return self.checkComponentCompletenessForShortcut(
            id,
            index,
            isUpdate,
            sortId
          );
          break;
        // 殿堂场景
        case 7:
          return self.checkComponentCompletenessForHouse(
            id,
            index,
            isUpdate,
            sortId
          );
          break;
        default:
          break;
      }
    },
    // 检查寺院组件的完整性
    checkComponentCompletenessForIntroduction: function(
      id,
      index,
      isUpdate,
      sortId
    ) {
      var $imageContainers, // 所有的图片容器
        images = [],
        $provinceSelect, // 省
        province,
        $citySelect, // 市
        city,
        $districtSelect, // 区
        district,
        $introductionTextarea, // 介绍
        introduction;

      var $componentContainer = $(
        '[data-container="component-display"][data-type="1"][data-id="' +
          id +
          '"]'
      );

      $imageContainers = $(
        '[data-upload-image-container="' + id + '"][data-type="1"]'
      );

      if (!$imageContainers.length) {
        $.alert({
          title: false,
          content: '寺院简介组件的图片不能为空，请上传至少一张图片',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        $componentContainer.trigger('click');
        return !1;
      }

      $provinceSelect = $('[data-introduction-province="' + id + '"]');
      province = $provinceSelect.val();
      $citySelect = $('[data-introduction-city="' + id + '"]');
      city = $citySelect.val();
      $districtSelect = $('[data-introduction-district="' + id + '"]');
      district = $districtSelect.val();

      if (!province || !city) {
        $.alert({
          title: false,
          content: '寺院简介组件的省份或城市都不能为空，请选择',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        $componentContainer.trigger('click');
        return !1;
      }

      $introductionTextarea = $(
        '[data-introduction-introduction="' + id + '"]'
      );
      introduction = $introductionTextarea.val().trim();

      if (!introduction) {
        $.alert({
          title: false,
          content: '寺院简介组件的介绍不能为空，请输入',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        $componentContainer.trigger('click');
        return !1;
      }

      $imageContainers.map(function(index) {
        var $this = $(this),
          id = parseInt($this.attr('data-image-id')),
          isUpdate = parseInt($this.attr('data-is-update')),
          imageUrl = $this.find('img').attr('src'),
          markIndex = imageUrl.indexOf('?');

        images.push({
          id: isUpdate ? id : 0,
          url: markIndex >= 0 ? imageUrl.slice(0, markIndex) : imageUrl,
          sort: index + 1,
        });
      });

      // 替换 \n 为 <br>
      introduction = introduction.replace(/\n/g, '<br>');

      componentData = {
        id: isUpdate ? id : 0,
        province: province,
        city: city,
        district: district,
        images: images,
        introduction: introduction,
        type: 1,
        sort: index,
        sortId: isUpdate ? sortId : 0,
      };

      return !0;
    },
    // 检查高僧法师说组件的完整性
    checkComponentCompletenessForPersonSaying: function(
      id,
      index,
      isUpdate,
      sortId
    ) {
      var $componentContainer = $(
        '[data-container="component-display"][data-type="2"][data-id="' +
          id +
          '"]'
      );

      if (
        !share.figureComponent.components ||
        !share.figureComponent.components.length
      ) {
        $.alert({
          title: false,
          content: '请至少添加一个高僧法师',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        $componentContainer.trigger('click');
        return !1;
      }

      var $subType = $('[data-edit-com-figure-display-type]:checked');
      var subType = parseInt($subType.val());

      var figures = share.figureComponent.components.map(function(com, index) {
        return {
          id: com.newAdded ? 0 : com.id,
          avatar: com.avatar,
          name: com.name,
          honorName: com.honorName,
          description: com.description,
          sort: index + 1,
        };
      });

      figures.forEach(function(i) {
        // 去掉 ? 号
        var avatarMarkIndex = i.avatar.indexOf('?');
        if (avatarMarkIndex >= 0) i.avatar = i.avatar.slice(0, avatarMarkIndex);

        // 替换 \n 为 <br>
        i.description = i.description.replace(/\n/g, '<br>');
      });

      componentData = {
        id: isUpdate ? id : 0,
        type: 2,
        sort: index,
        sortId: isUpdate ? sortId : 0,
        subType: subType,
        components: figures,
      };

      return !0;
    },
    // 检查图文组件的完整性
    checkComponentCompletenessForSwipeList: function(
      id,
      index,
      isUpdate,
      sortId
    ) {
      var self = this,
        $title, // 标题
        title,
        $displaySource, // 显示来源，分类显示还是指定条目
        displaySource,
        $sourceCategory, // 来源类别
        sourceCategory,
        $buddhistCategory, // 来源子类别
        buddhistCategory,
        $articleCategory, // 来源子类别
        articleCategory,
        $itemsCount, // 显示几个项目
        itemsCount,
        $subType, // 子类型
        subType,
        $showTitle, // 是否是否显示标题
        showTitle,
        $showMore, // 是否显示更多按钮
        showMore,
        $imageContainers, // 图片容器
        images = [];

      var $componentContainer = $(
        '[data-container="component-display"][data-type="3"][data-id="' +
          id +
          '"]'
      );

      $title = $('[data-swipe-list-title="' + id + '"]');
      title = $title.val().trim();
      !title && (title = indexData.misc.defaultTitle[2]);

      $sourceCategory = $('[ data-swipe-list-source-category="' + id + '"]');
      sourceCategory = parseInt($sourceCategory.val());

      $displaySource = $(
        '[data-swipe-list-display-source="' +
          id +
          '" ][data-type="' +
          sourceCategory +
          '"]:checked'
      );
      displaySource = parseInt($displaySource.val());

      $buddhistCategory = $(
        '[ data-swipe-list-source-sub-category="' + id + '"][data-type="1"]'
      );
      buddhistCategory = parseInt($buddhistCategory.val());

      $articleCategory = $(
        '[ data-swipe-list-source-sub-category="' + id + '"][data-type="2"]'
      );
      articleCategory = parseInt($articleCategory.val());

      $itemsCount = $('[data-swipe-list-items-count="' + id + '"]');
      itemsCount = parseInt($itemsCount.val());

      $imageContainers = $(
        '[data-upload-image-container][data-type="3"]' +
          '[data-source-type="' +
          sourceCategory +
          '"][data-component-id="' +
          id +
          '"]'
      );
      // 指定条目
      if (displaySource != 1 && !$imageContainers.length) {
        $.alert({
          title: false,
          content: '图文组件的图片不能为空，请选择至少一张图片',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        $componentContainer.trigger('click');
        return !1;
      }
      $imageContainers.map(function(index) {
        var $this = $(this),
          id = parseInt($this.attr('data-upload-image-container')),
          imageUrl = $this.attr('data-image'),
          markIndex = imageUrl.indexOf('?');

        images.push({
          id: sourceCategory == 1 ? id : 0,
          articleId: sourceCategory == 2 ? id : 0,
          url: markIndex >= 0 ? imageUrl.slice(0, markIndex) : imageUrl,
          content: $this.attr('data-content'),
          sort: index + 1,
        });
      });

      $subType = $('[data-swipe-list-sub-type="' + id + '"]:checked');
      subType = parseInt($subType.val());

      $showTitle = $('[data-swipe-list-show-title="' + id + '"]');
      showTitle = $showTitle.prop('checked');

      $showMore = $('[data-swipe-list-show-more="' + id + '"]');
      showMore = $showMore.prop('checked');

      componentData = {
        id: isUpdate ? id : 0,
        title: title,
        displaySource: displaySource,
        // 目前只有佛事，没有文章，所以就去掉这个键
        sourceCategory: sourceCategory,
        buddhistCategory: buddhistCategory,
        articleCategory: articleCategory,
        itemsCount: itemsCount,
        subType: subType,
        showTitle: showTitle ? 1 : 0,
        showMore: showMore ? 1 : 0,
        images: images,
        type: 3,
        sort: index,
        sortId: isUpdate ? sortId : 0,
      };

      return !0;
    },
    // 检查功德榜组件的完整性
    checkComponentCompletenessForDonateChart: function(
      id,
      index,
      isUpdate,
      sortId
    ) {
      var self = this,
        $title,
        title,
        $itemsCount,
        itemsCount,
        $realTimeCheckbox = $('[data-edit-donate-chart-type][data-index="1"]'),
        realTimeActive = $realTimeCheckbox.prop('checked'),
        $monthCheckbox = $('[data-edit-donate-chart-type][data-index="2"]'),
        monthActive = $monthCheckbox.prop('checked'),
        $totalCheckbox = $('[data-edit-donate-chart-type][data-index="3"]'),
        totalActive = $totalCheckbox.prop('checked');

      var $componentContainer = $(
        '[data-container="component-display"][data-type="4"][data-id="' +
          id +
          '"]'
      );

      // 一个榜单都不显示，则直接返回
      if (!realTimeActive && !monthActive && !totalActive) {
        $.alert({
          title: false,
          content: '功德榜组件的榜单至少需要一个，请选择',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        $componentContainer.trigger('click');
        return !1;
      }

      $title = $('[data-donate-chart-title="' + id + '"]');
      title = $title.val().trim();
      !title && (title = indexData.misc.defaultTitle[3]);
      $itemsCount = $('[data-donate-chart-items-count="' + id + '"]');
      itemsCount = parseInt($itemsCount.val());
      !itemsCount && (itemsCount = 10);

      componentData = {
        id: isUpdate ? id : 0,
        title: title,
        itemsCount: itemsCount,
        showRealTimeList: realTimeActive ? 1 : 0,
        showMonthList: monthActive ? 1 : 0,
        showTotalList: totalActive ? 1 : 0,
        type: 4,
        sort: index,
        sortId: isUpdate ? sortId : 0,
      };

      return !0;
    },
    // 检查佛历组件的完整性
    checkComponentCompletenessForCalendar: function(
      id,
      index,
      isUpdate,
      sortId
    ) {
      var self = this,
        data = {},
        $dateCells = $('[data-edit-calendar-new-add-cell]'),
        $activitiesCell;

      $dateCells.map(function() {
        var $this = $(this),
          year = $this.attr('data-year'),
          month = $this.attr('data-month'),
          day = $this.attr('data-day'),
          currentData = [];

        $activitiesCell = $this.find(
          '[data-edit-calendar-new-add-activity-cell]'
        );
        $activitiesCell.map(function() {
          var $this = $(this),
            id = parseInt($this.attr('data-id')),
            type = parseInt($this.attr('data-type'));
          currentData.push({
            id: id,
            type: type,
          });
        });

        year += '';
        month += '';
        day += '';
        data[
          year +
            '-' +
            (month.length <= 1 ? '0' + month : month) +
            '-' +
            (day.length <= 1 ? '0' + day : day)
        ] = currentData;
      });

      componentData = {
        id: isUpdate ? id : 0,
        type: 5,
        sort: index,
        sortId: isUpdate ? sortId : 0,
        data: data,
      };

      return !0;
    },
    // 检查快捷入口组件的完整性
    checkComponentCompletenessForShortcut: function(
      id,
      index,
      isUpdate,
      sortId
    ) {
      var self = this,
        $title = $('[data-edit-shortcut-title="' + id + '"]'),
        title = $title.val().trim(), // 快捷组件的标题可为空，为空则不显示
        $items = $('[data-edit-shortcut-cell="' + id + '"]'),
        items = [];

      var $componentContainer = $(
        '[data-container="component-display"][data-type="6"][data-id="' +
          id +
          '"]'
      );

      // 一个榜单都不显示，则直接返回
      if (!$items.length) {
        $.alert({
          title: false,
          content: '快捷入口组件至少需要一个项目，请选择',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        $componentContainer.trigger('click');
        return !1;
      }

      $items.map(function() {
        var $this = $(this);

        items.push({
          image: $this.attr('data-image'),
          title: $this.attr('data-title'),
          link: $this.attr('data-link'),
          type: parseInt($this.attr('data-type')) || 0,
          linkType: parseInt($this.attr('data-link-type')) || 0,
          subTypeId: parseInt($this.attr('data-sub-type-id')) || 0,
        });
      });

      componentData = {
        id: isUpdate ? id : 0,
        title: title,
        items: items,
        type: 6,
        sort: index,
        sortId: isUpdate ? sortId : 0,
      };

      return !0;
    },
    // 检查殿堂场景组件的完整性
    checkComponentCompletenessForHouse: function(id, index, isUpdate, sortId) {
      var $componentContainer = $(
        '[data-container="component-display"][data-type="7"][data-id="' +
          id +
          '"]'
      );

      if (!share.houseComponent.houses || !share.houseComponent.houses.length) {
        $.alert({
          title: false,
          content: '请至少添加一个殿堂场景',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        $componentContainer.trigger('click');
        return !1;
      }

      var $subType = $('[data-edit-com-house-display-type]:checked');
      var subType = parseInt($subType.val());

      var $title = $('[data-edit-com-house-title]');
      var title = $title.val();

      if (!title) {
        $.alert({
          title: false,
          content: '组件标题不能为空',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        $componentContainer.trigger('click');
        return !1;
      }

      var houses = share.houseComponent.houses.map(function(house, index) {
        return {
          id: house.newAdded ? 0 : house.id,
          name: house.name,
          covers: house.covers,
          intro: house.intro,
          sort: index + 1,
        };
      });

      houses.forEach(function(i) {
        var covers = i.covers.map(function(cover) {
          // 去掉 ? 号
          var avatarMarkIndex = cover.indexOf('?');

          if (avatarMarkIndex >= 0) return cover.slice(0, avatarMarkIndex);
          else return cover;
        });

        i.covers = covers.join(',');

        // 替换 \n 为 <br>
        i.intro = i.intro.replace(/\n/g, '<br>');
      });

      componentData = {
        id: isUpdate ? id : 0,
        type: 7,
        sort: index,
        sortId: isUpdate ? sortId : 0,
        title: title,
        subType: subType,
        houses: houses,
      };

      return !0;
    },
    // 处理全局组件数据，与服务器对接
    preHandleComponentsData: function() {
      if ($.seeAjax.getEnv() !== 2) {
        JSON.refactor(componentData, saveReverse[componentData.type - 1] || {});

        // 高僧法师
        if (componentData.type === 2) {
          componentData.list.forEach(function(com) {
            com.showType = componentData.subType;
          });

          delete componentData.subType;
        }
        // 佛历
        else if (componentData.type === 5) {
          componentData.events = [];
          Object.keys(componentData.data).map(function(date) {
            componentData.data[date].map(function(activity) {
              var data = {
                date: date,
              };
              // 佛事
              activity.type === 1
                ? (data.commodityId = activity.id)
                : // 新建标题
                  (data.title = indexData.calendarNewAddedTitle[activity.id]);
              componentData.events.push(data);
            });
          });
          // 删除原有的data字段
          delete componentData.data;
        }
        // 殿堂场景
        else if (componentData.type === 7) {
          componentData.list.forEach(function(com) {
            com.showType = componentData.subType;
            com.moduleName = componentData.title;
          });

          delete componentData.subType;
          delete componentData.title;
        }
      }
    },
  });
});
