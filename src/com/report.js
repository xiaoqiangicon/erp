import { init } from '@senntyou/web-monitor-sdk';

if (window.location.href.indexOf('localhost') === -1) {
  init({ server: 'https://monitor.zizaisweet.com' });
}
