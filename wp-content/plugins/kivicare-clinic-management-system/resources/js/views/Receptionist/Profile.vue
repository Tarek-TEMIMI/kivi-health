<template>
   <div>
     <div class="page-loader-section" v-if="formLoader">
       <loader-component-2></loader-component-2>
     </div>
     <b-row v-else>
       <b-col class="col-xl-9 order-xl-1">
         <form id="receptionistDataForm" @submit.prevent="handleSubmit" :novalidate="true">
           <div class="card">
             <div class="card-header">
               <div class="row align-items-center">
                 <div class="col-8">
                   <h3 class="mb-0">{{formTranslation.doctor.edit_profile}} </h3>
                 </div>
               </div>
             </div>
             <div class="card-body">

               <h6 class="heading-small text-muted mb-4">{{formTranslation.doctor.basic_information}}</h6>

               <div class="pl-lg-4">

                 <div class="row">

                   <div class="col-md-6">
                     <div class="form-group">
                       <label for="first_name" class="form-control-label">
                         {{formTranslation.common.fname}} <span class="text-danger">*</span>
                       </label>
                       <input id="first_name"
                              :class="{ ' is-invalid': submitted && $v.receptionistData.first_name.$error }"
                              v-model="receptionistData.first_name" :placeholder="formTranslation.receptionist.fname_plh"
                              required="required" name="name" type="text" class="form-control">
                       <div v-if="submitted && !$v.receptionistData.first_name.required"
                            class="invalid-feedback">{{formTranslation.common.fname_required}}
                       </div>
                       <div v-else-if="submitted && !$v.receptionistData.first_name.alpha"
                            class="invalid-feedback"> {{formTranslation.common.fname_validation_1}}
                       </div>
                       <div v-else-if="submitted && (!$v.receptionistData.first_name.minLength || !$v.receptionistData.first_name.maxLength)"
                            class="invalid-feedback"> {{formTranslation.common.fname_validation_2}}
                       </div>
                     </div>
                   </div>

                   <div class="col-md-6">
                     <div class="form-group">
                       <label for="last_name" class="form-control-label">
                         {{formTranslation.common.lname}} <span class="text-danger">*</span>
                       </label>
                       <input id="last_name"
                              :class="{ ' is-invalid': submitted && $v.receptionistData.last_name.$error }"
                              v-model="receptionistData.last_name" :placeholder="formTranslation.receptionist.lname_plh"
                              required="required" name="name" type="text" class="form-control">
                       <div v-if="submitted && !$v.receptionistData.last_name.required" class="invalid-feedback">
                         {{formTranslation.common.lname_required}}
                       </div>
                       <div v-else-if="submitted && !$v.receptionistData.last_name.alpha"
                            class="invalid-feedback"> {{formTranslation.common.lname_validation_1}}
                       </div>
                       <div v-else-if="submitted && (!$v.receptionistData.last_name.minLength || !$v.receptionistData.last_name.maxLength)"
                            class="invalid-feedback"> {{formTranslation.common.lname_validation_2}}
                       </div>
                     </div>
                   </div>

                 </div>

                 <div class="row">

                   <div class="col-md-6">
                     <div class="form-group">
                       <label for="email" class="form-control-label">
                         {{formTranslation.common.email_address}} <span class="text-danger">*</span>
                       </label>
                       <input id="email"
                              :class="{ ' is-invalid': submitted && $v.receptionistData.user_email.$error }"
                              v-model="receptionistData.user_email" :placeholder="formTranslation.receptionist.email_plh"
                              required="required" name="email" type="email" class="form-control">
                       <div v-if="submitted && !$v.receptionistData.user_email.required"
                            class="invalid-feedback">{{formTranslation.common.email_required}}
                       </div>
                       <div v-else-if="submitted && !$v.receptionistData.user_email.emailValidate"
                            class="invalid-feedback">{{formTranslation.common.invalid_email}}
                       </div>
                     </div>
                   </div>

                   <div class="col-md-6">
                     <div class="form-group ">
                       <label for="telephone_no" class="form-control-label">
                         {{formTranslation.common.contact_no}}. <span class="text-danger">*</span>
                       </label>
                       <VuePhoneNumberInput v-model="receptionistData.mobile_number" id="telephone_no" clearable 
                        :default-country-code="defaultCountryCode" @update="contactUpdateHandaler" no-example>
                      </VuePhoneNumberInput>
                       <div v-if="submitted && !$v.receptionistData.mobile_number.required"
                            class="invalid-feedback">{{formTranslation.common.contact_num_required}}
                       </div>
                       <div v-else-if="submitted && (!$v.receptionistData.mobile_number.minLength || !$v.receptionistData.mobile_number.maxLength )"
                            class="invalid-feedback">{{formTranslation.common.contact_validation_1}}
                       </div>
                       <!-- <div v-else-if="submitted && !$v.receptionistData.mobile_number.phoneNumber"
                            class="invalid-feedback">{{formTranslation.common.contact_validation_2}}
                       </div> -->
                     </div>
                   </div>

                 </div>

                 <div class="row">

                   <div class="col-md-6">

                     <div class="form-group">
                       <label for="dob" class="form-control-label">{{formTranslation.common.dob}}. </label>
                       <input type="date" v-model="receptionistData.dob" name="doc_birthdate" id="doc_birthdate" :max="new Date().toISOString().slice(0, 10)">
                       <!-- :class="{ ' is-invalid': submitted && $v.receptionistData.dob.$error }" -->
                       <!-- <vc-date-picker
                           id="receptionist_birthdate"
                           title-position="left"
                           v-model="receptionistData.dob"
                           :max-date="new Date().setFullYear(new Date().getFullYear() - 18)"
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
                       <!-- <div v-if="submitted && !$v.receptionistData.dob.required" class="invalid-feedback">{{formTranslation.common.dob_required}}
                       </div> -->
                     </div>

                   </div>

                   <div class="col-md-6">

                     <div class="form-group">
                       <label for="gender" class="form-control-label"> {{formTranslation.common.gender}} <span
                           class="text-danger">*</span></label>
                       <div class="col-md-8">
                         <div class="custom-control custom-radio custom-control-inline">
                           <input type="radio" id="male" name="gender" v-model="receptionistData.gender"
                                  value="male" class="custom-control-input">
                           <label class="custom-control-label" for="male">{{formTranslation.common.male}}</label>
                         </div>
                         <div class="custom-control custom-radio custom-control-inline">
                           <input type="radio" id="female" name="gender" v-model="receptionistData.gender"
                                  value="female" class="custom-control-input">
                           <label class="custom-control-label" for="female">{{formTranslation.common.female}}</label>
                         </div>
                         <div class="custom-control custom-radio custom-control-inline" v-if="defaultUserRegistrationFormSettingData === 'on'">
                           <input type="radio" id="other" name="gender" v-model="receptionistData.gender"
                                  value="other" class="custom-control-input">
                           <label class="custom-control-label" for="other">{{formTranslation.common.other}}</label>
                         </div>
                       </div>
                       <div v-if="submitted && !$v.receptionistData.gender.required" class="invalid-feedback">{{formTranslation.common.gender_required}}
                       </div>
                     </div>

                   </div>

                 </div>

               </div>

               <hr class="my-4" />

               <!-- Address -->
               <h6 class="heading-small text-muted mb-4">{{formTranslation.common.contact_info}}</h6>

               <div class="pl-lg-4">

                 <div class="row">

                   <div class="col-md-12">
                     <div class="form-group">
                       <label for="address" class="form-control-label">{{formTranslation.common.address}} </label>
                       <textarea
                           name="address" id="address" class="form-control"
                           v-model="receptionistData.address" :placeholder="formTranslation.receptionist.plh_clinic_add">
                       </textarea>
                     </div>
                   </div>

                   

                 </div>

                 <div class="row">
                    <div class="col-md-4">

                     <div class="form-group">
                       <label for="city" class="form-control-label"> {{formTranslation.common.city}} </label>
                       <input id="city"
                              v-model="receptionistData.city"
                              :placeholder="formTranslation.receptionist.city_plh"
                              name="city" type="text"
                              class="form-control">
                     </div>

                   </div>
                   <div class="col-md-4">
                     <div class="form-group">
                       <label for="country" class="form-control-label"> {{formTranslation.common.country}} </label>
                       <input id="country"
                              v-model="receptionistData.country" :placeholder="formTranslation.receptionist.country_plh" name="country"
                              type="text" class="form-control">
                     </div>
                   </div>

                   <div class="col-md-4">
                     <div class="form-group">
                       <label for="postal_code" class=" form-control-label"> {{formTranslation.common.postal_code}} </label>
                       <input id="postal_code"
                              v-model="receptionistData.postal_code"
                              :placeholder="formTranslation.receptionist.pcode_plh"
                              name="postal_code" type="text" class="form-control">
                     </div>
                   </div>
                    <div class="col-md-4"  v-if="$store.state.userDataModule.user.addOns.kiviPro!==false" >
                      <label for="choose_language" class="form-control-label">
                        {{formTranslation.common.choose_language}}
                      </label>

                      <multi-select
                        deselect-label=""
                        select-label=""
                        v-model="receptionistData.choose_language"
                        id="choose_language"
                        :placeholder="formTranslation.common.choose_language"
                        label="label" track-by="lang" :options="kc_available_translations"
                        :multiple="false"
                      ></multi-select>
                    </div>

                 </div>

               </div>
             </div>
             <div class="card-footer">
               <div class="row">
                 <div class="col-md-12">
                   <div class="float-right">
                     <button v-if="!loading" @click="handleSubmit" class="btn btn-primary" type="submit"><i class="fa fa-save"></i> {{ formTranslation.common.save }}</button>
                     <button v-else class="btn btn-primary" type="submit" disabled> <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}</button>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </form>
       </b-col>
       <b-col class="col-xl-3 order-xl-2">
         <div class="card card-profile">
           <!-- <div class="card-img-top" style="height: 100px;">
           </div> -->
           <div class="row justify-content-center mt-4">
             <!-- <div class="col-lg-3 order-lg-2">
                 <div class="card-profile-image">
                     <a href="#"> -->
             <div class="kivicare-avatar-upload">
               <div class="kivicare-avatar-edit">
                 <input  id="file" type="button" ref="file" class="p-2"
                         @click="uploadProfile()" style="color: transparent;">
                 <label for="file" v-b-tooltip.hover :title="formTranslation.clinic.edit_profile_img">
                   <i class="fas fa-pencil-alt fa-2x"></i>
                 </label>
               </div>
               <div class="kivicare-avatar-preview">
                 <div id="imagePreview" :style="'background-image: url('+ profileImage+');'">
                 </div>
               </div>
             </div>
             <!-- <img :src="receptionistData.user_profile ?receptionistData.user_profile : profileImage " style="height: 150px ;width: 150px" class="rounded-circle" /> -->
             <!-- </a> -->
             <!-- </div> -->
             <!-- </div> -->
           </div>
           <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
           </div>
           <div class="card-body pt-0 mt-2">
             <div class="text-center">
               <!-- <input  id="file"
                       type="file"
                       ref="file" class="p-2"
                       v-on:change="uploadProfile()"> -->
               <h5 class="h3">
                 {{ receptionistData.display_name }}
               </h5>
               <div class="h5 font-weight-300">
                 {{ receptionistData.user_email }}
               </div>
               <div class="h5 mt-4">
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
import {required, numeric, requiredIf, maxLength, alpha, minLength} from "vuelidate/lib/validators";
import { post,get } from "../../config/request";
import {alphaSpace, objToTime, phoneNumber, postalCode, validateForm, emailValidate} from "../../config/helper";

    export default {
        components: {
          VuePhoneNumberInput,
        },
        data: () => {
            return {
                isEditProfile: false,
                receptionistData: {},
                loading: false,
                submitted: false,
                cardTitle: 'Edit Profile',
                buttonText: '<i class="fa fa-plus"></i> Add',
                editProfileBtnText: '<i class="fa fa-pen-fancy"></i> Edit Profile',
                profileImage: '',
                formLoader:true,
                defaultCountryCode: null,
                defaultUserRegistrationFormSettingData: 'on',
            }
        },
        mounted() {
            this.getCountryCodeData();
            this.getUserRegistrationFormData();
            this.receptionistData = this.defaultReceptionistData();
            this.init();
            this.profileImage = window.request_data.kiviCarePluginURL + 'assets/images/kc-demo-img.png';
        },
        validations: {
            receptionistData: {
                first_name: {
                    required,
                    alpha,
                    minLength: minLength(2),
                    maxLength: maxLength(15)
                },
                last_name: {
                    required,
                    alpha,
                    minLength: minLength(2),
                    maxLength: maxLength(15)
                },
                user_email: {
                    required,
                    emailValidate
                },
                mobile_number: {
                    required,
                    // phoneNumber,
                    minLength: minLength(4),
                    maxLength: maxLength(15)
                },
                // dob: {required},
                gender:{
                    required
                }
                // state: {
                //     alphaSpace,
                //     maxLength: maxLength(30)
                // },
                // city: {
                //     alphaSpace,
                //     maxLength: maxLength(30)
                // },
                // country: {
                //     alphaSpace,
                //     maxLength: maxLength(30)
                // },
                // postal_code: {
                //     postalCode,
                //     maxLength: maxLength(12)
                // }
            },

            custom_fields: {}
        },
        filters: {
            dateFormat: function (date) {
                return moment(date).format("YYYY-MM-DD") ;
            }
        },
        methods: {
            contactUpdateHandaler: function (val) {
              this.receptionistData.country_code = val.countryCode;
              this.receptionistData.country_calling_code = val.countryCallingCode;
            },
            init: function () {
                if (this.$store.state.userDataModule.user.ID !== undefined) {
                    let profileID  =  this.$store.state.userDataModule.user.ID ;
                    this.editProfileData(profileID);
                } else {
                    this.$store.dispatch("userDataModule/fetchUserData", {});
                    setTimeout(() => {
                        let profileID = this.$store.state.userDataModule.user.ID
                        this.editProfileData(profileID);
                    }, 1000);
                }
            },
            defaultReceptionistData: function () {
                return {
                    first_name: '',
                    last_name: '',
                    username: '',
                    user_email: '',
                    user_pass: '',
                    country_code: '',
                    country_calling_code: '',
                    mobile_number: '',
                    gender: '',
                    dob: '',
                    address: '',
                    city: '',
                    state: '',
                    country: '',
                    postal_code: '',
                    user_status: 0
                }
            },
          uploadProfile(){
            let _this = this;

            var custom_uploader = kivicareCustomImageUploader(this.formTranslation)

            custom_uploader.on('select', function () {
              var attachment = custom_uploader.state().get('selection').first().toJSON();
              _this.profileImage = attachment.url;
              _this.receptionistData.profile_image = attachment.id;
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
                  if (document.querySelector('.is-invalid') !== null && document.querySelector('.is-invalid') !== undefined) {
                    document.querySelector('.is-invalid').scrollIntoView({block: "center", behavior: "smooth"})
                  } else if (document.querySelector('.invalid-feedback') !== null && document.querySelector('.invalid-feedback') !== undefined) {
                    document.querySelector('.invalid-feedback').scrollIntoView({block: "center", behavior: "smooth"})
                  }
                })
                if (this.$v.receptionistData.$invalid) {
                    this.loading = false;
                    return;
                }


                if (validateForm("receptionistDataForm")) {

                    post('receptionist_save', this.receptionistData)
                        .then((response) => {
                            this.loading = false;
                            this.submitted = true;
                            if (response.data.status !== undefined && response.data.status === true) {
                                if(response.data.choose_language_updated){
                                  this.$store.dispatch("staticDataModule/refreshDashboardLocale", {self: this}) 
                                }
                                displayMessage(response.data.message);
                                this.isEditProfile = false
                            } else {
                                displayErrorMessage(response.data.message)
                            }

                        })
                        .catch((error) => {
                            console.log(error);
                            this.loading = false;
                            this.submitted = true;
                            displayErrorMessage(this.formTranslation.common.internal_server_error)
                        })
                }
            },
            editProfileData: function (editId) {
                if(editId !== undefined) {
                    this.cardTitle = this.formTranslation.doctor.edit_profile;
                    this.buttonText = '<i class="fa fa-save"></i>'+this.formTranslation.common.save;
                    this.formLoader= true
                    get('receptionist_edit', {
                        id: editId
                    })
                        .then((response) => {
                            if (response.data.status !== undefined && response.data.status === true) {
                                setTimeout(() => {
                                    this.receptionistData = response.data.data;
                                    if (response.data.data.country_calling_code !== '' && response.data.data.country_calling_code !== undefined) {
                                      this.defaultCountryCode = response.data.data.country_code;
                                    }
                                    if(this.receptionistData.user_profile){
                                      this.profileImage = this.receptionistData.user_profile;
                                    }
                                    this.receptionistData.choose_language = this.kc_available_translations.find(el => el.lang === response.data.data.choose_language )
                                    // this.receptionistData.dob = new Date(this.receptionistData.dob + ' 00:00');
                                    this.isEditProfile = false ;
                                },200)

                            }
                          this.formLoader= false
                        })
                        .catch((error) => {
                            console.log(error);
                          this.formLoader= false
                            displayErrorMessage(this.formTranslation.widgets.record_not_found);
                        })
                } else {
                    displayErrorMessage(this.formTranslation.receptionist.login_user_not_found);
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
          kc_available_translations () {
            return this.$store.state.userDataModule.user.kc_available_translations;
          }
        },
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