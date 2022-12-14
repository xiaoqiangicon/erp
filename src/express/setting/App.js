import { Message, MessageBox } from 'element-ui';
import { reportError } from '@senntyou/web-monitor-sdk';
import request from '../../utils/request';
import regionData from '../../../../pro-com/src/regions/three-levels.json';
import { PARTNER_TYPE_SF, PARTNER_TYPE_YT } from './data';

export default {
  name: 'App',
  data() {
    return {
      initData: {},
      // 初始化加载
      initRequesting: true,
      // 是否启用打印(1是 0否)
      enabled: false,
      // 圆通快递客户编码
      partnerId: '',
      // 圆通快递客户密钥
      partnerKey: '',
      // 发件人姓名
      senderName: '',
      // 发件人电话
      senderPhone: '',
      // 发件人省
      senderProvince: null,
      // 发件人市
      senderCity: null,
      // 发件人区
      senderDistrict: null,
      // 发件人地址
      senderAddress: '',
      // 模板类型(1 标准模板、2 有二维码的模板)
      template_type: 1,
      // 顺丰速运客户编码
      sfPartnerId: '',

      provinceList: regionData,
      cityList: [],
      districtList: [],

      savingPartner: false,
      savingSender: false,
      savePartnerError: '',
      saveSenderError: '',

      // 是否显示编辑合作网点
      showEditPartner: true,
      // 正在切换启用
      switchingEnabled: false,
      switchingTemplateType: false,

      // 正在加载余额
      balanceRequesting: false,
      partnerBalance: null,
      balanceQueryTime: null,

      // 合作方类型：yt 圆通、sf 顺丰
      partnerType: PARTNER_TYPE_YT,
    };
  },
  created() {
    this.initReq();
  },
  methods: {
    initReq() {
      this.initRequesting = true;
      request('/express/getPrintSetting')
        .then(res => {
          this.initData = res.data || {};
          this.init();
        })
        .finally(() => {
          this.initRequesting = false;
        });
    },
    init() {
      const d = this.initData;
      if (d.partner_id || d.sf_partner_id) {
        this.partnerId = d.partner_id || '';
        this.partnerKey = d.partner_key || '';
        this.sfPartnerId = d.sf_partner_id || '';
        this.showEditPartner = false;

        // 如果有顺丰但没有圆通，切换到顺丰
        if (!d.partner_id) this.partnerType = PARTNER_TYPE_SF;
      }
      if (d.sender_name) {
        this.senderName = d.sender_name;
        this.senderPhone = d.sender_phone;
        this.senderAddress = d.sender_address;
        this.setRegion(d.sender_province, d.sender_city, d.sender_district);
      }
      this.enabled = d.enable_print || 0;
      this.template_type = d.template_type || 1;

      if (this.partnerId) {
        this.balanceReq();
      }
    },
    // 顺丰不支持获取余额
    balanceReq() {
      this.balanceRequesting = true;
      request('/express/getPrintPartnerBalance')
        .then(res => {
          if (res.data) {
            this.partnerBalance = res.data.partner_balance;
            this.balanceQueryTime = res.data.query_time;
          }
        })
        .finally(() => {
          this.balanceRequesting = false;
        });
    },
    removePartner() {
      MessageBox.confirm('确定删除网点签约信息吗').then(() => {
        const data = new URLSearchParams();
        data.append('partner_type', this.partnerType);

        request({
          method: 'post',
          url: '/express/removePrintSettingPartner',
          data,
        }).then(res => {
          if (res.result >= 0) {
            Message.success('删除网点签约信息成功');
            // 顺丰
            if (this.partnerType === PARTNER_TYPE_SF) {
              this.initData.sf_partner_id = '';
              this.slPartnerId = '';
            }
            // 圆通
            else {
              this.initData.partner_id = '';
              this.initData.partner_key = '';
              this.partnerId = '';
              this.partnerKey = '';
            }
            this.showEditPartner = true;
          }
        });
      });
    },
    onChangeProvince() {
      this.cityList = [];
      this.ditrictList = [];
      this.senderCity = null;
      this.senderDistrict = null;

      const provinceItem = regionData.find(i => i.name === this.senderProvince);
      this.cityList = provinceItem ? provinceItem.children : [];
    },
    onChangeCity() {
      this.ditrictList = [];
      this.senderDistrict = null;

      const cityItem = this.cityList.find(i => i.name === this.senderCity);
      this.districtList = cityItem ? cityItem.children : [];
    },
    setRegion(province, city, district) {
      this.senderProvince = province;
      this.onChangeProvince();
      this.senderCity = city;
      this.onChangeCity();
      this.senderDistrict = district;
    },
    onSavePartner() {
      if (this.savingPartner) return;

      let error;
      if (this.partnerType === PARTNER_TYPE_YT && !this.partnerId)
        error = '客户编码不能为空';
      else if (this.partnerType === PARTNER_TYPE_YT && !this.partnerKey)
        error = '客户密钥不能为空';
      else if (this.partnerType === PARTNER_TYPE_SF && !this.sfPartnerId)
        error = '客户编码不能为空';

      if (error) {
        this.savePartnerError = error;
        return;
      }

      const data = new URLSearchParams();
      data.append('partner_type', this.partnerType);

      if (this.partnerType === PARTNER_TYPE_SF) {
        data.append('sf_partner_id', this.sfPartnerId);
      } else {
        data.append('partner_id', this.partnerId);
        data.append('partner_key', this.partnerKey);
      }

      this.savingPartner = true;
      request({
        url: '/express/updatePrintSettingPartner',
        method: 'post',
        data,
      })
        .then(res => {
          if (res.result < 0) {
            this.savePartnerError = res.msg;
            return;
          }

          Message.success(
            (this.initData.partner_id ? '更新' : '绑定') + '网点签约信息成功'
          );

          if (this.partnerType === PARTNER_TYPE_SF) {
            this.initData.sf_partner_id = this.sfPartnerId;
          } else {
            this.initData.partner_id = this.partnerId;
            this.initData.partner_key = this.partnerKey;
            if (res.data) {
              this.partnerBalance = res.data.partner_balance;
              this.balanceQueryTime = res.data.query_time;
            }
          }

          this.showEditPartner = false;
        })
        .catch(err => {
          console.error(err);
          reportError(err);

          MessageBox.alert(
            '您的客户编码有误，请联系自在家服务人员，检查客户编码'
          );
        })
        .finally(() => {
          this.savingPartner = false;
        });
    },
    onSaveSender() {
      if (this.savingSender) return;

      let error;
      if (!this.senderName) error = '发货人姓名不能为空';
      else if (!this.senderPhone) error = '发货人电话号码不能为空';
      else if (!this.senderProvince) error = '请选择发货人省份';
      else if (!this.senderCity) error = '请选择发货人城市';
      else if (
        !this.senderDistrict &&
        this.districtList &&
        this.districtList.length
      )
        error = '请选择发货人区域';
      else if (!this.senderAddress) error = '发货人详细地址不能为空';

      if (error) {
        this.saveSenderError = error;
        return;
      }

      const data = new URLSearchParams();
      data.append('sender_name', this.senderName);
      data.append('sender_phone', this.senderPhone);
      data.append('sender_province', this.senderProvince);
      data.append('sender_city', this.senderCity);
      data.append('sender_district', this.senderDistrict || '');
      data.append('sender_address', this.senderAddress);

      this.savingSender = true;
      request({
        url: '/express/updatePrintSettingSender',
        method: 'post',
        data,
      })
        .then(res => {
          if (res.result < 0) {
            this.saveSenderError = res.msg;
            return;
          }

          Message.success(
            (this.initData.sender_name ? '更新' : '添加') + '发货人信息成功'
          );

          this.initData.partner_id = this.partnerId;
          this.initData.sender_name = this.senderName;
          this.initData.sender_phone = this.senderPhone;
          this.initData.sender_province = this.senderProvince;
          this.initData.sender_city = this.senderCity;
          this.initData.sender_district = this.senderDistrict || null;
          this.initData.sender_address = this.senderAddress;
        })
        .finally(() => {
          this.savingSender = false;
        });
    },
    onChangeEnabled(val) {
      if (this.switchingEnabled) return;

      if (
        (this.partnerType === PARTNER_TYPE_YT && !this.initData.partner_id) ||
        (this.partnerType === PARTNER_TYPE_SF && !this.initData.sf_partner_id)
      ) {
        // 恢复到原来的样子
        this.enabled = val ? 0 : 1;
        MessageBox.alert('请先添加快递网点信息');
        return;
      }
      if (!this.initData.sender_name) {
        // 恢复到原来的样子
        this.enabled = val ? 0 : 1;
        MessageBox.alert('请先添加发货人信息');
        return;
      }

      this.switchingEnabled = true;
      const data = new URLSearchParams();
      data.append('enable', val);

      request({
        url: '/express/updatePrintSettingEnable',
        method: 'post',
        data,
      })
        .then(res => {
          if (res.result < 0) {
            MessageBox.alert(res.msg);
            // 恢复到原来的样子
            this.enabled = val ? 0 : 1;
            return;
          }

          Message.success((val ? '开启' : '关闭') + '成功');
          this.initData.enable_print = val;
        })
        .finally(() => {
          this.switchingEnabled = false;
        });
    },
    onChangeTemplateType(val) {
      if (this.switchingTemplateType) return;

      if (
        (this.partnerType === PARTNER_TYPE_YT && !this.initData.partner_id) ||
        (this.partnerType === PARTNER_TYPE_SF && !this.initData.sf_partner_id)
      ) {
        // 恢复到原来的样子
        this.template_type = val === 2 ? 1 : 2;
        MessageBox.alert('请先添加快递网点信息');
        return;
      }
      if (!this.initData.sender_name) {
        // 恢复到原来的样子
        this.template_type = val === 2 ? 1 : 2;
        MessageBox.alert('请先添加发货人信息');
        return;
      }

      this.switchingTemplateType = true;
      const data = new URLSearchParams();
      data.append('template_type', val);

      request({
        url: '/express/updatePrintSettingTemplateType',
        method: 'post',
        data,
      })
        .then(res => {
          if (res.result < 0) {
            MessageBox.alert(res.msg);
            // 恢复到原来的样子
            this.template_type = val === 2 ? 1 : 2;
            return;
          }

          Message.success('更改面单成功');
          this.initData.template_type = val;
        })
        .finally(() => {
          this.switchingTemplateType = false;
        });
    },
    onChangePartnerType() {
      const hasValue =
        (this.partnerType === PARTNER_TYPE_YT && this.partnerId) ||
        (this.partnerType === PARTNER_TYPE_SF && this.sfPartnerId);
      if (!hasValue && !this.showEditPartner) this.showEditPartner = true;
    },
  },
};
