/**
 *Create by kang on 2018/10/25.
 */
import React, { Component } from 'react';
import { Select } from 'antd';
import styles from './index.less';

import data from '../../data';

const { Option } = Select;

export default class extends Component {
  constructor(props) {
    super(props);

    this.data = {
      statusMap: data.statusMap,
      typeMap: data.typeMap,
    };

    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeDay = this.onChangeDay.bind(this);
  }

  onChangeStatus(status) {
    const { onChangeStatus } = this.props;
    onChangeStatus(status);
  }

  onChangeDay(type) {
    const { onChangeDay } = this.props;
    onChangeDay(type);
  }

  statusJsx() {
    const { statusMap } = this.data;
    const { status } = this.props;
    const keys = Object.keys(statusMap);
    const value = statusMap[status];

    return (
      <Select value={value} onChange={this.onChangeStatus} className="mg-l-10" style={{ width: '100px' }}>
        {keys.map(key => (
          <Option key={key}>{statusMap[key]}</Option>
        ))}
      </Select>
    );
  }

  typesJsx() {
    const { typeMap } = this.data;
    const { type } = this.props;
    const keys = Object.keys(typeMap);
    const value = typeMap[type];

    return (
      <Select value={value} onChange={this.onChangeDay} className="mg-l-10" style={{ width: '100px' }}>
        {keys.map(key => (
          <Option key={key}>{typeMap[key]}</Option>
        ))}
      </Select>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <span>
          <span>状态:</span>
          <span>{this.statusJsx()}</span>
        </span>
        <span className="mg-l-20">
          <span>礼佛天数:</span>
          <span>{this.typesJsx()}</span>
        </span>
      </div>
    );
  }
}
