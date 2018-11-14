/**
 *Create by kang on 2018/11/13.
 */
import React, { Component } from 'react';
import { Spin } from 'antd';
import styles from './index.less';

export default class extends Component {
  onClickItem = templateId => {
    location.href = `/zzhadmin/createCeremonyIndex/?templateId=${templateId}&edit=2`;
  };

  contentJsx() {
    const { loading, data, systemTemplateTypeData } = this.props;
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <Spin />
        </div>
      );
    } else {
      return (
        <div className={styles.container}>
          {data.map(item => (
            <div
              key={item.id}
              className={styles.item}
              onClick={() => {
                this.onClickItem(item.id);
              }}
            >
              <img className={styles.cover} src={item.coverPic} alt="" />
              <div className={styles.content}>
                <div className={styles.name}>{item.name}</div>
                <div className={styles.btn}>{systemTemplateTypeData.find(item2 => item2.id === item.id).name}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  render() {
    return this.contentJsx();
  }
}
