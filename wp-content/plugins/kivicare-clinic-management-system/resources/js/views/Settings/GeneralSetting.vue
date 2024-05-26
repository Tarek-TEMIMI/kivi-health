<template>
  
    <b-card class="card-body" header-tag="header" footer-tag="footer">
      <div class="page-loader-section" v-if="formLoader">
        <loader-component-2></loader-component-2>
      </div>
      <div v-else>
        <div class="row">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.common.settings}}
              <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#general-setting" target="_blank"><i class="fa fa-question-circle"></i></a>
            </h2>
          </div>
        </div>
        <hr class="mt-2 mb-2"/>
        <form
            id="general_setting_form"
            name="patient_form"
            @submit.prevent="handleSubmit"
            :novalidate="true"
            enctype="multipart/form-data"
            v-if="request_status == 'off' || showOption" >
          <b-row class="mt-2 ml-4" >
            <b-col sm="12" md="12" lg="12">
              <div class="form-group">
                <b-form-checkbox
                    size="md"
                    id="checkbox-1"
                    v-model="request_status"
                    name="checkbox-1"
                    value="on"
                    unchecked-value="off"
                    switch
                >
                  <b class="form-control-label"> {{ formTranslation.common.hide_request_features }} </b>
                </b-form-checkbox>
              </div>
            </b-col>
          </b-row>
          <b-row class="mt-2 ml-1" v-if="request_status == 'on' && showOption" >
            <b-col sm="12" md="12" lg="12">
              <div class="form-group">
                <b-form-checkbox
                    size="md"
                    id="checkbox-2"
                    v-model="request_status"
                    name="checkbox-2"
                    value="on"
                    unchecked-value="off"
                    @change="removeFeatureRequest"
                >
                  <b class="form-control-label"> {{ formTranslation.common.remove_request_features }} </b>
                </b-form-checkbox>
              </div>
            </b-col>
          </b-row>
          <div class="row">
            <div class="col-md-12">
              <div class="d-flex justify-content-end">
                <button type="submit" :disabled="isSubmited" id="btn-general-submit" class="btn btn-primary">
                  <i class="fa fa-save"></i> {{ formTranslation.common.save }}
                </button>
              </div>
            </div>
          </div>
        </form>
        <hr class="mt-2 mb-2" v-if="showOption"/>
        <div class="row">
          <div class="col-12">
            <h2 class="mb-0">{{ formTranslation.common.date_format_setting  + ' ' + formTranslation.common.deprecated }} 
              <a href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#general-setting" target="_blank"><i class="fa fa-question-circle"></i></a>
            </h2>
          </div>
        </div>
        <br>
        <form
            id="date_format_form"
            @submit.prevent="handleDateFormatSubmit"
            :novalidate="true"
        >
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label for="date_format" class="form-control-label"> {{formTranslation.common.custom_date_format}} </label>
                <div class="row">
                  <div class="col-md-4">
                    <input id="date_format"
                           v-model="dateFormat"
                           :placeholder="formTranslation.common.custom_date_format"
                           name="date_format" type="text" class="form-control mb-2" disabled>
                  </div>
                  <div class="col-md-4">
                    <button type="submit" :disabled="dateFormatLoading"  class="btn btn-primary mb-2" disabled>
                      <i :class="dateFormatLoading ? 'fa fa-spinner fa-spin' : 'fa fa-save'"></i> {{ dateFormatLoading ? formTranslation.common.loading : formTranslation.common.save }}
                    </button>
                  </div>
                </div>
                <span id="date_format_output" class="text-primary font-weight-bold">
                  {{formTranslation.appointments.plh_date + ': ' + dateFormatOutput}}
                </span>
              </div>
            </div>
          </div>
        </form>
        <hr class="mt-2 mb-2"/>
        <div class="row">
          <div class="col-12">
            <h2 class="mb-0">{{ formTranslation.common.clinic_currency }}</h2>
          </div>
        </div><br>
        <form
            id="general_clinic_form"
            @submit.prevent="handleCliniSubmit"
            :novalidate="true"
            enctype="multipart/form-data"
        >
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label for="currency_prefix" class="form-control-label"> {{formTranslation.clinic.currency_prefix}} </label>
                <input id="currency_prefix"
                       v-model="clinicData.currency_prefix"
                       :placeholder="formTranslation.clinic.currency_prefix_plh"
                       name="currency_prefix" type="text" class="form-control">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="currency_postfix" class="form-control-label"> {{formTranslation.clinic.currency_postfix}} </label>
                <input id="currency_postfix"
                       v-model="clinicData.currency_postfix"
                       :placeholder="formTranslation.clinic.currency_postfix_plh"
                       name="currency_postfix" type="text" class="form-control">
              </div>
            </div>
            <!-- <div class="col-md-4" v-if="false">
              <div class="form-group">
                <label for="currency_postfix" class="form-control-label"> {{formTranslation.clinic.currency_decimals}} </label>
                <div class="kivi-pr">
                  <multi-select
                      deselect-label=""
                      select-label=""
                      v-model="clinicData.decimal_point"
                      id="currency_decimals"
                      :tag-placeholder="formTranslation.clinic.plh_currency_decimal"
                      :placeholder="formTranslation.clinic.plh_select_decimal"
                      label="label" track-by="id" :options="decimals"
                  ></multi-select>
                  <span class="select_clear_btn"  @click="clinicData.decimal_point = { id: 0, label: '100' }">×</span>
                </div>
              </div>
            </div> -->
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="d-flex justify-content-end">
                <button type="submit" :disabled="isSubmitedClinic" id="btn-clinic-submit" class="btn btn-primary">
                  <i class="fa fa-save"></i> {{ formTranslation.common.save }}
                </button>
              </div>
            </div>
          </div>
        </form>
      <hr class="mt-2 mb-2" />
      <div class="row">
        <div class="col-12">
          <h2 class="mb-0">{{ formTranslation.common.default_country_code }}</h2>
        </div>
      </div><br>
      <form id="default_country_code" @submit.prevent="handleCountryCodeSubmit" :novalidate="true"
        enctype="multipart/form-data">
        <div class="row">
          <div class="col-md-4">
            <div class="form-group country-code-inline-box">
              <label for="country_code" class="form-control-label"> {{ formTranslation.common.select_country_code }} </label>
              <VuePhoneNumberInput id="country_code" :default-country-code="defaultCountryCode" v-model="contact"
                @update="countryCodeUpdateHandaler" no-example clearable >
              </VuePhoneNumberInput>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="d-flex justify-content-end">
              <button type="submit" :disabled="isSubmitedCountryCode" id="btn-country-code-submit"
                class="btn btn-primary">
                <i class="fa fa-save"></i> {{ formTranslation.common.save }}
              </button>
            </div>
          </div>
        </div>
      </form>
      <hr class="mt-2 mb-2" />
        <div class="row">
          <div class="col-12">
            <h2 class="mb-0">{{ formTranslation.common.registration_shortcode_setting }} </h2>
          </div>
        </div>
        <br>
        <form
            id="user_registration"
            @submit.prevent="handleUserRegistrationShortcodeSettingSubmit"
            :novalidate="true"
        >
          <div class="row m-4">
            <div class="col-md-4">
              <div class="form-group">
                <b-form-checkbox
                    size="md"
                    id="doctor_register"
                    v-model="userRegistrationShortcodeSetting.status.doctor"
                    name="doctor_register"
                    value="on"
                    unchecked-value="off"
                    switch
                >
                  <b class="badge badge-primary" v-if="userRegistrationShortcodeSetting.status.doctor === 'on'">
                    {{formTranslation.common.active}}
                  </b>
                  <b class="badge badge-danger" v-else>
                    {{formTranslation.common.inactive}}
                  </b>
                  <b> {{formTranslation.common.default_status_when_doctor_register}}
                  </b>
                </b-form-checkbox>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <b-form-checkbox
                    size="md"
                    id="receptionist_register"
                    v-model="userRegistrationShortcodeSetting.status.receptionist"
                    name="receptionist_register"
                    value="on"
                    unchecked-value="off"
                    switch
                >
                  <b class="badge badge-primary" v-if="userRegistrationShortcodeSetting.status.receptionist === 'on'">
                    {{formTranslation.common.active}}
                  </b>
                  <b class="badge badge-danger" v-else>
                    {{formTranslation.common.inactive}}
                  </b>
                  <b> {{formTranslation.common.default_status_when_receptionist_register}} </b>
                </b-form-checkbox>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <b-form-checkbox
                    size="md"
                    id="patient_register"
                    v-model="userRegistrationShortcodeSetting.status.patient"
                    name="patient_register"
                    value="on"
                    unchecked-value="off"
                    switch
                >
                  <b class="badge badge-primary" v-if="userRegistrationShortcodeSetting.status.patient === 'on'">
                    {{formTranslation.common.active}}
                  </b>
                  <b class="badge badge-danger" v-else>
                    {{formTranslation.common.inactive}}
                  </b>
                  <b> {{formTranslation.common.default_status_when_patient_register}} </b>
                </b-form-checkbox>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <h3 class="mb-0"> {{ formTranslation.common.allow_user_role }} </h3>
            </div>
          </div>
          <div class="row m-4">
            <div class="col-md-4">
              <div class="form-group">
                <b-form-checkbox
                    size="md"
                    id="doctor_role"
                    v-model="userRegistrationShortcodeSetting.user_role.kiviCare_doctor"
                    name="doctor_role"
                    @change="validateCheckboxes('kiviCare_doctor')"
                    value="on"
                    unchecked-value="off"
                    switch
                >
                  <b class="badge badge-primary" v-if="userRegistrationShortcodeSetting.user_role.kiviCare_doctor === 'on'">
                    {{formTranslation.common.active}}
                  </b>
                  <b class="badge badge-danger" v-else>
                    {{formTranslation.common.inactive}}
                  </b>
                  <b> {{formTranslation.common.doctor_role}}
                  </b>
                </b-form-checkbox>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <b-form-checkbox
                    size="md"
                    id="receptionist_role"
                    v-model="userRegistrationShortcodeSetting.user_role.kiviCare_receptionist"
                    name="receptionist_role"
                    @change="validateCheckboxes('kiviCare_receptionist')"
                    value="on"
                    unchecked-value="off"
                    switch
                >
                  <b class="badge badge-primary" v-if="userRegistrationShortcodeSetting.user_role.kiviCare_receptionist === 'on'">
                    {{formTranslation.common.active}}
                  </b>
                  <b class="badge badge-danger" v-else>
                    {{formTranslation.common.inactive}}
                  </b>
                  <b> {{formTranslation.common.receptionist_role}} </b>
                </b-form-checkbox>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <b-form-checkbox
                    size="md"
                    id="patient_role"
                    v-model="userRegistrationShortcodeSetting.user_role.kiviCare_patient"
                    name="patient_role"
                    @change="validateCheckboxes('kiviCare_patient')"
                    value="on"
                    unchecked-value="off"
                    switch
                >
                  <b class="badge badge-primary" v-if="userRegistrationShortcodeSetting.user_role.kiviCare_patient === 'on'">
                    {{formTranslation.common.active}}
                  </b>
                  <b class="badge badge-danger" v-else>
                    {{formTranslation.common.inactive}}
                  </b>
                  <b> {{formTranslation.common.patient_role}} </b>
                </b-form-checkbox>
              </div>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-12 d-flex justify-content-end align-items-center" >
              <button type="submit" :disabled="userRegistrationShortcodeSettingLoading"  class="btn btn-primary mb-2">
                <i :class="userRegistrationShortcodeSettingLoading ? 'fa fa-spinner fa-spin' : 'fa fa-save'"></i> {{ userRegistrationShortcodeSettingLoading ? formTranslation.common.loading : formTranslation.common.save }}
              </button>
            </div>
          </div>
        </form>
        <hr class="mt-2 mb-2"/>
        <div class="row">
          <div class="col-12">
            <h2 class="mb-0">{{ formTranslation.common.google_recaptcha }}</h2>
          </div>
        </div>
        <br>
        <form
            id="google_recaptch_form"
            @submit.prevent="handleCaptchaSubmit"
            :novalidate="true"
        >
          <div class="row m-4">
            <div class="col-12">
              <div class="form-group">
                <b-form-checkbox
                    size="md"
                    id="google-captcha-checkbox"
                    v-model="googleCaptcha.status"
                    name="google-captcha-checkbox"
                    value="on"
                    unchecked-value="off"
                    switch
                    @change="handleCaptchaSubmit"
                >
                  <b> {{ formTranslation.common.enable_google_recaptcha }} </b>
                </b-form-checkbox>
              </div>
            </div>
          </div>
          <div class="row" v-if="googleCaptcha.status == 'on'">
            <div class="col-md-4">
              <div class="form-group">
                <label for="site_key" class="form-control-label"> {{formTranslation.common.site_key}} </label>
                <input id="site_key"
                       v-model="googleCaptcha.site_key"
                       :placeholder="formTranslation.common.site_key"
                       name="site_key" type="text" class="form-control">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="secret_key" class="form-control-label"> {{formTranslation.common.secret_key}} </label>
                <input id="secret_key"
                       v-model="googleCaptcha.secret_key"
                       :placeholder="formTranslation.common.secret_key"
                       name="secret_key" type="text" class="form-control">
              </div>
            </div>
          </div>
          <div class="row" v-if="googleCaptcha.status == 'on'">
            <div class="col-12" >
              <div class="row">
                <div class="col-md-12">
                  <h4 class="text-primary mb-3">
                    <a href="https://www.google.com/recaptcha/admin" target="_blank">
                      {{ formTranslation.common.google_recaptcha_refer_link}}</a>
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div class="row" v-if="googleCaptcha.status == 'on'">
            <div class="col-md-12">
              <div class="d-flex justify-content-end">
                <button type="submit" :disabled="googleRecaptchaLoading"  class="btn btn-primary">
                  <i :class="googleRecaptchaLoading ? 'fa fa-spinner fa-spin' : 'fa fa-save'"></i> {{ googleRecaptchaLoading ? formTranslation.common.loading : formTranslation.common.save }}
                </button>
              </div>
            </div>
          </div>
        </form>
        <hr class="mt-2 mb-2"/>
        <div class="row">
          <div class="col-12">
            <h2 class="mb-0">{{ formTranslation.common.user_registration_form_setting }}</h2>
          </div>
        </div>
        <div class="row m-4">
            <div class="col-12">
              <div class="form-group">
                <b-form-checkbox
                    size="md"
                    id="show-other-option-in-gender-checkbox"
                    v-model="userRegistrationFormSetting_status"
                    name="show-other-option-in-gender-checkbox"
                    value="on"
                    unchecked-value="off"
                    switch
                    @change="handleRegistrationFormSetting"
                >
                  <b> {{ formTranslation.common.show_other_option_in_gender }} </b>
                </b-form-checkbox>
              </div>
            </div>
          </div>
        <hr class="mt-2 mb-2"/>
        <div class="row">
          <div class="col-12">
            <h2 class="mb-0">{{ 'Login Redirect' }}</h2>
          </div>
        </div>
        <br>
        <form
            id="login_redirect_form"
            name="clinic_form"
            @submit.prevent="handleLoginRedirectSubmit"
            :novalidate="true"
        >
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label for="clinic_admin_login_redirect" class="form-control-label"> {{formTranslation.clinic.clinic}} </label>
                <input id="clinic_admin_login_redirect"
                       v-model="login_redirect.clinic_admin"
                       :placeholder="formTranslation.clinic.clinic"
                       name="clinic_admin_login_redirect" type="url" class="form-control">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="doctor_login_redirect" class="form-control-label"> {{formTranslation.doctor_session.dt_lbl_doc}} </label>
                <input id="doctor_login_redirect"
                       v-model="login_redirect.doctor"
                       :placeholder="formTranslation.doctor_session.dt_lbl_doc"
                       name="doctor_login_redirect" type="url" class="form-control">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="receptionist_login_redirect" class="form-control-label"> {{formTranslation.clinic.receptionist}} </label>
                <input id="receptionist_login_redirect"
                       v-model="login_redirect.receptionist"
                       :placeholder="formTranslation.clinic.receptionist"
                       name="receptionist_login_redirect" type="url" class="form-control">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="patient_login_redirect" class="form-control-label"> {{formTranslation.appointments.tag_patient_plh}} </label>
                <input id="patient_login_redirect"
                       v-model="login_redirect.patient"
                       :placeholder="formTranslation.appointments.tag_patient_plh"
                       name="patient_login_redirect" type="url" class="form-control">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="d-flex justify-content-end">
                <button type="submit" :disabled="loginRedirectSettingLoading"  class="btn btn-primary">
                  <i :class="loginRedirectSettingLoading ? 'fa fa-spinner fa-spin' : 'fa fa-save'"></i> {{ loginRedirectSettingLoading ? formTranslation.common.loading : formTranslation.common.save }}
                </button>
              </div>
            </div>
          </div>
        </form>
        <hr class="mt-2 mb-2"/>
        <div class="row">
          <div class="col-12">
            <h2 class="mb-0">{{ formTranslation.common.logout_redirect }}</h2>
          </div>
        </div>
        <br>
        <form
            id="logout_redirect_form"
            name="clinic_form"
            @submit.prevent="handleLogoutRedirectSubmit"
            :novalidate="true"
        >
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label for="clinic_admin_redirect" class="form-control-label"> {{formTranslation.clinic.clinic}} </label>
                <input id="clinic_admin_redirect"
                       v-model="logout_redirect.clinic_admin"
                       :placeholder="formTranslation.clinic.clinic"
                       name="clinic_admin_redirect" type="url" class="form-control">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="doctor_redirect" class="form-control-label"> {{formTranslation.doctor_session.dt_lbl_doc}} </label>
                <input id="doctor_redirect"
                       v-model="logout_redirect.doctor"
                       :placeholder="formTranslation.doctor_session.dt_lbl_doc"
                       name="doctor_redirect" type="url" class="form-control">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="receptionist_redirect" class="form-control-label"> {{formTranslation.clinic.receptionist}} </label>
                <input id="receptionist_redirect"
                       v-model="logout_redirect.receptionist"
                       :placeholder="formTranslation.clinic.receptionist"
                       name="receptionist_redirect" type="url" class="form-control">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="patient_redirect" class="form-control-label"> {{formTranslation.appointments.tag_patient_plh}} </label>
                <input id="patient_redirect"
                       v-model="logout_redirect.patient"
                       :placeholder="formTranslation.appointments.tag_patient_plh"
                       name="patient_redirect" type="url" class="form-control">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="d-flex justify-content-end">
                <button type="submit" :disabled="redirectSettingLoading"  class="btn btn-primary">
                  <i :class="redirectSettingLoading ? 'fa fa-spinner fa-spin' : 'fa fa-save'"></i> {{ redirectSettingLoading ? formTranslation.common.loading : formTranslation.common.save }}
                </button>
              </div>
            </div>
          </div>
        </form>
        <hr class="mt-2 mb-2"/>
        <div class="row">
          <div class="col-12">
            <h2 class="mb-0">{{ formTranslation.common.fullcalendar_setting }}</h2>
          </div>
        </div>
        <br>
        <form
            id="fullcalendar_form"
            @submit.prevent="handleFullCalendarFormSubmit"
            :novalidate="true"
        >
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label for="fullcalendar_key" class="form-control-label"> {{formTranslation.common.fullcalendar_license_key}} </label>
                <input id="fullcalendar_key"
                       v-model="fullcalendar_key"
                       :placeholder="formTranslation.common.fullcalendar_license_key"
                       name="site_key" type="text" class="form-control">
                <div v-if="isFullcalendarFormKeyEmpty"
                    class="invalid-feedback">{{formTranslation.common.full_calender_validation}}
                </div>
              </div>
            </div>
          </div>
          <div class="row" >
            <div class="col-md-12">
              <div class="d-flex justify-content-end">
                <button type="submit" :disabled="fullcalendarFormLoading"  class="btn btn-primary">
                  <i :class="fullcalendarFormLoading ? 'fa fa-spinner fa-spin' : 'fa fa-save'"></i> {{ fullcalendarFormLoading ? formTranslation.common.loading : formTranslation.common.save }}
                </button>
              </div>
            </div>
          </div>
        </form>
        <hr class="mt-2 mb-2"/>
        <div class="row">
          <div class="col-12">
            <h2 class="mb-0">{{ $t('common.encounter_setting') }}</h2>
          </div>
        </div>
        <br>
        <form
          id="encounter_setting_form"
          name="encounter_setting_form"
          @submit.prevent="handleEncounterFormSubmit"
          :novalidate="true"
          enctype="multipart/form-data">
          <b-row class="mt-2 ml-4" >
            <b-col sm="12" md="12" lg="12">
              <div class="form-group">
                <b-form-checkbox
                  size="md"
                  id="encounter-edit-after-close-checkbox"
                  v-model="encounterSettingsData.encounter_edit_after_close_status"
                  name="encounter-edit-after-close-checkbox"
                  value="on"
                  unchecked-value="off"
                  switch
                  >
                  <b class="form-control-label"> {{ $t('common.allow_encounter_edit_after_close') }} </b>
                </b-form-checkbox>
              </div>
            </b-col>
          </b-row>
          <div class="row">
            <div class="col-md-12">
              <div class="d-flex justify-content-end">
                <button type="submit" :disabled="isSubmitedEncounter"  class="btn btn-primary">
                  <i :class="isSubmitedEncounter ? 'fa fa-spinner fa-spin' : 'fa fa-save'"></i> {{ isSubmitedEncounter ? formTranslation.common.loading : formTranslation.common.save }}
                </button>
              </div>
            </div>
          </div>
        </form>
        <hr class="mt-2 mb-2"/>
        <br>
        <div class="row p-2">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.common.reset_plugin_data }}
            </h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="d-flex justify-content-start">
              <button type="submit" class="btn btn-primary" @click="resetPluginModel = true">
                <i class="fa fa-undo"></i> {{ formTranslation.common.reset_plugin_data }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ModalPopup
      v-if="resetPluginModel"
      modalId="appointment-details-modal"
      modalSize="md"
      :openModal="resetPluginModel"
      :modalTitle="formTranslation.common.reset_plugin_data"
      @closeModal="closeResetPluginModel()">
      <div class="row">
              <div class="col-12">
                <form
                  id="resetPluginForm"
                  name="reset_plugin_form"
                  @submit.prevent="handleResetPluginForm"
                  :novalidate="true"
                >
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <b-form-checkbox
                          id="reset-appointment-status"
                          v-model="resetPluginData.resetAppointmentEncounterStatus"
                          name="reset-appointment-status"
                          value="on"
                          unchecked-value="off"
                        >
                        {{formTranslation.common.reset_appointments_and_encounter}}
                        </b-form-checkbox>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <b-form-checkbox
                          id="reset-encounter-status"
                          v-model="resetPluginData.resetEncounterStatus"
                          name="reset-encounter-status"
                          value="on"
                          unchecked-value="off"
                        >
                        {{formTranslation.common.reset_encounters}}
                        </b-form-checkbox>
                      </div>
                    </div>
                  </div> -->
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <b-form-checkbox
                          id="reset-doctor-status"
                          v-model="resetPluginData.resetDoctorStatus"
                          name="reset-doctor-status"
                          value="on"
                          unchecked-value="off"
                        >
                        {{formTranslation.common.reset_doctors}}
                        </b-form-checkbox>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <b-form-checkbox
                          id="reset-receptionist-status"
                          v-model="resetPluginData.resetReceptionistStatus"
                          name="reset-receptionist-status"
                          value="on"
                          unchecked-value="off"
                        >
                        {{formTranslation.common.reset_receptionists}}
                        </b-form-checkbox>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <b-form-checkbox
                          id="reset-patients-status"
                          v-model="resetPluginData.resetPatientStatus"
                          name="reset-patients-status"
                          value="on"
                          unchecked-value="off"
                        >
                        {{formTranslation.common.reset_patients}}
                        </b-form-checkbox>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <b-form-checkbox
                          id="reset-revenue-status"
                          v-model="resetPluginData.resetRevenueStatus"
                          name="reset-revenue-status"
                          value="on"
                          unchecked-value="off"
                        >
                          {{formTranslation.common.reset_revenue}}
                        </b-form-checkbox>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <b-form-checkbox
                          id="reset-clinic-status"
                          v-model="resetPluginData.resetClinicStatus"
                          name="reset-clinic-status"
                          value="on"
                          unchecked-value="off"
                        >
                          {{formTranslation.common.reset_clinic}}
                        </b-form-checkbox>
                      </div>
                    </div>
                  </div> -->
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <b-form-checkbox
                          id="reset-all-status"
                          v-model="resetPluginData.resetAllDataStatus"
                          name="reset-all-status"
                          value="on"
                          unchecked-value="off"
                        >
                          <b>{{formTranslation.common.delete_all_reset_plugin}}</b>
                        </b-form-checkbox>
                      </div>
                    </div>
                  </div>
                  <div class="row" >
                    <div class="col-md-12">
                      <div class="d-flex justify-content-end">
                        <button type="submit" :disabled="isSubmitedReset" id="btn-reset-submit" class="btn btn-primary">
                          <i class="fa fa-save"></i> {{ formTranslation.common.save }}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
      </ModalPopup>
    </b-card>
    
</template>
<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import { post, get } from "../../config/request";
import {maxValue, minValue, required} from "vuelidate/lib/validators";
import ModalPopup from "../../components/Modal/Index"
export default {
  name: "generalSetting",
  components: {
    ModalPopup,
    VuePhoneNumberInput
  },
  data: () => {
    return {
      request_status:'yes',
      remove_request_status: 'off',
      showOption:true,
      isSubmited: false,
      isSubmitedClinic:false,
      isSubmitedCountryCode: false,
      isSubmitedReset:false,
      isSubmitedEncounter:false,
      clinicData:{
        currency_prefix:'',
        currency_postfix:'',
        // decimal_point:{

        // }
      },
      googleRecaptchaLoading:false,
      googleCaptcha:{
        site_key:'',
        secret_key:'',
        status:'off'
      },
      redirectSettingLoading:false,
      loginRedirectSettingLoading:false,
      logout_redirect:{
        clinic_admin:'',
        patient:'',
        receptionist: '',
        doctor:''
      },
      login_redirect:{
        clinic_admin:'',
        patient:'',
        receptionist: '',
        doctor:''
      },
      datat:{},
      formLoader:true,
      decimals: [{ id: 0, label : '100' }, { id: 1, label : '100.0' }, { id: 2, label : '100.00' }, { id:3, label : '100.000' }, { id:4, label : '100.0000' }],
      fullcalendarFormLoading:false,
      isFullcalendarFormKeyEmpty:false,
      fullcalendar_key:'',
      dateFormatLoading:false,
      dateFormat: 'D-MM-YYYY',
      dateFormatOutput:'',
      reset_status:'off',
      resetPluginModel:false,
      resetPluginData:{
        resetAppointmentEncounterStatus:'off',
        resetDoctorStatus:'off',
        resetReceptionistStatus:'off',
        resetPatientStatus:'off',
        resetRevenueStatus:'off',
        // resetClinicStatus:'off',
        resetAllDataStatus:'off',
      },
      userRegistrationShortcodeSetting:{
        status:{
          doctor:'off',
          receptionist:'off',
          patient:'on'
        },
        user_role:{
          kiviCare_doctor:'on',
          kiviCare_receptionist:'on',
          kiviCare_patient:'on'
        }
      },
      userRegistrationShortcodeSettingLoading:false,
      countryCodeData: {
        countrycode: '',
        countryCallingCode: ''
      },
      contact: '00',
      defaultCountryCode: null,
      userRegistrationFormSetting_status: 'on',
      encounterSettingsData: {
        encounter_edit_after_close_status: 'off'
      },
      userRegistrationFormSettingLoading:false,
    };
  },
  mounted() {
    if(!['administrator'].includes(this.getUserRole())) {
      this.$router.push({ name: "403"})
    }
    this.getRequestHelper()
    this.getAllSetting()
    this.getModule();
  },
  methods: {
    validateCheckboxes(userRole) {

      const user_roles = this.userRegistrationShortcodeSetting.user_role;

      const { kiviCare_doctor, kiviCare_receptionist, kiviCare_patient } = this.userRegistrationShortcodeSetting.user_role;

      if (kiviCare_doctor === 'off' && kiviCare_receptionist === 'off' && kiviCare_patient === 'off') {
        user_roles[userRole] = "on";
        this.userRegistrationShortcodeSetting.user_role = user_roles
      }
      
    },
    countryCodeUpdateHandaler: function (val) {
      this.countryCodeData.countrycode = val.countryCode;
      this.countryCodeData.countryCallingCode = val.countryCallingCode;
    },
    handleSubmit() {
      var element =$('#btn-general-submit').find("i");
      element.removeClass('fa fa-save ')
      element.addClass("fa fa-spinner fa-spin");
      this.isSubmited = true;
      post('save_request_helper_status', {request_status: this.request_status, remove_request_status: this.remove_request_status })
        .then((response) => {
          this.isSubmited = false;
          element.removeClass("fa fa-spinner fa-spin");
          element.addClass("fa fa-save");
          if (response.data.status !== undefined && response.data.status === true) {
            this.showOption = false
            if(response.data.data == 'off') {
              this.request_status = response.data.data;
            }
            setTimeout(() => {
              window.location.reload();
            },500)
          }
        })
        .catch((error) => {
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error);
        })
    },
    handleUserRegistrationShortcodeSettingSubmit(){
      this.userRegistrationShortcodeSettingLoading = true;
      post('save_registration_shortcode_setting', {data:this.userRegistrationShortcodeSetting} )
          .then((response) => {
            this.userRegistrationShortcodeSettingLoading = false;
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message)
            }else{
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            this.userRegistrationShortcodeSettingLoading = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    handleDateFormatSubmit(){
      this.dateFormatLoading = true;
      post('save_date_format', {data:this.dateFormat} )
          .then((response) => {
            this.dateFormatLoading = false;
            if (response.data.status !== undefined && response.data.status === true) {
              this.$store.commit("FETCH_DATE_FORMAT",{data:this.dateFormat});
              displayMessage(response.data.message)
            }else{
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            this.dateFormatLoading = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    handleLogoutRedirectSubmit(){
      this.redirectSettingLoading = true;
      post('save_logout_redirect_setting', {data:this.logout_redirect} )
          .then((response) => {
            this.redirectSettingLoading = false;
            if (response.data.status !== undefined && response.data.status === true) {
               this.$store.dispatch("logout_redirect_url", { data:Object.assign({}, this.logout_redirect)} );
              displayMessage(response.data.message)
            }else{
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            this.redirectSettingLoading = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    handleLoginRedirectSubmit(){
      this.loginRedirectSettingLoading = true;
      post('save_login_redirect_setting', {data:this.login_redirect} )
          .then((response) => {
            this.loginRedirectSettingLoading = false;
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message)
            }else{
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            this.loginRedirectSettingLoading = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    handleFullCalendarFormSubmit(){
      if(this.fullcalendar_key.length==0){
        this.isFullcalendarFormKeyEmpty = true;
        return 
      }
      this.isFullcalendarFormKeyEmpty =this.fullcalendar_key.length==0
      this.fullcalendarFormLoading = true;
      post('save_fullcalendar_setting', {fullcalendar_key:this.fullcalendar_key} )
          .then((response) => {
            this.fullcalendarFormLoading = false;
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message)
            }else{
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            this.fullcalendarFormLoading = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    handleRegistrationFormSetting(){
      this.userRegistrationFormSettingLoading = true;
      post('save_registration_form_setting', {status: this.userRegistrationFormSetting_status})
          .then((response) => {
            this.userRegistrationFormSettingLoading = false;
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message)
            }else{
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            this.userRegistrationFormSettingLoading = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    handleCaptchaSubmit(){
      this.googleRecaptchaLoading = true;
      post('save_google_recaptcha_setting', this.googleCaptcha )
          .then((response) => {
            this.googleRecaptchaLoading = false;
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message)
            }else{
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            this.googleRecaptchaLoading = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    handleCliniSubmit:function (){
      var element =$('#btn-clinic-submit').find("i");
      element.removeClass('fa fa-save ')
      element.addClass("fa fa-spinner fa-spin");
      this.isSubmitedClinic = true;
      post('save_clinic_currency', {clinic_data: this.clinicData})
          .then((response) => {
            this.isSubmitedClinic = false;
            element.removeClass("fa fa-spinner fa-spin");
            element.addClass("fa fa-save");
            if (response.data.status !== undefined && response.data.status === true) {
                displayMessage(response.data.message)
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    handleCountryCodeSubmit: function () {
      var element = $('#btn-country-code-submit').find("i");
      element.removeClass('fa fa-save ')
      element.addClass("fa fa-spinner fa-spin");
      this.isSubmitedCountryCode = true;
      post('save_country_code', { CountryCode: this.countryCodeData })
        .then((response) => {
          this.isSubmitedCountryCode = false;
          element.removeClass("fa fa-spinner fa-spin");
          element.addClass("fa fa-save");
          if (response.data.status !== undefined && response.data.status === true) {
            displayMessage(response.data.message)
          }
        })
        .catch((error) => {
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error);
        })
    },

    handleEncounterFormSubmit(){
      this.isSubmitedEncounter = true;
      post('save_encounter_setting', this.encounterSettingsData)
          .then((response) => {
            this.isSubmitedEncounter = false;
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message)
            }else{
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            this.isSubmitedEncounter = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    getRequestHelper:function(){
        if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
          this.request_status = window.request_data.link_show_hide;
          if(this.request_status == 'on'){
            this.showOption = false;
          }
         }
        this.formLoader = false;
    },
    getAllSetting:function(){
      this.formLoader = true;
      get('get_all_general_setting', {})
        .then((response) => {
          this.formLoader = false;
          if (response.data.status !== undefined && response.data.status === true) {
            // this.datat =response.data.data.decimal_point
            this.clinicData = response.data.data
            this.countryCodeData = response.data.countryCodeData;
            if (response.data.countryCodeData.countryCallingCode !== '' && response.data.countryCodeData.countryCallingCode !== undefined) {
              this.defaultCountryCode = response.data.countryCodeData.countrycode;
            }
            if(response.data.captcha_data !== undefined){
              this.googleCaptcha = response.data.captcha_data;
            }
            if(response.data.logout_redirect !== undefined){
              this.logout_redirect = response.data.logout_redirect;
            }
            if(response.data.fullcalendar !== undefined){
              this.fullcalendar_key = response.data.fullcalendar
            }
            if(response.data.date_format !== undefined){
              this.dateFormat = response.data.date_format
            }
            if(response.data.login_redirect !== undefined){
              this.login_redirect = response.data.login_redirect
            }
            if(response.data.userRegistrationShortcodeSetting !== undefined){
              this.userRegistrationShortcodeSetting = response.data.userRegistrationShortcodeSetting
            }
            if(response.data.userRegistrationFormSetting !== undefined){
              this.userRegistrationFormSetting_status = response.data.userRegistrationFormSetting
            }
            if(response.data.encounter_settings !== undefined){
              this.encounterSettingsData = response.data.encounter_settings
            }
            this.formatDateValue();
          }
        })
        .catch((error) => {
          this.formLoader = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    removeFeatureRequest(status) {
      if(status == 'on') {
        $.confirm({
          title: this.formTranslation.common.remove_links,
          content: 'Are you sure want to remove all hard links permanently ?',
          type: 'red',
          buttons: {
            ok: {
              text: this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                this.handleSubmit();
              }
            },
            cancel:{
              text:this.formTranslation.common.cancel,
            }
          }
        });
      }
    },
    closeResetPluginModel(){
      this.resetPluginModel = false;
      this.resetPluginData.resetAppointmentEncounterStatus = "";
      this.resetPluginData.resetDoctorStatus="";
      this.resetPluginData.resetReceptionistStatus="";
      this.resetPluginData.resetPatientStatus="";
      this.resetPluginData.resetRevenueStatus="";
      this.resetPluginData.resetAllDataStatus="";
    },
    handleResetPluginForm() {
      var element =$('#btn-reset-submit').find("i");
      var content_msg = (this.resetPluginData.resetDoctorStatus == 'on' || this.resetPluginData.resetPatientStatus == 'on') ? this.formTranslation.common.action_reset_plugin_user_data : this.formTranslation.common.action_reset_plugin_data;
      $.confirm({
        title: this.formTranslation.clinic_schedule.dt_are_you_sure,
        content: content_msg,
        type: 'red',
        buttons: {
          ok: {
            text: this.formTranslation.common.yes,
            btnClass: 'btn-danger',
            keys: ['enter'],
            action: () => {
              this.isSubmitedReset = true;
              element.removeClass('fa fa-save ')
              element.addClass("fa fa-spinner fa-spin");
              post('reset_plugin_data', { reset_plugin_data : this.resetPluginData})
                .then((response) => {
                  element.removeClass("fa fa-spinner fa-spin");
                  element.addClass("fa fa-save");
                  this.isSubmitedReset = false;
                  if (response.data.status !== undefined && response.data.status === true) {
                    this.resetPluginModel = false;
                    displayMessage(response.data.message)
                    if( response.data.reset_all !== undefined && response.data.reset_all === true) {
                      window.location.href = window.request_data.homePage + '/wp-admin/plugins.php'
                    }else{
                      location.reload();
                    }
                  }else{
                    this.resetPluginModel = false;
                    displayErrorMessage(response.data.message)
                  }
                })
                .catch((error) => {
                  console.log(error);
                  displayErrorMessage(response.data.message);
                })
            }
          },
          cancel: {
            text:this.formTranslation.common.cancel
          }
        }
      });
    },
    formatDateValue(){
      this.dateFormatOutput =  window.moment.utc(new Date()).format(this.dateFormat)
    },
    getModule:function (){
        if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
        this.request_status = window.request_data.link_show_hide;
        }
    }
  },
  computed:{},
  watch:{
    'dateFormat' :function (){
      this.formatDateValue();
    }
  }
};
</script>

<style>
.form-group.country-code-inline-box #country_code .flex-1 {
  display: none;
}

#user_registration .custom-switch .custom-control-label::before{
  left: -2.5rem;
}

#user_registration .custom-switch .custom-control-label::after{
  left: calc(-2.5rem + 2px);
}

</style>