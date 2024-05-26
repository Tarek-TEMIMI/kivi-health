<template>
    <div class="row" id="kivicare_get_help">
        <div class="col-md-12">
            <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
                <template v-slot:header>
                    <b-row>
                        <b-col sm="12" md="12" lg="12">
                            <div class="get-pro-image">
                                <a href="https://codecanyon.net/item/kivicare-pro-clinic-patient-management-system-ehr-addon/30690654?utm_source=referral&utm_medium=kivicare-free-plugin-to-upgrade-pro&utm_campaign=kivicare-free-plugin-upgrade" target="_blank"><img :src="getProImage" alt="Generic placeholder image" /></a>
                            </div>
                            <br/>
                            <div>
                                <h2 class="text-center text-dark">One Time Payment Life Time Access !</h2>
                                <p class="text-center"><b>Kivicare is the most affordable self-hosted EHR solution for new-age practice.</b></p>
                            </div>
                            <div class="get-pro-button-container">
                                <div class="get-pro-button">
                                    <a type="button" href="https://codecanyon.net/item/kivicare-pro-clinic-patient-management-system-ehr-addon/30690654?utm_source=referral&utm_medium=kivicare-free-plugin-to-upgrade-pro&utm_campaign=kivicare-free-plugin-upgrade" target="_blank" class="btn btn-md btn-outline-primary">
                                        {{formTranslation.common.get_pro_now}}
                                    </a>
                                </div>
                            </div>
                        </b-col>
                    </b-row>
                </template>
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
                showSupportLink: 'on',
                getProImage: window.request_data.kiviCarePluginURL + 'assets/images/getProImage.png',
            }
        },
        mounted() {
            this.linkClass(0);
            this.getRequestHelper();
            this.getProImage = window.request_data.kiviCarePluginURL + 'assets/images/getProImage.png';
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
