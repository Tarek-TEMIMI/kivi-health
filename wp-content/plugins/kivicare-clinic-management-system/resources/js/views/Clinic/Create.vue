<template>
    <b-row>
      <div class="page-loader-section" v-if="formLoader">
        <loader-component-2></loader-component-2>
      </div>
        <b-col v-else sm="12">
            <form id="clinicForm" @submit.prevent="handleSubmit" :novalidate="true">
                <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">

                    <template v-slot:header>
                        <b-row>
                            <b-col sm="12" md="8" lg="8">
                                <h3 class="mb-0">{{ $route.params.id ? formTranslation.clinic.edit_clinic : formTranslation.clinic.add_clinic }}</h3>
                            </b-col>
                            <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('clinic_list')">
                                <div class="d-flex justify-content-end">
                                    <button type="button" class="btn btn-sm btn-primary" @click="$router.go(-1);">
                                        <i class="fa fa-angle-double-left"></i> {{formTranslation.common.back}}
                                    </button>
                                </div>
                            </b-col>
                        </b-row>
                    </template>

                    <div class="row">
                        <div class="col-md-12">
                            <div class="row">
                                <div class="col-md-12">
                                    <h4 class="text-primary mb-4">{{formTranslation.common.basic_details}}</h4>
                                </div> 
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="name" class="col-md-12 form-control-label">
                                            {{formTranslation.common.name}} <span class="text-danger">*</span>
                                        </label>
                                        <input id="name"
                                            :class="{ ' is-invalid': submitted && $v.clinicData.name.$error }"
                                            v-model="clinicData.name" 
                                            :placeholder="formTranslation.clinic.clinic_name_plh"
                                            required="required" name="name" type="text" class="form-control">
                                        <div v-if="submitted && !$v.clinicData.name.required"
                                            class="invalid-feedback">{{formTranslation.common.name_required}}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                     <div class="form-group">
                                        <label for="email" class="col-md-12 form-control-label">
                                            {{formTranslation.common.email}} <span class="text-danger">*</span>
                                        </label>
                                         <input id="email"
                                           :class="{ ' is-invalid': submitted && $v.clinicData.email.$error }"
                                           v-model="clinicData.email" 
                                           :placeholder="formTranslation.clinic.email_plh"
                                           required="required" name="email" type="email" class="form-control">
                                        <div v-if="submitted && !$v.clinicData.email.required"
                                            class="invalid-feedback">{{formTranslation.common.email_required}}
                                        </div>
                                        <div v-else-if="submitted && !$v.clinicData.email.emailValidate"
                                            class="invalid-feedback">{{formTranslation.common.invalid_email}}
                                        </div>
                                     </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="contact_no" class="col-md-12 form-control-label">
                                            {{formTranslation.common.contact_no}} <span class="text-danger">*</span>
                                        </label>
                                        <VuePhoneNumberInput v-model=" clinicData.telephone_no " id="contact_no" clearable
                                            :default-country-code=" defaultCountryCode " @update=" contactUpdateHandaler "
                                            no-example>
                                        </VuePhoneNumberInput>
                                            <div v-if="submitted && !$v.clinicData.telephone_no.required"
                                                class="invalid-feedback">{{formTranslation.common.contact_num_required}}
                                            </div>
                                            <div
                                                v-else-if="submitted && !$v.clinicData.telephone_no.minLength || !$v.clinicData.telephone_no.maxLength"
                                                class="invalid-feedback"> {{formTranslation.common.contact_validation_1}}
                                            </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="specialties" class="col-md-12 form-control-label">
                                                    {{formTranslation.clinic.specialties}} <span class="text-danger">*</span>
                                                </label>
                                                <multi-select
                                                    deselect-label=""
                                                    select-label=""
                                                    v-model="clinicData.specialties"
                                                    id="specialties"
                                                    :tag-placeholder="formTranslation.clinic.clinic_sp_plh" 
                                                    :placeholder="formTranslation.clinic.search_placeholder"
                                                    label="label" 
                                                    track-by="id"
                                                    :loading="specializationMultiselectLoader"
                                                    :options="specialization"
                                                    :multiple="true" 
                                                    :taggable="true"
                                                    @tag="addNewSpecialization"   
                                                >
                                                </multi-select>
                                                <span class="text-primary small font-weight-bold">{{formTranslation.clinic.note_specialization}}</span>
                                                <div v-if="submitted && !$v.clinicData.specialties.required"
                                                    class="invalid-feedback">{{formTranslation.clinic.clinic_specialities_required}}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="status" class="col-md-12 form-control-label">
                                                    {{formTranslation.common.status}} <span class="text-danger">*</span>
                                                </label>
                                                <b-select name="status" v-model="clinicData.status" id="status" class="form-control">
                                                    <option value=""> {{formTranslation.appointments.select_status}}</option>
                                                    <option value="1"> {{formTranslation.common.active}}</option>
                                                    <option value="0"> {{formTranslation.common.inactive}}</option>
                                                </b-select>
                                                <div v-if="submitted && !$v.clinicData.status.required" class="invalid-feedback">
                                                    {{formTranslation.appointments.status_required}}
                                                </div>
                                            </div>
                                        </div>
<!--                                        <div class="col-md-6">-->
<!--                                            <div class="form-group">-->
<!--                                                <label for="currency_prefix" class="form-control-label"> {{formTranslation.clinic.currency_prefix}} </label>-->
<!--                                                <input id="currency_prefix"-->
<!--                                                    v-model="clinicData.currency_prefix" -->
<!--                                                    :placeholder="formTranslation.clinic.currency_prefix_plh"-->
<!--                                                    name="currency_prefix" type="text" class="form-control">-->
<!--                                            </div>-->
<!--                                        </div>-->
<!--                                        <div class="col-md-6">-->
<!--                                            <div class="form-group">-->
<!--                                                <label for="currency_postfix" class="form-control-label"> {{formTranslation.clinic.currency_postfix}} </label>-->
<!--                                                <input id="currency_postfix"-->
<!--                                                    v-model="clinicData.currency_postfix" -->
<!--                                                    :placeholder="formTranslation.clinic.currency_postfix_plh"-->
<!--                                                    name="currency_postfix" type="text" class="form-control">-->
<!--                                            </div>-->
<!--                                        </div>-->
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <!-- <label class="form-control-label">
                                                    {{formTranslation.clinic.clinic_logo}} 
                                                </label> -->
                                                <!-- <span class="text-danger">*</span> -->
                                                <div class="kivicare-avatar-upload">
                                                    <div class="kivicare-avatar-edit">
                                                        <input  id="file" type="button"  class="p-2"
                                                                    @click="uploadProfile()" style="color: transparent;">
                                                        <label for="file" v-b-tooltip.hover :title="formTranslation.clinic.edit_profile_img">
                                                            <i class="fas fa-pencil-alt fa-2x"></i>
                                                            </label>
                                                    </div>
                                                    <div class="kivicare-avatar-preview">
                                                        <div id="imagePreview" :style="'background-image: url('+ (defaultImage)+');'">
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- <input
                                                    id="file"
                                                    type="file"
                                                    ref="file"
                                                    class="form-control" v-on:change="uploadProfile()"> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                  <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="address" class="col-md-12 form-control-label">{{formTranslation.common.address}} <span
                                  class="text-danger">*</span></label>
                                        <textarea
                                            name="address" id="address"
                                            class="form-control"
                                            v-model="clinicData.address"
                                            :placeholder="formTranslation.clinic.address_plh">
                                        </textarea>
                                        <div v-if="submitted && !$v.clinicData.address.required"
                                            class="invalid-feedback"> {{formTranslation.common.address_required}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="city" class="col-md-12 form-control-label">
                                            {{formTranslation.common.city}} <span
                                                class="text-danger">*</span>
                                        </label>
                                        <input id="city"
                                            v-model="clinicData.city" 
                                            :placeholder="formTranslation.clinic.city_plh" name="city" type="text"
                                            class="form-control">
                                            <div v-if="submitted && !$v.clinicData.city.required"
                                                class="invalid-feedback"> {{formTranslation.common.city_required}}
                                            </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="country" class="col-md-12 form-control-label">
                                            {{formTranslation.common.country}} <span
                                  class="text-danger">*</span>
                                        </label>
                                        <input id="country"
                                        v-model="clinicData.country" 
                                        :placeholder="formTranslation.clinic.country_plh" name="country"
                                        type="text" class="form-control">
                                         <div v-if="submitted && !$v.clinicData.country.required"
                                            class="invalid-feedback"> {{formTranslation.common.country_required}}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="postal_code" class="col-md-12 form-control-label">{{formTranslation.common.postal_code}} <span
                                        class="text-danger">*</span> </label>
                                        <input id="postal_code"
                                            v-model="clinicData.postal_code" 
                                            :placeholder="formTranslation.clinic.pcode_plh"
                                            name="postal_code" type="text" class="form-control">
                                            <div v-if="submitted && !$v.clinicData.postal_code.required"
                                                class="invalid-feedback"> {{formTranslation.common.postal_code_required}}
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr />
                    
                    <div class="row">
                      <div class="col-md-12">
                        <div class="row">
                          <div class="col-md-12">
                            <h4 class="text-primary mb-4">{{formTranslation.clinic.clinic_admin_detail}}</h4>
                          </div>
                        </div>
                        <div class="row">
                            <div class="col-md-8">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="first_name" class="form-control-label">{{formTranslation.common.fname}} <span class="text-danger">*</span> </label>
                                            <input id="first_name"
                                                    :class="{ ' is-invalid': submitted && $v.clinicData.first_name.$error }"
                                                    v-model="clinicData.first_name" 
                                                    :placeholder="formTranslation.clinic.fname_plh"
                                                    required="required" name="first_name" type="text" class="form-control">
                                            <div v-if="submitted && !$v.clinicData.first_name.required"
                                                class="invalid-feedback">{{formTranslation.common.fname_required}}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                        <label for="last_name" class="col-md-12 form-control-label">
                                            {{formTranslation.common.lname}} <span class="text-danger">*</span>
                                        </label>
                                        <input id="last_name"
                                                :class="{ ' is-invalid': submitted && $v.clinicData.last_name.$error }"
                                                v-model="clinicData.last_name" 
                                                :placeholder="formTranslation.receptionist.lname_plh"
                                                required="required" name="last_name" type="text" class="form-control">
                                        <div v-if="submitted && !$v.clinicData.last_name.required" class="invalid-feedback">
                                            {{formTranslation.common.lname_required}}
                                        </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                        <label for="email" class="form-control-label">{{formTranslation.common.email}} 
                                            <span
                                            class="text-danger">*</span></label>
                                        <input id="email"
                                                :class="{ ' is-invalid': submitted && $v.clinicData.user_email.$error }"
                                                v-model="clinicData.user_email" 
                                                :placeholder="formTranslation.clinic.email_plh"
                                                required="required" name="user_email" type="text" class="form-control">
                                        <div v-if="submitted && !$v.clinicData.user_email.required"
                                            class="invalid-feedback">{{formTranslation.common.email_required}}
                                        </div>
                                        <div v-else-if="submitted && !$v.clinicData.user_email.emailValidate"
                                            class="invalid-feedback">{{formTranslation.common.invalid_email}}
                                        </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                        <label for="mobile_number" class="form-control-label">
                                            {{formTranslation.common.contact_no}} <span class="text-danger">*</span>
                                        </label>
                                        <VuePhoneNumberInput v-model=" clinicData.mobile_number "
                                                    :default-country-code=" defaultCountryCode_admin " id="mobile_number"
                                                    @update=" contactUpdateHandaler_admin " clearable no-example>
                                                </VuePhoneNumberInput>
                                        <div v-if="submitted && !$v.clinicData.mobile_number.required"
                                            class="invalid-feedback">{{formTranslation.common.contact_num_required}}
                                        </div>
                                        <div v-else-if="submitted && (!$v.clinicData.mobile_number.minLength || !$v.clinicData.mobile_number.maxLength )"
                                            class="invalid-feedback">{{formTranslation.common.contact_validation_1}}
                                        </div>
<!--                                        <div v-else-if="submitted && !$v.clinicData.mobile_number.phoneNumber"-->
<!--                                            class="invalid-feedback">{{formTranslation.common.contact_validation_2}}-->
<!--                                        </div>-->
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                        <label for="dob" class="form-control-label">{{formTranslation.common.dob}}.
                                            <!-- <span class="text-danger">*</span> -->
                                            </label>
                                            <input type="date" v-model="clinicData.dob" name="doc_birthdate" id="doc_birthdate" :max="new Date().toISOString().slice(0, 10)">
                                            <!-- :class="{ ' is-invalid': submitted && $v.clinicData.dob.$error }" -->
                                        <!-- <vc-date-picker
                                            id="doc_birthdate"
                                            title-position="left"
                                            v-model="clinicData.dob"
                                            :max-date="new Date().setFullYear(new Date().getFullYear() - 18)"
                                            :placeholder="formTranslation.clinic.welcome_date_plh"
                                            :popover="{ placement: 'bottom', visibility: 'click' }"
                                        >
                                            <template v-slot="{ inputValue }">
                                            <input
                                                class="form-control date-picker"
                                                readonly
                                                :value="inputValue"
                                            />
                                            </template>
                                        </vc-date-picker> -->
                                        <!-- <div v-if="submitted && !$v.clinicData.dob.required" class="invalid-feedback">
                                            {{formTranslation.common.dob_required}}
                                        </div> -->
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                        <label for="gender" class="form-control-label">
                                            {{formTranslation.common.gender}} <span class="text-danger">*</span>
                                        </label>
                                        <div>
                                            <div class="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="male" name="gender" v-model="clinicData.gender"
                                                    value="male" class="custom-control-input">
                                            <label class="custom-control-label" for="male">{{formTranslation.common.male}}</label>
                                            </div>
                                            <div class="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="female" name="gender" v-model="clinicData.gender"
                                                    value="female" class="custom-control-input">
                                            <label class="custom-control-label" for="female">{{formTranslation.common.female}}</label>
                                            </div>
                                            <div class="custom-control custom-radio custom-control-inline" v-if="defaultUserRegistrationFormSettingData === 'on'">
                                            <input type="radio" id="other" name="gender" v-model="clinicData.gender"
                                                    value="other" class="custom-control-input">
                                            <label class="custom-control-label" for="other">{{formTranslation.common.other}}</label>
                                            </div>
                                        </div>
                                        <div v-if="submitted && !$v.clinicData.gender.required" class="invalid-feedback">
                                            {{formTranslation.common.gender_required}}
                                        </div> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                        <div class="kivicare-avatar-upload">
                                                <div class="kivicare-avatar-edit">
                                                    <input  id="admin_file" type="button" ref="admin_file" class="p-2"
                                                                @click="uploadAdmin()" style="color: transparent;">
                                                    <label for="admin_file" v-b-tooltip.hover :title="formTranslation.clinic.edit_profile_img">
                                                        <i class="fas fa-pencil-alt fa-2x"></i>
                                                    </label>
                                                </div>
                                                <div class="kivicare-avatar-preview">
                                                    <div id="adminImagePreview" :style="'background-image: url('+ adminPreview+');'">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                    
                    <template v-slot:footer>
                        <div class="row">
                            <div class="col-md-12 p-0">
                                <div class="d-flex justify-content-end">
                                <button v-if="!loading" class="btn btn-primary rtl-ml-2" type="submit"> <i class="fa fa-save"></i> {{ formTranslation.receptionist.save_btn }} </button>
                                <button v-else class="btn btn-primary" type="submit" disabled>
                                    <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                                </button>
                                <button type="button" class="btn btn-outline-primary" @click="$router.go(-1);">
                                    {{formTranslation.common.cancel}}
                                </button>
                                </div>
                            </div>
                        </div>
                    </template>

                </b-card>
            </form>
        </b-col>
    </b-row>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import {required, alpha, minLength, maxLength} from "vuelidate/lib/validators";
import {validateForm, phoneNumber, alphaSpace, emailValidate} from "../../config/helper";
import {post,get} from "../../config/request";

export default {
    components: {
        VuePhoneNumberInput,
    },
    data: () => {
        return {
            cardTitle: 'Add clinic',
            clinicData: {},
            loading: false,
            submitted: false,
            buttonText: '<i class="fa fa-file"></i> Save ',
            defaultClinic: window.request_data.kiviCarePluginURL + 'assets/images/kc-demo-img.png', 
            defaultImage: window.request_data.kiviCarePluginURL + 'assets/images/kc-demo-img.png',
            adminPreview:window.request_data.kiviCarePluginURL + 'assets/images/kc-demo-img.png',
            formLoader:false,
            defaultCountryCode: null,
            defaultCountryCode_admin: null,
            defaultUserRegistrationFormSettingData: 'on',
        }
    },
    validations: {
        clinicData: {
            name: {required},
            email: {required,emailValidate},
            telephone_no: {required,
                minLength: minLength(4),
                maxLength: maxLength(15)},
            status: {required},
            city: {required,},
            address:{required},
            country: {
                required,
            },
            postal_code: {
                required,
            },
            first_name: {
              required,
            },
            last_name: {
              required,
            },
            mobile_number: {
              required,
              // phoneNumber,
              minLength: minLength(4),
              maxLength: maxLength(15)
            },
            user_email: {
              required,
              emailValidate
            },
            // dob: {required},
            specialties:{
                required
            },
            gender:{
                required
            }
        },

    },
    mounted() {
        this.getCountryCodeData();
        this.getUserRegistrationFormData();
        this.clinicData = this.defaultClinicData();
        this.init();
    },
    methods: {
        contactUpdateHandaler: function (val) {
            this.clinicData.country_code = val.countryCode;
            this.clinicData.country_calling_code = val.countryCallingCode;
        },

        contactUpdateHandaler_admin: function (val) {

            this.clinicData.country_code_admin = val.countryCode;
            this.clinicData.country_calling_code_admin = val.countryCallingCode;
        },
        init: function () {
            /// Code for the Edit functionality...
            if (this.$route.params.id !== undefined) {

                this.cardTitle = this.formTranslation.common.edit_clinic;
                this.buttonText = '<i class="fa fa-save"></i> '+this.formTranslation.common.save;

                this.formLoader = true;
                get('clinic_edit', {
                    id: this.$route.params.id
                })
                    .then((response) => {
                      this.formLoader = false;
                        if (response.data.status !== undefined && response.data.status === true) {
                            this.clinicData = response.data.data
                            if (response.data.data.country_calling_code !== '' && response.data.data.country_calling_code !== undefined) {
                                this.defaultCountryCode = response.data.data.country_code;
                            }
                            if (response.data.data.country_calling_code_admin !== '' && response.data.data.country_calling_code_admin !== undefined) {
                                this.defaultCountryCode_admin = response.data.data.country_code_admin;
                            }
                            if (this.clinicData.clinic_profile) {
                                this.defaultImage = this.clinicData.clinic_profile
                            }
                            if (this.clinicData.profile_image) {
                                this.adminPreview = this.clinicData.profile_image
                            }
                            // this.clinicData.dob = new Date( this.clinicData.dob + ' 00:00');
                        }
                    })
                    .catch((error) => {
                      this.formLoader = false;
                        console.log(error);
                        displayErrorMessage(this.formTranslation.clinic.doctor_record_not_found);
                    })
            }
            this.getDynamicTranslationKey();
        },
        handleSubmit: function () {

            this.loading = true;
            this.submitted = true;
            // stop here if form is invalid
           
            this.$v.$touch();
            this.$nextTick(() => {
              if(document.querySelector('.is-invalid') !== null && document.querySelector('.is-invalid') !== undefined){
                document.querySelector('.is-invalid').scrollIntoView({block: "center", behavior: "smooth"})
              }else if(document.querySelector('.invalid-feedback') !== null && document.querySelector('.invalid-feedback') !== undefined){
                document.querySelector('.invalid-feedback').scrollIntoView({block: "center", behavior: "smooth"})
              }
            })
            if (this.$v.clinicData.$invalid) {
                this.loading = false;
                return;
            }
            if (validateForm("clinicDataForm")) {
                post('clinic_save',this.clinicData)
                    .then((response) => {
                        this.loading = false;
                        this.submitted = false;
                        if (response.data.status !== undefined && response.data.status === true) {
                            displayMessage(response.data.message);
                            this.$store.dispatch("fetchAllClinic", {self: this})
                            this.$router.push({name: 'clinic'});
                        } else {
                            displayErrorMessage(response.data.message)
                        }

                    })
                    .catch((error) => {
                        this.submitted = false;
                        this.loading = false;
                        displayErrorMessage(this.formTranslation.common.internal_server_error)
                    })
            }
        },
        defaultClinicData: function () {
          var oneYearFromNow = new Date();
          oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 18);
            return {
                name: '',
                email: '',
                telephone_no: '',
                country_calling_code: '',
                country_code: '',
                address: '',
                city: '',
                country: '',
                postal_code: '',
                status: 1,
                specialties: [],
                currency_prefix: '$',
                currency_postfix: '',
                clinic_profile:'',
                first_name: '',
                last_name: '',
                mobile_number: '',
                country_calling_code_admin: '',
                country_code_admin: '',
                gender: '',
                user_email: '',
                dob: '',
                profile_image: ''
            }
        },
        addNewSpecialization: function (value) {
            let specialitiesObj = {
                label: value,
                type: 'specialization',
                value: value.replace(' ', '_'),
                status: 1,
            }
            let _this = this;
            post('static_data_save', specialitiesObj)
                .then((response) => {
                if (response.data.status !== undefined && response.data.status === true) {
                    // this.specialization.push({id: response.data.insert_id, label: value})
                    this.clinicData.specialties.push({id: response.data.insert_id, label: value});
                }
            })
            .catch((error) => {
                console.log(error);
                displayErrorMessage(this.formTranslation.common.internal_server_error)
            })
        },
        uploadAdmin(){
          let _this = this;

          var custom_uploader = kivicareCustomImageUploader(this.formTranslation)

          custom_uploader.on('select', function () {
            var attachment = custom_uploader.state().get('selection').first().toJSON();
            _this.adminPreview = attachment.url;
            _this.clinicData.profile_image = attachment.id;
          });

          //Open the uploader dialog
          custom_uploader.open();
            
        },
      uploadProfile(){
        let _this = this;

        var custom_uploader = kivicareCustomImageUploader(this.formTranslation)

        custom_uploader.on('select', function () {
          var attachment = custom_uploader.state().get('selection').first().toJSON();
          _this.defaultImage = attachment.url;
          _this.clinicData.clinic_profile = attachment.id;
        });

        //Open the uploader dialog
        custom_uploader.open();
      },
        getDynamicTranslationKey: function () {
            if(this.$store.state.staticDataModule !== undefined && this.$store.state.staticDataModule.langTranslateData !== undefined && this.$store.state.staticDataModule.langTranslateData !== []) {
                this.$store.dispatch("staticDataModule/fetchLangTranslateData", {
                filePath: window.request_data.kiviCarePluginURL,
                current: 'temp',
                module: ''
                });
            }
        },
        getCountryCodeData: function () {
            get('get_country_code_settings_data', {})
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        this.defaultCountryCode = response.data.data.country_code;
                        this.defaultCountryCode_admin = response.data.data.country_code;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })
        },
        getUserRegistrationFormData: function () {
            get('get_user_registration_form_settings_data', {})
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        this.defaultUserRegistrationFormSettingData = response.data.data.userRegistrationFormSettingData;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })
        },
    },
    computed: {
        specialization(){
          return this.$store.state.staticDataModule.static_data.specialization
        },
       specializationMultiselectLoader(){
         return this.$store.state.staticDataModule.static_data_loader
       }
    }
}
</script>
<style scoped>
    [type="date"] {
    background:#fff url(https://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/calendar_2.png)  97% 50% no-repeat ;
    }
    [type="date"]::-webkit-inner-spin-button {
    display: none;
    }
    [type="date"]::-webkit-calendar-picker-indicator {
    opacity: 0;
    }
    label {
    display: block;
    }
    #doc_birthdate {
        border: 1px solid #c4c4c4;
        border-radius: 5px;
        background-color: #fff;
        padding: 3px 5px;
        box-shadow: inset 0 3px 6px rgba(0,0,0,0.1);
        /* width: 190px; */
        width: 100%;
        height: 45px;
        color:#8c9cad
    }
    #doc_birthdate ::placeholder{
        color:#8c9cad
    }
</style>