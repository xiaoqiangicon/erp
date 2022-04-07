/**
 *
 * 详见: /static/resources/json/menu_items_test.json（测试环境）
 *       /static/resources/json/menu_items.json（产品环境机）
 *
 * format
 *
 * // items: 基础应用，superItems: 增值服务
 * items/superItems: [
 *     {
 *         id: 菜单项id
 *         name: 菜单名
 *         icon: 菜单的图标（使用bootstrap的glyphicon）
 *         isHtml: bool 是否使用html添加菜单名，默认使用纯文本
 *         // 子菜单
 *         subItems: [
 *             {
 *                 id: 子菜单id
 *                 name: 子菜单名
 *                 link: 子菜单链接
 *                 isHtml: bool 默认为 false, 是否使用html添加菜单名，默认使用纯文本
 *                 control: bool 默认为 true, 是否被控制显示不显示，如果为false，表示不被控制，一直显示
 *                 controlMark: string, 被控制的 cookie 值
 *                 controlType: 1 ,被控制的类型，默认为 1
 *                                 1：相应 controlMark 值为 1 则显示，否则不显示
 *                                 2：只要有一个其他同级菜单显示，自己就隐藏，否则自己就显示（一半用于某个大模块的介绍页，如果供佛墙）
 *             }
 *         ]
 *     }
 * ]
 */
