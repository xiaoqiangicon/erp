export default items => {
  items.forEach(item => {
    console.log(item, 'item');
    item &&
      item.subItems &&
      item.subItems.forEach(subItem => {
        typeof subItem.control === 'undefined' &&
          (subItem.control = location.hostname.split('.')[0] !== 'localhost');
        typeof subItem.controlType === 'undefined' && (subItem.controlType = 1);
      });
  });
};
