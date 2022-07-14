/**
 *Create by kang on 2018/11/13.
 */
import React, { Component } from 'react';
import styles from './index.less';

export default class extends Component {
  constructor(props) {
    super(props);

    this.onClickCreate = this.onClickCreate.bind(this);
    this.onClickTab = this.onClickTab.bind(this);
  }

  onClickCreate = () => {
    location.href = '/zzhadmin/createCeremonyIndex/';
  };

  onClickTab(key) {
    const { changeTemplateType } = this.props;
    changeTemplateType(key);
  }

  tabJsx() {
    const { templateType } = this.props;
    return (
      <div className={styles.tabContainer}>
        <div
          onClick={() => {
            this.onClickTab('system');
          }}
          className={`${styles.tab} ${
            templateType === 'system' ? styles.active : ''
          }`}
        >
          系统模板
        </div>
        <div
          onClick={() => {
            this.onClickTab('my');
          }}
          className={`${styles.tab} ${
            templateType === 'my' ? styles.active : ''
          }`}
        >
          我的模板
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.title}>创建新的项目</div>
        <div className={styles.btn} onClick={this.onClickCreate}>
          创建空白项目
        </div>
        <div className={styles.content}>
          可选择适合您的系统模板修改内容发布，也可以创建一个空白的项目填写内容后发布。
        </div>
        {this.tabJsx()}
      </div>
    );
  }
}
