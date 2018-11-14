/**
 *Create by kang on 2018/11/13.
 */
import React, { Component } from 'react';
import { Spin } from 'antd';

import styles from './index.less';

export default class extends Component {
  constructor(props) {
    super(props);

    this.onClickItem = this.onClickItem.bind(this);
  }

  onClickItem(systemTemplateType) {
    const { changeSystemTemplateType } = this.props;
    changeSystemTemplateType(systemTemplateType);
  }

  contentJsx() {
    const { loading, data, systemTemplateType } = this.props;

    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <Spin />
        </div>
      );
    } else {
      return (
        <div className={styles.container}>
          <div className={styles.left}>分类：</div>
          <div>
            <div
              className={`${styles.item} ${systemTemplateType === -1 ? styles.active : ''}`}
              onClick={() => {
                this.onClickItem(-1);
              }}
            >
              全部
            </div>
            {data.map(item => (
              <div
                key={item.id}
                className={item.id === systemTemplateType ? `${styles.item} ${styles.active}` : `${styles.item}`}
                onClick={() => {
                  this.onClickItem(item.id);
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      );
    }
  }

  render() {
    return this.contentJsx();
  }
}
