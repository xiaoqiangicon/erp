export default `
    <div class="main-content">
        <div class="publish-content">
            <span class="content-tips">内容</span>
            <textarea class="type-content" placeholder="请填写进展动态的内容"></textarea>
            <div class="text-3"><span data-text-count-show="1">0</span>/300</div>
        </div>
        <div class="publish-media">
            <span class="publish-media-tips">图片视频</span>
            <div class="upload-block">
                <div class="media" id="cover-container"></div>
                <div class="upload-block-btn">
                    <div class="upload-btn upload-pic">上传图片</div>
                    <div class="upload-btn upload-video">上传小视频</div>
                    <div class="upload-fails fail-big"><span class="fail-warn">!</span>上传失败，文件过大</div>
                    <div class="upload-fails fail-format"><span class="fail-warn">!</span>上传失败，不支持当前格式</div>
                </div>
                <p class="upload-tips">图片格式支持JPG、PNG等，视频格式支持MP4、WMV、MOV等，文件大小不超过50M</p>
            </div>
        </div>
        <div class="set-push">
            <span class="set-push-tips">推送</span>
            <span class="push-select push-candidate" data-push="1">推送给参与者</span>
            <span class="push-select no-push push-select-active" data-push="0">不推送</span>
        </div>
        <div class="save">保存</div>
    </div>
`;
