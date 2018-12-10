/**
 *Create by kang on 2018/10/25.
 */

import $ from 'jquery';
import seeAjax from 'see-ajax';

import '../common/ajax/common';
import '../common/ajax/get_award_list';
import '../common/ajax/get_award_detail';
import '../common/ajax/handle_award';

$.ajaxSetup({ cache: false });

/* eslint-disable no-undef */
seeAjax.setEnv(__SEE_ENV__);
