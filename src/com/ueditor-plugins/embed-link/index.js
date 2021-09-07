import Vue from 'vue';
import {
  Dialog,
  Input,
  Button,
  Table,
  TableColumn,
  Pagination,
  Loading,
  Select,
  Option,
  Form,
  FormItem,
} from 'element-ui';

import './register';
import EmbedLinkPopup from './App.vue';

Vue.component(Dialog.name, Dialog);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Pagination.name, Pagination);
Vue.use(Loading);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);

const EmbedLinkPopupConstructor = Vue.extend(EmbedLinkPopup);

// 插入音频
window.UE.registerUI(
  'ue-embed-link',
  (editor, uiName) =>
    new window.UE.ui.Button({
      name: uiName,
      title: '插入链接',
      cssRules: 'background-position: -620px -40px;',
      onclick() {
        if (editor.ueEmbedLink) {
          editor.ueEmbedLinkVm.visible = true;
          return;
        }

        const el = document.createElement('div');
        el.classList.add('ue-embed-link');

        document.body.append(el);
        editor.ueEmbedLink = el;

        const vm = new EmbedLinkPopupConstructor({
          el,
          propsData: {
            onSelect(selectData) {
              editor.execCommand('embedlink', { selectData });
              vm.visible = false;
            },
          },
        });

        editor.ueEmbedLinkVm = vm;
      },
    })
);
