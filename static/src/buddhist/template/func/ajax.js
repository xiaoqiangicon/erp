/**
 *Create by kang on 2018/10/25.
 */

import $ from 'jquery';
import seeAjax from 'see-ajax';

import '../../common/ajax/common';
import '../../common/ajax/get_my_buddhist_template_list';
import '../../common/ajax/get_system_buddhist_template_list';
import '../../common/ajax/get_system_buddhist_template_type_list';
import '../../common/ajax/delete_my_buddhist_template';

$.ajaxSetup({ cache: false });

/* eslint-disable no-undef */
seeAjax.setEnv(__SEE_ENV__);
