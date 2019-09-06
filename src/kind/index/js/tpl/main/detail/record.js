import handlebars from 'handlebars';

const tpl = `
    <div class="main-record">
    {{#each list}}
        <div class="record-item">
            <div class="record-item-header">
                <div class="record-item-header-left">
                    <p class="record-item-time">发布时间： {{addTime}}</p>
                    {{#if isShow}}<div class="ispush" record-data-ispush="1">已推送</div>{{/if}}
                </div>
                <div class="record-edit">编辑</div>
                <div class="record-operate">
                    <div class="record-btn record-cancel">取消</div>
                    <div class="record-btn record-save">保存</div>
                </div>
            </div>
            <div class="record-item-main">
                <div class="record-item-content">
                    {{content}}
                </div>
                <div class="record-item-media">
                    <div class="record-item-pic">
                        {{#each img}}
                            {{#unless type}}
                                <img class="record-single-pic" src="{{src}}" />
                            {{/unless}}
                            {{#if type}}
                                <video class="record-single-video" src="{{src}}"></video>
                            {{/if}}
                        {{/each}}
                    </div>
                </div>
            </div>
            <div class="record-item-edit">
                <div class="record-publish-content">
                    <span class="record-content-tips">内容</span>
                    <div class="record-publish-edit-content">
                        <textarea class="record-type-content" placeholder="请填写进展动态的内容">{{content}}</textarea>
                        <div class="record-text-3"><span record-data-text-count-show="1">0</span>/300</div>
                    </div>
                </div>
                <div class="record-publish-media">
                    <span class="record-publish-media-tips">图片视频</span>
                    <div class="record-upload-block">
                        <div class="record-media">
                            {{#each img}}
                                {{#unless type}}
                                    <div class="item-0-1" data-cover-item="1">
                                        <img src="{{src}}" data-cover-item-image="1">
                                        <button class="clean common-delete" data-cover-item-delete="1">X</button>
                                    </div>
                                {{/unless}}
                                {{#if type}}
                                    <div class="item-video-1" data-cover-video-item="1">
                                        <video src="{{src}}" data-cover-item-image="0" data-cover-item-video="1"></video>
                                        <button class="clean common-delete" data-cover-item-video-delete="1">X</button>
                                        <div class="video-mask"></div>
                                    </div>
                                {{/if}}
                            {{/each}}
                        </div>
                        <div class="record-upload-block-btn">
                            <div class="record-upload-btn record-upload-pic">上传图片</div>
                            <div class="record-upload-btn record-upload-video">上传小视频</div>
                            <div class="upload-fails record-fail-big"><span class="fail-warn">!</span>上传失败，文件过大</div>
                            <div class="upload-fails record-fail-format"><span class="fail-warn">!</span>上传失败，不支持当前格式</div>
                        </div>
                        <p class="record-upload-tips">图片格式支持JPG、PNG等，视频格式支持MP4、WMV、MOV等，文件大小不超过50M</p>
                    </div>
                </div>
                <div class="record-set-push">
                    <span class="record-set-push-tips">推送</span>
                    <span class="record-push-select record-push-candidate" record-data-push="1">推送给参与者</span>
                    <span class="record-push-select record-no-push record-push-select-active" record-data-push="0">不推送</span>
                    <span class="remain-time-content">剩余次数:&nbsp&nbsp<span class="remain-time" data-remain-time="0"></span></span>
                    <div class="push-tips">为了保证良好的体验避免对用户造成过多的打扰，已限制推送次数（每日0:00刷新次数）</div>
                </div>
            </div>
        </div>
        {{/each}}
        <div class="no-more-list" data-no-list="1">此佛事还没有发布过进展动态哦，现在就去发布吧。</div>
    </div>
`;

export default handlebars.compile(tpl);
