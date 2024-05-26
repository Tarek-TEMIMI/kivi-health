<template>
    <b-row>
        <b-col sm="12">
            <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
                <template v-slot:header>
                    <b-row>
                        <b-col sm="12" md="8" lg="8">
                            <h3 class="mb-0">{{formTranslation.patient_encounter.prescription}}</h3>
                        </b-col>
                        <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('prescription_add')">
                            <div class="float-right">
                                
                                <router-link class="btn btn-sm btn-primary"
                                             :to="{ name: 'prescription.create', params: { encounter_id: encounter_id } }">
                                    <i class="fa fa-plus"></i> {{formTranslation.patient_encounter.add_prescription}}
                                </router-link>
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
                                :head-variant="'light'"
                                :per-page="paginate.perPage"
                                :current-page="paginate.currentPage"
                                :items="prescriptionList.data"
                                :fields="prescriptionList.field"
                            >

                                <template v-slot:cell(index)="data">
                                    {{ data.index + 1 }}
                                </template>

                                <template v-slot:cell(created_at)="row">
                                    {{ row.item.created_at | dateFormat  }}
                                </template>

                                <template v-slot:cell(actions)="data">
                                    <div class="btn-group">

                                        <router-link
                                            v-b-tooltip.hover
                                            :title="formTranslation.common.edit"
                                            class="btn btn-sm btn-outline-primary" v-if="kcCheckPermission('prescription_edit')" :to="{ name: 'prescription.edit', params: { id: data.item.id } }">
                                            <i class="fa fa-pen-alt"></i>
                                        </router-link>

                                        <router-link
                                            v-b-tooltip.hover
                                            :title="formTranslation.clinic_schedule.dt_lbl_dlt"
                                            class="btn btn-outline-danger btn-sm"
                                            v-if="kcCheckPermission('prescription_delete')"
                                            :to="{ name: 'prescription_delete', params: { encounter_id: data.item.id } }"
                                            @click="deletePrescriptionData(data.index + 1)"
                                        >
                                            <i class="fa fa-trash"></i>

                                        </router-link>

                                    </div>
                                </template>

                            </b-table>
                        </div>

                    </b-col>

                </b-row>

                <b-row class="justify-content-end">

                    <b-col sm="7" md="2" class="my-1">
                        <b-pagination
                            v-model="paginate.currentPage"
                            :total-rows="paginate.totalRows"
                            :per-page="paginate.perPage"
                            size="sm"
                            class="my-0"
                        ></b-pagination>
                    </b-col>

                </b-row>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import {post,get} from "../../config/request";

export default {
    data: () => {
        return {
            prescriptionList: [],
            encounter_id: 0,
            paginate: {
                currentPage: 1,
                perPage: 2,
                totalRows: 10
            }
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init: function () {
            this.prescriptionList = this.defaultPrescriptionList();
            if (this.$route.params.encounter_id !== undefined) {
                this.encounter_id = this.$route.params.encounter_id ;
                this.getPrescriptionList() ;
            }
        },
        deletePrescriptionData: function (index) {
            if (this.prescriptionList.data[index - 1] !== undefined) {

                $.confirm({
                    title: this.formTranslation.clinic_schedule.dt_are_you_sure,
                    content: this.formTranslation.common.py_delete,
                    type: 'red',
                    buttons: {
                        ok: {
                            text:this.formTranslation.common.yes,
                            btnClass: 'btn-danger',
                            keys: ['enter'],
                            action: () => {
                                get('prescription_delete', {
                                    id: this.prescriptionList.data[index - 1].id
                                })
                                    .then((data) => {
                                        if (data.data.status !== undefined && data.data.status === true) {
                                            this.prescriptionList.data.splice((index - 1), 1);
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
                        cancel:{
                            text:this.formTranslation.common.cancel
                        }
                    }
                });
            }
        },
        defaultPrescriptionList: function () {
            return {
                field:[
                        {
                            key: 'index',
                            label: this.formTranslation.service.dt_lbl_sr,
                            sortable: true,
                            sortDirection: 'desc'
                        },
                        {
                            key: 'title',
                            label: this.formTranslation.common.title,
                            sortable: true,
                            sortDirection: 'desc'
                        },
                        {
                            key: 'notes',
                            label: this.formTranslation.common.notes,
                            sortable: true,
                            sortDirection: 'desc'
                        },
                        {
                            key: 'created_at',
                            label: this.formTranslation.common.dates,
                            sortable: true,
                            sortDirection: 'desc'
                        },
                        {
                            key: 'actions',
                            label: this.formTranslation.common.start_date,
                            sortable: true,
                            sortDirection: 'desc'
                        }
                ],
                data: []
            }
        },
        getPrescriptionList: function () {
            post('prescription_list', {
                encounter_id: this.encounter_id
            })
                .then((data) => {
                    if (data.data.status !== undefined && data.data.status === true) {
                        this.prescriptionList.data = data.data.data
                        this.paginate.totalRows = data.data.total_rows
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })
        }
    },
    computed: {}
}
</script>