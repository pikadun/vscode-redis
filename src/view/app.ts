import Vue, { VNode } from 'vue';
import VueRouter from 'vue-router';
import app from './app.vue';
import 'normalize.css';
import './css/main.css';
import component from './component';
component.install();

Vue.use(VueRouter);

import key from './page/key.vue';
const router = new VueRouter({
    routes: [
        { name: 'key', path: '/key', component: key }
    ]
});

new Vue({
    render: (h): VNode => h(app),
    router
}).$mount('#app');