/**
 * 分页组件组件
 *
 * js: define(['component/pagination'], function(Pagination){
 *     var pagination = new Pagination(container, option);
 *
 *     container: 父容器选择器(selector选择器, dom对象, jquery对象)
 *     option: 配置选项
 *         {
 *              onChange: function(pageToChange){}, // 切换页码回调函数，页面以 1 开始索引
 *              showDesc: !1, // 是否显示左边（共多少条，每页多少条的信息）
 *              showGoTo: !1, // 是否显示右边跳转到某一页
 *              currentPage: 1, // 初始化当前页
 *              totalPages: 0, // 总页数
 *              totalCount: 0, // 总条数
 *              perPage: 0 // 每页条数
 *         };
 *
 *     属性
 *     pagination.option.currentPage // 当前页码
 *
 *     方法
 *     pagination.render() // 渲染页码
 *
 *     提示：每次调用 onChange 回调函数后，需要手动触发 render 方法，实例化后也需要手动触发 render 方法
 * })
 *
 * css: InCss.use('component/pagination');
 *
 * Created by senntyou on 2017/8/19.
 */

define([
  'jquery',
  './pagination/tpl',
  './pagination/data',
  './pagination/view',
], ($, tpl, data) => {
  /**
   * 构造函数
   * @param container
   * @param option
   *
   * @constructor
   */
  function Pagination(container, option) {
    if (!container || !option)
      throw new Error('component/pagination: 缺少配置项');

    const self = this;

    let $container;

    const containerType = typeof container;
    // selector
    if (containerType == 'string') $container = $(container);
    // dom
    else if (
      containerType == 'object' &&
      container.nodeType == 1 &&
      typeof container.nodeName === 'string'
    )
      $container = $(container);
    else if (container instanceof $) $container = container;
    else
      throw new Error(
        'component/pagination: 未知父容器；父容器必须是：selector选择器, dom对象, jquery对象'
      );

    self.id = data.componentCount++;
    self.$container = $(tpl.container.render({ id: self.id }));
    $container.html(self.$container);

    self.option = $.extend(true, {}, data.defaultOption, option || {});

    if (!self.option.totalPages)
      throw new Error('component/pagination: 缺少总页码');

    data.componentsOptions[self.id] = self.option;

    self.__init();
  }

  Pagination.prototype = {
    constructor: Pagination,
    __init() {
      const self = this;

      self.option.pendingPage = 0; // 点击分页后，待渲染的激活页码

      self.option.id = self.id;

      let i;
      let il;
      const pages = [];
      for (i = 0; i < self.option.totalPages; i++) pages.push(i + 1);
      self.option.pages = pages;
    },
    render() {
      const self = this;
      // 第一次调用
      if (!self.option.pendingPage) {
        self.option.pendingPage = self.option.currentPage;
        self.$container.html(tpl.pagination.render(self.option));
      } else if (self.option.pendingPage != self.option.currentPage) {
        self.option.currentPage = self.option.pendingPage;
        self.$container.html(tpl.pagination.render(self.option));
      }
    },
  };

  return Pagination;
});
