<template>
  <div>
    <form :id="(appointmentFormObj.id !== undefined ? 'appointmentDataForm' + appointmentFormObj.id : 'appointmentDataForm' )" :appointment-form-id="(appointmentFormObj.id !== undefined ? appointmentFormObj.id : 0 )" enctype="multipart/form-data"  @submit.prevent="handleFormSubmit" :novalidate="true">
      <div class="row">
        <div class="col-md-12 p-4">
          <div class="row">
            <div class="col-md-5">
              <div class="form-group" v-if="userData.addOns.kiviPro == true && (getUserRole() == 'administrator' || getUserRole()== 'doctor' || getUserRole()== 'patient' )">
                <label for="doctor_id" class="form-control-label">
                  {{ formTranslation.appointments.select_clinic }} <span class="text-danger">*</span>
                </label>
                <multi-select
                    deselect-label=""
                    select-label=""
                    @select="clinicChange"
                    @remove="clinicChange"
                    :disabled="disabledClinicField"
                    :loading="clinicMultiselectLoader"
                    v-model="appointmentFormObj.clinic_id"
                    :tag-placeholder="formTranslation.appointments.select_clinic_plh" id="clinic_id"
                    :placeholder="formTranslation.appointments.search_plh"
                    label="label"
                    track-by="id" :options="clinics"
                ></multi-select>
                <div
                    v-if="submitted && !$v.appointmentFormObj.clinic_id.required"
                    class="invalid-feedback">{{formTranslation.appointments.clinic_is_required}}
                </div>
              </div>
              <div class="form-group" v-if="getUserRole() !== 'doctor'">
                <label for="doctor_id" class="form-control-label">
                  {{formTranslation.common.doctor}} <span class="text-danger">*</span>
                </label>
                <multi-select
                    deselect-label=""
                    select-label=""
                    @select="handleDoctorChange"
                    @remove="handleDoctorUnselect"
                    v-model="appointmentFormObj.doctor_id"
                    :tag-placeholder="formTranslation.appointments.doctor_plh"
                    :placeholder="formTranslation.appointments.search_plh"
                    :disabled="disabledDoctorField"
                    id="doctor_id"
                    label="label"
                    track-by="id"
                    :loading="doctorMultiselectLoader"
                    :options="doctors"
                >
                </multi-select>
                <div v-if="submitted && !$v.appointmentFormObj.doctor_id.required"
                     class="invalid-feedback">{{formTranslation.appointments.doc_required}}
                </div>
              </div>
              <div class="form-group">
                <label for="visit_type" class="form-control-label">
                  {{formTranslation.common.service}} <span class="text-danger">*</span>
                  <span class="cursor-pointer text-primary small float-right"
                    v-if="(getUserRole() === 'administrator' || getUserRole() === 'clinic_admin' || getUserRole() === 'receptionist' || getUserRole() === 'doctor') && appointmentFormObj.id === undefined && kcCheckPermission('service_add')">
                <router-link :to="{ name: 'service' }"><i class="fa fa-plus"></i> {{formTranslation.common.service_add}}</router-link>
                  </span>
                </label>
                <multi-select
                    v-model="appointmentFormObj.visit_type"
                    @select="appointmentTypeChangeSelect"
                    @remove="appointmentTypeChangeUnselect"
                    :tag-placeholder="formTranslation.appointments.tag_visit_type_plh"
                    id="visit_type"
                    :placeholder="formTranslation.appointments.search_plh"
                    :disabled="disabledServiceField"
                    label="name"
                    track-by="id"
                    :options="appointmentTypes"
                    :loading="serviceMultiselectLoader"
                    :multiple="appointmentTypeMultiselect"
                ></multi-select>
                <div v-if="submitted && !$v.appointmentFormObj.visit_type.required"
                     class="invalid-feedback">{{formTranslation.patient_bill.service_required}}
                </div>
              </div>
              <div class="form-group">
                <label for="appointment_start_date" class="form-control-label">
                  {{formTranslation.appointments.appointment_date}} <span class="text-danger">*</span>
                </label>
                <vc-date-picker
                    id="appointmentDate"
                    title-position="left"
                    v-model="appointmentFormObj.appointment_start_date"
                    is-expanded
                    :disabled-dates='{ weekdays: DoctorWorkdays }'
                    :min-date="minDate"
                    :max-date="maxDate"
                    :popover="{ placement: 'bottom', visibility: 'click' }"
                    @input="handleDateChange"
                >
                  <template v-slot="{ inputValue }">
                    <input
                        class="form-control date-picker"
                        readonly
                        :value="inputValue"
                        :placeholder="formTranslation.appointments.appointment_date_plh"
                    />
                  </template>
                </vc-date-picker>
                <div v-if="submitted && !$v.appointmentFormObj.appointment_start_date.required"
                     class="invalid-feedback">
                  {{formTranslation.appointments.appointment_date_required}}
                </div>
              </div>
              <div class="form-group" v-if="this.getUserRole() !== 'patient' && $route.params.patient_id === undefined && !patient_profile_id">
                <label for="form_patient_id" class="form-control-label">
                  {{formTranslation.common.patient}} <span class="text-danger">*</span>
                <span class="cursor-pointer text-primary small float-right"
                  v-if="(getUserRole() === 'administrator' || getUserRole() === 'clinic_admin' || getUserRole() === 'receptionist' || getUserRole() === 'doctor') && appointmentFormObj.id === undefined && kcCheckPermission('patient_add')">
                    <router-link :to="{ name: 'patient.create',params: { pid: p_uid } }"><i class="fa fa-plus"></i> {{formTranslation.patient.add_patient}}</router-link>
                </span>
                </label>
                <multi-select
                    deselect-label=""
                    select-label=""
                    v-model="appointmentFormObj.patient_id"
                    :disabled="disabledPatientField"
                    :loading="patientMultiselectLoader"
                    :tag-placeholder="formTranslation.appointments.tag_patient_type_plh"
                    id="form_patient_id"
                    :placeholder="formTranslation.appointments.search_plh"
                    label="label" track-by="id" :options="patients"
                ></multi-select>
                <div v-if="submitted && !$v.appointmentFormObj.patient_id.required"
                     class="invalid-feedback">{{formTranslation.appointments.patient_requires}}
                </div>
              </div>
              <div class="form-group" v-if="this.getUserRole() !== 'patient'">
                <label for="status" class="form-control-label">
                  {{formTranslation.common.status}} <span class="text-danger">*</span>
                </label>
                <b-select name="status" v-model="appointmentFormObj.status" id="status" class="form-control">
                  <option value=""> {{formTranslation.appointments.select_status}}</option>
                  <option selected value="1"> {{formTranslation.appointments.booked}}</option>
                  <option value="2"> {{formTranslation.appointments.pending}}</option>
                  <option value="3"> {{formTranslation.appointments.check_out}}</option>
                  <option value="4"> {{formTranslation.appointments.check_in}}</option>
                  <option value="0"> {{formTranslation.appointments.cancelled}}</option>
                </b-select>
                <div
                    v-if="submitted && !$v.appointmentFormObj.status.required"
                    class="invalid-feedback">
                  {{formTranslation.appointments.status_required}}
                </div>
              </div>
              <div class="row" v-if="fileUploadEnable === 'on'">
                <div class="col-md-12" v-if="appointmentFormObj.id === undefined " >
                  <div class="form-group">
                    <!-- <label for="file_multi" class="form-control-label">{{formTranslation.patient.add_medical_report}} </label> -->
                    <h5 class="m-0 mb-3"> {{formTranslation.patient.add_medical_report}} </h5>
                    <div class="input-group kivi-choose-file flex-nowrap">
                      <div class="input-group-prepend flex-shrink-0">
                        <button class="btn btn-primary px-2" type="button" id="appointmentreport" @click.prevent="multiUploadProfile()">{{ formTranslation.common.choose_file }}</button>
                      </div>
                      <label class="input-group-text" for="appointmentreport">{{ upload_appointment_report.length > 0 ? upload_appointment_report.length + ' File selected' :  formTranslation.common.no_file_chosen }}</label>
                    </div>
                  </div>
                </div>
                <div class="col-md-12" v-if="upload_appointment_report.length > 0 && appointmentFormObj.id === undefined ">
                  <div>
                    <h5 class="m-0 mb-3"> {{formTranslation.patient.medical_report}} </h5>
                    <div v-for="(report, index) in upload_appointment_report" :key="index" >
                      <div class="row m-1">
                        <div class="col-md-6">
                          <a variant="outline-primary" v-b-tooltip.hover :title="formTranslation.appointments.view_report" :href="report.url" target="_blank">
                            <i class="fas fa-external-link-alt"></i> {{ report.name }}
                          </a>
                        </div>
                        <div class="col-md-6">
                          <div class="d-flex justify-content-start align-items-center" >
                            <b-button-group size="sm">
                              <b-button variant="outline-danger" v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt" @click="upload_appointment_report.splice(index,1);appointmentData.file.splice(index,1)">
                                <i class="fa fa-trash"></i>
                              </b-button>
                            </b-button-group>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div v-if="appointmentData.appointment_report !== undefined && appointmentData.appointment_report !== null  && appointmentData.appointment_report !== '' && appointmentData.appointment_report.length > 0">
                    <h5 class="m-0 mb-3" v-if="!hideFormBtn"> {{formTranslation.patient.medical_report}} </h5>
                    <div v-for="(report, index) in appointmentData.appointment_report" :key="index" >
                      <div class="row m-1" >
                        <div class="col-md-6">
                          <a variant="outline-primary" v-b-tooltip.hover :title="formTranslation.appointments.view_report" :href="report.url" target="_blank">
                            <i class="fas fa-external-link-alt"></i> {{report.name }}
                          </a>
                        </div>
                        <div class="col-md-6">
                          <div class="float-right" >
                            <b-button-group size="sm">
                              <!--                          <b-button variant="outline-danger" v-b-tooltip.hover title="Delete" @click="deleteAppointmentReport(appointmentData)">-->
                              <!--                            <i class="fa fa-trash"></i>-->
                              <!--                          </b-button>-->

                              <!-- <i class="fa fa-eye"></i> -->
                              <!-- </b-button> -->
                            </b-button-group>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-7">
              <div class="form-group">
                <label class="form-control-label">
                  {{formTranslation.appointments.available_slot}} <span class="text-danger">*</span>
                </label>
                <div class="time-slot" :style=" (getUserRole() !== 'doctor' && getUserRole() !== 'patient' ) ?  'height:  340px;' :  'height:  230px;' ">
                  <div v-if="timeSlots.length !== undefined && timeSlots.length > 0 && appointmentData.appointment_start_date !== null" class="animated fadeIn session_slots">
                    <div v-for="(timeSlot, index) in timeSlots" class="form-group" :key="index" >
                      <label class="form-control-label">
                        {{formTranslation.appointments.session}} {{ index + 1 }}
                      </label>
                      <br>
                      <div class="d-inline" v-for="(slot, subIndex) in timeSlot" :key="subIndex">
                  <span
                      class="badge badge-custom mr-2 mb-2 cursor-pointer badge-danger"
                      v-if="slot.available === false">
                      <del>{{ (slot.time) }}</del>
                  </span>
                        <span
                            v-else
                            class="badge badge-custom mr-2 mb-2 cursor-pointer"
                            :class="(appointmentFormObj.appointment_start_time === slot.time ? 'badge-primary ' : 'badge-outline-primary')"
                            @click="handleTimeChange(slot.time)"
                        >{{ (slot.time) }}</span>
                      </div>
                    </div>
                  </div>
                  <div style="margin: auto" v-else>
                    <p class="text-primary mb-0 small"><b>{{formTranslation.appointments.no_time_slots_found}}</b></p>
                  </div>
                </div>
                <div
                    v-if="submitted && !$v.appointmentFormObj.appointment_start_time.required"
                    class="invalid-feedback">{{formTranslation.appointments.time_slot_required}}
                </div>
              </div>
              <div class="form-group">
                <label for="servicelist" class="form-control-label"> {{formTranslation.widgets.service_detail}} </label>
                <div class=" text-center align-items-center appointment-widget-service-list d-flex align-items-center justify-content-center"  >
                  <div v-if="appointmentData.visit_type !== undefined && appointmentData.visit_type.length > 0">
                    <div v-for="(service, index) in appointmentData.visit_type" :key="index" >
                      <span> <b> {{ service.name  }} </b> </span>
                      <span> {{ ' - ' + (appointmentFormObj.id !== undefined ?  appointmentFormObj.clinic_prefix : '')+ service.charges+(appointmentFormObj.id !== undefined ?  appointmentFormObj.clinic_postfix : '') }} </span>
                    </div>
                  </div>
                  <div v-else>
                    <p class="kivi-text-primary mb-0 small" ><b> {{formTranslation.widgets.no_service_detail_found}}. </b></p>
                  </div>
                </div>
              </div>
              <div class="form-group" v-if="userData.addOns.kiviPro">
                <label for="taxList" class="form-control-label"> {{formTranslation.common.tax}} </label>
                <div class=" text-center align-items-center appointment-widget-service-list d-flex align-items-center justify-content-center"  >
                  <div v-if="taxes !== undefined && taxes.length > 0">
                    <div v-for="(tax, index) in taxes" :key="index" >
                      <span> <b> {{ tax.name  }} </b> </span>
                      <span> {{ ' - ' + userData.clinic_currency_detail.prefix +  tax.charges + userData.clinic_currency_detail.postfix }} </span>
                    </div>
                  </div>
                  <div v-else>
                    <p class="kivi-text-primary mb-0 small" ><b> {{formTranslation.common.no_tax_found}}. </b></p>
                  </div>
                </div>
              </div>
              <div v-if="enableDisableAppointmentDescriptionStatus == 'on'" class="form-group">
                <label for="description" class="form-control-label"> {{formTranslation.appointments.description}} </label>
                <textarea
                    name="description" v-model="appointmentFormObj.description"
                    :placeholder="formTranslation.appointments.appointment_desc_plh" class="form-control"
                    id="description">
                </textarea>
              </div>
            </div>
          </div>
          <div class="row" v-if="userData.addOns.kiviPro == true && showCustomField">
            <div class="col-md-12">
              <!-- Component for the custom fields -->
              <get-custom-fields
                  :key="componentKey"
                  v-if="showCustomField && appointmentFormObj.id == undefined "
                  module_type="appointment_module"
                  :module_id="String( 0)"
                  :doctor_id ="appointmentDoctorId"
                  @bindCustomField="getCustomFieldsValues"
                  :fieldsValue="customFieldsData"
                  @requiredCustomField="getRequireFields"
              ></get-custom-fields>
              <edit-custom-fields
                  :key="componentKey"
                  v-if="showCustomField && appointmentFormObj.id !== undefined"
                  module_type="appointment_module"
                  :module_id="String(appointmentFormObj.id)"
                  @bindCustomField="getCustomFieldsValues"
                  :fieldsValue="customFieldsData"
                  @requiredCustomField="getRequireFields"
              ></edit-custom-fields>
            </div>
          </div>
          <div class="row" v-if="hideFormBtn">
            <div class="col-md-12">
              <div class="d-flex justify-content-end">
                <button v-if="!loading" class="btn btn-primary rtl-ml-2" type="submit" :disabled="!disabledButton">
                  <i class="fa fa-save"></i> {{ formTranslation.appointments.save_btn }}
                </button>
                <button v-else class="btn btn-primary" type="submit" disabled>
                  <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                </button>
                <button type="button" class="btn btn-outline-primary" @click="appointmentCloseForm"> {{formTranslation.common.cancel}}</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <hr class="mt-4 mb-0">
        </div>
      </div>
    </form>
    <ModalPopup
        v-if="appointmentModel"
        modalId="appointment-detail"
        modalSize="lg"
        :openModal="appointmentModel"
        :modalTitle="formTranslation.widgets.summary"
        @closeModal="appointmentModel = false, loading = false;"
        >
        <input type="hidden" value="" id="payment_status_child" />
        <div class="page-loader-section" v-if="overlaySpinner" style="height:unset">
          <loader-component-2></loader-component-2>
        </div>
        <AppointmentDetail
            ref="appointment_detail"
            :appointment-data="appointmentFormObj"
            :user-data="userData" :prefix="prefix" :postfix="postfix" @bookAppointment="bookAppointmentHandle"
            @cancelAppointment="appointmentModel=false, loading = false;" :lazy="true"
        />
    </ModalPopup>
  </div>
</template>

  <script>

    import {required} from "vuelidate/lib/validators";
    import {validateForm} from "../../config/helper";
    import {post, get} from "../../config/request";
    import AppointmentDetail from "./AppointmentDetail";
    import ModalPopup from '../Modal/Index'
    export default {
      components:{
        AppointmentDetail,
        ModalPopup
      },
      props: {
          appointmentData: {
              type: [Object, Array,Date],
              default() {
                  return {}
              }
          },
        patient_profile_id: {
          type :[Number,String],
          default(){
            return ''
          }
        }
      },
      validations: {
          appointmentFormObj: {
              appointment_start_date: {required},
              appointment_start_time: {required},
              visit_type: {required},
              clinic_id: {required},
              doctor_id: {required},
              patient_id: {required},
              status: {required}
          },
      },
      data: () => {
          return {
              formTitle: 'Add appointment',
              buttonText: '<i class="fa fa-save"></i> Save',
              appointmentFormObj: {
                  visit_type: []
              },
              submitted: false,
              doctors: [],
              appointmentModel:false,
              timer:'',
              overlaySpinner:false,
              loading: false,
              appointmentTypes: [],
              showCustomField:false,
              componentKey: 0,
              p_uid:'',
              disabledDoctorField: false,
              disabledServiceField:false,
              disabledPatientField:false,
              disabledClinicField :false,
              DoctorWorkdays:[],
              holiday: {},
              restrictAppointment:{
                pre_book: "0",
                post_book: "365",
                only_same_day_book: "off"
              },
              minDate:new Date(),
              maxDate:new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
              medicalReport:[],
              disabledButton:true,
              postfix:'',
              prefix:'',
              patients:[],
            clinicMultiselectLoader:true,
            doctorMultiselectLoader:true,
            patientMultiselectLoader:true,
            serviceMultiselectLoader:false,
            appointmentTypeMultiselect:true,
            upload_appointment_report:[],
            hideFormBtn: true,
            taxes:[]
          }
      },
      beforeMount() {
        this.getRestrictAppointmentDay();
      },
      mounted() {
          // this.getDoctorsServices();
          if (this.getUserRole() === 'doctor') {
              let doctor_id = this.userData
              this.showCustomField = true;
              this.getDoctorsServices(doctor_id.ID);
              this.clinicChange({ id: this.clinics.id });
          } else if (this.getUserRole() === 'patient') {
            this.appointmentFormObj.patient_id = {
                id: this.userData.ID,
                label: this.userData.display_name
              }
          } else {

            // fatch default selected clinic doctors
            if(this.$store.state.clinic.length > 0) {
              if(this.$store.state.clinic[0].id !== undefined) {
                this.clinicChange({id: this.$store.state.clinic[0].id});
              }
            }
          }
          this.init();
      },
      methods: {

        customDisabledDates(date) {
          console.log("date", date);
          if (this.DoctorWorkdays.includes(date.date.getDay() + 1)) {
              return true;
          }
          if(this.holiday.length > 0){
            let sample = false;
            this.holiday.map(holidays => {
              const fromDate = new Date(holidays.start_date);
              const toDate = new Date(holidays.end_date);
              if (date.date >= fromDate && date.date <= toDate) {
                sample = true;
              }
            })
            return sample;
          }
        },
        init: function () {
            // this.getUniqueId();       
          this.appointmentFormObj.payment_mode = 'paymentOffline';
            if (this.appointmentFormObj.id !== undefined) {
                this.taxes = this.appointmentFormObj.tax
                this.hideFormBtn = this.appointmentFormObj.isEditAble;
                this.formTitle = 'Edit appointment';
                this.buttonText = '<i class="fa fa-save"></i>'+this.formTranslation.common.save;
                this.showCustomField = true;
                this.dispatchTimeSlot()
                this.disabledDoctorField = true;
                this.disabledServiceField = true;
                this.disabledClinicField= true;
                this.disabledPatientField= true;
                 this.clinicMultiselectLoader = false;
                 this.doctorMultiselectLoader=false;
                  this.patientMultiselectLoader=false
                  this.serviceMultiselectLoader=false
                this.getDoctorActiveDays(this.appointmentFormObj.clinic_id.id,this.appointmentFormObj.doctor_id.id);
                //this.minDate = this.appointmentFormObj.appointment_start_date || new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(this.restrictAppointment.pre_book) || 0) ;
                if(this.appointmentFormObj.restrictAppointment.only_same_day_book == 'on'){
                  this.minDate = new Date();
                  this.maxDate = new Date();
                }else{
                  this.minDate = this.appointmentFormObj.appointment_start_date || new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(this.restrictAppointment.pre_book) || 0) ;
                  this.maxDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(this.restrictAppointment.post_book) || 365);
                }

            } else {
              this.appointmentFormObj.status = "1";
              if(this.restrictAppointment.only_same_day_book === 'on'){
                this.minDate = new Date();
                this.maxDate = new Date();
              }else{
                this.minDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(this.restrictAppointment.pre_book) || 0);
                this.maxDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(this.restrictAppointment.post_book) || 365);
                this.appointmentFormObj.appointment_start_date = new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(this.restrictAppointment.pre_book) || 0);
              }
            }

            if (this.getUserRole() !== 'doctor') {
                this.getDoctorDropdown();
            } else {
                this.dispatchTimeSlot()
            }

            setTimeout(() =>{
              if(this.getUserRole() === 'doctor' && this.userData.addOns.kiviPro != true){
                this.getDoctorActiveDays(this.userData.default_clinic,this.userData.ID);
              }
            },3000)

          if(typeof this.$store.state.userDataModule !== undefined
              && typeof this.$store.state.userDataModule.userDropDownData !== undefined
              && this.$store.state.userDataModule.userDropDownData.patients.length > 0){
            this.patientMultiselectLoader = false;
            this.patients = this.$store.state.userDataModule.userDropDownData.patients;
          }else{
            this.$store.dispatch("userDataModule/fetchUserForDropdown", {userRoleName: this.patientRoleName})
            setTimeout(()=>{
              this.patientMultiselectLoader = false;
              this.patients = Object.values(this.$store.state.userDataModule.userDropDownData.patients);
            },3000)
          }
        },
        getRestrictAppointmentDay:function(){
          get("restrict_appointment_edit", {})
            .then((response) => {
              if (
                  response.data.status !== undefined &&
                  response.data.status === true
              ) {
                this.restrictAppointment = response.data.data;
              }
            })
            .catch((error) => {
              console.log(error);
              displayErrorMessage(this.formTranslation.widgets.record_not_found);
            });
        },
        forceRerender() {
        this.componentKey += 1;
        this.showCustomField = true
        },
        clearAppointmentData () {
          this.upload_appointment_report = [];
          // this.appointmentFormObj.appointment_start_date = ''
          this.appointmentFormObj.id !== undefined ? this.appointmentFormObj.id : ""
          // this.appointmentFormObj.clinic_id = ''
          this.appointmentFormObj.doctor_id = ''
          let patient_id = '';
          if(this.$route.params.patient_id !== undefined){
            patient_id = this.$route.params.patient_id
          }else if(this.patient_profile_id){
            patient_id = this.patient_profile_id
          }
          this.appointmentFormObj.patient_id = patient_id
          this.appointmentFormObj.service_id = ''
          this.appointmentFormObj.visit_type = [] ;
          if (this.getUserRole() === 'doctor') {
            this.appointmentFormObj.doctor_id={
              id: this.userData.ID,
              label: this.userData.display_name
            }
            let doctor_id = this.userData
            this.showCustomField = true;
            // this.getDoctorsServices(doctor_id.ID);
          } else if (this.getUserRole() === 'patient') {
            this.appointmentFormObj.patient_id = {
              id: this.userData.ID,
              label: this.userData.display_name
            }
          }
          this.$store.commit('appointmentModule/RESET_TIME_SLOT');
        },
        clinicChange(selectedOption) {
          if (this.getUserRole() !== 'patient') {
            this.patientMultiselectLoader=true;
            get('get_static_data', {
              data_type: 'users',
              user_type: this.patientRoleName,
              request_clinic_id:selectedOption.id
            }).then((response) => {
                  this.patientMultiselectLoader=false;
                  if (response.data.status !== undefined && response.data.status === true) {
                    this.patients = response.data.data
                  }
                }).catch((error) => {
                  this.patientMultiselectLoader=false;
                  console.log(error);
                  displayErrorMessage('Internal server error');
                })
          }
          // reset appointment form data on clinic change
          this.clearAppointmentData();
          
          if (this.getUserRole() === 'doctor') {
              let doctor_id = this.userData
              this.getDoctorsServices(doctor_id.ID);
              this.getDoctorActiveDays(selectedOption.id,1);
          }else{
            this.doctorMultiselectLoader =true;
            get('get_static_data', {
              data_type: 'get_users_by_clinic',
              clinic_id: selectedOption.id,
            })
            .then((response) => {
              this.doctorMultiselectLoader =false;
              if (response.data.status !== undefined && response.data.status === true) {
                this.doctors = response.data.data;
                if(response.data.postfix !== undefined){
                  this.postfix = response.data.postfix
                }
                if(response.data.prefix !== undefined){
                  this.prefix = response.data.prefix
                }
              } else {
                  displayErrorMessage(response.data.message)
              }
            })
            .catch((error) => {
              this.doctorMultiselectLoader =false;
                console.log(error);
                displayErrorMessage(this.formTranslation.common.internal_server_error);
            })
          }
          this.appointment_tax_data();
        },
        dispatchTimeSlot: function () {
          let clinic_id = (this.appointmentFormObj.clinic_id !== undefined && this.appointmentFormObj.clinic_id.id !== undefined ? this.appointmentFormObj.clinic_id.id : this.userData.default_clinic_id );
          this.getTimeSlot({
              date: moment(this.appointmentFormObj.appointment_start_date).format('YYYY-MM-DD'),
              appointment_id: this.appointmentFormObj.id !== undefined ? this.appointmentFormObj.id : "",
              clinic_id: clinic_id,
              doctor_id: this.appointmentFormObj.doctor_id.id,
          })
        },
        appointmentCloseForm(){
          this.upload_appointment_report = [];
          this.$emit('closeAppointmentForm')
          this.appointmentModel = false;
          this.loading = false;
        },
        getTimeSlot: function (data) {
            data.service = this.appointmentFormObj.visit_type
            this.$store.dispatch("appointmentModule/fetchAppointmentSlots", data)
        },
        handleTimeChange: function (time) {
            this.appointmentFormObj.appointment_start_time = time;
        },
        getDoctorDropdown: function () {
             this.doctorMultiselectLoader =true;
            let clinic_id  =  this.appointmentFormObj.clinic_id ;
            if(typeof clinic_id === 'object') {
              clinic_id = this.appointmentFormObj.clinic_id.id
            }
            get('get_static_data', {
                data_type: 'clinic_doctors',
                clinic_id: clinic_id,
                module_type: 'appointment'
            })
            .then((response) => {
              this.doctorMultiselectLoader =false;
              if (response.data.status !== undefined && response.data.status === true) {
                  this.doctors = response.data.data;
                if(response.data.postfix !== undefined){
                  this.postfix = response.data.postfix
                }
                if(response.data.prefix !== undefined){
                  this.prefix = response.data.prefix
                }
              } else {
                  displayErrorMessage(response.data.message)
              }
            })
            .catch((error) => {
              this.doctorMultiselectLoader =false;
                console.log(error);
                displayErrorMessage(this.formTranslation.common.internal_server_error);
            })
        },
        appointmentTypeChangeSelect(selected){
          if(selected.multiple !== undefined && selected.multiple !== '' && selected.multiple == 'no'){
            this.appointmentFormObj.visit_type = [];
            setTimeout(()=>{
              this.appointmentFormObj.visit_type = [];
              this.appointmentFormObj.visit_type.push(selected)
            },1000)
            this.appointmentTypeMultiselect =false;
          }else{
            this.appointmentTypeMultiselect = true;
          }
          setTimeout(()=>{
            this.dispatchTimeSlot()
            this.appointment_tax_data();
          },300)
        },
        appointmentTypeChangeUnselect(selected){
          if(selected.multiple !== undefined && selected.multiple !== '' && selected.multiple == 'no'){
            this.appointmentTypeMultiselect =true;
          }
          setTimeout(()=>{
            this.dispatchTimeSlot()
            this.appointment_tax_data();
          },300)
        },
        handleDoctorChange: function (selectedOption) {
          this.DoctorWorkdays = [];
          let clinic_id = (this.appointmentFormObj.clinic_id !== undefined && this.appointmentFormObj.clinic_id.id !== undefined ? this.appointmentFormObj.clinic_id.id : this.userData.default_clinic_id );
          this.getTimeSlot({
            date: moment(this.appointmentFormObj.appointment_start_date).format('YYYY-MM-DD'),
            appointment_id: this.appointmentFormObj.id !== undefined ? this.appointmentFormObj.id : "",
            clinic_id: clinic_id,
            doctor_id: selectedOption.id,
          })
          this.getDoctorActiveDays(clinic_id,selectedOption.id);
          this.appointmentFormObj.visit_type = [];
          this.getDoctorsServices(selectedOption.id);
          this.forceRerender();
          this.appointment_tax_data();
        },
        getDoctorActiveDays:function (clinic_id,id){
          get('get_doctor_workdays', {
            clinic_id: clinic_id,
            doctor_id: id
          })
              .then((response) => {
                if (response.data.status !== undefined && response.data.status === true) {
                  this.holiday = response.data.holiday;
                  this.DoctorWorkdays = response.data.data;
                }
              })
              .catch((error) => {
                console.log(error);
              })
        },
        handleDateChange:function (selectedOption){
          let clinic_id = (this.appointmentFormObj.clinic_id !== undefined && this.appointmentFormObj.clinic_id.id !== undefined ? this.appointmentFormObj.clinic_id.id : this.userData.default_clinic_id );
          this.getTimeSlot({
            date: moment(selectedOption).format('YYYY-MM-DD'),
            appointment_id: this.appointmentFormObj.id !== undefined ? this.appointmentFormObj.id : "",
            clinic_id: clinic_id,
            doctor_id: this.appointmentFormObj.doctor_id.id,
          })
        },
        handleDoctorUnselect: function (id) {
            this.$store.commit('appointmentModule/RESET_TIME_SLOT');
            this.appointment_tax_data();
        },
        handleFormSubmit: function () {
            this.loading = true;
            this.submitted = true;
            if(this.userData.addOns.kiviPro != true){
              this.appointmentFormObj.clinic_id = (this.appointmentFormObj.clinic_id !== undefined && this.appointmentFormObj.clinic_id.id !== undefined ? this.appointmentFormObj.clinic_id.id : this.userData.default_clinic_id );
            }
            // stop here if form is invalid
            let patient_id = '';
            if(this.$route.params.patient_id !== undefined){
              patient_id = this.$route.params.patient_id
            }else if(this.patient_profile_id){
              patient_id = this.patient_profile_id
            }
            if(patient_id){
              this.appointmentFormObj.patient_id = {
                id:patient_id
              }
            }
            this.$v.$touch();
            if (this.$v.appointmentFormObj.$invalid) {
                this.loading = false;
                return;
            }

            if (this.requiredFields !== undefined && this.requiredFields.length > 0) {
              this.loading = false;
              displayErrorMessage(this.formTranslation.common.all_required_field_validation)
              return;
            }
            if(this.getUserRole() === 'patient'
                && Object.keys(this.userData.all_payment_method).length > 0
                && this.appointmentFormObj.id === undefined)
            {
              this.appointmentData.payment_mode = Object.keys(this.userData.all_payment_method)[0]
              this.loading = false;
              this.appointmentModel = true;
              return;
            }
            if (validateForm("appointmentDataForm")) {
              this.bookAppointmentHandle();              
            }
        },
        bookAppointmentHandle:function(){
          let appointmentData = Object.assign({}, this.appointmentFormObj);
          appointmentData.appointment_start_date = moment(appointmentData.appointment_start_date).format('YYYY-MM-DD');
          appointmentData.tax = this.taxes;
          post('appointment_save', appointmentData)
              .then((response) => {
                this.loading = false;
                if (response.data.status !== undefined && response.data.status === true) {
                  let checkWoocommerceCart = response.data ;
                  if (checkWoocommerceCart.woocommerce_cart_data !== undefined && checkWoocommerceCart.woocommerce_cart_data != null ) {
                    if(checkWoocommerceCart.woocommerce_cart_data.woocommerce_redirect !== undefined) {
                      if(this.appointmentFormObj.payment_mode === 'paymentPaypal'){
                        kiviOpenPaymentWindow(checkWoocommerceCart.woocommerce_cart_data.woocommerce_redirect)
                        this.overlaySpinner = true;
                        this.timer = setInterval(this.checkChildWindow, 500);
                        return;
                      }else{
                        location.href = checkWoocommerceCart.woocommerce_cart_data.woocommerce_redirect ;
                        return;
                      }
                    }
                  } else {
                    if(this.appointmentFormObj.payment_mode === 'paymentRazorpay'){
                      if(response.data.checkout_detail){
                        kivicareCreateRazorpayCheckoutPage(response.data.checkout_detail)
                        this.overlaySpinner = true;
                        this.timer = setInterval(this.checkChildWindow, 500);
                      }else{
                        displayErrorMessage(response.data.message);
                      }
                    }else if(this.appointmentFormObj.payment_mode === 'paymentStripepay'){
                      if(response.data.checkout_detail){
                        kiviOpenPaymentWindow(response.data.checkout_detail.payment_url)
                        this.overlaySpinner = true;
                        this.timer = setInterval(this.checkChildWindow, 500);
                      }else{
                        displayErrorMessage(response.data.message);
                      }
                    }else{
                      displayMessage(response.data.message);
                      this.$store.commit('appointmentModule/RESET_TIME_SLOT');
                      this.$emit('appointmentSaved', response.data.data)
                      if(this.patient_profile_id){
                        this.$store.dispatch("appointmentModule/fetchAppointmentEncounterCount", { id:this.patient_profile_id })
                      }
                      this.overlaySpinner = false;
                      this.appointmentModel = false
                      this.loading = false;
                    }
                  }
                } else {
                  displayErrorMessage(response.data.message)
                  this.overlaySpinner = false;
                  this.appointmentModel = false
                  this.loading = false;
                }
              })
              .catch((error) => {
                this.appointmentModel = false
                console.log(error);
                this.overlaySpinner = false;
                this.loading = false;
                displayErrorMessage(this.formTranslation.common.internal_server_error);
              })
        },
        checkChildWindow(){
          let ele = document.getElementById('payment_status_child');
          if(ele !== null && ele.value !== ''){
            clearInterval(this.timer);
            if(ele.value === 'failed'){
              displayErrorMessage(this.formTranslation.common.payment_transaction_failed);
              this.$refs.appointment_detail.loading = false;
              ele.value = '';
            }else if(ele.value === 'approved'){
              ele.value = '';
              displayMessage(this.formTranslation.common.payment_transaction_saved);
              this.appointmentModel = false;
              this.$store.commit('appointmentModule/RESET_TIME_SLOT');
              this.$emit('appointmentSaved', {})
            }else{
              ele.value = '';
            }
            if(this.patient_profile_id){
              this.$store.dispatch("appointmentModule/fetchAppointmentEncounterCount", { id:this.patient_profile_id })
            }
            this.overlaySpinner = false;
            this.loading = false;
          }
        },
        getDoctorsServices:function (doctorId) {
            this.serviceMultiselectLoader=true;
            this.appointmentTypes = [] ;
            let clinic_id = (this.appointmentFormObj.clinic_id && this.appointmentFormObj.clinic_id.id  ? this.appointmentFormObj.clinic_id.id : this.userData.default_clinic_id );
            get('service_list', { module_type: 'appointment_form', limit: 0, doctor_id: doctorId,clinic_id:clinic_id })
                .then((response) => {
                  this.serviceMultiselectLoader=false;
                    this.appointmentTypes = JSON.parse(JSON.stringify(response.data.data));
                    this.appointmentTypes = response.data.data ;
                    if(this.appointmentTypes.length > 0 && this.appointmentFormObj.id === undefined){
                      this.appointmentFormObj.visit_type.push(this.appointmentTypes[0]);
                      if(this.appointmentTypes[0].multiple !== undefined && this.appointmentTypes[0].multiple == 'no'){
                        this.appointmentTypeMultiselect = false;
                      }
                    }
                  this.dispatchTimeSlot()
                  this.appointment_tax_data()
                })
                .catch((error) => {
                  this.serviceMultiselectLoader=false;
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })
        },
        getCustomFieldsValues: function (fieldsObj) {
          if(!fieldsObj || fieldsObj === undefined){
            return false;
          }

          for (let index = 0; index < this.appointmentFormObj.custom_fields.length; index++) {
            const customFielsElement =  Object.assign({},this.appointmentFormObj.custom_fields[index]);
            const customFielsElementValue = Object.assign({}, fieldsObj) ;
              customFielsElement.field_data = customFielsElementValue['custom_field_' + customFielsElement.id] ;
              this.appointmentFormObj.custom_fields[index] = customFielsElement
          }

          //  previous version dead code 
          // this.appointmentFormObj.custom_fields = fieldsObj;
          this.appointmentFormObj.custom_fields_data = fieldsObj;
          
        },
        getRequireFields: function (validateRequired) {
          this.requiredFields = validateRequired;
        },
        multiUploadProfile:function () {
          let _this = this;
          var custom_uploader = kivicareCustomImageUploader(this.formTranslation,'report',this.userData.addOns.kiviPro == true)

          custom_uploader.on('select', function () {
            var attachment = custom_uploader.state().get('selection').map(item => {
              item.toJSON();
              return item;
            });
            if(_this.appointmentData.file == undefined){
              _this.appointmentData.file = [];
            }
            attachment.map(report => {
              _this.upload_appointment_report.push({name:report.attributes.filename,url:report.attributes.url})
              _this.appointmentData.file.push(report.attributes.id)
            })
          });

          //Open the uploader dialog
          custom_uploader.open();
        },
        appointment_tax_data(){
          if(this.userData.addOns.kiviPro === false){
            return;
          }
          this.taxes = [];
          post('tax_calculated_data',this.appointmentData)
              .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              this.taxes = response.data.data;
              this.appointmentFormObj.tax = response.data.tax_total;
            }
          }).catch((error) => {
            console.log(error);
            displayErrorMessage('Internal server error');
          })
        }
      },
      computed: {
          timeSlots() {
              return this.$store.state.appointmentModule.timeSlots
          },
          // patients() {
          //     return this.$store.state.userDataModule.userDropDownData.patients
          // },
          clinics() {
               this.clinicMultiselectLoader =false
              if(this.$store.state.clinic.length > 0) {
                if(this.appointmentFormObj.id === undefined ){
                  this.appointmentFormObj.clinic_id = this.$store.state.clinic[0]
                  if(this.getUserRole() !== 'doctor'){
                    this.clinicChange(this.$store.state.clinic[0] );
                  }
                  // this.clinicChange(this.$store.state.clinic[0] );
                }
                return this.$store.state.clinic
              } else {
                return [];
              }
          },
          userData() {
            if(this.$store.state.userDataModule !== undefined && this.$store.state.userDataModule.user !== undefined) {
              return this.$store.state.userDataModule.user;
            } else {
              return [];
            }
          },
          teleMedEn() {
              return this.userData.addOns.telemed
          },
          customFieldsData() {
            return (this.appointmentFormObj.custom_fields ? this.appointmentFormObj.custom_fields : []);
          },
          appointmentDoctorId() {
            if(this.appointmentFormObj.doctor_id !== undefined){
              if(typeof this.appointmentFormObj.doctor_id == 'object') {
                return  this.appointmentFormObj.doctor_id.id
              }
              return this.appointmentFormObj.doctor_id
            }
          },
        deleteAppointmentReport:function (appointmentData){
        },
        fileUploadEnable(){
          return this.$store.state.appointmentModule.file_upload_status
        },
        enableDisableAppointmentDescriptionStatus(){
          return this.$store.state.appointmentModule.description_status
        }
      },
      watch: {
        appointmentData(val) {
          this.submitted = false;
          this.appointmentFormObj = val;
          this.init()
          }     
        }
    }
</script>
<style scoped>
.appointment-widget-service-list{
  border: 1px solid #d0cece;
  padding: 10px 12px;
  border-radius: 0.25rem;
}
.badge{
  text-transform: unset !important;
}
</style>