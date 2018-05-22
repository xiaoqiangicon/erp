
import React, { Component } from 'react';

import 'spinkit/css/spinkit.css';

import '../less/reset/spinkit.less';

import styles from './index.less';

export default class LoadingFullScreen extends Component {
    render() {
        const { style } = this.props;
        return (
            <div className={styles.container} style={style || {}}>
                <div className={'sk-three-bounce'}>
                    <div className={'sk-child sk-bounce1'}/>
                    <div className={'sk-child sk-bounce2'}/>
                    <div className={'sk-child sk-bounce3'}/>
                </div>
            </div>
        );
    }
}
