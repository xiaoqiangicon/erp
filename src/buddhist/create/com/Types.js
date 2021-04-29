import { Message, MessageBox } from 'element-ui';
import request from '../../../utils/request';
import { refreshCeremonyTypes } from '../func';

export default {
  name: 'Types',
  data() {
    return {
      // 因为用户修改，但不一定会保存，所以需要另外创建一个新的数组，而不直接使用 ceremonyTypes
      types: [],
      // 新增类名称
      newTypeName: '',
      // 是否正在保存新类型
      savingNewType: false,
    };
  },
  computed: {
    visible: {
      get() {
        return this.$store.state.typesDialogShowing;
      },
      set(val) {
        this.$store.state.typesDialogShowing = val;
      },
    },
    ceremonyTypes() {
      return this.$store.state.ceremonyTypes;
    },
  },
  watch: {
    visible() {
      // 每次编辑之前，初始化types为最新的ceremonyTypes
      if (this.visible) {
        this.updateTypes();
      }
    },
  },
  methods: {
    updateTypes() {
      this.types = JSON.parse(JSON.stringify(this.ceremonyTypes));
    },
    addType() {
      if (this.savingNewType) return;

      const typeName = this.newTypeName.trim();
      const data = new URLSearchParams();
      data.append('name', typeName);

      this.savingNewType = true;
      request({
        url: '/zzhadmin/createCeremonyType/',
        method: 'post',
        data,
      })
        .then(res => {
          Message.success('保存成功');

          // 置空
          this.newTypeName = '';
          // 重新加载列表数据
          refreshCeremonyTypes(() => {
            this.updateTypes();
          });
        })
        .finally(() => {
          this.savingNewType = false;
        });
    },
    updateType(index) {
      const typeItem = this.types[index];
      const data = new URLSearchParams();
      data.append('id', typeItem.ceremonyTypeId);
      data.append('name', typeItem.name);

      request({
        url: '/zzhadmin/managerEditCeremonyType/',
        method: 'post',
        data,
      }).then(res => {
        Message.success('更新成功');

        // 重新加载列表数据
        refreshCeremonyTypes(() => {
          this.updateTypes();
        });
      });
    },
    delType(index) {
      MessageBox.confirm('确定删除这个分类吗').then(() => {
        const typeItem = this.types[index];
        const data = new URLSearchParams();
        data.append('id', typeItem.ceremonyTypeId);

        request({
          url: '/zzhadmin/delCeremonyType/',
          method: 'post',
          data,
        }).then(res => {
          Message.success('删除成功');

          // 重新加载列表数据
          refreshCeremonyTypes(() => {
            this.updateTypes();
          });
        });
      });
    },
  },
};
