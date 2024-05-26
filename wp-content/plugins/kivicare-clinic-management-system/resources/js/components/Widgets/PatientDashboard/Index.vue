<template>
    <div>
        <div v-if="userRole == 'kiviCare_patient' || !userRole">
            <div v-if="loader" class="text-center">
                <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
            <div v-else class="kivi-patient-dashboard-widget">
                <router-view></router-view>
            </div>
        </div>
        <div v-else>
            {{formTranslation.widgets.onlyForPatient}}
        </div>
    </div>
</template>
<script>
    import {get} from "../../../config/request";
    import store from "../../../store";
    export  default {
        data: () => {
            return {
                pageLoader: true,
                isLoggedIn: false,
                loginLoading: false,
                userRole:'',
            }
        },
        mounted() {
            this.getLoginUserDetail()
            this.getDynamicTranslation();
            this.init();
            this.pageLoader = false ;
            this.$router.push({ name : 'patient-dashboard-widget.dashboard.layout'})
            
        },
        methods: {
            init: function() {

            },
            getLoginUserDetail: function () {
                this.userRole = window.request_data.current_user_role
            },
            getDynamicTranslation: function () {
                this.$store.dispatch("fetchLangTranslateData", {
                    filePath: window.request_data.kiviCarePluginURL,
                    current: 'temp',
                    module: ''
                });
            }
        },
        computed : {
            loader () {
              return this.$store.state.loader
            }
        }
    }
</script>
