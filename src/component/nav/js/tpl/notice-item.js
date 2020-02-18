import handlebars from 'handlebars';
const tpl = `
<div class="n-main">
    {{#each items}}
    <div class="notice-item" data-notice-item-id="{{this.id}}">
        <div class="n-item-head">
            <div class="n-tab">未读</div>
            <div class="n-date">{{this.addTime}}</div>
        </div>
        <div class="n-item-op">
            <div class="n-text">产品通知</div>
            <div class="n-read-btn" data-notice-item-read="{{this.id}}">标为已读</div>
        </div>
        <div class="n-title">{{this.title}}</div>
    </div>
    {{/each}}
</div>
<a href="/common/notice" class="n-footer">查看全部通知</a>
`;
export default handlebars.compile(tpl);
