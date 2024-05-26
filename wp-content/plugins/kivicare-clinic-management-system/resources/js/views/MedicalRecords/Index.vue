<template>
    <b-row>
        <b-col sm="12">
            <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
                <template v-slot:header>
                    <b-row>
                        <b-col sm="12" md="8" lg="8">
                            <h3 class="mb-0">{{formTranslation.medical_records.medical_records}}</h3>
                        </b-col>
                        <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('medical_records_add')">
                            <div class="float-right">
                                <router-link class="btn btn-sm btn-primary"
                                             :to="{ name: 'medical-records.create', params: { encounter_id: medicalRecordRequest.encounter_id } }">
                                    <i class="fa fa-plus"></i> {{formTranslation.medical_records.add_medical_problems}}
                                </router-link>
                            </div>
                        </b-col>
                    </b-row>
                </template>
                <b-row>
                    <b-col sm="12" md="12" lg="12">

                        <b-table
                            show-empty
                            small
                            stacked="md"
                            paginate.totalRows
                            :per-page="paginate.perPage"
                            :current-page="paginate.currentPage"
                            :items="medicalRecordList.data"
                            :fields="medicalRecordList.fields"
                            :head-variant="'light'"
                        >

                            <template v-slot:cell(index)="data">
                                {{ data.index + 1 }}
                            </template>

                            <template v-slot:cell(start_date)="row">
                                {{  singleDateFormat(row.item.start_date)  }}
                            </template>

                            <template v-slot:cell(end_date)="row">
                                {{   singleDateFormat(row.item.end_date)  }}
                            </template>

                            <template v-slot:cell(created_at)="row">
                                {{ row.item.created_at | dateFormat  }}
                            </template>

                            <template v-slot:cell(actions)="data">
                                <div class="btn-group">
                                    <router-link v-b-tooltip.hover v-if="kcCheckPermission('medical_records_edit')" class="btn btn-sm btn-outline-primary"
                                                 :to="{ name: 'clinic.edit', params: { id: data.item.id } }">
                                        <i class="fa fa-pen-alt"></i>
                                    </router-link>
                                    <button v-b-tooltip.hover v-if="kcCheckPermission('medical_records_delete')" class="btn btn-outline-danger btn-sm" @click="deleteEncounterData(data.index + 1)"><i
                                        class="fa fa-trash"></i></button>
                                </div>
                            </template>

                        </b-table>

                    </b-col>
                </b-row>

                <b-row class="justify-content-end">
                    <b-col sm="12" md="12" lg="12" class="my-1 justify-content-end">
                        <b-pagination
                            v-model="paginate.currentPage"
                            :total-rows="paginate.totalRows"
                            :per-page="paginate.perPage"
                            size="sm"
                            class="my-0 mr-2"
                        ></b-pagination>
                    </b-col>
                </b-row>

            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import {post} from "../../config/request";
import {initDataTable} from "../../config/plugin";

export default {
    data: () => {
        return {
            medicalRecordList: [],
            medicalRecordRequest: {
                encounter_id: 0,
                searchKey: '',
                searchValue: '',
                offset: 0,
                limit: 3
            },
            encounter_id: 0,
            paginate: {
                currentPage: 1,
                totalRows: 0,
                perPage: 3
            },
            searchName: '',
            searchEmail: ''
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init: function () {

            this.medicalRecordList = this.defaultMedicalRecordList();
            if (this.$route.params.encounter_id !== undefined) {
                this.medicalRecordRequest.encounter_id = this.$route.params.encounter_id
                this.getMedicalRecordList()
            }

        },
        deleteEncounterData: function (index) {
            if (this.medicalRecordList.data[index - 1] !== undefined) {

                $.confirm({
                    title: this.formTranslation.clinic_schedule.dt_are_you_sure,
                    content: this.formTranslation.clinic_schedule.dt_press_dlt,
                    type: 'red',
                    buttons: {
                        ok: {
                            text: this.formTranslation.common.yes,
                            btnClass: 'btn-danger',
                            keys: ['enter'],
                            action: () => {
                                post('medical_records_delete', {
                                    id: this.medicalRecordList.data[index - 1].id
                                })
                                        .then((data) => {
                                            if (data.data.status !== undefined && data.data.status === true) {
                                                this.medicalRecordList.data.splice((index - 1), 1);
                                                displayMessage(data.data.message);
                                            }
                                        })
                                        .catch((error) => {

                                            if (error.response.data !== undefined && error.response.data.message !== undefined) {
                                                displayErrorMessage(error.response.data.message);
                                            } else {
                                                displayErrorMessage(this.formTranslation.common.internal_server_error);
                                            }

                                        })
                            }
                        },
                        cancel: {
                            text:this.formTranslation.common.cancel
                        }
                    }
                });
            }
        },
        defaultMedicalRecordList: function () {
            return {
                fields: [
                    {
                        key: 'index',
                        label: this.formTranslation.medical_records.lbl_sr_no,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'problem_type_label',
                        label: this.formTranslation.medical_records.lbl_problem_type,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'outcome_label',
                        label: this.formTranslation.medical_records.lbl_outcome,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'start_date',
                        label: this.formTranslation.medical_records.lbl_start_date,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'end_date',
                        label: this.formTranslation.medical_records.lbl_end_date,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'description',
                        label: this.formTranslation.medical_records.lbl_desc,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'created_at',
                        label: this.formTranslation.medical_records.lbl_date,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'actions',
                        label: this.formTranslation.medical_records.lbl_action,
                        sortable: true,
                        sortDirection: 'desc'
                    }
                ],
                data:[]
            }
        },
        getMedicalRecordList: function () {
            if(this.medicalRecordRequest.encounter_id != 0) {

                post('medical_records_list', {
                    encounter_id: this.medicalRecordRequest.encounter_id
                })
                    .then((data) => {
                        if (data.data.status !== undefined && data.data.status === true) {
                            this.medicalRecordList.data = data.data.data ;
                            this.paginate.totalRows = data.data.total_rows ;
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        displayErrorMessage(this.formTranslation.common.internal_server_error);
                    })
            } else {
                displayErrorMessage(this.formTranslation.medical_records.medical_record_not_found);
            }
        }
    },
    computed: {

    }
}
</script>