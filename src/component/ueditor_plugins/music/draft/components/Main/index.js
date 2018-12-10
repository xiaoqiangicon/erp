
import React, { Component } from 'react';
import { Button, Input, Pagination, Table } from 'antd';

import styles from './index.less';

const data = [{
    key: '1',
    song: 'lalalal lalalal lalalal lalalal',
    singer: 'singer singer singer singer',
    album: 'New York No. 1 Lake Park'
}, {
    key: '2',
    song: 'lelele lelele lelele lelele',
    singer: 'singer singer singer singer',
    album: 'New York No. 1 Lake Park'
}, {
    key: '3',
    song: 'lololo lololo lololo lololo',
    singer: 'singer singer singer singer',
    album: 'New York No. 1 Lake Park'
}, {
    key: '4',
    song: 'lilili lilili lilili lilili',
    singer: 'singer singer singer singer',
    album: 'New York No. 1 Lake Park'
}, {
    key: '5',
    song: 'lululu lululu lululu lululu lululu',
    singer: 'singer singer singer singer',
    album: 'New York No. 1 Lake Park'
}, {
    key: '6',
    song: 'John Brown John Brown John Brown',
    singer: 'singer singer singer singer',
    album: 'New York No. 1 Lake Park'
}];

const columns = [{
    title: '歌曲',
    dataIndex: 'song'
}, {
    title: '歌手',
    dataIndex: 'singer',
}, {
    title: '专辑',
    dataIndex: 'album',
}, {
    title: '试听',
    dataIndex: 'try',
    render(text, record, index) {
        return <button className={`clean ${styles.play} ${index < 2 ? styles.trying : ''}`}/>
    }
}];
const rowSelection = {
    type: 'radio',
    onSelect: (record, selected, selectedRows, nativeEvent) => {
        console.log(record, selected);
    }
};

export default class Main extends Component {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.search}>
                    <div className={styles.inner}>
                        <div className={styles.left}>
                            <Input placeholder="输入关键字" />
                        </div>
                        <div className={styles.right}>
                            <Button>搜索歌曲</Button>
                        </div>
                    </div>
                </div>
                <div className={styles.foot}>
                    <Pagination defaultCurrent={1} total={70}/>
                </div>
                <div className={styles.content}>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={false}/>
                </div>
            </div>
        );
    }
};
