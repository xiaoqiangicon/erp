
import React, { Component } from 'react';
import { Button, Input, Pagination, Table } from 'antd';

import LoadingNormal from 'components/LoadingNormal';
import NoData from 'components/NoData';

import styles from './index.less';

const $ = require('jquery');

const getList = require('../../js/util/get_list');
const data = require('../../js/data');

let audio = document.getElementById('audio');

export default class Main extends Component {
    constructor() {
        super();

        let self = this;
        this.rowSelection = {
            type: 'radio',
            onSelect: self.onSelectItem.bind(self)
        };

        this.columns = [{
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
                return <button className={`clean ${styles.play}`} onClick={self.onClickPlay.bind(self)} data-item-play={index}/>
            }
        }];
    }

    state = {
        noSearch: !0, // 没有可查询的，输入框为空
        requesting: !1, // 是否正在请求数据
        noData: !1, // 是否请求结果没有数据
        error: !1, // 是否请求过程中遇到错误
        currentPage: 1, // 当前页码
        totalCount: 0, // 项目总数
        items: [] // 项目集合
    };

    data = {
        list: [] // 每次搜索的所有列表数据，最大70条
    };

    search(e) {
        let self = this;
        let { requesting } = this.state;

        if (requesting) return;

        let value = $('#search-input').val().trim();

        if (!value) {
            this.setState({noSearch : !0});
            return;
        }

        data.selectedItem = void 0;
        audio.pause();

        this.setState({
            noSearch: !1,
            requesting: !0,
            noData: !1,
            error: !1,
            currentPage: 1,
            totalCount: 0,
            items: []
        }, () => {
            getList(value, res => {
                if (!res || !res.list || !res.list.length) {
                    self.setState({
                        requesting: !1,
                        noData: !0
                    });
                }
                else {
                    self.data.list = res.list;
                    self.setState({
                        requesting: !1,
                        totalCount: res.list.length,
                        items: self.getItems(1)
                    });
                }
            }, () => {
                self.setState({
                    requesting: !1,
                    error: !0
                });
            });
        });
    };

    getItems(page) {
        let { list } = this.data;

        let items = [];
        let start = (page - 1) * data.pageSize;
        let end = page * data.pageSize;

        for(; start < end; start++) list[start] && items.push(list[start]);

        return items;
    }

    onChangePage(page, pageSize) {
        audio.pause();
        this.setState({
            currentPage: page,
            items: this.getItems(page)
        }, () => {
            $('#content-container').scrollTop(0);
        });
    }

    onSelectItem = (record, selected, selectedRows, nativeEvent) => {
        // console.log(record);
        data.selectedItem = record;
    };

    onClickPlay(e) {
        let $this = $(e.target);
        let index = parseInt($this.attr('data-item-play'));
        let item = this.state.items[index];

        // 已经处于播放中
        if ($this.hasClass(styles.trying)) {
            $this.removeClass(styles.trying);
            audio.pause();
        }
        else {
            $('[data-item-play]').removeClass(styles.trying);
            audio.setAttribute('src', item.m4a);
            $this.addClass(styles.trying);
            audio.play();
        }
    }

    getFootJsx() {
        let { noSearch, requesting, noData, error, currentPage, totalCount } = this.state;

        if (noSearch || requesting || noData || error) return '';

        return (
            <div className={styles.foot}>
                <Pagination current={currentPage} total={totalCount} onChange={this.onChangePage.bind(this)}/>
            </div>
        );
    }

    getContentJsx() {
        let { noSearch, error, requesting, noData } = this.state;

        if (noSearch) return <NoData text={'输入歌手/歌曲/专辑，搜索音乐！'}/>;
        if (error)  return <NoData text={'获取数据失败，请稍后再试'}/>;
        if (requesting) return <LoadingNormal/>;
        if (noData)  return <NoData/>;

        return (
            <div className={styles.content} id={'content-container'}>
                <Table rowSelection={this.rowSelection} columns={this.columns} dataSource={this.state.items} pagination={false}/>
            </div>
        );
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.search}>
                    <div className={styles.inner}>
                        <div className={styles.left}>
                            <Input placeholder="输入关键字" onPressEnter={this.search.bind(this)} id={'search-input'}/>
                        </div>
                        <div className={styles.right}>
                            <Button onClick={this.search.bind(this)}>搜索歌曲</Button>
                        </div>
                    </div>
                </div>
                { this.getFootJsx() }
                { this.getContentJsx() }
            </div>
        );
    }
};
