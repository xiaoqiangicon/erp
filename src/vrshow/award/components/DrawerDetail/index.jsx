/**
 *Create by kang on 2018/10/29.
 */

import React, { Component } from 'react';
import { Spin, Drawer, notification } from 'antd';
import ChooseImage from '../../../../component/choose-image';
import seeAjax from 'see-ajax';
import QRCode from '../../../../../pro-com/src/libs-es5/qrcode';
import { serverEnv } from '../../../../util/env';

import $ from 'jquery';
import styles from './index.less';
import events from '../../events';
import data from '../../data';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      id: 0,
      type: 'handle', // modal类型 detail handle
      awardInfo: {
        days: 0,
        award: '',
        name: '',
        tel: '',
        deadman: '',
        alivePeople: '',
        fromType: 0,
        writeName: '',
        address: '',
        receiveTime: '',
      },
      pics: [],
    };

    this.data = {
      maxPicNum: 1,
      typeMap: data.typeMap,
    };

    this.QRCodeRef = React.createRef();

    this.onClose = this.onClose.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onClickUploadImage = this.onClickUploadImage.bind(this);
    this.onClickDeleteImage = this.onClickDeleteImage.bind(this);
    this.handleAward = this.handleAward.bind(this);
  }

  componentDidMount() {
    this.chooseImage = new ChooseImage({
      multiUpload: false,
      multiSelect: false,
      showManage: true,
      onSubmit: items => {
        const { src } = items[0];
        const { pics: oldPics } = this.state;
        const pics = [].concat(oldPics);
        pics.push(src);
        this.setState({ pics });
      },
    });

    events.on('show-drawer-detail', ({ id, type }) => {
      this.setState({ id, type, visible: true, loading: true }, () => {
        this.fetchDetail();
      });
    });
  }

  onDragOver = e => {
    e.preventDefault();
  };

  onClose() {
    this.setState({ visible: false });
  }

  onDrop(e) {
    e.preventDefault();
    const url = '/zzhadmin/uploadPic/';
    const dt = e.dataTransfer;
    const { files /* type */ } = dt; // 判断类型 type 'image/jpeg'
    const formData = new FormData();
    formData.append('file', files[0]);
    // 上传数据
    $.ajax({
      url,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: res => {
        if (res.result >= 0) {
          const { url: img } = res;
          const { pics: oldPics } = this.state;
          const pics = [].concat(oldPics);
          pics.push(img);
          this.setState({ pics });
        } else {
          notification.error({
            title: '提示',
            description: '接口出错',
          });
        }
      },
    });
  }

  onClickUploadImage() {
    this.chooseImage.show();
  }

  onClickDeleteImage(img) {
    const { pics: oldPics } = this.state;
    oldPics.splice(oldPics.indexOf(img), 1);
    this.setState({ pics: [].concat(oldPics) });
  }

  fetchDetail = () => {
    const { id } = this.state;
    const { typeMap } = this.data;

    this.setState({ loading: true });
    seeAjax('getAwardDetail', { id }, res => {
      const { data: awardData } = res;
      const awardInfo = {
        days: typeMap[awardData.type],
        award: awardData.content,
        name: awardData.name,
        tel: awardData.mobile,
        deadman: awardData.deadman,
        alivePeople: awardData.alivePeople,
        fromType: awardData.fromType,
        writeName: awardData.writeName,
        address: awardData.address,
        receiveTime: awardData.receiveTime,
      };
      const pics = awardData.disposedPic
        ? awardData.disposedPic.split(',')
        : [];
      this.setState({ loading: false, awardInfo, pics }, () => {
        this.initQRCode();
      });
    });
  };

  initQRCode = () => {
    const { type } = this.state;
    if (type === 'handle') {
      const { id } = this.state;
      let src = '';
      if (serverEnv === 1) {
        src = `https://wxapp1.zizaihome.com/vr/devoteDealGiftHtml?id=${id}&isTest=1`;
      } else if (serverEnv === 2) {
        src = `https://wxapp2.zizaihome.com/vr/devoteDealGiftHtml?id=${id}&isTest=2`;
      } else if (serverEnv === 3) {
        src = `https://wx.zizaihome.com/vr/devoteDealGiftHtml?id=${id}`;
      } else {
        src = `https://wx.zizaihome.com`;
      }
      const $QRCode = this.QRCodeRef.current;
      this.QRCode = new QRCode($QRCode, src);
    }
  };

  handleAward = () => {
    const { id, pics } = this.state;

    if (pics.length === 0) {
      notification.error({
        title: '提示',
        description: '请上传处理照片',
      });
      return;
    }
    const params = {
      id,
      disposedPic: pics.join(','),
    };

    seeAjax('handleAward', params, () => {
      notification.success({
        message: '提示',
        description: '处理成功',
      });
      this.setState({ type: 'detail' });
      events.emit('refresh');
    });
  };

  awardInfoJsx = () => {
    const { awardInfo } = this.state;
    const {
      fromType,
      writeName,
      address,
      days,
      tel,
      name,
      award,
      alivePeople,
      deadman,
      receiveTime,
    } = awardInfo;
    const mapCommon = [
      { key: days, title: '礼佛天数' },
      { key: award, title: '获得奖品' },
      { key: receiveTime, title: '领取时间' },
      { key: name, title: '联系人' },
      { key: tel, title: '联系电话' },
    ];
    const mapRest = [
      [], // 无用
      [{ key: address, title: '地址' }],
      [{ key: writeName, title: '功德芳名' }],
      [
        { key: alivePeople, title: '阳上人' },
        { key: deadman, title: '往生者' },
      ],
      [], // 其它
    ];
    const map = [...mapCommon, ...mapRest[fromType]];

    return (
      <div>
        <div className={styles.head}>获奖信息</div>
        <div className={styles.body}>
          {map.map(item => (
            <p key={item.title}>
              <span>{item.title}：</span>
              <span>{item.key}</span>
            </p>
          ))}
        </div>
      </div>
    );
  };

  handleJsx = () => {
    const { type } = this.state;
    if (type === 'detail') {
      return this.handleImageJsx();
    }
    if (type === 'handle') {
      return (
        <div>
          {this.handleWay1Jsx()}
          {this.handleWay2Jsx()}
        </div>
      );
    }
  };

  imageCellJsx = ({ img, hasClose }) => (
    <div key={img} className={styles.imgCellContainer}>
      <img src={img} className={styles.img} alt="" />
      {hasClose ? (
        <div
          className={styles.delete}
          onClick={this.onClickDeleteImage.bind(this, img)}
        >
          X
        </div>
      ) : (
        ''
      )}
    </div>
  );

  imagesJsx = () => {
    const { pics } = this.state;

    return (
      <div className={styles.imageContainer}>
        {pics.map(item => this.imageCellJsx({ img: item, hasClose: true }))}
      </div>
    );
  };

  uploadJsx = () => (
    <div
      className={styles.uploadContainer}
      draggable
      onDragOver={this.onDragOver}
      onDrop={this.onDrop}
      onClick={this.onClickUploadImage}
    >
      <img
        className={styles.uploadImage}
        src="https://pic.zizaihome.com/692097f6-db6d-11e8-9f9a-00163e0c001e.png"
        alt=""
      />
      <div className={styles.uploadText}>
        <div className={styles.text1}>点击或将图片拖拽到这里上传</div>
        <div className={styles.text2}>支持格式：.jpg .png .gif</div>
      </div>
    </div>
  );

  handleImageJsx = () => {
    const { pics } = this.state;
    const { length } = pics;
    const { maxPicNum } = this.data;
    return (
      <div>
        <div className={styles.head}>处理照片</div>
        <div className={styles.body}>
          {length > 0 ? this.imagesJsx() : ''}
          {length >= maxPicNum ? '' : this.uploadJsx()}
        </div>
      </div>
    );
  };

  handleWay1Jsx = () => (
    <div>
      <div className={styles.head}>处理方式1：扫描二维码</div>
      <div className={styles.body}>
        <div ref={this.QRCodeRef} className={styles.QRCodeContainer} />
      </div>
    </div>
  );

  handleWay2Jsx = () => {
    const { pics } = this.state;
    const { maxPicNum } = this.data;
    const { length } = pics;

    return (
      <div>
        <div className={styles.head}>处理方式2：上传处理照片</div>
        <div className={styles.body}>
          {length > 0 ? this.imagesJsx() : ''}
          {length >= maxPicNum ? '' : this.uploadJsx()}
        </div>
      </div>
    );
  };

  btnJsx = () => {
    const { type } = this.state;

    return (
      <div className="text-center">
        <div className={styles.btn} onClick={this.handleAward}>
          {type === 'handle' ? '设为已处理' : '重新处理'}
        </div>
      </div>
    );
  };

  contentJsx = () => {
    const { loading, visible } = this.state;

    return (
      <Drawer
        width="457"
        placement="right"
        closable={false}
        onClose={this.onClose}
        visible={visible}
        style={{ padding: 0 }}
      >
        {loading ? (
          <div className={styles.loading}>
            <Spin />
          </div>
        ) : (
          <div>
            {this.awardInfoJsx()}
            {this.handleJsx()}
            {this.btnJsx()}
          </div>
        )}
      </Drawer>
    );
  };

  render() {
    return this.contentJsx();
  }
}
