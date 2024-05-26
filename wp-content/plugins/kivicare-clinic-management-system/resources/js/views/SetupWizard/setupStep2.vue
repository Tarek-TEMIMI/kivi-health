<template>
  <b-row>
    <b-col sm="12">
      <form id="clinicDataForm" @submit.prevent="handleSubmit" :novalidate="true">
        <b-card class="p-0 shadow" header-tag="header" footer-tag="footer" no-body>
          <b-card-header>
            <h1 class="mb-0">{{ cardTitle }}</h1>
          </b-card-header>
          <b-card-body class="pb-0">
            <div class="row">
              <div class="col-md-8">
                <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="name" class="form-control-label"> {{formTranslation.common.name}} <span class="text-danger">*</span> </label>
                        <input id="name"
                              :class="{ ' is-invalid': submitted && $v.clinicData.name.$error }"
                              v-model="clinicData.name" 
                              :placeholder="formTranslation.setup_wizard.plh_enter_clinic"
                              required="required" name="name" type="text" class="form-control">
                        <div v-if="submitted && !$v.clinicData.name.required"
                            class="invalid-feedback">{{formTranslation.common.name_required}}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="email" class="form-control-label">
                          {{formTranslation.common.email}} <span class="text-danger">*</span>
                        </label>
                        <input id="email"
                              :class="{ ' is-invalid': submitted && $v.clinicData.email.$error }"
                              v-model="clinicData.email" 
                              :placeholder="formTranslation.setup_wizard.plh_enter_email"
                              required="required" name="email" type="email" class="form-control">
                        <div v-if="submitted && !$v.clinicData.email.required"
                            class="invalid-feedback">{{formTranslation.common.email_required}}
                        </div>
                        <div v-else-if="submitted && !$v.clinicData.email.emailValidate"
                            class="invalid-feedback">{{formTranslation.common.invalid_email}}
                        </div>
                      </div>
                    </div> 
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="specialties" class="form-control-label">
                        {{formTranslation.patient_front_widget.specialization}} <span class="text-danger">*</span>
                        </label>
                        <div class="kivi-pr">
                          <multi-select
                              deselect-label=""
                              select-label=""
                              v-model="clinicData.specialties"
                              id="specialties"
                              :tag-placeholder="formTranslation.setup_wizard.plh_clinic_specialization" 
                              :placeholder="formTranslation.setup_wizard.plh_specialization"
                              label="label"
                              track-by="id"
                              :options="specialization"
                              :multiple="true"
                              @tag="addNewSpecialization"
                              :loading="specializationMultiselectLoader"
                              :disabled="specializationMultiselectLoader"
                              :taggable="true"
                          ></multi-select>
                          <span class="select_clear_btn"  @click="clinicData.specialties = ''">×</span>
                        </div>
                        <span class="text-primary small font-weight-bold">{{formTranslation.clinic.note_specialization}}</span>
                        <div v-if="submitted && !$v.clinicData.specialties.required"
                             class="invalid-feedback">  {{formTranslation.clinic.clinic_specialities_required}}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="telephone_no" class="form-control-label">
                          {{formTranslation.common.contact_no}} <span class="text-danger">*</span>
                        </label>
                        <VuePhoneNumberInput v-model="clinicData.telephone_no" id="telephone_no" @update="contactUpdateHandaler"
                          :default-country-code="defaultCountryCode" clearable no-example></VuePhoneNumberInput>
                        <div v-if="submitted && !$v.clinicData.telephone_no.required"
                          class="invalid-feedback"> {{formTranslation.common.contact_num_required}}
                        </div>
                        <div
                          v-else-if="submitted && (!$v.clinicData.telephone_no.minLength || !$v.clinicData.telephone_no.maxLength )"
                          class="invalid-feedback">{{formTranslation.common.contact_validation_1}}
                        </div>
                        <!-- <div v-else-if="submitted && !$v.clinicData.telephone_no.phoneNumber"
                          class="invalid-feedback">{{formTranslation.common.contact_validation_2}}
                        </div> -->
                      </div>
                    </div>
                    <!-- <div class="col-md-6"> -->
                      <!-- <div class="form-group">
                        <label for="file" class="form-control-label">
                          {{formTranslation.clinic.profile_img}}
                        </label>
                        <input
                            id="file"
                            type="file"
                            ref="file"
                            class="form-control" v-on:change="uploadProfile()">
                      </div> -->
                    <!-- </div> -->
                   <div class="col-md-6">
                     <div class="form-group">
                       <label for="currency_prefix" class="form-control-label">  {{formTranslation.clinic.currency_prefix}} </label>
                       <input id="currency_prefix"
                              v-model="clinicData.currency_prefix" :placeholder="formTranslation.setup_wizard.plh_currency_prefix"
                              name="currency_prefix" type="text" class="form-control">
                     </div>
                   </div>
                   <div class="col-md-6">
                     <div class="form-group">
                       <label for="currency_postfix" class="form-control-label">  {{formTranslation.clinic.currency_postfix}}</label>
                       <input id="currency_postfix"
                              v-model="clinicData.currency_postfix" :placeholder="formTranslation.setup_wizard.plh_currency_postfix"
                              name="currency_postfix" type="text" class="form-control">
                     </div>
                   </div>
                </div>
              </div>
              <div class="col-md-4">

                <div class="form-group">
                  <div class="kivicare-avatar-upload">
                      <div class="kivicare-avatar-edit">
                          <input  id="file" type="file" ref="file" class="p-2"
                                      v-on:change="uploadProfile()" style="color: transparent;">
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
                <!-- <div class="card-profile-image">
                  <a href="#">
                    <img :src="imagePreview" class="rounded-circle">
                  </a>
                </div> -->
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="address" class="form-control-label">{{formTranslation.common.address}}<span
                      class="text-danger">*</span></label>
                  <textarea
                      :class="{ ' is-invalid': submitted && $v.clinicData.address.$error }"
                      name="address"
                      id="address"
                      class="form-control"
                      v-model="clinicData.address"
                      :placeholder="formTranslation.setup_wizard.plh_enter_address">
                              </textarea>
                  <div v-if="submitted && !$v.clinicData.address.required"
                       class="invalid-feedback"> {{formTranslation.common.address_required}}
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4">
                <div class="form-group">
                  <label for="city" class="form-control-label">
                     {{formTranslation.common.city}}<span class="text-danger">*</span>
                  </label>
                  <input id="city"
                        :class="{ ' is-invalid': submitted && $v.clinicData.city.$error }"
                         v-model="clinicData.city" 
                         :placeholder="formTranslation.setup_wizard.plh_enter_city" name="city"
                         type="text"
                         class="form-control">
                  <div v-if="submitted && !$v.clinicData.city.required"
                       class="invalid-feedback"> {{formTranslation.common.city_required}}
                  </div>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group">
                  <label for="postal_code" class="form-control-label"> {{formTranslation.common.country}} <span
                      class="text-danger">*</span></label>
                  <input id="country"
                         v-model="clinicData.country"
                         :placeholder="formTranslation.setup_wizard.plh_enter_country"
                          name="country" type="text"
                         :class="{ ' is-invalid': submitted && $v.clinicData.country.$error }"
                         class="form-control">
                  <div v-if="submitted && !$v.clinicData.country.required"
                       class="invalid-feedback">  {{formTranslation.common.country_required}}
                  </div>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group">
                  <label for="postal_code" class="form-control-label">{{formTranslation.common.postal_code}} <span
                      class="text-danger">*</span></label>
                  <input
                      id="postal_code"
                      :class="{ ' is-invalid': submitted && $v.clinicData.postal_code.$error }"
                      v-model="clinicData.postal_code"
                      :placeholder="formTranslation.setup_wizard.plh_enter_pcode"
                      name="postal_code"
                      type="text"
                      class="form-control">
                  <div v-if="submitted && !$v.clinicData.postal_code.required"
                       class="invalid-feedback"> {{formTranslation.common.postal_code_required}}
                  </div>
                </div>
              </div>
            </div>
          </b-card-body>
          <b-card-footer :class="`pb-0 mb-3`">
            <div class="row mt-3">
              <div class="col-md-6">
                <button type="button" class="btn btn-primary float-left"
                        @click="handlePrevClick"
                        v-if="currentStep.prevStep !== undefined && currentStep.prevStep !== ''"><i
                    class="fa fa-angle-double-left" aria-hidden="true"></i> {{formTranslation.setup_wizard.previous}}
                </button>
              </div>
              <div class="col-md-6">
                <button
                    v-if="!loading && (currentStep.nextStep !== undefined && currentStep.nextStep !== '')"
                    class="btn btn-primary float-right" type="submit"
                    v-html="nextButtonText"></button>
                <button v-else class="btn btn-primary float-right" type="submit" disabled>
                  <i class="fa fa-sync fa-spin"></i>&nbsp;  {{formTranslation.common.loading}}
                </button>
              </div>
            </div>
          </b-card-footer>
        </b-card>
      </form>
    </b-col>
  </b-row>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import {required, numeric, alpha, minLength, maxLength} from "vuelidate/lib/validators";
import {validateForm, phoneNumber, alphaSpace, postalCode, emailValidate} from "../../config/helper";
import {get, post} from "../../config/request";

export default {
  name: "setupStep2",
  components: {
    VuePhoneNumberInput
  },
  data: () => {
    return {
      file:'',
      imagePreview:window.pluginBASEURL+'assets/images/kc-demo-img.png',
      stepStatus: false,
      cardTitle: 'Clinic Information',
      clinicData: {},
      loading: false,
      submitted: false,
      nextButtonText: 'Save & Next <i class="fa fa-angle-double-right" aria-hidden="true"></i>',
      specialityRequest: {},
      countryList: [],
      defaultCountryCode: null,

    }
  },
  validations: {
    clinicData: {
      name: {
        required
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
      specialties: {
        required
      },
      address: {
        required,
      },
      city: {
        required,
      },
      country: {
        required,
      },
      postal_code: {
        required,
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    contactUpdateHandaler: function (val) {
      this.clinicData.country_code = val.countryCode;
      this.clinicData.country_calling_code = val.countryCallingCode;
    },
    init: function () {
      this.clinicData = this.defaultClinicData();
      this.getCurrentStepStatus()
      this.getCountryList();
    },
    complete: function () {
      this.$emit('can-continue', {value: true});
    },
    handleSubmit: function () {
      let form_id = document.getElementById('clinicDataForm')
      let formData = new FormData(form_id);
      formData.append("profile_image", this.file);
      $.each(this.clinicData, function (key, value) {
        if (typeof (value) === 'object') {
            value = JSON.stringify(value)
        }
        formData.append(key, value)
      });

      this.loading = true;
      this.submitted = true;
      // stop here if form is invalid

      this.$v.$touch();

      if (this.$v.clinicData.$invalid) {
        this.loading = false;
        return;
      }

      if (validateForm("clinicDataForm")) {
        post('setup_clinic', formData)
            .then((response) => {
              this.loading = false;
              if (response.data.status !== undefined && response.data.status === true) {
                this.$store.dispatch('userDataModule/updateSetupStep', this.currentStep);
                if (response.data.data.insert_id !== undefined && response.data.data.insert_id !== null) {
                  this.clinicData.id = response.data.data.insert_id
                  displayMessage(response.data.message);
                } else {
                  displayErrorMessage('Clinic not saved successfully');
                }
              }
            })
            .catch((error) => {
              console.log(error);
              this.loading = false;
              displayErrorMessage('Internal server error')
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
        state: '',
        country: '',
        currency_prefix: '$',
        currency_postfix: '/-',
        postal_code: '',
        status: 1,
        specialties: [],
        currency:'',
        currency_abbreviation:''
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
              _this.clinicData.specialties.push({id: response.data.insert_id, label: value})
              _this.$store.commit("staticDataModule/ADD_OPTION_STATIC_DATA", {
                dataType: 'specialization',
                option: {id: response.data.insert_id, label: value}
              });
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage('Internal server error')
          })
    },
    getCurrentStepStatus: function () {
      post('get_setup_step_status', {step: 1})
          .then((response) => {
            if (response.data.status) {
              this.stepStatus = true
              this.clinicData = this.setClinicData(response.data.data);
              if (response.data.data.country_calling_code !== '' && response.data.data.country_calling_code !== undefined) {
              this.defaultCountryCode = response.data.data.country_code;
            }
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage('Internal server error')
          })
    },
    setClinicData: function (data) {
      if (data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          country_calling_code: data.country_calling_code,
          country_code: data.country_code,
          telephone_no: data.telephone_no,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postal_code: data.postal_code,
          status: data.status,
          specialties: JSON.parse(data.specialties),
          currency_prefix: data.currency_prefix,
          currency_postfix: data.currency_postfix

        }
      } else {
        return this.defaultClinicData();
      }
    },
    handlePrevClick() {
      this.$store.commit('userDataModule/HANDLE_PREV_STEP', this.currentStep);
    },
    getCountryList: function () {
      get('get_country_list', {})
          .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              this.countryList = response.data.data;
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage('Internal server error')
          })
    },
    uploadProfile(){
      this.file = this.$refs.file.files[0];
      this.imagePreview = URL.createObjectURL(this.file);
    }
  },
  watch: {
    stepStatus: function (value) {
      if (value) {
        this.complete()
      }
    }
  },
  computed: {
    currentStep() {
      const step = this.$store.state.userDataModule.setups.filter((obj) => {
        return obj.name === 'clinic';
      });
      if (step.length > 0) {
        return step[0];
      } else {
        return {}
      }
    },
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
