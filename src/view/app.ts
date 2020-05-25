import Vue, { VNode } from 'vue';
import app from './app.vue';
import component from './component';
import 'normalize.css';
import './css/main.css';
component.install();

new Vue({
    render: (h): VNode => h(app),
}).$mount('#app');