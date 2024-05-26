<template>
    <b-row>
        <b-col sm="12">
            <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                <template v-slot:header>
                    <b-row>
                        <div class="col-md-6">
                            <h3 class="mb-0">{{formTranslation.appointments.appointment}}</h3>
                        </div>
                      <div class="col-md-6 d-flex justify-content-end" >
                        <button
                            class="btn btn-sm btn-primary"
                            @click="filterOpenClose"
                            type="button">
                            <span v-if="!filterOpen">
                              <i class="fa fa-plus"></i>{{formTranslation.common.add_filter}}
                            </span>
                            <span v-else>
                              <i class="fa fa-minus"></i>{{formTranslation.common.close_filter}}
                            </span>
                        </button>
                      </div>
                    </b-row>
                  <div v-if="filterOpen">
                    <hr class="mt-2 mb-2">
                    <div class="row">
                      <div class="col-md-3" v-if="getUserRole() !== 'doctor'">
                        <label for="doctors" class="form-control-label">
                          {{formTranslation.patient_encounter.tag_select_doctor}}
                        </label>
                        <multi-select
                            v-model="filterData.doctor_id"
                            @input="updateData"
                            @remove="updateData"
                            deselect-label=""
                            select-label=""
                            :placeholder="formTranslation.patient_encounter.tag_select_doctor"
                            :tag-placeholder="formTranslation.patient_encounter.tag_select_doctor"
                            id="doctors"
                            label="label"
                            track-by="id"
                            :loading="doctorMultiselectLoader"
                            :disabled="doctorMultiselectLoader"
                            :options="doctors"
                            :multiple="true"
                        ></multi-select>
                      </div>
                      <div class="col-md-3" v-if="getUserRole() !== 'patient'">
                        <label for="patient_id" class="form-control-label">
                          {{formTranslation.appointments.select_patient}} <span class="text-danger"></span>
                        </label>
                        <multi-select
                            @input="updateData"
                            @remove="updateData"
                            deselect-label=""
                            select-label=""
                            v-model="filterData.patient_id"
                            id="patient_id"
                            :placeholder="formTranslation.appointments.select_patient"
                            :tag-placeholder="formTranslation.appointments.select_patient"
                            :loading="patientMultiselectLoader"
                            :disabled="patientMultiselectLoader"
                            label="label" track-by="id" :options="patients"
                            :multiple="true"
                        ></multi-select>
                      </div>
                      <div class="col-md-3">
                        <label for="service" class="form-control-label">
                          {{formTranslation.patient_bill.tag_plh_service}}
                        </label>
                        <multi-select
                            @input="updateData"
                            @remove="updateData"
                            v-model="filterData.service"
                            deselect-label=""
                            select-label=""
                            :placeholder="formTranslation.patient_bill.tag_plh_service"
                            :tag-placeholder="formTranslation.patient_bill.tag_plh_service"
                            id="service"
                            label="name"
                            track-by="service_id"
                            :options="allservice"
                            :multiple="true"
                        ></multi-select>
                      </div>
                      <div class="col-md-3">
                        <label for="filter_status" class="form-control-label">
                          {{formTranslation.appointments.select_status}}
                        </label>
                        <multi-select
                            @input="updateData"
                            @remove="updateData"
                            v-model="filterData.status"
                            deselect-label=""
                            select-label=""
                            :placeholder="formTranslation.appointments.select_status"
                            :tag-placeholder="formTranslation.appointments.select_status"
                            id="filter_status"
                            label="label"
                            track-by="value"
                            :options="allStatus"
                            :multiple="true"
                        ></multi-select>
                      </div>
                    </div>
                  </div>
                </template>
                <b-row v-show="calendarLoader">
                    <b-col sm="12">
                        <FullCalendar
                            defaultView="dayGridMonth"
                            ref="appointmentCalendar"
                            :header="headerConfig"
                            :plugins="calendarPlugins"
                            :event-sources="eventSources"
                            :selectable="true"
                            id="kivicare-appointment-calendar"
                            :eventRender="fullcalendarRender"
                            @eventClick="handleEventClick"
                            :fixedWeekCount="false"
                            :eventLimit="2"
                            :eventLimitText="formTranslation.common.more"
                            :eventTimeFormat= "{
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hourCycle: calendarFormat24Hours ? 'h23' : 'h12'
                            }"
                            :dir="userData.theme_mode !== undefined && [true,'true'].includes(userData.theme_mode) ? 'rtl' : 'ltr'"
                            :locale="calenderLang"
                            :buttonText="{today:    this.formTranslation.fullcalendar.today,
                                      month:    this.formTranslation.fullcalendar.month,
                                      week:     this.formTranslation.fullcalendar.week,
                                      day:      this.formTranslation.fullcalendar.day,
                                      list:     'list'
                            }"
                            :schedulerLicenseKey="userData.fullcalendar_key"
                            :firstDay="start_of_week"
                        />
                    </b-col>
                </b-row>
              <div class="page-loader-section" v-if="!calendarLoader">
                <loader-component-2></loader-component-2>
              </div>
            </b-card>
            <ModalPopup
            v-if="appointmentDetailsModel"
            modalId="appointment-details-modal"
            modalSize="md"
            :openModal="appointmentDetailsModel"
            :modalTitle="formTranslation.appointments.appointment_details"
            @closeModal="appointmentDetailsModel=false"
            >
            <div class="row border-bottom p-2">
                    <div class="col-md-6">
                        <p class="mb-0 ">
                            <span class="font-weight-bold">
                                {{ formTranslation.common.date }} : 
                            </span>
                            {{  appointmentDetails.appointment_start_date }}
                        </p>
                    </div>
                    <div class="col-md-6">
                         <p class="mb-0 ">
                            <span class="font-weight-bold">
                                {{ formTranslation.common.time }} : 
                            </span>
                            {{ appointmentDetails.appointment_start_time }}
                        </p>
                    </div>
                </div>
                <div class="row border-bottom p-2">
                    <div class="col-md-6">
                        <p class="mb-0 ">
                            <span class="font-weight-bold">
                                {{formTranslation.common.doctor}} : 
                            </span>
                            {{ appointmentDetails.doctor_id.label }}
                        </p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-0 ">
                            <span class="font-weight-bold">
                                 {{formTranslation.common.patient}} : 
                            </span>
                            {{ appointmentDetails.patient_id.label }}
                        </p>
                    </div>
                </div>
                <div class="row border-bottom p-2">
                    <div class="col-md-6">
                        <p class="mb-0 "> 
                            <span class="font-weight-bold">
                                {{formTranslation.common.clinic}} : 
                            </span>
                            {{ appointmentDetails.clinic_id.label }}
                        </p>
                    </div>
                    <div class="col-md-6" v-if="getUserRole() === 'patient' || !(appointmentDetails.is_edit_able)">
                    <p class="mb-0 font-weight-bold" >
                            <span class="font-weight-bold">
                                {{formTranslation.common.status}} :
                            </span>
                      <span class="text-primary" v-if="appointmentDetails.status == '1'" > {{formTranslation.appointments.booked}}</span>
                      <span class="text-secondary" v-if="appointmentDetails.status == '4'" > {{formTranslation.appointments.check_in}}</span>
                      <span class="text-danger" v-if="appointmentDetails.status  == '0'"> {{formTranslation.appointments.cancelled}}</span>
                       <span class="text-warning" v-if="appointmentDetails.status == '2'"> {{formTranslation.appointments.pending}}</span>
                      <span class="text-success" v-if="appointmentDetails.status == '3'"> {{formTranslation.appointments.completed}}</span>
                    </p>
                  </div>
                </div>
                <div class="row border-bottom p-2">
                  <div class="col-md-12">
                    <p class="mb-0">
                            <span class="font-weight-bold">
                                {{formTranslation.appointments.appointment_type}} :
                            </span>
                      {{ appointmentDetails.visit_type }}
                    </p>
                  </div>
                </div>
                <div class="row border-bottom p-2" v-if="appointmentDetails.description !== null && appointmentDetails.description !== undefined && appointmentDetails.description !== ''">
                    <div class="col-md-12">
                        <p class="mb-0">
                            <span class="font-weight-bold">
                                {{formTranslation.appointments.description}}:
                            </span>
                            {{ appointmentDetails.description }}
                        </p>
                    </div>
                </div>
              <div class="row border-bottom p-2" v-if="appointmentDetails.telemed_service !== undefined && appointmentDetails.telemed_service === true && appointmentDetails.status != '0'">
                <div class="col-12">
                  <p class="mb-0">
                            <span class="font-weight-bold">
                                {{formTranslation.common.telemed_link+ ' '}}
                              <i id="link-copy" :title="formTranslation.settings.click_to_copy" class="fas fa-copy" @click.prevent="copyLink(appointmentDetails.telemed_meeting_link)" @mouseout="copyLinkMouseOut"></i> :
                            </span>
                  </p>
                  <div style="overflow:scroll">
                    <a :href="appointmentDetails.telemed_meeting_link" target="_blank">{{ appointmentDetails.telemed_meeting_link }}</a>
                  </div>
                </div>
              </div>
                <div v-if="getUserRole() != 'patient' && appointmentDetails.is_edit_able" class="row mt-2 p-2">
                        
                        <div class="col-md-12" style="display:flex;">
                            <p class="mb-0 font-weight-bold" >
                                <span class="font-weight-bold">
                                    {{formTranslation.common.status}}
                                </span>
                            </p>
                            <b-select name="status"  v-model="appointmentStatus"  id="app_status" style="width:50% !important; margin-left:3%" class="form-control form-control-sm pt-0 pb-0" :disabled="this.appointmentDetails.less || appointmentDetails.status  == '0' || appointmentDetails.status  == '3'">
                                <option selected> {{formTranslation.appointments.select_status}} </option>
                                <option value="1"> {{formTranslation.appointments.booked}}</option>
                                <option value="2"> {{formTranslation.appointments.pending}}</option>
                                <option value="4" v-if="currentDate === calendarAppointmentFormatDate(appointmentDetails.appointment_start_date)"> {{formTranslation.appointments.check_in}} </option>
                                <option value="3"> {{formTranslation.appointments.completed}} </option>
                                <option value="0"> {{formTranslation.appointments.cancelled}} </option>
                            </b-select>
                        </div>
                </div>
                <div v-if="getUserRole() != 'patient' && appointmentDetails.is_edit_able" class="row mt-4">
                    <div class="col-md-12 d-flex justify-content-end" >
                      <Button
                          type="button" class="btn btn-outline-danger float-right"
                          @click="appointmentDetailsModel=false"
                      > {{formTranslation.common.close}}
                      </Button>
                        <Button type="button" class="btn  aa  btn-outline-primary ml-2" @click="handleStatusUpdate" :disabled="statusChangeLoading" v-if="appointmentDetails.status != '0' && appointmentDetails.status != '3'">
                            {{ statusChangeLoading ? formTranslation.common.loading  : formTranslation.common.save_changes}}
                        </Button>
                    </div>
                </div>
                <input type="text" id="modal-hidden-field" style="opacity:0"/>
          </ModalPopup>
        </b-col>
    </b-row>
</template>

<script>

import FullCalendar from '@fullcalendar/vue'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import {get, post} from '../../config/request';
import {required} from "vuelidate/lib/validators";
import {validateForm} from "../../config/helper";
import appointmentData from '../../store/appointmentData';
import ModalPopup from '../Modal/Index'
export default {
    components: {
        FullCalendar,
        ModalPopup
    },
    validations: {
        appointmentData: {
            appointment_start_date: {required},
            appointment_start_time: {required},
            visit_type: {required},
            clinic_id: {required},
            doctor_id: {required},
            patient_id: {required},
            description: {required},
            status: {required}
        },
    },
    data: () => {

        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        // 15th two months prior
        const minDate = new Date(today)
        minDate.setMonth(minDate.getMonth() - 2)
        minDate.setDate(15)

        return {
            appointmentDetailsModel: false,
            appointmentDetails: {},
            modelTitle: 'Add appointment',
            modelShow: false,
            loading: false,
            submitted: false,
            appointmentData: {},
            timeSlotLoader: false,
            min: minDate,
            clinics: [],
            doctors: [],
            patients: [],
            buttonText: '<i class="fa fa-plus"></i> Create Add',
            appointmentTypes: [],
            calendarPlugins: [resourceTimelinePlugin, dayGridPlugin, interactionPlugin],
            timeSlots: [],
            displayTimeSlots: false,
            headerConfig: {
                left: 'prev,next',
                center: 'title',
                right: 'today dayGridMonth,dayGridDay,dayGridWeek,dayGridList'
            },
            editAppointment: false,
            appointmentStatus: "",
            calenderLang:window.request_data.current_wordpress_lang,
            eventSources: [],
            calendarLoader:false,
          statusChangeLoading:false,
          filterOpen:false,
          calendarFormat24Hours:window.request_data.appointment_time_format !== undefined && window.request_data.appointment_time_format == 'on',
          patientMultiselectLoader:true,
          doctorMultiselectLoader:true,
          serviceMultiselectLoader:true,
          filterData:{
              status:'',
              doctor_id:'',
              patient_id:'',
              service:''
          },
          allStatus: [
            {label:"all", value:'all'},
            {label: "upcoming", value: "1"},
            {label: "completed", value: "3"},
            {label: "cancelled", value: "0"},
            {label: "checkin", value: "4"},
            {label: "pending", value: "2"},
          ],
          allservice:[],
          firstTimeFilterEnable:0,
          start_of_week: 0
        }
    },
    mounted() {
        this.init();
        this.updateData();
      this.allStatus = this.allStatus.map( (item) => {
        if(item.label === 'pending'){
          item.label = this.formTranslation.appointments[item.label];
        }else{
          item.label = this.formTranslation.common[item.label];
        }
        return item;
      })
    },
    methods: {
        updateData(){
            let _this = this;
            _this.calendarLoader = false
            this.eventSources = [
                {
                    events({start, end, timeZone}, callback) {
                        let route_data = {
                          start_date: moment(start).format('YYYY-MM-DD'),
                          end_date:moment(end).format('YYYY-MM-DD')
                        }
                        route_data = {...route_data,..._this.filterData}
                        get('appointment_list', route_data)
                            .then((response) => {
                              _this.calendarLoader = true;
                                if (response.data.status !== undefined && response.data.status === true) {
                                    callback(response.data.data)
                                }else{
                                  callback([])
                                }
                            }).catch((error) => {
                            _this.calendarLoader = true;
                            console.log(error);
                        });
                    },
                }
            ]
        },
        init: function () {
            this.appointmentData = this.defaultAppointmentData();
            this.appointmentDetails = this.defaultAppointmentData(true);

            if (this.getUserRole() === 'doctor') {
                this.appointmentData.doctor_id = {
                    id: this.userData.ID,
                    label: this.userData.display_name
                }
            }
        },
        fullcalendarRender: function(info) {
          if(info.event.extendedProps.telemed_service){
            info.el.querySelector('.fc-title').innerHTML = info.event.title + '<i class="fas fa-video float-right text-primary"> </i>';
          }
          document.querySelectorAll('#kivicare-appointment-calendar .fc-button').forEach((button) => {
            button.classList.add('btn')
            button.classList.add('btn-primary')
          });
          let title = document.querySelector('#kivicare-appointment-calendar .fc-header-toolbar .fc-center h2')
          if(title !== null){
            // title.classList.add('text-primary')
          }
          document.querySelectorAll('#kivicare-appointment-calendar table span:not(.fc-content)').forEach((span) => {
            span.classList.add('text-primary')
          });
        },
        copyLink:function (link){
          $('#link-copy').removeClass();
          $('#link-copy').addClass('fas fa-clipboard');
          const elem = document.getElementById('modal-hidden-field');
          elem.value = link;
          elem.select();
          console.log(elem);
          document.execCommand("copy");
        },
      copyLinkMouseOut(){
        $('#link-copy').removeClass();
        $('#link-copy').addClass('fas fa-copy');
      },
        handleEventClick: function (data) {

            if (!this.kcCheckPermission('appointment_view')) {
                return false;
            }
            let appointment = data.event;
            this.appointmentDetails.id = appointment.id;
            // this.appointmentDetails.appointment_start_date = new Date(appointment.extendedProps.appointment_start_date + ' 00:00');
            this.appointmentDetails.appointment_start_date = appointment.extendedProps.appointment_start_date;
            this.appointmentDetails.appointment_start_time = appointment.extendedProps.appointment_start_time;
            this.appointmentDetails.clinic_id = appointment.extendedProps.clinic_id;
            this.appointmentDetails.patient_id = appointment.extendedProps.patient_id;
            this.appointmentDetails.doctor_id = appointment.extendedProps.doctor_id;
            this.appointmentDetails.visit_type = appointment.extendedProps.all_services;
            this.appointmentDetails.description = appointment.extendedProps.description;
            this.appointmentDetails.status = appointment.extendedProps.status;
            this.appointmentDetails.telemed_service = appointment.extendedProps.telemed_service;
            this.appointmentDetails.telemed_meeting_link = appointment.extendedProps.telemed_meeting_link;
            this.appointmentDetails.is_edit_able = appointment.extendedProps.is_edit_able;
            this.appointmentStatus = String(this.appointmentDetails.status);
            this.appointmentDetailsModel = true;
            var d1 = new Date(appointment.extendedProps.appointment_start_date + ' 00:00');
            d1.setHours(0,0,0,0);
            var d2 = new Date();
            d2.setHours(0,0,0,0);
            this.appointmentDetails.less = d1 < d2;

        },
        defaultAppointmentData: function (details = false) {
            let temp = {
                appointment_start_date: '',
                appointment_start_time: '',
                clinic_id: {},
                patient_id: '',
                doctor_id: '',
                visit_type: '',
                description: '',
                status: 1,
                telemed_service:false,
                telemed_meeting_link:'',
                is_edit_able:false
            };

            if (temp) {
                temp.id = '';
            }

            return temp;
        },
        handleClinicUnselect: function () {
            this.appointmentData.clinic_id = {};
            this.appointmentData.doctor_id = {};
            this.doctors = [];
        },
        handleClinicChange: function (selectedOption, id) {
            this.doctors = [];
            this.appointmentData.doctor_id = {};

            this.resetTimeSlots();

            // get('get_static_data', {
            //     data_type: 'clinic_doctors',
            //     clinic_id: selectedOption.id
            // })
            //     .then((response) => {
            //         if (response.data.status !== undefined && response.data.status === true) {
            //             this.doctors = response.data.data;
            //         } else {
            //             displayErrorMessage(response.data.message)
            //         }
            //
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //         displayErrorMessage(this.formTranslation.common.internal_server_error);
            //     })
        },
        handleTime: function (time) {
            this.appointmentData.appointment_start_time = time;
        },
        handleDayClick: function (day) {

            this.timeSlotLoader = true;
            this.timeSlots = [];
            this.appointmentData.appointment_start_time = "";

            if (this.appointmentData.clinic_id.id !== undefined && this.appointmentData.clinic_id.id !== "" &&
                this.appointmentData.doctor_id.id !== undefined && this.appointmentData.doctor_id.id !== "" &&
                this.appointmentData.patient_id.id !== undefined && this.appointmentData.patient_id.id !== ""
            ) {
                this.getTimeSlots(day.id);
            }
        },
        getTimeSlots: function (date) {
            let reqObj = {
                date: date,
                appointment_id: this.appointmentData.id,
                clinic_id: this.appointmentData.clinic_id.id,
                doctor_id: this.appointmentData.doctor_id.id,
                patient_id: this.appointmentData.patient_id.id,
            };

            get('get_appointment_slots', reqObj)
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        this.timeSlots = response.data.data;
                    } else {
                        displayErrorMessage(response.data.message)
                    }
                    this.timeSlotLoader = false;

                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                    this.timeSlotLoader = false;
                })
        },
        resetTimeSlots: function () {

            if (this.editAppointment === false) {
                this.appointmentData.appointment_start_date = null;
                this.appointmentData.appointment_start_time = "";
                this.timeSlots = [];

                // Display calendar...
                if (this.appointmentData.patient_id !== null &&
                    this.appointmentData.patient_id.id !== undefined &&
                    this.appointmentData.clinic_id !== null &&
                    this.appointmentData.clinic_id.id !== undefined &&
                    this.appointmentData.doctor_id.id !== undefined
                ) {
                    this.displayTimeSlots = true;
                } else {
                    this.displayTimeSlots = false;
                }
            }

        },
       calendarLoading(isLoading, view){
         this.calendarLoader = isLoading;
       },
       calendarAppointmentFormatDate(date) {
         return moment(date).format('YYYY-MM-DD');
       },
      handleStatusUpdate: function () {
            if (this.appointmentStatus !== this.appointmentDetails.status) {
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
                              this.updateAppointmentStatus();
                            }
                        },
                        cancel: {
                            text : this.formTranslation.common.cancel
                        }
                    }
                });
            }else{
              this.updateAppointmentStatus();
            }
      },
      updateAppointmentStatus(){
        this.statusChangeLoading = true;
        get('appointment_update_status', {
          appointment_id: this.appointmentDetails.id,
          appointment_status: this.appointmentStatus
        })
        .then((response) => {
          this.statusChangeLoading = false;
          if (response.data.status !== undefined && response.data.status === true) {
            this.appointmentDetails.status = String(this.appointmentStatus);
            displayMessage(response.data.message);
            this.appointmentDetailsModel =false;
            this.updateData()
          } else {
            displayErrorMessage(response.data.message)
          }
        })
        .catch((error) => {
          this.statusChangeLoading = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
        })
      },
      filterOpenClose(){
        this.firstTimeFilterEnable++;
        this.filterOpen = !this.filterOpen
        if(this.firstTimeFilterEnable === 1){
          if (this.getUserRole() !== 'patient') {
            this.getClinicPatients('')
          }
          if (this.getUserRole() !== 'doctor') {
            this.doctorListDropDown('')
          }
          this.allServiceList();
        }
      },
      doctorListDropDown(clinic_id){
        this.doctorMultiselectLoader = true;
        get('get_static_data', {
          data_type: 'clinic_doctors',
          clinic_id: clinic_id,
          module_type:'appointment_filter'
        })
            .then((response) => {
              this.doctorMultiselectLoader = false;
              if (response.data.status !== undefined && response.data.status === true) {
                this.doctors = response.data.data;
              } else {
                displayErrorMessage(response.data.message)
              }
            })
            .catch((error) => {
              this.doctorMultiselectLoader = false;
              console.log(error);
              displayErrorMessage(this.formTranslation.common.internal_server_error)
            })
      },
      getClinicPatients(clinic_id){
        this.patientMultiselectLoader = true;
        get('get_static_data', {
          data_type: 'users',
          user_type: this.patientRoleName,
          request_clinic_id:clinic_id
        })
            .then((response) => {
              this.patientMultiselectLoader = false;
              if (response.data.status !== undefined && response.data.status === true) {
                this.patients = response.data.data;
              }
            })
            .catch((error) => {
              this.patientMultiselectLoader = false;
              console.log(error);
              displayErrorMessage('Internal server error');
            })
      },
      allServiceList(){
        this.serviceMultiselectLoader = true;
        get('service_list', {
          widgetType: 'phpWidget',
        })
            .then((response) => {
              this.serviceMultiselectLoader = false;
              if (response.data.status !== undefined && response.data.status === true) {
                this.allservice = response.data.data;
              } else {
                displayErrorMessage(response.data.message)
              }
            })
            .catch((error) => {
              this.serviceMultiselectLoader = false;
              console.log(error);
              displayErrorMessage(this.formTranslation.common.internal_server_error)
            })
      }
    },
    watch: {
        modelShow: function () {
            if (this.modelShow === false) {
                this.displayTimeSlots = false;
                this.appointmentData = this.defaultAppointmentData();
            }
        },

        appointmentDetailsModel: function () {
            if (this.appointmentDetailsModel === false) {
                this.appointmentDetails = this.defaultAppointmentData(true);
            }
        },
        appointment_start_date() {
            if (this.appointmentData.appointment_start_date === null) {
                this.appointmentData.appointment_start_time = ""
            }
        },
        patient_id() {
            this.resetTimeSlots();
        },
        clinic_id() {
            this.resetTimeSlots();
        },
        doctor_id() {
            this.resetTimeSlots();
        },
    },
    computed: {
        patient_id() {
            return this.appointmentData.patient_id;
        },
        clinic_id() {
            return this.appointmentData.clinic_id;
        },
        doctor_id() {
            return this.appointmentData.doctor_id;
        },
        appointment_start_date() {
            return this.appointmentData.appointment_start_date;
        },
        userData() {
            const user = this.$store.state.userDataModule.user;

            this.start_of_week = user.start_of_week;

            if (this.getUserRole() === 'doctor') {
                this.appointmentData.doctor_id = {
                    id: user.ID,
                    label: user.display_name
                }
            }
            if (this.getUserRole() === 'patient') {
                this.appointmentData.patient_id = {
                    id: user.ID,
                    label: user.display_name
                }
            }
            return user;
        },
       currentDate() {
         return moment().format('YYYY-MM-DD');
       }
        // clinicData() {
        //     const clinic =  this.$store.state.userDataModule.clinic;

        //     if (this.getUserRole() === 'doctor') {
        //         this.appointmentData.clinic_id = {
        //             id: clinic.id,
        //             label: clinic.name
        //         }
        //     }
        //     return clinic;
        // },
    }
}

</script>

<style lang='scss'>

@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';

.fc-button {
    text-transform: capitalize;
}

#kivicare-appointment-calendar .fc-today{
  background:#ebe9eb;
}
.fc-toolbar{
    flex-wrap: wrap;
}
</style>
