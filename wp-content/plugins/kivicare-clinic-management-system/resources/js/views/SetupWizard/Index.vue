<template>
    <b-container>
        <b-row>
            <b-col sm="12" md="12" lg="12" class=" my-4">
                <img :src="logoURL" class="d-block mx-auto" height="80" alt="...">
            </b-col>

            <b-col sm="12" md="12" lg="12" class="float-right">
                <SetupWizard />
            </b-col>
        </b-row>
        <Footer/>
    </b-container>
</template>

<script>

import setupStep1 from './setupStep1.vue'
import setupStep2 from './setupStep2.vue'
import setupStep3 from './setupStep3.vue'
import setupStep4 from './setupStep4.vue'
import setupStep5 from './setupStep5.vue'
import moduleConfig from "./moduleConfig";
import {get, post} from "../../config/request";
import SetupWizard from "./SetupWizard";
import Footer from "../../components/Partials/Footer";

export default {
    name: 'clinicSetup',
    components: {
        SetupWizard,
        Footer
    },
    data() {
        return {
            logoURL: '',
            clinicSetupSteps: [
                {
                    icon: 'description',
                    name: 'first',
                    title: 'Steps',
                    subtitle: 'Step detail',
                    component: setupStep1,
                    completed: true
                },
                {
                    icon: 'settings',
                    name: 'second',
                    title: 'Modules',
                    subtitle: 'Module Configuration',
                    component: moduleConfig,
                    completed: false
                },
                {
                    icon: 'local_hospital',
                    name: 'third',
                    title: 'Clinic',
                    subtitle: 'Clinic detail',
                    component: setupStep2,
                    completed: false
                },
                {
                    icon: 'account_circle',
                    name: 'forth',
                    title: 'Doctors',
                    subtitle: 'Doctors Detail',
                    component: setupStep3,
                    completed: false
                },
                {
                    icon: 'query_builder',
                    name: 'fifth',
                    title: 'Timing',
                    subtitle: 'Clinic Session',
                    component: setupStep4,
                    completed: false
                }
            ],
            extraModule: {
                'receptionist': {
                    icon: 'query_builder',
                    name: 'six',
                    title: 'Receptionist',
                    subtitle: 'Receptionist Detail',
                    component: setupStep5,
                    completed: false
                }
            },
            stepStatus: {},
            currentActiveStep: {
                index: 1,
                name: "second"
            },
            moduleList: []
        }
    },
    mounted() {
        if (this.$route.name === 'setup') {
            this.$router.push({ name: 'setup.step1' });
        }
        this.init();
    },
    methods: {
        init: function () {
            this.logoURL = window.request_data.kiviCarePluginURL + 'assets/images/logo-banner.png';
            this.getModules();
        },
        defaultSetupSteps: function () {
            return {}
        },
        dbStatusUpdate: function () {
        },
        finishSetup: function (value) {
            post('setup_finish', {})
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        localStorage.setItem('setup_status', true);
                        this.$emit('visible', true)
                        setTimeout(function () {
                            location.reload();
                        }, 1000);
                        displayMessage(response.data.message);
                    } else {
                        displayErrorMessage(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                    displayErrorMessage('Internal server error')
                })
        },
        getModules: function () {
            get('module_list', {})
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        let modules_data = response.data.data;
                        this.removeDisableModule(modules_data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage('Internal server error')
                })
        },
        removeDisableModule: function (modules) {
            if (modules.module_config !== undefined) {
                if (modules.module_config[0].name === 'receptionist' && modules.module_config[0].status === '0') {
                    this.clinicSetupSteps.splice(5, 1);
                }
                if (modules.module_config[0].name === 'receptionist' && modules.module_config[0].status === '1') {
                    let result = this.clinicSetupSteps.filter(item => item.name === 'six');
                    if (result === undefined || result.length === 0) {
                        this.clinicSetupSteps.push(this.extraModule.receptionist);
                    }
                }
            }
        }
    }
}
</script>