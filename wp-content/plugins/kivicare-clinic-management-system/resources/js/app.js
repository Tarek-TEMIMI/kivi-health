/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web
 * applications using Vue and Laravel.
 */


import router from "./router";
import store from './store'
import Vuelidate from 'vuelidate';
import {BootstrapVue} from 'bootstrap-vue'
import Multiselect from 'vue-multiselect'
import VueTimepicker from 'vue2-timepicker'
import VCalendar from 'v-calendar';
import VueEditor from "vue2-editor"
import Quill from 'quill';
let AlignStyle = Quill.import('attributors/style/align')
let BackgroundStyle = Quill.import('attributors/style/background')
let ColorStyle = Quill.import('attributors/style/color')
let DirectionStyle = Quill.import('attributors/style/direction')
let FontStyle = Quill.import('attributors/style/font')
let SizeStyle = Quill.import('attributors/style/size')

Quill.register(AlignStyle, true);
Quill.register(BackgroundStyle, true);
Quill.register(ColorStyle, true);
Quill.register(DirectionStyle, true);
Quill.register(FontStyle, true);
Quill.register(SizeStyle, true);
import App from "./App.vue";
import PerfectScrollbar from 'perfect-scrollbar';
import VueGoodTablePlugin from 'vue-good-table';
import JsonCSV from 'vue-json-csv';
import VueExcelXlsx from "vue-excel-xlsx";
import Print from 'vue-print-nb'
import i18n from './i18n'
import { jsPDF } from "jspdf";

// import the styles
import 'vue-good-table/dist/vue-good-table.css'
import {post} from "./config/request";

require('./bootstrap');


window.Vue = require('vue');
window.autoTable = require('jspdf-autotable');
window.PerfectScrollbar = PerfectScrollbar;
Vue.use(Vuelidate);
Vue.use(BootstrapVue);
Vue.use(VueEditor);
Vue.use(VCalendar, { componentPrefix: 'vc'});
Vue.component('vue-timepicker', VueTimepicker);
Vue.component('multi-select', Multiselect);
Vue.use(VueGoodTablePlugin);
Vue.component('downloadCsv', JsonCSV);
Vue.use(Print);
Vue.use(VueExcelXlsx);

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

Vue.component('loader-component-2', require('./components/Partials/Loader').default);

Vue.component('loader-component', require('./components/Loader.vue').default);

Vue.component('appointment-calender', require('./components/appointment/Calender.vue').default);


Vue.component('get-custom-fields', require('./components/CustomField/GetFields.vue').default);
Vue.component('edit-custom-fields', require('./components/CustomField/EditFields.vue').default);

/* Chart js */
Vue.component('weekly-appointment-chart', require('./components/chart/WeeklyAppointmentChart').default);

/* appointment list */

Vue.component('appointment-list', require('./components/appointment/AppointmentList').default);

/* doctor session setting */

Vue.component('doctor-session', require('./components/DoctorSession/DoctorSession').default);

/* Get Help */ 
Vue.component('general-component-help', require('./views/GetHelp/General').default);
Vue.component('google-calendar-help', require('./views/GetHelp/GoogleCalendar').default);
Vue.component('language-help', require('./views/GetHelp/MultiLanguage').default);
Vue.component('sms-help', require('./views/GetHelp/SMS').default);
Vue.component('telemed-help', require('./views/GetHelp/Telemed').default);
Vue.component('shortcode-help', require('./views/GetHelp/Shortcode').default);
Vue.component('woocommerce-help', require('./views/GetHelp/Woocommerce').default);
Vue.component('appointment-help', require('./views/GetHelp/AppointmentHelp.vue').default);
Vue.component('holiday-help', require('./views/GetHelp/Holiday.vue').default);
Vue.component('overlay-message', require('./components/Partials/overlay').default);
Vue.component('module-data-export', require('./components/Partials/ModuleDataExport').default);
Vue.component('module-data-import', require('./components/Partials/ModuleDataImport').default);

Vue.filter('dateFormat', value => {
    return window.moment.utc(value).format('h:mm A DD MMM YYYY')
})


// Vue.filter('singleTimeFormat', value => {

//     if (value === null) {
//         return  " - ";
//     }

//     if(window.request_data !== undefined && window.request_data.appointment_time_format == 'on' ){
//         if(typeof value != "undefined" && value != null && value !== '') {
//             return  moment(value, ["h:mm A"]).format("HH:mm");
//         }
//     }
//     return window.moment(value, 'h:mm A').format('h:mm A')
// })

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

Vue.filter('filterString', value => {

    if (value === "" || value === null || value === undefined) {
        return "";
    }

    value = value.replace('.', ' ');
    value = value.replace('_', ' ');
    return value;
});

Vue.mixin({
    data: () => {
        return {
            clinicAdminName: '',
            doctorRoleName: '',
            patientRoleName: '',
            adminRoleName: '',
            receptionistRoleName: '',
            clinicData: '',
            overlayOpacity:'0',
            requireProVersion : '2.0.2'
        }
    },
    component: {
    },
    mounted() {
        this.adminRoleName = "administrator";
        this.clinicAdminName = window.pluginPREFIX + 'clinic_admin';
        this.doctorRoleName = window.pluginPREFIX + 'doctor';
        this.patientRoleName = window.pluginPREFIX + 'patient';
        this.receptionistRoleName = window.pluginPREFIX + 'receptionist' ;
        this.clinicData = this.singleClinicData ;

        let _this = this;
        setTimeout(() => {
            if(_this.$refs.dataTable) {
                _this.$refs.dataTable.nextText = _this.formTranslation.datatable.next_text;
                _this.$refs.dataTable.prevText = _this.formTranslation.datatable.prev_text;
                _this.$refs.dataTable.rowsPerPageText = _this.formTranslation.datatable.rows_per_page;
                _this.$refs.dataTable.ofText = _this.formTranslation.datatable.of_text;
                _this.$refs.dataTable.allText = _this.formTranslation.datatable.all_text;
                _this.$refs.dataTable.pageText = _this.formTranslation.datatable.page_text;
            }
        }, 1000)
    },
    computed: {
        checkEnableModule: function () {
            return (salut) => {
                const module = this.$store.state.userDataModule.user.module.module_config.filter(thing => thing.name === salut && thing.status === '1');
                if (module.length > 0) {
                    return true ;
                } else {
                    return false ;
                }
            }
        },
        singleClinicData: function () {
            return  this.$store.state.userDataModule.clinic
        },
        currencyData: function () {
            if (this.singleClinicData.extra !== undefined) {
                return JSON.parse(this.singleClinicData.extra);
            }
        },
        formTranslation: function () {
            if(this.$store.state.staticDataModule.langTranslateData !== undefined) {
                return this.$store.state.staticDataModule.langTranslateData ;
            }
        },
        dateFormatValue:function(){
            if(this.$store.state.date_format !== undefined){
                return this.$store.state.date_format
            }
            return 'D-MM-YYYY';
        },
        userDataMix() {
            return this.$store.state.userDataModule.user;
        },
    },
    methods: {
        kcCheckPermission(permissionName) {
            let permission = false;
            const user = this.$store.state.userDataModule.user;

            if (user.permissions !== undefined) {
                let permission_name = window.pluginPREFIX + permissionName

                if (user.permissions[permission_name] !== undefined && (user.permissions[permission_name] === true || user.permissions[permission_name] === 1))
                    permission = true;
            }

            return permission;
        },
        kivicareProFeatureIcon(type,message="") {
            let text = "Pro";
            switch (type) {
                case 'googlemeet':
                case 'telemed':
                case 'razorpay':
                case 'bodyChart':        
                    text = 'Addons';
                    break;
                case 'app':    
                    text = 'App';
                break;

            }
            if( message !== ''){
                text = message;
            }
            return `<span  class="ml-2 badge p-1 kivicare-badge" style="background:#f68685">` + text + `</span>`;
        },
        getUserRole() {
            const user = store.state.userDataModule.user;
            if (user.roles !== undefined) {
                if (user.roles.includes(this.adminRoleName)) {
                    return this.adminRoleName;
                } else if (user.roles.includes(this.clinicAdminName)) {
                    return 'clinic_admin';
                } else if (user.roles.includes(this.doctorRoleName)) {
                    return 'doctor';
                } else if (user.roles.includes(this.patientRoleName)) {
                    return 'patient';
                } else if (user.roles.includes(this.receptionistRoleName)) {
                    return 'receptionist';
                } else {
                    return "";
                }
            }
        },
        changeModuleValueStatus(data){
            let oldValue = '';
            let oldClass = ''
            let checkValue = ''
            if(['doctors','receptionists','patients'].includes(data.module_type)){
                if(data.value == '0'){
                    checkValue = false
                    oldValue = this.formTranslation.common.inactive;
                    oldClass = 'badge badge-danger '
                }else{
                    checkValue = true
                    oldValue = this.formTranslation.common.active;
                    oldClass = 'badge badge-success '
                }
            }else{
                if(data.value == '0'){
                    checkValue = true
                    oldValue = this.formTranslation.common.active;
                    oldClass = 'badge badge-success '
                }else{
                    checkValue = false
                    oldValue = this.formTranslation.common.inactive;
                    oldClass = 'badge badge-danger '
                }
            }
            let ele = $('#status_change_' + data.id);
            let spanEle = $(ele).parent().parent().find('span')
            ele.prop('disabled',true);
            post("change_module_value_status", data)
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        displayMessage(response.data.message);
                        if(data.module_type == 'clinics'){
                            this.$store.dispatch("fetchAllClinic", {self: this})
                        }
                    }else{
                        if(checkValue){
                            $(ele).prop('checked',true);
                        }else{
                            $(ele).prop('checked',false);
                        }
                        spanEle.removeClass().addClass(oldClass).text(oldValue);
                        displayErrorMessage(response.data.message);
                    }
                    ele.prop('disabled',false);
                })
                .catch((error) => {
                    if(checkValue){
                        $(ele).prop('checked',true);
                    }else{
                        $(ele).prop('checked',false);
                    }
                    ele.prop('disabled',false);
                    spanEle.removeClass().addClass(oldClass).text(oldValue);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                    console.log(error);
                });
        },
        kivicareCompareVersion(version1, version2) {

            var result = false;

            if (typeof version1 !== 'object') {
                version1 = version1.toString().split('.');
            }
            if (typeof version2 !== 'object') {
                version2 = version2.toString().split('.');
            }


            for (var i = 0; i < (Math.max(version1.length, version2.length)); i++) {

                if (version1[i] == undefined) {
                    break;
                }
                if (version2[i] == undefined) {
                    version2[i] = 0;
                }

                if (Number(version1[i]) <= Number(version2[i])) {
                    result = true;
                }else{
                    break;
                }
            }

            return (result);
        },
        logout () {},
        // appointmentEndTimeFormat: function (end){
        //     if(window.request_data !== undefined && window.request_data.appointment_time_format == 'on' ){
        //         if(typeof end != "undefined" && end != null && end !== '') {
        //             return  moment(end, ["h:mm A"]).format("HH:mm");
        //         }
        //     }
        //     return end;
        // },
        // singleDateFormat(value){
        //     if (value === null || value === '' || value === undefined) {
        //         return  " - ";
        //     }
        //     return window.moment.utc(value).format(this.dateFormatValue)
        // },
        formatJsonAppointmentData(data){
            var _this = this;
            return data.map(function(val){
                return Object.keys(val).reduce((acc, elem) => {
                    switch (elem){
                        case 'all_service_charges':
                            acc[_this.formTranslation.service.charges] = val['clinic_prefix'] + val[elem] + val['clinic_postfix']
                            break;
                        case 'status':
                            let status = '';
                            switch (val[elem].toString()){
                                case '0':
                                    status = _this.formTranslation.appointments.cancelled;
                                    break;
                                case '1':
                                    status = _this.formTranslation.appointments.booked;
                                    break;
                                case '2':
                                    status = _this.formTranslation.appointments.arrived;
                                    break;
                                case '3':
                                    status = _this.formTranslation.appointments.check_out;
                                    break;
                                case '4':
                                    status = _this.formTranslation.appointments.check_in;
                                    break;
                            }
                            acc[_this.formTranslation.patient_bill.plh_status] = status;
                            break;
                        case 'appointment_start_date':
                            acc[_this.formTranslation.appointments.plh_date] =val[elem]
                            break;
                        case 'appointment_start_time':
                            acc[_this.formTranslation.common.time] = val[elem]
                            break;
                        case 'appointment_report':
                            acc[_this.formTranslation.reports.reports] = val[elem]
                            break;
                        case 'all_services':
                            acc[_this.formTranslation.patient_bill.plh_service] = val[elem]
                            break;
                        default:
                            if(!['appointment_end_date','appointment_end_time',
                                'type_label','encounter_id','zoom_data','clinic_prefix',
                                'clinic_postfix','video_consultation','descriptionEnable',
                                'visit_type_old','isEditAble','clinic_extra' ,'visit_type','custom_fields', 'clinic_id',
                                'doctor_id','patient_id','encounter_detail'].includes(elem)){
                                acc[elem] = val[elem]
                            }
                            break;
                    }
                    return acc;
                }, {});
            })
        },
        printPdfFromArray(data,type){
            var head = []
            var body = [];
            data.map(function(val){
                head = Object.keys(val)
                body.push(Object.values(val))
            });
            var doc = new jsPDF();
            let width = doc.internal.pageSize.getWidth()
            var header = function (data) {
                doc.setFontSize(18);
                doc.setTextColor(40);
                // doc.setFontStyle('normal');
                doc.text(type, (width - (data.settings.margin.left +  data.settings.margin.right))/2, 10);
            };
            doc.autoTable({
                headStyles: {
                    fillColor: window.request_data.proActive ? this.userDataMix.theme_color : '#4874dc',
                },
                StyleDef:{
                    overflow:'linebreak',
                },
                head: [head],
                body: body,
                // split overflowing columns into pages
                horizontalPageBreak: true,
                // repeat this column in split pages
                // horizontalPageBreakRepeat: 0,
                didDrawPage: header
            })
            doc.save(type+'_'+ window.moment.utc(new Date()).format('D-MM-YYYY') +'.pdf');
        }
    }
})

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
let element = document.getElementById('app');

if (element !== null) {
    window.vm = new Vue({
        router,
        store,
        i18n,
        render: h => h(App)
    }).$mount('#app');
}
