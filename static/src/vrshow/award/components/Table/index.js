/**
 *Create by kang on 2018/10/25.
 */
import React, { Component } from 'react';
import styles from './index.less';

import data from '../../data';
import events from '../../events';

export default class extends Component {
  constructor(props) {
    super(props);

    this.data = {
      thead: ['礼佛天数', '获奖礼品', '联系人', '联系电话', '处理状态', '处理'],

      typeMap: data.typeMap,
    };

    this.onClickHandle = this.onClickHandle.bind(this);
    this.onClickDetail = this.onClickDetail.bind(this);
  }

  onClickHandle = (id, e) => {
    e.preventDefault();
    events.emit('show-drawer-detail', { id, type: 'handle' });
  };

  onClickDetail = (id, e) => {
    e.preventDefault();
    events.emit('show-drawer-detail', { id, type: 'detail' });
  };

  theadJsx = () => {
    const { thead } = this.data;
    return (
      <thead>
        <tr>
          {thead.map(item => (
            <th key={item}>{item}</th>
          ))}
        </tr>
      </thead>
    );
  };

  loadingTbody = () => {
    const { thead } = this.data;

    return (
      <tbody>
        <tr>
          <td colSpan={thead.length}>
            <div className={styles.loading}>数据加载中 ...</div>
          </td>
        </tr>
      </tbody>
    );
  };

  emptyJsx = () => {
    return (
      <tr>
        <td colSpan="6">暂无数据</td>
      </tr>
    );
  };

  tbodyJsx = () => {
    const { typeMap } = this.data;
    const { tableData } = this.props;
    return (
      <tbody>
        {tableData.length
          ? tableData.map(item => (
              <tr key={item.id}>
                <td>{typeMap[item.type]}</td>
                <td>{item.content}</td>
                <td>{item.name}</td>
                <td>{item.mobile}</td>
                <td>{item.status ? '未处理' : '已处理'}</td>
                <td>
                  {item.status ? (
                    <a href="" onClick={this.onClickHandle.bind(this, item.id)}>
                      处理
                    </a>
                  ) : (
                    <a href="" onClick={this.onClickDetail.bind(this, item.id)}>
                      详情
                    </a>
                  )}
                </td>
              </tr>
            ))
          : this.emptyJsx()}
      </tbody>
    );
  };

  contentJsx = () => {
    const { loading } = this.props;

    return (
      <table className={`${styles.table}`}>
        {this.theadJsx()}
        {loading ? this.loadingTbody() : this.tbodyJsx()}
      </table>
    );
  };

  render() {
    return this.contentJsx();
  }
}
