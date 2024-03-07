import '@/assets/styles.scss';
import '@/assets/main.css';

import Tailwind from '@/presets/tailwind';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';

import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Toolbar from 'primevue/toolbar';

import App from './App.vue'
import router from './router'

const app = createApp(App);

app.component('Button', Button);
app.component('Checkbox', Checkbox);
app.component('Column', Column);
app.component('ConfirmDialog', ConfirmDialog);
app.component('DataTable', DataTable);
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.component('InputNumber', InputNumber);
app.component('InputSwitch', InputSwitch);
app.component('InputText', InputText);
app.component('Toolbar', Toolbar);

app.use(PrimeVue, {
    ripple: true,
    unstyled: true,
    pt: Tailwind
});

app.use(createPinia())
app.use(router)

app.mount('#app')
