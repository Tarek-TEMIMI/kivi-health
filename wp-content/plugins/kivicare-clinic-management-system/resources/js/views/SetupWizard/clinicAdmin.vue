<template>
  <b-row>
    <b-col sm="12">
      <form id="clinicUserDataForm" @submit.prevent="handleSubmit" :novalidate="true">
        <b-card class="p-0 shadow" header-tag="header" footer-tag="footer" no-body>
          <b-card-header>
            <h1 class="mb-0">{{ cardTitle }}</h1>
          </b-card-header>
          <b-card-body class="pb-0">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label for="first_name" class="form-control-label">{{formTranslation.common.fname}} <span class="text-danger">*</span> </label>
                  <input id="first_name"
                         :class="{ ' is-invalid': submitted && $v.clinicUserData.first_name.$error }"
                         v-model="clinicUserData.first_name" 
                         :placeholder="formTranslation.setup_wizard.plh_enter_fname"
                         required="required" name="first_name" type="text" class="form-control">
                  <div v-if="submitted && !$v.clinicUserData.first_name.required"
                       class="invalid-feedback">{{formTranslation.common.name_required}}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="last_name" class="col-md-4 form-control-label">
                    {{formTranslation.common.lname}} <span class="text-danger">*</span>
                  </label>
                  <input id="last_name"
                         :class="{ ' is-invalid': submitted && $v.clinicUserData.last_name.$error }"
                         v-model="clinicUserData.last_name" 
                         :placeholder="formTranslation.setup_wizard.plh_enter_lame"
                         required="required" name="last_name" type="text" class="form-control">
                  <div v-if="submitted && !$v.clinicUserData.last_name.required" class="invalid-feedback">
                    {{formTranslation.common.lname_required}}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="email" class="form-control-label">{{formTranslation.common.email}} <span
                      class="text-danger">*</span></label>
                  <input id="email"
                         :class="{ ' is-invalid': submitted && $v.clinicUserData.user_email.$error }"
                         v-model="clinicUserData.user_email" 
                         :placeholder="formTranslation.setup_wizard.plh_enter_email"
                         required="required" name="user_email" type="text" class="form-control">
                  <div v-if="submitted && !$v.clinicUserData.user_email.required"
                       class="invalid-feedback">{{formTranslation.common.email_required}}
                  </div>
                  <div v-else-if="submitted && !$v.clinicUserData.user_email.emailValidate"
                       class="invalid-feedback">{{formTranslation.common.invalid_email}}
                  </div>
                </div>
              </div>
            </div>
            <div class="row align-items-center">
              <div class="col-md-8 col-sm-12">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="mobile_number" class="form-control-label">
                        {{formTranslation.common.contact_no}} <span class="text-danger">*</span>
                      </label>
                      <VuePhoneNumberInput v-model="clinicUserData.mobile_number" id="mobile_number"
                        @update="contactUpdateHandaler" :default-country-code="clinicUserData.country_code" clearable 
                        no-example></VuePhoneNumberInput>
                      <div v-if="submitted && !$v.clinicUserData.mobile_number.required"
                           class="invalid-feedback">{{formTranslation.common.contact_num_required}}
                      </div>
                      <div
                          v-else-if="submitted && (!$v.clinicUserData.mobile_number.minLength || !$v.clinicUserData.mobile_number.maxLength )"
                          class="invalid-feedback">{{formTranslation.common.contact_validation_1}}
                      </div>
                      <!-- <div v-else-if="submitted && !$v.clinicUserData.mobile_number.phoneNumber"
                           class="invalid-feedback">{{formTranslation.common.contact_validation_2}}
                      </div> -->
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="dob" class="form-control-label">{{formTranslation.common.dob}}. 
                        <!-- <span class="text-danger">*</span> -->
                          </label>
                          <input type="date" v-model="clinicUserData.dob" name="doc_birthdate" id="doc_birthdate" :max="new Date().toISOString().slice(0, 10)">
                      <!-- <vc-date-picker
                          id="doc_birthdate"
                          title-position="left"
                          v-model="clinicUserData.dob"
                          :max-date="new Date().setFullYear(new Date().getFullYear() - 18)"
                          :placeholder="formTranslation.setup_wizard.plh_welcome_date"
                          :popover="{ placement: 'bottom', visibility: 'click' }"
                          :class="{ ' is-invalid': submitted && $v.clinicUserData.dob.$error }"
                      >
                        <template v-slot="{ inputValue }">
                          <input
                              class="form-control date-picker"
                              readonly
                              :value="inputValue"
                          />
                        </template>
                      </vc-date-picker> -->
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="gender" class="form-control-label">
                        {{formTranslation.common.gender}} <span class="text-danger">*</span>
                      </label>
                      <div>
                        <div class="custom-control custom-radio custom-control-inline">
                          <input type="radio" id="male" name="gender" v-model="clinicUserData.gender"
                                 value="male" class="custom-control-input" :checked="true">
                          <label class="custom-control-label" for="male">{{formTranslation.common.male}}</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                          <input type="radio" id="female" name="gender" v-model="clinicUserData.gender"
                                 value="female" class="custom-control-input" :checked="(clinicUserData.gender == 'female' ? true : false)">
                          <label class="custom-control-label" for="female">{{formTranslation.common.female}}</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                          <input type="radio" id="other" name="gender" v-model="clinicUserData.gender"
                                 value="other" class="custom-control-input" :checked="(clinicUserData.gender == 'other' ? true : false)">
                          <label class="custom-control-label" for="other">{{formTranslation.common.other}}</label>
                        </div>
                        <div v-if="submitted && !$v.clinicUserData.gender.required" class="invalid-feedback" >
                          {{formTranslation.common.gender_required}}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
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
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-12">
                <div class="form-group">
                  <div class="kivicare-avatar-upload">
                      <div class="kivicare-avatar-edit">
                          <input name="profile_image" id="file" type="file" ref="file" class="p-2"
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
                    v-if="(currentStep.nextStep !== undefined && currentStep.nextStep !== '')"
                    class="btn btn-primary float-right" type="submit"
                    v-html="nextButtonText"></button>
              </div>
            </div>
          </b-card-footer>
        </b-card>
      </form>
      <ModalPopup
        v-if="popupFormOpen"
        modalId="appointment-detail-dashboard"
        modalSize="lg"
        :openModal="popupFormOpen"
        :modalTitle="formTranslation.common.demo_user"
        @closeModal="popupFormOpen = false"
        >
        <div class="row">
            <div class="col-12">
              <b-form-checkbox-group
                  id="radio-slots"
                  v-model="selectedOptions"
                  :options="radioOptions"
                  name="radio-options-slots"
                  class="p-4"
              >
              </b-form-checkbox-group>
            </div>
          </div>
          <div class="row">
            <div class="col-12 p-2 pr-4">
              <button type="button" class="btn btn-primary float-right"
                      @click="confirmPopup" :disabled="loading"> {{!loading  ? 'Finish' : formTranslation.common.loading}}
                <i
                    :class=" !loading ?  'fa fa-angle-double-right' : 'fa fa-sync fa-spin' " aria-hidden="true"></i>
              </button>
            </div>
          </div>
      </ModalPopup>
    </b-col>
  </b-row>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import {required, numeric, alpha, minLength, maxLength} from "vuelidate/lib/validators";
import {validateForm, phoneNumber, alphaSpace, emailValidate} from "../../config/helper";
import {get, post} from "../../config/request";
import ModalPopup from "../../components/Modal/Index"

export default {
  name: "clinicAdmin",
  components:{
    ModalPopup,
    VuePhoneNumberInput
  },
  data: () => {
    return {
      file: '',
      imagePreview: window.pluginBASEURL + 'assets/images/kc-demo-img.png',
      stepStatus: false,
      cardTitle: 'Clinic Admin Information',
      clinicUserData: {},
      loading: false,
      submitted: false,
      nextButtonText: 'Save & Next <i class="fa fa-angle-double-right" aria-hidden="true"></i>',
      requiredFields: [],
      popupFormOpen:false,
      selectedOptions: [
          'kiviCare_doctor',
          'kiviCare_receptionist',
          'kiviCare_patient'
      ],
      radioOptions: [
        { text: 'Doctor', value: 'kiviCare_doctor' },
        { text: 'Receptionist', value: 'kiviCare_receptionist' },
        { text: 'Patient', value: 'kiviCare_patient' }
      ]
    }
  },
  validations: {
    clinicUserData: {
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
      dob: {},
      gender: {required},
    },
  },
  mounted() {
    this.cardTitle = this.formTranslation.common.clinic_admin_info
    this.init();
  },
  methods: {
    contactUpdateHandaler: function (val) {
      this.clinicUserData.country_code = val.countryCode;
      this.clinicUserData.country_calling_code = val.countryCallingCode;
    },
    init: function () {
      if (this.checkStep.name === 'clinic_admin') {
        this.nextButtonText = this.formTranslation.widget_setting.confirm + ' <i class="fa fa-angle-double-right" aria-hidden="true"></i>';
      }
      this.clinicUserData = this.defaultClinicData();
      this.getCurrentStepStatus()
    },
    closeModal(){
      this.popupFormOpen = false;
    },
    complete: function () {
      this.$emit('can-continue', {value: true});
    },
    handleSubmit: function () {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();

    if (this.$v.clinicUserData.$invalid) {
        return;
      }
      if (this.requiredFields.length > 0) {
        return;
      }

    // this.clinicUserData.dob = moment(this.clinicUserData.dob).format("YYYY-MM-DD");

    if (validateForm("clinicUserDataForm")) {
        this.popupFormOpen = true;
      }

    },
    confirmPopup(){
      let form_id = document.getElementById('clinicUserDataForm')
      let formData = new FormData(form_id);
      formData.append("profile_image", this.file);
      $.each(this.clinicUserData, function (key, value) {
        if (typeof (value) === 'object') {
          value = JSON.stringify(value)
        }
        formData.append(key, value)
      });
      this.loading = true;
      formData.append('selected_demo_user', this.selectedOptions);

      post('setup_clinic_admin', formData)
          .then((response) => {
            this.loading = false;
            this.submitted = false;
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message);
              this.$store.dispatch('userDataModule/updateSetupStep',this.currentStep).then(() => {
                if (this.checkStep.name === 'clinic_admin') {
                  this.$store.dispatch('userDataModule/finishSetup', {});
                }
                this.$store.dispatch("userDataModule/fetchUserData", {});
                this.$store.dispatch("fetchAllClinic", {self: this})
              });
            } else {
              displayErrorMessage(response.data.message)
            }

          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
            this.submitted = false;
            displayErrorMessage('Internal server error')
          })
    },
    defaultClinicData: function () {
      var oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 18);
      return {
        id: '',
        first_name: '',
        last_name: '',
        country_code: 'US',
        country_calling_code: '-1',
        mobile_number: '',
        gender: 'male',
        user_email: '',
        dob: '',
        profile_image:''
      }
    },
    getCurrentStepStatus: function () {
      post('get_setup_step_status', {step: 1})
          .then((response) => {
            if (response.data.status) {
              this.stepStatus = true
              this.clinicUserData = this.setClinicData(response.data.data);
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
          first_name: data.first_name,
          last_name: data.last_name,
          mobile_number: data.telephone_no,
          country_code: data.country_code,
          country_calling_code: data.country_calling_code,
          gender:data.gender,
          user_email:data.email,
          dob:data.dob,
          profile_image:data.profile_image
        }
      } else {
        return this.defaultClinicData();
      }
    },
    handlePrevClick() {
      this.$store.commit('userDataModule/HANDLE_PREV_STEP', this.currentStep);
    },
    uploadProfile() {
      this.file = this.$refs.file.files[0];
      this.imagePreview = URL.createObjectURL(this.file);
    },
    getRequireFields: function (validateRequired) {
      this.requiredFields = validateRequired;
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
        return obj.name === 'clinic_admin';
      });
      if (step.length > 0) {
        return step[0];
      } else {
        return {}
      }
    },
    checkStep () {
      return this.$store.state.userDataModule.user.step_config.slice(-1).pop();
    },
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