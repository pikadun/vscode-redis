import 'svelte';
import Route from './component/route.svelte';
import Settings from './page/settings.svelte';
import String from './page/string.svelte';

const app = new Route({
    target: document.body
});

const routeMap = new Map();
routeMap.set('settings', Settings);
routeMap.set('string', String);

if (import.meta.env.MODE === 'production') {
    window.vscode = acquireVsCodeApi();
    window.addEventListener('message', event => {
        const data = event.data;
        if (!data.self) {
            return;
        }
        app.$set({
            component: routeMap.get(data.panelName.toLowerCase()),
            params: data
        });
    });
} else {
    app.$set({
        component: routeMap.get(window.location.pathname.slice(1).toLowerCase())
    });
}