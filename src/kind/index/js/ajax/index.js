/**
 * @author senntyou <jiangjinbelief@163.com>
 */

const seeAjax = require('see-ajax').default;

seeAjax.setEnv(__SEE_ENV__);

require('./common');
require('./list');
require('./delete');
