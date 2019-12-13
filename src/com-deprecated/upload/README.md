# 上传组件

更多信息参考 [jQuery-File-Upload](https://github.com/blueimp/jQuery-File-Upload)

## 快速开始

使用

```
import 'com-deprecated/upload/css/index.css';

import upload from 'com-deprecated/upload';

upload(container, done, progress, option);
upload(container, done, progress);
upload(container, done, option);
upload(container, done);
```

## 文档

### `@param container`: 上传容器，selector 选择器/dom

1. 需要 position: relative 的容器
2. 需要固定的宽和高

### `@param done`: 上传成功的回调函数

example:

```
(url, e, data) => {}
```

- `url`: 返回的 URL
- `e, data`: 请参考：https://github.com/blueimp/jQuery-File-Upload/wiki/Options[done]

### `@param progress`: 上传进度变化的回调函数

example:

```
(e, data) => {}
```

- `e, data`: 请参考：https://github.com/blueimp/jQuery-File-Upload/wiki/Options[done]

### `@param option`: 配置信息

1. `@param option.multiple`: 多个上传
2. `@param option.type`: 上传类型，(file: 文件，image: 图片)，默认是图片
3. `@param option.componentOption`: jQuery-File-Upload 配置信息

### 自定义上传接口

- 1 `window.zzhUploadFileUrl`: 文件上传 url，默认是 `void 0`
- 2 `window.zzhUploadImageUrl`: 图片上传 url，默认是 `void 0`
- 3 `window.zzhUploadUrl`: 普通上传 url，默认是 `/zzhadmin/uploadPic/`
- 4 `window.zzhUploadFileOption`: 文件上传配置，默认是

```
{
    dataType: 'json',
    paramName: 'file'
}
```

- 5 `window.zzhUploadImageOption`: 图片上传配置，默认是

```
{
    dataType: 'json',
    paramName: 'file',
    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
    // 100M
    loadImageMaxFileSize: 100*1024*1024,
    imageMaxWidth: 1000,
    imageMaxHeight: 1000,
    disableImageResize: !1,
    messages: {
        acceptFileTypes: '请上传 jpg, png, gif 图片'
    }

    // processfail is blow
}
```

- 6 `window.zzhUploadOption`: 普通上传配置，默认是 `void 0`
- 7 `window.zzhUploadFileHandle`: 文件上传处理，默认是 `void 0`
- 8 `window.zzhUploadImageHandle`: 图片上传处理，默认是 `void 0`
- 9 `window.zzhUploadHandle`: 普通上传处理，默认是

```
// 根据 ajax 的 response 返回一个图片地址
res => {
    return res.url;
}
```

- 10 `window.zzhUploadProcessFail`: 失败的处理函数，默认是

```
// 传入一个错误信息，然后展示
msg => {
    alert(msg);
}
```
