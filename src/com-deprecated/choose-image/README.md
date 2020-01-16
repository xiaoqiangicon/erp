# 图片选取组件

## 快速开始

使用

```
import 'bootstrap/dist/css/bootstrap.css';
import 'com-deprecated/pagination/index.less';
import 'com-deprecated/upload/css/index.css';
import '@fancyapps/fancybox/dist/jquery.fancybox.css';

import ChooseImage from 'com-deprecated/choose-image';

const choose = new ChooseImage(options);

```

## 文档

### `@param options.multiUpload`: `true/false`, 上传时是否可以多个文件一起传，默认 `true`

### `@param options.multiSelect`: `true/false`, 是否多选图片，默认 `true`

### `@param options.showManage`: `true/false`, 是否显示管理，默认 `true`

### `@param options.onSubmit`: 确定选择的回调

```
items => {...}

// items 示例
items: [
    {
        src: '图片地址'
    }
    ...
]
```

### `show`: 显示组件

```
choose.show();
```

### `hide`: 隐藏组件

```
choose.hide();
```

### 自定义接口

- `window.zzhChooseImageExtractFail`: 提取图片出错的处理函数

```
msg => {}
```

- `window.zzhChooseImageCanNotDelete`: 不能删除图片的处理函数

```
msg => {}
```

- `window.zzhChooseImageSelectedEmpty`: 图片选取为空的处理函数

```
msg => {}
```

- `window.zzhChooseImageDeleteSuccessful`: 删除成功的处理函数

```
msg => {}
```

- `window.zzhChooseImageDeleteConfirm`: 删除前确认的处理函数

```
(msg, callback) => {
    // do with msg

    // 用户确认后需调用此回调
    callback();
}
```
