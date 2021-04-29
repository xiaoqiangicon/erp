import draggable from 'vuedraggable';
import { Message, MessageBox } from 'element-ui';
import { generateGuiGe } from '../func';
import { randomPrices, redPacketCover, selectGuiGeList } from '../data';
import { isInt } from '../../../utils/num';
import ChooseImage from '../../../com-deprecated/choose-image';
import FuYan from './FuYan.vue';
import { removeIdDeep } from '../utils';

export default {
  name: 'GuiGe',
  components: {
    draggable,
    FuYan,
  },
  data() {
    return {
      // 列表
      list: null,
      selectGuiGeList,
      // 进行设置的项
      setItem: {},
      // 因为有取消的操作，所以需要保存原来的对象
      originalSetItem: {},
      // 是否显示规格设置弹框
      setDialogVisible: false,
      // 附言编辑的项
      fuYanItem: {},
      // 因为有取消的操作，所以需要保存原来的对象
      originalFuYanItem: {},
      // 是否显示附言编辑弹框
      fuYanDialogVisible: false,
      // 当前正在添加封面的索引
      addCoverIndex: -1,
      // 封面选择组件实例
      chooseCoverIns: null,
    };
  },
  props: {
    subdivideStr: {
      required: true,
      type: Array,
    },
  },
  computed: {
    allComponentsChange() {
      return this.$store.state.allComponentsChange;
    },
  },
  watch: {
    allComponentsChange() {
      this.$forceUpdate();
    },
  },
  created() {
    // 直接修改subdivideStr不会刷新默认（因为是属性），所以引用到list
    this.list = this.subdivideStr;

    this.list.forEach(item => {
      // 设置_durationDayType辅助字段
      item._durationDayType = 1;
      item._priceAutoBox = false;
    });
  },
  methods: {
    addGuiGe() {
      const item = generateGuiGe();
      // 设置_durationDayType辅助字段
      item._durationDayType = 1;
      item._priceAutoBox = false;
      this.list.push(item);

      // 更新 guiGeListLength
      this.$store.state.guiGeListLength = this.list.length;
    },
    onChangeType(index) {
      const item = this.list[index];
      const newItem = generateGuiGe(item.subdivide_type);

      Object.keys(newItem).forEach(key => {
        item[key] = newItem[key];
      });
      // 设置_durationDayType辅助字段
      item._durationDayType = 1;
      item._priceAutoBox = false;
    },
    delGuiGe(index) {
      MessageBox.confirm('确定删除这个选择项吗').then(() => {
        this.list.splice(index, 1);

        // 更新 guiGeListLength
        this.$store.state.guiGeListLength = this.list.length;
      });
    },
    copyGuiGe(index) {
      const item = this.list[index];
      const newItem = JSON.parse(JSON.stringify(item));

      // 删除所有的Id，包括深层的
      removeIdDeep(newItem);

      this.list.splice(index, 0, newItem);
    },
    setGuiGe(index) {
      this.originalSetItem = this.list[index];
      this.setItem = JSON.parse(JSON.stringify(this.originalSetItem));
      this.setDialogVisible = true;
    },
    handleSetDialogConfirm() {
      if (this.setItem.durationDay) {
        if (
          !isInt(this.setItem.durationDay) ||
          parseInt(this.setItem.durationDay) < 0
        ) {
          MessageBox.alert('供奉时长需输入大于或等于0的整数');
          return;
        }
      }

      Object.keys(this.setItem).forEach(key => {
        this.originalSetItem[key] = this.setItem[key];
      });
      this.setDialogVisible = false;
    },
    delCover(index) {
      const item = this.list[index];
      item.pic = '';
    },
    addCover(index) {
      this.addCoverIndex = index;
      if (!this.chooseCoverIns) {
        this.chooseCoverIns = new ChooseImage({
          multiple: false,
          onSubmit: data => {
            this.list[this.addCoverIndex].pic = data[0].src;
          },
        });
      }
      this.chooseCoverIns.show();
    },
    focusPriceInput(index) {
      this.list[index]._priceAutoBox = true;
      this.$forceUpdate();
    },
    blurPriceInput(index) {
      // 这里需要延迟执行，不然会阻止fillRandomPrices()的运行
      setTimeout(() => {
        this.list[index]._priceAutoBox = false;
        this.$forceUpdate();
      }, 300);
    },
    fillRandomPrices(index) {
      const item = this.list[index];
      item.price = randomPrices;
      // 如果没有封面，给个默认的红包封面
      if (!item.pic) item.pic = redPacketCover;
    },
    toFuYan(index) {
      this.originalFuYanItem = this.list[index];
      this.fuYanItem = JSON.parse(JSON.stringify(this.originalFuYanItem));
      this.fuYanDialogVisible = true;

      // 在规格组件中改变数据，附言组件并不会变化，这里做一次hack
      this.$store.state.fuYanComponentDataChange += 1;
    },
    handleFuYanDialogConfirm() {
      // 邮寄佛事
      if (this.fuYanItem.subdivide_type === 4) {
        const hasFuYan16 = !!this.fuYanItem.postScript.find(
          i => i.inputType === 16
        );
        const hasFuYan17 = !!this.fuYanItem.postScript.find(
          i => i.inputType === 17
        );
        if (!hasFuYan16 && !hasFuYan17) {
          MessageBox.alert('必须要有一个用户自选邮寄或者普通邮寄附言');
          return;
        }
        if (hasFuYan16 && hasFuYan17) {
          MessageBox.alert('用户自选邮寄或者普通邮寄附言不能同时存在');
          return;
        }
      }

      this.originalFuYanItem.postScript = this.fuYanItem.postScript;
      this.fuYanDialogVisible = false;
    },
  },
};
