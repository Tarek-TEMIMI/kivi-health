<template>
    <div>
        <b-overlay :show="userData.addOns.telemed != true" variant="white" :opacity="overlayOpacity">
            <template #overlay>
                <overlay-message addon_type="zoom_telemed"></overlay-message>
            </template>
            <b-card class="card-body google-meet-setting" header-tag="header" footer-tag="footer">
                <div class="row p-2">
                    <div class="col-md-12">
                        <h2 class=" ">
                            {{ formTranslation.zoom_telemed.zoom_telemed }}
                        </h2>
                    </div>
                </div>
                <hr class="p-2 m-0" />
                <div class="row">
                    <div class="col-md-12">

                        <div class="row">
                            <div class="col-md-5">
                                <form id="googleCalform" name="googleCalform" @submit.prevent="handleCalenderSubmit"
                                    :novalidate="true" enctype="multipart/form-data">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <b-row class="mt-2 ml-4">
                                                    <b-col sm="12" md="12" lg="12">
                                                        <div class="form-group">
                                                            <b-form-checkbox size="md" id="google-meet-configuration"
                                                                v-model="zoomConfigData.enableCal"
                                                                name="google-meet-configuration" value="Yes"
                                                                unchecked-value="No" switch @change="handleCalenderSubmit">
                                                                <b> {{ formTranslation.zoom_telemed.zoom_configuration }} </b>
                                                            </b-form-checkbox>
                                                        </div>
                                                    </b-col>
                                                </b-row>
                                            </div>
                                        </div>
                                        <div class="col-md-12" v-if="zoomConfigData.enableCal == 'Yes'">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label for="client_id" class="form-control-label">{{
                                                            formTranslation.zoom_telemed.zoom_client_id }}
                                                        </label>
                                                        <input type="text" id="client_id" class="form-control"
                                                            name="client_id" v-model="zoomConfigData.client_id" />
                                                    </div>
                                                    <div v-if="zoomTelemedSubmitted && !$v.zoomConfigData.client_id.required"
                                                        class="invalid-feedback">
                                                        {{ formTranslation.zoom_telemed.zoom_client_id_required }}</div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label for="client_secret" class="form-control-label">{{
                                                            formTranslation.zoom_telemed.zoom_client_secret }}
                                                        </label>
                                                        <input type="text" id="client_secret" class="form-control"
                                                            name="client_secret" v-model="zoomConfigData.client_secret" />
                                                    </div>
                                                    <div v-if="zoomTelemedSubmitted && !$v.zoomConfigData.client_secret.required"
                                                        class="invalid-feedback">
                                                        {{ formTranslation.zoom_telemed.zoom_client_secret_required }}</div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label for="redirect_url" class="form-control-label">{{
                                                            formTranslation.zoom_telemed.redirect_url }}
                                                        </label>
                                                        <input type="text" id="redirect_url" class="form-control"
                                                            name="redirect_url" v-model="zoomConfigData.redirect_url" />
                                                    </div>
                                                    <div v-if="zoomTelemedSubmitted && !$v.zoomConfigData.redirect_url.required"
                                                        class="invalid-feedback">{{ formTranslation.zoom_telemed.redirect_url_required }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row" v-if="zoomConfigData.enableCal == 'Yes'">
                                        <div class="col-md-12">
                                            <div class="d-flex justify-content-end">
                                                <button type="submit" id="btn-google-submit" class="btn btn-primary">
                                                    <i class="fa fa-save"></i> {{ formTranslation.common.save }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div class="col-md-7 mt-3" v-if="zoomConfigData.enableCal == 'Yes'">
                                <div class="row">
                                    <div class="col-md-12">
                                        <h4 class="text-primary mb-3">
                                            {{ formTranslation.zoom_telemed.guide_to_setup_zoom }}
                                        </h4>
                                    </div>
                                </div>
                                <b-list-group>
                                    <b-list-group-item> <b> {{ 'Step:1' }} </b>
                                        <a href="https://apps.iqonic.design/docs/product/kivicare/google-calendar/"
                                            target="_blank">
                                            {{ formTranslation.pro_setting.please_refer_link }}</a></b-list-group-item>
                                    <b-list-group-item>
                                        <p> <b>Note:</b> If you have already setup Google calendar then You can use same
                                            ClientID and Client Secret here.</p>
                                    </b-list-group-item>
                                </b-list-group>
                            </div>
                        </div>
                    </div>
                </div>
            </b-card>
        </b-overlay>
    </div>
</template>

<script>
import { post ,get} from "../../config/request";
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
        this.getZoomTelemedConfig();
    },
    methods: {
        handleCalenderSubmit: function () {
            if (this.userData.addOns.telemed != true) {
                return
            }
            this.zoomTelemedSubmitted = true;

            post("zoom_telemed_save_oauth_config", this.zoomConfigData)
                .then((response) => {

                    this.zoomTelemedSubmitted = false;
                    if (
                        response.data.success !== undefined &&
                        response.data.success === true
                    ) {
                        displayMessage(response.data.data.message);
                    } else {
                        displayErrorMessage(response.data.data.message);
                    }
                })
                .catch((error) => {
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                });
        },
        getZoomTelemedConfig: function () {
            this.formLoader = true;
            get('get_zoom_telemed_config', {})
                .then((response) => {
                    if (response.data.success !== undefined && response.data.success === true) {
                        this.zoomConfigData = response.data.data
                    }
                    // if (response.data.config !== undefined && response.data.config.status !== undefined && response.data.config.status === true) {
                    //     this.googleCalData = response.data.config.data;
                    // }
                    this.formLoader = false;
                })
                .catch((error) => {
                    this.formLoader = false;
                    console.log(error);
                })
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