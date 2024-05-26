<template>
    <div class="row" id="kivicare_get_help">
        <div class="col-md-12">
            <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
                <template v-slot:header>
                    <b-row>
                        <b-col sm="12" md="8" lg="8">
                            <h3 class="mb-0"> {{ formTranslation.common.get_help }} </h3>
                        </b-col>
                        <b-col sm="12" md="4" lg="4"  v-if="showSupportLink == 'off' && kiviPro == true">
                            <div class="d-flex justify-content-end">
                                <a class="btn btn-sm btn-primary" href="https://iqonic.desky.support/login" target="_blank" rel="noopener noreferrer"> <i class="fas fa-external-link-alt"></i> {{ formTranslation.common.get_support }}  </a>
                            </div>
                        </b-col>
                    </b-row>
                </template>
                <div class="row">
                    <div class="col-md-12">
                        <b-card no-body>
                            <b-tabs 
                                pills card fill
                                v-model="tabIndex"
                            >
                                <!-- <b-tab title="General" active>
                                    <b-card-text>
                                        <general-component-help /> 
                                    </b-card-text>
                                </b-tab> -->
                                <b-tab 
                                    :title=formTranslation.common.shortcodes>
                                    <b-card-text>
                                        <shortcode-help />
                                    </b-card-text>
                                </b-tab>
                                <b-tab 
                                    :title= formTranslation.common.lbl_telemed_pro_pro>
                                    <b-card-text>
                                        <telemed-help />
                                    </b-card-text>
                                </b-tab>
                                <b-tab 
                                    :title= formTranslation.common.lbl_woocommerce_pro>
                                    <b-card-text>
                                        <woocommerce-help />
                                    </b-card-text>
                                </b-tab>
                                <b-tab 
                                    :title= formTranslation.common.lbl_google_calendar_pro>
                                    <b-card-text>
                                        <google-calendar-help />
                                    </b-card-text>
                                </b-tab>
                                <b-tab 
                                    :title= formTranslation.common.lbl_sms_pro>
                                    <b-card-text>
                                        <sms-help />
                                    </b-card-text>
                                </b-tab>
                                <b-tab 
                                    :title= formTranslation.pro_setting.set_language>
                                    <b-card-text>
                                        <language-help />
                                    </b-card-text>
                                </b-tab>
                                <b-tab 
                                    :title= formTranslation.appointments.appointments>
                                    <b-card-text>
                                        <appointment-help />
                                    </b-card-text>
                                </b-tab>
                                <b-tab 
                                    :title= formTranslation.common.holiday>
                                    <b-card-text>
                                        <holiday-help />
                                    </b-card-text>
                                </b-tab>
                            </b-tabs>
                        </b-card>
                    </div>
                </div>
            </b-card>
        </div>
    </div>
</template>
<script>
    import { post } from "../../config/request";
    export default {
        data () {
            return {
                tabIndex: 0,
                showSupportLink: 'on'
            }
        },
        mounted() {
            this.linkClass(0);
            this.getRequestHelper();
        },
        methods: {
            getRequestHelper:function(){
                // post('get_request_helper_status', {})
                //     .then((response) => {
                //         if (response.data.status !== undefined && response.data.status === true) {
                //             this.showSupportLink = response.data.data
                //         }
                //     })
                //     .catch((error) => {
                //         console.log(error);
                //         displayErrorMessage(this.formTranslation.common.internal_server_error);
                //     })
                if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
                  this.showSupportLink = window.request_data.link_show_hide;
                }
            },
            linkClass(idx) {
                if (this.tabIndex === idx) {
                    return ['bg-primary', 'text-white' , 'tab-custom-class' ]
                } else {
                    return ['bg-white', 'text-primary']
                }
            }
        },
        computed: {
            userData() {
                return this.$store.state.userDataModule.user;
            },
            kiviPro (){
                return this.userData.addOns.kiviPro
            }
        }
    }
</script>
<style scoped>
    
</style>
