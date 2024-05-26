<template>
  <div>
    <template>
      <div>
        <div class="page-loader-section" v-if="formLoader">
          <loader-component-2></loader-component-2>
        </div>
        <div v-else class="accordion" role="tablist">
          <b-card no-body v-if="userData.addOns.telemed" class="mb-1">
            <b-card-header header-tag="header" role="tab">
              <b-button block v-b-toggle.zoom-telemed-oauth variant="white"
                class="d-flex align-items-center justify-content-between"> <span class="text-primary">
                  {{ formTranslation.zoom_telemed.zoom_telemed_oauth }} </span> </b-button>
            </b-card-header>
            <b-collapse id="zoom-telemed-oauth" :visible="userData.addOns.telemed" accordion="my-accordion"
              role="tabpanel">
              <b-card-body>

                <b-row>
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
                                    v-model="zoomConfigData.enableCal" name="google-meet-configuration" value="Yes"
                                    :disabled="userData.is_enable_doctor_zoom_telemed == 'on'" unchecked-value="No" switch
                                    >
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
                                <input type="text" id="client_id" class="form-control" name="client_id"
                                  :disabled="userData.is_enable_doctor_zoom_telemed == 'on'"
                                  v-model="zoomConfigData.client_id" />
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
                                <input type="text" id="client_secret" class="form-control" name="client_secret"
                                  v-model="zoomConfigData.client_secret"
                                  :disabled="userData.is_enable_doctor_zoom_telemed == 'on'" />
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
                                <input type="text" id="redirect_url" class="form-control" name="redirect_url"
                                  v-model="zoomConfigData.redirect_url"
                                  :disabled="userData.is_enable_doctor_zoom_telemed == 'on'" />
                              </div>
                              <div v-if="zoomTelemedSubmitted && !$v.zoomConfigData.redirect_url.required"
                                class="invalid-feedback">{{ formTranslation.zoom_telemed.redirect_url_required }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row justify-content-between px-2" v-if="zoomConfigData.enableCal == 'Yes'">

                        <b-button v-if="userData.is_enable_doctor_zoom_telemed == 'on'"
                          class="float-right btn btn-sm btn-primary" type="button" variant="primary"
                          :disabled="userData.is_enable_zoom_telemed_setting == 'off'" @click="closeConnectionZoomOauth">
                          {{ formTranslation.common.disconnect }}
                        </b-button>

                        <b-button v-else class="float-right btn btn-sm btn-light text-dark" type="button" variant="light"
                          :disabled="userData.is_enable_zoom_telemed_setting == 'off'" @click="connectZoomOauth">
                          {{ formTranslation.pro_setting.connect_with_zoom }}
                          <img alt="img" class="ml-1" height="10" :src="zoomSignInImage" />
                        </b-button>

                        <div class="d-flex justify-content-end" v-if="zoomConfigData.enableCal == 'Yes'">
                          <button type="submit" id="btn-google-submit" class="btn btn-primary"
                            :disabled="userData.is_enable_doctor_zoom_telemed == 'on' || loading">

                            <span v-if="loading">
                              <i class="fa fa-sync fa-spin"></i>&nbsp; {{ formTranslation.common.loading }}
                            </span>
                            <span v-else>
                              <i class="fa fa-save"></i> {{ formTranslation.common.save }}
                            </span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="col-md-7" v-if="['true', true].includes(true) && zoomConfigData.enableCal == 'Yes'">
                    <div class="row">
                      <div class="col-md-12">
                        <h4 class="text-primary mb-3">{{ formTranslation.doctor.zoom_configuration_guide }}</h4>
                      </div>
                    </div>
                    <b-list-group>
                      <b-list-group-item>{{ formTranslation.doctor.zoom_step1 }} <a href="https://marketplace.zoom.us/"
                          target="_blank">
                          {{ formTranslation.doctor.zoom_market_place_portal }}</a></b-list-group-item>
                      <b-list-group-item>{{ formTranslation.doctor.zoom_step2 }}
                        <a href="https://marketplace.zoom.us/develop/create" target="_blank">{{ formTranslation.doctor.create_app
                        }}</a>
                      </b-list-group-item>
                      <b-list-group-item>{{ formTranslation.doctor.zoom_oauth_step3 }}</b-list-group-item>
                      <b-list-group-item>{{ formTranslation.doctor.zoom_oauth_step4 }}
                      </b-list-group-item>
                      <b-list-group-item>{{ formTranslation.doctor.zoom_oauth_step5 }}
                      </b-list-group-item>
                    </b-list-group>
                  </div>
                </b-row>



                <div v-if="zoomConfigData.enableCal == 'Yes'">
                  <div class="row p-3" v-if="userData.is_enable_doctor_zoom_telemed == 'off'">
                    <b-col class="d-flex justify-content-between" md="12">
                      <div class="row">
                        <p v-if="userData.is_enable_zoom_telemed_setting == 'off'" style="font-weight: 500;color: red">
                          {{ formTranslation.common.please_enable_google_meet }}</p>
                        <p v-else style="font-weight: 500;">{{ formTranslation.zoom_telemed.please_connect_zoom_telemed_service
                        }}
                        </p>
                      </div>
                    </b-col>
                  </div>
                  <b-row v-else>
                    <b-col md="12" class="p-3 pb-0">
                      <div class="d-flex justify-content-between" style="margin: 30px 15px;">
                        <div class="row">
                          <p v-if="userData.is_enable_zoom_telemed_setting == 'off'" style="font-weight: 500;color: red">
                            {{ formTranslation.common.please_enable_google_meet }}</p>
                          <p v-else style="font-weight: 500;">{{ formTranslation.zoom_telemed.connected_zoom_telemed_service }}
                          </p>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </div>

              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card no-body class="mb-1" v-if="userData.addOns.telemed">
            <b-card-header header-tag="header" role="tab">
              <b-button block v-b-toggle.zoom-collapse variant="white"
                class="d-flex align-items-center justify-content-between"> <span class="text-primary"> Zoom JWT <span
                    class="text-warning">(Deprecated)</span> </span>
              </b-button>
            </b-card-header>
            <b-collapse id="zoom-collapse" :visible="userData.addOns.telemed" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <div class="row mt-3">
                  <div class="col-md-5">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group">
                          <b-form-checkbox size="lg" v-model="configurationData.enableTeleMed" name="check-button"
                            @change="zoomStatusChangeEvent" switch>
                            <span style="top: 0px !important;">
                              <small>
                                ({{ formTranslation.common.status }}: {{
                                  configurationData.enableTeleMed === true || configurationData.enableTeleMed === 'true' ?
                                  "On" : "Off"
                                }})
                              </small></span>
                          </b-form-checkbox>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label for="api_key" class="form-control-label">{{ formTranslation.doctor.api_key }} <span
                              class="text-danger">*</span></label>
                          <input id="api_key" :class="{ ' is-invalid': submitted && $v.configurationData.api_key.$error }"
                            v-model="configurationData.api_key" :placeholder="formTranslation.zoom_config.plh_api_key"
                            name="api_key" type="text" class="form-control">
                          <div v-if="submitted && !$v.configurationData.api_key.required" class="invalid-feedback">
                            {{ formTranslation.doctor.api_key_required }}
                          </div>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label for="api_secret" class="form-control-label">{{ formTranslation.doctor.api_secret }} <span
                              class="text-danger">*</span></label>
                          <input id="api_secret"
                            :class="{ ' is-invalid': submitted && $v.configurationData.api_secret.$error }"
                            v-model="configurationData.api_secret"
                            :placeholder="formTranslation.zoom_config.plh_api_secret" name="api_secret" type="text"
                            class="form-control">
                          <div v-if="submitted && !$v.configurationData.api_secret.required" class="invalid-feedback">
                            {{ formTranslation.doctor.api_secret_required }}
                          </div>
                        </div>
                      </div>
                      <!--                    <div class="col-md-12">-->
                      <!--                      <label for="video_price" class="form-control-label">-->
                      <!--                        {{ formTranslation.doctor.video_consultation_fees }}<span-->
                      <!--                          class="text-danger">*</span></label>-->
                      <!--                      <div>-->
                      <!--                        <input-->
                      <!--                            id="video_price"-->
                      <!--                            v-model="configurationData.video_price"-->
                      <!--                            :placeholder="formTranslation.doctor.consultation_fees" name="video_price"-->
                      <!--                            min="0"-->
                      <!--                            type="number"-->
                      <!--                            class="form-control"-->
                      <!--                            :class="{ ' is-invalid': submitted && $v.configurationData.video_price.$error }"-->
                      <!--                        >-->
                      <!--                        <div v-if="submitted && !$v.configurationData.video_price.required"-->
                      <!--                             class="invalid-feedback">{{ formTranslation.doctor.doctor_fees_required }}-->
                      <!--                        </div>-->
                      <!--                      </div>-->
                      <!--                    </div>-->
                    </div>
                  </div>
                  <div class="col-md-7">
                    <div class="row">
                      <div class="col-md-12">
                        <h4 class="text-primary mb-3">{{ formTranslation.doctor.zoom_configuration_guide }}</h4>
                      </div>
                    </div>
                    <b-list-group>
                      <b-list-group-item>{{ formTranslation.doctor.zoom_step1 }} : <a href="https://marketplace.zoom.us/"
                          target="_blank"> {{ formTranslation.doctor.zoom_market_place_portal }}</a>
                      </b-list-group-item>
                      <b-list-group-item>{{ formTranslation.doctor.zoom_step2 }}
                        <a href="https://marketplace.zoom.us/develop/create" target="_blank">{{ formTranslation.doctor.create_app
                        }}</a>
                      </b-list-group-item>
                      <b-list-group-item>{{ formTranslation.doctor.zoom_step3 }}</b-list-group-item>
                      <b-list-group-item>{{ formTranslation.doctor.zoom_step4 }}
                      </b-list-group-item>
                      <b-list-group-item>{{ formTranslation.doctor.zoom_step5 }}
                      </b-list-group-item>
                    </b-list-group>
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="col-md-12 p-0">
                    <div class="float-right">
                      <button v-if="!loading" @click="handleSubmit" class="btn btn-primary" type="submit"
                        v-html="buttonText"></button>
                      <button v-else class="btn btn-primary" type="submit" disabled>
                        <i class="fa fa-sync fa-spin"></i>&nbsp; {{ formTranslation.common.loading }}
                      </button>
                    </div>
                  </div>
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>




          <b-card no-body v-if="userData.addOns.googlemeet" class="mb-1">
            <b-card-header header-tag="header" role="tab">
              <b-button block v-b-toggle.google-meet-collapse variant="white"
                class="d-flex align-items-center justify-content-between"> <span class="text-primary">
                  {{ formTranslation.googlemeet.googlemeet }} </span> </b-button>
            </b-card-header>
            <b-collapse id="google-meet-collapse" :visible="userData.addOns.googlemeet" accordion="my-accordion"
              role="tabpanel">
              <b-card-body>
                <div class="row p-3" v-if="userData.is_enable_doctor_gmeet == 'off'">
                  <b-col class="d-flex justify-content-between" md="12">
                    <div class="row">
                      <p v-if="userData.is_enable_googleMeet == 'off'" style="font-weight: 500;color: red">
                        {{ formTranslation.common.please_enable_google_meet }}</p>
                      <p v-else style="font-weight: 500;">{{ formTranslation.common.please_connect_google_meet_automatically }}</p>
                    </div>
                    <b-button class="float-right btn btn-sm btn-primary" type="button" variant="primary"
                      :disabled="userData.is_enable_googleMeet == 'off'" @click="connect">
                      {{ formTranslation.pro_setting.connect_with_google }}
                    </b-button>
                  </b-col>
                </div>
                <b-row v-else>
                  <b-col md="12" class="p-3 pb-0">
                    <div class="d-flex justify-content-between flex-wrap gap-3" style="margin: 30px 15px;">
                      <div class="d-flex align-items-center">
                        <p v-if="userData.is_enable_googleMeet == 'off'" style="font-weight: 500;color: red">
                          {{ formTranslation.common.please_enable_google_meet }}</p>
                        <p v-else style="font-weight: 500;">{{ formTranslation.common.connected_with_google_meet }}</p>
                      </div>
                      <b-button class="float-right btn btn-sm btn-primary" type="button" variant="primary"
                        :disabled="userData.is_enable_googleMeet == 'off'" @click="closeConnection">
                        {{ formTranslation.common.disconnect }}
                      </b-button>
                    </div>
                  </b-col>
                  <!--                <b-col md="12" class="p-3 pb-0">-->
                  <!--                  <p for="video_price" class="pl-3" style="font-weight: 500;">-->
                  <!--                    {{ formTranslation.doctor.video_consultation_fees }}<span-->
                  <!--                      class="text-danger"></span></p>-->
                  <!--                  <div class="d-flex justify-content-between" style="margin: 30px 15px;">-->
                  <!--                    <input-->
                  <!--                        id="video_price"-->
                  <!--                        v-model="googlemeet.video_price"-->
                  <!--                        :placeholder="formTranslation.doctor.consultation_fees" name="video_price"-->
                  <!--                        min="0"-->
                  <!--                        type="number"-->
                  <!--                        class="form-control w-50"-->
                  <!--                        :class="{ ' is-invalid': googlemeetSubmitted && $v.googlemeet.video_price.$error }"-->
                  <!--                    >-->
                  <!--                    <div v-if="googlemeetSubmitted && !$v.googlemeet.video_price.required"-->
                  <!--                         class="invalid-feedback">{{ formTranslation.doctor.doctor_fees_required }}-->
                  <!--                    </div>-->
                  <!--                    <b-button-->
                  <!--                        class="btn-sm"-->
                  <!--                        type="button"-->
                  <!--                        variant="primary"-->
                  <!--                        @click ="savePrice">-->
                  <!--                      {{ googlemeetloading ? formTranslation.common.loading : formTranslation.common.save}}-->
                  <!--                    </b-button>-->
                  <!--                  </div>-->

                  <!--                </b-col>-->
                </b-row>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import { validateForm } from "../../config/helper";
import { post, get, _axios_post } from "../../config/request";

export default {
  name: "ZoomConfiguration",
  validations: {
    configurationData: {
      api_key: { required },
      api_secret: { required },
      // video_price:{required}
    },

    zoomConfigData: {
      redirect_url: { required },
      client_id: { required },
      client_secret: { required }
    },

    googlemeet: {
      // video_price:{required}
    }
  },
  data: () => {
    return {
      buttonText: '<i class="fa fa-save"></i> Save configuration',
      configurationData: {
        enableTeleMed: false
      },
      googleMeet: {
        enableTeleMed: false
      },
      loading: false,
      submitted: false,
      cardTitle: 'Telemed configuration',
      showLogin: false,
      data: {},
      disconnect: false,
      text: "Anim pariatur asdadsadsadasd asdasdasdasasd asdadasd",
      isTabActive: {
        zoomCollapse: true,
        googleMeetCollapse: false
      },
      formLoader: true,
      googlemeetloading: false,
      googlemeetSubmitted: false,
      googlemeet: {
        video_price: 0,
        telemed_service_id: 0,
        doctor_id: 0
      },
      zoomSignInImage: "",
      zoomOauthAuthorizationCode: null,
      from: window.location.href + "?",
      zoom_telemedloading: false,
      zoomTelemedSubmitted: false,
      zoom_telemed: {
        video_price: 0,
        telemed_service_id: 0,
        doctor_id: 0
      },
      zoomConfigData: {
        enableCal: false,
        redirect_url: "",
        client_id: "",
        client_secret: ""
      }
    }
  },
  mounted() {
    if (!['doctor'].includes(this.getUserRole())) {
      this.$router.push({ name: "403" })
    }
    this.init();
    this.telemedCollapseArrow();
    this.isTabActive.googleMeetCollapse = this.userData.addOns.googlemeet && !this.userData.addOns.telemed;
    this.isTabActive.zoomCollapse = this.userData.addOns.telemed;
    this.googlemeet = {
      video_price: this.userData.doctor_telemed_price,
      telemed_service_id: this.userData.telemed_service_id,
      doctor_id: this.userData.ID
    };
    this.getZoomTelemedConfig();
  },
  methods: {
    telemedCollapseArrow() {
      this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
        if (collapseId === 'zoom-collapse') {
          if (isJustShown) { this.isTabActive.zoomCollapse = true; } else { this.isTabActive.zoomCollapse = false; }
        } else {
          if (isJustShown) { this.isTabActive.googleMeetCollapse = true; } else { this.isTabActive.googleMeetCollapse = false; }
        }
      });
    },
    zoomStatusChangeEvent(value) {
      if (value && this.userData.is_enable_doctor_gmeet == 'on') {
        $.confirm({
          title: 'Enable Zoom',
          content: 'Note: You can use one meeting service at the time. We are disabling Google Meet service.',
          type: 'red',
          buttons: {
            ok: {
              text: this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                this.googleMeet.enableTeleMed = false;
              }
            },
            cancel: {
              text: this.formTranslation.common.cancel,
              action: () => {
                this.configurationData.enableTeleMed = false;
              }
            }
          }
        });
      }
    },
    gmeetStatusChange(value) {
      if (value && this.configurationData.enableTeleMed) {
        $.confirm({
          title: 'Enable Google Meet ',
          content: 'Note: You can use one meeting service at the time. We are disabling Zoom Service.',
          type: 'red',
          buttons: {
            ok: {
              text: this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                this.configurationData.enableTeleMed = false;
              }
            },
            cancel: {
              text: this.formTranslation.common.cancel,
              action: () => {
                this.googleMeet.enableTeleMed = false;
              }
            }
          }
        });
      }
    },
    start() {
      const id = this.userData;
      let calendarConfig = {
        client_id: id.googlemeet_client_id,
        scope: "https://www.googleapis.com/auth/calendar",
      };
      if (id.googlemeet_app_name) {
        calendarConfig.plugin_name = id.googlemeet_app_name;
      }
      gapi.load('auth2', function () {
        var auth2 = gapi.auth2.init(calendarConfig).then((response) => {
        });
      });
    },
    init: function () {

      this.zoomSignInImage = window.pluginBASEURL + "assets/images/logo-zoom-blue.svg"

      this.configurationData = this.defaultConfigurationData();
      this.getConfigurationData();
      this.start();
    },
    connectGoogle: function () {
      post('get_all_lang_option', {})
        .then((response) => {
          if (response.data.status !== undefined && response.data.status === true) {
          } else {
            displayErrorMessage(response.data.message)
          }

        })
        .catch((error) => {
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error)
        })
    },
    getConfigurationData: function () {
      this.formLoader = true
      get('get_doctor_zoom_configuration', {
        user_id: this.userId
      })
        .then((response) => {
          this.formLoader = false;
          if (response.data.status !== undefined && response.data.status === true) {
            this.configurationData = response.data.data;
          } else {
            displayErrorMessage(response.data.message)
          }

        })
        .catch((error) => {
          console.log(error);
          this.formLoader = false;
          displayErrorMessage(this.formTranslation.common.internal_server_error)
        })
    },
    defaultConfigurationData: function () {
      return {
        api_key: "",
        api_secret: "",
        doctor_id: "",
        enableTeleMed: false,
        video_price: 0
      }
    },
    savePrice() {

      this.googlemeetSubmitted = true;

      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.googlemeet.$invalid) {
        return;
      }
      this.googlemeetloading = true;
      this.googlemeetSubmitted = false;

      post('save_doctor_googlemeet_data_save', this.googlemeet)
        .then((response) => {
          this.googlemeetloading = false;
          if (response.data.status !== undefined && response.data.status === true) {
            this.$store.dispatch("userDataModule/fetchUserData", {});
            displayMessage(response.data.message);
          } else {
            displayErrorMessage(response.data.message)
          }
        })
        .catch((error) => {
          console.log(error);
          this.googlemeetloading = false;
          displayErrorMessage(this.formTranslation.common.internal_server_error)
        })
    },
    handleSubmit: function () {

      this.loading = true;
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.configurationData.$invalid) {
        this.loading = false;
        return;
      }

      if (validateForm("configurationDataForm")) {

        this.configurationData.doctor_id = this.userId

        let configRequest = {
          api_key: this.configurationData.api_key,
          api_secret: this.configurationData.api_secret,
          doctor_id: this.configurationData.doctor_id,
          enableTeleMed: this.configurationData.enableTeleMed,
          video_price: this.configurationData.video_price
        }

        post('save_doctor_zoom_configuration', configRequest)
          .then((response) => {
            this.loading = false;
            this.submitted = false;
            if (response.data.status !== undefined && response.data.status === true) {
              this.$store.dispatch("userDataModule/fetchUserData")
              displayMessage(response.data.message);
            } else {
              displayErrorMessage(response.data.message)
            }
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
            this.submitted = false;
            displayErrorMessage(this.formTranslation.common.internal_server_error)
          })
      }
    },
    connect() {
      if (this.configurationData.enableTeleMed) {
        $.confirm({
          title: 'Enable Google Meet ',
          content: 'Note: You can use one meeting service at the time. We are disabling Zoom Service.',
          type: 'red',
          buttons: {
            ok: {
              text: this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                this.googleConnetct();
                this.configurationData.enableTeleMed = false;
              }
            },
            cancel: {
              text: this.formTranslation.common.cancel,
              action: () => {
                this.googleMeet.enableTeleMed = false;
              }
            }
          }
        });
      } else {
        this.googleConnetct()
      }
    },
    googleConnetct() {
      let calendarConfig_new = {
        client_id: this.userData.googlemeet_client_id,
        scope: "https://www.googleapis.com/auth/calendar",
      };
      if (this.userData.googlemeet_app_name) {
        calendarConfig_new.plugin_name = this.userData.googlemeet_app_name;
      }
      var auth2 = gapi.auth2.init(calendarConfig_new);

      auth2.grantOfflineAccess().then(this.signInCallback);
    },
    closeConnection() {
      let doctor_id = this.userId
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
      if (authResult['code']) {
        let doctor_id = this.userId
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
            // data = JSON.parse(data);
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
        //   .then((response) => {
        //     if (
        //         response.data.status !== undefined &&
        //         response.data.status === true
        //     ) {
        //       this.$store.dispatch("userDataModule/fetchUserData", {});
        //       this.disconnect = true;
        //       displayMessage(response.data.message);
        //     }
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //     displayErrorMessage(this.formTranslation.widgets.record_not_found);
        //   });
      } else {
        console.log('error')
      }
    },
    connectZoomOauth: function (from) {

      let zoom_telemed_client_id = this.zoomConfigData.client_id
      let zoom_telemed_setting_redirect_url = this.zoomConfigData.redirect_url

      const popup = window.open('https://zoom.us/oauth/authorize?client_id=' + zoom_telemed_client_id + '&response_type=code&redirect_uri=' + zoom_telemed_setting_redirect_url, 'oauth', 'width=600,height=600');
      const this_ = this;
      var interval = setInterval(function () {

        try {
          const urlParams = new URLSearchParams(popup.location.search);
          let code = urlParams.get('code')
          if (code != undefined) {
            this_.zoomOauthAuthorizationCode = code;
            popup.close()
          }
        } catch (error) {
          // console.log(error.message);
        }

        if (popup.closed) {
          clearInterval(interval);
        }
      }, 500);


    },
    closeConnectionZoomOauth: function () {

      let _this = this
      get("disconnect_doctor_zoom_oauth", {
        "authentication_token": this.zoomOauthAuthorizationCode
      }).then(function (data) {
        displayMessage(data.data.data.message);
        _this.$store.dispatch("userDataModule/fetchUserData");
      })

    },
    setDoctorZoomOauthToken: function () {

      this.$v.$touch();
      this.loading = true;

      if (this.$v.zoomConfigData.$invalid) {
        this.loading = false;
        return;
      }

      let _this = this
      post("generate_doctor_zoom_oauth_token", {
        "code": this.zoomOauthAuthorizationCode,
        "grant_type": "authorization_code"
      }).then(function (data) {
        displayMessage(data.data.data.message);
        _this.loading = false;
        _this.$store.dispatch("userDataModule/fetchUserData");
      })
    },
    handleCalenderSubmit: function () {
      if (this.userData.addOns.telemed != true) {
        return
      }
      this.zoomTelemedSubmitted = true;

      this.loading = true;

      if (this.$v.zoomConfigData.$invalid) {
        this.loading = false;
        return;
      }

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
          this.loading = false;
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
    userId() {
      return this.$store.state.userDataModule.user.ID;
    },
    teleMedStatus() {
      return this.$store.state.userDataModule.user.teleMedStatus;
    }
  },
  watch: {
    zoomOauthAuthorizationCode() {
      if (this.zoomOauthAuthorizationCode.length > 0) {
        this.setDoctorZoomOauthToken()
      }

    }
  }
}
</script>