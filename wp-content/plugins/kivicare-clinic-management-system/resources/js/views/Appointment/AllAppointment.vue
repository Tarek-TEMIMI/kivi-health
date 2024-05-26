
<template>
    <b-row>
        <b-col sm="12">
            <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
                <template v-slot:header>
                    <b-row>
                        <b-col sm="6" md="4" lg="10">
                            <h3 class="mb-0">{{formTranslation.appointments.appointment_list}}</h3>
                        </b-col>
                        <b-col sm="4" md="2" lg="2">
                            <div class="float-right">
                            </div>
                        </b-col>
                    </b-row>
                </template>
                <b-row>
                    <b-col sm="12" md="12" lg="12">
                        <div class="table-responsive mb-0">
                            <b-table
                                show-empty
                                small
                                stacked="md"
                                :items="appointmentList.data"
                                :fields="appointmentList.fields"
                                :head-variant="'light'"
                            >

                                <template v-slot:cell(index)="data">
                                    {{ data.index + 1 }}
                                </template>

                                <template v-slot:head(doctor_name)="data" :class="'text-center'">
                                    <b-form-input
                                        id="doctor-search-name"
                                        type="text"
                                        v-model="searchDoctorName"
                                        :class="`form-control-sm`"
                                        :placeholder="formTranslation.appointments.plh_doc_name"
                                    ></b-form-input>
                                </template>

                                <template v-slot:head(patient_name)="data" :class="'text-center'">
                                    <b-form-input
                                        id="patient-search-name"
                                        type="text"
                                        v-model="searchPatientName"
                                        :class="`form-control-sm`"
                                        :placeholder="formTranslation.appointments.plh_patient_name"
                                    ></b-form-input>
                                </template>

                                <template v-slot:cell(description)="row">
                                    {{ row.item.description != null && row.item.description.length > 20  ? row.item.description.substring(0,20)+".." : row.item.description }}
                                </template>

                                <template v-slot:cell(status)="row">
                                    <span class="badge badge-primary" v-if="row.item.status === '1'">{{formTranslation.appointments.booked}}</span>
                                    <span class="badge badge-danger" v-if="row.item.status === '0'">{{formTranslation.appointments.cancelled}}</span>
                                    <span class="badge badge-success" v-if="row.item.status === '2'">{{formTranslation.appointments.arrived}}</span>
                                    <span class="badge badge-success" v-if="row.item.status === '4'">{{formTranslation.appointments.check_in}}</span>
                                    <span class="badge badge-success" v-if="row.item.status === '3'">{{formTranslation.appointments.check_in}}</span>
                                </template>

                            </b-table>
                        </div>
                    </b-col>
                </b-row>

                <hr class="my-2">

                <b-row class="justify-content-end">
                    <b-col md="6" class="my-1 mr-2">
                        <b-pagination
                            v-model="paginate.currentPage"
                            :total-rows="paginate.totalRows"
                            :per-page="paginate.perPage"
                            size="sm"
                            @input="getCurrentPage"
                            class="my-0 justify-content-end"
                        ></b-pagination>
                    </b-col>
                </b-row>

            </b-card>
        </b-col>
    </b-row>
</template>

<script>

import {post} from "../../config/request";

export default {
    name: "List",
    data: () => {
        return {
            appointmentList: [],
            appointmentRequest: {},
            paginate: {
                currentPage: 1,
                totalRows: 0,
                perPage: 20
            },
            searchDoctorName: '',
            searchPatientName: ''
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init: function () {
            this.appointmentRequest = this.defaultAppointmentRequest();
            this.getAllAppointment();
            this.appointmentList = this.defaultAppointmentList();
        },
        defaultAppointmentRequest: function () {
            return {
                searchKey: '',
                searchValue: '',
                offset: 0,
                limit: 20
            }
        },
        getAllAppointment: function () {
            post('all-appointment', this.appointmentRequest)
                .then((data) => {

                    if (data.data.status !== undefined && data.data.status === true) {
                        this.appointmentList.data = data.data.data;
                        this.paginate.totalRows = data.data.total_rows;
                    } else {
                        this.appointmentList.data = [];
                        this.paginate.totalRows = 0;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })
        },
        defaultAppointmentList: function () {
            return {
                fields: [
                    {
                        key: 'index',
                        label: this.formTranslation.appointments.dt_lbl_sr,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'appointment_start_date',
                        label: this.formTranslation.appointments.dt_lbl_data
                    },
                    {
                        key: 'appointment_start_time',
                        label: this.formTranslation.appointments.dt_lbl_time
                    },
                    {
                        key: 'patient_name',
                        label: this.formTranslation.appointments.dt_lbl_paient_name
                    },
                    {
                        key: 'doctor_name',
                        label: this.formTranslation.appointments.dt_lbl_doc_name
                    },
                    {
                        key: 'status',
                        label: this.formTranslation.appointments.dt_lbl_status
                    },
                    {
                        key: 'type_label',
                        label: this.formTranslation.appointments.dt_lbl_visi_type
                    },
                    {
                        key: 'description',
                        label: this.formTranslation.appointments.dt_lbl_description
                    },
                    {
                        key: 'actions',
                        label: this.formTranslation.appointments.dt_lbl_action
                    }
                ],
                data: []
            }
        },
        getCurrentPage: function(value) {
            this.appointmentRequest.offset = ( (value - 1) * this.appointmentRequest.limit);
            this.appointmentRequest.limit = 20;
            this.getAllAppointment();
        },
    },
    watch: {
        searchPatientName: function (value) {
            this.appointmentRequest.offset = 0 ;
            this.appointmentRequest.limit = 20 ;
            this.appointmentRequest.searchKey = 'patients.display_name' ;
            this.appointmentRequest.searchValue = value ;
            if(value === '' || value === null) {
                this.appointmentRequest.searchKey = '' ;
            }
            this.getAllAppointment();
        },
        searchDoctorName: function (value) {
            this.appointmentRequest.offset = 0 ;
            this.appointmentRequest.limit = 20 ;
            this.appointmentRequest.searchKey = 'doctors.display_name' ;
            this.appointmentRequest.searchValue = value ;
            if(value === '' || value === null) {
                this.appointmentRequest.searchKey = '' ;
            }
            this.getAllAppointment();
        }
    }
}
</script>

<style scoped>

</style>
