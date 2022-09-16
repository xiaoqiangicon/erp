import { Message, MessageBox } from 'element-ui';
import draggable from 'vuedraggable';
import toastr from 'toastr';
import cookie from 'js-cookie';
import ChooseImage from '../../com-deprecated/choose-image';
import * as zzhHandling from '../../../../pro-com/src/handling';
import upload from '../../../../pro-com/src/upload';
import {
  now,
  refreshNow,
  getDate,
  numOfDate,
} from '../../../../pro-com/src/utils';
import Types from './com/Types.vue';
import GuiGe from './com/GuiGe.vue';
import FuYan from './com/FuYan.vue';
import {
  randomPrices,
  feedbackPrizes,
  defaultPaySuccessHtml,
  urlData,
  shareData,
  defaultPrinterSetting,
  plainGuiGeList,
} from './data';
import {
  disableTipBeforeClose,
  toManagePage,
  toTemplatePage,
  tranStoreImages,
} from './func';
import {
  fillPrinterToSubmitData,
  generateCacheData,
  generateSubmitData,
  renderCreatedData,
} from './AppPatch';
import request from '../../utils/request';

let isStaff = cookie.get('is_staff') === 'False';
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
      isStaff,
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
        // 规格，默认有一个普通佛事规格
        subdivideStr: [JSON.parse(JSON.stringify(plainGuiGeList[0]))],
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
        // 是否显示功德榜列表
        showRank: 1,
        // 是否显示进展动态
        closeSchedule: 0,
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
        feedbackText: '',
        feedPics: [],
        feedVideo: [],
      },
      // 是否正在上传视频
      uploadingVideo: false,
      // 是否正在上传默认反馈视频
      uploadingFeedVideo: false,
      // 通过视频获取封面需要的后缀
      videoCoverSuffix: '?vframe/jpg/offset/1',
      // 选取封面组件实例
      chooseCoverIns: null,
      // 选取反馈图片组件实例
      chooseFeedCoverIns: null,
      // 详情编辑器实例
      detailEditor: null,
      // 支付完成编辑器实例
      paySuccessEditor: null,
      // 禁止修改开始时间与结束时间
      disableModifyTime: false,

      // 头部标题文本
      navTitleText: '新建项目',
      // 发布按钮的文本
      submitText: '发布',
      // 显示存为草稿按钮
      showSaveAsDraft: true,
      // 显示存为模板按钮
      showSaveAsTemplate: true,

      // 提醒设置弹出框
      notifyDialogVisible: false,
      // 提醒设置
      notifySet: {
        // 由接口返回的佛事Id
        commodityId: 0,
        // 提醒开始日期
        startDate: '',
        // 提醒结束日期
        endDate: '',
        // 是否添加进佛历
        calendar: 1,
        // 由接口返回的createImageText
        imagetext: 0,
      },

      // 打印机列表
      printerList: [
        // type: 0 小票打印、1 牌位打印
        // id, address
        // guiGeIndexes: 选中规格的索引列表
        // setting: 设置对象
        // online: bool, 是否在线
        // statusText: 状态文本
      ],
      // 小票打印机是否已设置
      printerSettled: false,
      // 小票打印机设置弹出框
      printerDialogVisible: false,
      // 小票打印机选择的索引
      printerSelectedIndex: null,
      // 当前正在编辑的打印机
      currentPrinterItem: {},
      // 普通的 v-model 最多只能是两层
      currentPrinterSetting: {},
      // checkbox-group 的 v-model 只能是一层
      currentPrinterGuiGeIndexes: [],
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
      document.title = '复制项目';
      this.navTitleText = '复制项目';
    }
    // 编辑佛事
    else if (urlData.updateFoShi) {
      document.title = '编辑项目';
      this.navTitleText = '编辑项目';
      // 非草稿状态
      if (urlData.verifyId !== 2) {
        this.submitText = '修改项目';
        this.showSaveAsDraft = false;
      }

      // 已发布的佛事不能修改时间
      if (urlData.verifyId === 1) this.disableModifyTime = true;
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

    // 复制佛事，不对规格库存和结束时间复制
    if (urlData.createByCopy) {
      this.form.stock = '';
      this.form.endTime = '';
      this.form.subdivideStr.forEach(item => {
        item.stock = '';
      });
    }

    // 获取打印机
    request('/zzhadmin/getPrinterList/').then(res => {
      if (res.data) {
        this.printerList = res.data;
        this.printerList.forEach(item => {
          item.guiGeIndexes = [];
          item.setting = { ...defaultPrinterSetting };
          item.setting.printerType = item.type;
          // 未初始化
          item.online = -1;
          item.statusText = '未获取状态';
        });
        this.initPrinter();
      }
    });
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

    // 默认反馈上传组件初始化
    upload({
      el: this.$refs.uploadFeedVideo,
      uploadUrl: '/zzhadmin/uploadPic/',
      done: url => {
        this.uploadingFeedVideo = false;
        this.form.feedVideo.push(url);
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

          this.uploadingFeedVideo = true;

          data.process().done(() => {
            data.submit();
          });
        },
        fail: () => {
          this.uploadingFeedVideo = false;
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
    // this.paySuccessEditor = window.UE.getEditor('pay-success-editor', {
    //   initialFrameWidth: 700,
    //   initialFrameHeight: 400,
    // });
    // this.paySuccessEditor.ready(() => {
    //   if (this.form.payDetail)
    //     this.paySuccessEditor.setContent(this.form.payDetail);
    // });
  },
  methods: {
    // 初始化打印机
    initPrinter() {
      /**
       * 注意：因为接口并不支持多对多的管理，所以这里小票打印机的处理显得比较奇怪
       * 如果要实现多对多的管理，则需要后端人员的支持
       * 有任何不懂，问后端人员
       */

      // 有打印机，并且是更新佛事，才初始化
      if (!this.printerList.length || !urlData.updateFoShi) return;

      const printerIds = this.printerList.map(i => i.id);
      this.form.subdivideStr.forEach((item, index) => {
        if (item.printer && item.printer.length) {
          item.printer.forEach(pItem => {
            const i = printerIds.indexOf(pItem.printerId);
            if (i > -1) {
              // 设定已设置
              this.printerSettled = true;

              const printerItem = this.printerList[i];
              // 添加索引
              printerItem.guiGeIndexes.push(index);
              // 更新配置
              Object.keys(pItem).forEach(key => {
                printerItem.setting[key] = pItem[key];
              });
            }
          });
        }
      });
    },
    openPrinterDialog() {
      if (!this.form.subdivideStr.length) {
        Message.warning('请至少添加一个规格后再设置打印机');
        return;
      }

      this.printerDialogVisible = true;
    },
    onChangeSelectPrinter() {
      const printerItem = this.printerList[this.printerSelectedIndex];
      this.currentPrinterItem = printerItem;
      this.currentPrinterGuiGeIndexes = printerItem.guiGeIndexes;
      this.currentPrinterSetting = printerItem.setting;
      this.currentPrinterSetting.printerType = this.printerList[
        this.printerSelectedIndex
      ].type;

      if (printerItem.online === -1) {
        request({
          url: '/zzhadmin/getPrinterStatus/',
          method: 'post',
          data: {
            printerId: printerItem.id,
          },
        }).then(res => {
          printerItem.statusText = res.msg;
          printerItem.online = printerItem.statusText.indexOf('在线') > -1;
          this.$forceUpdate();
        });
      }
    },
    onChangePrinterSelectGuiGe() {
      // 因为checkbox-group操作过程中会改变model的值引用，所以这里需要手动引用
      this.currentPrinterItem.guiGeIndexes = this.currentPrinterGuiGeIndexes;
    },
    handlePrinterDialogConfirm() {
      let hasSet = false;
      for (let i = 0, il = this.printerList.length; i < il; i++) {
        if (this.printerList[i].guiGeIndexes.length) {
          hasSet = true;
          break;
        }
      }
      this.printerSettled = hasSet;
      this.printerDialogVisible = false;
    },
    toTypesDialog() {
      this.$store.state.typesDialogShowing = true;
    },
    delCover(index) {
      this.form.pics.splice(index, 1);
    },
    delFeedCover(index) {
      this.form.feedPics.splice(index, 1);
    },
    addCover() {
      console.log('封面');
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
    addFeedCover() {
      console.log('反馈');
      if (!this.chooseFeedCoverIns) {
        this.chooseFeedCoverIns = new ChooseImage({
          onSubmit: data => {
            data.forEach(item => {
              this.form.feedPics.push(item.src);
            });
          },
        });
      }
      this.chooseFeedCoverIns.show();
    },
    delVideo(index) {
      this.form.video.splice(index, 1);
    },
    delFeedVideo(index) {
      this.form.feedVideo.splice(index, 1);
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
      // const payDetail = this.paySuccessEditor.getContent();

      this.form.detail = detail;
      // this.form.payDetail = payDetail;

      return generateSubmitData(this.form);
    },
    // 提交操作
    submit() {
      if (!this.checkForSubmit()) return;
      const submitData = this.getSubmitData();
      if (!submitData) return;

      // 如果是更新模板，或者创建、更新，但已设置打印
      if (urlData.updateCusTpl || this.printerSettled) {
        this.realSubmit(submitData);
        return;
      }

      // 如果没有规格
      if (!this.form.subdivideStr.length) {
        this.realSubmit(submitData);
        return;
      }

      MessageBox.confirm('您还没有为此项目添加小票打印机', {
        confirmButtonText: '去添加',
        cancelButtonText: '跳过',
      })
        .then(() => {
          this.printerDialogVisible = true;
        })
        .catch(() => {
          this.realSubmit(submitData);
        });
    },
    realSubmit(submitData) {
      // 填充打印机到提交数据中
      fillPrinterToSubmitData(submitData, this.printerList);

      zzhHandling.show();
      tranStoreImages([submitData.detail], result => {
        submitData.detail = result[0];
        // submitData.payDetail = result[1];

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
              setTimeout(toTemplatePage, 2000);
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

      MessageBox.prompt('将此项目添加到项目模板库中', {
        inputPlaceholder: '请填写备注名称，最多12字',
      }).then(({ value }) => {
        // 无value，则取title
        const templateName = value || submitData.title;

        zzhHandling.show();
        tranStoreImages([submitData.detail], result => {
          submitData.detail = result[0];
          //submitData.payDetail = result[1];

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
              setTimeout(toTemplatePage, 2000);
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
      // 填充打印机到提交数据中
      fillPrinterToSubmitData(submitData, this.printerList);

      zzhHandling.show();
      tranStoreImages([submitData.detail], result => {
        submitData.detail = result[0];
        //submitData.payDetail = result[1];

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
            setTimeout(toManagePage, 2000);
          }

          this.afterCreateFoShi(res);
        })
        .finally(() => {
          zzhHandling.hide();
        });
    },
    afterCreateFoShi(res) {
      // 如果是创建佛事，或者更新草稿，就设置一个标志
      if (
        (!urlData.updateFoShi && !urlData.updateCusTpl) ||
        (urlData.updateFoShi && urlData.verifyId === 2)
      ) {
        window.sessionStorage.setItem('buddhistVerify', 1);
      }

      if (res.createCalendar !== 1) {
        this.getUnprintedOrder();
        return;
      }

      this.notifySet.commodityId = res.commodityId;
      this.notifySet.imagetext = res.createImageText;

      let startDate;
      let endDate;
      let startTime = this.form.startTime || '';
      const endTime = this.form.endTime || '';
      // 如果开始时间与结束时间都为空，设定开始时间为当前
      if (!startTime && !endTime) {
        refreshNow();
        startTime = now.dateTime;
      }

      startDate = startTime.slice(0, 10);
      endDate = endTime.slice(0, 10);

      // 开始时间与结束时间都有
      if (startDate && endDate) {
        let startDateTS = new Date(startDate.replace(/-/g, '/')).getTime();
        const endDateTS = new Date(endDate.replace(/-/g, '/')).getTime();

        // 超过6天
        if (endDateTS - startDateTS > 6 * 24 * 3600 * 1000) {
          // 设为2天内
          startDateTS = endDateTS - 2 * 24 * 3600 * 1000;
          startDate = getDate(new Date(startDateTS)).date;
        }
      } else if (startDate) {
        const startDateTS = new Date(startDate.replace(/-/g, '/')).getTime();
        // 设为2天内
        const endDateTS = startDateTS + 2 * 24 * 3600 * 1000;
        endDate = getDate(new Date(endDateTS)).date;
      } else {
        const endDateTS = new Date(endDate.replace(/-/g, '/')).getTime();
        // 设为2天内
        const startDateTS = endDateTS - 2 * 24 * 3600 * 1000;
        startDate = getDate(new Date(startDateTS)).date;
      }

      this.notifySet.startDate = startDate;
      this.notifySet.endDate = endDate;
      this.notifyDialogVisible = true;
    },
    // 获取未打印的佛事订单
    getUnprintedOrder() {
      if (!urlData.id) {
        toastr.success('保存成功!');
        setTimeout(toManagePage, 2000);
        return;
      }

      request({
        url: '/zzhadmin/getNeedPrintOrderNum/',
        params: { commodityId: urlData.id },
      })
        .then(res => {
          if (!res.orderNum) {
            toastr.success('保存成功!');
            setTimeout(toManagePage, 2000);
            return;
          }

          MessageBox.confirm(`检测到有${res.orderNum}个订单未打印，是否打印?`, {
            confirmButtonText: '打印',
            cancelButtonText: '稍后再说',
          })
            .then(() => {
              const data = new URLSearchParams();
              data.append('commodityId', urlData.id);

              request({
                url: '/zzhadmin/printOrder/',
                method: 'post',
                data,
              })
                .then(() => {
                  toastr.success('开始打印!');
                  setTimeout(toManagePage, 2000);
                })
                .catch(error => {
                  setTimeout(toManagePage, 2000);
                });
            })
            .catch(() => {
              setTimeout(toManagePage, 2000);
            });
        })
        .catch(error => {
          toastr.success('保存成功!');
          setTimeout(toManagePage, 2000);
        });
    },
    saveLocalCacheContent() {
      const detail = this.detailEditor.getContent();
      const payDetail = {
        content: this.form.feedbackText,
        pic: this.form.feedPics.join(','),
        video: this.form.feedVideo.join(','),
      };

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
        '您有未保存的本地项目内容，是否读取(会覆盖当前内容)？'
      ).then(() => {
        shareData.createdData = contentJson;
        renderCreatedData(this.form, false, true);
        this.$store.state.allComponentsChange += 1;
        this.$forceUpdate();

        if (this.form.detail) this.detailEditor.setContent(this.form.detail);
        // if (this.form.payDetail)
        //   this.paySuccessEditor.setContent(this.form.payDetail);
      });
    },
    handleNotifyDialogConfirm() {
      const { startDate, endDate } = this.notifySet;

      if (!startDate) {
        MessageBox.alert('请选择开始日期');
        return;
      }
      if (!endDate) {
        MessageBox.alert('请选择结束日期');
        return;
      }

      if (numOfDate(startDate) > numOfDate(endDate)) {
        MessageBox.alert('开始日期不能大于结束日期');
        return;
      }

      const data = JSON.parse(JSON.stringify(this.notifySet));
      data.startTime = data.startDate;
      data.endTime = data.endDate;
      delete data.startDate;
      delete data.endDate;

      request({
        url: '/zzhadmin/addWebSite/',
        method: 'post',
        data,
      })
        .then(res => {
          this.notifyDialogVisible = false;
          this.getUnprintedOrder();
        })
        .catch(error => {
          MessageBox.alert('提交失败，请联系自在家平台。');
        });
    },
  },
};
