# 工具集

## 快速开始

使用

```
import zzhUtil from 'com-deprecated/util';

zzhUtil.doSomething
```

## 文档

## date

### `zzhUtil.today`: today

- `type`: `map`
- `detail`:
  - `zzhUtil.today.year`: full year
  - `zzhUtil.today.month`: 1-12
  - `zzhUtil.today.week`: 0-6 (日 - 六)
  - `zzhUtil.today.day`: 1 - 31
  - `zzhUtil.today.display`: `2017-01-01`

example:

```
{
    year: 2018,
    month: 1,
    week: 6,
    day: 13,
    display: "2018-01-13"
}
```

## url

### `zzhUtil.urlParams`: url params

- `type`: `map`

`url?key1=1&key2=2&key3=` ->

```
{
    key1: '1',
    key2: '2',
    key3: ''
}
```

### `zzhUtil.makeUrlSearch`: make url search from params

- `type`: `function`
- `@param params`: params to make

`zzhUtil.makeUrlSearch({key1: 1, key2: 2})` -> `key1=1&key2=2`

## misc

### `zzhUtil.browser`: browsers

- `type`: `map`
- `detail`:
  - `zzhUtil.browser.isMobile`: 是否是移动端
  - `zzhUtil.browser.isWeiXin`: 是否是微信浏览器
  - `zzhUtil.browser.isIos`: 是否是 ios 终端
  - `zzhUtil.browser.isChanZai`: 是否是是否是禅在客户端
  - `zzhUtil.browser.isXiaoMi`: 是否是小米手机
  - `zzhUtil.browser.isHongMi`: 是否是红米手机
  - `zzhUtil.browser.isMiniProgram`: 是否是小程序 web-view（因为 window.\_\_wxjs_environment 值可能还未注入，所以改为使用方法动态判断）
    - `type`: `function`
    - `demo`: `let isMiniProgram = zzhUtil.browser.isMiniProgram()`

### `zzhUtil.reloadTitle`: 重新加载微信浏览器的标题, hack 在微信等 webview 中无法修改 document.title 的情况

- `type`: `function`
- `@param title`: 需要重载的标题

```
zzhUtil.reloadTitle(title);
```
