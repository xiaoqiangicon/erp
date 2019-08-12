import juicer from 'juicer';

var tpl = {
  container: `
        <div class="component-pagination-container" data-component-pagination-container="\${id}"></div>
    `,
  pagination: `
        {@if showDesc}
        <span class="component-pagination-description">共\${totalCount}条，每页\${perPage}条</span>
        {@/if}
        {@if totalPages > 1 && currentPage != 1}
        <a class="component-pagination-cell" data-component-pagination-cell="-1" data-component-pagination-id="\${id}">上一页</a>
        {@/if}
        {@if totalPages <= 7}
        {@each pages as page}
        <a class="component-pagination-cell {@if currentPage == page}active{@/if}" data-component-pagination-cell="\${page}" data-component-pagination-id="\${id}">\${page}</a>
        {@/each}
        {@else}
        {@each pages as page}
        {@if page == 1 || page == totalPages || currentPage <= 4 && page <= 4 || currentPage >= totalPages - 3 && page >= totalPages - 3 || currentPage - page == 1 || currentPage - page == 0 || currentPage - page == -1}
        <a class="component-pagination-cell {@if currentPage == page}active{@/if}" data-component-pagination-cell="\${page}" data-component-pagination-id="\${id}">\${page}</a>
        {@else if currentPage > 4 && page == 2 || currentPage < totalPages - 3 && page == totalPages - 1}
        <a class="component-pagination-cell disabled">...</a>
        {@/if}
        {@/each}
        {@/if}
        {@if totalPages > 1 && currentPage != totalPages}
        <a class="component-pagination-cell" data-component-pagination-cell="-2" data-component-pagination-id="\${id}">下一页</a>
        {@/if}
        {@if showGoTo}
        <input class="component-pagination-cell-input" data-component-pagination-input="1" data-component-pagination-id="\${id}">
        <a class="component-pagination-cell" data-component-pagination-cell="-3" data-component-pagination-id="\${id}">跳到</a>
        {@/if}
    `
};

var compiledTpl = {};

Object.keys(tpl).map(function (key) {
  compiledTpl[key] = juicer(tpl[key]);
});


export default compiledTpl;
