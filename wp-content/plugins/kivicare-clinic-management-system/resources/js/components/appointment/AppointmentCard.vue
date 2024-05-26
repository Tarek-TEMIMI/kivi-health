<template>
    <div class="row">
        <AppointmentViewCard  :appointmentDetails="appointmentModalData" :appointmentDetailsModel="appointmentDetailModal" v-if="appointmentDetailModal" @closeModal="appointmentDetailModal=false"></AppointmentViewCard>
        <AppointmentReviewCard :appointmentDetails="appointmentReviewData" :appointmentReviewModal="appointmentReviewModal" v-if="appointmentReviewModal" @closeModal="appointmentReviewModal=false"></AppointmentReviewCard>
        <CustomForm :data="appointmentCustomFormData" :viewMode="appointmentCustomFormViewMode" :customFormModal="appointmentCustomFormModal" v-if="appointmentCustomFormModal" @closeModal="appointmentCustomFormModal=false"></CustomForm>
        <div class="col-md-12">
            <div class="row text-uppercase kc-patient">
                <div v-if="(filter_status == 'past' || filter_status == 'all') && enable_delete_multiple == true" class="col-md-1">
                    <b-form-checkbox id="appointment_id_select_all" v-model="selectAll" 
                        class="mt-3 ml-3"
                        @change="allAppointmentSelectCheck()" unchecked-value="0" value="1" 
                        name="appointment_id_select_all" />
                </div>
                <div class="col-md-4">
                    <h5 class="text-muted text-heading pl-2 pt-3 pb-3"> {{formTranslation.patient.patient_name}}</h5>
                </div>
                <div class="col-md-1">
                    <h5 class="text-muted text-heading pt-3 pb-3"> {{formTranslation.common.services}} </h5>
                </div>
                <div class="col-md-1">
                  <h5 class="text-muted text-heading pt-3 pb-3"> {{formTranslation.service.charges}} </h5>
                </div>
                <div  class="col-md-1 text-left pr-3">
                    <h5 class="text-muted text-heading pt-3 pb-3"> {{formTranslation.settings.payment + ' ' +formTranslation.paypal.mode}} </h5>
                </div>
                <div class="col-md-1">
                    <h5 class="text-muted text-heading pt-3 pb-3"> {{formTranslation.common.status}} </h5>
                </div>
                <div v-if="user_data.addOns.kiviPro == true && getUserRole() === 'patient'" class="col-md-2">
                    <h5 class="text-muted text-heading pt-3 pb-3"> {{formTranslation.common.add_to_calender}} </h5>
                </div>
                <div v-else class="col-md-2">
                </div>
                <div v-if="enable_delete_multiple != true" class="col-md-2 text-left pr-4">
                    <h5 class="text-muted text-heading pt-3 pb-3"> {{formTranslation.common.action}} </h5>
                </div>
            </div>
            <div class="page-loader-section" v-if="isLoading">
               <loader-component-2></loader-component-2>
            </div>
            <!-- appointment list -->
            <div class="row kc-appointment-card" v-else>
                <div class="col-md-12" v-if="appointmentList.length > 0" >
                    <div class="accordion" role="tablist">
                        <div class="row" v-for="(appointment, index) in appointmentList" :key="index" >
                            <div class="col-md-12">
                                <div class="row mb-2">
                                    <div class="col-md-12">
                                        <div class="card mt-0 mb-0 p-0 shadow-none shadow--hover animated fadeInUp">
                                            <div class="card-body p-3">
                                                <div class="row">
                                                    <div v-if="(filter_status == 'past' || filter_status == 'all') && enable_delete_multiple == true" class="col-md-1 d-flex align-items-center">
                                                        <b-form-checkbox :id="'appointment_id'+(appointment.id)" 
                                                            class="check" unchecked-value="0" value="1" :name="'appointment_id'+(appointment.id)"
                                                            @change="appointmentSelectCheck(appointment.id)" />
                                                    </div>
                                                    <div class="col-md-4">                  
                                                        <div class="row">   
                                                            <div class="col-md-3 d-flex align-items-center">
                                                                <img v-if="appointment.patient_profile_image != '' && appointment.patient_profile_image != null"
                                                                :src="appointment.patient_profile_image" alt="profile_image" height="70px" width="70px"
                                                                style="border-radius:50%; margin-right:1rem;" />
                                                                <!-- <img v-else :src="imagePreview" alt="profile_image" height="70px" width="70px"
                                                                style="border-radius:50%; margin-right:1rem;" /> -->
                                                                <b-avatar v-else variant="primary" :text="getInitials(appointment.patient_name)" class="mr-3" size="70px"></b-avatar>
                                                            </div>
                                                            <div class="col-md-9">
                                                                <h2 >
                                                                  <span class="small font-weight-bold text-muted">
                                                                    {{  appointment.appointment_start_date }}
                                                                    <i v-if="appointment.video_consultation" class="fas fa-video text-primary" style="margin-left: 5px;"></i>
                                                                  </span>
                                                                </h2>
                                                                <h3 class="text-primary mb-0" v-if="getUserRole() === 'patient'">{{ appointment.patient_name }} <span class="small font-weight-bold text-muted">({{ appointment.appointment_start_time + ' - ' + appointment.appointment_end_time }})</span></h3>
                                                                <h3 class="text-primary mb-0" v-else><a :href="admin_url+'admin.php?page=dashboard#/patient/edit/'+appointment.patient_id.id">{{ appointment.patient_name }}</a> <span class="small font-weight-bold text-muted">({{ appointment.appointment_start_time + ' - ' + appointment.appointment_end_time }})</span></h3>
                                                                <h4 class=" mb-0" v-if="getUserRole() !== 'doctor'"> {{formTranslation.common.doctor}} :  <span class="text-primary"> {{ appointment.doctor_name }}  </span></h4>
                                                                <h4 class=" mb-0" v-if="getUserRole() === 'administrator' || getUserRole() === 'doctor' || getUserRole() === 'patient' "> {{formTranslation.clinic.clinic}} :  <span class="text-primary"> {{ appointment.clinic_name }}  </span></h4>
                                                                <p v-if="appointment.descriptionEnable == 'on'" class="mb-0 small"><b>{{formTranslation.appointments.description}} :</b> {{ appointment.description || formTranslation.common.no_records_found }}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-1 d-flex align-items-center">
                                                        <h5 class="text-muted mb-0"> {{ serviceTypeFormat(appointment.all_services, appointment.visit_type_old) }} </h5>
                                                    </div>
                                                    <div class="col-md-1 d-flex align-items-center">
                                                      <h5 class="text-muted mb-0" v-if="appointment.all_service_charges !== undefined && appointment.all_service_charges != ''" > {{ appointment.clinic_prefix !== undefined ? appointment.clinic_prefix : ''}}{{ appointment.all_service_charges }}{{ appointment.clinic_postfix !== undefined ? appointment.clinic_postfix : '' }} </h5>
                                                      <h5 class="text-muted mb-0" v-else > {{ appointment.clinic_prefix !== undefined ? appointment.clinic_prefix : ''}}{{ ' 0 ' }}{{ appointment.clinic_postfix !== undefined ? appointment.clinic_postfix : '' }} </h5>
                                                    </div>
                                                    <div class="col-md-1 d-flex align-items-center" >
                                                        <h5 class="text-muted mb-0" > {{appointment.payment_mode}} </h5>
                                                    </div>
                                                    <div class="col-md-1 d-flex align-items-center">
                                                        <span class="badge badge-primary" v-if="appointment.status === '1'">{{formTranslation.appointments.booked}}</span>
                                                        <span class="badge badge-danger" v-if="appointment.status === '0'">{{formTranslation.appointments.cancelled}}</span>
                                                        <span class="badge badge-warning" v-if="appointment.status === '2'">{{formTranslation.appointments.pending}}</span>
                                                        <span class="badge badge-secondary" v-if="appointment.status === '4'">{{formTranslation.appointments.check_in}}</span>
                                                        <span class="badge badge-success" v-if="appointment.status === '3'">{{formTranslation.appointments.check_out}}</span>
                                                    </div>
                                                  <div class="col-md-2 d-flex align-items-center" v-if="appointment.status === '1' && user_data.addOns.kiviPro == true && getUserRole() === 'patient' &&  user_data.is_patient_enable == 'on' && appointment.calendar_content !== '' && appointment.calendar_content !== null">
                                                       <addToCalendar :calendar_content="appointment.calendar_content">
                                                       </addToCalendar>
                                                  </div>
                                                    <div class="col-md-2 d-flex align-items-center" v-else >
                                                        <h5 class="text-muted mb-0" v-if="getUserRole() == 'patient'"> ----- </h5>
                                                    </div>
                                                    <div v-if="enable_delete_multiple != true" class="col-md-2 d-flex align-items-center justify-content-start">
                                                        <div class="row">
                                                            <div class="col-12">
                                                                <b-button-group size="sm">
                                                                <b-button variant="outline-primary" data-trigger="hover" :title="formTranslation.common.view" v-if="kcCheckPermission('appointment_view')" @click="appointmentModalData = appointment;appointmentDetailModal=true;" >
                                                                    <i class="fa fa-eye"></i>
                                                                </b-button>
                                                                <b-button variant="outline-primary" data-trigger="hover" :title="formTranslation.common.edit" :disabled="!appointment.isEditAble" v-if="!(['3','4','0'].includes(appointment.status)) && appointment.isEditAble && kcCheckPermission('appointment_edit')" @click="handleAppointmentEdit(appointment, 'accordion_' + index)" >
                                                                    <i class="fa fa-edit"></i>
                                                                </b-button>
                                                                <b-button variant="outline-info " :id="'appointment_print_' + appointment.id" data-trigger="hover" :title="formTranslation.widget_setting.print" @click="handleAppointmentPrint(appointment.id)" >
                                                                    <i class="fa fa-print"></i>
                                                                </b-button>
                                                                <b-button variant="outline-primary" data-trigger="hover" :title="formTranslation.patient_encounter.encounter_details" v-if="appointment.encounter_id !== null && appointment.status ==4 " :to="{ name: 'patient-encounter.dashboard', params: { encounter_id: appointment.encounter_id } }">
                                                                    <i class="fa fa-tachometer-alt"></i>
                                                                </b-button>
                                                                <a :href="appointment.zoom_data !== null ? appointment.zoom_data.start_url : '#'" target="_blank"
                                                                data-trigger="hover" :title="formTranslation.appointments.start_video_call"
                                                                   class="btn btn-sm btn-outline-primary" 
                                                                   v-if="
                                                                    (getUserRole() === 'doctor' || getUserRole() === 'clinic_admin' || getUserRole() === 'administrator') &&
                                                                    appointment.video_consultation &&
                                                                    ['4','1'].includes(appointment.status) &&
                                                                    currentDate === appointment.appointment_end_date">
                                                                    <i class="fa fa-video"></i> {{formTranslation.appointments.start}}
                                                                </a>
                                                                <a :href="appointment.zoom_data !== null ? appointment.zoom_data.join_url : '#'"
                                                                data-trigger="hover" :title="formTranslation.appointments.join_video_call"
                                                                    target="_blank" class="btn btn-sm btn-outline-primary" v-if="
                                                                    getUserRole() === 'patient' &&
                                                                    appointment.video_consultation &&
                                                                    ['4','1'].includes(appointment.status) &&
                                                                    currentDate === appointment.appointment_end_date">
                                                                    <i class="fa fa-video"></i> {{formTranslation.appointments.join}}
                                                                </a>
                                                            </b-button-group>
                                                            </div>
                                                            <div class="col-12 mt-1">
                                                                <b-button-group size="sm">
                                                                <b-button :id ="'status_update_'+ appointment.id" variant="outline-primary" data-trigger="hover" :title="formTranslation.appointments.check_in" v-if="kcCheckPermission('patient_appointment_status_change') && !(['3','4','0','2'].includes(appointment.status))  && currentDate === appointment.appointment_end_date" @click="handleAppointmentStatus(appointment, '4')">
                                                                    <i class="fa fa-sign-in-alt"></i> {{formTranslation.appointments.check_in}}
                                                                </b-button>
                                                                <b-button :id ="'status_update_'+ appointment.id" variant="outline-danger" data-trigger="hover" :title="formTranslation.appointments.check_out" v-if="kcCheckPermission('patient_appointment_status_change') && appointment.status === '4' && currentDate === appointment.appointment_end_date" @click="handleAppointmentStatus(appointment, '3')">
                                                                    <i class="fa fa-sign-out-alt"></i> {{formTranslation.appointments.check_out}}
                                                                </b-button>
                                                                  <b-button  :id ="'status_update_'+ appointment.id" variant="outline-primary" data-trigger="hover" :title="formTranslation.appointments.booked" v-if="kcCheckPermission('patient_appointment_status_change') && appointment.status === '2' && currentDate === appointment.appointment_end_date" @click="handleAppointmentStatus(appointment, '1')">
                                                                    <i class="fa fa-sign-in-alt"></i> {{formTranslation.appointments.booked}}
                                                                  </b-button>
                                                                <button v-if=" getUserRole() != 'patient' && kcCheckPermission('appointment_add') && appointment.status == '1' && appointment.video_consultation " data-trigger="hover" :title="formTranslation.appointments.resend_video_conference_link"
                                                                    :id ="'resend_'+ appointment.id"
                                                                    class="btn btn-outline-warning btn-sm"
                                                                    @click="resendRequest(appointment.id)"> <i class="fa fa-paper-plane" aria-hidden="true"></i>
                                                                </button>
                                                                <b-button variant="outline-primary" v-for="(custom_form_data,key) in appointment.custom_forms" :key="key" 
                                                                v-if="user_data.addOns.kiviPro == true && appointment.custom_forms && appointment.custom_forms.length && custom_form_data.appointment_status.includes(appointment.status) && (custom_form_data.clinic_ids.length === 0 || custom_form_data.clinic_ids.includes(appointment.clinic_id.id))" data-trigger="hover" 
                                                                :title="custom_form_data.name && custom_form_data.name.text ? custom_form_data.name.text : '' " @click="customFormOpen(custom_form_data,appointment.id,appointment.isEditAble)">
                                                                    <i :class="(custom_form_data.name && custom_form_data.name.icon ? custom_form_data.name.icon : 'fas fa-book-medical')"></i>
                                                                </b-button>  
                                                              <b-button variant="outline-danger" :id="'appointment_delete_' + appointment.id" data-trigger="hover" :title="formTranslation.clinic_schedule.dt_lbl_dlt" v-if="kcCheckPermission('appointment_delete')" @click="handleAppointmentDelete(appointment)">
                                                                <i class="fa fa-trash"></i>
                                                              </b-button>
                                                              <b-button v-if="getUserRole() === 'patient' && appointment.status === '3' && user_data.addOns.kiviPro == true" variant="outline-success" :id="'appointment_reviews_' + appointment.id" data-trigger="hover" :title="formTranslation.appointments.add_review" 
                                                                @click="appointmentReviewData = appointment;appointmentReviewModal=true;">
                                                                <i class="fa fa-star" aria-hidden="true"></i>
                                                              </b-button>
                                                              <b-button variant="outline-warning" data-trigger="hover" :title="formTranslation.appointments.reschedule_appointment" v-if="appointment.status === '1' && kcCheckPermission('appointment_edit') && currentDate > appointment.appointment_end_date" @click="handleAppointmentEdit(appointment, 'accordion_' + index)" >
                                                                <i class="fa fa-calendar" aria-hidden="true"></i>
                                                              </b-button>
                                                            </b-button-group>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- edit appointment collapse  -->
                                                <b-collapse :id="'accordion_' + index" accordion="my-accordion" role="tabpanel">
                                                    <div class="mb-4 border-top mt-3"> 
                                                        <AppointmentForm  
                                                            v-if="editId === appointment.id"
                                                            :appointmentData="appointmentFormObj"
                                                            @appointmentSaved="handleAppointmentSave"  
                                                            @closeAppointmentForm="closeAppointmentForm('accordion_' + index)"
                                                            ref="kc_appointment_form"
                                                            :patient_profile_id="patient_profile_id"
                                                        />
                                                    </div>
                                                </b-collapse>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-12" v-else>
                    <h4 class="text-danger text-center mtb-100">{{formTranslation.common.no_appointments}}</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import AppointmentForm from "./AppointmentForm";
import AppointmentViewCard from "./AppointmentViewCard"
import AppointmentReviewCard from "./AppointmentReviewCard"
import CustomForm from "../../views/CustomForm/Form.vue"
import {post, get} from "../../config/request";
import 'print-area-js';
import addToCalendar  from "./addToCalendar";

export default {
    components: { AppointmentForm,AppointmentViewCard,AppointmentReviewCard,addToCalendar,CustomForm},
    props: {
        appointmentData: {
            type: [Object, Array],
            default() {
                return []
            }
        },
        filter_status:{
            type:[String, Number,Object],
            default(){
                return[1]
            }
        },
        enable_delete_multiple:{
            type: [Boolean],
            default() {
                return []
            }
        },
        delete_multiple_appointment:{
            type: [Boolean],
            default() {
                return []
            }
        },
      patient_profile_id: {
        type :[Number,String],
        default(){
          return ''
        }
      }
    },
    data: () => {
        return {
            isLoading:true,
            appointmentList: [],
            patientNumber:[],
            selectAll:false,
            addAppointment: false,
            editAppointment: false,
            appointmentFormObj: {},
            editId: '',
            showCale: false,
            hideFormBtn: false,
            activeAccordianDetail: {
                id: 0, 
                status: false,
                for: 'view'
            },
            admin_url:'',
          appointmentModalData:{},
          appointmentReviewData:{},
          appointmentReviewModal:false,
          appointmentDetailModal:false,
          appointmentCustomFormData:{},
          appointmentCustomFormModal:false,
          appointmentCustomFormViewMode:false,
          restrictAppointment:''
        }
    },
    mounted() {
        this.getRestrictAppointmentDay();
        setTimeout(()=>{
            this.init();
        },1000)

        this.admin_url = window.request_data.adminUrl;
        // watch appointment accordian state
        this.$root.$on('bv::collapse::state', (collapseID, isJustShown) => {
            this.activeAccordianDetail.id = collapseID;
            this.activeAccordianDetail.status = isJustShown;
        })
    },
    methods: {
        init: function () {
            this.appointmentFormObj = this.defaultAppointment()
            setTimeout(() => {
                this.appointmentFormObj.doctor_id = this.doctor_id
                this.appointmentFormObj.clinic_id = this.clinic_id
            }, 500)
        },
        defaultAppointment: function () {
            return {
                id: "",
                date: "",
                endDate: "",
                appointment_start_date: new Date(),
                appointment_start_time: "",
                visit_type: "",
                description: "",
                title: "",
                patient_id: {},
                doctor_id: {},
                clinic_id: {},
                status: "",
                video_consultation: false
            }
        },
        resendRequest: function (id) {
            var element =$('#resend_'+id).find("i");
            element.removeClass('fa fa-paper-plane ')
            element.addClass("fa fa-spinner fa-spin");
            post('resend_zoom_link_patient', {id: id})
                .then((data) => {
                    element.removeClass("fa fa-spinner fa-spin");
                    element.addClass("fa fa-paper-plane")
                    if (data.data.status !== undefined && data.data.status === true) {
                        displayMessage(data.data.message);
                    } else {
                        displayErrorMessage(data.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        addToCalender(){
            this.showCale = true;
        },
        getEncounterDetails: function (appointment){
            return {
                html: true,
                title: () => {
                    // Note this is called only when the popover is opened
                    return 'Hello <b>Popover:</b> ' + appointment.clinic_name
                },
                content: () => {
                    // Note this is called only when the popover is opened
                    return 'The date is:'
                }
            }
        },
        handleAppointmentEdit: function (appointment, collapseID, hideFormBtn = false) {
            // hideFormBtn : view - true, edit - false 
            let isStatusChanges = false ;

            if(hideFormBtn) {
                this.hideFormBtn = false;
                if(this.activeAccordianDetail.for == 'view') {
                    this.$root.$emit('bv::hide::collapse', collapseID);
                    isStatusChanges = true;
                }
                this.activeAccordianDetail.for = 'view';
                // this.$root.$emit('bv::toggle::collapse', collapseID);
            } else {
                this.activeAccordianDetail.for = 'edit';
                if(this.activeAccordianDetail.for == 'edit') { 
                    this.$root.$emit('bv::hide::collapse', collapseID);
                    isStatusChanges = true;
                }
                this.hideFormBtn = true;
            }

            this.editAppointment = true;
            if(isStatusChanges) {
                this.$root.$emit('bv::toggle::collapse', collapseID);
            }

            this.editId = appointment.id
            let editAppointment = Object.assign({},appointment, {restrictAppointment: this.restrictAppointment});
        
            setTimeout(() => {
                editAppointment.appointment_start_date =  new Date(appointment.appointment_start_date +' 00:00');
                this.appointmentFormObj = Object.assign({},editAppointment);
            }, 1000)

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
        handleAppointmentSave: function () {
            this.$emit('closeFilterForm');
            setTimeout(() => {
              this.$store.dispatch("appointmentModule/fetchAppointmentData", { filterData:{ date:moment(new Date()).format('YYYY-MM-DD') ,status : 1} })
            }, 1000)
        },
        closeAppointmentForm: function (id) {
          this.$root.$emit('bv::toggle::collapse', id);
        },
      handleAppointmentDelete: function (appointment) {
        if (appointment.id !== undefined) {
          let but = $('#appointment_delete_' + appointment.id);
          but.prop('disabled', true);
          but.html(`<i class='fa fa-sync fa-spin'> </i>`);
          $.confirm({
            title: this.formTranslation.clinic_schedule.dt_are_you_sure,
            content: this.formTranslation.common.py_delete_appointment,
            type: 'red',
            buttons: {
              ok: {
                text: this.formTranslation.common.yes,
                btnClass: 'btn-danger',
                keys: ['enter'],
                action: () => {
                  get('appointment_delete', {
                    id: appointment.id
                  })
                      .then((data) => {
                        but.prop('disabled', false);
                        but.html(`<i class='fa fa-trash'> </i>`);
                        if (data.data.status !== undefined && data.data.status === true) {
                          displayMessage(data.data.message);
                          this.$store.dispatch("appointmentModule/fetchAppointmentSlots", {
                            date: moment(appointment.appointment_start_date).format('YYYY-MM-DD'),
                            appointment_id: "",
                            clinic_id: appointment.clinic_id.id,
                            doctor_id: appointment.doctor_id.id,
                            patient_id: "",
                          })
                          var index = this.appointmentList.map(x => {
                            return x.id;
                          }).indexOf(appointment.id);
                          this.$store.commit('appointmentModule/DELETE_APPOINTMENT_DATA',{id:index})
                        }
                      })
                      .catch((error) => {
                        but.prop('disabled', false);
                        but.html(`<i class='fa fa-trash'> </i>`);
                        console.log(error);
                        displayErrorMessage(this.formTranslation.common.internal_server_error);
                      })
                }
              },
              cancel: {
                text: this.formTranslation.common.cancel,
                action: () => {
                  but.prop('disabled', false);
                  but.html(`<i class='fa fa-trash'> </i>`);
                }
              }
            }
          });
        }
      },
        handleAppointmentStatus: function (appointment, status) {
          if(status === '3' ){
            if(appointment.encounter_id !== null && appointment.encounter_detail !== undefined
                && [1,'1'].includes(appointment.encounter_detail.status)){
              displayErrorMessage(this.formTranslation.common.encounter_not_close)
                 return ;
            }
          }
          var element =$('#status_update_'+appointment.id).find("i");
          $('#status_update_'+appointment.id).prop('disabled',true)
          if(status === '4'){
            element.removeClass('fa fa-sign-in-alt')
          }else{
            element.removeClass('fa fa-sign-out-alt')
          }
          element.addClass("fa fa-spinner fa-spin");
            $.confirm({
                title: this.formTranslation.clinic_schedule.dt_are_you_sure,
                content: this.formTranslation.common.update_appointment_status,
                type: 'green',
                buttons: {
                    ok: {
                        text: this.formTranslation.common.yes,
                        btnClass: 'btn-primary',
                        keys: ['enter'],
                        action: () => {

                            get('appointment_update_status', {
                                appointment_id: appointment.id,
                                appointment_status: status
                            })
                                .then((response) => {
                                  $('#status_update_'+appointment.id).prop('disabled',false)
                                  element.removeClass("fa fa-spinner fa-spin");
                                  if(status === '4'){
                                    element.addClass('fa fa-sign-in-alt')
                                  }else{
                                    element.addClass('fa fa-sign-out-alt')
                                  }
                                    if (response.data.status !== undefined && response.data.status === true) {
                                        this.$emit('reloadAppointment');
                                        displayMessage(response.data.message);
                                    } else {
                                        displayErrorMessage(response.data.message)
                                    }
                                })
                                .catch((error) => {
                                  $('#status_update_'+appointment.id).prop('disabled',false)
                                  element.removeClass("fa fa-spinner fa-spin");
                                  if(status === '4'){
                                    element.addClass('fa fa-sign-in-alt')
                                  }else{
                                    element.addClass('fa fa-sign-out-alt')
                                  }
                                    console.log(error);
                                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                                })
                        }
                    },
                    cancel: {
                        text: this.formTranslation.common.cancel,
                        action:() =>{
                          $('#status_update_'+appointment.id).prop('disabled',false)
                          element.removeClass("fa fa-spinner fa-spin");
                          if(status === '4'){
                            element.addClass('fa fa-sign-in-alt')
                          }else{
                            element.addClass('fa fa-sign-out-alt')
                          }
                        }
                    }
                }
            });
        },
        serviceTypeFormat: function (newVal, oldVal) {
            if(oldVal === undefined || oldVal === null || oldVal === '') {
              return newVal
            } else {
              return oldVal.replace(/_/g, ' ');
            }
        },
        appointmentSelectCheck(value){
            if(!this.patientNumber.includes(value)){
                this.patientNumber.push(value)
            }else{
                const index = this.patientNumber.indexOf(value);
                if (index > -1) {
                    this.patientNumber.splice(index, 1);
                }
            }
            this.$emit('enabledDeleteBtn',this.patientNumber);
        },
        allAppointmentSelectCheck(){
            var ele=document.getElementsByClassName('custom-control-input');
            if(this.selectAll == 1){
                for(var i=0; i<ele.length; i++){  
                    if(ele[i].type=='checkbox' && ele[i].id !='appointment_id_select_all'){
                        ele[i].checked=true;  
                        this.appointmentSelectCheck(ele[i].id.replace("appointment_id", ""))
                    }  
                }
            }else{  
                for(var i=0; i<ele.length; i++){  
                    if(ele[i].type=='checkbox' && ele[i].id !='appointment_id_select_all')  
                        ele[i].checked=false;  
                        this.appointmentSelectCheck(ele[i].id.replace("appointment_id", ""))     
                    }  
                    this.patientNumber=[]
                    this.$emit('enabledDeleteBtn',this.patientNumber);
            }
 
        },
        deleteMultipleAppointment(){
            $.confirm({
                title: this.formTranslation.clinic_schedule.dt_are_you_sure,
                content: this.formTranslation.common.py_delete_appointment,
                type: 'red',
                buttons: {
                    ok: {
                        text: this.formTranslation.common.yes,
                        btnClass: 'btn-danger',
                        keys: ['enter'],
                        action: () => {
                            post('appointment_multiple_delete', {
                                id: this.patientNumber
                            })
                                .then((data) => {
                                    this.patientNumber=[]
                                    if (data.data.status !== undefined && data.data.status === true) {
                                        this.$emit('reloadMultipleDeleteAppointment');
                                        this.$emit('enabledDeleteBtn',this.patientNumber);
                                        displayMessage(data.data.message);
                                        this.selectAll=0
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                                })
                        }
                    },
                    cancel: {
                      text:this.formTranslation.common.cancel,
                      action: () => {
                         this.$emit('disableMultiDeleteButton')
                      }
                    }
                }
            });
        },
      handleAppointmentPrint(appointmentId) {
        let but = $('#appointment_print_' + appointmentId);
        but.prop('disabled', true);
        but.html(`<i class='fa fa-sync fa-spin'> </i>`);
        get('get_appointment_print', {id: appointmentId})
            .then((response) => {
              if (response.data.status !== undefined && response.data.status === true) {
                $(response.data.data).printArea({});
              }
              setTimeout(() => {
                but.prop('disabled', false);
                but.html(`<i class='fa fa-print'> </i>`);
              }, 1000)
            }).catch((error) => {
          but.prop('disabled', false);
          but.html(`<i class='fa fa-print'> </i>`);
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error);
        })
      },
        getInitials(name) {
            if(name !== undefined && name !== '' && name !== null){
                const patient_name = name.split(" ");
                const initials = patient_name.map(patient_name => patient_name.charAt(0).toUpperCase());
                return initials.join("");
            }else{
                return ' - ';
            }
        },
        customFormOpen(custom_form,id,editAble){
            this.appointmentCustomFormData = custom_form;
            this.appointmentCustomFormData.module_id = id;
            this.appointmentCustomFormModal = true;
            this.appointmentCustomFormViewMode = !editAble;
        }
    },
    computed: {
        clinic_id() {
            const clinic = this.$store.state.userDataModule.clinic;
            return {
                id: clinic.id,
                label: clinic.name
            };
        },
        user_data() {
            return this.$store.state.userDataModule.user
        },
        doctor_id() {
            if (this.getUserRole() === 'doctor') {
                return {
                    id: this.user_data.ID,
                    label: this.user_data.display_name,
                    enableTeleMed: this.user_data.enableTeleMed,
                    timeSlot: this.user_data.timeSlot
                };
            } else {
                return {}
            }
        },
        currentDate() {
            return moment().format('YYYY-MM-DD');
        }
    },
    watch: {
        appointmentData(val, oldVal) {
            this.appointmentList = [];
            this.appointmentList = this.appointmentData;
            this.isLoading = false ;
            this.$emit('updateAppointmentList',this.appointmentList);
            // for (let i=0; i <= val.length; i++) {
            //     let delay = i * 200;
            //     setTimeout(() => {
            //         if (i === (val.length)) {
            //             this.addAppointment = true;
            //         } else {
            //             let checkDuplicate = this.appointmentList.filter((item) => this.appointmentData[i] !== undefined && item.id === this.appointmentData[i].id);
            //             if(checkDuplicate.length === 0) {
            //                 if(this.appointmentData[i] !== undefined) {
            //                     this.appointmentList.push(this.appointmentData[i]);
            //                 }
            //             }
            //         }
            //       if(val.length === i){
            //         this.isLoading = false ;
            //         this.$emit('updateAppointmentList',this.appointmentList);
            //       }
            //     }, delay);
            // }
        },
        enable_delete_multiple(){
            this.selectAll = this.enable_delete_multiple;
        } ,
        delete_multiple_appointment(){
            this.selectAll = this.delete_multiple_appointment != true;
            if(this.delete_multiple_appointment == true){
                this.deleteMultipleAppointment()
            }
        },
        filter_status(){
            this.isLoading = true ;
            this.patientNumber=[];
            this.$emit('enabledDeleteBtn',this.patientNumber);
        }
    },
    filters: {
      serviceFiler: function (value) {
      }
    }
}
</script>
<style scoped>
    .cpt{
        cursor: pointer;
    }
    .custom-control {
        padding-left: 3.75rem !important;
    }
    /* .custom-check-box{
        position: absolute; 
        left: 3.5rem; 
        top: 2.5rem;
    }
    .custom-select-all{
        position: absolute; 
        top: 0.8rem;
        left: 4.4rem;
    }
    @media (max-width: 768px) {
        .custom-check-box{
            left: unset;
            top: 0;
            right: 0;
            z-index: 3;
        }
    }
    .custom-control-label::before{
      border-color: var(--primary);
      border-width: 1px;
    } */
    @media (max-width: 767px) {
        .text-heading {
            display: none;
        }
    }
</style>