import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from "./views/Dashboard/Index";
import AppointmentQueueList from "./views/Dashboard/AppointmentList";
import ERROR403 from "./views/Errors/403";

// Import for the setup wizard...
import SetupWizard from "./views/SetupWizard/Index";

// Import for static data module...
import StaticDataList from "./views/StaticData/Index";
import StaticDataCreate from "./views/StaticData/Create";

// Import for static data module...
import ServiceList from "./views/Service/Index";
import ServiceCreate from "./views/Service/Create";

// Import for the Doctors module...
import DoctorList from './views/Doctor/Index';
import DoctorCreate from './views/Doctor/Create';
import DoctorProfile from './views/Doctor/Profile';

// Import for the Patient module...
import PatientList from './views/Patient/Index';
import PatientCreate from './views/Patient/Create';
import PatientProfile from './views/Patient/Profile';
import PatientProfileView from './views/Patient/ProfileView';
import PatientSetting from './views/Patient/UniqueIdSetting';

// Import for the widget setting module...
import WidgetSetting from './views/WidgetSetting/WidgetSetting';

// Import for the Doctors module...
import ClinicList from './views/Clinic/Index';
import ClinicCreate from './views/Clinic/Create';
import ClinicProfile from './views/Clinic/Profile';
import Update from "./components/Update";

import CommanSetting from './views/ProSetting/CommanSetting'
import LanguageSetting from './views/ProSetting/LanguageSetting'

// Import for the Appointment module...
import AppointmentCreate from './views/Clinic/Create';

// Import for the Patient encounter module...
import PatientEncounterList from './views/PatientEncounter/Index';
import PatientEncounterCreate from './views/PatientEncounter/Create';
import PatientEncounterDashboard from './views/PatientEncounter/Dashboard';

// Import for the Receptionist
import ReceptionistList from './views/Receptionist/Index';
import ReceptionistCreate from './views/Receptionist/Create';
import ReceptionistProfile from './views/Receptionist/Profile';


// Import for the Billing records module...
import CustomFieldList from './views/CustomField/Index';
import CustomFieldCreate from './views/CustomField/Create';

// Import for the Terms & Condition  module...
import TermsConditionCreate from './views/TermsCondition/Create';

// Import for the Clinic Schedule  module...
import ClinicScheduleSettingList from './views/ClinicScheduleSetting/Index';
import ClinicScheduleSettingCreate from './views/ClinicScheduleSetting/Create';

// Import for the Notification module...
import NotificationSetting from './views/Notification/Email/Create';
import SMSTemplate from './views/Notification/SMS/Create'
import store from "./store";

// Import for the Common Setting module...
import CommonSetting from "./views/CommonSetting/Create";
import AppConfig from "./views/Settings/AppConfig";

// Import for General settings module...
import Settings from "./views/Settings/Index"

// Import for Payment setting module 
import Payment from "./views/Payment/Index"

// Import for Payment setting module
import RestrictAppointment from "./views/Settings/AppointmentSetting"

// Import for Payment setting module
import GeneralSetting from "./views/Settings/GeneralSetting"

// Import for Payment setting module
import GoogleMeet from "./views/Telemed/GoogleMeetConfiguration"

// Import for permission setting module
import PermissionSetting from './views/Settings/PermissionSetting'

//Import for sidebar dashboard module
import DashboardSidebarSetting from './views/Settings/DashboardSidebarSetting'

// Import for the Change password module...
import ChangePassword from "./views/ChangePassword/Create";

// Import for the Setup wizard step...
import SetupStep1 from "./views/SetupWizard/setupStep1";
import ModuleConfig from "./views/SetupWizard/moduleConfig";
import SetupStep2 from "./views/SetupWizard/setupStep2";
import SetupStep3 from "./views/SetupWizard/setupStep3";
import SetupStep4 from "./views/SetupWizard/setupStep4";
import SetupStep5 from "./views/SetupWizard/setupStep5";
import ClinicAdmin from "./views/SetupWizard/clinicAdmin";

// Import for All the Appointment List
import AllAppointmentList from "./views/Appointment/AllAppointment";
import AppointmentDataList from  "./views/Appointment/AllappointmentList"

// Import for the Doctor Session
import DoctorSession from "./views/DoctorSession/Create"

// Import for the All Appointment List
import ZoomConfiguration from "./views/Telemed/ZoomConfiguration";

import Loading from 'vue-loading-overlay';
import PatientMedicalReport from './views/Patient/Report'
import BillingRecord from './views/BillingRecord/Index'
import RevenuReport from './views/Reports/RevenuReport'
import GoogleCalender from './views/GoogleEvent/GoogleCalender'
import GoogleMeetConfig from './views/Telemed/GoogleMeet'
import ZoomOAuth from './views/Telemed/ZoomOAuth'
import ZoomOAuthConfig from "./views/Telemed/ZoomOAuthConfig"

import GoogleEventTemplate from './views/GoogleEvent/Create'
// Import stylesheet

import TaxList from './views/Tax/Index.vue'
import TaxCreate from './views/Tax/Create'

import GetHelp from './views/GetHelp/Index'
import GetPro from './views/GetPro/Index'
import 'vue-loading-overlay/dist/vue-loading.css';

import PatientClinic from './views/Patient/PatientClinic';
import CustomNotification from './views/Notification/Custom/Index';
import CustomForm from './views/CustomForm/Index.vue';
import CustomFormCreate from './views/CustomForm/Create.vue';

//body chart addons
import BodyChartSetting from './views/BodyChart/Setting';
import BodyChartIndex from './views/BodyChart/Index';
import BodyChartCreate from './views/BodyChart/Create';

Vue.use(Loading);
Vue.use(VueRouter)

const routes = [

    { path: '/', name: 'dashboard', component: Dashboard, meta : { label: 'Home' }},
    { path: '/appointment-list', name: 'appointment-list', meta: { label: 'Appointments' }, component: AppointmentQueueList },
    {
        path: '/setup',
        name: 'setup',
        meta: {
            setup: true,
            fullPage: true
        },
        component: SetupWizard,
        children: [
            {
                path: '/setup/step-1',
                name: 'setup.step1',
                meta: {
                    setup: true,
                    fullPage: true
                },
                component: SetupStep1
            },
            {
                path: '/setup/step-2',
                name: 'setup.step2',
                meta: {
                    setup: true,
                    fullPage: true
                },
                component: ModuleConfig
            },
            {
                path: '/setup/step-3',
                name: 'setup.step3',
                meta: {
                    setup: true,
                    fullPage: true
                },
                component: SetupStep2
            },
            {
                path: '/setup/clinic/admin',
                name: 'setup.clinic.admin',
                meta: {
                    setup: true,
                    fullPage: true
                },
                component: ClinicAdmin
            },
            {
                path: '/setup/step-4',
                name: 'setup.step4',
                meta: {
                    setup: true,
                    fullPage: true
                },
                component: SetupStep3
            },
            {
                path: '/setup/step-5',
                name: 'setup.step5',
                meta: {
                    setup: true,
                    fullPage: true
                },
                component: SetupStep4
            },
            {
                path: '/setup/step-6',
                name: 'setup.step6',
                meta: {
                    setup: true,
                    fullPage: true
                },
                component: SetupStep5
            },
        ]
    },

    { path: '/403', name: '403', component: ERROR403, meta: { fullPage: true } },
    { path: '/update', name: 'update', component: Update },
    // Routes for the Static data module...
    { path: '/static-data', name: 'static-data', component: StaticDataList, meta: { label:'Static Data', permission: 'static_data_list', module: 'static_data' } },
    { path: '/static-data/create', name: 'static-data.create', component: StaticDataCreate, meta: { label:'Add Static Data', permission: 'static_data_add', module: 'static_data' } },
    { path: '/static-data/edit/:id', name: 'static-data.edit', component: StaticDataCreate, meta: { label:'Edit Static Data', permission: 'static_data_edit', module: 'static_data' } },

    // Routes for the Static data module...
    { path: '/service', name: 'service', component: ServiceList, meta: { label:'Services', permission: 'service_list', module: 'service'  } },
    { path: '/service/create', name: 'service.create', component: ServiceCreate, meta: { label:'Add Service', permission: 'service_add' , module: 'service' } },
    { path: '/service/edit/:id', name: 'service.edit', component: ServiceCreate, meta: { label:'Edit Service', permission: 'service_edit', module: 'service'  } },

    // Routes for the doctor module...
    { path: '/doctor', name: 'doctor', component: DoctorList, meta: { label:'Doctors', permission: 'doctor_list', module: 'doctor' } },
    { path: '/doctor/create', name: 'doctor.create', component: DoctorCreate, meta: { label:'Add Doctor', permission: 'doctor_add', module: 'doctor' } },
    { path: '/doctor/edit/:id', name: 'doctor.edit', component: DoctorCreate, meta: { label:'Edit Doctor', permission: 'doctor_edit', module: 'doctor' } },
    { path: '/doctor/profile', name: 'doctor.profile', component: DoctorProfile, meta: { label:'Profile', permission: 'doctor_profile', module: 'doctor' } },
    { path: '/doctor/zoom-configuration', name: 'doctor.zoom-configuration', component: ZoomConfiguration, meta: { label:'Zoom configuration', permission: 'doctor_profile', module: 'doctor' } },

    // Routes for the Receptionist module...
    { path: '/receptionist', name: 'receptionist', component: ReceptionistList, meta: { label:'Receptionists', permission: 'receptionist_list', module: 'receptionist', dynamicModule: 'receptionist' } },
    { path: '/receptionist/create', name: 'receptionist.create', component: ReceptionistCreate, meta: { label:'Add Receptionist', permission: 'receptionist_add', module: 'receptionist', dynamicModule: 'receptionist' } },
    { path: '/receptionist/edit/:id', name: 'receptionist.edit', component: ReceptionistCreate, meta: { label:'Edit Receptionist', permission: 'receptionist_edit', module: 'receptionist', dynamicModule: 'receptionist'  } },
    { path: '/receptionist/profile/', name: 'receptionist.profile', component: ReceptionistProfile, meta: { label:'Profile', permission: 'receptionist_profile', module: 'receptionist', dynamicModule: 'receptionist'  } },

    // Routes for the patient module...
    { path: '/patient', name: 'patient', component: PatientList, meta: { label: 'Patients' ,permission: 'patient_list' } },
    { path: '/patient/create', name: 'patient.create', component: PatientCreate, meta: { label:'Add Patient', permission: 'patient_add', module: 'patient' } },
    { path: '/patient/edit/:id', name: 'patient.edit', component: PatientCreate, meta: { label:'Edit Patient', permission: 'patient_edit', module: 'patient' } },
    { path: '/patient/profile', name: 'patient.profile', component: PatientProfile, meta: { label:'Profile', permission: 'patient_profile', module: 'patient' }},
    { path: '/patient/profile-view/:id', name: 'patient-profile-view', component: PatientProfileView, meta: { label: 'Patients',permission: 'patient_edit', module: 'patient' } },

    // Routes for the clinic module...
    { path: '/clinic', name: 'clinic', component: ClinicList, meta: { label:'Clinics', permission: 'clinic_list', module: 'clinic'  } },
    { path: '/clinic/create', name: 'clinic.create', component: ClinicCreate, meta: { label:'Add Clinic', permission: 'clinic_add', module: 'clinic' } },
    { path: '/clinic/edit/:id', name: 'clinic.edit', component: ClinicCreate, meta: { label:'Edit Clinic', permission: 'clinic_edit', module: 'clinic' } },
    { path: '/clinic/profile', name: 'clinic.profile', component: ClinicProfile, meta: { label:'Profile', permission: 'clinic_edit', module: 'clinic' } },

    // Routes for the Appointment module...
    { path: '/appointment-list', name: 'appointment', component: AppointmentQueueList, meta: { label:'Appointments', permission: 'appointment_list', module: 'appointment' } },
    { path: '/appointment/create', name: 'appointment.create', component: AppointmentCreate, meta: { label:'Add Appointments',permission: 'appointment_add', module: 'appointment' } },
    { path: '/appointment/edit/:id', name: 'appointment.edit', component: AppointmentCreate, meta: { label:'Edit Appointments', permission: 'appointment_edit', module: 'appointment' } },

    // Routes for the Appointment module...
    { path: '/custom-field', name: 'custom-field', component: CustomFieldList, meta: { label:'Custom Fields', permission: 'custom_field_list', dynamicModule: 'custom_fields', module: 'custom_fields' } },
    { path: '/custom-field/create', name: 'custom-field.create', component: CustomFieldCreate, meta: { label:'Add Custom Fields', permission: 'custom_field_add', dynamicModule: 'custom_fields', module: 'custom_fields' } },
    { path: '/custom-field/edit/:id', name: 'custom-field.edit', component: CustomFieldCreate, meta: { label:'Edit Custom Fields', permission: 'custom_field_edit', dynamicModule: 'custom_fields', module: 'custom_fields' } },

    // Routes for the Patient encounter module...
    { path: '/patient-encounter/:patient_id', name: 'patient-encounter', component: PatientEncounterList, meta: { label:'Encounters', permission: 'patient_encounter_list', module: 'patient' } },
    { path: '/encounter-list', name: 'encounter-list', component: PatientEncounterList, meta: { label:'Encounters', permission: 'patient_encounter_list', module: 'patient_encounter' } },
    { path: '/encounter-template-list', name: 'encounter-template', component: PatientEncounterList, meta: { label:'Encounters', permission: 'encounters_template_list', module: 'encounter_template' } },
    { path: '/encounters/:patient_id', name: 'encounters', component: PatientEncounterList, meta: { label:'Encounters', permission: 'patient_encounter_view', module: 'patient' } },
    { path: '/patient-encounter/create/:patient_id', name: 'patient-encounter.create', component: PatientEncounterCreate, meta: { label:'Add Encounters', permission: 'patient_encounter_add', module: 'patient' } },
    { path: '/patient-encounter/edit/:id', name: 'patient-encounter.edit', component: PatientEncounterCreate, meta: { label:'Edit Encounters', permission: 'patient_encounter_edit', module: 'patient' } },
    {
        path: '/patient-encounter/dashboard/:encounter_id',
        name: 'patient-encounter.dashboard',
        component: PatientEncounterDashboard,
        meta: { label:'Encounter Dashboard', permission: 'patient_encounter_view' , module: 'patient_encounter_list'},
    },
    {
        path: '/patient-encounter/body-chart/:encounter_id',
        name: 'patient-encounter.body-chart',
        component: BodyChartIndex,
        meta: { label:'Encounter Body chart list', permission: 'body_chart_list' , module: 'patient_encounter_list'},
    },

    {
        path: '/patient-encounter/body-chart/create/:encounter_id',
        name: 'patient-encounter.body-create',
        component: BodyChartCreate,
        meta: { label:'Encounter Body chart create', permission: 'body_chart_add' , module: 'patient_encounter_list'},
    },
    {
        path: '/patient-encounter/body-chart/edit/:body_chart_id',
        name: 'patient-encounter.body-edit',
        component: BodyChartCreate,
        meta: { label:'Encounter Body chart edit', permission: 'body_chart_edit' , module: 'patient_encounter'},
    },
    // Routes for the Terms & Condition module...
    { path: '/terms-condition/create', name: 'terms-condition.create', component: TermsConditionCreate, meta: { label: 'Terms & Condition' } },

    // Routes for the Clinic Schedule module...

    { path: '/common-settings/create', name: 'common-settings.create', component: CommonSetting, meta: { label: 'Configuration' } },

    // Routes for the Settings module...

    {
        path: '/settings',
        name: 'settings.index',
        component: Settings, meta: { label: 'General Settings',  permission: 'settings', module: 'settings' },
        children: [
            {
                path: '/setting/general',
                name: 'setting.general',
                component: ClinicProfile,
                meta: { module: 'general_settings', permission: 'settings' }
            },
            {
                path: '/setting/patient-setting',
                name: 'setting.patient_setting',
                component: PatientSetting,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/setting/widget-setting',
                name: 'setting.widget_setting',
                component: WidgetSetting,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/setting/comman-settings',
                name: 'setting.comman_settings',
                component: CommanSetting,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/setting/language-settings',
                name: 'setting.language_settings',
                component: LanguageSetting,
                meta: { module: 'language_settings', permission: 'settings' }
            },
            {
                path: '/setting/google_calender',
                name: 'setting.google_calender',
                component: GoogleCalender,
                meta: { module: 'google_calender', permission: 'settings' }
            },
            {
                path: '/setting/google_meet_config',
                name: 'setting.google_meet_config',
                component: GoogleMeetConfig,
                meta: { module: 'google_meet_config', permission: 'settings' }
            },
            {
                path: '/setting/session',
                name: 'doctor.session.setting',
                component: DoctorSession,
                meta: { module: 'doctor_session', permission: 'settings' }
            },
            {
                path: '/setting/telemed',
                name: 'doctor.telemed.setting',
                component: ZoomConfiguration,
                meta: { module: 'telemed', permission: 'settings' }
            },
            {
                path: '/clinic/schedule',
                name: 'clinic.schedule',
                component: ClinicScheduleSettingList,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/configuration',
                name: 'clinic.configuration',
                component: CommonSetting,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/app-config',
                name: 'app-config',
                component: AppConfig,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/email/template',
                name: 'email.template',
                component: NotificationSetting,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/sms/template',
                name: 'sms.template',
                component: SMSTemplate,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/custom-notification',
                name: 'custom_notification',
                component: CustomNotification,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/custom-form',
                name: 'custom_form',
                component: CustomForm,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/body-chart-setting',
                name: 'body_chart_setting',
                component: BodyChartSetting,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/google/event/template',
                name: 'google.event.template',
                component: GoogleEventTemplate,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/terms-condition',
                name: 'terms.condition',
                component: TermsConditionCreate,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/static-data/list',
                name: 'static.data',
                component: StaticDataList,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/custom-fields',
                name: 'custom.field',
                component: CustomFieldList,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/payment',
                name: 'payment.setting',
                component: Payment,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/appointment-setting',
                name: 'setting.appointment-setting',
                component: RestrictAppointment,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/general-setting',
                name: 'setting.general-setting',
                component: GeneralSetting,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/googlemeet',
                name: 'setting.googlemeet',
                component: GoogleMeet,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/zoom-telemed',
                name: 'setting.telemed',
                component: ZoomOAuthConfig,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/setting/patient-setting',
                name: 'setting.patient_setting',
                component: PatientSetting,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/permission-setting',
                name: 'setting.permission-setting',
                component: PermissionSetting,
                meta: { module: 'settings', permission: 'settings' }
            },
            {
                path: '/dashboard-sidebar-setting',
                name: 'setting.dashboard-sidebar-setting',
                component: DashboardSidebarSetting,
                meta: { module: 'settings', permission: 'settings' }
            },
        ]
    },

    { path: '/custom-form/create',
        name: 'custom-form.create',
        component: CustomFormCreate,
        meta: { module: 'custom-form', permission: 'custom_form_add' }
    },
    { path: '/custom-form/edit/:id',
        name: 'custom-form.edit',
        component: CustomFormCreate,
        meta: { module: 'custom-form', permission: 'custom_form_add' }
    },
    // Routes for doctor change password...
    { path: '/account-setting/change-password', name: 'account-setting.password', component: ChangePassword, meta: { label: 'Change Password',  permission: 'change_password' } },

    // Routes for the Clinic Schedule module...
    { path: '/clinic-schedule/', name: 'clinic-schedule', component: ClinicScheduleSettingList, meta: { label: 'Holidays', module: 'clinic_schedule'} },
    { path: '/clinic-schedule/create', name: 'clinic-schedule.create', component: ClinicScheduleSettingCreate, meta: { label: 'Add Holiday', module: 'clinic_schedule'} },
    { path: '/clinic-schedule/edit/:id', name: 'clinic-schedule.edit', component: ClinicScheduleSettingCreate, meta: { label: 'Edit Holiday', module: 'clinic_schedule'} },

    // Router for Doctor Session module....
    { path: '/doctor-session', name: 'doctor-session.create', component: DoctorSession, meta: { label: 'Doctor Session', module: 'doctor_session'}},
    { path: '/doctor-session/:id', name: 'doctor-session.create', component: DoctorSession, meta: { label: 'Doctor Session', module: 'doctor_session'}},
    { path: '/notification/create', name: 'notification.create', component: NotificationSetting, meta: { label: 'Notification' }},

    // Routes for patient appointment
    { path: '/all-appointment', name: 'all-appointment', component: AllAppointmentList, meta: { label: 'Appointments' }},
    { path: '/all-appointment-list', name: 'appointment-list.index', component: AppointmentDataList, meta: { label: 'Appointments',module: 'appointment_list'}},
    { path: '/patient-appointment-list/:patient_id', name: 'patient-appointment-list', component: AppointmentDataList, meta: { label: 'Appointments',module: 'appointment_list'}},
    // patient_id
    { path: '/patient-medical-report_id/:patient_id', name: 'patient-medical-report_id',component: PatientMedicalReport, meta: { label: 'Patient Medical Report',module: 'patient'}},
    { path: '/patient-medical-report/:encounter_id', name: 'patient-medical-report',component: PatientMedicalReport, meta: { label: 'Patient Medical Report'}},
    
    { path: '/billings', name: 'billings', component: BillingRecord, meta: { label: 'Billing Records'}},

    { path: '/clinic-revenue-report', name: 'clinic-revenue-reports', component: RevenuReport, meta: { label: 'Revenue Reports'}},
   
    { path: '/help', name: 'get_help', component: GetHelp, meta: { label: 'Get help'}},
    { path: '/pro', name: 'get_pro', component: GetPro, meta: { label: 'Get pro'}},
    
    //patient clinic change
    { path: '/patient-clinic', name: 'patient-clinic', component: PatientClinic, meta: { label: 'Patient Clinic'}},

    // Routes for the Clinic Schedule module...
    { path: '/tax', name: 'tax', component: TaxList, meta: { label: 'Taxes', module: 'tax'} },
    { path: '/tax/create', name: 'tax.create', component: TaxCreate, meta: { label: 'Add Tax', module: 'tax'} },
    { path: '/tax/edit/:id', name: 'tax.edit', component: TaxCreate, meta: { label: 'Edit Tax', module: 'tax'} },

];


const router = new VueRouter({
    // base: 'kivicare/wp-admin/admin.php?page=dashboard/',
    // mode: 'history',
    routes,
})

let loader = null;

router.beforeEach((to, from, next) => {
    let user = store.state.userDataModule.user;

    if (window.innerWidth < 1500) {
        store.commit('TOGGLE_SIDEBAR', false)
    }
    else
    {
        // store.commit('TOGGLE_SIDEBAR', true)
    }
    if (user.ID === undefined) {
        store.dispatch("userDataModule/fetchUserData").then(r => {
            const user = store.state.userDataModule.user;
            // store.dispatch("fetchAllClinic", {self: this})
            if(user !== undefined && user.addOns.kiviPro !== undefined && user.addOns.kiviPro == true){
                store.dispatch("fetchAllClinic", {self: this})
            }else{
                store.dispatch("fetchAllClinic", {self: this})
            }
            routerValidation(to, user, next).then(() => store.commit('TOGGLE_LOADER', false));
        });
    } else {
        routerValidation(to, user, next).then(() => store.commit('TOGGLE_LOADER', false));
    }
    
})
router.afterEach((to, from) => {
    setTimeout(() => {
        // loader.hide()
    },1300)
});
const routerValidation = async (to, user, next) => {

    if (to.meta.setup !== undefined && to.meta.setup) {

        const step_config = user.step_config.filter(step => {

            if (to.name === step.routeName && !step.completed) {
                return true;
            } else {
                return false;
            }
        });

        if (step_config.length > 0) {

            const routeObj = user.step_config.filter(step => { return !step.completed });
            if (routeObj.length > 0) {
                if (routeObj[0].routeName !== to.name) {
                    next({ name: routeObj[0].routeName })
                } else {
                    next()
                }
            } else {
                next();
            }

        } else {
            const step_config = user.step_config.filter(step => {
                if (!step.completed) {
                    return true;
                } else {
                    return false;
                }
            });
            if (step_config.length > 0) {
                next();
            } else {
                next({ name: "dashboard" });
            }
        }

    } else if (to.meta.dynamicModule !== undefined) {

        const module = store.state.userDataModule.user.module.module_config.filter(thing => thing.name === to.meta.dynamicModule && thing.status === '1');

        if (module !==undefined && module.length > 0) {
            next()
        } else {
            next({ name: "dashboard" });
        }

    } else {

        if (user.step_config !== undefined) {
            const step_config = user.step_config.filter(step => { return !step.completed });

            if (step_config.length > 0) {
                next({ name: step_config[0].routeName })
            } else {

                if (to.meta.permission !== undefined) {

                    let permission = false;

                    if (user.permissions !== undefined) {

                        let permission_name = window.pluginPREFIX + to.meta.permission

                        if (user.permissions[permission_name] !== undefined && (user.permissions[permission_name] === true || user.permissions[permission_name] === 1)) {
                            permission = true;
                        }

                    } else {
                        if (JSON.stringify(user) === '{}') {
                            permission = true;
                        }
                    }

                    if (permission === false) {
                        next({ name: '403' });
                    } else {
                        next()
                    }

                } else {
                    next()
                }
            }
        }
    }

}

export default router
