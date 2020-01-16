# 图标选取组件

## 快速开始

使用

```
import ChooseIcon from 'com-deprecated/choose-icon';

new ChooseIcon(options);

```

## 文档

### `@param options.multiSelect`: `true/false`, 是否多选图标，默认 `true`

### `@param options.onSubmit`: 确定选择的回调

```
items => {...}

// items 示例
items: [
    {
        src: '图标地址'
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
