# 分页组件

## 快速开始

使用

```
import zzhPagination from 'component/pagination';

new zzhPagination(container, option);
```

## 文档

### `container`: 分页显示容器

- `type`: selector 选择器, dom 对象, jquery 对象

### `option`: 配置项

- `option.currentPage`: 初始化当前页, default is 1
- `option.totalPages`: 总页数, default is 0
- `option.totalCount`: 总条数, default is 0
- `option.perPage`: 每页条数, default is 0
- `option.showDesc`: 是否显示左边（共多少条，每页多少条的信息）, default is false
- `option.showGoTo`: 是否显示右边跳转到某一页, default is false
- `option.onChange`: 切换页码回调函数，页面以 1 开始索引, like `(page) => {}`
  - `@param page`: 当前页码

### 属性

- `pagination.option`: 当前示例的配置
  - `pagination.option.currentPage`: 获取当前示例的当前页

### 方法

- `pagination.render`: 渲染当前示例的分页

```
pagination.render();
```

- `note`: 每次调用 onChange 回调函数后，需要手动触发 render 方法，实例化后也需要手动触发一次 render 方法
