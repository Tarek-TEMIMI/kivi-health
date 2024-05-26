<template>
  <div>
    <b-row v-if="getUserRole() == 'administrator' && !timezone_status">
      <div class="col-md-12">
        <b-alert show variant="warning" class="d-flex align-items-center justify-content-between">
          <p class="m-0"> <b> {{ timezone_msg }}</b> </p>
          <button class="btn btn-sm  btn-secondary float-right" @click="iUnderstandTimezone" type="button"> Got it !
          </button>
        </b-alert>
      </div>
    </b-row>
    <b-row>
      <b-col class="col-xl-12 col-lg-12 order-lg-1  order-2">
        <form id="clinicDataForm" :novalidate="true" @submit.prevent="handleSubmit">
          <div class="card">
            <div class="card-header">
              <div class="row">
                <div class="col-md-4">
                  <h3>{{ formTranslation.doctor_session.doc_sessions }} </h3>
                </div>
                <div class="col-md-8 ">
                  <div class="d-flex justify-content-end">
                    <b-button v-if="kcCheckPermission('doctor_session_add') && isAdd && !isCloseBtnShow"
                      class="float-right btn btn-sm btn-primary" type="button" variant="primary"
                      @click="handleCollapseChange('add')" v-html="toggleBtnHtml">
                    </b-button>
                    <b-button v-if="kcCheckPermission('doctor_session_add') && isEdit && !isCloseBtnShow"
                      class="float-right btn btn-sm btn-primary" type="button" variant="primary"
                      @click="handleCollapseChange('add')" v-html="toggleBtnHtml">
                    </b-button>
                    <b-button v-if="kcCheckPermission('doctor_session_add') && isCloseBtnShow"
                      class="float-right btn btn-sm btn-primary" type="button" variant="primary"
                      @click="handleCollapseChange('close')" v-html="toggleBtnHtml">
                    </b-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body p-4">
              <b-collapse id="doctor-session-tab" :visible="isCollapseVisible" class="mt-2">

                <!-- first row clinic - doctor - time slot selection -->

                <div class="row">
                  <div class="col-md-4 form-group"
                    v-if="userData.addOns.kiviPro === true && (getUserRole() === 'administrator' || getUserRole() == 'doctor')">
                    <label class="form-control-label" for="doctor_id">
                      {{ formTranslation.clinic.select_clinic }} <span class="text-danger">*</span>
                    </label>
                    <multi-select id="clinic_id" v-model="clinicSession.clinic_id" @select="clinicChange"
                      @remove="clinicChange" :options="allClinics" :loading="clinicMultiselectLoader"
                      :disabled="clinicMultiselectLoader" deselect-label="" label="label"
                      :placeholder="this.formTranslation.doctor_session.plh_search" select-label=""
                      :tag-placeholder="this.formTranslation.doctor_session.plh_tag_clinic" track-by="id"></multi-select>
                    <div v-if="submitted && !$v.clinicSession.clinic_id.required" class="invalid-feedback">
                      {{ formTranslation.common.clinic_is_required }}
                    </div>
                  </div>
                  <div class="col-md-4 form-group" v-if="getUserRole() !== 'doctor'">
                    <label class="col-md-4 form-control-label" for="clinicSessionDoctor">
                      {{ formTranslation.common.doctors }}
                      <span class="text-danger">*</span>
                    </label>
                    <div class="">
                      <multi-select id="clinicSessionDoctor" v-model="clinicSession.doctors" :options="doctors"
                        :loading="doctorMultiselectLoader" :disabled="doctorMultiselectLoader" deselect-label=""
                        label="label" :placeholder="this.formTranslation.doctor_session.plh_search" select-label=""
                        :tag-placeholder="this.formTranslation.doctor_session.plh_tag_session_doc" track-by="id"
                        @remove="sessionDoctorsValidation" @select="sessionDoctorsValidation"></multi-select>
                      <div v-if="submitted && !$v.clinicSession.doctors.required" class="invalid-feedback">
                        {{ formTranslation.appointments.doc_required }}
                      </div>
                      <div v-if="sessionSubmitted && sessionDoctorValidationCheck" class="invalid-feedback">{{
                        formTranslation.doctor_session.doc_already_added }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 form-group">
                    <label for="time_slot" class="form-control-label"> {{ formTranslation.setup_wizard.time_slot_minute }} <span
                        class="text-danger">*</span></label>
                    <div class="">
                      <b-select id="time_slot" v-model="clinicSession.time_slot" class="form-control text-capitalize"
                        name="time_slot" @change="sessionDoctorsValidation">
                        <option v-for="(slot, index) in time_slots" :key="index" :value="slot"> {{ slot }}</option>
                      </b-select>
                    </div>
                    <div v-if="submitted && !$v.clinicSession.time_slot.required" class="invalid-feedback">
                      {{ formTranslation.appointments.time_slot_required }}
                    </div>
                  </div>
                </div>

                <!-- / end first row - clinic - doctor - time slot selection -->

                <!-- second row sesion time selection -->

                <div class="row">
                  <div class="col-md-3">
                    <label class="form-control-label"> {{ formTranslation.doctor_session.morning_session }} </label>
                    <div class="form-group">
                      <vue-timepicker id="s_one_start_time" v-model="clinicSession.s_one_start_time" :minute-interval="5"
                        auto-scroll format="HH:mm" hide-disabled-hours
                        :placeholder="this.formTranslation.doctor_session.plh_start_time"
                        @change="generateTimeSlotTime('first')">
                        <template v-slot:clearButton>
                          <span class="clear-btn" @click.prevent="secondDisabledHours = [[0, 23]]">×</span>
                        </template>
                      </vue-timepicker>
                      <!-- <div
                          v-if="sessionSubmitted && !$v.clinicSession.s_one_start_time.HH.required && !$v.clinicSession.s_one_start_time.mm.required"
                          class="invalid-feedback mt-2">{{ formTranslation.doctor_session.start_time_required }}
                      </div> -->
                      <div v-if="sessionSubmitted && !$v.clinicSession.s_one_start_time.$invalid"
                        class="invalid-feedback mt-2">{{ formTranslation.doctor_session.start_time_smaller_then_end }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <label class="form-control-label"> &nbsp; </label>
                    <div class="form-group">
                      <vue-timepicker id="s_one_end_time" v-model="clinicSession.s_one_end_time" :minute-interval="5"
                        auto-scroll format="HH:mm" hide-disabled-hours
                        :hour-range="secondDisabledHours" :placeholder="this.formTranslation.doctor_session.plh_end_time"
                        @change="generateTimeSlotTime('second')">
                        <template v-slot:clearButton>
                          <span class="clear-btn" @click.prevent="thirdDisabledHours = [[0, 23]]">×</span>
                        </template>
                      </vue-timepicker>
                      <!-- <div
                          v-if="sessionSubmitted && !$v.clinicSession.s_one_end_time.HH.required && !$v.clinicSession.s_one_end_time.mm.required"
                          class="invalid-feedback mt-2">{{ formTranslation.doctor_session.end_time_required }}
                      </div> -->

                      <div v-if="sessionSubmitted && !$v.clinicSession.s_one_end_time.minTime"
                        class="invalid-feedback mt-2">{{ formTranslation.doctor_session.end_time_bigger_then_start }}
                      </div>
                    </div>
                  </div>
                  <!-- </div>

                <div class="row"> -->
                  <div class="col-md-3">
                    <label class="form-control-label"> {{ formTranslation.doctor_session.evening_session }} </label>
                    <div class="form-group">
                      <vue-timepicker id="s_two_start_time" v-model="clinicSession.s_two_start_time" :minute-interval="5"
                        auto-scroll format="HH:mm" hide-disabled-hours
                        :hour-range="thirdDisabledHours" :placeholder="this.formTranslation.doctor_session.plh_start_time"
                        @change="generateTimeSlotTime('third')">
                        <template v-slot:clearButton>
                          <span class="clear-btn" @click.prevent="fourthDisabledHours = [[0, 23]]">×</span>
                        </template>
                      </vue-timepicker>
                      <div v-if="sessionSubmitted && !$v.clinicSession.s_two_start_time.minTime"
                        class="invalid-feedback mt-2">
                        {{ formTranslation.doctor_session.start_time_smaller_then_first_session_end_time }}
                      </div>
                      <div v-if="sessionSubmitted && !$v.clinicSession.s_two_start_time.maxTime"
                        class="invalid-feedback mt-2">{{ formTranslation.doctor_session.start_time_smaller_then_end }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <label class="form-control-label"> &nbsp; </label>
                    <div class="form-group">
                      <vue-timepicker id="s_two_end_time" v-model="clinicSession.s_two_end_time" :minute-interval="5"
                        auto-scroll format="HH:mm" hide-disabled-hours
                        :hour-range="fourthDisabledHours" :placeholder="this.formTranslation.doctor_session.plh_end_time"
                        @change="generateTimeSlotTime('fourth')"></vue-timepicker>
                      <div v-if="s_two_end_time_required_validation" class="invalid-feedback mt-2">{{
                        formTranslation.doctor_session.end_time_required }}
                      </div>
                      <div v-if="sessionSubmitted && !$v.clinicSession.s_two_end_time.minTime"
                        class="invalid-feedback mt-2">{{ formTranslation.doctor_session.end_time_bigger_then_start }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- / end second row sesion time selection -->

                <!-- third row days  selection  -->

                <div class="row">
                  <div class="col-md-12">
                    <label class="form-control-label" for="week_days">
                      {{ formTranslation.doctor_session.week_days }} <span class="text-danger">*</span>
                    </label>
                    <div class="">
                      <div id="check_all_days_form" class="custom-control custom-checkbox  d-inline-block mr-2">
                        <input id="check_all_days" v-model="daysAll" :value="1" class="custom-control-input"
                          name="check_all_days" type="checkbox" @change="handleAllDaysChecked" />
                        <label class="custom-control-label text-capitalize" for="check_all_days">
                          {{ formTranslation.common.all }} </label>
                      </div>
                      <div v-for="(day, index) in weekDays" id="week_days" :key="index"
                        class="custom-control custom-checkbox kc-custom-control d-inline-block mr-2">
                        <input :id="day + index" v-model="clinicSession.days"
                          :class="{ ' is-invalid': sessionSubmitted && $v.clinicSession.days.$error }" :value="index"
                          class="custom-control-input" name="days[]" type="checkbox" @change="handleUncheckDays" />
                        <label :for="day + index" class="custom-control-label text-capitalize">{{ day }}</label>
                      </div>
                    </div>
                    <div v-if="submitted && $v.clinicSession.days.$invalid" class="invalid-feedback mt-2"> {{
                      formTranslation.doctor_session.days_required }}
                    </div>
                    <div v-if="weekDaysValidationCheck" class="invalid-feedback mt-2"> {{
                      formTranslation.doctor_session.days_already_exist }}
                    </div>
                  </div>
                </div>

                <!-- / end third row days  selection  -->

                <!-- save button -->

                <div class="row">
                  <div class="col-md-12">
                    <div class="d-flex justify-content-end">
                      <button v-if="!loading" class="btn btn-primary rtl-ml-2" type="submit">
                        <i class="fa fa-save"></i> {{ formTranslation.doctor_session.save_btn }}
                      </button>
                      <button v-else class="btn btn-primary" type="submit" disabled>
                        <i class="fa fa-sync fa-spin"></i>&nbsp; {{ formTranslation.common.loading }}
                      </button>
                      <button class="btn btn-outline-primary" type="button" @click="resetSessionFormData">
                        {{ formTranslation.common.cancel }}
                      </button>
                    </div>
                  </div>
                </div>

              </b-collapse>

              <div class="row mt-3">
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-12">
                      <div v-if="pageLoader" class="page-loader-section">
                        <loader-component-2></loader-component-2>
                      </div>
                      <div v-else class="mb-0 doctor-session-tbl">
                        <div id="clinicSessionPrint">
                          <div class="mb-0">
                            <vue-good-table ref="dataTable" :columns="column" :pagination-options="{
                              enabled: true,
                              mode: 'pages'
                            }" :rows="clinicData.clinic_sessions" :search-options="{
  enabled: true,
  placeholder: formTranslation.datatable.search_placeholder
}" :sort-options="{ enabled: true }" styleClass="vgt-table striped" compactMode>
                              <div slot="table-actions">
                                <module-data-export :module_data="clinicData.clinic_sessions"
                                  :module_name="formTranslation.doctor_session.doc_sessions" module_type="session"
                                  v-if="kcCheckPermission('doctor_session_export')"> </module-data-export>
                              </div>
                              <template slot="table-row" slot-scope="props">
                                <div v-if="props.column.field == 'index'">
                                  {{ props.row.originalIndex + 1 }}
                                </div>
                                <div v-else-if="props.column.field == 'days'">
                                  {{ tableDaysTranslation(props.row.days) }}
                                </div>
                                <div v-else-if="props.column.field == 's_one_start_time'">
                                  <div
                                    v-if="props.row.s_one_start_time.HH !== '' && props.row.s_one_end_time.MM !== '' && props.row.s_one_start_time.MM !== '' && props.row.s_one_end_time.HH !== ''">
                                    {{ props.row.s_one_start_time | timeObjectToString }} {{ ' to ' }} {{
                                      props.row.s_one_end_time | timeObjectToString }}
                                  </div>
                                  <div class="text-center" v-else>
                                    -
                                  </div>
                                </div>
                                <div v-else-if="props.column.field == 's_two_start_time'">
                                  <span
                                    v-if="props.row.s_two_start_time.HH !== '' && props.row.s_two_end_time.MM !== '' && props.row.s_two_start_time.MM !== '' && props.row.s_two_end_time.HH !== ''">
                                    {{ props.row.s_two_start_time | timeObjectToString }} {{
                                      ' to '
                                    }} {{ props.row.s_two_end_time | timeObjectToString }}
                                  </span>
                                  <span v-else>
                                    -
                                  </span>
                                </div>
                                <div v-else-if="props.column.field == 'action'" class="btn-group">
                                  <button v-b-tooltip.hover class="btn btn-sm btn-outline-primary"
                                    :title="formTranslation.clinic_schedule.dt_lbl_edit"
                                    v-if="kcCheckPermission('doctor_session_edit')" type="button"
                                    @click="editSessionData(props)">
                                    <i class="fa fa-pen-alt"></i>
                                  </button>
                                  <button
                                    v-if="kcCheckPermission('doctor_session_delete') && getUserRole() !== 'receptionist'"
                                    v-b-tooltip.hover class="btn btn-outline-danger btn-sm"
                                    :title="formTranslation.clinic_schedule.dt_lbl_dlt" type="button"
                                    @click="deleteSessionData(props)">
                                    <i class="fa fa-trash"></i>
                                  </button>
                                </div>
                              </template>
                            </vue-good-table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          </div>
        </form>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { validations } from "@/plugins/kivicare-custumization/assets/js/validation.js"; // Assurez-vous de mettre le bon chemin d'accès au fichier
import { maxLength, minLength, required, requiredIf } from "vuelidate/lib/validators";
import { post, get } from "../../config/request";
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
  name: 'DoctorSession',
  data: () => {
    return {
      visible: false,
      isEdit: false,
      isAdd: true,
      isCloseBtnShow: false,
      toggleBtnHtml: '',
      activeClinicId: 0,
      cardTitle: 'Edit clinic profile',
      clinicSessionTitle: 'Add session',
      pageLoader: true,
      clinicData: {},
      specialization: [],
      doctors: [],
      weekDays: {},
      loading: false,
      submitted: false,
      editProfileText: '<i class="fa fa-pen-fancy"></i> Edit Profile',
      buttonText: '<i class="fa fa-plus"></i> Add',
      sessionButtonText: '<i class="fa fa-save"></i> Save session',
      sessionSubmitted: false,
      sessionEdit: false,
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      clinicSession: {},
      s_two_end_time_required_validation: false,
      weekDaysValidationCheck: false,
      sessionDoctorValidationCheck: false,
      editSessionDataIndex: "",
      timeSlots: [],
      inValidTime: false,
      profileImage: '',
      time_slots: [],
      daysAll: 0,
      countryList: [],
      clinics: [],
      column: [],
      isCollapseVisible: false,
      doctor_name: '',
      timezone_status: true,
      timezone_msg: '',
      doctorMultiselectLoader: true,
      clinicMultiselectLoader: true,
      firstDisabledHours: [],
      secondDisabledHours: [[0, 23]],
      thirdDisabledHours: [[0, 23]],
      fourthDisabledHours: [[0, 23]],
      dropDownWeekDays: [],
      isClinicSessionDaysValid: true
    }
  },
  validations: {
    clinicData: {
      name: {
        required,
        alphaSpace,
        minLength: minLength(2),
        maxLength: maxLength(35)
      },
      email: {
        required,
        emailValidate
      },
      telephone_no: {
        required,
        phoneNumber,
        minLength: minLength(6),
        maxLength: maxLength(15)
      },
      address: {
        required
      },
      state: {
        required,
        alphaSpace,
        maxLength: maxLength(30)
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
      specialties: {
        required
      },
      status: { required }
    },
    clinicSession: {
      clinic_id: {
        required: requiredIf(function () {
          return this.userData.addOns.kiviPro == true && (this.getUserRole() === 'administrator' || this.getUserRole() == 'doctor')
        })
      },
      doctors: {
        required: requiredIf(function () {
          return this.getUserRole() != 'doctor'
        }),
      },
      days: { required },
      time_slot: { required },
      s_one_start_time: {
        // HH: {required},
        // mm: {required},
        maxTime: maxTime('s_one_end_time')
      },
      s_one_end_time: {
        // HH: {required},
        // mm: {required},
        minTime: minTime('s_one_start_time')
      },
      s_two_start_time: {
        // minTime: minTime('s_one_end_time'),
        maxTime: maxTime('s_two_end_time')
      },
      s_two_end_time: {
        minTime: minTime('s_two_start_time')
      }
    }
  },
  mounted() {

    if (['patient'].includes(this.getUserRole())) {
      this.$router.push({ name: "403" })
    }
    this.days.map((item) => {
      this.weekDays[item] = this.formTranslation.days[item];
      this.dropDownWeekDays.push({ value: item, text: this.weekDays[item] })
      return this.weekDays;
    })
    this.getTimezoneSetting();
    this.toggleBtnHtml = '<i class="fa fa-plus"></i>' + this.formTranslation.doctor_session.add_session_btn;
    this.column = [
      {
        field: 'index',
        label: this.formTranslation.doctor_session.dt_lbl_sr,
        width:'50px',
      },
      {
        label: this.formTranslation.doctor_session.dt_lbl_doc,
        field: 'doctor_name',
        width:'150px',
        filterOptions: {
          enabled: !(this.getUserRole() === 'doctor'),
          placeholder: this.formTranslation.doctor_session.dt_plh_fltr_by_doc,
          filterValue: '',
        }
      },
      {
        field: 'clinic_name',
        label: this.formTranslation.doctor_session.dt_lbl_clinic,
        width:'150px',
        filterOptions: {
          enabled: !(window.request_data.current_user_role === 'kiviCare_clinic_admin' || window.request_data.current_user_role === 'kiviCare_receptionist'),
          filterValue: '',
        }
      },
      {
        label: this.formTranslation.doctor_session.dt_lbl_days,
        field: 'days',
        width:'200px',
        sortable: false,
        filterOptions: {
          enabled: true,
          filterValue: '',
          filterDropdownItems: this.dropDownWeekDays,
          filterFn: function (data, filterString) {
            return data.includes(filterString);
          }
        }
      },
      {
        label: this.formTranslation.doctor_session.dt_lbl_morning_session,
        field: 'morning_session',
        width:'150px',
        sortable: false,
      },
      {
        label: this.formTranslation.doctor_session.dt_lbl_evening_session,
        field: 'evening_session',
        width:'150px',
        sortable: false,
      },
      {
        label: this.formTranslation.doctor_session.dt_lblaction,
        field: 'action',
        width:'50px',
        sortable: false,
        html: true,
      }
    ];
    this.clinicData = this.defaultClinicData();
    this.clinicSession = this.defaultClinicSessionData();
    this.init();
    this.profileImage = window.request_data.kiviCarePluginURL + 'assets/images/kc-demo-img.png';
    if (this.$route.params.id !== undefined) {
      let doctor_id = this.$route.params.id
      this.toggleBtnHtml = '<i class="fa fa-minus"></i>' + this.formTranslation.doctor_session.close_form_btn;
      this.clinicSession = this.defaultClinicSessionData();
      this.isCloseBtnShow = true;
      this.isCollapseVisible = true;
      this.getDoctorsData();
      setTimeout(() => {
        this.clinicSession.doctors = this.doctors.find(doctor => doctor.id == doctor_id)
        this.getUserClinic(doctor_id);
      }, 500)
    } else {
      this.getUserClinic(1);
    }
  },
  filters: {
    doctorFilter: function (Doctors) {
      let doctors = Doctors
      let result = [];
      if (doctors !== undefined && doctors.length > 0) {
        doctors.forEach(function (doctor) {
          result.push(doctor.label);
        });
        return result.join(',');
      } else {
        return 'No Doctor Found';
      }
    },
    clinicSpecialityFormat: function (Speciality) {
      let doctors = Speciality
      let result = [];
      if (doctors !== undefined && doctors.length > 0) {
        doctors.forEach(function (doctor) {
          result.push(doctor.label);
        });
        return result.join(' ,');
      } else {
        return this.formTranslation.doctor_session.no_speciality_found;
      }
    }
  },
  methods: {
    init: function () {
      // this.getCountryList();
      this.getClinicSessionsList();
      if (this.$store.state.userDataModule.user !== undefined && this.$store.state.userDataModule.user.addOns.kiviPro != true) {
        this.activeClinicId = this.$store.state.userDataModule.user.default_clinic_id;
      }
      this.getDoctorsData();
      this.getTimeSlots()
    },
    handleSubmit: function () {
      this.loading = true;

      this.submitted = true;
      let isValid = true;

      // stop here if form is invalid
      this.$v.$touch();
      this.$nextTick(() => {
        if(document.querySelector('.is-invalid') !== null && document.querySelector('.is-invalid') !== undefined){
          document.querySelector('.is-invalid').scrollIntoView({block: "center", behavior: "smooth"})
        }else if(document.querySelector('.invalid-feedback') !== null && document.querySelector('.invalid-feedback') !== undefined){
          document.querySelector('.invalid-feedback').scrollIntoView({block: "center", behavior: "smooth"})
        }
      })

      if (this.$v.clinicSession.$invalid) {
          this.loading = false;
          return;
      }
      
      if (this.clinicSession.s_one_start_time.HH > this.clinicSession.s_one_end_time.HH) {
        isValid = false
      }
      if (this.clinicSession.s_two_start_time.HH > this.clinicSession.s_two_end_time.HH) {
        isValid = false
      }
      
      if (this.clinicSession.s_one_start_time.HH == this.clinicSession.s_one_end_time.HH) {
        if (this.clinicSession.s_one_start_time.mm > this.clinicSession.s_one_end_time.mm) {
          isValid = false
        }
      }
      
      if (this.clinicSession.s_two_start_time.HH !== '' && this.clinicSession.s_one_end_time.HH != '' &&
      this.clinicSession.s_two_start_time.HH < this.clinicSession.s_one_end_time.HH) {
        isValid = false
      }
      
      if (this.clinicSession.s_two_start_time.HH == this.clinicSession.s_one_end_time.HH) {
        if (this.clinicSession.s_two_start_time.mm < this.clinicSession.s_one_end_time.mm) {
          isValid = false
        }
      }
      if (this.clinicSession.s_two_start_time.HH == this.clinicSession.s_two_end_time.HH) {
        if (this.clinicSession.s_two_start_time.mm > this.clinicSession.s_two_end_time.mm) {
          isValid = false
        }
      }
      
      
      if (this.clinicSession.days == undefined || this.clinicSession.days.length == 0) {
        isValid = false;
      }
      if (this.$v.clinicSession.$invalid || this.addSessionData() == false) {
        isValid = false
      }
      
      if (this.clinicSession.s_one_end_time.HH.length == 0 || this.clinicSession.s_one_end_time.mm.length == 0 || this.clinicSession.s_one_start_time.mm.length == 0 || this.clinicSession.s_one_start_time.HH.length == 0) {
        isValid = false;
      }

      if (!isValid) {
        if (this.sessionDoctorValidationCheck && this.sessionSubmitted) {
          displayErrorMessage(this.formTranslation.doctor_session.doc_already_added)
        }
        this.loading = false;
        this.submitted = false;
        return true;
      }

      if (validateForm("clinicDataForm")) {
        post('clinic_session_save', this.clinicSession)
          .then((response) => {
            if (this.getUserRole() === 'administrator') {
              this.$store.dispatch("userDataModule/fetchUserData", {});
            }
            if (response.data.status !== undefined && response.data.status === true) {
              if (this.clinicSession.id !== undefined && this.clinicSession.id !== null && this.clinicSession.id !== '') {
                this.clinicData.clinic_sessions[this.editSessionDataIndex] = this.clinicSession;
              } else {
                this.clinicData.clinic_sessions.push(this.clinicSession);
              }
              displayMessage(response.data.message);
              location.reload();
            } else {
              this.loading = false;
              if (response.data.status !== undefined && response.data.status === false && response.data.message !== undefined) {
                displayErrorMessage(response.data.message);
              } else {
                displayErrorMessage(this.formTranslation.doctor_session.doctor_session_not_saved_successfully)
              }
            }
            this.loading = false;
            this.submitted = false;
            this.sessionSubmitted = false;
            this.weekDaysValidationCheck = false;
            this.sessionDoctorValidationCheck = false;
            this.s_two_end_time_required_validation = false;
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
            this.submitted = false;
            this.sessionSubmitted = false;
            this.weekDaysValidationCheck = false;
            this.sessionDoctorValidationCheck = false;
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
      }
    },
    defaultClinicData: function () {
      return {
        clinic_sessions: [],
      }
    },
    defaultClinicSessionData: function () {
      return {
        days: [],
        doctors: {},
        time_slot: 5,
        s_one_start_time: {
          HH: '',
          mm: ''
        },
        s_one_end_time: {
          HH: '',
          mm: ''
        },
        s_two_start_time: {
          HH: '',
          mm: ''
        },
        s_two_end_time: {
          HH: '',
          mm: ''
        }
      }
    },
    getUserClinic(doctor_id) {
      get('get_user_wise_clinic', {
        data_type: 'doctor',
        doctor_id: doctor_id
      })
        .then((data) => {
          if (data.data.status !== undefined && data.data.status === true) {
            this.clinics = data.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error);;
        })
    },
    getDoctorsData: function () {
      this.doctorMultiselectLoader = true;
      get('get_static_data', {
        data_type: 'clinic_doctors',
        clinic_id: this.activeClinicId
      })
        .then((data) => {
          this.doctorMultiselectLoader = false;
          if (data.data.status !== undefined && data.data.status === true) {
            this.doctors = data.data.data;
          }
        })
        .catch((error) => {
          this.doctorMultiselectLoader = false;
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error);;
        })
    },
    addSessionData: function () {

      let userRole = this.getUserRole();
      let userData = this.userData;

      this.sessionSubmitted = true;
      this.sessionDoctorValidationCheck = false;

      if (userRole === 'doctor') {
        this.clinicSession.doctors = {
          id: userData.ID,
          name: userData.display_name
        }
      }

      this.$v.clinicSession.$touch();

      if (this.timeSlots.length === 0) {
        return false;
      }

      if (this.$v.clinicSession.$invalid) {
        return;
      }

      let clinicSessionDoctor = '';

      if (userRole === 'doctor') {
        clinicSessionDoctor = userData.ID;
      } else {
        clinicSessionDoctor = this.clinicSession.doctors.id;
      }
      for (let sessionIndex = 0; sessionIndex < this.clinicData.clinic_sessions.length; sessionIndex++) {
        let doctorsObject = {};
        if (userRole === 'doctor') {
          this.clinicData.clinic_sessions[sessionIndex].doctors = {
            id: userData.ID,
            label: userData.display_name,
            timeSlot: userData.timeSlot
          };
        }
        doctorsObject = this.clinicData.clinic_sessions[sessionIndex].doctors;
        let daysObject = this.clinicData.clinic_sessions[sessionIndex].days;
        if (parseInt(clinicSessionDoctor) === parseInt(doctorsObject.id)) {
          for (let docIndex = 0; docIndex < this.clinicSession.days.length; docIndex++) {
            let sessionDay = this.clinicSession.days[docIndex];
            if (daysObject.includes(sessionDay)) {
              let sessionValidation = validateTimeSlot(this.clinicSession, this.clinicData.clinic_sessions[sessionIndex]);
              if (this.editSessionDataIndex !== "") {
                if (this.editSessionDataIndex !== sessionIndex) {
                  if (sessionValidation === false) {
                    this.sessionDoctorValidationCheck = true;
                    break;
                  }
                }
              } else {
                if (sessionValidation === false) {
                  this.sessionDoctorValidationCheck = true;
                  break;
                }
              }
            }
          }
        }
        if (this.sessionDoctorValidationCheck) {
          break;
        }
      }
      if (this.sessionDoctorValidationCheck) {
        return false;
      }
      if (this.clinicSession.s_two_start_time.HH !== "" && this.clinicSession.s_two_start_time.mm !== "") {
        if (this.clinicSession.s_two_end_time.HH === "" && this.clinicSession.s_two_end_time.mm === "") {
          this.s_two_end_time_required_validation = true;
          return false;
        }
      } else {
        this.s_two_end_time_required_validation = false;
      }
      if (!this.sessionEdit) {
        if (this.clinicData.clinic_sessions === undefined) {
          this.clinicData.clinic_sessions = [];
        }
      } else {
        this.clinicData.clinic_sessions[this.editSessionDataIndex] = this.clinicSession;
        this.sessionEdit = false;
      }
    },
    editSessionData: function (data) {
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      this.clinicSessionTitle = this.formTranslation.doctor_session.edit_session;
      this.sessionEdit = true;
      this.sessionButtonText = '<i class="fa fa-save"></i> ' + this.formTranslation.doctor_session.save_session;
      this.editSessionDataIndex = (data.row.originalIndex);
      this.clinicSession = Object.assign({}, this.clinicData.clinic_sessions[data.row.originalIndex]);
      this.isEdit = true;
      this.isAdd = false;
      this.handleCollapseChange('edit');
      if (this.clinicSession.days.length >= 7) {
        this.daysAll = 1;
      } else {
        this.daysAll = 0;
      }
      window.scroll({ top: 0, behavior: 'smooth' });
    },
    deleteSessionData: function (data) {
      if (this.clinicData.clinic_sessions[data.index] !== undefined) {
        $.confirm({
          title: this.formTranslation.clinic_schedule.dt_are_you_sure,
          content: this.formTranslation.common.reset_appointment_slot,
          type: 'red',
          buttons: {
            ok: {
              text: this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                post('clinic_session_delete', { session_id: data.row.id })
                  .then((response) => {
                    if (this.getUserRole() === 'administrator') {
                      this.$store.dispatch("userDataModule/fetchUserData", {});
                    }
                    if (response.data.status !== undefined && response.data.status === true) {
                      if (this.clinicData.clinic_sessions[data.index] !== undefined) {
                        this.clinicData.clinic_sessions.splice((data.index), 1);
                        displayMessage(response.data.message);
                      }
                    } else {
                      displayErrorMessage(response.data.message);
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);;
                  })
              }
            },
            cancel: {
              text: this.formTranslation.common.cancel
            }
          }
        });
      } else {
        displayErrorMessage(this.formTranslation.doctor_session.clinic_profile_data_not_found)
      }
    },
    resetSessionFormData: function () {
      this.submitted = false;
      this.loading = false;
      this.isCollapseVisible = false;
      this.toggleBtnHtml = '<i class="fa fa-plus"></i>' + this.formTranslation.doctor_session.add_session_btn;
      this.sessionButtonText = '<i class="fa fa-save"></i> Add session';
      this.clinicSession = this.defaultClinicSessionData();
      this.daysAll = 0;
      this.isCloseBtnShow = false;
      this.firstDisabledHours = [[0, 23]];
      this.secondDisabledHours = [[0, 23]];
      this.thirdDisabledHours = [[0, 23]];
      this.fourthDisabledHours = [[0, 23]];
    },
    sessionDoctorsValidation: function (selectId) {
      this.sessionDoctorValidationCheck = false;
      this.getUserClinic(selectId.id);
      this.timeSlots = [];
      this.clinicSession.s_one_start_time
        = this.clinicSession.s_one_end_time
        = this.clinicSession.s_two_start_time
        = this.clinicSession.s_two_end_time
        = {
          HH: '',
          mm: ''
        }
    },
    sessionDaysValidation: function () {
      this.weekDaysValidationCheck = false;
      for (let index = 0; index < this.clinicSession.days.length; index++) {
        for (let i = 0; i < this.clinicData.clinic_sessions.length; i++) {
          if (this.editSessionDataIndex !== "") {
            if (i != this.editSessionDataIndex) {
              if (this.clinicData.clinic_sessions[i].days.includes(this.clinicSession.days[index])) {
                this.weekDaysValidationCheck = true;
                break;
              }
            }
          } else {
            if (this.clinicData.clinic_sessions[i].days.includes(this.clinicSession.days[index])) {
              this.weekDaysValidationCheck = true;
              break;
            }
          }
          if (this.weekDaysValidationCheck) {
            break;
          }
        }
      }
    },
    getTimeSlots: function () {
      let slot = 5;
      for (let i = 0; i < 12; i++) {

        if (slot <= 60) {
          this.time_slots.push(slot);
        }
        slot = slot + 5;
      }
    },
    getTimeSlot: function (startTime, endTime, doctor) {

      var timeSlotDiff = (this.clinicSession.time_slot !== undefined) ? this.clinicSession.time_slot : "";

      var newTimeSlot = "";
      let slots = [];

      if (startTime.HH !== "" && startTime.mm !== "" && endTime.HH !== "" && endTime.mm !== "" && timeSlotDiff !== "") {

        let sessionOneStartTime = objToTime(startTime);
        let sessionOneEndTime = objToTime(endTime);

        let timeDiff = sessionOneEndTime.diff(sessionOneStartTime, 'minutes');

        let loopCount = Math.ceil(timeDiff / timeSlotDiff);

        for (let i = 0; i < loopCount; i++) {

          if (i === 0) {
            newTimeSlot = sessionOneStartTime.format("HH:mm");
          } else {
            newTimeSlot = moment(newTimeSlot, 'HH:mm').add(timeSlotDiff, 'minutes').format('HH:mm')
          }

          let temp = {
            time: newTimeSlot,
            isValid: true,
            timeSlotDiff: timeSlotDiff
          }

          if (moment(newTimeSlot, 'HH:mm').isAfter(sessionOneEndTime)) {
            let timeDiff = moment(newTimeSlot, 'HH:mm').diff(sessionOneEndTime, 'minutes')
            temp.isValid = false;
            temp.timeSlotDiff = Math.abs(timeSlotDiff - timeDiff)

          }
          slots.push(temp);
        }
      }

      return slots;
    },
    generateTimeSlotTime: function (type) {
      switch (type) {
        case 'first':
          if (this.clinicSession.s_one_start_time.HH !== undefined && this.clinicSession.s_one_start_time.HH != '') {
            this.secondDisabledHours = [[parseInt(this.clinicSession.s_one_start_time.HH) + 1, 23]];
          }
          break;
        case 'second':
          if (this.clinicSession.s_one_end_time.HH !== undefined && this.clinicSession.s_one_end_time.HH != '') {
            this.thirdDisabledHours = [[parseInt(this.clinicSession.s_one_end_time.HH) + 1, 23]];
          }
          break;
        case 'third':
          if (this.clinicSession.s_two_start_time.HH !== undefined && this.clinicSession.s_two_start_time.HH != '') {
            this.fourthDisabledHours = [[parseInt(this.clinicSession.s_two_start_time.HH) + 1, 23]];
          }
          break;
        case 'fourth':
          break;
      }
      this.timeSlots = [];
      let time = [
        { startTime: this.clinicSession.s_one_start_time, endTime: this.clinicSession.s_one_end_time },
        { startTime: this.clinicSession.s_two_start_time, endTime: this.clinicSession.s_two_end_time }
      ];
      for (let i = 0; i < time.length; i++) {
        let slots = this.getTimeSlot(time[i].startTime, time[i].endTime, this.clinicSession.doctors);
        if (slots.length > 0) {
          this.timeSlots[i] = slots;
        }
      }
    },
    getClinicSessionsList: function () {
      this.pageLoader = true;
      this.buttonText = '<i class="fa fa-save"></i>' + this.formTranslation.common.save;
      get('clinic_session_list', {})
        .then((response) => {
          this.pageLoader = false;
          if (response.data.status !== undefined && response.data.status === true) {
            this.clinicData = response.data.data;
          } else {
            this.clinicData = {
              clinic_sessions: []
            };
          }
        })
        .catch((error) => {
          this.pageLoader = false;
          console.log(error);
        })
    },
    handleUncheckDays: function () {
      if (this.clinicSession.days !== undefined && this.clinicSession.days.length === 7) {
        this.daysAll = true
      } else {
        this.daysAll = false
      }
    },
    handleAllDaysChecked: function () {
      if (this.daysAll) {
        this.clinicSession.days = this.days;
      } else {
        this.clinicSession.days = []
      }
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
          displayErrorMessage(this.formTranslation.common.internal_server_error);
        })
    },
    onCollapseAction: function () {
    },
    clinicChange(selectedOption) {
      this.doctorMultiselectLoader = true;

      get('get_static_data', {
        data_type: 'get_users_by_clinic',
        clinic_id: selectedOption.id,
      })
        .then((response) => {
          this.doctorMultiselectLoader = false;
          if (response.data.status !== undefined && response.data.status === true) {
            this.doctors = response.data.data;
            this.clinicSession.doctors = [];
          } else {
            displayErrorMessage(response.data.message)
          }
        })
        .catch((error) => {
          this.doctorMultiselectLoader = false;
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error);
        })
    },
    tableDaysTranslation(days) {
      let tempDays = [];
      days.map((item) => {
        tempDays.push(this.formTranslation.days[item]);
        return tempDays;
      })
      return tempDays.join(', ')
    },
    handleCollapseChange: function (toggleForm) {
      if (toggleForm === 'add') {
        this.toggleBtnHtml = '<i class="fa fa-minus"></i>' + this.formTranslation.doctor_session.close_form_btn;
        this.clinicSession = this.defaultClinicSessionData();
        this.isCloseBtnShow = true;
        this.isCollapseVisible = true;
      } else if (toggleForm === 'edit') {
        this.toggleBtnHtml = '<i class="fa fa-minus"></i>' + this.formTranslation.doctor_session.close_form_btn;
        this.isCloseBtnShow = true;
        this.isCollapseVisible = true;
      } else {
        // close form
        this.resetSessionFormData();
      }
    },
    iUnderstandTimezone: function () {
      post('save_time_zone_option', { time_status: 1 })
        .then((response) => {
          if (response.data.status !== undefined && response.data.status === true) {
            this.timezone_status = response.data.data
            location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error);
        })
    },
    getTimezoneSetting: function () {
      this.timezone_status = window.request_data.time_zone_data.data;
      this.timezone_msg = window.request_data.time_zone_data.message;
    }
  },
  computed: {
    doctorSessionExport() {
      return 'Doctor Session List - ' + moment().format('YYYY-MM-DD');
    },
    userData() {
      return this.$store.state.userDataModule.user;
    },
    allClinics() {
      this.clinicMultiselectLoader = false;
      if (this.$store.state.clinic.length > 0) {
        return this.$store.state.clinic
      } else {
        return [];
      }
    },
    // formTranslation: function () {
    //   return this.$store.state.staticDataModule.langTranslateData ;
    // }
  },
  watch: {}

  

}
export default {
  validations: {
    clinicSession: {
      // Autres champs...
      s_one_start_time: {
        // Conditions modifiées pour être optionnelles mais nécessitent une logique pour vérifier si l'une des sessions est remplie
        requiredIf: requiredIf(function() {
          return !!(this.clinicSession.s_one_end_time || this.clinicSession.s_two_start_time || this.clinicSession.s_two_end_time);
        })
      },
      s_one_end_time: {
        // Conditions modifiées similaires à `s_one_start_time`
        requiredIf: requiredIf(function() {
          return !!(this.clinicSession.s_one_start_time || this.clinicSession.s_two_start_time || this.clinicSession.s_two_end_time);
        })
      },
      s_two_start_time: {
        // Conditions modifiées pour être optionnelles
        requiredIf: requiredIf(function() {
          return !!(this.clinicSession.s_one_start_time || this.clinicSession.s_one_end_time || this.clinicSession.s_two_end_time);
        })
      },
      s_two_end_time: {
        // Conditions modifiées similaires à `s_two_start_time`
        requiredIf: requiredIf(function() {
          return !!(this.clinicSession.s_one_start_time || this.clinicSession.s_one_end_time || this.clinicSession.s_two_start_time);
        })
      },
      // Validation personnalisée pour vérifier au moins une session remplie
      atLeastOneSession: {
        customValidator(value) {
          // `this` est votre vue instance
          return (this.clinicSession.s_one_start_time && this.clinicSession.s_one_end_time) ||
                 (this.clinicSession.s_two_start_time && this.clinicSession.s_two_end_time);
        }
      }
    }
  }
}

</script>
<style>
#clinicSessionPrint .vgt-table thead th {
  vertical-align: middle;
}

#s_one_start_time {
  height: 3.0em;
}

#s_one_end_time {
  height: 3.0em;
}

#s_two_start_time {
  height: 3.0em;
}

#s_two_end_time {
  height: 3.0em;
}

@media (max-width: 576px){
  #clinicSessionPrint .vgt-compact td:before{
    width: 55%;
    padding-left: 0;
  }
}

</style>
