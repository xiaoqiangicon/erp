import { Message, MessageBox } from 'element-ui';
import draggable from 'vuedraggable';
import toastr from 'toastr';
import ChooseImage from '../../com-deprecated/choose-image';
import * as zzhHandling from '../../../../pro-com/src/handling';
import upload from '../../../../pro-com/src/upload';
import Types from './com/Types.vue';
import GuiGe from './com/GuiGe.vue';
import FuYan from './com/FuYan.vue';
import {
  randomPrices,
  feedbackPrizes,
  defaultPaySuccessHtml,
  urlData,
  shareData,
} from './data';
import { disableTipBeforeClose, tranStoreImages } from './func';
import {
  generateCacheData,
  generateSubmitData,
  renderCreatedData,
} from './AppPatch';
import request from '../../utils/request';

export default {
  name: 'App',
  components: {
    draggable,
    Types,
    GuiGe,
    FuYan,
  },
  data() {
    return {
      feedbackPrizes,
      form: {
        // 标题
        title: '',
        // 是否显示分享标题参与人次
        allow_showVistNum: 1,
        // 分类Id
        ceremonyTypeId: null,
        // 封面图片
        pics: [],
        // 封面视频
        video: [],
        // 简介
        custom_introduce: '',
        // 详情信息
        detail: '',
        // 规格
        subdivideStr: [],
        // 公共附言
        postScript: [],
        // 是否需要支付（无规格时）
        _needPay: 1,
        // 价格（无规格时）
        price: '',
        // 是否自动处理订单
        isAutoFinish: 1,
        // 库存
        stock: '',
        // 下单按钮文字
        opName: '随喜功德',
        // 是否显示参与者列表
        showClient: 1,
        // 是否显示统计区域
        // showStatictics: 1,
        // 是否显示统计区域
        _showStat: 1,
        // 1 普通样式、2 众筹样式
        _statStyle: 1,
        // 目标筹款金额
        targetAmount: '',
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: '',
        // 是否显示剩余时间
        showEndTime: 0,
        // 是否显示功德证书
        _showFeedback: 1,
        // 反馈类型（1 通用法会，2 通用捐赠，3 供养万僧，...）
        feedbackType: 1,
        // 是否显示反馈信息
        pay_succ_details_flag: 0,
        // 支付成功反馈信息
        payDetail: defaultPaySuccessHtml,
      },
      // 是否正在上传视频
      uploadingVideo: false,
      // 通过视频获取封面需要的后缀
      videoCoverSuffix: '?vframe/jpg/offset/1',
      // 选取封面组件实例
      chooseCoverIns: null,
      // 详情编辑器实例
      detailEditor: null,
      // 支付完成编辑器实例
      paySuccessEditor: null,

      // 头部标题文本
      navTitleText: '新建佛事',
      // 发布按钮的文本
      submitText: '发布',
      // 显示存为草稿按钮
      showSaveAsDraft: true,
      // 显示存为模板按钮
      showSaveAsTemplate: true,
    };
  },
  computed: {
    ceremonyTypes() {
      return this.$store.state.ceremonyTypes;
    },
    guiGeListLength() {
      return this.$store.state.guiGeListLength;
    },
  },
  created() {
    // 复制佛事
    if (urlData.createByCopy) {
      document.title = '复制佛事';
      this.navTitleText = '复制佛事';
    }
    // 编辑佛事
    else if (urlData.updateFoShi) {
      document.title = '编辑佛事';
      this.navTitleText = '编辑佛事';
      // 非草稿状态
      if (urlData.verifyId !== 2) {
        this.submitText = '修改佛事';
        this.showSaveAsDraft = false;
      }
    }
    // 使用自定义模板创建
    else if (urlData.createByCusTpl || urlData.updateCusTpl) {
      this.showSaveAsTemplate = false;
      // 编辑模板
      if (urlData.updateCusTpl) {
        document.title = '编辑模板';
        this.navTitleText = '编辑模板';
        this.submitText = '保存';
        this.showSaveAsDraft = false;
      }
    }

    // 非空白创建
    if (!urlData.createByPlain) {
      renderCreatedData(this.form, urlData.createBySysTpl);

      // 更新 guiGeListLength
      this.$store.state.guiGeListLength = this.form.subdivideStr.length;
    } else {
      // 每隔一分钟保存一次佛事到本地
      setInterval(this.saveLocalCacheContent, 60000);
      setTimeout(this.renderLocalCacheContent, 3000);
    }
  },
  mounted() {
    // 初始化视频上传组件
    upload({
      el: this.$refs.uploadVideo,
      uploadUrl: '/zzhadmin/uploadPic/',
      done: url => {
        this.uploadingVideo = false;
        this.form.video.push(url);
      },
      uploadHandle: res => res.url,
      uploadOptions: {
        formData: {},
        add: (e, data) => {
          const fileName = data.files[0].name.toLowerCase();
          const size = data.files[0].size;
          const limitSize = 50 * 1024 * 1024;

          if (
            fileName.indexOf('mp4') < 0 &&
            fileName.indexOf('rmvb') < 0 &&
            fileName.indexOf('mov') < 0
          ) {
            MessageBox.alert('请上传正确的视频格式');
            return;
          }
          if (size > limitSize) {
            MessageBox.alert('请上传不超过50M的文件');
            return;
          }

          this.uploadingVideo = true;

          data.process().done(() => {
            data.submit();
          });
        },
        fail: () => {
          this.uploadingVideo = false;
          Message.error('上传视频失败');
        },
      },
    });

    // 初始化详情编辑器
    this.detailEditor = window.UE.getEditor('detail-editor', {
      initialFrameWidth: 700,
      initialFrameHeight: 400,
    });
    this.detailEditor.ready(() => {
      if (this.form.detail) this.detailEditor.setContent(this.form.detail);
    });

    // 初始化支付完成编辑器
    this.paySuccessEditor = window.UE.getEditor('pay-success-editor', {
      initialFrameWidth: 700,
      initialFrameHeight: 400,
    });
    this.paySuccessEditor.ready(() => {
      if (this.form.payDetail)
        this.paySuccessEditor.setContent(this.form.payDetail);
    });
  },
  methods: {
    toTypesDialog() {
      this.$store.state.typesDialogShowing = true;
    },
    delCover(index) {
      this.form.pics.splice(index, 1);
    },
    addCover() {
      if (!this.chooseCoverIns) {
        this.chooseCoverIns = new ChooseImage({
          onSubmit: data => {
            data.forEach(item => {
              if (this.form.pics.length < 5) {
                this.form.pics.push(item.src);
              }
            });
          },
        });
      }
      this.chooseCoverIns.show();
    },
    delVideo(index) {
      this.form.video.splice(index, 1);
    },
    fillRandomPrices() {
      this.form.price = randomPrices;
    },

    // 取消操作
    cancel() {
      MessageBox.confirm('你确定离开吗?（未保存的修改将不生效）').then(() => {
        disableTipBeforeClose();
        window.history.back();
      });
    },
    checkForSubmit() {
      if (this.uploadingVideo) {
        Message.info('请等待视频上传完成！');

        return false;
      }

      return true;
    },
    getSubmitData() {
      const detail = this.detailEditor.getContent();
      const payDetail = this.paySuccessEditor.getContent();

      this.form.detail = detail;
      this.form.payDetail = payDetail;

      return generateSubmitData(this.form);
    },
    // 提交操作
    submit() {
      if (!this.checkForSubmit()) return;

      const submitData = this.getSubmitData();
      if (!submitData) return;

      zzhHandling.show();
      tranStoreImages([submitData.detail, submitData.payDetail], result => {
        submitData.detail = result[0];
        submitData.payDetail = result[1];

        zzhHandling.setText('保存数据');

        // 更新模板
        if (urlData.updateCusTpl) {
          request({
            url: '/zzhadmin/saveCeremonyTemplate/',
            method: 'post',
            data: {
              templateId: urlData.templateId,
              content: submitData,
            },
          })
            .then(res => {
              disableTipBeforeClose();
              this.removeLocalCacheContent();
              toastr.success('更新成功!');
              setTimeout(function() {
                window.location.href = '/zzhadmin/selectCeremonyTemplate/';
              }, 2000);
            })
            .finally(() => {
              zzhHandling.hide();
            });
          return;
        }

        this.saveFoShi(submitData);
      });
    },
    // 存为模板
    saveAsTemplate() {
      if (!this.checkForSubmit()) return;

      const submitData = this.getSubmitData();
      if (!submitData) return;

      MessageBox.prompt('将此佛事添加到佛事模板库中', {
        inputPlaceholder: '请填写备注名称，最多12字',
      }).then(({ value }) => {
        // 无value，则取title
        const templateName = value || submitData.title;

        zzhHandling.show();
        tranStoreImages([submitData.detail, submitData.payDetail], result => {
          submitData.detail = result[0];
          submitData.payDetail = result[1];

          zzhHandling.setText('保存数据');

          request({
            url: '/zzhadmin/saveCeremonyTemplate/',
            method: 'post',
            data: {
              name: templateName,
              content: submitData,
            },
          })
            .then(res => {
              disableTipBeforeClose();
              this.removeLocalCacheContent();
              toastr.success('保存成功!');
              setTimeout(function() {
                window.location.href = '/zzhadmin/selectCeremonyTemplate/';
              }, 2000);
            })
            .finally(() => {
              zzhHandling.hide();
            });
        });
      });
    },
    // 存为草稿
    saveAsDraft() {
      if (!this.checkForSubmit()) return;

      const submitData = this.getSubmitData();
      if (!submitData) return;

      zzhHandling.show();
      tranStoreImages([submitData.detail, submitData.payDetail], result => {
        submitData.detail = result[0];
        submitData.payDetail = result[1];

        zzhHandling.setText('保存数据');

        this.saveFoShi(submitData, true);
      });
    },
    // 保存为佛事
    saveFoShi(submitData, asDraft) {
      if (urlData.updateFoShi) {
        submitData.id = urlData.id;
        // 保持草稿状态
        if (urlData.verifyId === 2) submitData.op_status = 2;
      }

      if (asDraft) submitData.op_status = 2;
      // 后端定义的op_status与verifyId不一致
      else submitData.op_status = urlData.verifyId === 1 ? 0 : 1;

      request({
        url: urlData.updateFoShi
          ? '/zzhadmin/managerEditCeremony/'
          : '/zzhadmin/createCeremony/',
        method: 'post',
        data: submitData,
      })
        .then(res => {
          disableTipBeforeClose();
          this.removeLocalCacheContent();

          if (asDraft) {
            toastr.success('保存成功!');
            setTimeout(function() {
              window.location.href = '/zzhadmin/managerCeremonyIndex/';
            }, 2000);
          }

          this.afterCreateFoShi();
        })
        .finally(() => {
          zzhHandling.hide();
        });
    },
    afterCreateFoShi() {
      // 如果是创建佛事，或者更新草稿，就设置一个标志
      if (
        (!urlData.updateFoShi && !urlData.updateCusTpl) ||
        (urlData.updateFoShi && urlData.verifyId === 2)
      ) {
        window.sessionStorage.setItem('buddhistVerify', 1);
      }

      // todo
    },
    saveLocalCacheContent() {
      const detail = this.detailEditor.getContent();
      const payDetail = this.paySuccessEditor.getContent();

      this.form.detail = detail;
      this.form.payDetail = payDetail;
      window.localStorage.setItem(
        'foshi_content',
        JSON.stringify(generateCacheData(this.form))
      );
    },
    removeLocalCacheContent() {
      window.localStorage.removeItem('foshi_content');
    },
    renderLocalCacheContent() {
      const localContent = window.localStorage.getItem('foshi_content');
      if (!localContent) return;

      let contentJson;
      try {
        contentJson = JSON.parse(localContent);
      } catch (e) {
        return;
      }

      MessageBox.confirm(
        '您有未保存的本地佛事内容，是否读取(会覆盖当前内容)？'
      ).then(() => {
        shareData.createdData = contentJson;
        renderCreatedData(this.form, false, true);
        this.$store.state.allComponentsChange += 1;
        this.$forceUpdate();

        if (this.form.detail) this.detailEditor.setContent(this.form.detail);
        if (this.form.payDetail)
          this.paySuccessEditor.setContent(this.form.payDetail);
      });
    },
  },
};
