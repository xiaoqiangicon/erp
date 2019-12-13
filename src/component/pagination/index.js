'use strict';
import './index.less';
import $ from 'jquery';
import data from './data';
import containerTpl from './tpl/container';
import contentTpl from './tpl/content';
import logger from './util/logger';
import './view';
class Pagination {
  constructor(container, option) {
    if (!container || !option) logger.throwError('缺少配置项');
    var self = this,
      $container,
      containerType = typeof container;
    if (containerType == 'string') $container = $(container);
    else if (
      containerType == 'object' &&
      container.nodeType == 1 &&
      typeof container.nodeName == 'string'
    )
      $container = $(container);
    else if (container instanceof $) $container = container;
    else
      logger.throwError(
        '未知父容器；父容器必须是：selector选择器, dom对象, jquery对象'
      );
    self.id = data.count++;
    self.$container = $(
      containerTpl.render({
        id: self.id,
      })
    );
    $container.html(self.$container);
    self.option = $.extend(true, {}, data.defaultOption, option || {});
    if (!self.option.totalPages) logger.throwError('缺少总页码');
    data.options[self.id] = self.option;
    self.__init();
  }
  __init() {
    var self = this;
    self.option.pendingPage = 0;
    self.option.id = self.id;
    var i,
      il,
      pages = [];
    for (i = 0; i < self.option.totalPages; i++) pages.push(i + 1);
    self.option.pages = pages;
  }
  render() {
    var self = this;
    if (!self.option.pendingPage) {
      self.option.pendingPage = self.option.currentPage;
      self.$container.html(contentTpl.render(self.option));
    } else if (self.option.pendingPage != self.option.currentPage) {
      self.option.currentPage = self.option.pendingPage;
      self.$container.html(contentTpl.render(self.option));
    }
  }
}
export default Pagination;
