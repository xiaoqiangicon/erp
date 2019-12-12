# 推广弹窗组件

## 快速开始

使用

```
// 必须先记载这个 css 文件
import '@senntyou/shortcut.css';

import promotion from 'component/promotion';

promotion.show();
```

## 文档

### `promotion.show`: 显示组件

```
promotion.show(option, onClose);
```

- `option`: 组组件配置

  - `option.link`: 链接地址（不能为空）
  - `option.showPost`: 是否显示海报，默认 false
  - `option.postTitle`: 默认海报图的标题
  - `option.maxPostTitle`: 海报输入标题最大值，默认不限制
  - `option.loadPost`: 动态加载海报地址信息 `(callback, title) => callback(postImageUrl, postWxUrl)`
    - `callback`: 在你自己的函数中获取到数据后，调用此回调函数，传入 `postImageUrl` 和 `postWxUrl` 两个值
      - `postImageUrl`: 海报图片链接
      - `postWxUrl`: 微信扫码链接
    - `title`: 用户自定义输入的标题，默认为空字符串
  - `option.hideDesc`: 是否隐藏底部描述，默认 false

- `onClose`: 弹出框关闭的回调函数
