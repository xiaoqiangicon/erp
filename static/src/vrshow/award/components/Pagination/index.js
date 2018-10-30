/**
 *Create by kang on 2018/10/25.
 */
import React, { Component } from 'react';
import styles from './index.less';

export default class extends Component {
  constructor(props) {
    super(props);

    this.onClickPrevPage = this.onClickPrevPage.bind(this);
    this.onClickNextPage = this.onClickNextPage.bind(this);
  }

  onClickNextPage() {
    const { onClickNextPage } = this.props;
    onClickNextPage();
  }

  onClickPrevPage() {
    const { onClickPrevPage } = this.props;
    onClickPrevPage();
  }

  prevBtnJsx() {
    const { hasPrevPage } = this.props;

    if (hasPrevPage) {
      return (
        <button type="button" className="btn btn-default" onClick={this.onClickPrevPage}>
          上一页
        </button>
      );
    }
  }

  nextBtnJsx() {
    const { hasNextPage, hasPrevPage } = this.props;

    if (hasNextPage) {
      if (hasPrevPage) {
        return (
          <button type="button" className="btn btn-default mg-l-20" onClick={this.onClickNextPage}>
            下一页
          </button>
        );
      } else {
        return (
          <button type="button" className="btn btn-default" onClick={this.onClickNextPage}>
            下一页
          </button>
        );
      }
    }
  }

  render() {
    return (
      <div className={styles.container}>
        {this.prevBtnJsx()}
        {this.nextBtnJsx()}
      </div>
    );
  }
}
