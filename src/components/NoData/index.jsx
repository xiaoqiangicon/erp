import React, { Component } from 'react';

import styles from './index.less';

export default class NoData extends Component {
  render() {
    return (
      <div className={styles.container}>
        {this.props.text || '啊哦，暂时没有数据哦'}
      </div>
    );
  }
}
