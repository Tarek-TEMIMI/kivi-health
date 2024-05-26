<template>
    <b-row>
        <b-col sm="12" md="12" lg="12">
            <b-overlay :show="userData.addOns.api != true" variant="white" :opacity="0.4">
                <template #overlay>
                    <overlay-message addon_type="app"></overlay-message>
                </template>
                <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                    <template v-slot:header>
                        <b-row>
                            <b-col sm="12" md="8" lg="8">
                                <h2 class="mb-0">
                                    {{ formTranslation.settings.app_config }}
                                </h2>
                            </b-col>
                        </b-row>
                    </template>
                    <b-card>
                        <b-row>
                            <b-col sm="12" md="12" lg="12">
                                <b-row>
                                    <b-col md="12" class="mb-2">
                                        <h3>
                                            {{ formTranslation.settings.one_signal_app_notification }}
                                        </h3>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="app_id" class="form-control-label"> {{
                                                formTranslation.settings.app_id }} <span class="text-danger">*</span>
                                            </label>
                                            <input id="app_id" v-model="app.app_id" disabled
                                                :placeholder="formTranslation.settings.app_id_placeholder" name="app_id"
                                                type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="api_key" class="form-control-label"> {{
                                                formTranslation.settings.api_key }} <span class="text-danger">*</span>
                                            </label>
                                            <input id="api_key" v-model="app.api_key" disabled
                                                :placeholder="formTranslation.settings.api_key_placeholder" name="api_key"
                                                type="text" class="form-control">
                                        </div>
                                    </div>
                                </b-row>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="12" md="12" lg="12">
                                <div class="d-flex justify-content-end">
                                    <b-button variant="primary" disabled class=" mr-2"> <i
                                            :class=" 'fa fa-save'"></i> {{
                                                formTranslation.common.save }}</b-button>
                                </div>
                            </b-col>
                        </b-row>
                    </b-card>

                    <!-- FireBase Notification -->
                    <b-card>
                        <b-row>
                            <b-col sm="12" md="12" lg="12">
                                <b-row>
                                    <b-col md="12" class="mb-2">
                                        <h3>
                                            {{ formTranslation.settings.firebase_app_config }}
                                        </h3>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <div v-for="settings in  firebaseConfigSetting" class="col-md-4">
                                        <div class="form-group">
                                            <label :for="'firebase_' + settings" class="form-control-label"> {{
                                                formTranslation.settings.app[settings] }} <span class="text-danger">*</span>
                                            </label>
                                            <input :id="'firebase_' + settings" v-model="firebaseConfig[settings]"
                                                :placeholder="formTranslation.settings.app[settings]"
                                                name="firebaseConfig.apiKey" type="text" class="form-control" />
                                        </div>
                                    </div>


                                </b-row>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="12" md="12" lg="12">
                                <div class="d-flex justify-content-end">
                                    <b-button variant="primary" class=" mr-2" @click="saveCommonSettings"> <i
                                            :class="isLoading ? 'fa fa-spinner fa-spin' : 'fa fa-save'"></i> {{
                                                formTranslation.common.save }}</b-button>
                                </div>
                            </b-col>
                        </b-row>
                    </b-card>

                </b-card>
            </b-overlay>
        </b-col>
    </b-row>
</template>
<script>

import { post, get } from "../../config/request";
export default {
    data: () => {
        return {
            app: {
                app_id: "",
                api_key: "",
            },
            firebaseConfig: {
                serverKey: '',
            },
            isLoading: false,
            firebaseConfigSetting: [
                'serverKey',
            ]
        }
    },
    mounted() {
        if (!['administrator'].includes(this.getUserRole())) {
            this.$router.push({ name: "403" })
        }
        this.init();
        this.getModule();
    },
    methods: {
        init: function () { },
        saveCommonSettings: function () {
            if (this.isLoading) {
                return true
            }

            this.isLoading = true;
            post('save_app_config', { config: this.firebaseConfig })
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        displayMessage(response.data.message)
                    }
                    this.isLoading = false;
                })
                .catch((error) => {
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                    this.isLoading = false;
                })
        },
        getModule: function () {
            get('get_app_config').then(response => {
                if (response.data.success !== undefined && response.data.success === true) {
                    this.firebaseConfig = response.data.data
                }
            })
        }
    },
    computed: {
        userData() {
            return this.$store.state.userDataModule.user;
        }
    }
}
</script>