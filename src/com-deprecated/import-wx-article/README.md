# 导入微信文章组件

## 快速开始

使用

```
import ImportWxArticle from 'com-deprecated/import-wx-article';

new ImportWxArticle(option);

```

## 文档

### `@param option.onSubmit`: 确定选择的回调

```
content => {...}
```

### `@param option.onCancel`: 点击取消的回调

```
() => {...}
```

### 自定义接口

- `window.importWxArticleEmptyHandle`: 地址为空的处理

```
msg => {}
```

- `window.importWxArticleGetArticle`: 自定义获取文本

```
/**
 * url: 地址
 * callback: 获取内容后的回调
 */
(url, callback) => {
    // ...

    callback(content)
}
```
