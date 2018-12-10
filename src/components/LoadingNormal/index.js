
import React, { Component } from 'react';

import 'spinkit/css/spinkit.css';

import '../less/reset/spinkit.less';

export default class LoadingNormal extends Component {
    render() {
        return (
            <div className={'loading-normal'}>
                <div className={'sk-three-bounce'}>
                    <div className={'sk-child sk-bounce1'}/>
                    <div className={'sk-child sk-bounce2'}/>
                    <div className={'sk-child sk-bounce3'}/>
                </div>
            </div>
        );
    }
}
