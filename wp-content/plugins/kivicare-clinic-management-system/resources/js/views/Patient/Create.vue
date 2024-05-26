<template>
    <b-row>
      <div class="page-loader-section" v-if="formLoader">
        <loader-component-2></loader-component-2>
      </div>
        <b-col v-else sm="12">
            <form id="patientDataForm" @submit.prevent="handleSubmit" :novalidate="true">
                <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                    <template v-slot:header>
                        <b-row>
                            <b-col sm="12" md="8" lg="8">
                                <h3 class="mb-0">{{ cardTitle }}</h3>
                            </b-col>
                            <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('patient_list')">
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
                            <h4 class="text-primary mb-4">{{formTranslation.common.basic_details}}</h4>
                        </div>
                    </div>

                    <div class="row">
                        <div v-if=" u_id_enabled " class="col-md-4">

                            <div class="form-group">
                                <label for="first_name" class="form-control-label">{{formTranslation.patient.lbl_patient_unique_id}} 
                                     <span class="text-danger">*</span>
                                </label>
                                       <!-- :class="{ ' is-invalid': submitted && $v.patientData.u_id.$error }" -->
                                <input id="first_uid"
                                       v-model="patientData.u_id" 
                                       required="required" name="u_id" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-4">

                            <div class="form-group">
                                <label for="first_name" class="form-control-label">{{formTranslation.common.fname}} <span
                                    class="text-danger">*</span></label>
                                <input id="first_name"
                                       :class="{ ' is-invalid': submitted && $v.patientData.first_name.$error }"
                                       v-model="patientData.first_name" 
                                       :placeholder="formTranslation.patient.fname_plh"
                                       required="required" name="first_name" type="text" class="form-control">
                                <div v-if="submitted && !$v.patientData.first_name.required"
                                     class="invalid-feedback">{{formTranslation.common.fname_required}}
                                </div>
                                <div
                                    v-else-if="submitted && (!$v.patientData.first_name.minLength || !$v.patientData.first_name.maxLength)"
                                    class="invalid-feedback"> {{formTranslation.common.fname_validation_2}}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4"> 
                            <div class="form-group">
                                <label for="last_name" class="form-control-label">
                                    {{formTranslation.common.lname}} <span class="text-danger">*</span>
                                </label>
                                <input id="last_name"
                                       :class="{ ' is-invalid': submitted && $v.patientData.last_name.$error }"
                                       v-model="patientData.last_name" 
                                       :placeholder="formTranslation.patient.lname_placeholder"
                                       required="required" name="first_name" type="text" class="form-control">
                                <div v-if="submitted && !$v.patientData.last_name.required" class="invalid-feedback">
                                    {{formTranslation.common.lname_required}}
                                </div>
                                <div
                                    v-if="submitted && (!$v.patientData.last_name.minLength || !$v.patientData.last_name.maxLength)"
                                    class="invalid-feedback"> {{formTranslation.common.lname_validation_2}}
                                </div>
                            </div>
                        </div>
                       
                    </div>

                    <div class="row">
                        <div class="col-md-8">
                            <div class="row">
                                <div class="col-md-6" v-if="userData.addOns.kiviPro == true && (getUserRole() == 'administrator' || getUserRole() == 'doctor')">
                                    <div class="form-group" >
                                        <label for="doctor_id" class="form-control-label">
                                            {{ formTranslation.patient.select_clinic }} <span class="text-danger">*</span>
                                        </label>
                                        <multi-select
                                                deselect-label=""
                                                select-label=""
                                                v-model="patientData.clinic_id"
                                                :tag-placeholder="formTranslation.patient.tag_select_clinic_plh" id="clinic_id"
                                                :placeholder="formTranslation.patient.search_placeholder"
                                                label="label"
                                                :loading="clinicMultiselectLoader"
                                                track-by="id" :options="clinics"
                                                :multiple="true"
                                                :taggable="true"
                                        ></multi-select>
                                      <div v-if="submitted && !$v.patientData.clinic_id.required"
                                           class="invalid-feedback">{{formTranslation.common.clinic_is_required}}
                                      </div>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="email" class="form-control-label">{{formTranslation.common.email}} <span
                                            class="text-danger">*</span></label>
                                        <input id="email"
                                            :class="{ ' is-invalid': submitted && $v.patientData.user_email.$error }"
                                            v-model="patientData.user_email" 
                                            :placeholder="formTranslation.patient.email_placeholder"
                                            required="required" name="user_email" type="text" class="form-control">
                                        <div v-if="submitted && !$v.patientData.user_email.required"
                                            class="invalid-feedback">{{formTranslation.common.email_required}}
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="mobile_number" class="form-control-label">{{formTranslation.common.contact_no}}. <span
                                            class="text-danger">*</span></label>
                                        <VuePhoneNumberInput v-model=" patientData.mobile_number "
                                        :default-country-code=" defaultCountryCode " id="phone_number"
                                        @update=" contactUpdateHandaler " clearable no-example>
                                        </VuePhoneNumberInput>
                                        <div v-if="submitted && !$v.patientData.mobile_number.required"
                                            class="invalid-feedback">{{formTranslation.common.contact_num_required}}
                                        </div>
                                        <div
                                            v-else-if="submitted && !$v.patientData.mobile_number.minLength || !$v.patientData.mobile_number.maxLength"
                                            class="invalid-feedback"> {{formTranslation.common.contact_validation_1}}
                                        </div>
                                        <!-- <div v-else-if="submitted && !$v.patientData.mobile_number.phoneNumber"
                                            class="invalid-feedback">{{formTranslation.common.contact_validation_2}}
                                        </div> -->
                                    </div>
                                </div>

                            <!-- </div>
                            <div class="row"> -->
                                <div class="col-md-6" v-if="!hideFields.includes('dob')">
                                    <div class="form-group">
                                        <label for="dob" class="form-control-label">{{formTranslation.common.dob}}. 
                                            <!-- <span class="text-danger">*</span> -->
                                            </label>
                                            <input type="date" v-model="patientData.dob" name="doc_birthdate" id="doc_birthdate" :max="new Date().toISOString().slice(0, 10)">
                                            <!-- :class="{ ' is-invalid': submitted && $v.patientData.dob.$error }" -->
                                        <!-- <vc-date-picker
                                            id="doc_birthdate"
                                            title-position="left"
                                            v-model="patientData.dob"
                                            :max-date="new Date()"
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
                                        <!-- <div v-if="submitted && !$v.patientData.dob.required" class="invalid-feedback">{{formTranslation.common.dob_required}}
                                        </div> -->
                                    </div>
                                </div>

                                <div class="col-md-6" v-if="!hideFields.includes('blood_group')">
                                    <div class="form-group">
                                        <label for="blood_group" class="form-control-label">{{formTranslation.clinic.blood_group}} </label>
                                        <b-select name="blood_group" id="blood_group" class="form-control"
                                                v-model="patientData.blood_group" >
                                            <option value="default" > {{formTranslation.clinic.select_blood_group}}</option>
                                            <option v-for="(group, index) in bloodGroups" :value="group" :key="index">{{ group }}</option>
                                        </b-select>
                                    </div>
                                </div>
                            <!-- </div>
                            <div class="row"> -->

                                <div class="col-md-6" id="patient_gender_div">
                                    <div class="form-group">
                                        <label for="gender" class="form-control-label">{{formTranslation.common.gender}} <span
                                            class="text-danger">*</span></label>
                                        <div class="col-md-12">
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input type="radio" id="male" name="gender" v-model="patientData.gender"
                                                    value="male" class="custom-control-input">
                                                <label class="custom-control-label" for="male">{{formTranslation.common.male}}</label>
                                            </div>
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input type="radio" id="female" name="gender" v-model="patientData.gender"
                                                    value="female" class="custom-control-input">
                                                <label class="custom-control-label" for="female">{{formTranslation.common.female}}</label>
                                            </div>
                                            <div class="custom-control custom-radio custom-control-inline" v-if="defaultUserRegistrationFormSettingData === 'on'">
                                                <input type="radio" id="other" name="gender" 
                                                    v-model="patientData.gender"
                                                    value="other" class="custom-control-input">
                                                <label class="custom-control-label" for="other">{{formTranslation.common.other}}</label>
                                            </div>
                                        </div>
                                        <div v-if="submitted && !$v.patientData.gender.required" class="invalid-feedback">{{formTranslation.common.gender_required}}
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <!-- <label class="sform-control-label">  {{ formTranslation.receptionist.upload_profile }} </label> -->
                                <div class="kivicare-avatar-upload">
                                    <div class="kivicare-avatar-edit">
                                        <input  id="file" type="button"  class="p-2"
                                                    @click.prevent="uploadProfile()" style="color: transparent;">
                                        <label for="file" v-b-tooltip.hover :title="formTranslation.clinic.edit_profile_img">
                                            <i class="fas fa-pencil-alt fa-2x"></i>
                                            </label>
                                    </div>
                                    <div class="kivicare-avatar-preview">
                                        <div id="imagePreview" :style="'background-image: url('+ (imagePreview)+');'">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr v-if="!hideFields.includes('address') || !hideFields.includes('city')
                     || !hideFields.includes('country') || !hideFields.includes('postal_code')" />

                    <div class="row" v-if="!hideFields.includes('address') || !hideFields.includes('city')
                     || !hideFields.includes('country') || !hideFields.includes('postal_code')">
                        <div class="col-md-12">
                            <h4 class="text-primary mb-4">{{formTranslation.doctor.other_details}}</h4>
                        </div>
                    </div>

                    <div class="row" v-if="!hideFields.includes('address')">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="address" class="form-control-label">{{formTranslation.common.address}}</label>
                                <textarea
                                    name="address"
                                    id="address"
                                    class="form-control"
                                    v-model="patientData.address"
                                    :placeholder="formTranslation.patient.address_placeholder">
                                </textarea>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-4" v-if="!hideFields.includes('city')">
                            <div class="form-group">
                                <label for="city" class="form-control-label">{{formTranslation.common.city}}</label>
                                       <!-- :class="{ ' is-invalid': submitted && $v.patientData.city.$error }" -->
                                <input id="city"
                                       v-model="patientData.city"
                                       :placeholder="formTranslation.patient.city_placeholder"
                                       name="city"
                                       type="text"
                                       class="form-control">
                                <!-- <div v-if="submitted && !$v.patientData.city.maxLength"
                                     class="invalid-feedback"> {{formTranslation.common.city_validation_2}}
                                </div> -->
                            </div>
                        </div>
                         <div class="col-md-4" v-if="!hideFields.includes('country')">
                            <div class="form-group">
                                <label for="country" class="form-control-label">{{formTranslation.common.country}}</label>
                                       <!-- :class="{ ' is-invalid': submitted && $v.patientData.country.$error }" -->
                                <input id="country"
                                       v-model="patientData.country" 
                                       :placeholder="formTranslation.patient.country_placeholder" name="country"
                                       type="text" class="form-control">
                               
                                <!-- <div v-if="submitted && !$v.patientData.country.maxLength"
                                     class="invalid-feedback"> {{formTranslation.common.country_validation_2}}
                                </div> -->
                            </div>
                        </div>
                        <div class="col-md-4" v-if="!hideFields.includes('postal_code')">
                            <div class="form-group">
                                <label for="postal_code" class="form-control-label">{{formTranslation.common.postal_code}}</label>
                                       <!-- :class="{ ' is-invalid': submitted && $v.patientData.postal_code.$error }" -->
                                <input id="postal_code"
                                       v-model="patientData.postal_code" 
                                       :placeholder="formTranslation.patient.pcode_placeholder"
                                       name="postal_code" type="text" class="form-control">
               
                                <!-- <div v-if="submitted && !$v.patientData.postal_code.maxLength"
                                     class="invalid-feedback"> {{formTranslation.common.postal_code_validation_2}}
                                </div> -->
                            </div>
                        </div>
                    </div>
                    <hr v-if="isCustomeFieldExist" >

                    <div  class="row" v-if="isCustomeFieldExist">
                        <div class="col-md-12">
                        <h4 class="text-primary mb-3"> {{formTranslation.doctor.extra_detail}}</h4>
                        </div>
                    </div>

                    <div class="row" >
                        <div class="col-md-12">
                        <!-- Component for the custom fields -->
                        <get-custom-fields
                            v-if="this.$route.params.id === undefined"
                            module_type="patient_module"
                            :module_id="String(0)"
                            @bindCustomField="getCustomFieldsValues"
                            :fieldsValue="customFieldsData"
                            @customFieldAvailable="isCustomeFieldExist=true"
                            @requiredCustomField="getRequireFields"
                        ></get-custom-fields>
                            <edit-custom-fields v-else
                                module_type="patient_module"
                                :module_id="String(this.$route.params.id )"
                                @bindCustomField="getCustomFieldsValues"
                                :fieldsValue="customFieldsData"
                                @requiredCustomField="getRequireFields"
                            ></edit-custom-fields>
                        </div>
                    </div>

                    <template v-slot:footer>
                        <div class="row">
                            <div class="col-md-12 p-0">
                                <div class="d-flex justify-content-end">
                                    <button v-if="!loading" class="btn btn-primary" type="submit"><i class="fa fa-save"></i> {{ formTranslation.patient.save_btn }} </button>
                                    <button v-else class="btn btn-primary" type="submit" disabled>
                                        <i class="fa fa-sync fa-spin"></i>&nbsp; {{ formTranslation.common.loading }}
                                    </button>
                                    <button type="button" class="btn btn-outline-primary" @click="$router.go(-1);"> {{formTranslation.common.cancel}}</button>
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
import {required, numeric, alpha, email, minLength, maxLength, requiredIf} from "vuelidate/lib/validators";
import {post, get} from "../../config/request";
import {alphaSpace, emailValidate, phoneNumber, validateForm} from "../../config/helper";

export default {
    components: {
        VuePhoneNumberInput,
    },
    data: () => {
        return {
            u_id_enabled:'',
            patientData: {},
            loading: false,
            submitted: false,
            cardTitle: 'Add patient',
            buttonText: '<i class="fa fa-save"></i> Save',
            qualification: {},
            bloodGroups: [
                'A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'
            ],
            requiredFields: [],
            clinics:[],
            // imagePreview: pluginBASEURL + 'assets/images/kc-demo-img.png',
            imagePreview: pluginBASEURL + 'assets/images/kc-demo-img.png',
            hideFields:[],
            formLoader:false,
           clinicMultiselectLoader:true,
          isCustomeFieldExist:false,
          defaultCountryCode: null,
          defaultUserRegistrationFormSettingData: 'on',
        }
    },
    mounted() {
        this.getCountryCodeData();
        this.getUserRegistrationFormData();
        this.cardTitle = this.formTranslation.patient.add_patient;
        this.patientData = this.defaultPatientData();
        this.init();
        this.getClinics();
        this.getHideFieldsArrayFromFilter()
    },
    validations: {
        patientData: {
            first_name: {
                required,
                minLength: minLength(2),
                maxLength: maxLength(50)
            },
            last_name: {
                required,
                minLength: minLength(2),
                maxLength: maxLength(50)
            },
            user_email: {
                required,
            },
            mobile_number: {
                required,
                // phoneNumber,
                minLength: minLength(4),
                maxLength: maxLength(15)
            },
            gender:{
                required
            },
            clinic_id:{
              required: requiredIf(function () {
                return this.userData.addOns.kiviPro == true && (this.getUserRole() == 'administrator' || this.getUserRole() == 'doctor')
              })
            }
            // city: {
            //     maxLength: maxLength(30)
            // },
            // country: {
            //     maxLength: maxLength(30)
            // },
            // postal_code: {
            //     maxLength: maxLength(12)
            // },
            // dob: {required},
        }
    },
    methods: {
        contactUpdateHandaler: function (val) {
            this.patientData.country_code = val.countryCode;
            this.patientData.country_calling_code = val.countryCallingCode;
        },
        init: function () {
            /// Code for the Edit functionality...
            if (this.$route.params.id !== undefined) {
                this.cardTitle = this.formTranslation.patient.edit_patient;
                this.buttonText = '<i class="fa fa-save"></i> '+this.formTranslation.common.save;

                this.formLoader = true;
                get('patient_edit', {
                    id: this.$route.params.id,
                    p_id : this.$route.params.pid
                })
                    .then((response) => {
                        setTimeout(() => {
                            this.formLoader = false;
                        }, 200)
                        if (response.data.status !== undefined && response.data.status === true) {
                            setTimeout(() => {
                                this.patientData = response.data.data
                                if (response.data.data.country_calling_code !== '' && response.data.data.country_calling_code !== undefined) {
                                    this.defaultCountryCode = response.data.data.country_code;
                                }
                                // this.patientData.dob = new Date(this.patientData.dob + ' 00:00');
                                this.patientData.custom_fields= response.data.custom_filed
                                this.isCustomeFieldExist =  (this.patientData.custom_fields !== undefined && this.patientData.custom_fields.length > 0) ;
                                if (this.patientData.user_profile) {
                                    this.imagePreview = this.patientData.user_profile
                                }
                                if(this.patientData.blood_group === undefined || this.patientData.blood_group === null ||  this.patientData.blood_group === ''){
                                this.patientData.blood_group = 'default'
                                }
                                if(this.patientData.u_id !==undefined && this.patientData.u_id === '' && this.userData.unquie_id_status !== undefined){
                                    this.patientData.u_id = this.userData.unquie_id_value;
                                }
                            }, 200)
                        }
                    })
                    .catch((error) => {
                      this.formLoader = false;
                        console.log(error);
                        displayErrorMessage(this.formTranslation.widgets.record_not_found);
                    })
            }else{
              if(this.userData.unquie_id_status !== undefined){
                  post('get_unique_id')
                    .then((data) => {
                        this.patientData.u_id = data.data.data
                    })
                // this.patientData.u_id = this.userData.unquie_id_value;
              }
            }

            if(this.userData.unquie_id_status !== undefined && this.userData.unquie_id_status == true ){
                  this.u_id_enabled = this.userData.unquie_id_status;
            }else{
              this.u_id_enabled = false
            }
        },
        uploadProfile() {
          let _this = this;

          var custom_uploader = kivicareCustomImageUploader(this.formTranslation);

          custom_uploader.on('select', function () {
            var attachment = custom_uploader.state().get('selection').first().toJSON();
            _this.imagePreview = attachment.url;
            _this.patientData.profile_image = attachment.id;
          });

          //Open the uploader dialog
          custom_uploader.open();

        },
        defaultPatientData: function () {
            return {
                first_name: '',
                last_name: '',
                username: '',
                user_email: '',
                user_pass: '',
                mobile_number: '',
                country_code: '',
                country_calling_code: '',
                gender: '',
                dob: '',
                about_me: '',
                address: '',
                city: '',
                country: '',
                postal_code: '',
                blood_group: 'default',
                custom_fields: {},
                profile_image:'',
                u_id:''
            }
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
            if (this.$v.patientData.$invalid) {
                this.loading = false;
                return;
            }
            if (this.requiredFields.length > 0) {
                this.loading = false;
                displayErrorMessage(this.formTranslation.common.all_required_field_validation)
                return;
            }
            if (validateForm("patientDataForm")) {
                // this.patientData.dob = moment(this.patientData.dob).format("YYYY-MM-DD");
                post('patient_save', this.patientData)
                    .then((response) => {
                        this.loading = false;
                        if (response.data.status !== undefined && response.data.status === true) {
                            displayMessage(response.data.message);
                            this.$router.push({name: 'patient'});
                        } else {
                            // this.patientData.dob = new Date(this.patientData.dob + ' 00:00');
                            displayErrorMessage(response.data.message)
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        this.loading = false;
                        displayErrorMessage(this.formTranslation.common.internal_server_error)
                    })
            }

        },
        getCustomFieldsValues: function (fieldsObj) {
            if(!fieldsObj || fieldsObj === undefined){
              return false;
            }
            this.patientData.custom_fields = fieldsObj;
        },
        getRequireFields: function (validateRequired) {
            this.requiredFields = validateRequired;
        },
        getClinics:function () {
            this.clinicMultiselectLoader=true;
            get('get_static_data', {
                    data_type: 'clinic_list',
                })
            .then((response) => {
              this.clinicMultiselectLoader=false;
                if (response.data.status !== undefined && response.data.status === true) {
                    this.clinics = response.data.data
                }
            })
            .catch((error) => {
              this.clinicMultiselectLoader=false;
                console.log(error);
                displayErrorMessage(this.formTranslation.common.internal_server_error);
            })
        },
       getHideFieldsArrayFromFilter:function () {
        get('get_hide_fields_array_from_filter',{})
            .then((response) => {
              if (response.data.status !== undefined && response.data.status === true) {
                this.hideFields = response.data.data
              }
            })
            .catch((error) => {
              console.log(error);
              displayErrorMessage(this.formTranslation.common.internal_server_error);
            })
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
        userData() {
            return this.$store.state.userDataModule.user;
        },
        customFieldsData() {
        return (this.patientData.custom_fields ? this.patientData.custom_fields : []);
        },
        // formTranslation: function () {
        // return this.$store.state.staticDataModule.langTranslateData ;
        // }
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