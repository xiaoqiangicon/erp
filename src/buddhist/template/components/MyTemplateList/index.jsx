/**
 *Create by kang on 2018/11/13.
 */
import React, { Component } from 'react';
import { notification, Popconfirm, Spin } from 'antd';
import seeAjax from 'see-ajax';
import styles from './index.less';
import events from '../../func/events';

export default class extends Component {
  onClickDelete = templateId => {
    seeAjax('deleteMyBuddhistTemplate', { templateId }, res => {
      if (!res.success) {
        notification.error({
          message: '提示',
          description: res.message || '未知错误，请稍后重试',
        });
        return;
      }

      events.emit('refreshMyTemplate');
    });
  };

  onClickBtn = (templateId, type) => {
    let url;
    if (type === 1) {
      url = `/zzhadmin/createCeremonyIndex/?templateId=${templateId}&edit=3&ifTemplate=1`;
    } else {
      url = `/zzhadmin/createCeremonyIndex/?templateId=${templateId}&edit=3`;
    }
    location.href = url;
  };

  loadingJsx = () => (
    <div className={styles.loadingContainer}>
      <Spin />
    </div>
  );

  empTyJsx = () => (
    <div className={styles.emptyContainer}>
      <img
        src="https://pic.zizaihome.com/2d1f2e70-e7c5-11e8-8fcf-00163e0c001e.png"
        alt=""
      />
      <div className={styles.text}>
        您还没有添加过模板，将常用的模板添加进来会方便您发布佛事哦
      </div>
    </div>
  );

  contentJsx() {
    const { data } = this.props;
    return (
      <div className={styles.container}>
        {data.map(item => (
          <div key={item.id} className={styles.item}>
            <Popconfirm
              placement="rightTop"
              title="确定要删除吗?"
              onConfirm={() => {
                this.onClickDelete(item.id);
              }}
              okText="确定"
              cancelText="取消"
            >
              <div className={styles.delete} />
            </Popconfirm>
            <div className={styles.body}>{item.name}</div>
            <div className={styles.foot}>
              <span
                onClick={() => {
                  this.onClickBtn(item.id, 1);
                }}
                className={`${styles.btn} pull-left`}
              >
                编辑
              </span>
              <span className={styles.line} />
              <span
                onClick={() => {
                  this.onClickBtn(item.id, 2);
                }}
                className={`${styles.btn} pull-right ${styles.special}`}
              >
                使用
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { loading, data } = this.props;

    if (loading) {
      return this.loadingJsx();
    }
    if (data.length === 0) {
      return this.empTyJsx();
    }
    return this.contentJsx();
  }
}
