# 转存图片组件

## 快速开始

使用

```
import StoreImage from 'com-deprecated/store-image';

new StoreImage(content, callback, progress);
```

## 文档

### `@param content`: 需要处理的文本 (`string/array`)

### `@param callback`: 处理成功的回调函数

example:

```
handledContent => {}
```

- `handledContent`: 已处理的文本，如果传入的 `content` 参数是数组，则 `handledContent` 也是数组，且元素一一对应

### `@param progress`: 上传进度的回调函数

```
(uploaded, total) => {}
```

- `uploaded`: 上传数
- `total`: 总数

注：如果 `content` 为数组，`progress` 也应该是数组

### 自定义上传接口

```
window.storeImageSaveUrl = (url, successCallback, errorCallback) => {
    // 转存图片之后
    let newUrl; // 转存之后新的图片地址

    // 成功回调函数
    successCallback(newUrl);

    // 失败的回调函数
    errorCallback();
};
```

- `url`: 待转存的图片地址
- `successCallback`: 成功的回调函数，需要传入新的图片地址作为参数

```
successCallback(newUrl);
```

- `errorCallback`: 失败的回调函数

```
errorCallback();
```
