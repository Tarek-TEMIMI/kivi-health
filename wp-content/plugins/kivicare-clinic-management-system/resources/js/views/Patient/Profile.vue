<template>
  <div>
    <div class="page-loader-section" v-if="formLoader">
      <loader-component-2></loader-component-2>
    </div>
    <b-row v-else>
      <b-col class="col-xl-9 order-xl-1">
        <div class="card">
          <div class="card-header pb-0 border-0">
              <div class="row" id="patient_profile">
                <div class="col-12">
                  <b-tabs>
                    <b-tab :title="formTranslation.patient.edit_profile" :active="viewMode === 'editProfile'" @click="viewMode='editProfile'">
                    </b-tab>
                    <b-tab :title="custom_form_data.name && custom_form_data.name.text ? custom_form_data.name.text : ''" :active="viewMode === 'custom_form_'+custom_form_data.id" @click="viewMode='custom_form_'+custom_form_data.id" v-for="(custom_form_data,key) in patientData.custom_forms" :key="key" v-if="userData.addOns.kiviPro == true && patientData.custom_forms && patientData.custom_forms.length">
                    </b-tab>
                  </b-tabs>
                </div>
              </div>
          </div>
          <form id="patientDataForm" @submit.prevent="handleSubmit" :novalidate="true" v-if="viewMode === 'editProfile'">
            <div class="card-body pt-0">
              <h6 class="heading-small text-muted mb-4">{{formTranslation.doctor.basic_information}}</h6>
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="first_name" class="form-control-label">
                        {{formTranslation.common.fname}} <span class="text-danger">*</span>
                      </label>
                      <input id="first_name"
                            :class="{ ' is-invalid': submitted && $v.patientData.first_name.$error }"
                            v-model="patientData.first_name" :placeholder="formTranslation.patient.fname_plh"
                            required="required" name="name" type="text" class="form-control">
                      <div v-if="submitted && !$v.patientData.first_name.required"
                          class="invalid-feedback">{{formTranslation.common.fname_required}}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="last_name" class="form-control-label">
                        {{formTranslation.common.lname}} <span class="text-danger">*</span>
                      </label>
                      <input id="last_name"
                            :class="{ ' is-invalid': submitted && $v.patientData.last_name.$error }"
                            v-model="patientData.last_name" :placeholder="formTranslation.patient.lname_placeholder"
                            required="required" name="name" type="text" class="form-control">
                      <div v-if="submitted && !$v.patientData.last_name.required" class="invalid-feedback">
                        {{formTranslation.common.lname_required}}
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
                            :class="{ ' is-invalid': submitted && $v.patientData.user_email.$error }"
                            v-model="patientData.user_email" :placeholder="formTranslation.patient.address_placeholder"
                            required="required" name="email" type="email" class="form-control">
                      <div v-if="submitted && !$v.patientData.user_email.required"
                          class="invalid-feedback">{{formTranslation.common.email_required}}
                      </div>
                      <div v-else-if="submitted && !$v.patientData.user_email.emailValidate"
                          class="invalid-feedback">{{formTranslation.common.invalid_email}}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group" >
                        <label for="clinic_id" class="form-control-label">
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
                 </div>

                <div class="row">
                  <div class="col-md-6" v-if="!hideFields.includes('dob')">
                    <div class="form-group ">
                      <label for="telephone_no" class="form-control-label">
                        {{formTranslation.common.contact_no}}. <span class="text-danger">*</span>
                      </label>
                      <VuePhoneNumberInput v-model="patientData.mobile_number" id="telephone_no" clearable 
                        :default-country-code="defaultCountryCode" @update="contactUpdateHandaler" no-example>
                      </VuePhoneNumberInput>
                      <div v-if="submitted && !$v.patientData.mobile_number.required"
                        class="invalid-feedback">{{formTranslation.common.contact_num_required}}
                      </div>
                      <div v-else-if="submitted && (!$v.patientData.mobile_number.minLength || !$v.patientData.mobile_number.maxLength )"
                        class="invalid-feedback">{{formTranslation.common.contact_validation_1}}
                      </div>
                      <!-- <div v-else-if="submitted && !$v.patientData.mobile_number.phoneNumber"
                          class="invalid-feedback">{{formTranslation.common.contact_validation_2}}
                      </div> -->
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                       <label for="dob" class="form-control-label">{{formTranslation.common.dob}}.
                         <!-- <span class="text-danger">*</span> -->
                       </label>
                       <!-- :class="{ ' is-invalid': submitted && $v.patientData.dob.$error }" -->
                       <input type="date" v-model="patientData.dob" name="doc_birthdate" id="doc_birthdate" :max="new Date().toISOString().slice(0, 10)">
                       <!-- <vc-date-picker
                           id="receptionist_birthdate"
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
                 </div>
                 <div class="row">
                  <div class="col-md-6" v-if="!hideFields.includes('blood_group')">
                    <div class="form-group">
                      <label for="gender" class="form-control-label">{{formTranslation.common.gender}} <span
                          class="text-danger">*</span></label>

                      <div class="col-md-8">
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
                          <input type="radio" id="other" name="gender" v-model="patientData.gender"
                                value="other" class="custom-control-input">
                          <label class="custom-control-label" for="other">{{formTranslation.common.other}}</label>
                        </div>
                      </div>
                      <!-- <div v-if="submitted && !$v.patientData.gender.required" class="invalid-feedback">{{formTranslation.common.gender_required}}</div> -->
                    </div>
                  </div>
                  <div class="col-md-6" v-if="!hideFields.includes('blood_group')">
                    <div class="form-group">
                      <label for="blood_group" class="form-control-label">{{formTranslation.clinic.blood_group}} </label>
                      <b-select name="blood_group" id="blood_group" class="form-control"
                              v-model="patientData.blood_group">
                        <option value="default"> {{formTranslation.clinic.select_blood_group}}</option>
                        <option v-for="(group, index) in bloodGroups" :value="group" :key="index">{{ group }}</option>
                      </b-select>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="my-4"  v-if="!hideFields.includes('address') || !hideFields.includes('city')
                    || !hideFields.includes('country') || !hideFields.includes('postal_code')"/>
              <!-- Address -->
              <h6 class="heading-small text-muted mb-4" v-if="!hideFields.includes('address') || !hideFields.includes('city')
                    || !hideFields.includes('country') || !hideFields.includes('postal_code')">{{formTranslation.common.contact_info}}</h6>
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-md-6" v-if="!hideFields.includes('address')">
                    <div class="form-group">
                      <label for="address" class="form-control-label">{{formTranslation.common.address}} </label>
                      <textarea
                          name="address" id="address" class="form-control"
                          v-model="patientData.address" :placeholder="formTranslation.patient.address_placeholder"></textarea>
                    </div>
                  </div>

                  <div class="col-md-6" v-if="!hideFields.includes('city')">

                    <div class="form-group">
                      <label for="city" class="form-control-label"> {{formTranslation.common.city}} </label>
                      <input id="city"
                            v-model="patientData.city"
                            :placeholder="formTranslation.patient.city_placeholder"
                            name="city" type="text"
                            class="form-control">
                      <!-- :class="{ ' is-invalid': submitted && $v.patientData.city.$error }" -->
                      <!-- <div v-if="submitted && !$v.patientData.city.alphaSpace"
                          class="invalid-feedback"> {{formTranslation.common.city_validation_1}}
                      </div>
                      <div v-if="submitted && !$v.patientData.city.maxLength"
                          class="invalid-feedback"> {{formTranslation.common.city_validation_2}}
                      </div> -->
                    </div>
                  </div>
                </div>

                <div class="row">
                  <!-- <div class="col-md-4"> -->
                  <!-- <div class="form-group"> -->
                  <!-- <label for="state" class=" form-control-label"> {{formTranslation.clinic.state}} </label>
                  <input id="state"
                        v-model="patientData.state"
                        :placeholder="formTranslation.patient.state_plh" name="state" type="text"
                        class="form-control"
                  > -->
                  <!-- :class="{ ' is-invalid': submitted && $v.patientData.state.$error }"
                  <div v-if="submitted && !$v.patientData.state.alphaSpace"
                      class="invalid-feedback"> {{formTranslation.common.state_validation_1}}
                  </div>
                  <div v-if="submitted && !$v.patientData.state.maxLength"
                      class="invalid-feedback"> {{formTranslation.common.state_validation_2}}
                  </div> -->
                  <!-- </div> -->
                  <!-- </div> -->
                  <div class="col-md-4" v-if="!hideFields.includes('country')">
                    <div class="form-group">
                      <label for="country" class="form-control-label"> {{formTranslation.common.country}} </label>
                      <!-- :class="{ ' is-invalid': submitted && $v.patientData.country.$error }" -->
                      <input id="country"
                            v-model="patientData.country" :placeholder="formTranslation.patient.country_placeholder" name="country"
                            type="text" class="form-control">
                      <!-- <div v-if="submitted && !$v.patientData.country.alphaSpace"
                          class="invalid-feedback"> {{formTranslation.common.country_validation_1}}
                      </div>
                      <div v-if="submitted && !$v.patientData.country.maxLength"
                          class="invalid-feedback"> {{formTranslation.common.country_validation_2}}
                      </div> -->
                    </div>
                  </div>

                  <div class="col-md-4" v-if="!hideFields.includes('postal_code')">
                    <div class="form-group">
                      <label for="postal_code" class=" form-control-label"> {{formTranslation.common.postal_code}} </label>
                      <!-- :class="{ ' is-invalid': submitted && $v.patientData.postal_code.$error }" -->
                      <input id="postal_code"
                            v-model="patientData.postal_code" :placeholder="formTranslation.patient.pcode_placeholder"
                            name="postal_code" type="text" class="form-control">
                      <!-- <div v-if="submitted && (patientData.postal_code !== '' && !$v.patientData.postal_code.postalCode)"
                          class="invalid-feedback"> {{formTranslation.common.postal_code_validation_1}}
                      </div>
                      <div v-else-if="submitted && !$v.patientData.postal_code.maxLength"
                          class="invalid-feedback"> {{formTranslation.common.postal_code_validation_2}}
                      </div> -->
                    </div>
                  </div>
                  <div class="col-md-4"  v-if="$store.state.userDataModule.user.addOns.kiviPro!==false" >
                    <label for="choose_language" class="form-control-label">
                      {{formTranslation.common.choose_language}}
                    </label>

                    <multi-select
                      deselect-label=""
                      select-label=""
                      v-model="patientData.choose_language"
                      id="choose_language"
                      :placeholder="formTranslation.common.choose_language"
                      label="label" track-by="lang" :options="kc_available_translations"
                      :multiple="false"
                    ></multi-select>
                  </div>

                </div>
              </div>
              <div v-if="showCustomField">
                <hr class="my-4"/>
                <h6 class="heading-small text-muted mb-4">{{formTranslation.doctor.extra_detail}}</h6>
                <edit-custom-fields
                    module_type=""
                    :module_id="String(patientData.ID)"
                    @bindCustomField="getCustomFieldsValues"
                    :fieldsValue="custom_fields !== undefined ? custom_fields : []"
                    :customFieldsObj="custom_fields !== undefined ? custom_fields : []"
                    @requiredCustomField="getRequireFields"
                ></edit-custom-fields>
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
          </form>
          <div class="card-body pt-0" v-for="(custom_form_data,key) in patientData.custom_forms" :key="key" v-if="patientData.custom_forms && patientData.custom_forms.length">
            <div class="pl-lg-4">
              <CustomForm :data="customFormDataUpdate(custom_form_data,patientData.ID)" :viewMode="false" :customFormModal="viewMode === 'custom_form_'+custom_form_data.id" v-if="viewMode === 'custom_form_'+custom_form_data.id" :useModal="false"></CustomForm>
            </div>
          </div>
        </div>
      </b-col>
      <b-col class="col-xl-3 order-xl-2">
        <div class="card card-profile">
          <!-- <div class="card-img-top" style="height: 100px;">
          </div> -->
          <div class="row justify-content-center mt-4">
            <!-- <div class="col-lg-3 order-lg-2"> -->
            <!-- <div class="card-profile-image"> -->
            <!-- <a href="#"> -->
            <div class="kivicare-avatar-upload">
              <div class="kivicare-avatar-edit">
                <input  id="file" type="button"  class="p-2"
                        @click.prevent="uploadProfile()" style="color: transparent;">
                <label for="file" v-b-tooltip.hover :title="formTranslation.clinic.edit_profile_img">
                  <i class="fas fa-pencil-alt fa-2x"></i>
                </label>
              </div>
              <div class="kivicare-avatar-preview">
                <div id="imagePreview" :style="'background-image: url('+ (patientData.user_profile ? patientData.user_profile : profileImage)+');'">
                </div>
              </div>
            </div>
            <!-- <img alt="img" style="height: 180px ;width: 150px" class="rounded-circle" :src=" patientData.user_profile ? patientData.user_profile : profileImage"> -->
            <!-- <img :src="profileImage" style="height: 150px ;width: 150px" class="rounded-circle" /> -->
            <!-- </a> -->
            <!-- </div> -->
            <!-- </div> -->
          </div>
          <!-- <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
          </div> -->
          <div class="card-body pt-0 mt-2">
            <div class="text-center">
              <!-- <input  id="file"
                      type="file"
                      ref="file" class="p-2"
                      v-on:change="uploadProfile()" > -->
              <h5 class="h3">
                {{ patientData.display_name }}
              </h5>
              <div class="h5 font-weight-300">
                {{ patientData.user_email }}
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
import {required, numeric, alpha, minLength, maxLength} from "vuelidate/lib/validators";
import {post, get} from "../../config/request";
import {alphaSpace, phoneNumber, postalCode, validateForm, emailValidate } from "../../config/helper";
import CustomForm from '../CustomForm/Form.vue'

    export default {
        components: {
          VuePhoneNumberInput,
          CustomForm
        },
        data: () => {
            return {
                isEditProfile: false,
                patientData: {},
                loading: false,
                submitted: false,
                backBtnText: ' <i class="fa fa-angle-double-left"></i> Back',
                cardTitle: 'Edit Profile',
                editProfileBtnText: '<i class="fa fa-pen-fancy"></i> Edit Profile',
                buttonText: '<i class="fa fa-plus"></i> Add',
                qualification: {},
                bloodGroups: [
                    'A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'
                ],
                profileImage: '',
                file:'',
              hideFields:[],
              formLoader:true,
              showCustomField:false,
              custom_fields:[],
              defaultCountryCode: null,
              requiredFields: [],
              clinicMultiselectLoader:true,
              clinics:[],
              defaultUserRegistrationFormSettingData: 'on',
              viewMode:'editProfile'
            }
        },
        mounted() {
            this.getCountryCodeData();
            this.getUserRegistrationFormData();
            this.patientData = this.defaultPatientData();
            this.init();
            this.getClinics();
            this.profileImage = window.request_data.kiviCarePluginURL + 'assets/images/kc-demo-img.png';
            this.getHideFieldsArrayFromFilter()
        },
        validations: {
            patientData: {
                first_name: {
                    required,
                },
                last_name: {
                    required,
                },
                user_email: {
                    required,
                    emailValidate
                },
                mobile_number: {
                    required,
                    minLength: minLength(4),
                    maxLength: maxLength(15)
                },
                clinic_id: {
                  required,
                }
                // dob: {required},
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
            }
        },
        methods: {
            contactUpdateHandaler: function (val) {         
              this.patientData.country_code = val.countryCode;
              this.patientData.country_calling_code = val.countryCallingCode;
            },
            init: function () {
                if (this.$store.state.userDataModule.user.ID !== undefined) {
                    let profileID  =  this.$store.state.userDataModule.user.ID ;
                    this.editProfile(profileID);
                } else {
                    this.$store.dispatch("userDataModule/fetchUserData", {});
                    setTimeout(() => {
                        let profileID = this.$store.state.userDataModule.user.ID
                        this.editProfile(profileID);
                    }, 1000);
                }
            },
            defaultPatientData: function () {
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
                    about_me: '',
                    address: '',
                    city: '',
                    state: '',
                    country: '',
                    postal_code: '',
                    blood_group: 'default',
                    profile_image: ''
                }
            },
          uploadProfile() {
            let _this = this;

            var custom_uploader = kivicareCustomImageUploader(this.formTranslation);

            custom_uploader.on('select', function () {
              var attachment = custom_uploader.state().get('selection').first().toJSON();
              _this.patientData.user_profile = attachment.url;
              _this.patientData.profile_image = attachment.id;
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

                    post('patient_save', this.patientData)
                        .then((response) => {
                            this.loading = false;
                            if (response.data.status !== undefined && response.data.status === true) {
                              if(response.data.choose_language_updated){
                                this.$store.dispatch("staticDataModule/refreshDashboardLocale", {self: this}) 
                              }
                                // this.patientData.dob = new Date(moment(this.patientData.dob).format("YYYY-MM-DD"));
                                displayMessage(response.data.message);
                                this.isEditProfile = false ;
                            } else {
                                // this.patientData.dob = new Date(moment(this.patientData.dob).format("YYYY-MM-DD"));
                                displayErrorMessage(response.data.message)
                            }

                        })
                        .catch((error) => {
                            // this.patientData.dob = new Date(moment(this.patientData.dob).format("YYYY-MM-DD"));
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
          editProfile: function (profileId) {

            this.cardTitle = this.formTranslation.patient.edit_profile;
            this.buttonText = '<i class="fa fa-save"></i> '+this.formTranslation.common.save;

            this.formLoader = true;
            get('patient_edit', {
                id: profileId
            })
              .then((response) => {
                this.formLoader = false;
                  if (response.data.status !== undefined && response.data.status === true) {
                    this.patientData = response.data.data
                    if (response.data.data.country_calling_code !== '' && response.data.data.country_calling_code !== undefined) {
                      this.defaultCountryCode = response.data.data.country_code;
                    }
                    if( response.data.custom_filed !== undefined &&  response.data.custom_filed.length > 0){
                        this.showCustomField = true;
                        this.custom_fields = response.data.custom_filed
                    }
                    this.patientData.choose_language = this.kc_available_translations.find(el => el.lang === response.data.data.choose_language )
                      // this.patientData.dob = new Date(this.patientData.dob + ' 00:00');
                  }
              })
              .catch((error) => {
                this.formLoader = false;
                  console.log(error);
                  displayErrorMessage(this.formTranslation.widgets.record_not_found);
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
          getRequireFields: function (validateRequired) {
            this.requiredFields = validateRequired;
          },
          getClinics:function () {
            this.clinicMultiselectLoader=true;
            get('get_static_data', {
              data_type: 'clinics',
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
          customFormDataUpdate(custom_form_data,id){
            custom_form_data.module_id = id;
            return custom_form_data;
          }
        },
        computed: {
            userData() {
                return this.$store.state.userDataModule.user;
            },
            kc_available_translations () {
              return this.$store.state.userDataModule.user.kc_available_translations;
            }
        },
        filters: {
            dateFormat: function (date) {
                return moment(date).format("YYYY-MM-DD") ;
            }
        }
    }
</script>
<style >
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
#patient_profile .nav.nav-tabs{
    margin-bottom: 1rem;
}
#patient_profile .nav-tabs .nav-link.active{
    color: var(--primary);
    /* border-top-color: var(--primary);
    border-left-color: var(--primary);
    border-right-color: var(--primary); */
}
#patient_profile  .nav-tabs .nav-link{
    font-size: 1rem;
    font-weight: 400;
    background-color:#fff;
    border-bottom-color: #dee2e6;
}
</style>