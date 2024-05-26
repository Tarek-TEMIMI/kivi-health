<template>
    <b-row>
        <b-col sm="12">
            <form id="doctorDataForm" @submit.prevent="handleSubmit" :novalidate="true">
                <b-card class="p-0 pb-0 shadow" header-tag="header" footer-tag="footer" no-body>
                    <b-card-header>
                        <b-row>
                            <b-col sm="12" md="8" lg="8">
                                <h3 class="mb-2">{{ cardTitle }}</h3>
                            </b-col>
                        </b-row>
                    </b-card-header>
                    <b-card-body class="pb-0">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="row">
                                    <div class="col-md-12">
                                        <h4 class="text-primary mb-4">{{formTranslation.setup_wizard.add_session_details}}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12">
                                <div class="table-responsive mb-0">
                                    <table class="table table-bordered table-sm text-center custom-table">
                                        <thead class="thead-light">
                                        <tr>
                                            <th>{{formTranslation.common.sr_no}}</th>
                                            <th>{{formTranslation.setup_wizard.session_doctors}}</th>
                                            <th>{{formTranslation.setup_wizard.days}}</th>
                                            <th>{{formTranslation.doctor_session.morning_session}}</th>
                                            <th>{{formTranslation.doctor_session.evening_session}}</th>
                                            <th>{{formTranslation.common.action}}</th>
                                        </tr>
                                        </thead>
                                        <tbody v-if="clinicData.clinic_sessions !== undefined && clinicData.clinic_sessions.length > 0">
                                        <tr v-for="(session, index) in clinicData.clinic_sessions">
                                            <td>{{ ++index }}</td>
                                            <td class="text-capitalize">{{ session.doctors.label }}</td>
                                            <td class="text-capitalize">{{ session.days.join(', ') }}</td>
                                            <td> {{ session.s_one_start_time | timeObjectToString }} {{ ' to ' }} {{ session.s_one_end_time | timeObjectToString }}</td>
                                            <td>
                                            <span v-if="session.s_two_start_time.HH !== '' && session.s_two_end_time.HH !== ''">
                                                {{ session.s_two_start_time | timeObjectToString }} {{' to ' }} {{ session.s_two_end_time | timeObjectToString }}
                                            </span>
                                                <span v-else> - </span>
                                            </td>
                                            <td>
                                                <div class="btn-group">
                                                    <button v-b-tooltip.hover :title="formTranslation.common.edit"  type="button" class="btn btn-outline-primary btn-sm" @click="editSessionData(index)" ><i class="fa fa-pen-alt"></i></button>
                                                    <button v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt" type="button"  class="btn btn-outline-danger btn-sm" @click="deleteSessionData(index)" ><i class="fa fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                        <tbody v-else>
                                        <tr>
                                            <td colspan="6" class="text-center"> {{formTranslation.setup_wizard.no_sessions_found}} </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <hr/>

                        <div class="row">
                            <div class="col-md-12">
                                <h4 class="text-primary mb-4">{{ clinicSessionTitle }}</h4>
                            </div>
                        </div>

                        <div class="row form-group">
                            <label for="clinicSessionDoctor" class="col-md-2 form-control-label">
                                {{formTranslation.common.doctors}} <span class="text-danger">*</span>
                            </label>
                            <div class="col-md-4">
                                <multi-select
                                    deselect-label=""
                                    select-label=""
                                    v-model="clinicSession.doctors"
                                    id="clinicSessionDoctor"
                                    :tag-placeholder="formTranslation.setup_wizard.plh_select_session_doc"
                                    :placeholder="formTranslation.setup_wizard.plh_search"
                                    @select="sessionDoctorsValidation"
                                    @remove="sessionDoctorsValidation"
                                    label="label" track-by="id" :options="doctors"
                                    ></multi-select>
                                <div v-if="sessionSubmitted && !$v.clinicSession.doctors.required"
                                     class="invalid-feedback">{{formTranslation.doctor_session.session_doc_required}}
                                </div>
                                <div v-if="sessionSubmitted && sessionDoctorValidationCheck"
                                     class="invalid-feedback">{{formTranslation.doctor_session.doc_already_added}}
                                </div>
                            </div>
                        </div>

                        <div class="row form-group">

                            <label for="time_slot" class="col-md-2 form-control-label">{{formTranslation.setup_wizard.time_slot_minute}} <span class="text-danger">*</span></label>
                            <div class="col-md-4">
                                <b-select name="time_slot"
                                    id="time_slot"
                                    v-model="clinicSession.time_slot"
                                    class="form-control text-capitalize"
                                    @change="sessionDoctorsValidation"
                                >
                                    <option :value="slot" v-for="slot in time_slots">{{ slot }}</option>
                                </b-select>
                            </div>
                            <div v-if="submitted && !$v.clinicSession.time_slot.required" class="invalid-feedback">
                                 {{formTranslation.appointments.time_slot_required}}
                            </div>
                        </div>

                        <div class="row form-group">
                            <label for="week_days" class="col-md-2 form-control-label">{{formTranslation.common.action}}
                               {{formTranslation.doctor_session.week_days}}<span class="text-danger">*</span>
                            </label>
                            <div class="col-md-8">

                                <div id="check_all_days_form" class="custom-control custom-checkbox d-inline mr-2">
                                    <input class="custom-control-input"
                                           id="check_all_days"
                                           type="checkbox"
                                           name="check_all_days"
                                           v-model="daysAll"
                                           @change="handleAllDaysChecked"
                                           :value="1"
                                    />
                                    <label class="custom-control-label text-capitalize" for="check_all_days" >  {{formTranslation.common.all}} </label>
                                </div>

                                <div id="week_days" v-for="(day, index) in days"
                                     class="custom-control custom-checkbox d-inline mr-2">
                                    <input class="custom-control-input"
                                           :class="{ ' is-invalid': sessionSubmitted && $v.clinicSession.days.$error }"
                                           :id="day + index" type="checkbox" name="days[]" :value="day"
                                           v-model="clinicSession.days"
                                           @change="handleUncheckDays"
                                    />
                                    <label class="custom-control-label text-capitalize" :for="day + index"> {{ day }} </label>
                                </div>

                                <div v-if="sessionSubmitted && !$v.clinicSession.days.required"
                                     class="invalid-feedback mt-2">{{formTranslation.doctor_session.days_required}}
                                </div>

                                <div v-if="weekDaysValidationCheck"
                                     class="invalid-feedback mt-2">{{formTranslation.doctor_session.days_already_exist}}
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="row form-group">
                                    <label for="s_one_start_time" class="col-md-4 form-control-label">
                                       {{formTranslation.doctor_session.morning_session}} <span class="text-danger">*</span>
                                    </label>
                                    <div class="col-md-8">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="s_one_start_time" class="form-control-label">{{formTranslation.setup_wizard.open_time}}</label>
                                                    <vue-timepicker
                                                        auto-scroll
                                                        format="HH:mm"
                                                        id="s_one_start_time"
                                                        :placeholder="formTranslation.setup_wizard.plh_start_time"
                                                        v-model="clinicSession.s_one_start_time"
                                                        :minute-interval="5"
                                                        @change="generateTimeSlotTime"
                                                        close-on-complete
                                                    ></vue-timepicker>
                                                    <div
                                                        v-if="sessionSubmitted && !$v.clinicSession.s_one_start_time.HH.required && !$v.clinicSession.s_one_start_time.mm.required"
                                                        class="invalid-feedback mt-2">{{formTranslation.doctor_session.start_time_required}}
                                                    </div>

                                                    <div
                                                        v-if="sessionSubmitted && !$v.clinicSession.s_one_start_time.maxTime"
                                                        class="invalid-feedback mt-2">{{formTranslation.doctor_session.start_time_smaller_then_end}}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="s_one_end_time" class="form-control-label">{{formTranslation.setup_wizard.close_time}}</label>
                                                    <vue-timepicker
                                                        auto-scroll
                                                        format="HH:mm"
                                                        id="s_one_end_time"
                                                        :placeholder="formTranslation.setup_wizard.plh_end_time"
                                                        :minute-interval="5"
                                                        v-model="clinicSession.s_one_end_time"
                                                        @change="generateTimeSlotTime"
                                                        close-on-complete
                                                    ></vue-timepicker>
                                                    <div
                                                        v-if="sessionSubmitted && !$v.clinicSession.s_one_end_time.HH.required && !$v.clinicSession.s_one_end_time.mm.required"
                                                        class="invalid-feedback mt-2">{{formTranslation.doctor_session.end_time_required}}
                                                    </div>
                                                    <div
                                                        v-if="sessionSubmitted && !$v.clinicSession.s_one_end_time.minTime"
                                                        class="invalid-feedback mt-2">{{formTranslation.doctor_session.end_time_bigger_then_start}}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <label for="s_two_start_time" class="col-md-4 form-control-label">
                                        {{formTranslation.doctor_session.evening_session}} <span class="text-danger">*</span>
                                    </label>
                                    <div class="col-md-8">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="s_two_start_time" class="form-control-label">{{formTranslation.setup_wizard.open_time}}</label>
                                                    <vue-timepicker
                                                        id="s_two_start_time"
                                                        auto-scroll
                                                        format="HH:mm"
                                                        @change="generateTimeSlotTime"
                                                        :placeholder="formTranslation.setup_wizard.plh_start_time"
                                                        :minute-interval="5"
                                                        v-model="clinicSession.s_two_start_time"
                                                        close-on-complete
                                                    ></vue-timepicker>

                                                    <div
                                                        v-if="sessionSubmitted && !$v.clinicSession.s_two_start_time.minTime"
                                                        class="invalid-feedback mt-2">{{formTranslation.doctor_session.start_time_smaller_then_first_session_end_time}}
                                                    </div>
                                                    <div
                                                        v-if="sessionSubmitted && !$v.clinicSession.s_two_start_time.maxTime"
                                                        class="invalid-feedback mt-2">{{formTranslation.doctor_session.start_time_smaller_then_end}}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="s_two_end_time" class="form-control-label">{{formTranslation.setup_wizard.close_time}}</label>
                                                    <vue-timepicker
                                                        auto-scroll
                                                        format="HH:mm"
                                                        id="s_two_end_time"
                                                        @change="generateTimeSlotTime"
                                                        :placeholder="formTranslation.setup_wizard.plh_end_time"
                                                        :minute-interval="5"
                                                        v-model="clinicSession.s_two_end_time"
                                                        close-on-complete
                                                    ></vue-timepicker>

                                                    <div v-if="s_two_end_time_required_validation"
                                                         class="invalid-feedback mt-2">{{formTranslation.doctor_session.end_time_required}}
                                                    </div>

                                                    <div
                                                        v-if="sessionSubmitted && !$v.clinicSession.s_two_end_time.minTime"
                                                        class="invalid-feedback mt-2">{{formTranslation.doctor_session.end_time_bigger_then_start}}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-12">
                                        <label class="form-control-label">{{formTranslation.setup_wizard.session_demo}}</label>
                                        <hr class="my-2">
                                    </div>
                                </div>
                                <div class="row mt-2 session_slots">
                                    <div class="col-md-12">
                                        <div v-if="timeSlots.length !== undefined && timeSlots.length > 0">
                                            <div v-for="(timeSlot, index) in timeSlots" class="form-group">
                                                <label class="form-control-label">
                                                    {{formTranslation.appointments.session}} {{ index + 1 }}
                                                </label>
                                                <br>
                                                <div class="d-inline" v-for="slot in timeSlot">
                                                    <span
                                                        class="badge badge-custom mr-2 mb-2 cursor-pointer badge-danger"
                                                        v-if="slot.isValid === false">
                                                        <del>{{ slot.time }}</del>
                                                    </span>
                                                    <span v-else class="badge badge-custom mr-2 mb-2 cursor-pointer badge-outline-primary"
                                                    >{{ slot.time }}</span>
                                                    <span v-if="slot.isValid === false">
                                                        <br>
                                                        <label class="form-control-label text-danger">{{formTranslation.setup_wizard.invalid_time_slot}}<b>{{ slot.timeSlotDiff }}</b></label>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-else>
                                            <p class="text-primary mb-0 small"><b>{{formTranslation.appointments.no_time_slots_found}}</b></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12 mb-4">
                                <div class="float-right">
                                    <button type="button" class="btn btn-sm btn-primary" @click="addSessionData"
                                            :disabled="weekDaysValidationCheck" v-html="sessionButtonText">
                                    </button>
                                </div>
                            </div>
                        </div>

                    </b-card-body>

                    <b-card-footer :class="`pb-0 mb-3`">
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <button type="button" class="btn btn-primary float-left"
                                        @click="handlePrevClick"
                                        v-if="currentStep.prevStep !== undefined && currentStep.prevStep !== ''"><i class="fa fa-angle-double-left" aria-hidden="true"></i> {{formTranslation.setup_wizard.previous}}Previous
                                </button>
                            </div>
                            <div class="col-md-6 pr-0">
                                <button  @click="handleSubmit" v-if="!loading && (currentStep.nextStep !== undefined && currentStep.nextStep !== '')"
                                         class="btn btn-primary float-right" type="submit"
                                         v-html="nextButtonText"
                                         :disabled="(!(clinicData.clinic_sessions !== undefined && clinicData.clinic_sessions.length > 0))"
                                    ></button>
                                <button v-else class="btn btn-primary float-right" type="submit" disabled>
                                    <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
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
import {post, get} from "../../config/request";
import {numeric, required} from "vuelidate/lib/validators";
import {emailValidate, maxTime, minTime, objToTime, validateForm, validateTimeSlot} from "../../config/helper";

export default {
    name: "setupStep4",
    data: () => {
        return {
            submitted: false,
            cardTitle: 'Clinic session',
            clinicSessionTitle: 'Clinic session ',
            clinicData: {},
            clinicSession: {},
            doctors: [],
            loading: false,
            buttonText: '<i class="fa fa-plus"></i> Add',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            sessionButtonText: '<i class="fa fa-plus"></i> Add session',
            sessionSubmitted: false,
            sessionEdit: false,
            s_two_end_time_required_validation: false,
            weekDaysValidationCheck: false,
            sessionDoctorValidationCheck: false,
            editSessionDataIndex: "",
            nextButtonText: 'Save & Next <i class="fa fa-angle-double-right" aria-hidden="true"></i>',
            timeSlots: {
                sessionOne: [],
                sessionTwo: []
            },
            daysAll: 0,
            time_slots: []
        }
    },
    validations: {
        clinicData: {
            name: {required},
            email: {required,emailValidate},
            telephone_no: {required},
            address: {required},
            city: {required},
            state: {required},
            country: {required},
            postal_code: {required, numeric},
            doctors: {required},
            status: {required}
        },
        clinicSession: {
            doctors: {required},
            days: {required},
            time_slot: {required},
            s_one_start_time: {
                HH: {required},
                mm: {required},
                maxTime: maxTime('s_one_end_time')
            },
            s_one_end_time: {
                HH: {required},
                mm: {required},
                minTime: minTime('s_one_start_time')
            },
            s_two_start_time: {
                minTime: minTime('s_one_end_time'),
                maxTime: maxTime('s_two_end_time')
            },
            s_two_end_time: {
                minTime: minTime('s_two_start_time')
            }
        }
    },
    mounted() {
        this.init()
        // following line is for complete step and enable next button
        this.$emit('can-continue', {value: true});
    },
    methods: {
        init: function () {
            if (this.checkStep.name === 'clinic_session') {
                this.nextButtonText = ' Finish <i class="fa fa-angle-double-right" aria-hidden="true"></i>';
            }
            this.clinicData = this.defaultClinicData();
            this.clinicSession = this.defaultClinicSessionData();
            this.getCurrentStepStatus();
            this.getDoctorsData();
            this.getTimeSlots();
        },
        handleSubmit: function () {
            this.loading = true;
            this.submitted = true;
            post('setup_clinic_session', this.clinicData)
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        displayMessage(response.data.message);
                        this.$store.dispatch('userDataModule/updateSetupStep',this.currentStep).then(() => {
                            if (this.checkStep.name === 'clinic_session') {
                                this.$store.dispatch('userDataModule/finishSetup', {});
                            }
                        });
                    } else {
                        this.loading = false;
                        displayErrorMessage(response.data.message);
                    }
                    this.loading = false;
                    this.submitted = true;
                })
                .catch((error) => {
                    this.loading = false;
                    this.submitted = true;
                    displayErrorMessage('Internal server error');
                })

        },
        defaultClinicData: function () {
            return {
                name: '',
                email: '',
                telephone_no: '',
                address: '',
                city: '',
                state: '',
                country: '',
                postal_code: '',
                status: 1,
                specialties: [],
                doctors: [],
                clinic_sessions: []
            }
        },
        defaultClinicSessionData: function () {
            return {
                doctors: {},
                days: [],
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
        getCurrentStepStatus: function () {
            post('get_setup_step_status', { step: 3 })
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        this.clinicData.clinic_sessions = response.data.data;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage('Internal server error')
                })
        },
        getDoctorsData: function () {
            this.$store.dispatch("userDataModule/fetchDefaultClinic").then(r => {
                get('get_static_data', {
                    data_type: 'clinic_doctors',
                    clinic_id: this.$store.state.userDataModule.clinic.id

                })
                    .then((data) => {
                        if (data.data.status !== undefined && data.data.status === true) {
                            this.doctors = data.data.data;
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        displayErrorMessage('Internal server error');
                    })
            });

        },
        addSessionData: function () {

            this.sessionSubmitted = true;
            this.sessionDoctorValidationCheck = false;

            this.$v.clinicSession.$touch();

            if (this.timeSlots.length === 0) {
                return false;
            }

            if (this.$v.clinicSession.$invalid) {
                return;
            }

            let clinicSessionDoctor = this.clinicSession.doctors.id;
            for (let sessionIndex = 0; sessionIndex < this.clinicData.clinic_sessions.length; sessionIndex++) {
                let doctorsObject = this.clinicData.clinic_sessions[sessionIndex].doctors;
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
                this.clinicData.clinic_sessions.push(this.clinicSession);
            } else {
                this.clinicData.clinic_sessions[this.editSessionDataIndex] = this.clinicSession;
                this.sessionEdit = false;
            }

            this.clinicSessionTitle = 'Add session';
            this.sessionButtonText = '<i class="fa fa-plus"></i> Add session';
            this.clinicSession = this.defaultClinicSessionData();
            this.daysAll = 0 ;
            this.sessionSubmitted = false;
            this.editSessionDataIndex = "";
            this.s_two_end_time_required_validation = false;
        },
        editSessionData: function (index) {
            this.clinicSessionTitle = 'Edit session';
            this.sessionEdit = true;
            this.sessionButtonText = '<i class="fa fa-save"></i> Save session';
            this.editSessionDataIndex = index - 1;
            this.clinicSession = Object.assign( {}, this.clinicData.clinic_sessions[index - 1]);
            if ( this.clinicSession.days.length >= 7 ){
                this.daysAll = 1;
            }else{
                this.daysAll = 0;
            }
            this.generateTimeSlotTime()
        },
        deleteSessionData: function (index) {
            if(this.clinicData.clinic_sessions[index - 1] !== undefined) {
                $.confirm({
                    title: 'Are you sure ?',
                    content: 'Press yes to delete clinic session',
                    type: 'red',
                    buttons: {
                        ok: {
                            text: "Yes",
                            btnClass: 'btn-danger',
                            keys: ['enter'],
                            action: () => {
                                if (this.clinicData.clinic_sessions[index - 1] !== undefined) {
                                    this.clinicData.clinic_sessions.splice((index - 1), 1);
                                    this.clinicSession = this.defaultClinicSessionData();
                                }
                            }
                        },
                        cancel: () => {
                        }
                    }
                });
            } else {
                displayErrorMessage('Session data not found.');
            }
        },
        sessionDoctorsValidation: function (selectedOption) {
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
            for (let i = 0;i < 12; i++) {

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

                    if (moment(newTimeSlot, 'HH:mm').isBefore(sessionOneEndTime)) {
                        let newTimeSlotDiff = Math.abs(timeSlotDiff - timeDiff)
                        // if (parseInt(newTimeSlotDiff) !==  0) {
                        //     temp.isValid = false;
                        // }
                        slots.push(temp);
                    }

                }
            }

            return slots;
        },
        generateTimeSlotTime: function () {
            this.timeSlots = [];
            let time = [
                {startTime: this.clinicSession.s_one_start_time, endTime: this.clinicSession.s_one_end_time},
                {startTime: this.clinicSession.s_two_start_time, endTime: this.clinicSession.s_two_end_time}
            ];

            for (let i = 0; i < (time.length); i++) {

                let slots = this.getTimeSlot(time[i].startTime, time[i].endTime, this.clinicSession.doctors);

                if (slots.length > 0) {
                    this.timeSlots[i] = slots;
                }
            }
        },
        complete: function () {
            this.$emit('can-continue', {value: true});
        },
        handlePrevClick() {
            this.$store.commit('userDataModule/HANDLE_PREV_STEP', this.currentStep);
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
        }
    },
    computed: {
        currentStep() {
            const step = this.$store.state.userDataModule.setups.filter((obj) => {
                return obj.name === 'clinic_session';
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
        doctorSlotTimeLimit () {
            // clinicSession.doctors !== undefined && clinicSession.doctors.timeSlot !== '' && clinicSession.doctors.timeSlot !== 0
            return this.clinicSession.doctors !== undefined && this.clinicSession.doctors !== null  && this.clinicSession.doctors.timeSlot !== undefined && this.clinicSession.doctors.timeSlot !== null ? this.clinicSession.doctors.timeSlot : 0;
        },
    },
    watch: {
    }
}
</script>

<style scoped>

</style>
