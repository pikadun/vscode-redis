import 'svelte';
import Route from './component/route.svelte';
import Settings from './page/settings.svelte';
import String from './page/string.svelte';
import Hash from './page/hash.svelte';
import List from './page/list.svelte';
import Set from './page/set.svelte';
import ZSet from './page/zset.svelte';
import Stream from './page/stream.svelte';

// Get color theme.
window.color = document.body.classList[0];

const app = new Route({
    target: document.body
});

const routeMap = new Map();
routeMap.set('settings', Settings);
routeMap.set('string', String);
routeMap.set('hash', Hash);
routeMap.set('list', List);
routeMap.set('set', Set);
routeMap.set('zset', ZSet);
routeMap.set('stream', Stream);

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
