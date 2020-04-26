import Vue, { VNode } from 'vue';
import App from './key.vue';
import 'normalize.css';

new Vue({
    render: (h): VNode => h(App),
}).$mount('#app');
