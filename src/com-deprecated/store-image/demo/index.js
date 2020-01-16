import 'bootstrap/dist/css/bootstrap.css';
import seeAjax from 'see-ajax';
import StoreImage from '../src';
window.storeImageSaveUrl = (url, successCallback, errorCallback) => {
  setTimeout(() => {
    successCallback('haha');
  }, 1000);
};
seeAjax.setEnv(1);
let content = `
        第一种情况：<img src="https://www.baidu.com/e1a541240552e1547b1304e3c098e1ac.jpg?imageView2/2/w/1080/q/75">
        第二种情况：background-image: url(&quot;http://statics.xiumi.us/stc/images/templates-assets/tpl-paper/image/2017-8-1-8.png&quot;);
        自在家的：<img src="https://pic.zizaihome.com/e1a541240552e1547b1304e3c098e1ac.jpg?imageView2/2/w/1080/q/75">
        第一种情况（空的）：<img src="">
        第二种情况（空的）：background-image: url(&quot;&quot;);
        第一种情况（空格）：<img src="     ">
        第二种情况（空格）：background-image: url(&quot;     &quot;);
        第一种情况（有空格）：<img src="  https://www.baidu.com/e1a541240552e1547b1304e3c098e1ac.jpg?imageView2/2/w/1080/q/75   ">
        第二种情况（有空格）：background-image: url(&quot;   background-image: url(&quot;http://statics.xiumi.us/stc/images/templates-assets/tpl-paper/image/2017-8-1-8.png&quot;);  &quot;);
    `;
console.log('origin content: ');
console.log(content);
new StoreImage(
  content,
  newContent => {
    console.log('handled content: ');
    console.log(newContent);
  },
  (uploaded, total) => {
    console.log(`${uploaded}/${total}`);
  }
);
