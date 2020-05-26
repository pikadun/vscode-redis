import Vue from 'vue';
import RInput from './input.vue';
import RTable from './table.vue';
import RButton from './button.vue';
import RDialog from './dialog.vue';

class Component {
    install(): void {
        Vue.component('RInput', RInput);
        Vue.component('RTable', RTable);
        Vue.component('RButton', RButton);
        Vue.component('RDialog', RDialog);
    }
}

export default new Component();