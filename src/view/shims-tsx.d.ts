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
}