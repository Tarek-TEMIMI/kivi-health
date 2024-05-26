<template>
  <b-card class="card-body common-setting" header-tag="header" footer-tag="footer">
    <NotificationTestModal ref="NotificationTestModal" ></NotificationTestModal>
    <div class="page-loader-section" v-if="formLoader">
      <loader-component-2></loader-component-2>
    </div>
    <div v-else class="col-md-12">
      <b-overlay :show="userData.addOns.kiviPro != true" variant="white"
                 :opacity="overlayOpacity">
        <template #overlay>
          <overlay-message addon_type="pro"></overlay-message>
        </template>
        <div class="row p-2">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.settings.pro_settings }}
              <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/pro-version/" target="_blank"><i class="fa fa-question-circle"></i></a>
            </h2>
          </div>
        </div>
        <hr class="p-2 m-0"/>
        <form id="uploadFile">
          <div class="row p-2">
            <div class="col-md-12">
              <h2>
                {{ formTranslation.pro_setting.theme_setting }}
              </h2>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label class="form-control-label">{{ formTranslation.pro_setting.set_site_logo }} </label>
                <div class="input-group kivi-choose-file flex-nowrap">
                  <div class="input-group-prepend flex-shrink-0">
                    <button class="btn btn-primary px-2" type="button" id="siteLogo" @click.prevent="uploadsiteLogo()">{{ formTranslation.common.choose_file }}</button>
                  </div>
                  <label class="input-group-text" for="siteLogo">{{ new_site_logo }}</label>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card-profile-image">
                <img style="max-height: 100px;" v-if="getSiteLogo!= -1 && getSiteLogo!= null && getSiteLogo!=''"
                     :src="getSiteLogo" class="navbar-brand-img ml-2" alt="get">
                <img style="max-height: 100px;" v-else :src="logoURL" class="navbar-brand-img ml-2" alt="else">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label class="form-control-label">{{ formTranslation.pro_setting.set_site_loader }} </label>
                <div class="input-group kivi-choose-file flex-nowrap">
                  <div class="input-group-prepend flex-shrink-0">
                    <button class="btn btn-primary px-2" type="button" id="siteLoader" @click.prevent="uploadSiteLoader()">{{ formTranslation.common.choose_file }}</button>
                  </div>
                  <label class="input-group-text" for="siteLogo">{{ new_site_loader }}</label>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card-profile-image">
                <img style="max-height: 100px;" :src="loaderURL" class="navbar-brand-img ml-2">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <label class="form-control-label">
                {{ formTranslation.pro_setting.set_theme_color }}
              </label>
              <input
                  class="form-control form-control-color"
                  type="color"
                  v-model="themeColor"
                  @change="setSiteThemeColor"
                  id="example-color-input"
              />
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-md-2">
              <div class="form-group kc-thm-st">
                <b-row class="mt-2 ml-4">
                  <b-col sm="12" md="12" lg="12">
                    <div class="form-group">
                      <b-form-checkbox
                          size="md"
                          id="rtl"
                          v-model="rtlMode"
                          @change="setSiteRTLMode"
                          name="rtl"
                          value="true"
                          unchecked-value="false"
                          switch
                      >
                        <b> {{ formTranslation.pro_setting.rtl_mode }} </b>
                      </b-form-checkbox>
                    </div>
                  </b-col>
                </b-row>
              </div>
            </div>
          </div>
        </form>
        <hr class="p-2 m-0"/>
        <form id="wordpress-logo">
          <div class="row p-2">
            <div class="col-md-12">
              <h2>
                {{ 'WordPress Logo' }}
              </h2>
            </div>
          </div>
          <div class="row mt-0">
            <div class="col-md-4">
              <div class="form-group kc-thm-st">
                <b-row class="mt-2 ml-4">
                  <b-col sm="12" md="12" lg="12">
                    <div class="form-group">
                      <b-form-checkbox
                          size="md"
                          id="enable-wordpress-status"
                          v-model="EnableWordpressStatus"
                          @change="setWordpressLogoStatus"
                          name="enable-wordpress-status"
                          value="1"
                          unchecked-value="0"
                          switch
                      >
                        <b> {{ formTranslation.common.enable_wordpress_logo_status }} </b>
                      </b-form-checkbox>
                    </div>
                  </b-col>
                </b-row>
              </div>
            </div>
          </div>
          <div class="row" v-if="EnableWordpressStatus == '1'">
            <div class="col-md-4">
              <div class="form-group">
                <div class="input-group kivi-choose-file flex-nowrap">
                  <div class="input-group-prepend flex-shrink-0">
                    <button class="btn btn-primary px-2" type="button" id="wordpressLogo" @click.prevent="saveWordpressLogoImage()">{{ formTranslation.common.choose_file }}</button>
                  </div>
                  <label class="input-group-text" for="wordpressLogo">{{ new_wordpress_logo }}</label>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card-profile-image">
                <img style="max-height: 100px;" :src="wordpressLogoImagePreview" class="navbar-brand-img ml-2"
                     alt="else">
              </div>
            </div>
          </div>
        </form>
        <hr class="p-2 m-0"/>
        <div class="row p-2">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.common.custom_notification }}
            </h2>
          </div>
        </div>
        <div class="row mt-0 mb-0">
          <div class="col-md-12">
            <div class="form-group">
              <b-row class="mt-2 ml-4">
                <b-col sm="12" md="12" lg="12">
                  <div class="form-group">
                    <b-form-checkbox
                        size="md"
                        id="customNotification-sms"
                        v-model="customNotification.enableSMS"
                        @change="saveCustomNotification('sms')"
                        name="enable-sms"
                        value="yes"
                        unchecked-value="no"
                        switch
                    >
                      <b> {{ formTranslation.common.enable_sms }} </b>
                    </b-form-checkbox>
                  </div>
                </b-col>
              </b-row>
              <b-row class="mt-2 ml-4">
                <b-col sm="12" md="12" lg="12">
                  <div class="form-group">
                    <b-form-checkbox
                        size="md"
                        id="customNotification-whatsapp"
                        v-model="customNotification.enableWhatsapp"
                        @change="saveCustomNotification('whatsapp')"
                        name="enable-sms"
                        value="yes"
                        unchecked-value="no"
                        switch
                    >
                      <b> {{ formTranslation.common.enable_whatsapp }} </b>
                    </b-form-checkbox>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
        <hr class="p-2 m-0"/>
        <div class="row p-2">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.pro_setting.twilio_account_setting }}
            </h2>
          </div>
        </div>
        <div class="row mb-0 mt-0">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-5">
                <form
                    id="smsForm"
                    name="smsForm"
                    @submit.prevent="saveSmsConfigData('submit')"
                    :novalidate="true"
                    enctype="multipart/form-data"
                >
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <b-row class="mt-2 ml-4">
                          <b-col sm="12" md="12" lg="12">
                            <div class="form-group">
                              <b-form-checkbox
                                  size="md"
                                  id="enable-sms"
                                  v-model="smsConfigData.enableSMS"
                                  @change="saveSmsConfigData('checkbox')"
                                  name="enable-sms"
                                  value="true"
                                  unchecked-value="false"
                                  switch
                              >
                                <b> {{ formTranslation.pro_setting.twilo_sms_configration }} </b>
                              </b-form-checkbox>
                            </div>
                          </b-col>
                        </b-row>
                      </div>
                    </div>
                    <div class="col-md-12" v-if="smsConfigData.enableSMS == 'true'">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="account_id" class="form-control-label">
                              {{ formTranslation.pro_setting.account_sid }}
                            </label>
                            <input
                                type="text"
                                id="account_id"
                                :placeholder="formTranslation.settings.plh_enter_acc_sid"
                                class="form-control"
                                name="account_id"
                                v-model="smsConfigData.account_id"
                            />
                          </div>
                          <div v-if="smsSubmitted && !$v.smsConfigData.account_id.required"
                               class="invalid-feedback">{{ formTranslation.pro_setting.account_sid + ' ' + formTranslation.common.required }}
                          </div>
                        </div>
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="auth_token" class="form-control-label"
                            >{{ formTranslation.pro_setting.auth_token }}
                            </label>
                            <input
                                type="text"
                                id="auth_token"
                                :placeholder="formTranslation.settings.plh_auth_token"
                                class="form-control"
                                name="auth_token"
                                v-model="smsConfigData.auth_token"
                            />
                            <div v-if="smsSubmitted && !$v.smsConfigData.auth_token.required"
                                 class="invalid-feedback">{{ formTranslation.pro_setting.auth_token + ' ' + formTranslation.common.required }}
                            </div>
                          </div>
                        </div>
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="to_number" class="form-control-label"
                            >{{ formTranslation.pro_setting.phone_number }}
                            </label>
                            <input
                                type="text"
                                id="to_number"
                                :placeholder="formTranslation.settings.plh_enter_number"
                                class="form-control"
                                name="to_number"
                                v-model="smsConfigData.to_number"
                            />
                            <div v-if="smsSubmitted && !$v.smsConfigData.to_number.required"
                                 class="invalid-feedback">{{ formTranslation.pro_setting.phone_number + ' ' + formTranslation.common.required }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row" v-if="smsConfigData.enableSMS == 'true'">
                    <div class="col-md-12">
                      <div class="d-flex justify-content-end">
                        <button class="btn btn-sm  btn-primary " type="button" @click="$refs.NotificationTestModal.modalOpen = true; $refs.NotificationTestModal.notificationType='sms'"><i class="fas fa-sms"></i> {{formTranslation.widgets.send_test_sms}}</button>
                        <button v-if="!smsConfigDataLoading" class="btn btn-primary" type="submit">
                          <i class="fa fa-save"></i> {{ formTranslation.common.save }}
                        </button>
                        <button v-else class="btn btn-primary" type="submit" disabled> <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="col-md-7" v-if="smsConfigData.enableSMS == 'true'">
                <twillo-guide twillo-type="sms"></twillo-guide>
              </div>
            </div>
            <div class="row" v-if="userData.pro_version >= '1.2.0'">
              <div class="col-md-5">
                <form
                    id="kcwhatsAppForm"
                    name="kcwhatsAppForm"
                    @submit.prevent="saveWhatsAppConfigData('submit')"
                    :novalidate="true"
                    enctype="multipart/form-data">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <b-row class="mt-2 ml-4">
                          <b-col sm="12" md="12" lg="12">
                            <div class="form-group">
                              <b-form-checkbox
                                  size="md"
                                  id="enable-whatsapp"
                                  v-model="whatsAppConfigData.enableWhatsApp"
                                  @change="saveWhatsAppConfigData('checkbox')"
                                  name="enable-whatsapp"
                                  value="true"
                                  unchecked-value="false"
                                  switch
                              >
                                <b> {{ formTranslation.pro_setting.twilo_whatsapp_configration }} </b>
                              </b-form-checkbox>
                            </div>
                          </b-col>
                        </b-row>
                      </div>
                    </div>
                    <div class="col-md-12" v-if="whatsAppConfigData.enableWhatsApp == 'true'">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="wa_account_id" class="form-control-label">
                              {{ formTranslation.pro_setting.account_sid }}
                            </label>
                            <input
                                type="text"
                                id="wa_account_id"
                                :placeholder="formTranslation.settings.plh_enter_acc_sid"
                                class="form-control"
                                name="wa_account_id"
                                v-model="whatsAppConfigData.wa_account_id"
                            />
                            <div v-if="whatSubmitted && !$v.whatsAppConfigData.wa_account_id.required"
                                 class="invalid-feedback">{{ formTranslation.pro_setting.account_sid + ' ' + formTranslation.common.required }}
                            </div>
                          </div>
                        </div>
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="wa_auth_token" class="form-control-label"
                            >{{ formTranslation.pro_setting.auth_token }}
                            </label>
                            <input
                                type="text"
                                id="wa_auth_token"
                                :placeholder="formTranslation.settings.plh_auth_token"
                                class="form-control"
                                name="wa_auth_token"
                                v-model="whatsAppConfigData.wa_auth_token"
                            />
                            <div v-if="whatSubmitted && !$v.whatsAppConfigData.wa_auth_token.required"
                                 class="invalid-feedback">{{ formTranslation.pro_setting.auth_token + ' ' + formTranslation.common.required }}
                            </div>
                          </div>
                        </div>
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="wa_to_number" class="form-control-label"
                            >{{ formTranslation.pro_setting.phone_number }}
                            </label>
                            <input
                                type="text"
                                id="wa_to_number"
                                :placeholder="formTranslation.settings.plh_enter_number"
                                class="form-control"
                                name="wa_to_number"
                                v-model="whatsAppConfigData.wa_to_number"
                            />
                            <div v-if="whatSubmitted && !$v.whatsAppConfigData.wa_to_number.required"
                                 class="invalid-feedback">{{ formTranslation.pro_setting.phone_number + ' ' + formTranslation.common.required }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row" v-if="whatsAppConfigData.enableWhatsApp == 'true'">
                    <div class="col-md-12">
                      <div class="d-flex justify-content-end">
                        <button class="btn btn-sm  btn-primary " type="button" @click="$refs.NotificationTestModal.modalOpen = true; $refs.NotificationTestModal.notificationType='whatsapp'"><i class="fab fa-whatsapp"></i> {{formTranslation.widgets.send_test_whatsapp}}</button>
                        <button v-if="!whatsappConfigDataLoading" class="btn btn-primary" type="submit">
                          <i class="fa fa-save"></i> {{ formTranslation.common.save }}
                        </button>
                        <button v-else class="btn btn-primary" type="submit" disabled> <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="col-md-7" v-if="whatsAppConfigData.enableWhatsApp == 'true'">
                <twillo-guide twillo-type="whatapps"></twillo-guide>
              </div>
            </div>
          </div>
        </div>
        <hr class="p-2 m-0"/>
        <div class="row p-2">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.pro_setting.google_account_setting }}
            </h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">

            <div class="row">
              <div class="col-md-5">
                <form
                    id="googleCalform"
                    name="googleCalform"
                    @submit.prevent="saveGoogleCalenderConfigData('submit')"
                    :novalidate="true"
                    enctype="multipart/form-data"
                >
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <b-row class="mt-2 ml-4">
                          <b-col sm="12" md="12" lg="12">
                            <div class="form-group">
                              <b-form-checkbox
                                  size="md"
                                  id="google-cal-on"
                                  v-model="googleCalData.enableCal"
                                  @change="saveGoogleCalenderConfigData('checkbox')"
                                  name="google-cal-on"
                                  value="true"
                                  unchecked-value="false"
                                  switch
                              >
                                <b> {{ formTranslation.common.google_calendar_configuration }} </b>
                              </b-form-checkbox>
                            </div>
                          </b-col>
                        </b-row>
                      </div>
                    </div>
                    <div class="col-md-12" v-if="googleCalData.enableCal == 'true'">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="client_id" class="form-control-label"
                            >{{ formTranslation.common.google_calendar_client_id }}
                            </label>
                            <input
                                type="text"
                                id="client_id"
                                class="form-control"
                                name="client_id"
                                v-model="googleCalData.client_id"
                            />
                            <div v-if="googlecalendarSubmitted && !$v.googleCalData.client_id.required"
                                 class="invalid-feedback">
                              {{ formTranslation.common.google_calendar_client_id + ' ' + formTranslation.common.required }}
                            </div>
                          </div>
                        </div>
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="client_secret" class="form-control-label"
                            >{{ formTranslation.common.google_calendar_client_secret }}
                            </label>
                            <input
                                type="text"
                                id="client_secret"
                                class="form-control"
                                name="client_secret"
                                v-model="googleCalData.client_secret"
                            />
                            <div v-if="googlecalendarSubmitted && !$v.googleCalData.client_secret.required"
                                 class="invalid-feedback">
                              {{ formTranslation.common.google_calendar_client_secret + ' ' + formTranslation.common.required }}
                            </div>
                          </div>
                        </div>
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="app_name" class="form-control-label"
                            >{{ formTranslation.common.app_name }}
                            </label>
                            <input
                                type="text"
                                id="app_name"
                                class="form-control"
                                name="app_name"
                                v-model="googleCalData.app_name"
                            />
                            <div v-if="googlecalendarSubmitted && !$v.googleCalData.app_name.required"
                                 class="invalid-feedback">{{ formTranslation.common.app_name + ' ' + formTranslation.common.required }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row" v-if="googleCalData.enableCal == 'true'">
                    <div class="col-md-12">
                      <div class="d-flex justify-content-end">
                        <button v-if="!loading" class="btn btn-primary" type="submit">
                          <i class="fa fa-save"></i> {{ formTranslation.common.save }}
                        </button>
                        <button v-else class="btn btn-primary" type="submit" disabled>
                          <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div class="col-md-7" v-if="googleCalData.enableCal == 'true'">
                <div class="row">
                  <div class="col-md-12">
                    <h4 class="mb-3">
                      {{ formTranslation.common.guide_to_setup_google_calender }}
                    </h4>
                  </div>
                </div>
                <b-list-group>
                  <b-list-group-item
                  >{{ 'Step:1' }}
                    <a href="https://apps.iqonic.design/docs/product/kivicare/google-calendar/" target="_blank">
                      {{ formTranslation.pro_setting.please_refer_link }}</a
                    ></b-list-group-item
                  >
                </b-list-group>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <b-row class="mt-2 ml-4">
                <b-col sm="12" md="12" lg="12">
                  <div class="form-group">
                    <b-form-checkbox
                        size="md"
                        id="patient-cal-on"
                        v-model="patientCalOn"
                        @change="savePatientCalendarStatus"
                        name="patient-cal-on"
                        switch
                    >
                      <b> {{ formTranslation.common.setting_for_add_event_in_calendar_for_patient }} </b>
                    </b-form-checkbox>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
        <hr class="p-2 m-0"/>
        <div class="row p-2">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.patient_encounter.encounters + ' ' + formTranslation.common.settings}}
            </h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <b-row class="mt-2 ml-4">
                <b-col sm="12" md="12" lg="12">
                  <div class="form-group">
                    <b-form-checkbox
                        size="md"
                        id="clinical-detail-include"
                        v-model="clinicalDetailInclude"
                        @change="saveEncounterClinicalDetailsIncludeInPrescriptionPrint"
                        name="clinical-detail-include"
                        switch
                    >
                      <b> {{ formTranslation.pro_setting.clinical_detail }} </b>
                    </b-form-checkbox>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <b-row class="mt-2 ml-4">
                <b-col sm="12" md="12" lg="12">
                  <div class="form-group">
                    <b-form-checkbox
                        size="md"
                        id="encounter_custom_field_include"
                        v-model="encounterCustomFieldInclude"
                        @change="saveEncounterCustomFieldIncludeInPrescriptionPrint"
                        name="encounter_custom_field_include-detail-include"
                        switch
                    >
                      <b> {{ formTranslation.pro_setting.include_encounter_custom_fields_in_print }} </b>
                    </b-form-checkbox>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <b-row class="mt-2 ml-4">
                <b-col sm="12" md="12" lg="12">
                  <div class="form-group">
                    <b-form-checkbox
                        size="md"
                        id="clinical-detail-hide-in-patient"
                        v-model="clinicalDetailHideInPatient"
                        @change="saveEncounterClinicalDetailsHideInPatientDashboard()"
                        name="clinical-detail-hide-in-patient"
                        switch
                    >
                      <b> {{ formTranslation.pro_setting.clinical_detail_patient_hide }} </b>
                    </b-form-checkbox>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
        <hr class="p-2 m-0"/>
        <div class="row p-2">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.pro_setting.copy_right_text }}
            </h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="client_secret" class="form-control-label"
              >{{ formTranslation.pro_setting.change_copy_right_text }}
              </label>
              <input
                  type="text"
                  id="copyrighttext"
                  class="form-control"
                  name="client_secret"
                  v-model="copyrighttext"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary" @click="saveSiteCopyrightText">
                <i :class="copyrighttextLoading ?'fa fa-save' : 'fa fa-spinner fa-spin' "></i> {{ formTranslation.common.save }}
              </button>
            </div>
          </div>
        </div>
      </b-overlay>
    </div>
  </b-card>
</template>
<script>
import { post,get } from "../../config/request";
import { Chrome } from "vue-color";
import {required, numeric, alpha, email, minLength, maxLength} from "vuelidate/lib/validators";
import twilloGuide from "./twilloGuide";
import {phoneNumber} from "../../config/helper";
import NotificationTestModal from "../Notification/NotificationTestModal";
export default {
  name: "CommanSetting",
  components: {
    "chrome-color-picker": Chrome,
    twilloGuide,
    NotificationTestModal
  },
  data: () => {
    return {
      smsSubmitted:false,
      request_status:'off',
      whatSubmitted:false,
      on: false,
      themeColor: "#4874dc",
      hex: "",
      isOpen: false,
      isEnabled: "",
      imagePreview:
      window.request_data.kiviCarePluginURL + "assets/images/logo-banner.png",
      rtlMode: false,
      loading: false,
      smsConfigDataLoading: false,
      whatsappConfigDataLoading: false,
      submitted: false,
      smsConfigData: {},
      whatsAppConfigData: {},
      googleCalData: {},
      clinicalDetailHideInPatient:false,
      langsOption: [],
      patientCalOn: false,
      clinicalDetailInclude:false,
      encounterCustomFieldInclude:false,
      logoURL : window.request_data.kiviCarePluginURL + 'assets/images/logo-banner.png',
      loaderURL:window.request_data.loaderImage,
      EnableWordpressStatus:false,
      wordpressLogoImagePreview:window.request_data.wordpress_logo,
      copyrighttext:window.request_data.copyrightText,
      copyrighttextLoading:true,
      formLoader:true,
      googlecalendarSubmitted:false,
      smsConfigSubmitted:false,
      whatsappConfigSubmitted:false,
      new_site_logo: '',
      new_site_loader:'',
      wordpress_logo:'',
      customNotification:{
        enableSMS:'no',
        enableWhatsapp:'no'
      }
    };
  },
  validations:{
    smsConfigData:{
      to_number:{
        required
      },
      account_id: {
        required
      },
      auth_token: {
        required
      },
    },
    whatsAppConfigData:{
      wa_to_number:{
        required
      },
      wa_account_id:{
        required
      },
      wa_auth_token: {
        required
      },
    },
    googleCalData:{
      enableCal:{
        required
      },
      client_id:{
        required
      },
      client_secret:{
        required
      },
      app_name:{
        required
      },
    }
  },
  mounted() {
    this.new_site_logo = this.formTranslation.common.no_file_chosen
    this.new_site_loader = this.formTranslation.common.no_file_chosen
    this.new_wordpress_logo = this.formTranslation.common.no_file_chosen
    this.smsConfigData = this.defaultSMSData();
    this.whatsAppConfigData = this.defaultWhatsAppData();
    this.googleCalData = this.defaultGoogleData();
    this.getAllProSettingsData();
    this.themeColor = this.getColor;
    this.hex = this.themeColor;
    document.documentElement.style.setProperty("--primary", this.getColor);
    if (this.getMode == "true") {
      this.rtlMode = true;
      document.body.classList.add("rtl");
      var h1 = document.getElementsByTagName("html")[0]; // Get the first <h1> element in the document
      var att = document.createAttribute("dir"); // Create a "class" attribute
      att.value = "rtl"; // Set the value of the class attribute
      h1.setAttributeNode(att);
      
    } else {
      document.body.classList.remove("rtl");
      document.getElementsByTagName("html")[0].removeAttribute("dir");
    }
    this.getModule();
  },
  methods: {
    defaultSMSData() {
      return {
        account_id: "",
        auth_token: "",
        to_number: "",
        enableSMS: false,
      };
    },
    defaultWhatsAppData() {
      return {
        wa_account_id: "",
        wa_auth_token: "",
        wa_to_number: "",
        enableWhatsApp: false,
      };
    },
    defaultGoogleData() {
      return {
        client_id: "",
        client_secret: "",
        app_name: "",
        enableCal: false,
      };
    },
    getAllProSettingsData() {
      if(this.userData.addOns.kiviPro !== true){
        this.formLoader=false
        return;
      }
      this.formLoader =true;
      get("get_all_pro_settings_value", {})
          .then((response) => {
            this.formLoader =false;

            if (response.data.whatsapp.status !== undefined
                && response.data.whatsapp.status === true) {
              this.whatsAppConfigData = response.data.whatsapp.data;
            }
            if (response.data.sms.status !== undefined
                && response.data.sms.status === true) {
              this.smsConfigData = response.data.sms.data;
            }

            if (response.data.google_calendar !== undefined
                && response.data.google_calendar.status !== undefined
                && response.data.google_calendar.status === true) {
              this.googleCalData = response.data.google_calendar.data;
            }
            if (response.data.patient_calendar !== undefined
                && response.data.patient_calendar.status !== undefined
                && response.data.patient_calendar.status === true) {
              this.patientCalOn = response.data.patient_calendar.data;
            }

            if (response.data.encounter_clinical_detail !== undefined
                && response.data.encounter_clinical_detail.status !== undefined
                && response.data.encounter_clinical_detail.status === true) {
              this.clinicalDetailInclude = (response.data.encounter_clinical_detail.data == 'true' || response.data.encounter_clinical_detail.data == true) ? true : false;
              this.clinicalDetailHideInPatient = (response.data.encounter_clinical_detail.hideInPatient == 'true' || response.data.encounter_clinical_detail.hideInPatient == true) ? true : false;
              this.encounterCustomFieldInclude = (response.data.encounter_clinical_detail.custom_field == 'true' || response.data.encounter_clinical_detail.custom_field == true) ? true : false;
            }
            if (response.data.wordpress_logo_data !== undefined &&
                response.data.wordpress_logo_data.status !== undefined
                && response.data.wordpress_logo_data.logo !== undefined) {
              this.EnableWordpressStatus = response.data.wordpress_logo_data.status
              this.wordpressLogoImagePreview = response.data.wordpress_logo_data.logo
            }
            if (response.data.custom_notification) {
              this.customNotification = response.data.custom_notification
            }

          })
          .catch((error) => {
            this.formLoader =false;
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          });
    },
    uploadsiteLogo() {
      if(this.userData.addOns.kiviPro !== true){
        return;
      }
      let _this = this;

      var custom_uploader = kivicareCustomImageUploader(this.formTranslation)

      custom_uploader.on('select', function () {
        var attachment = custom_uploader.state().get('selection').first().toJSON();
        _this.imagePreview = attachment.url;
        _this.new_site_logo = attachment.filename
        post("upload_logo", {site_logo:attachment.id})
            .then((response) => {
              if (
                  response.data.status !== undefined &&
                  response.data.status === true
              ) {
                displayMessage(response.data.message)
                _this.imagePreview = response.data.data;
                _this.$store.dispatch("userDataModule/fetchUserData", {});
              }else{
                displayErrorMessage(response.data.message)
              }
            })
            .catch((error) => {
              console.log(error);
            });
      });

      //Open the uploader dialog
      custom_uploader.open();

    },
    uploadSiteLoader(){
      if(this.userData.addOns.kiviPro !== true){
        return;
      }

      let _this = this;

      var custom_uploader = kivicareCustomImageUploader(this.formTranslation)

      custom_uploader.on('select', function () {
        var attachment = custom_uploader.state().get('selection').first().toJSON();
        _this.loaderURL = attachment.url;
        _this.new_site_loader = attachment.filename
        post("upload_loader", {site_loader:attachment.id})
            .then((response) => {
              if (
                  response.data.status !== undefined &&
                  response.data.status === true
              ) {
                _this.loaderURL = response.data.data;
                displayMessage(response.data.message)
              }
              else{
                displayErrorMessage(response.data.message)
                _this.loaderURL = window.request_data.loaderImage;
              }
            })
            .catch((error) => {
              _this.loaderURL =window.request_data.loaderImage;
              console.log(error);
            });
      });

      //Open the uploader dialog
      custom_uploader.open();
    },
    setSiteThemeColor() {
      if(this.userData.addOns.kiviPro !== true){
        return;
      }
      document.documentElement.style.setProperty("--primary", this.themeColor);
      post("update_theme_color", { color: this.themeColor })
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              displayMessage(response.data.message);
              this.themeColor = response.data.data;
              localStorage.setItem('temp_color',response.data.data)
              // window.location.reload()
            }
          })
          .catch((error) => {
            console.log(error);
          });
    },
    setSiteRTLMode() {
      if(this.userData.addOns.kiviPro !== true){
        return;
      }
      var state = this.rtlMode;
      if (state == true) {
        document.body.classList.add("rtl");
        var h1 = document.getElementsByTagName("html")[0];
        var att = document.createAttribute("dir");
        att.value = "rtl";
        h1.setAttributeNode(att);
      } else {
        document.body.classList.remove("rtl");
        document.getElementsByTagName("html")[0].removeAttribute("dir");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      get("update_theme_rtl", { rtl: state })
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              this.isEnabled = response.data.data;
              displayMessage(response.data.message);
              this.$store.dispatch("userDataModule/fetchUserData", {});
            }
          })
          .catch((error) => {
            console.log(error);
          });
    },
    setWordpressLogoStatus:function (){
      if(this.userData.addOns.kiviPro !== true){
        return;
      }
      post("save_wordpress_logo", {status:this.EnableWordpressStatus})
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              this.EnableWordpressStatus = response.data.data ? '1' : '0';
              this.$store.commit('FETCH_WORDPRESS_LOGO',{ data : {
                  logo: this.wordpressLogoImagePreview,
                  status: this.EnableWordpressStatus
                }})
            }
          })
          .catch((error) => {
            console.log(error);
          });
    },
    saveWordpressLogoImage:function(){
      if(this.userData.addOns.kiviPro !== true){
        return;
      }

      let _this = this;

      var custom_uploader = kivicareCustomImageUploader(this.formTranslation)

      custom_uploader.on('select', function () {
        var attachment = custom_uploader.state().get('selection').first().toJSON();
        _this.wordpressLogoImagePreview = attachment.url;
        _this.new_wordpress_logo = attachment.filename
        post("save_wordpress_logo", {wordpress_logo:attachment.id})
            .then((response) => {
              if (
                  response.data.status !== undefined &&
                  response.data.status === true
              ) {
                _this.wordpressLogoImagePreview = response.data.data;
                _this.$store.commit('FETCH_WORDPRESS_LOGO',{ data : {
                    logo: response.data.data,
                    status: _this.EnableWordpressStatus
                  }})
                displayMessage(response.data.message)
              }
              else{
                displayErrorMessage(response.data.message)
                _this.loaderURL = window.request_data.loaderImage;
              }
            })
            .catch((error) => {
              _this.loaderURL =window.request_data.loaderImage;
              console.log(error);
            });
      });

      //Open the uploader dialog
      custom_uploader.open();
    },
    saveSmsConfigData(type) {
      if(this.userData.addOns.kiviPro !== true){
        return;
      }

      let configOk =  type === 'checkbox' && this.smsConfigData.enableSMS === 'false'
      if(!configOk ){
        // validation part
        this.smsConfigDataLoading = true;
        this.smsSubmitted = true;
        this.$v.$touch();
        if (this.$v.smsConfigData.$invalid) {
          this.smsConfigDataLoading = false;
          return;
        }
      }
      if(!configOk && this.customNotification.enableSMS && ['sms'].includes(this.customNotification.enableSMS)){
        $.confirm({
          title: this.formTranslation.clinic_schedule.dt_are_you_sure,
          content: this.formTranslation.enabling_twilio_sms_will_disable_custom_notification_sms,
          type: 'red',
          buttons: {
            ok: {
              text: this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                this.customNotification.enableSMS = 'no';
                this.saveCustomNotificationApi('sms','no');
                this.saveSmsConfigDataApi();
              }
            },
            cancel:{
              text:this.formTranslation.common.cancel,
              action: () => {
                this.smsConfigData.enableSMS = 'false';
              }
            }
          }
        });
      }else{
        this.saveSmsConfigDataApi();
      }
    },
    saveSmsConfigDataApi(){
      post("sms_config_save", this.smsConfigData)
          .then((response) => {
            this.smsSubmitted = false;
            this.smsConfigDataLoading = false;
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              displayMessage(response.data.message);
            } else {
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            this.smsSubmitted = false;
            this.smsConfigDataLoading = false;
            this.submitted = false;
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          });
    },
    saveWhatsAppConfigData (type){
      if(this.userData.addOns.kiviPro !== true){
        return;
      }
      let configOk =  type === 'checkbox' && this.whatsAppConfigData.enableWhatsApp === 'false'
      if(!configOk ){
        // validation part
        this.whatsappConfigDataLoading = true;
        this.whatSubmitted = true;
        this.$v.$touch();
        if (this.$v.whatsAppConfigData.$invalid) {
          this.whatsappConfigDataLoading = false;
          return;
        }
      }
      if(!configOk && this.customNotification.enableWhatsapp && ['yes'].includes(this.customNotification.enableWhatsapp)){
        $.confirm({
          title: this.formTranslation.clinic_schedule.dt_are_you_sure,
          content: this.formTranslation.enabling_twilio_whatsApp_will_disable_custom_notification_WhatsApp,
          type: 'red',
          buttons: {
            ok: {
              text: this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                this.customNotification.enableWhatsapp = 'no';
                this.saveCustomNotificationApi('whatsapp','no');
                this.saveWhatsappApiCall();
              }
            },
            cancel:{
              text:this.formTranslation.common.cancel,
              action: () => {
                this.whatsAppConfigData.enableWhatsApp = 'false';
              }
            }
          }
        });
      }else{
        this.saveWhatsappApiCall();
      }
    },
    saveWhatsappApiCall(){
      post("whatsapp_config_save", this.whatsAppConfigData)
          .then((response) => {
            this.whatSubmitted = false;
            this.whatsappConfigDataLoading = false;
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              displayMessage(response.data.message);
            } else {
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            this.whatSubmitted = false;
            this.whatsappConfigDataLoading = false;
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          });
    },
    saveGoogleCalenderConfigData(type) {
      if(this.userData.addOns.kiviPro !== true){
        return;
      }
      this.loading = true;
      let configOk =  type === 'checkbox' && this.googleCalData.enableCal === 'false'
      if(!configOk ){
        this.googlecalendarSubmitted=true
        this.$v.$touch();
        if (this.$v.googleCalData.$invalid) {
          return;
        }
      }
      post("google_calender_config",this.googleCalData)
          .then((response) => {
            this.loading = false;
            this.googlecalendarSubmitted=false
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              displayMessage(response.data.message);
              this.$router.push({ name: "setting.comman_settings" });
            } else {
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            this.loading = false;
            this.googlecalendarSubmitted=false
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          });
    },
    savePatientCalendarStatus(){
      if(this.userData.addOns.kiviPro !== true){
        return;
      }
      var state = this.patientCalOn;
      get("save_patient_google_cal", { pCal: state })
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              // this.patientCalOn = response.data.data;
              displayMessage(response.data.message);
              this.$store.dispatch("userDataModule/fetchUserData", {});
            }
          })
          .catch((error) => {
            console.log(error);
          });
    },
    saveEncounterClinicalDetailsIncludeInPrescriptionPrint:function(event){
      get("edit_clinical_detail_include", {status:this.clinicalDetailInclude})
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              displayMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          });
    },
    saveEncounterCustomFieldIncludeInPrescriptionPrint:function(event){
      get("edit_encounter_custom_field_include", {status:this.encounterCustomFieldInclude})
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              displayMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          });
    },
    saveEncounterClinicalDetailsHideInPatientDashboard:function(event){
      get("edit_clinical_detail_hide_in_patient", {status:this.clinicalDetailHideInPatient})
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              displayMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          });
    },
    saveSiteCopyrightText(){
      if(this.userData.addOns.kiviPro !== true){
        return;
      }
      this.copyrighttextLoading = false;
      get("save_copy_right_text", { text: this.copyrighttext })
          .then((response) => {
            this.copyrighttextLoading = true;
            if (response.data.status !== undefined && response.data.status === true) {
              this.$store.commit('FETCH_FOOTER_COPYRIGHT_TEXT',{data:this.copyrighttext})
              displayMessage(response.data.message);
            }else{
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            this.copyrighttextLoading = true;
            console.log(error);
          });
    },
    getModule:function (){
        if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
        this.request_status = window.request_data.link_show_hide;
        }
    },
    saveCustomNotification:function (type){
      let status = ''
      if(type === 'sms'){
        status = this.customNotification.enableSMS;
        if(this.smsConfigData.enableSMS && [true,'true'].includes(this.smsConfigData.enableSMS) ){

          $.confirm({
            title: this.formTranslation.clinic_schedule.dt_are_you_sure,
            content: this.formTranslation.enabling_custom_notification_sms_will_disable_twillo_sms,
            type: 'red',
            buttons: {
              ok: {
                text: this.formTranslation.common.yes,
                btnClass: 'btn-danger',
                keys: ['enter'],
                action: () => {
                  this.smsConfigData.enableSMS = 'false';
                  this.saveSmsConfigData('checkbox');
                  this.saveCustomNotificationApi(type,status)
                }
              },
              cancel:{
                text:this.formTranslation.common.cancel
              }
            }
          });
        }else{
          this.saveCustomNotificationApi(type,status)   
        }
      }else{
        status = this.customNotification.enableWhatsapp
        if(this.whatsAppConfigData.enableWhatsapp && [true,'true'].includes(this.whatsAppConfigData.enableWhatsapp) ){

          $.confirm({
            title: this.formTranslation.clinic_schedule.dt_are_you_sure,
            content: this.formTranslation.enabling_custom_notification_sms_will_disable_twillo_sms,
            type: 'red',
            buttons: {
              ok: {
                text: this.formTranslation.common.yes,
                btnClass: 'btn-danger',
                keys: ['enter'],
                action: () => {
                  this.whatsAppConfigData.enableWhatsapp = 'false';
                  this.saveWhatsAppConfigData('checkbox');
                  this.saveCustomNotificationApi(type,status)
                }
              },
              cancel:{
                text:this.formTranslation.common.cancel
              }
            }
          });
        }else{
          this.saveCustomNotificationApi(type,status)
        }

      }

    },
    saveCustomNotificationApi:function (type,status){
      post('save_custom_notification_setting',{ "type":type, "status" : status})
          .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message);
            }else{
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }
  },
  computed: {
    userData() {
      return this.$store.state.userDataModule.user;
    },
    getColor() {
      if(this.userData.addOns.kiviPro !== true){
        return "#4874dc"
      }else{
        return this.userData.theme_color;
      }
    },
    getMode() {
      return this.userData.theme_mode;
    },
    getSiteLogo() {
      return this.userData.site_logo;
    },
  },
  watch: {
    getMode(oldMode, newMode) {
      this.rtlMode = newMode;
    }
  },
};
</script>
<style scoped>

.kc-thm-st {
  display: grid;
}

</style>