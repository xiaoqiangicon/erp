
/**
 * 填充项目的字段
 * @param items
 */
module.exports = (items) => {

    items.forEach((item) => {
        item.subItems.forEach((subItem) => {
            // control 字段
            typeof subItem.control === 'undefined' && (subItem.control = location.hostname.split('.')[0] !== 'localhost');
            // controlType 字段
            typeof subItem.controlType === 'undefined' && (subItem.controlType = 1);
        });
    });
};
