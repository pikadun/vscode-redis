import Vue, { VNode } from 'vue';
import VueRouter from 'vue-router';
import app from './app.vue';
import './css/main.css';
import component from './component';
component.install();

//#region Routes
Vue.use(VueRouter);

import key from './page/key.vue';
import connection from './page/connection.vue';
import { RedisPanel } from 'src/abstraction/enum';
const router = new VueRouter({
    routes: [
        { name: RedisPanel.KEY_INFO, path: '/key/:key', component: key },
        { name: RedisPanel.CONNECTION, path: '/connection', component: connection }
    ]
});

//#endregion
if (process.env.NODE_ENV !== 'development') {
    Vue.prototype.vscode = acquireVsCodeApi();
}

new Vue({
    render: (h): VNode => h(app),
    router
}).$mount('#app');