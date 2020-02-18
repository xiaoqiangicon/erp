import handlebars from 'handlebars';
const tpl = `
    <div class="notice-null">
        <div class="n-img">
            <img src="https://pic.zizaihome.com/884ef18b-7fcd-45ac-ba2f-c99a86183436.png" />
        </div>
        <div class="n-text">暂时没有未读消息</div>
        <a class="n-more-btn" href="/common/notice">查看全部通知</a>
    </div>
`;
export default handlebars.compile(tpl);
