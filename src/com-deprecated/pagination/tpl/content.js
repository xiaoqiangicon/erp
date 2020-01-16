import juicer from 'juicer';
var tpl = `
    {@if showDesc}
    <span class="text-0-1">共\${totalCount}条，每页\${perPage}条</span>
    {@/if}

    {@if totalPages > 1 && currentPage != 1}
    <button class="cell-0-1" data-zzh-pagination-cell="-1" data-zzh-pagination-id="\${id}">上一页</button>
    {@/if}

    {@if totalPages <= 7}
    {@each pages as page}
    <button class="cell-0-1 {@if currentPage == page}active{@/if}" data-zzh-pagination-cell="\${page}" data-zzh-pagination-id="\${id}">\${page}</button>
    {@/each}

    {@else}
    {@each pages as page}
    {@if page == 1 || page == totalPages || currentPage <= 4 && page <= 4 || currentPage >= totalPages - 3 && page >= totalPages - 3 || currentPage - page == 1 || currentPage - page == 0 || currentPage - page == -1}
    <button class="cell-0-1 {@if currentPage == page}active{@/if}" data-zzh-pagination-cell="\${page}" data-zzh-pagination-id="\${id}">\${page}</button>
    {@else if currentPage > 4 && page == 2 || currentPage < totalPages - 3 && page == totalPages - 1}
    <button class="cell-0-1 disabled">...</button>
    {@/if}
    {@/each}
    {@/if}

    {@if totalPages > 1 && currentPage != totalPages}
    <button class="cell-0-1" data-zzh-pagination-cell="-2" data-zzh-pagination-id="\${id}">下一页</button>
    {@/if}

    {@if showGoTo}
    <input class="input-0-1" data-zzh-pagination-input="\${id}">
    <button class="cell-0-1" data-zzh-pagination-cell="-3" data-zzh-pagination-id="\${id}">跳到</button>
    {@/if}
`;
export default juicer(tpl);
