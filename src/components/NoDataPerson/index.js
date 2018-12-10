
import React, { Component } from 'react';

import styles from './index.less';

export default class NoDataPerson extends Component {
    render() {
        return (
            <div className={styles.container}>
                <img src="https://pic.zizaihome.com/fa613df8-2919-11e8-983b-00163e0c001e.png"/>
                <div className={styles.text}>啊哦，暂时没有数据哦</div>
            </div>
        );
    }
}
