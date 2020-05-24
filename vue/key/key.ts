import Vue, { VNode } from 'vue';
import key from './key.vue';
import 'normalize.css';
import '../css/main.css';

new Vue({
    render: (h): VNode => h(key),
}).$mount('#app');
