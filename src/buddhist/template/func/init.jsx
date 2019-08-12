/**
 *Create by kang on 2018/10/25.
 */
import { LocaleProvider } from 'antd';
/* eslint-disable */
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import React from 'react';
import ReactDom from 'react-dom';
import Index from '../components/Index';

const root = document.getElementById('root');

/* eslint-disable */
ReactDom.render(
  <LocaleProvider locale={zh_CN}>
    <Index />
  </LocaleProvider>,
  root
);
