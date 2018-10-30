/**
 *Create by kang on 2018/10/25.
 */
import React, { Component } from 'react';
import seeAjax from 'see-ajax';
import styles from './index.less';

import Top from '../Top';
import Table from '../Table';
import Pagination from '../Pagination';
import DrawerDetail from '../DrawerDetail';

import events from '../../events';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: '-1',
      type: '-1',

      loading: true,

      tableData: {
        total: 0,
        pageNum: -1,
        data: [],
      },

      pagination: {
        pageNum: 0,
        pageSize: 10,
        total: 0,
      },

      hasNextPage: false,
      hasPrevPage: false,
    };

    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeDay = this.onChangeDay.bind(this);
    this.onClickPrevPage = this.onClickPrevPage.bind(this);
    this.onClickNextPage = this.onClickNextPage.bind(this);
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

  onClickPrevPage() {
    const { pagination: oldPagination } = this.state;
    const pagination = { ...oldPagination };
    pagination.pageNum -= 1;
    this.setState({ pagination }, () => {
      events.emit('refresh');
    });
  }

  onClickNextPage() {
    const { pagination: oldPagination } = this.state;
    const pagination = { ...oldPagination };
    pagination.pageNum += 1;
    this.setState({ pagination }, () => {
      events.emit('refresh');
    });
  }

  fetchTableData() {
    this.setState({ loading: true });

    const { type, status, pagination: oldPagination } = this.state;
    const { pageSize } = oldPagination;
    const { pageNum } = oldPagination;

    const params = { type: parseInt(type, 10), status: parseInt(status, 10), pageSize, pageNum };

    seeAjax('getAwardList', params, res => {
      const { total } = res;

      const pagination = { ...oldPagination };
      pagination.total = total;

      const hasNextPage = total > (pageNum + 1) * pageSize;
      const hasPrevPage = pageNum > 0;

      this.setState({ loading: false, tableData: res.data, pagination, hasNextPage, hasPrevPage });
    });
  }

  refresh() {
    this.fetchTableData();
  }

  render() {
    const { status, type, loading, tableData, hasPrevPage, hasNextPage } = this.state;

    return (
      <div className={styles.container}>
        <Top status={status} type={type} onChangeStatus={this.onChangeStatus} onChangeDay={this.onChangeDay} />
        <Table loading={loading} tableData={tableData} />
        <Pagination
          onClickPrevPage={this.onClickPrevPage}
          onClickNextPage={this.onClickNextPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
        />
        <DrawerDetail />
      </div>
    );
  }
}
