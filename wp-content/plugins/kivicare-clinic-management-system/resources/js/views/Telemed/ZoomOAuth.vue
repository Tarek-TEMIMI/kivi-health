<template>
    <div>
        <b-row v-if="userData.is_enable_doctor_zoom_telemed == 'off'">
            <b-col sm="12">
                <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
                    <template v-slot:header>
                        <b-row>
                            <b-col sm="12" md="8" lg="8">
                                <h2> {{ formTranslation.zoom_telemed.zoom_telemed }}</h2>
                            </b-col>
                        </b-row>
                    </template>
                    <div class="row">
                        <b-col md="12">
                            <div class="d-flex justify-content-between" style="margin: 30px 15px;">
                                <p style="font-weight: 500;">{{ formTranslation.zoom_telemed.please_connect_zoom_telemed_service
                                }}</p>
                                <b-button class="float-right btn btn-sm btn-primary " type="button" @click="connect"
                                    variant="primary">
                                    <span class="d-flex align-items-center">
                                        <img alt="img" class="mr-1" :src="googleSignInImage">
                                        {{ formTranslation.pro_setting.connect_with_zoom }}
                                    </span>
                                </b-button>
                            </div>
                        </b-col>
                    </div>
                </b-card>
            </b-col>
        </b-row>
        <b-row v-else>
            <b-col md="12">
                <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
                    <template v-slot:header>
                        <b-row>
                            <b-col sm="12" md="8" lg="8">
                                <h2>{{ formTranslation.common.google_calendar }}</h2>
                            </b-col>

                        </b-row>
                    </template>
                    <div class="row">
                        <div class="col-md-12 pb-0">
                            <div class="d-flex justify-content-between" style="margin: 30px 15px;">
                                <p style="font-weight: 500;">{{ formTranslation.common.connected_with_google_meet }}</p>

                                <b-button class="float-right btn btn-sm btn-primary" type="button" variant="primary"
                                    @click="closeConnection">
                                    {{ formTranslation.common.disconnect }}
                                </b-button>
                            </div>
                        </div>
                    </div>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { post, get } from "../../config/request";
import { required } from "vuelidate/lib/validators";
export default {
    name: "ZoomOAuthConfig",
    components: {
    },
    data: () => {
        return {
            data: {},
            disconnect: false,
            googleSignInImage: '',
            zoom_telemedloading: false,
            zoomTelemedSubmitted: false,
            zoom_telemed: {
                video_price: 0,
                telemed_service_id: 0,
                doctor_id: 0
            },
            zoomConfigData: {

            }
        };
    },
    mounted() {
        if (!['doctor'].includes(this.getUserRole())) {
            this.$router.push({ name: "403" })
        }
        setTimeout(() => {
            this.start();
        }, 2000)
        this.googleSignInImage = + 'assets/images/logo-zoom-blue.svg';
        this.zoom_telemed = {
            video_price: this.userData.doctor_telemed_price,
            telemed_service_id: this.userData.telemed_service_id,
            doctor_id: this.userData.ID
        };
    },
    methods: {
        start() {
            const id = this.userData;


            let calendarConfig = {
                client_id: id.zoom_telemed_client_id,
                scope: "https://www.googleapis.com/auth/calendar",
            };
            if (id.zoom_telemed_app_name) {
                calendarConfig.plugin_name = id.zoom_telemed_app_name;
            }
            gapi.load('auth2', function () {
                var auth2 = gapi.auth2.init(calendarConfig);
            });
        },
        connect() {


            let calendarConfig_new = {
                client_id: this.userData.zoom_telemed_client_id,
                scope: "https://zoom.us/oauth/authorize",
                redirect_uri: "http://localhost/"
            };
            if (this.userData.zoom_telemed_app_name) {
                calendarConfig_new.plugin_name = this.userData.zoom_telemed_app_name;
            }

            var auth2 = gapi.auth2.init(calendarConfig_new);

            auth2.grantOfflineAccess().then(this.signInCallback)
        },
        closeConnection() {
            let doctor_id = this.userData.ID
            post("diconnect_meet_doctor", { doctor_id: doctor_id })
                .then((response) => {
                    if (
                        response.data.status !== undefined &&
                        response.data.status === true
                    ) {
                        this.$store.dispatch("userDataModule/fetchUserData", {});
                        this.disconnect = false;
                        displayMessage(response.data.message);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.widgets.record_not_found);
                });
        },
        signInCallback(authResult) {
            console.log(authResult);
            return ;
            if (authResult['code']) {
                let doctor_id = this.userData.ID
                let _this = this
                $.ajax({
                    url: window.request_data.ajaxurl,
                    type: 'POST',
                    data: {
                        route_name: 'connect_meet_doctor',
                        doctor_id: doctor_id,
                        _ajax_nonce: window.request_data.nonce,
                        code: authResult['code'],
                        action: 'ajax_post'
                    },
                    success: function (data) {
                        data = JSON.parse(data);
                        if (
                            data.status !== undefined &&
                            data.status === true
                        ) {
                            _this.$store.dispatch("userDataModule/fetchUserData", {});
                            _this.disconnect = true;
                            displayMessage(data.message);

                        }
                    }
                });
                // post("connect_meet_doctor", {doctor_id: doctor_id,code:authResult['code']})
                //     .then((response) => {
                //       if (
                //           response.data.status !== undefined &&
                //           response.data.status === true
                //       ) {
                //         this.$store.dispatch("userDataModule/fetchUserData", {});
                //         this.disconnect =true;
                //         displayMessage(response.data.message);

                //       }
                //     })
                //     .catch((error) => {
                //       console.log(error);
                //       displayErrorMessage(this.formTranslation.widgets.record_not_found);
                //     });
            } else {
                console.log('error')
            }
        }
    },
    computed: {
        userData() {
            return this.$store.state.userDataModule.user;
        },
    }
};
</script>

<style lang="scss" scoped></style>