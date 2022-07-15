import Vue from 'vue';
import cookie from 'js-cookie';
import {
  Dialog,
  Input,
  Button,
  Table,
  TableColumn,
  Pagination,
  Loading,
  Tabs,
  TabPane,
} from 'element-ui';

import './register';
import EmbedVideoPopup from './App.vue';

Vue.component(Dialog.name, Dialog);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.component(Pagination.name, Pagination);
Vue.use(Loading);

const EmbedVideoPopupConstructor = Vue.extend(EmbedVideoPopup);

// 自营寺院才显示此功能
if (parseInt(cookie.get('is_zizaihome_temple'), 10)) {
  // 插入视频
  window.UE.registerUI(
    'ue-embed-video',
    (editor, uiName) =>
      new window.UE.ui.Button({
        name: uiName,
        title: '插入视频',
        cssRules: 'background-position: -320px -20px;',
        onclick() {
          if (editor.ueEmbedMusic) {
            editor.ueEmbedVideoVm.visible = true;
            return;
          }

          const el = document.createElement('div');
          el.classList.add('ue-embed-video');

          document.body.append(el);
          editor.ueEmbedVideo = el;

          const vm = new EmbedVideoPopupConstructor({
            el,
            propsData: {
              onSubmit: code => {
                if (code.indexOf('iframe') > -1) {
                  editor.execCommand('inserthtml', code);
                } else {
                  editor.execCommand('embedvideo', {
                    selectData: { video: code },
                  });
                }
                vm.visible = false;
              },
            },
          });

          editor.ueEmbedVideoVm = vm;
        },
      })
  );
}
