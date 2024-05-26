<template>
<div class="row">
  <b-col sm="12">
    <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
      <template v-slot:header>
        <b-row class="align-items-center">
          <b-col sm="6" md="8" lg="8">
            <h3 class="mb-0">{{ formTranslation.common.profile }}</h3>
          </b-col>
          <b-col sm="6" md="4" lg="4" >
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-sm btn-primary" @click="$router.go(-1);">
                <i class="fa fa-angle-double-left"></i> {{formTranslation.common.back}}
              </button>
            </div>
          </b-col>
        </b-row>
      </template>
      <div class="page-loader-section" v-if="pageLoader">
        <loader-component-2></loader-component-2>
      </div>
      <div v-else>
        <div class="row">
          <div class="col-md-3 col-12">
            <div class="row">
              <div class="col-12">
                <div class="card card-profile">
                  <div class="row justify-content-center mt-4">
                    <div class="kivicare-avatar-upload">
                      <div class="kivicare-avatar-edit">
                        <input  id="file" type="button"  class="p-2"
                                @click.prevent="uploadProfile()" style="color: transparent;">
                        <label for="file" v-b-tooltip.hover :title="formTranslation.clinic.edit_profile_img">
                          <i class="fas fa-pencil-alt fa-2x"></i>
                        </label>
                      </div>
                      <div class="kivicare-avatar-preview">
                        <div id="imagePreview"
                             :style="'background-image: url('+ (patientData.user_profile ? patientData.user_profile : profileImage)+');'" >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-0 mt-2">
                    <div class="text-center">
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
                <div class="card-body">
                  <ul class="navbar-nav iq-navbar-ul flex-md-column flex-row" >
                    <li class="mt-2 p-1" :class="currentRouteModule === 'profile' ? 'active-li' : ' '"  @click="currentRouteModule = 'profile'">
                      <i  class="fa fa-user text-primary m-2" aria-hidden="true" v-b-tooltip.hover :title="formTranslation.common.profile"></i>
                      <span >{{formTranslation.common.profile}}</span>
                    </li>
                    <li class="mt-2 p-1" :class="currentRouteModule === 'custom_form_'+custom_form_data.id ? 'active-li' : ' '"  @click="currentRouteModule = 'custom_form_'+custom_form_data.id" v-for="(custom_form_data,key) in patientData.custom_forms" :key="key" v-if="userData.addOns.kiviPro == true && patientData.custom_forms && patientData.custom_forms.length">
                      <i  :class="'text-primary m-2 ' + (custom_form_data.name && custom_form_data.name.icon ? custom_form_data.name.icon : ' fas fa-book-medical' )" aria-hidden="true" v-b-tooltip.hover :title="custom_form_data.name && custom_form_data.name.text ? custom_form_data.name.text : '' "></i>
                      <span >{{custom_form_data.name && custom_form_data.name.text ? custom_form_data.name.text : ''}}</span>
                    </li>
                    <li class="mt-2 p-1" :class="(currentRouteModule === 'report' ? 'active-li' : '' )"  @click="currentRouteModule = 'report'" v-if="userData.addOns.kiviPro == true  && kcCheckPermission('patient_report')">
                      <i class="fa fa-file text-primary m-2" aria-hidden="true" v-b-tooltip.hover :title="formTranslation.reports.reports"></i>
                      <span>{{formTranslation.reports.reports}}</span>
                    </li>
                    <li class="mt-2 p-1"  :class="currentRouteModule === 'appointment' ? 'active-li' : ' '"  @click="currentRouteModule = 'appointment'"  v-if="kcCheckPermission('appointment_list')">
                      <i class="fas fa-calendar-week text-primary m-2" aria-hidden="true" v-b-tooltip.hover :title="formTranslation.common.profile"></i>
                      <span>{{formTranslation.appointments.appointments}}</span>
                    </li>

<!--                    <li class="mt-2 p-1"  :class="currentRouteModule === 'encounter' ? 'active-li' : ' '"  @click="currentRouteModule = 'encounter'" >-->
<!--                      <i class="far fa-calendar-times text-primary m-2" aria-hidden="true" v-b-tooltip.hover :title="formTranslation.patient_encounter.encounters"></i>-->
<!--                      <span>{{formTranslation.patient_encounter.encounters}}</span>-->
<!--                    </li>-->
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-9 col-12">
            <div class="row">
              <div class="col-6">
                <div class="card-body shadow">
                  <div class="row">
                    <div class="col">
                      <h6 class="heading-small text-muted mb-4">{{  formTranslation.appointments.appointments }}</h6>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                        <i class="fas fa-calendar-check"></i>
                      </div>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-sm">
                    <span class="text-nowrap">{{ formTranslation.dashboard.total_appointments }}
                      <span class="font-weight-bold mb-0">{{ appointment_encounter_data.total_appointment }}
                      </span>
                    </span>
                  </p>
                  <p class="mt-3 mb-0 text-sm">
                    <span class="text-nowrap">{{ formTranslation.appointments.upcoming + ' ' + formTranslation.appointments.appointments }}
                      <span class="font-weight-bold mb-0">{{ appointment_encounter_data.upcoming_appointment }}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
              <div class="col-6">
                <div class="card-body shadow">
                  <div class="row">
                    <div class="col">
                      <h6 class="heading-small text-muted mb-4">{{  formTranslation.patient_encounter.encounters }}</h6>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                        <i class="far fa-calendar-times"></i>
                      </div>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-sm">
                    <span class="text-nowrap">{{ formTranslation.common.total + ' ' + formTranslation.patient_encounter.encounters }}
                      <span class="font-weight-bold mb-0">{{ appointment_encounter_data.total_encounters }}
                      </span>
                    </span>
                  </p>
                  <p class="mt-3 mb-0 text-sm">
                    <span class="text-nowrap">{{ formTranslation.appointments.upcoming + ' ' + formTranslation.patient_encounter.encounters }}
                      <span class="font-weight-bold mb-0">{{ appointment_encounter_data.upcoming_encounters }}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div v-if="currentRouteModule === 'profile'">
              <div class="card-body">
                <h6 class="heading-small text-muted mb-4">{{ formTranslation.doctor.basic_information }}</h6>
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label for="first_name" class="form-control-label">
                          {{ formTranslation.common.fname }} <span class="text-danger">*</span>
                        </label>
                        <input id="first_name"
                               :class="{ ' is-invalid': submitted && $v.patientData.first_name.$error }"
                               v-model="patientData.first_name" :placeholder="formTranslation.patient.fname_plh"
                               required="required" name="name" type="text" class="form-control">
                        <div v-if="submitted && !$v.patientData.first_name.required"
                             class="invalid-feedback">{{ formTranslation.common.fname_required }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label for="last_name" class="form-control-label">
                          {{ formTranslation.common.lname }} <span class="text-danger">*</span>
                        </label>
                        <input id="last_name"
                               :class="{ ' is-invalid': submitted && $v.patientData.last_name.$error }"
                               v-model="patientData.last_name" :placeholder="formTranslation.patient.lname_placeholder"
                               required="required" name="name" type="text" class="form-control">
                        <div v-if="submitted && !$v.patientData.last_name.required" class="invalid-feedback">
                          {{ formTranslation.common.lname_required }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label for="email" class="form-control-label">
                          {{ formTranslation.common.email_address }} <span class="text-danger">*</span>
                        </label>
                        <input id="email"
                               :class="{ ' is-invalid': submitted && $v.patientData.user_email.$error }"
                               v-model="patientData.user_email" :placeholder="formTranslation.patient.address_placeholder"
                               required="required" name="email" type="email" class="form-control">
                        <div v-if="submitted && !$v.patientData.user_email.required"
                             class="invalid-feedback">{{ formTranslation.common.email_required }}
                        </div>
                        <div v-else-if="submitted && !$v.patientData.user_email.emailValidate"
                             class="invalid-feedback">{{ formTranslation.common.invalid_email }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group ">
                        <label for="telephone_no" class="form-control-label">
                          {{ formTranslation.common.contact_no }}. <span class="text-danger">*</span>
                        </label>
                        <VuePhoneNumberInput v-model=" patientData.mobile_number " id="telephone_no" clearable 
                            :default-country-code=" defaultCountryCode " @update=" contactUpdateHandaler " no-example>
                          </VuePhoneNumberInput>
                        <div v-if="submitted && !$v.patientData.mobile_number.required"
                             class="invalid-feedback">{{ formTranslation.common.contact_num_required }}
                        </div>
                        <div v-else-if="submitted && !$v.patientData.mobile_number.minLength || !$v.patientData.mobile_number.maxLength"
                            class="invalid-feedback"> {{formTranslation.common.contact_validation_1}}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4" v-if="!hideFields.includes('dob')">
                      <div class="form-group">
                        <label for="dob" class="form-control-label">{{ formTranslation.common.dob }}.
                        </label>
                        <input type="date" v-model="patientData.dob" class="form-control" name="doc_birthdate" id="doc_birthdate"
                               :max="new Date().toISOString().slice(0, 10)">
                      </div>
                    </div>
                    <div class="col-md-4">
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

                    <div class="col-md-4" v-if="!hideFields.includes('blood_group')">
                      <div class="form-group">
                        <label for="gender" class="form-control-label">{{ formTranslation.common.gender }} <span
                            class="text-danger">*</span></label>
                        <div class="col-md-12">
                          <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="male" name="gender" v-model="patientData.gender"
                                   value="male" class="custom-control-input">
                            <label class="custom-control-label" for="male">{{ formTranslation.common.male }}</label>
                          </div>
                          <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="female" name="gender" v-model="patientData.gender"
                                   value="female" class="custom-control-input">
                            <label class="custom-control-label" for="female">{{ formTranslation.common.female }}</label>
                          </div>
                          <div class="custom-control custom-radio custom-control-inline" v-if="defaultUserRegistrationFormSettingData === 'on'">
                            <input type="radio" id="other" name="gender" v-model="patientData.gender"
                                   value="other" class="custom-control-input">
                            <label class="custom-control-label" for="other">{{ formTranslation.common.other }}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4" v-if="!hideFields.includes('blood_group')">
                      <div class="form-group">
                        <label for="blood_group" class="form-control-label">{{ formTranslation.clinic.blood_group }} </label>
                        <b-select name="blood_group" id="blood_group" class="form-control"
                                  v-model="patientData.blood_group">
                          <option value="default"> {{ formTranslation.clinic.select_blood_group }}</option>
                          <option v-for="(group, index) in bloodGroups" :value="group" :key="index">{{ group }}</option>
                        </b-select>
                      </div>
                    </div>
                  </div>
                </div>
                <hr class="my-4" v-if="!hideFields.includes('address') || !hideFields.includes('city')
                     || !hideFields.includes('country') || !hideFields.includes('postal_code')"/>
                <h6 class="heading-small text-muted mb-4" v-if="!hideFields.includes('address') || !hideFields.includes('city')
                     || !hideFields.includes('country') || !hideFields.includes('postal_code')">
                  {{ formTranslation.common.contact_info }}</h6>
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-md-12" v-if="!hideFields.includes('address')">
                      <div class="form-group">
                        <label for="address" class="form-control-label">{{ formTranslation.common.address }} </label>
                        <textarea
                            name="address" id="address" class="form-control"
                            v-model="patientData.address"
                            :placeholder="formTranslation.patient.address_placeholder"></textarea>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4" v-if="!hideFields.includes('city')">
                      <div class="form-group">
                        <label for="city" class="form-control-label"> {{ formTranslation.common.city }} </label>
                        <input id="city"
                               v-model="patientData.city"
                               :placeholder="formTranslation.patient.city_placeholder"
                               name="city" type="text"
                               class="form-control">
                      </div>
                    </div>
                    <div class="col-md-4" v-if="!hideFields.includes('country')">
                      <div class="form-group">
                        <label for="country" class="form-control-label"> {{ formTranslation.common.country }} </label>
                        <input id="country"
                               v-model="patientData.country" :placeholder="formTranslation.patient.country_placeholder"
                               name="country"
                               type="text" class="form-control">
                      </div>
                    </div>
                    <div class="col-md-4" v-if="!hideFields.includes('postal_code')">
                      <div class="form-group">
                        <label for="postal_code" class=" form-control-label"> {{ formTranslation.common.postal_code }} </label>
                        <input id="postal_code"
                               v-model="patientData.postal_code" :placeholder="formTranslation.patient.pcode_placeholder"
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
                  <h6 class="heading-small text-muted mb-4">{{ formTranslation.doctor.extra_detail }}</h6>
                  <div class="pl-lg-4">
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
              </div>
              <div class="card-footer">
                <div class="row">
                  <div class="col-md-12">
                    <div class="float-right">
                      <button v-if="!loading" @click="handleSubmit" class="btn btn-primary" type="submit">
                        <i class="fa fa-save"></i>{{formTranslation.common.save}}
                      </button>
                      <button v-else class="btn btn-primary" type="submit" disabled> <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="currentRouteModule === 'report' && userData.addOns.kiviPro == true  && kcCheckPermission('patient_report')">
              <patientReport :patient_profile_id="$route.params.id"></patientReport>
            </div>
            <div v-if="currentRouteModule === 'appointment' && userData.addOns.kiviPro == true  && kcCheckPermission('appointment_list')">
              <Appointment :patient_profile_id="$route.params.id"></Appointment>
            </div>
            <div v-if="currentRouteModule === 'custom_form_'+custom_form_data.id" v-for="(custom_form_data,key) in patientData.custom_forms" :key="key">
              <div class="card-body">
                <div class="pl-lg-4">
                  <CustomForm :data="customFormDataUpdate(custom_form_data,patientData.ID)" :viewMode="false" :customFormModal="currentRouteModule === 'custom_form_'+custom_form_data.id" v-if="currentRouteModule === 'custom_form_'+custom_form_data.id" :useModal="false"></CustomForm>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-card>
  </b-col>
</div>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import {get, post} from "../../config/request";
import {required, minLength, maxLength} from "vuelidate/lib/validators";
import {emailValidate, validateForm} from "../../config/helper";
import patientReport from "./Report";
import Appointment from "../Appointment/AllappointmentList";
import CustomForm from "../CustomForm/Form.vue"

export default {
  name: "ProfileView",
  components:{patientReport,Appointment,VuePhoneNumberInput,CustomForm},
  data: () => {
    return {
      currentRouteModule:'profile',
      pageLoader:false,
      loading: false,
      profileImage: window.request_data.kiviCarePluginURL + 'assets/images/kc-demo-img.png',
      patientData:{},
      submitted: false,
      cardTitle: 'Edit Profile',
      qualification: {},
      bloodGroups: [
        'A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'
      ],
      file:'',
      hideFields:[],
      formLoader:true,
      showCustomField:false,
      custom_fields:[],
      defaultCountryCode: null,
      requiredFields: [],
      clinicMultiselectLoader:true,
      clinics:[],
      defaultUserRegistrationFormSettingData: 'on'
    }
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
    }
  },
  mounted() {
    this.getCountryCodeData();
    this.getUserRegistrationFormData();
    this.init();
    this.getClinics();
    this.patientData = this.defaultData()
    if(this.$route.params.id !== undefined){
      this.patientDetails(this.$route.params.id)
      this.$store.dispatch("appointmentModule/fetchAppointmentEncounterCount", { id:this.$route.params.id })
    }
    this.getHideFieldsArrayFromFilter()
  },
  methods:{
    contactUpdateHandaler: function (val) {
      this.patientData.country_code = val.countryCode;
      this.patientData.country_calling_code = val.countryCallingCode;
    },
    init(){

    },
    defaultData(){
      return {
        first_name: '',
        last_name: '',
        username: '',
        user_email: '',
        user_pass: '',
        country_calling_code: '',
        country_code: '',
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
      };
    },
    patientDetails(id){
      this.pageLoader = true;
      get('patient_edit', {
        id: id,
        request_type:'patient_profile'
      })
          .then((response) => {
            this.pageLoader = false;
            if (response.data.status !== undefined && response.data.status === true) {
              this.patientData = response.data.data
              if (response.data.data.country_calling_code !== '' && response.data.data.country_calling_code !== undefined) {
                this.defaultCountryCode = response.data.data.country_code;
              }
              this.showCustomField = true;
              this.custom_fields = response.data.custom_filed
              this.patientData.choose_language = this.kc_available_translations.find(el => el.lang === response.data.data.choose_language )
            }
          })
          .catch((error) => {
            this.pageLoader = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          })
    },
    getCustomFieldsValues: function (fieldsObj) {
      if(!fieldsObj || fieldsObj === undefined){
        return false;
      }
      this.patientData.custom_fields = fieldsObj;
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
  computed:{
    userData() {
      return this.$store.state.userDataModule.user;
    },
    appointment_encounter_data(){
      return this.$store.state.appointmentModule.appointment_encounter_data
    },
    kc_available_translations () {
      return this.$store.state.userDataModule.user.kc_available_translations;
    }
  }
}

</script>

<style scoped>

li {
  border-radius:4px;
  cursor: pointer;
}
.active-li{
  background-color: var(--primary) !important;
}
.active-li i{
  color: #fff !important;
}

.active-li span{
  color: #fff !important;
}
</style>