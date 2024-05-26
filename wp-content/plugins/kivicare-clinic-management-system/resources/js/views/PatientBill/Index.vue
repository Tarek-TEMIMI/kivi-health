<template>
    <b-row>
        <b-col sm="12">
            <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
                <template v-slot:header>
                    <b-row>
                        <b-col sm="12" md="8" lg="8">
                            <h3 class="mb-0">{{formTranslation.patient_bill.billing_records}}</h3>
                        </b-col>
                        <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('patient_bill_add')">
                            <div class="float-right">
                                <router-link class="btn btn-sm btn-primary"
                                             :to="{ name: 'patient-bill.create' }">
                                    <i class="fa fa-plus"></i> {{formTranslation.patient_bill.add_bill}}
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
                                :items="patientBillList.data"
                                :fields="patientBillList.fields"
                            >

                                <template v-slot:cell(index)="data">
                                    {{ data.index + 1 }}
                                </template>

                                <template v-slot:cell(created_at)="row">
                                    {{ row.item.created_at | dateFormat  }}
                                </template>

                                <template v-slot:cell(status)="row">
                                    <span class="badge badge-success" v-if="row.item.status === '1'"> {{formTranslation.patient_bill.paid}}</span>
                                    <span class="badge badge-danger" v-if="row.item.status === '0'"> {{formTranslation.patient_bill.unpaid}}</span>
                                </template>


                                <template v-slot:cell(actions)="data">

                                    <div class="btn-group">
                                        <router-link class="btn btn-sm btn-outline-primary" v-if="data.item.status === '0' && kcCheckPermission('patient_bill_edit')"
                                                     :to="{ name: 'patient-bill.edit', params: { id: data.item.id } }">
                                            <i class="fa fa-pen-alt"></i>
                                        </router-link>
                                        <router-link v-if="kcCheckPermission('patient_bill_view')" class="btn btn-sm btn-outline-primary"
                                                     :to="{ name: 'patient-bill.details', params: { id: data.item.id } }">
                                            <i class="fa fa-eye"></i>
                                        </router-link>
                                        <button v-if="data.item.status === '0' && kcCheckPermission('patient_bill_edit')" class="btn btn-outline-primary btn-sm" :title="formTranslation.common.update_payment_status_to_paid" @click="updateBillStatus(data.index + 1)"><i
                                            class="fa fa-sync-alt"></i></button>
                                        <button v-if="data.item.status === '0' && kcCheckPermission('patient_bill_delete')" class="btn btn-outline-danger btn-sm" @click="deletePatientBillData(data.index + 1)"><i
                                            class="fa fa-trash"></i></button>
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
import {post} from "../../config/request";
import {initDataTable} from "../../config/plugin";

export default {
    data: () => {
        return {
            patientBillList: {},
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
            this.patientBillList = this.defaultPatientBillData()
            if (this.$route.params.encounter_id !== undefined) {
                this.encounter_id = this.$route.params.encounter_id
                this.getPatientBillData()
            }
        },
        updateBillStatus: function (index) {
            if (this.patientBillList.data[index - 1] !== undefined) {
                $.confirm({
                    title: this.formTranslation.clinic_schedule.dt_are_you_sure,
                    content: this.formTranslation.common.update_system,
                    type: 'green',
                    buttons: {
                        ok: {
                            text: this.formTranslation.common.yes,
                            btnClass: 'btn-primary',
                            keys: ['enter'],
                            action: () => {
                                post('patient_bill_update_status', {
                                    id: this.patientBillList.data[index - 1].id
                                })
                                    .then((data) => {
                                        if (data.data.status !== undefined && data.data.status === true) {
                                            this.init();
                                            displayMessage(data.data.message);
                                        }
                                    })
                                    .catch((error) => {

                                        if (error.response.data !== undefined && error.response.data.message !== undefined) {
                                            displayErrorMessage(error.response.data.message);
                                        } else {
                                            console.log(error.response.data);
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
        deletePatientBillData: function (index) {
            if (this.patientBillList.data[index - 1] !== undefined) {

                $.confirm({
                    title: this.formTranslation.clinic_schedule.dt_are_you_sure,
                    content: this.formTranslation.common.py_delete,
                    type: 'red',
                    buttons: {
                        ok: {
                            text: this.formTranslation.common.yes,
                            btnClass: 'btn-danger',
                            keys: ['enter'],
                            action: () => {
                                post('patient_bill_delete', {
                                    id: this.patientBillList.data[index - 1].id
                                })
                                        .then((data) => {
                                            if (data.data.status !== undefined && data.data.status === true) {
                                                this.patientBillList.data.splice((index - 1), 1);
                                                displayMessage(data.data.message);
                                            }
                                        })
                                        .catch((error) => {

                                            if (error.response.data !== undefined && error.response.data.message !== undefined) {
                                                displayErrorMessage(error.response.data.message);
                                            } else {
                                                console.log(error.response.data);
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
        getPatientBillData: function () {
            post('patient_bill_list', {
                encounter_id: this.encounter_id
            })
                .then((data) => {
                    if (data.data.status !== undefined && data.data.status === true) {
                        this.patientBillList.data = data.data.data
                        this.paginate.totalRows = data.data.total_rows
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })
        },
        defaultPatientBillData: function () {
            return {
                fields: [
                    {
                        key: 'index',
                        label: this.formTranslation.patient_bill.lbl_sr_no,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'title',
                        label: this.formTranslation.patient_bill.lbl_title,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'total_amount',
                        label: this.formTranslation.patient_bill.lbl_total_amount,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'discount',
                        label: this.formTranslation.patient_bill.lbl_discount,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'actual_amount',
                        label: this.formTranslation.patient_bill.lbl_actual_amount,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'created_at',
                        label: this.formTranslation.patient_bill.lbl_date,
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {
                        key: 'status',
                        label: this.formTranslation.patient_bill.lbl_status
                    },
                    {
                        key: 'actions',
                        label: this.formTranslation.patient_bill.lbl_action
                    }
                ],
                data: []
            }
        }
    },
    computed: {

    }
}
</script>