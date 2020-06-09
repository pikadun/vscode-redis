/* eslint-disable */
import Vue, { VNode } from 'vue';

declare global {
    namespace JSX {
        type Element = VNode;
        type ElementClass = Vue;
        interface IntrinsicElements {
            [elem: string]: object;
        }
    }
    function acquireVsCodeApi(): void;
}

declare module 'vue/types/vue' {
    interface Vue {
        vscode: {
            postMessage(args?: any): void;
        }
    }
}