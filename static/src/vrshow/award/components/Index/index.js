/**
 *Create by kang on 2018/10/25.
 */
import React, { Component } from 'react';
import seeAjax from 'see-ajax';
import styles from './index.less';

import Top from '../Top';
import Table from '../Table';
import DrawerDetail from '../DrawerDetail';

import events from '../../events';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: '-1',
      type: '-1',

      loading: true,

      tableData: [],

      pagination: {
        current: 1,
        pageSize: 10,
      },
    };

    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeDay = this.onChangeDay.bind(this);
    this.onTableChange = this.onTableChange.bind(this);
  }

  componentDidMount() {
    this.refresh();

    events.on('refresh', () => {
      this.refresh();
    });
  }

  onChangeStatus(status) {
    this.setState({ status }, () => {
      events.emit('refresh');
    });
  }

  onChangeDay(type) {
    this.setState({ type }, () => {
      events.emit('refresh');
    });
  }

  onTableChange(pagination) {
    const { pagination: oldPagination } = this.state;
    const pager = { ...oldPagination };
    pager.current = pagination.current;
    this.setState({ pagination: pager }, () => {
      this.fetchTableData();
    });
  }

  fetchTableData() {
    this.setState({ loading: true }, () => {
      const { type, status, pagination: oldPagination } = this.state;
      const params = {
        type: parseInt(type, 10),
        status: parseInt(status, 10),
        pageSize: oldPagination.pageSize,
        pageNum: oldPagination.current - 1,
      };

      seeAjax('getAwardList', params, res => {
        const { total } = res;
        const pagination = { ...oldPagination };
        pagination.total = total;
        this.setState({ loading: false, tableData: res.data, pagination });
        // 改变导航栏的未处理订单数 并存至localStorage
        document.querySelector('[data-vrshow-order-count]').text = res.unDealNum;
        localStorage.vrshow_orderNumber = res.unDealNum;
      });
    });
  }

  refresh() {
    this.setState({ pagination: { current: 1, pageSize: 10 } }, () => {
      this.fetchTableData();
    });
  }

  render() {
    const { status, type, loading, tableData, pagination } = this.state;

    return (
      <div className={styles.container}>
        <Top status={status} type={type} onChangeStatus={this.onChangeStatus} onChangeDay={this.onChangeDay} />
        <Table loading={loading} pagination={pagination} tableData={tableData} onTableChange={this.onTableChange} />
        <DrawerDetail />
      </div>
    );
  }
}
