import Vue from 'vue';
import ElementUI from 'element-ui';
import './assets/style/base.scss';
import './assets/style/ali.css';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
});