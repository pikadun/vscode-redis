import Vue, { VNode } from 'vue';
import VueRouter from 'vue-router';
import app from './app.vue';
import 'normalize.css';
import './css/main.css';
import component from './component';
component.install();

//#region Routes

// Note: should use vue-router@3.0.x
Vue.use(VueRouter);

import key from './page/key.vue';
const router = new VueRouter({
    routes: [
        { name: 'key', path: '/key/:key', component: key }
    ]
});

//#endregion
new Vue({
    render: (h): VNode => h(app),
    router
}).$mount('#app');