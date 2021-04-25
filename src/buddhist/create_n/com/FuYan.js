import draggable from 'vuedraggable';
import { Message, MessageBox } from 'element-ui';
import { generateFuYan } from '../func';
import { selectFuYanList } from '../data';
import { isInt } from '../../../utils/num';

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
  },
  watch: {
    fuYanComponentDataChange() {
      if (!this.subdivide_type) return;

      // hack 更新组件
      this.list = [];
      setTimeout(() => {
        this.list = this.postScript;
      }, 200);
    },
  },
  created() {
    // 直接修改postScript不会刷新默认（因为是属性），所以引用到list
    this.list = this.postScript;

    this.list.forEach(item => {
      // 未预览添加模型字段，防止控制台报错
      item._tmpValueForDisplay = '';
    });
  },
  methods: {
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
  },
};