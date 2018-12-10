/**
 *Create by kang on 2018/10/25.
 */
import React, { Component } from 'react';
import { Table } from 'antd';
import data from '../../data';
import events from '../../events';

export default class extends Component {
  constructor(props) {
    super(props);

    this.data = {
      statusMap: data.statusMap,
      typeMap: data.typeMap,
    };

    this.onClickHandle = this.onClickHandle.bind(this);
    this.onClickDetail = this.onClickDetail.bind(this);
    this.onTableChange = this.onTableChange.bind(this);
  }

  onClickHandle = (record, e) => {
    e.preventDefault();
    const { id } = record;
    events.emit('show-drawer-detail', { id, type: 'handle' });
  };

  onClickDetail = (record, e) => {
    e.preventDefault();
    const { id } = record;
    events.emit('show-drawer-detail', { id, type: 'detail' });
  };

  onTableChange(pagination) {
    const { onTableChange } = this.props;
    onTableChange(pagination);
  }

  makeColumns() {
    const { typeMap, statusMap } = this.data;
    const self = this;
    return [
      {
        title: '礼佛天数',
        dataIndex: 'type',
        key: 'type',
        render(type) {
          return <span>{typeMap[type]}</span>;
        },
      },
      {
        title: '获奖礼品',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '联系人',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '联系电话',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '领取时间',
        dataIndex: 'receiveTime',
        key: 'receiveTime',
      },
      {
        title: '处理状态',
        dataIndex: 'status',
        key: 'status',
        render(status) {
          return <span>{statusMap[status]}</span>;
        },
      },
      {
        title: '处理',
        render(record) {
          return (
            <div>
              {record.status ? (
                <a className="mg-r-20" onClick={self.onClickHandle.bind(this, record)}>
                  处理
                </a>
              ) : (
                <a className="mg-r-20" onClick={self.onClickDetail.bind(this, record)}>
                  详情
                </a>
              )}
            </div>
          );
        },
      },
    ];
  }

  contentJsx() {
    const { loading, tableData, pagination } = this.props;
    return (
      <Table
        loading={loading}
        dataSource={tableData}
        columns={this.makeColumns()}
        pagination={pagination}
        onChange={this.onTableChange}
      />
    );
  }

  render() {
    return this.contentJsx();
  }
}
