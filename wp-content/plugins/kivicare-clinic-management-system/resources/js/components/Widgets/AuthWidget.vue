<template>
    <div class="kivi-row">
        <div class="kivi-col-sm-12 ">
            <b-tabs v-model="isLoginTabActive" pills card justified active-tab-class="font-weight-bold">
                <b-tab :title="formTranslation.auth.login" >
                    <form id="kiviCarePatientLogin" @submit.prevent="handleLoginSubmit" :novalidate="true">
                        <div class="kivi-row">
                            
                            <div class="kivi-col-md-12">
                                <div class="form-group">
                                    <label for="kiviCareLoginUname" class="form-control-label"><b>{{formTranslation.patient_front_widget.username_email}}</b> <span class="text-danger">*</span></label>
                                    <input type="text" id="kiviCareLoginUname" class="form-control" 
                                    :placeholder="formTranslation.widgets.plh_enter_usrname_email" v-model="loginData.username" name="uname" required>
                                    <div v-if="loginSubmit && !$v.loginData.username.required" class="invalid-feedback">
                                       {{formTranslation.widgets.username_email_required}}.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="kivi-row">
                            <div class="kivi-col-md-12">
                                <div class="form-group">
                                    <label for="kiviCareLoginPassword" class="form-control-label"><b>{{formTranslation.common.password}}</b> <span class="text-danger">*</span></label>
                                    <input type="password" id="kiviCareLoginPassword" class="form-control" 
                                    :placeholder="formTranslation.widgets.plh_enter_pwd" v-model="loginData.password" name="psw" required>
                                    <div v-if="loginSubmit && !$v.loginData.password.required" class="invalid-feedback">
                                        {{formTranslation.common.pwd_required}}.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="kivi-row">
                            <div class="kivi-col-md-12 mt-4">
                                <button v-if="!loginLoading" class="kivi-btn-primary btn-block" type="submit"
                                        >{{formTranslation.common.login_btn}}</button>
                                <button v-else class="btn kivi-btn-primary btn-block" type="button" disabled>
                                    <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                                </button>
                            </div>
                        </div>
                        <div class="kivi-row">
                            <div class="kivi-col-md-12 mt-4">
                                <a class="text-primary font-weight-bold ml-1" :href="forget_password_page_url" target="_blank"
                                        >{{formTranslation.auth.forget_password}}</a>
                            </div>
                        </div>
                    </form>
                </b-tab>
                <b-tab :title="formTranslation.auth.register" >
                    <form id="kiviCarePatientRegister" enctype="multipart/form-data" @submit.prevent="handleRegisterSubmit" :novalidate="true">
                        <div class="kivi-row">
                            <div class="kivi-col-md-12">
                                <div class="form-group">
                                    <label for="kiviCareRegisterFirstname" class="form-control-label"><b>{{formTranslation.common.fname}}</b> <span class="text-danger">*</span></label>
                                    <input type="text" id="kiviCareRegisterFirstname" class="form-control" 
                                    :placeholder="formTranslation.widgets.plh_enter_fnmae" v-model="registerData.first_name" name="kiviCareRegisterFirstname" required>
                                    <div v-if="registerSubmit && !$v.registerData.first_name.required" class="invalid-feedback">
                                       {{formTranslation.common.fname_required}}.
                                    </div>
                                    <!-- <div v-else-if="registerSubmit && !$v.registerData.first_name.alpha" class="invalid-feedback">
                                       {{formTranslation.common.fname_validation_1}}
                                    </div> -->
                                    <!-- <div v-else-if="registerSubmit && (!$v.registerData.first_name.minLength || !$v.registerData.first_name.maxLength)" class="invalid-feedback">
                                       {{formTranslation.common.fname_validation_2}}
                                    </div> -->
                                </div>
                            </div>
                            <div class="kivi-col-md-12">
                                <div class="form-group">
                                    <label for="kiviCareRegisterLastname" class="form-control-label"><b>{{formTranslation.common.lname}}</b> <span class="text-danger">*</span></label>
                                    <input type="text" id="kiviCareRegisterLastname" class="form-control" 
                                    :placeholder="formTranslation.widgets.plh_enter_lname" v-model="registerData.last_name" name="kiviCareRegisterLastname" required>
                                    <div v-if="registerSubmit && !$v.registerData.last_name.required" class="invalid-feedback">
                                        {{formTranslation.common.lname_required}}.
                                    </div>
                                    <!-- <div v-else-if="registerSubmit && !$v.registerData.last_name.alpha"
                                         class="invalid-feedback"> {{formTranslation.common.lname_validation_1}}
                                    </div> -->
                                    <!-- <div v-else-if="registerSubmit && (!$v.registerData.last_name.minLength || !$v.registerData.last_name.maxLength)"
                                         class="invalid-feedback">{{formTranslation.common.lname_validation_2}}
                                    </div> -->
                                </div>
                            </div>
                        </div>
                        <div class="kivi-row">
                            <div class="kivi-col-md-12">
                                <div class="form-group">
                                    <label for="kiviCareRegisterEmail" class="form-control-label"><b>{{formTranslation.common.email}}</b> <span class="text-danger">*</span></label>
                                    <input type="text" id="kiviCareRegisterEmail" class="form-control" 
                                    :placeholder="formTranslation.widgets.plh_enter_email" v-model="registerData.user_email" name="kiviCareRegisterEmail" required>
                                    <div v-if="registerSubmit && !$v.registerData.user_email.required" class="invalid-feedback">
                                        {{formTranslation.common.email_required}}.
                                    </div>
                                    <div v-else-if="registerSubmit && !$v.registerData.user_email.email"
                                         class="invalid-feedback">{{formTranslation.common.invalid_email}}
                                    </div>
                                </div>
                            </div>
                        </div>
                      <div class="row" v-if="proActive && clinic.length>1">
                        <div class="col-md-12 mt-3">
                          <div class="form-group">
                            <label for="kiviCareRegisterContact" class="form-control-label mb-1">{{formTranslation.clinic.clinic}} <span class="text-danger">*</span></label>
                            <multi-select
                                deselect-label=""
                                select-label=""
                                v-model="proRegisterData.clinic"
                                :tag-placeholder="formTranslation.patient_encounter.tag_select_clinic_plh"
                                id="clinic_id"
                                :placeholder="formTranslation.patient_encounter.tag_select_clinic_plh"
                                label="label"
                                track-by="id" :options="clinic"
                            ></multi-select>
                            <div v-if="registerSubmit && !$v.proRegisterData.clinic.required" class="invalid-feedback">
                              {{formTranslation.common.clinic_is_required}}
                            </div>
                          </div>
                        </div>
                      </div>
                        <div class="kivi-row">
                            <div class="kivi-col-md-12">
                                <!-- <div class="form-group">
                                    <label for="kiviCareRegisterContact" class="form-control-label"><b>{{formTranslation.common.contact_no}}</b> <span class="text-danger">*</span></label>
                                    <input type="text" id="kiviCareRegisterContact" class="form-control" 
                                    :placeholder="formTranslation.widgets.plh_enter_contact" v-model="registerData.mobile_number" name="kiviCareRegisterContact" required>
                                    <div v-if="registerSubmit && !$v.registerData.mobile_number.required" class="invalid-feedback">
                                      {{formTranslation.common.contact_required}}.
                                    </div>
                                    <div v-else-if="registerSubmit && !$v.registerData.mobile_number.phoneNumber"
                                         class="invalid-feedback">{{formTranslation.common.contact_validation_2}}
                                    </div>
                                </div> -->
                                <div class="form-group country-code-inline-box">
                                    <label for="kiviCareRegisterContact" class="form-control-label mb-1">{{formTranslation.common.contact_no}} <span class="text-danger">*</span></label>
                                    <!-- <input type="text" id="kiviCareRegisterContact" class="form-control" :placeholder="this.formTranslation.widgets.plh_enter_contact" v-model="registerData.mobile_number" name="kiviCareRegisterContact" required> -->
                                    <VuePhoneNumberInput v-model="registerData.mobile_number"
                                    :default-country-code=" defaultCountryCode " id="kiviCareRegisterContact"
                                    @update=" contactUpdateHandaler " clearable no-example>
                                    </VuePhoneNumberInput>
                                    <div v-if="registerSubmit && !$v.registerData.mobile_number.required" class="invalid-feedback">
                                        {{formTranslation.common.contact_required}}
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div class="row">
                                  <get-front-custom-fields
                                     
                                      module_type="patient_module"
                                      :module_id="String((this.$route.params.id) !== undefined ? this.$route.params.id : 0 )"
                                      @bindCustomField="getCustomFieldsValues"
                                      :fieldsValue="customFieldsData"
                                      @requiredCustomField="getRequireFields"
                                  ></get-front-custom-fields>
                                </div>
                        <div class="kivi-row">
                            <div class="kivi-col-md-12 mt-4">
                                <button v-if="!registerLoading" class="btn kivi-btn-primary btn-block" type="submit"
                                        >{{formTranslation.common.sign_up}}</button>
                                <button v-else class="btn kivi-btn-primary btn-block" type="button" disabled>
                                    <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                                </button>
                            </div>
                        </div>
                    </form>
                </b-tab>
            </b-tabs>
        </div>
    </div>
</template>

<script>

import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import {email,  required} from "vuelidate/lib/validators";
import {_axios_post, _patientLogin, get, post} from "../../config/request";
import {phoneNumber} from "../../config/helper";

export default {
    components: {
        VuePhoneNumberInput,
    },
    props: ['appointmentData'],
    validations: {
        loginData: {
            username: {required},
            password: {required}
        },
        registerData: {
            first_name: {
                required
            },
            last_name: {
                required
            },
            user_email: {
                required,
                email
            },
            mobile_number: {
                required,
                phoneNumber
            }
        },
        proRegisterData:{
          clinic:{
            required
          }
        }
    },
    data: () => {
        return {
            isLoginTabActive: 0,
            registerBtnHtml: 'Register',
            loginBtnHtml: 'Login',
            loginLoading: false,
            registerLoading: false,
            loginSubmit: false,
            registerSubmit: false,
            loginData: {},
            registerData: {},
            forget_password_page_url :window.request_data.forget_password_page,
            proActive :window.request_data.proActive,
            clinic: [],
            proRegisterData:{
              clinic:[]
            },
            defaultCountryCode: null,
            backgroundImage: 'url('+pluginBASEURL + 'images/vendor/vue-phone-number-input/dist/flags.9c96e0ed.png)'
        }
    },
    mounted() {
        this.init();
        this.getCountryCodeData();
        if(this.proActive){
          this.getClinic();
        }
    },
    methods: {
        init: function () {
            this.loginData = this.defaultLoginData();
            this.registerData = this.defaultRegistrationData() ;
        },
        defaultLoginData: function() {
            return {
                username: '',
                password: ''
            }
        },
        contactUpdateHandaler: function (val) {
            // this.registerData.country_code = val.countryCode;
            // this.registerData.country_calling_code = val.countryCallingCode;
            this.registerData.country_code = JSON.stringify({
                countryCallingCode: val.countryCallingCode,
                countryCode: val.countryCode
            });
        },
        defaultRegistrationData: function () {
            return {
                first_name: '',
                last_name: '',
                user_email: '',
                mobile_number: '',
                custom_fields:[]
            }
        },
        getCountryCodeData: function () {
            get('get_country_code_settings_data', {})
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        this.defaultCountryCode = response.data.data.country_code;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })
            },
        getCustomFieldsValues: function (fieldsObj) {
            if(!fieldsObj || fieldsObj === undefined){
            return false;
            }
            this.registerData.custom_fields = fieldsObj;
        },
        handleLoginSubmit: function () {

            this.loginSubmit = true;
            this.loginLoading = true;

            if (this.$v.loginData.$invalid) {
                this.loginLoading = false;
                return;
            }

            post('login', this.loginData, true)
                .then((response) => {
                    this.loginLoading = false;
                    this.loginSubmit = false;
                    if (response.data.status !== undefined && response.data.status === true) {
                        window.request_data.get_nonce = response.data.token.get;
                        window.request_data.nonce = response.data.token.post;
                        this.$emit('loginSuccess', response.data.data.data);
                        displayMessage(response.data.message);
                    } else {
                        let message = response.data.message !== undefined ? response.data.message : this.formTranslation.common.internal_server_error;
                        displayErrorMessage(message)
                    }
                }).catch((error) => {
                    this.loginLoading = false;
                    this.loginSubmit = false;
                    if (error.response) {
                        if (error.response.data !== undefined && error.response.status === 401) {
                            displayErrorMessage(error.response.data.message);
                        }
                    } else {
                        displayErrorMessage(this.formTranslation.common.internal_server_error);
                    }
            })
        },
        handleRegisterSubmit: function () {

            this.registerSubmit = true
            this.registerLoading = true;

            if(this.proActive){
              this.registerData.clinic =  this.proRegisterData.clinic
              if(this.$v.proRegisterData.$invalid){
               this.registerLoading = false;
                return;
              }
             }
            if (this.$v.registerData.$invalid) {
                this.registerLoading = false;
                return;
            }
          let form_id = document.getElementById('kiviCarePatientRegister')
          let formData = new FormData(form_id);
          $.each(this.registerData, function (key, value) {
            if (typeof (value) === 'object') {
              value = JSON.stringify(value)
            }
            formData.append(key, value)
          });

            post('register', formData, true)
                .then((response) => {
                    this.registerLoading = false;
                    this.registerSubmit = false;
                    if (response.data.status !== undefined && response.data.status === true) {
                        window.request_data.get_nonce = response.data.token.get;
                        window.request_data.nonce = response.data.token.post;
                        this.$emit('registerSuccess', response.data);
                        this.$emit('loginSuccess', response.data.data.data);
                        
                        displayMessage(response.data.message);

                        this.isLoginTabActive = 1;
                        this.registerData = this.defaultRegistrationData() ;
                    } else {
                        let message = response.data.message !== undefined ? response.data.message : this.formTranslation.common.internal_server_error;
                        displayErrorMessage(message)
                    }
                }).catch((error) => {
                this.registerLoading = false;
                this.registerSubmit = false;
                if (error.response) {
                    if (error.response.data !== undefined && error.response.status === 401) {
                        displayErrorMessage(error.response.data.message);
                    }
                } else {
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                }
            })

        },
        getRequireFields: function (validateRequired) {
            this.requiredFields = validateRequired;
          },
      getClinic:function(){
        // Get dropdown data for clinics
        get('get_static_data', {
          data_type: 'clinics'
        })
            .then((response) => {
              if (response.data.status !== undefined && response.data.status === true) {
                this.clinic = response.data.data;
                if(this.clinic.length > 0 && this.appointmentData.clinic_id !== undefined && this.appointmentData.clinic_id.id !== undefined){
                  var clinic_const = this.clinic.find(x => parseInt(x.id) == this.appointmentData.clinic_id.id)
                  if(clinic_const !== undefined){
                    this.proRegisterData.clinic = [];
                    this.proRegisterData.clinic.push(clinic_const)
                  }
                }
              } else {
                displayErrorMessage(response.data.message)
              }
            })
            .catch((error) => {
              console.log(error);
              displayErrorMessage(this.formTranslation.common.internal_server_error)
            })
      },
    },
    computed:{
        formTranslation: function () {
            return this.$store.state.langTranslateData ;
        },
        customFieldsData() {
            return (this.registerData.custom_fields ? this.registerData.custom_fields : []);
        },
    }
}

</script>
<style>
    .form-group.country-code-inline-box #kiviCareRegisterContact .select-country-container {
        min-width: 100px;
        max-width: 100px;
    }
    .form-group.country-code-inline-box #kiviCareRegisterContact .iti-flag {
        background-image: v-bind(backgroundImage) !important;
    }
</style>