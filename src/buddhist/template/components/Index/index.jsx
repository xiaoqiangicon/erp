/**
 *Create by kang on 2018/10/25.
 */
import React, { Component } from 'react';
import { Breadcrumb, notification } from 'antd';
import seeAjax from 'see-ajax';
import Top from '../Top';
import Type from '../Type';
import SystemTemplateList from '../SystemTemplateList';
import MyTemplateList from '../MyTemplateList';

import styles from './index.less';

import events from '../../func/events';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingSystemTemplateTypeData: true,
      loadingSystemTemplateData: true,
      loadingMyTemplateData: true,

      templateType: 'system', // system my

      systemTemplateType: -1, // 全部

      systemTemplateTypeData: [],
      systemTemplateData: [],
      myTemplateData: [],
    };

    this.changeTemplateType = this.changeTemplateType.bind(this);
    this.changeSystemTemplateType = this.changeSystemTemplateType.bind(this);
  }

  componentDidMount() {
    this.refresh();

    events.on('refreshMyTemplate', () => {
      this.refreshMyTemplate();
    });
  }

  // 获取系统佛事模板分类列表
  getSystemTemplateTypeData(cb) {
    this.setState({ loadingSystemTemplateTypeData: true }, () => {
      const params = {};

      seeAjax('getSystemBuddhistTemplateTypeList', params, res => {
        if (!res.success) {
          notification.error({
            message: '提示',
            description: res.message || '未知错误，请稍后重试',
          });
          return;
        }

        this.setState(
          {
            loadingSystemTemplateTypeData: false,
            systemTemplateTypeData: res.data,
          },
          () => {
            if (cb) {
              cb();
            }
          }
        );
      });
    });
  }

  // 获取系统佛事模板列表
  getSystemTemplateData(cb) {
    const { systemTemplateType: templateTypeId } = this.state;

    this.setState({ loadingSystemTemplateData: true }, () => {
      const params = { templateTypeId };

      seeAjax('getSystemBuddhistTemplateList', params, res => {
        if (!res.success) {
          notification.error({
            message: '提示',
            description: res.message || '未知错误，请稍后重试',
          });
          return;
        }

        this.setState(
          { loadingSystemTemplateData: false, systemTemplateData: res.data },
          () => {
            if (cb) {
              cb();
            }
          }
        );
      });
    });
  }

  // 获取我的佛事模板列表
  getMyTemplateData(cb) {
    this.setState({ loadingMyTemplateData: true }, () => {
      const params = {};

      seeAjax('getMyBuddhistTemplateList', params, res => {
        if (!res.success) {
          notification.error({
            message: '提示',
            description: res.message || '未知错误，请稍后重试',
          });
          return;
        }

        this.setState(
          { loadingMyTemplateData: false, myTemplateData: res.data },
          () => {
            if (cb) {
              cb();
            }
          }
        );
      });
    });
  }

  changeTemplateType(templateType) {
    this.setState({ templateType });
  }

  changeSystemTemplateType(systemTemplateType) {
    this.setState({ systemTemplateType }, () => {
      this.refreshSystemTemplate();
    });
  }

  refresh() {
    this.getSystemTemplateTypeData(() => {
      this.refreshSystemTemplate();
    });
    this.refreshMyTemplate();
  }

  refreshSystemTemplate() {
    this.getSystemTemplateData();
  }

  refreshMyTemplate() {
    this.getMyTemplateData();
  }

  render() {
    const {
      loadingSystemTemplateTypeData,
      loadingSystemTemplateData,
      loadingMyTemplateData,
      templateType,
      systemTemplateType,
      systemTemplateTypeData,
      systemTemplateData,
      myTemplateData,
    } = this.state;

    return (
      <div className={styles.container}>
        <Breadcrumb>
          <Breadcrumb.Item>微项目</Breadcrumb.Item>
          <Breadcrumb.Item>项目管理</Breadcrumb.Item>
          <Breadcrumb.Item>创建项目</Breadcrumb.Item>
        </Breadcrumb>
        <Top
          templateType={templateType}
          changeTemplateType={this.changeTemplateType}
        />
        {templateType === 'system' ? (
          <Type
            loading={loadingSystemTemplateTypeData}
            changeSystemTemplateType={this.changeSystemTemplateType}
            data={systemTemplateTypeData}
            systemTemplateType={systemTemplateType}
          />
        ) : (
          ''
        )}
        {templateType === 'system' ? (
          <SystemTemplateList
            loading={loadingSystemTemplateData}
            data={systemTemplateData}
            systemTemplateTypeData={systemTemplateTypeData}
          />
        ) : (
          <MyTemplateList
            loading={loadingMyTemplateData}
            data={myTemplateData}
          />
        )}
      </div>
    );
  }
}
