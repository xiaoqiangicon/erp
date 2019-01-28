define(['juicer'], __module__0 => {
  const exports = {};
  const module = { exports: {} };
  __module__0;
  const tpl = {
    container:
      '\n        <div class="component-pagination-container" data-component-pagination-container="${id}"></div>\n    ',
    pagination:
      '\n        {@if showDesc}\n        <span class="component-pagination-description">共${totalCount}条\uFF0C每页${perPage}条</span>\n        {@/if}\n        {@if totalPages > 1 && currentPage != 1}\n        <a class="component-pagination-cell" data-component-pagination-cell="-1" data-component-pagination-id="${id}">上一页</a>\n        {@/if}\n        {@if totalPages <= 7}\n        {@each pages as page}\n        <a class="component-pagination-cell {@if currentPage == page}active{@/if}" data-component-pagination-cell="${page}" data-component-pagination-id="${id}">${page}</a>\n        {@/each}\n        {@else}\n        {@each pages as page}\n        {@if page == 1 || page == totalPages || currentPage <= 4 && page <= 4 || currentPage >= totalPages - 3 && page >= totalPages - 3 || currentPage - page == 1 || currentPage - page == 0 || currentPage - page == -1}\n        <a class="component-pagination-cell {@if currentPage == page}active{@/if}" data-component-pagination-cell="${page}" data-component-pagination-id="${id}">${page}</a>\n        {@else if currentPage > 4 && page == 2 || currentPage < totalPages - 3 && page == totalPages - 1}\n        <a class="component-pagination-cell disabled">...</a>\n        {@/if}\n        {@/each}\n        {@/if}\n        {@if totalPages > 1 && currentPage != totalPages}\n        <a class="component-pagination-cell" data-component-pagination-cell="-2" data-component-pagination-id="${id}">下一页</a>\n        {@/if}\n        {@if showGoTo}\n        <input class="component-pagination-cell-input" data-component-pagination-input="1" data-component-pagination-id="${id}">\n        <a class="component-pagination-cell" data-component-pagination-cell="-3" data-component-pagination-id="${id}">跳到</a>\n        {@/if}\n    ',
  };
  const compiledTpl = {};
  Object.keys(tpl).map(key => {
    compiledTpl[key] = juicer(tpl[key]);
  });
  module.exports = compiledTpl;
  function __isEmptyObject(obj) {
    let attr;
    for (attr in obj) return !1;
    return !0;
  }
  function __isValidToReturn(obj) {
    return (
      typeof obj !== 'object' || Array.isArray(obj) || !__isEmptyObject(obj)
    );
  }
  if (__isValidToReturn(module.exports)) return module.exports;
  if (__isValidToReturn(exports)) return exports;
});
