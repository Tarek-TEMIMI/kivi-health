/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web
 * applications using Vue and Laravel.
 */
require('./bootstrap');
require('./flatpickr');

import store from './frontStore'
import router from './front-router'
import Vuelidate from 'vuelidate';
import {BootstrapVue, BSidebar} from 'bootstrap-vue'
import Multiselect from 'vue-multiselect'
window.Vue = require('vue');
import VCalendar from 'v-calendar';
import VueCarousel from 'vue-carousel';
Vue.use(Vuelidate);
Vue.use(VueCarousel);
Vue.use(BootstrapVue);
import VueSweetAlert from 'vue-sweetalert'
import i18n from './i18n'

Vue.component('multi-select', Multiselect)
Vue.use(VCalendar, { componentPrefix: 'vc'});
Vue.component('b-sidebar', BSidebar)
Vue.use(VueSweetAlert)

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// Front-end widgets imports...
Vue.component('book-appointment-widget', require('./components/Widgets/Appointment/BookAppointmentWidget.vue').default);
Vue.component('patient-dashboard-widget', require('./components/Widgets/PatientDashboard/Index').default);
Vue.component('get-front-custom-fields', require('./components/CustomField/FrontWidgetField.vue').default);

Vue.filter('dateFormat', value => {
    return window.moment.utc(value).local().format('h:mm A DD MMM YYYY')
})

Vue.filter('singleDateFormat', value => {

    if (value === null) {
        return  " - ";
    }

    return window.moment.utc(value).local().format('DD MMM YYYY')
})

Vue.filter('singleTimeFormat', value => {
    if (value === null) {
        return  " - ";
    }

    return window.moment(value, 'h:mm A').format('h:mm A')
})

Vue.filter('checkUndefined', value => {
    return value !== undefined ? value : ' - ';
})

Vue.filter('doctorObjectToString', value => {
    let label = "";
    value.map((obj, index) => {
        ++index
        label = label + obj.text;
        if (index !== value.length) {
            label = label + ", "
        }
        return obj;
    });

    return label;
})

Vue.filter('timeObjectToString', value => {
    return value.HH + ":" + value.mm;
});

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

let element = document.getElementById('app');

if (element !== null) {
    window.frontApp = new Vue({
        el: '#app',
        router,
        store,
        data: {
            pluginBASEURL: pluginBASEURL
        },
        i18n,

    })
}
