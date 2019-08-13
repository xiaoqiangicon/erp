import $ from 'jquery';
import tpl from './pagination/tpl';
import data from './pagination/data';
import './pagination/view';
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

export default Pagination;
