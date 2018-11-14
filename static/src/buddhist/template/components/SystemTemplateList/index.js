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

  loadingJsx = () => {
    return (
      <div className={styles.loadingContainer}>
        <Spin />
      </div>
    );
  };

  empTyJsx = () => {
    return (
      <div className={styles.emptyContainer}>
        <img src="https://pic.zizaihome.com/2d1f2e70-e7c5-11e8-8fcf-00163e0c001e.png" alt="" />
        <div className={styles.text}>此分类下没有模板哦</div>
      </div>
    );
  };

  itemJsx = item => {
    const { systemTemplateTypeData } = this.props;
    const curTemplateTypeObj = systemTemplateTypeData.find(item2 => item2.id === item.templateTypeId);

    return (
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
          {curTemplateTypeObj ? <div className={styles.btn}>{curTemplateTypeObj.name}</div> : ''}
        </div>
      </div>
    );
  };

  contentJsx() {
    const { data } = this.props;
    return <div className={styles.container}>{data.map(item => this.itemJsx(item))}</div>;
  }

  render() {
    const { loading, data } = this.props;

    if (loading) {
      return this.loadingJsx();
    } else if (data.length === 0) {
      return this.empTyJsx();
    } else {
      return this.contentJsx();
    }
  }
}
