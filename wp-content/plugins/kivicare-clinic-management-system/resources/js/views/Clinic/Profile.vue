<template>
    <div>
      <div class="page-loader-section" v-if="formLoader">
        <loader-component-2></loader-component-2>
      </div>
      <b-row v-if="formTranslation.common !== undefined && !formLoader">
        <b-col class="col-xl-9 col-lg-8 order-lg-1  order-2">
          <form id="clinicDataForm" @submit.prevent="handleSubmit" :novalidate="true">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col-8">
                    <h3 class="mb-0">{{formTranslation.doctor.edit_profile}} </h3>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <h6 class="heading-small text-muted mb-4">{{formTranslation.clinic.clinic_info}}</h6>
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label for="name" class="form-control-label">
                          {{formTranslation.clinic.clinic_name}} <span class="text-danger">*</span>
                        </label>
                        <input id="name"
                               :class="{ ' is-invalid': submitted && $v.clinicData.name.$error }"
                               v-model="clinicData.name"
                               :placeholder="formTranslation.clinic.plh_clinic_name"
                               required="required" name="name" type="text" class="form-control">
                        <div v-if="submitted && !$v.clinicData.name.required"
                             class="invalid-feedback">{{formTranslation.common.name_required}}
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label for="email" class="form-control-label">
                          {{formTranslation.common.email_address}} <span class="text-danger">*</span>
                        </label>
                        <input id="email"
                               :class="{ 'is-invalid': submitted && $v.clinicData.email.$error }"
                               v-model="clinicData.email" :placeholder="formTranslation.clinic.plh_email"
                               required="required" name="email" type="email" class="form-control">
                        <div v-if="submitted && !$v.clinicData.email.required"
                             class="invalid-feedback">{{formTranslation.common.email_required}}
                        </div>
                        <div v-else-if="submitted && !$v.clinicData.email.emailValidate"
                             class="invalid-feedback">{{formTranslation.common.invalid_email}}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label for="telephone_no" class="form-control-label">
                          {{formTranslation.common.contact_no}} <span class="text-danger">*</span>
                        </label>
                        <VuePhoneNumberInput v-model="clinicData.telephone_no" id="telephone_no" clearable 
                        :default-country-code="defaultCountryCode" @update="contactUpdateHandaler" no-example>
                      </VuePhoneNumberInput>
                        <div v-if="submitted && !$v.clinicData.telephone_no.required"
                             class="invalid-feedback">{{formTranslation.common.contact_num_required}}
                        </div>
                        <div
                            v-else-if="submitted && !$v.clinicData.telephone_no.minLength || !$v.clinicData.telephone_no.maxLength"
                            class="invalid-feedback"> {{formTranslation.common.contact_validation_1}}
                        </div>
<!--                        <div v-else-if="submitted && !$v.clinicData.telephone_no.phoneNumber"-->
<!--                             class="invalid-feedback">{{formTranslation.common.contact_validation_2}}-->
<!--                        </div>-->
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label for="specialties" class="form-control-label">
                          {{formTranslation.clinic.specialities}} <span class="text-danger">*</span>
                        </label>
                        <div class="kivi-pr">
                          <multi-select
                              deselect-label=""
                              select-label=""
                              v-model="clinicData.specialties"
                              id="specialties"
                              :tag-placeholder="formTranslation.clinic.plh_clinic_specialization"
                              :placeholder="formTranslation.clinic.search_placeholder"
                              label="label" track-by="id" :options="specialization"
                              :multiple="true"
                              :loading="specializationMultiselectLoader"
                              @tag="addNewSpecialization"
                              :taggable="true"
                          ></multi-select>
                          <span class="select_clear_btn"  @click="clinicData.specialties = ''">×</span>
                        </div>
                        <span class="text-primary small font-weight-bold">{{formTranslation.clinic.note_specialization}}</span>
                        <div v-if="submitted && !$v.clinicData.specialties.required"
                             class="invalid-feedback"> {{formTranslation.clinic.clinic_specialities_required}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr class="my-4" />
                <!-- Address -->
                <h6 class="heading-small text-muted mb-4"> {{formTranslation.common.contact_info}} </h6>
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label for="address" class="form-control-label">{{formTranslation.common.address}} <span class="text-danger">*</span></label>
                        <textarea
                            name="address" id="address" class="form-control"
                            v-model="clinicData.address" :placeholder="formTranslation.clinic.plh_address"></textarea>
                        <div v-if="submitted && !$v.clinicData.address.required"
                             class="invalid-feedback"> {{formTranslation.common.address_required}}
                        </div>
                      </div>
                    </div>

                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label for="country" class=" form-control-label"> {{formTranslation.common.country}} <span class="text-danger">*</span></label>
                        <input id="country"
                               v-model="clinicData.country"
                               :placeholder="formTranslation.clinic.plh_country"
                               name="country" type="text"
                               :class="{ ' is-invalid': submitted && $v.clinicData.country.$error }"
                               class="form-control">
                        <div v-if="submitted && !$v.clinicData.country.required"
                             class="invalid-feedback"> {{formTranslation.common.country_required}}
                        </div>
                        <div v-else-if="submitted && !$v.clinicData.country.alphaSpace"
                             class="invalid-feedback"> {{formTranslation.common.country_validation_1}}
                        </div>
                        <div v-else-if="submitted && !$v.clinicData.country.maxLength"
                             class="invalid-feedback"> {{formTranslation.common.country_validation_2}}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label for="city" class="form-control-label"> {{formTranslation.common.city}} <span class="text-danger">*</span></label>
                        <input id="city"
                               v-model="clinicData.city"
                               :placeholder="formTranslation.clinic.plh_city"
                               name="city" type="text"
                               :class="{ ' is-invalid': submitted && $v.clinicData.city.$error }"
                               class="form-control">
                        <div v-if="submitted && !$v.clinicData.city.required"
                             class="invalid-feedback"> {{formTranslation.common.city_required}}
                        </div>
                        <div v-else-if="submitted && !$v.clinicData.city.alphaSpace"
                             class="invalid-feedback"> {{formTranslation.common.city_validation_1}}
                        </div>
                        <div v-else-if="submitted && !$v.clinicData.city.maxLength"
                             class="invalid-feedback"> {{formTranslation.common.city_validation_2}}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label for="postal_code" class=" form-control-label"> {{formTranslation.common.postal_code}} <span class="text-danger">*</span></label>
                        <input id="postal_code"
                               :class="{ ' is-invalid': submitted && $v.clinicData.postal_code.$error }"
                               v-model="clinicData.postal_code" :placeholder="formTranslation.clinic.plh_pcode"
                               name="postal_code" type="text" class="form-control">
                        <div v-if="submitted && !$v.clinicData.postal_code.required"
                             class="invalid-feedback"> {{formTranslation.common.postal_code_required}}
                        </div>
                        <div v-else-if="submitted && (clinicData.postal_code !== '' && !$v.clinicData.postal_code.postalCode)"
                             class="invalid-feedback"> {{formTranslation.common.postal_code_validation_1}}
                        </div>
                        <div v-else-if="submitted && !$v.clinicData.postal_code.maxLength"
                             class="invalid-feedback"> {{formTranslation.common.postal_code_validation_2}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr class="my-4" />
                <!-- clinic admin -->
                <h6 class="heading-small text-muted mb-4"> {{ formTranslation.clinic.clinic_admin_detail }}</h6>
                <div class="pl-lg-4">
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
                            <VuePhoneNumberInput v-model="clinicData.mobile_number" id="mobile_number" clearable 
                            :default-country-code="defaultCountryCode_admin" @update="contactUpdateHandaler_admin"
                            no-example>
                          </VuePhoneNumberInput>
                            <div v-if="submitted && !$v.clinicData.mobile_number.required"
                                 class="invalid-feedback">{{formTranslation.common.contact_num_required}}
                            </div>
                            <div
                                v-else-if="submitted && !$v.clinicData.mobile_number.minLength || !$v.clinicData.mobile_number.maxLength"
                                class="invalid-feedback"> {{formTranslation.common.contact_validation_1}}
                            </div>
                            
<!--                            <div v-else-if="submitted && !$v.clinicData.mobile_number.phoneNumber"-->
<!--                                 class="invalid-feedback">{{formTranslation.common.contact_validation_2}}-->
<!--                            </div>-->
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="dob" class="form-control-label">{{formTranslation.common.dob}}.
                            </label>
                            <input type="date" v-model="clinicData.dob" name="doc_birthdate" id="doc_birthdate" :max="new Date().toISOString().slice(0, 10)">
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
                        <div class="col-md-6"
                        v-if="$store.state.userDataModule.user.addOns.kiviPro!==false"
                        >
                          <label for="choose_language" class="form-control-label">
                              {{formTranslation.common.choose_language}}
                          </label>

                          <multi-select
                              deselect-label=""
                              select-label=""
                              v-model="clinicData.choose_language"
                              id="choose_language"
                              :placeholder="formTranslation.common.choose_language"
                              label="label" track-by="lang" :options="kc_available_translations"
                              :multiple="false"
                          ></multi-select>
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
                  <div class="row mt-4">
                    <div class="col-md-4">
                      <div class="form-group">
                      </div>
                    </div>
                  </div>
                </div>
                <hr class="my-4" />
                <div class="row pr-2">
                  <div class="col-md-12 p-0">
                    <div class="d-flex justify-content-end">
                      <button v-if="!loading" class="btn btn-primary" type="submit">
                        <i class="fa fa-save"></i> {{ formTranslation.clinic.save_btn }}
                      </button>
                      <button v-else class="btn btn-primary" type="submit" disabled> <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </b-col>

        <b-col class="col-xl-3  col-lg-4 order-lg-2  order-1">
          <div class="card card-profile">
            <div class="row justify-content-center mt-4">
              <div class="kivicare-avatar-upload">
                <div class="kivicare-avatar-edit">
                  <input  id="clinicfile" type="button"  class="p-2"
                          @click="uploadProfile()" style="color: transparent;">
                  <label for="clinicfile" v-b-tooltip.hover :title="formTranslation.clinic.edit_profile_img">
                    <i class="fas fa-pencil-alt fa-2x"></i>
                  </label>
                </div>
                <div class="kivicare-avatar-preview">
                  <div id="imagePreview" :style="'background-image: url('+ (profileImage)+');'">
                  </div>
                </div>
              </div>
            </div>
            <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
            </div>
            <div class="card-body pt-0 mt-2">
              <div class="text-center kc-profile">
                <h5 class="h3">
                  {{ clinicData.name }}
                </h5>
                <div class="h5 font-weight-300">
                  {{ clinicData.email }}
                </div>
                <div class="h5 mt-4" v-if="clinicData.address !== ''">
                  {{ clinicData.address}}
                </div>
                <div>
                  {{ clinicData.specialties | clinicSpecialityFormat }}
                </div>
              </div>
            </div>
          </div>

        </b-col>

      </b-row>
    </div>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import { maxLength, minLength, required} from "vuelidate/lib/validators";
import {post, get} from "../../config/request";
import {
    alphaSpace,
    maxTime,
    minTime,
    objToTime,
    phoneNumber,
    postalCode,
    validateForm,
    validateTimeSlot,
    emailValidate
} from "../../config/helper";

export default {
    components: {
      VuePhoneNumberInput,
    },
    data: () => {
        return {
            cardTitle: 'Edit clinic profile',
            clinicData: {},
            loading: false,
            submitted: false,
            editProfileText: '<i class="fa fa-pen-fancy"></i> Edit Profile',
            buttonText: '<i class="fa fa-plus"></i> Add',
            profileImage: '',
            adminPreview:window.request_data.kiviCarePluginURL + 'assets/images/kc-demo-img.png',
            formLoader:true,
            defaultCountryCode: null,
            defaultCountryCode_admin: null,
            defaultUserRegistrationFormSettingData: 'on',
        }
    },
    validations: {
        clinicData: {
            name: {
                required,
            },
            email: {
                required,
                emailValidate
            },
            telephone_no: {
                required,
                // phoneNumber,
                minLength: minLength(4),
                maxLength: maxLength(15)
            },
            address: {
              required
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
            },
            city: {
                required,
                alphaSpace,
                maxLength: maxLength(30)
            },
            country: {
                required,
                alphaSpace,
                maxLength: maxLength(30)
            },
            postal_code: {
                required,
                postalCode,
                maxLength: maxLength(12)
            },
            status: { required },
        },
    },
    mounted() {
        this.getCountryCodeData();
        this.getUserRegistrationFormData();
        this.state = this.defaultClinicData();
        this.profileImage = window.request_data.kiviCarePluginURL + 'assets/images/kc-demo-img.png';
        this.init();   
    },
    filters: {
        clinicSpecialityFormat: function (Speciality) {
            let result = [];
            let typeOfData = typeof Speciality;
            if ((typeOfData === 'object' || typeOfData === 'array' ) && Speciality !== undefined && Speciality !== null && Speciality.length > 0)
            {
                let i = 0 ;
                Speciality.map((speciality) => {
                    result.push(speciality.label); ;
                });
                return result.join(' ,') ;

            } else {
                return '-' ;
            }
        }
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
            this.editProfile();
        },
        uploadProfile(){
          let _this = this;

          var custom_uploader = kivicareCustomImageUploader(this.formTranslation)

          custom_uploader.on('select', function () {
            var attachment = custom_uploader.state().get('selection').first().toJSON();
            _this.profileImage = attachment.url;
            _this.clinicData.clinic_profile = attachment.id;
          });

          //Open the uploader dialog
          custom_uploader.open();

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
                post('clinic_save', this.clinicData)
                    .then((response) => {
                        this.loading = false;
                        if (response.data.status !== undefined && response.data.status === true) {
                            displayMessage(response.data.message);
                            if(response.data.choose_language_updated){
                              this.$store.dispatch("staticDataModule/refreshDashboardLocale", {self: this}) 
                            }
                            this.$store.dispatch("fetchAllClinic", {self: this})
                        } else {
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
        defaultClinicData: function () {
            return {
                id: '',
                name: '',
                email: '',
                country_code: '',
                country_calling_code: '',
                telephone_no: '',
                address: '',
                city: '',
                country: '',
                postal_code: '',
                currency_prefix: '$',
                currency_postfix: '',
                // decimal_point: {},
                status: 1,
                specialties: [],
                profile_image:'',
                country_code_admin: '',
                country_calling_code_admin: '',
                choose_language: ''
            }
        },
        editProfile: function () {
          this.formLoader = true ;
          this.cardTitle = this.formTranslation.clinic.edit_clinic_Profile;
          this.buttonText = '<i class="fa fa-save"></i> '+this.formTranslation.common.save;
          get('clinic_edit', {})
              .then((response) => {
                if (response.data.status !== undefined && response.data.status === true) {
                  this.clinicData = response.data.data ;
                  if (response.data.data.country_calling_code !== '' && response.data.data.country_calling_code !== undefined) {
                    this.defaultCountryCode = response.data.data.country_code;
                  }
                  if (response.data.data.country_calling_code_admin !== '' && response.data.data.country_calling_code_admin !== undefined) {
                    this.defaultCountryCode_admin = response.data.data.country_code_admin;
                  }
                  if (this.clinicData.profile_image) {
                    this.adminPreview = this.clinicData.profile_image
                  }
                  if(this.clinicData.clinic_profile){
                    this.profileImage =this.clinicData.clinic_profile
                  }
                  this.formLoader = false ;
                  this.clinicData.choose_language = this.kc_available_translations.find(el => el.lang === response.data.data.choose_language )
                }
              })
              .catch((error) => {
                this.formLoader = false ;
                console.log(error);
                displayErrorMessage(this.formTranslation.clinic.plh_record_not_found);
              })
        },
        addNewSpecialization: function (value) {
            let specialitiesObj = {
                label: value,
                type: 'specialization',
                value: value.replace(' ', '_'),
                status: 1,
            }
            let _this = this ;
            post('static_data_save', specialitiesObj )
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        _this.clinicData.specialties.push({ id: response.data.insert_id, label: value })
                        _this.$store.commit("staticDataModule/ADD_OPTION_STATIC_DATA", {
                            dataType: 'specialization',
                            option:  { id: response.data.insert_id, label: value}
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error)
                })
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
        }
    },
    computed: {
      specialization(){
        return this.$store.state.staticDataModule.static_data.specialization
      },
      specializationMultiselectLoader(){
        return this.$store.state.staticDataModule.static_data_loader
      },
      kc_available_translations () {
        return this.$store.state.userDataModule.user.kc_available_translations;
      }
    },
    watch: {
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