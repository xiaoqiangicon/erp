import draggable from 'vuedraggable';
import { Message, MessageBox } from 'element-ui';
import { generateFuYan } from '../func';
import {
  expressFuYanList,
  selectFuYanList,
  fuYanPreviewImages,
  selectFuYanWS,
  selectFuYanQF,
} from '../data';
import { isInt } from '../../../utils/num';
import { has } from 'core-js/core/dict';

export default {
  name: 'FuYan',
  components: {
    draggable,
  },
  data() {
    return {
      // 列表
      list: null,
      selectFuYanList,
      expressFuYanList,
      selectFuYanWS,
      selectFuYanQF,
      fuYanPreviewImages,
      // 进行设置的项
      setItem: {},
      // 因为有取消的操作，所以需要保存原来的对象
      originalSetItem: {},
      // 是否显示附言设置弹框
      setDialogVisible: false,
    };
  },
  props: {
    postScript: {
      required: true,
      type: Array,
    },
    subdivide_type: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    fuYanComponentDataChange() {
      return this.$store.state.fuYanComponentDataChange;
    },
    allComponentsChange() {
      return this.$store.state.allComponentsChange;
    },
    remainMsgCount() {
      return this.$store.state.remainMsgCount;
    },
  },
  watch: {
    fuYanComponentDataChange() {
      if (!this.subdivide_type) return;

      // hack 更新组件
      this.list = [];
      setTimeout(() => {
        this.list = this.postScript;
        this.fillTmpIsPredefined();
      }, 200);
    },
    allComponentsChange() {
      this.$forceUpdate();
    },
  },
  created() {
    // 直接修改postScript不会刷新默认（因为是属性），所以引用到list
    this.list = this.postScript;

    this.list.forEach(item => {
      // 未预览添加模型字段，防止控制台报错
      item._tmpValueForDisplay = '';
    });

    this.fillTmpIsPredefined();
  },
  methods: {
    onDraggableMove(e) {
      // 预定义的字段不能排序
      return e.related.className.indexOf('draggable-exclude') === -1;
    },
    fillTmpIsPredefined() {
      if (this.subdivide_type === 2) {
        if (this.list[0]) this.list[0]._isPredefined = true;
        if (this.list[1]) this.list[1]._isPredefined = true;
        if (this.list[2]) this.list[2]._isPredefined = true;
        if (this.list[3]) this.list[3]._isPredefined = true;
        if (this.list[4]) this.list[4]._isPredefined = true;
        if (this.list[5]) this.list[5]._isPredefined = true;
      } else if (this.subdivide_type === 3) {
        if (this.list[0]) this.list[0]._isPredefined = true;
        if (this.list[1]) this.list[1]._isPredefined = true;
        if (this.list[2]) this.list[2]._isPredefined = true;
        if (this.list[3]) this.list[3]._isPredefined = true;
        if (this.list[4]) this.list[4]._isPredefined = true;
      }

      // 往生排位与祈福排位地区前三个附言是预定义的，不能删除，类型和名称不能修改
      // 往生牌位新增预设出生日期，往生日期；祈福牌位新增出生日期
      // if ([2, 3].indexOf(this.subdivide_type) > -1) {
      //   // 老的佛事需要自动补齐地区附言;虽然新增了地区type，但是改不了了，因为旧佛事已经使用了type为6的地址控件，且后面又加了一个详细地址;
      //   if (
      //     this.list[0].inputType !== 6 &&
      //     this.list[1].inputType !== 6 &&
      //     this.list[2].inputType !== 6
      //   ) {
      //     this.list.unshift(
      //       {
      //         inputType: 6,
      //         prompt_text: '请选择地区',
      //         name: '地区',
      //         is_must: 1,
      //         dataType: 2,
      //         pic_num: 4,
      //         describe: '',
      //         isVerify: 0,
      //         font_length: 20,
      //       },
      //       districtDetail
      //     );
      //   }

      //   let hasDistrictDetail = !1;
      //   for (let i = 0; i < this.list.length; i++) {
      //     if (this.list[i].inputType === 19) {
      //       hasDistrictDetail = !0;
      //     }
      //   }

      //   if (!hasDistrictDetail) {
      //     if (this.list[0].inputType === 6) {
      //       this.list.splice(1, 0, districtDetail);
      //     } else if (this.list[2].inputType === 6) {
      //       this.list.splice(3, 0, districtDetail);
      //     }

      //     console.log(hasDistrictDetail, this.list, 'hasdfsdk');
      //   }

      //   // 老佛事需要补齐需要的日期控件(往生)
      //   let birth = {
      //     inputType: 9,
      //     prompt_text: '',
      //     describe: '',
      //     name: '出生日期',
      //     is_must: 0,
      //     dataType: 2,
      //     pic_num: 0,
      //     isVerify: 0,
      //     font_length: 0,
      //   };
      //   let wsBirth = {
      //     inputType: 9,
      //     prompt_text: '',
      //     describe: '',
      //     name: '往生日期',
      //     is_must: 0,
      //     dataType: 2,
      //     pic_num: 0,
      //     isVerify: 0,
      //     font_length: 0,
      //   };

      //   if (this.subdivide_type === 2) {
      //     if (this.list[4] && this.list[4].inputType !== 9) {
      //       this.list.splice(4, 0, birth);
      //     }
      //     if (this.list[5] && this.list[5].inputType !== 9) {
      //       this.list.splice(5, 0, wsBirth);
      //     }
      //     if (!this.list[5]) {
      //       this.list[5] = birth;
      //     }
      //     if (!this.list[4]) {
      //       this.list[4] = wsBirth;
      //     }

      //     this.list[4]._isPredefined = true;
      //     this.list[5]._isPredefined = true;
      //   }

      //   // 祈福补齐需要的日期控件
      //   if (this.subdivide_type === 3) {
      //     if (this.list[4] && this.list[4].inputType !== 9) {
      //       this.list.splice(4, 0, birth);
      //     }
      //     if (!this.list[4]) {
      //       this.list[4] = birth;
      //     }

      //     this.list[4]._isPredefined = true;
      //   }
      //   console.log(this.postScript, 'postscript');
      //   if (this.list[0]) this.list[0]._isPredefined = true;
      //   if (this.list[1]) this.list[1]._isPredefined = true;
      //   if (this.list[2]) this.list[2]._isPredefined = true;
      //   if (this.list[3]) this.list[3]._isPredefined = true;
      // }
    },
    addFuYan() {
      const item = generateFuYan();
      // 未预览添加模型字段，防止控制台报错
      item._tmpValueForDisplay = '';
      this.list.push(item);
    },
    onChangeType(index) {
      const item = this.list[index];
      const newItem = generateFuYan(item.inputType);

      Object.keys(newItem).forEach(key => {
        item[key] = newItem[key];
      });

      // 未预览添加模型字段，防止控制台报错
      item._tmpValueForDisplay = '';
    },
    delFuYan(index) {
      MessageBox.confirm('确定删除这个附言吗').then(() => {
        this.list.splice(index, 1);
      });
    },
    setFuYan(index) {
      this.originalSetItem = this.list[index];
      this.setItem = JSON.parse(JSON.stringify(this.originalSetItem));
      this.setDialogVisible = true;
    },
    handleSetDialogConfirm() {
      if (this.setItem.inputType === 3) {
        const selections = this.setItem.prompt_text
          .split('\n')
          .map(s => s.trim())
          .filter(s => !!s);
        if (selections.length < 2) {
          MessageBox.alert('请至少输入2个选择项');
          return;
        }
      }
      if (this.setItem.inputType === 13 && !this.setItem.prompt_text) {
        MessageBox.alert('请输入提示内容');
        return;
      }
      if (this.setItem.inputType === 14) {
        if (
          !isInt(this.setItem.pic_num) ||
          parseInt(this.setItem.pic_num) < 1
        ) {
          MessageBox.alert('最大上传数需输入大于0的整数');
          return;
        }
      }
      if (this.setItem.inputType === 15) {
        if (
          !isInt(this.setItem.font_length) ||
          parseInt(this.setItem.font_length) < 1
        ) {
          MessageBox.alert('填写字数需输入大于0的整数');
          return;
        }
      }

      Object.keys(this.setItem).forEach(key => {
        this.originalSetItem[key] = this.setItem[key];
      });
      this.setDialogVisible = false;
    },
    enterPreviewThumbnail(index) {
      this.list[index]._previewImage = true;
      this.$forceUpdate();
    },
    leavePreviewThumbnail(index) {
      this.list[index]._previewImage = false;
      this.$forceUpdate();
    },
  },
};
