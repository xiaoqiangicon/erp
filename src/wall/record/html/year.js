/**
 * @author senntyou <jiangjinbelief@163.com>
 */

define(['../tpl', 'common/variables'], function(tpl, commonVars) {
  var data = [];

  data.push(tpl.option.render({ id: 0, name: '年' }));

  for (var i = 1900; i < commonVars.today.year + 1; i++)
    data.push(tpl.option.render({ id: i, name: i }));

  return data.join('');
});
