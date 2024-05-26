<template>
    <section>
        <div class="row">
            <div class="col-md-12">
                <div v-for="(doctor, index) in doctorList" :key="index">
                    <b-card :align="'left'" :class="'mt-2 ml-2'" >
                        <b-row :class="'mt-3 mb-3'">
                          <b-col sm="2" md="2" lg="2" :class="'text-center'">
                            <img :class="'ml-2 mt-2'" :style="'width:150px !important; height:150px !important; border-radius:100%'" :src="getImageUrl()" alt="Image 1" />
                          </b-col>
                          <b-col sm="7" md="7" lg="7" >
                            <b-row>
                              <b-col sm="12" md="12" lg="12" class="ml-4">
                                <h5 class="m-0"> {{ doctor.display_name }}</h5>
                              </b-col>
                            </b-row>
                            <b-row>
                              <b-col sm="12" md="12" lg="12" class="ml-4 mt-2">
                                <p class="m-0 small">  <b> {{formTranslation.patient_front_widget.specialization}} </b> : <span class="text-muted"> {{ doctor.specialties | specializationFilter }} </span> </p>
                              </b-col>
                            </b-row>
                            <b-row :class="'mt-3 '">
                              <b-col sm="12" md="12" lg="12">
                                <b-col :class="'mt-0'">
                                  <p class="m-0 small"><b> {{formTranslation.appointments.today_appointment}} </b></p>
                                </b-col>
                                <b-col>
                                  <b-button size="lg" variant="outline-dark">9:00 AM</b-button>
                                  <b-button size="lg" variant="outline-dark">10:00 AM</b-button>
                                  <b-button size="lg" variant="outline-dark">11:00 AM</b-button>
                                  <b-button size="lg" variant="outline-dark">12:00 PM</b-button>
                                  <b-button size="lg" variant="outline-dark">13:00 PM</b-button>
                                </b-col>
                              </b-col>
                              <b-col sm="12" md="12" lg="12" :class="'mt-3'">
                                <b-col>
                                  <p class="m-0 small"><b> {{formTranslation.appointments.tomorrow_appointment}} </b></p>
                                </b-col>
                                <b-col>
                                  <b-button size="lg" variant="outline-dark"  @click="getAppointmentTypes">9:00 am</b-button>
                                  <b-button size="lg" variant="outline-dark">10:00 AM</b-button>
                                  <b-button size="lg" variant="outline-dark">11:00 AM</b-button>
                                  <b-button size="lg" variant="outline-dark">12:00 PM</b-button>
                                  <b-button size="lg" variant="outline-dark">13:00 PM</b-button>
                                </b-col>
                              </b-col>
                            </b-row>
                          </b-col>
                          <b-col sm="3" md="3" lg="3">
                              <vc-calendar @dayclick="selectDate($event, doctor)" :class="{ ' is-invalid': submitted && $v.appointmentBookingData.appointment_start_date.$error }" :min-date="new Date()" is-inline is-expanded />
                              <div v-if="submitted && !$v.appointmentBookingData.appointment_start_date" class="invalid-feedback">
                                  {{formTranslation.appointments.appointment_date_required}}
                              </div>
                          </b-col>
                        </b-row>
                        <hr class="mb-4" v-if="doctor.ID === appointmentBookingData.doctor_id" :style="'margin-top: 2.3rem !important;'" />
                        <b-row v-if="doctor.ID === appointmentBookingData.doctor_id">
                            <b-col sm="12" md="12" lg="12" >
                                <b-row>
                                    <b-col sm="12" md="12" lg="12">
                                        <p class="m-0 medium text-center"><b> {{formTranslation.appointments.appointment_booking}} </b></p>
                                    </b-col>
                                </b-row>
                                <b-row :class="'mt-3'">
                                    <b-col sm="12" md="6" lg="6" >
                                        <p class="ml-3" > {{formTranslation.appointments.available_appointments_on}} {{ appointmentBookingData.appointment_start_date }} </p>
                                        <b-button v-for="(appointment, index) in doctorAppointmentList"
                                                  v-bind:class="{ 'btn-strike': !appointment.status   }"
                                                  size="lg"
                                                  :class="{ 'ml-2' : true , 'is-invalid': submitted && $v.appointmentBookingData.appointment_start_time.$error, 'btn-strike': !appointment.status }"
                                                  @click="appointmentBookingData.appointment_start_time = appointment.time"
                                                  :value="appointment.time"
                                                  variant="outline-dark"
                                                  :disabled="!appointment.status"
                                                  :key="index" >
                                            {{ appointment.label }}
                                        </b-button>
                                        <div v-if="submitted && !$v.appointmentBookingData.appointment_start_time" class="invalid-feedback">
                                           {{formTranslation.appointments.appointment_time_required}}
                                        </div>
                                    </b-col>
                                    <b-col sm="12" md="6" lg="6">
                                        <b-form :class="'ml-4'" @submit="onSubmit" @reset="onReset" v-if="true">
                                            <label :for="'appointment-type' + index">{{formTranslation.appointments.appointment_type}}</label>
                                            <b-form-select
                                                :id="'appointment-type' + index" size="md"
                                                v-model="appointmentBookingData.visit_type"
                                                :options="appointmentTypes"
                                                value-field="id"
                                                text-field="label"
                                                :class="{ ' is-invalid': submitted && $v.appointmentBookingData.visit_type.$error }"
                                            ></b-form-select>
                                            <div v-if="submitted && !$v.appointmentBookingData.visit_type.required" class="invalid-feedback">
                                                {{formTranslation.appointments.appointment_visit_type_required}}
                                            </div>
                                            <label :for="'appointment-description-' + index" >{{formTranslation.appointments.appointment_detail}}</label>
                                            <b-form-textarea
                                                :id="'appointment-description-' + index"
                                                :placeholder="formTranslation.appointments.plh_enter_something..."
                                                rows="3"
                                                v-model="appointmentBookingData.description"
                                            ></b-form-textarea>
                                        </b-form>
                                    </b-col>
                                </b-row>
                                <b-row :class="'mt-3'">
                                    <b-col sm="12" md="12" lg="12" :class="'ml-4'">
                                        <b-button size="lg" :class="'float-right mr-4'" @click="onSubmit" :disabled="loading" > {{formTranslation.appointments.save_appointment}}
                                            <b-spinner variant="dark" label="Spinning" v-show="loading" ></b-spinner>
                                        </b-button>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                    </b-card>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

import { post, _getDoctors, _getStaticData, _axios_post, _patientAppointmentBook} from "../../config/request";
import { validateForm } from "../../config/helper";
import { required } from "vuelidate/lib/validators";

export default {
    name: "AppointmentWidget",
    props: ['isLogin'],
    data: () => {
        return {
            submitted: false,
            mainProps: {
                center: true,
                fluidGrow: true,
                blank: true,
                blankColor: '#bbb',
                width: 40,
                height: 25,
                class: ''
            },
            appointmentBookingData: {},
            doctorList: [],
            email: '',
            appointmentType: '',
            appointmentTypes: [],
            doctorAppointmentList: [],
            isPatientLogin: '',
            loading: false
        }
    },
    mounted() {
        this.init()
    },
    validations: {
        appointmentBookingData: {
            appointment_start_date: {required},
            appointment_end_date: '',
            appointment_start_time: {required},
            appointment_end_time: '',
            visit_type: {required},
            clinic_id: '',
            doctor_id: '',
            patient_id: {required},
            description: '',
            status: 1
        }
    },
    filters: {
        specializationFilter: function (value) {
            if (value.length === 0) return
            if (value.length > 1) {
                let resultString = ''
                let count = 0
                let i = 0
                for (i = 0; i < value.length ; i++ ) {
                    if (i === 0) {
                        resultString = value[i].label
                    } else {
                        resultString += ', ' + value[i].label
                    }
                }
                return resultString
            } else {
                return value[0].label
            }
        }
    },
    methods: {
        init: function () {
            this.getDoctorList()
            this.getAppointmentTypes()
            this.getDoctorAppointment()
            this.appointmentBookingData = this.defaultAppointmentBookingData()
            this.checkAuth()
        },
        onSubmit: function () {

            this.loading = true

            this.submitted = true


            // appointment validation checks
            this.$v.$touch();

            if (this.$v.appointmentBookingData.$invalid) {
                this.loading = false;
                return;
            }

            _axios_post( _patientAppointmentBook, this.appointmentBookingData).then((response) => {
                this.loading = false
            }).catch((err) => {
                this.loading = false
                console.log(err)
            })
        },
        onReset: function () {},
        getImageUrl(imageId) {
          const { width, height } = this.mainProps
          return window.pluginBASEURL + '/assets/images/kc-demo-img.png';
        },
        selectDate: function (value, doctor) {
            this.appointmentBookingData = this.defaultAppointmentBookingData()
            this.appointmentBookingData.doctor_id = doctor.ID
            this.appointmentBookingData.appointment_start_date = value.id
            this.appointmentBookingData.clinic_id = doctor.clinic_id
        },
        getDoctorList: function() {
            _getDoctors({})
                .then((response) => {
                  this.doctorList = response.data.data
                })
                .catch((err) => {
                  console.log(err)
                })
        },
        defaultAppointmentBookingData: function () {
            return {
                appointment_start_date: '',
                appointment_end_date: '2020-09-08',
                appointment_start_time: '',
                appointment_end_time: '12:00:00',
                visit_type: '',
                clinic_id: '',
                doctor_id: { id: '2', label: 'Akshay Rathod', timeSlot: '5' },
                patient_id: 4,
                description: '',
                status: 1
            }
        },
        getAppointmentTypes: function () {
            _getStaticData({ data_type: 'static_data_with_label', static_data_type: 'appointment_types' })
                .then((response) => {
                    this.appointmentTypes = response.data.data
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        getDoctorAppointment: function () {
            this.doctorAppointmentList = [
                {
                    id: 1,
                    time: '10:00:00',
                    label: '10:00 AM',
                    status: true
                },
                {
                    id: 1,
                    time: '10:15:00',
                    label: '10:00 AM',
                    status: false
                },
                {
                    id: 1,
                    time: '10:30:00',
                    label: '10:30 AM',
                    status: true

                },
                {
                    id: 1,
                    time: '10:45:00',
                    label: '10:45 AM',
                    status: true
                },
                {
                    id: 1,
                    time: '11:00:00',
                    label: '11:00 AM',
                    status: true
                },
                {
                    id: 1,
                    time: '11:15:00',
                    label: '11:15 AM',
                    status: false
                },
                {
                    id: 1,
                    time: '11:30:00',
                    label: '11:30 AM',
                    status: false
                }
            ]
        },
        checkAuth: function () {
            if(this.isLogin !== '') {
                let alreadyLogin = localStorage.getItem("wp-medical-patient-login-id")
                if(alreadyLogin == undefined || alreadyLogin == null ) {
                    this.appointmentBookingData.patient_id = this.isLogin
                    localStorage.setItem("wp-medical-patient-login-id", this.isLogin)
                }
            }
        }
    },
    watch: {
        doctorAppointmentList: function (value) {
        }
    }
}
</script>

<style scoped>
    .btn-strike {
        text-decoration: line-through;
    }
</style>