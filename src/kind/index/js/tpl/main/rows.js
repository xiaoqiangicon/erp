import handlebars from "handlebars";
const tpl = `
{{#each data}}
<div class="row-1" data-row="{{this.id}}">
    <div class="item-1 item-1-1">{{this.id}}</div>
    <div class="item-1 item-1-2">{{this.title}}</div>
    <div class="item-1 item-1-3">{{this.totalMoney}}</div>
    <div class="item-1 item-1-4">{{this.totalPeople}}</div>
    <div class="item-1 item-1-5">
        <button class="clean btn-1" data-row-edit="{{this.id}}">编辑</button>
        <button class="clean btn-1" data-row-record="{{this.id}}">善行记录</button>
        <button class="clean btn-1" data-row-promo="{{this.id}}">推广</button>
        <button class="clean btn-1" data-row-delete="{{this.id}}">删除</button>
    </div>
</div>
{{/each}}
`;
export default handlebars.compile(tpl);
