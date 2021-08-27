import juicer from 'juicer';
var tpl = {
  buddhistTypeOption: `
        <option value="\${ceremonyTypeId}">\${name}</option>
    `,
  buddhistStatusOption: `
        <option value="1">进行中</option>
        <option value="2">待审核</option>
        <option value="3">未开始</option>
        <option value="4">已结束</option>
        <option value="5">草稿</option>
    `,
  cellCtnrEmpty: `
        <tr class="cell-ctnr-empty"><td colspan="8">暂无数据</td></tr>
    `,
  cellCtnrLoading: `
        <tr class="cell-ctnr-loading"><td style="height: 400px;" colspan="8">数据加载中...</td></tr>
    `,
  tableCell: `
        <tr data-id="\${id}">
            <td>
                <div class="table-cell-common">
                    <p class="mgt10">\${id}</p>
                </div>
            </td>
            <td>
                <div class="table-cell-buddhist">
                    <div class="table-cell-buddhist-image">
                        <img src="\${pic}">
                    </div>
                    <div class="table-cell-buddhist-text">
                        <p class="table-cell-buddhist-title"><a href="\${previewUrl}" target="_blank">\${name}</a></p>
                        <p class="table-cell-buddhist-content">
                        {@if !price}
                            随喜
                        {@else}
                            {@if price.length > 60}
                                \${price.split(",").slice(0,20).join(",")+"..."}
                            {@else}
                                \${price}
                            {@/if}
                        {@/if}
                        </p>
                    </div>
                </div>
            </td>
            <td>
                <div class="table-cell-common">
                    <p class="mgt10">\${joinNum}</p>
                </div>
            </td>
            <td>
                <div class="table-cell-common">
                    <p class="mgt10">\${collectMoney}</p>
                </div>
            </td>
            <td>
                <div class="table-cell-common">
                    <p class="mgt10">\${view_count}</p>
                </div>
            </td>
            <td>
                <div class="table-cell-common">
                    {@if ifHasPrt}
                        {@if ifHasAddPrt}
                            <p class="inline-block float-left mgb0" data-id="\${id}" data-html="true" data-toggle="tooltip" data-placement="left" data-delay={show:1000}><a class="table-cell-button" style="color:rgb(111, 186, 44)" data-ifHasSub="\${ifHasSub}" data-id="\${id}">已添加</a></p>
                        {@else}
                            <p class="inline-block float-left mgb0" title="为了方便您处理用户的订单请在编辑中添加小票打印机" data-id="\${id}" data-html="true" data-toggle="tooltip"><a class="table-cell-button not-add" style="color:#999" data-ifHasSub="\${ifHasSub}"  data-id="\${id}">未添加</a></p>
                        {@/if}
                    {@else}
                        <p class="inline-block float-left mgb0" title="开通打印机功能可以方便快捷处理用户的订单，请联系自在家平台管理员开通。" data-toggle="tooltip">未开通</p>
                    {@/if}
                </div>
            </td>
            <td>
                <div class="table-cell-common">
                <p class="buddhist-status" data-ele="status">
                <a href="javascript:void(0)">
                <!-- 五种状态 进行中 待审核 未开始 已结束 草稿 -->
                {@if status === 0}
                    {@if isEnd === -1}
                        <span style="color:#aaa">未开始</span>
                    {@else if isEnd === 0}
                        {@if isStart === 0}
                            <span style="color:#aaa">未开始</span>
                        {@else}
                            <!-- === 1 -->
                            <span style="color:rgb(111, 186, 44)" data-toggle="tooltip" data-placement="bottom" title="\${remainTimeText}">进行中</span>
                        {@/if}
                    {@else}
                        <!-- === 1 -->
                        <span style="color:#999">已结束</span>
                    {@/if}
                {@else if status === 1}
                    <span>待审核</span>
                {@else}
                    <!-- === 2 -->
                    <span style="color:#999;">草稿</span>
                    {@if content}
                    <span class="forbid-label" data-content="\${content}">不通过原因</span>
                    {@/if}
                {@/if}

                </a>
                </p>
                </div>
            </td>
            <td>
                <div class="table-cell-common">
                    <!-- 五种状态 进行中 待审核 未开始 已结束 草稿 -->
                    {@if status === 0}
                        {@if isEnd === -1}
                            <!-- 未开始 编辑、推广、删除、复制、设为模板 -->
                            <p class="inline-block buddhist-opt">
                                <a class="table-cell-button" data-id="\${id}" data-opt="edit" data-verify="{@if status === 0}1{@else if status === 1}0{@else}2{@/if}">编辑</a>
                            </p>
                            <p class="inline-block buddhist-opt">
                                <a class="table-cell-button" data-id="\${id}" data-opt="promotion" data-url="\${wxUrl}" data-status="\${status}">推广</a>
                            </p>
                            <select class="more-opt" data-ele="more-opt" data-id="\${id}" data-url="\${wxUrl}" data-status="\${status}" title="更多">
                                <option value="0">删除</option>
                                <option value="1">复制</option>
                                <option value="2">设为模板</option>
                            </select>
                        {@else if isEnd === 0}
                            {@if isStart === 0}
                                <!-- 未开始 编辑、推广、删除、复制、设为模板 -->
                                <p class="inline-block buddhist-opt">
                                    <a class="table-cell-button" data-id="\${id}" data-opt="edit" data-verify="{@if status === 0}1{@else if status === 1}0{@else}2{@/if}">编辑</a>
                                </p>
                                <p class="inline-block buddhist-opt">
                                    <a class="table-cell-button" data-id="\${id}" data-opt="promotion" data-url="\${wxUrl}" data-status="\${status}">推广</a>
                                </p>
                                <select class="more-opt" data-ele="more-opt" data-id="\${id}" data-url="\${wxUrl}" data-status="\${status}" title="更多">
                                    <option value="0">删除</option>
                                    <option value="1">复制</option>
                                    <option value="2">设为模板</option>
                                </select>
                            {@else}
                                <!-- === 1 -->
                                <!-- 进行中 编辑、推广、 发布进展、设为已结束、删除、复制、设为模板 -->
                                <p class="inline-block buddhist-opt">
                                    <a class="table-cell-button" data-id="\${id}" data-opt="schedule">发布进展</a>
                                </p>
                                <p class="inline-block buddhist-opt">
                                    <a class="table-cell-button" data-id="\${id}" data-opt="edit" data-verify="{@if status === 0}1{@else if status === 1}0{@else}2{@/if}">编辑</a>
                                </p>
                                <p class="inline-block buddhist-opt">
                                    <a class="table-cell-button" data-id="\${id}" data-opt="promotion" data-url="\${wxUrl}" data-status="\${status}">推广</a>
                                </p>
                                <select class="more-opt" data-ele="more-opt" data-id="\${id}" data-url="\${wxUrl}" data-status="\${status}" title="更多">
                                    <option value="4">设为结束</option>
                                    <option value="1">复制</option>
                                    <option value="2">设为模板</option>
                                </select>
                            {@/if}
                        {@else}
                            <!-- === 1 -->
                            <!-- 已结束 发布进展、复制、设为模板 -->
                            <p class="inline-block buddhist-opt">
                                <a class="table-cell-button" data-id="\${id}" data-opt="schedule">发布进展</a>
                            </p>
                            <p class="inline-block buddhist-opt">
                                <a class="table-cell-button" data-id="\${id}" data-opt="copy">复制</a>
                            </p>
                            <p class="inline-block buddhist-opt">
                                <a class="table-cell-button" data-id="\${id}" data-opt="template">设为模板</a>
                            </p>

                        {@/if}
                    {@else if status === 1}
                        <!-- 待审核 编辑、预览、删除 -->
                        <p class="inline-block buddhist-opt">
                            <a class="table-cell-button" data-id="\${id}" data-opt="edit" data-verify="{@if status === 0}1{@else if status === 1}0{@else}2{@/if}">编辑</a>
                        </p>
                        <p class="inline-block buddhist-opt">
                            <a class="table-cell-button" data-id="\${id}" data-opt="promotion" data-url="\${wxUrl}" data-status="\${status}">预览</a>
                        </p>
                        <p class="inline-block buddhist-opt">
                            <a class="table-cell-button" data-id="\${id}" data-opt="del">删除</a>
                        </p>
                    {@else}
                        <!-- === 2 -->
                        <!-- 草稿 编辑、预览、删除 -->
                        <p class="inline-block buddhist-opt">
                            <a class="table-cell-button" data-id="\${id}" data-opt="edit" data-verify="{@if status === 0}1{@else if status === 1}0{@else}2{@/if}">编辑</a>
                        </p>
                        <p class="inline-block buddhist-opt">
                            <a class="table-cell-button" data-id="\${id}" data-opt="promotion" data-url="\${wxUrl}" data-status="\${status}">预览</a>
                        </p>
                        <p class="inline-block buddhist-opt">
                            <a class="table-cell-button" data-id="\${id}" data-opt="del">删除</a>
                        </p>
                    {@/if}
                </div>
            </td>
        </tr>
    `,
  noSubPrtList: `
        {@each data as item, index}
        <div class="prt-div mgr10">
            <input id="no-sub-checkbox-\${item.id}" type="checkbox" class="prt-checkbox" data-id="\${item.id}" data-ele="no-sub-prt-checkbox"/>
            <label for="no-sub-checkbox-\${item.id}" class="prt-cont csp">\${item.address}</label>
        </div>
        {@/each}
    `,
  subPrtOption: `
        {@each data as item, index}
        <option value="\${item.id}">\${item.address}</option>
        {@/each}
    `,
  subList: `
        {@each data as item, index}
        <div>
            <input type="checkbox" id="sub-checkbox-\${item.id}" class="sub-checkbox" data-ele="sub-checkbox" data-id="\${item.id}"/>
            <label for="sub-checkbox-\${item.id}" class="sub-cont csp">\${item.subdivideName}</label>
        </div>
        {@/each}
    `,
  scheduleContentTextarea: `
        <div class="s-textarea-container" data-ele="s-textarea-container">
            <textarea data-ele="s-textarea" data-schedule-content="" class="form-control" name="" maxlength="300" cols="30" rows="8" style="resize: none;" placeholder="请填写进展动态的内容">\${scheduleContent}</textarea>
            <div class="s-textarea-num-tip" data-ele="s-textarea-num-tip">0/300</div>
        </div>
    `,
  scheduleImgCell: `
        <div class="schedule-img-cell" data-ele="img-cell">
            <img data-ele="schedule-img" class="schedule-img" src="\${src}" alt="">
            <img data-ele="del-img" class="schedule-img-del" src="https://pic.zizaihome.com/b36bbb7c-a12c-11e8-9f56-00163e0c001e.png" alt="">
        </div>
    `,
  scheduleVideoUploadLoading: `
    <div class="schedule-video-upload-loading" data-ele="video-upload-loading">
        <div class="progress-container">
            <div class="progress" data-ele="progress"></div>
        </div>
        <div class="progress-text" data-ele="progress-text"></div>
        <img data-ele="del-video-upload" class="schedule-video-del"
            src="https://pic.zizaihome.com/b36bbb7c-a12c-11e8-9f56-00163e0c001e.png"
            alt="">
    </div>
  `,
  scheduleVideoCell: `
        <div class="schedule-video-cell" data-ele="video-cell" data-src="\${src}">
            <img data-ele="schedule-video" class="schedule-video" src="\${src}?vframe/jpg/offset/1" alt="">
            <img data-ele="del-video" class="schedule-video-del" src="https://pic.zizaihome.com/b36bbb7c-a12c-11e8-9f56-00163e0c001e.png" alt="">
            <img data-ele="play-video" class="schedule-video-play" src="https://pic.zizaihome.com/92a3ad40-6fef-11e9-9c48-00163e0c001e.png">
        </div>
    `,
  scheduleListEmpty: `
        <div style="height: 400px; line-height: 400px;text-align: center;">
        此佛事还没有发布过进展动态哦，现在就去发布吧
        </div>
    `,
  scheduleItem: `
        <div class="schedule-item" data-ele="schedule-item" data-id="\${id}">
            <div class="item-head">
                <span class="fwb">发布时间：\${addTime}</span>
                {@if isShow}
                <span class="item-icon">已推送</span>
                {@/if}
                <button data-ele="save-schedule-item" type="button" class="mgt10 mgl20 btn btn-success btn-sm pull-right btn-save-schedule">保存</button>
                <button data-ele="cancel-schedule-item" type="button" class="mgt10 btn btn-default btn-sm pull-right btn-cancel-schedule">取消</button>
                <button data-ele="edit-schedule-item" type="button" class="mgt10 btn btn-info btn-sm pull-right btn-edit-schedule">编辑</button>
            </div>
            <div class="item-body">
                <p class="item-content" data-ele="schedule-content" style="white-space: pre-line;">
                    \${content}
                </p>
                <div class="item-img mgt10 clearfix">
                    <div class="clearfix">
                    {@each img as item}
                     <div class="schedule-img-cell" data-ele="img-cell">
                        <img data-ele="schedule-img" class="schedule-img" src="\${item}" alt="">
                        <img data-ele="del-img" class="schedule-img-del" src="https://pic.zizaihome.com/b36bbb7c-a12c-11e8-9f56-00163e0c001e.png" alt="">
                    </div>
                    {@/each}
                    {@each video as item}
                    <div class="schedule-video-cell" data-ele="video-cell" data-src="\${item}">
                        <img data-ele="schedule-video" class="schedule-video" src="\${item}?vframe/jpg/offset/1" alt="">
                        <img data-ele="del-video" class="schedule-video-del" src="https://pic.zizaihome.com/b36bbb7c-a12c-11e8-9f56-00163e0c001e.png" alt="">
                        <img data-ele="play-video" class="schedule-video-play" src="https://pic.zizaihome.com/92a3ad40-6fef-11e9-9c48-00163e0c001e.png" alt="">
                    </div>
                    {@/each}
                    </div>
                    <div>
                    <div class="upload-btn mgr10" data-ele="add-img">上传图片</div>
                    <div class="upload-btn" data-ele="add-video">上传小视频</div>
                    </div>
                </div>
                <!--链接-->
                <div class="row mgt20">
                    <div class="col-md-1 fwb" style="height: 40px; line-height: 40px;">链接</div>
                    <div class="col-md-11" style="height: 40px; line-height: 40px; padding-left: 20px;">
                        {@if url}
                        <span id="schedule-url">\${url}</span>
                        {@/if}
                        {@if !url}
                        <span>未修改</span>
                        {@/if}
                    </div>
                </div>
                <!--推送-->
                {@if !isShow}
                <div class="row mgt10 item-push-set" data-ele="schedule-push-set">
                    <div class="col-md-1 fwb" style="height: 40px; line-height: 40px;">推送</div>
                    <div class="col-md-11">
                        <label class="radio-inline" style="padding-left: 0;" for="push-schedule-\${id}">
                            {@if todayNum <= 0}
                            <input type="radio" name="if-push-\${id}" id="push-schedule-\${id}" value="1" disabled>
                            {@else}
                            <input type="radio" name="if-push-\${id}" id="push-schedule-\${id}" value="1">
                            {@/if}
                            <span class="radio"></span>
                            <span>推送给参与者</span>
                        </label>
                        <label class="radio-inline" style="padding-left: 0;" for="not-push-schedule-\${id}">
                            <input type="radio" name="if-push-\${id}" id="not-push-schedule-\${id}" value="0" checked>
                            <span class="radio"></span>
                            <span>不推送</span>
                        </label>
                        <span class="push-times">剩余次数：<span data-ele="push-times">\${todayNum}</span></span>
                        <div class="push-times-tip">  为了保证良好的体验避免对用户造成过多的打扰，已限制推送次数（每日0:00刷新次数）</div>
                    </div>
                </div>
                {@/if}
            </div>
        </div>
    `,
};
var compiledTpl = {};
Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
