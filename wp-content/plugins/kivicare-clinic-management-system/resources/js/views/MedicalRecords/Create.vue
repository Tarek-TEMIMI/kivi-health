<template>
    <b-row>
        <b-col sm="12">
            <form id="medicalRecordDataForm" @submit.prevent="handleSubmit" :novalidate="true">
                <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                    <template v-slot:header>
                        <b-row>
                            <b-col sm="12" md="8" lg="8">
                                <h3 class="mb-0">{{ cardTitle }}</h3>
                            </b-col>
                            <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('medical_records_list')">
                                <div class="float-right">
                                    <router-link class="btn btn-sm btn-primary" :to="{ name: 'medical-records' }">
                                        <i class="fa fa-angle-double-left"></i> {{formTranslation.common.back}}
                                    </router-link>
                                </div>
                            </b-col>
                        </b-row>
                    </template>

                    <div class="row">
                        <div class="col-md-6">

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group row">
                                        <label for="problem_type" class="col-md-4 form-control-label">
                                            {{formTranslation.medical_records.problem_type}} <span class="text-danger">*</span>
                                        </label>
                                        <div class="col-sm-8">
                                            <multi-select v-model="medicalRecordData.problem_type"
                                                          deselect-label=""
                                                          select-label=""
                                                          :class="{ ' is-invalid': submitted && $v.medicalRecordData.problem_type.$error }"
                                                          :tag-placeholder="formTranslation.medical_records.plh_problem_type" id="problem_type" :placeholder="formTranslation.medical_records.plh_search"
                                                          label="label" track-by="id" :options="problem_types"
                                            ></multi-select>
                                            <div v-if="submitted && !$v.medicalRecordData.start_date.required" class="invalid-feedback">
                                                {{formTranslation.medical_records.problem_start_date_required}}
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label for="start_date" class="col-md-4 form-control-label">
                                    {{formTranslation.medical_records.problem_start_date}} <span class="text-danger">*</span>
                                </label>
                                <div class="col-sm-8">
                                    <b-form-datepicker
                                            id="start_date" v-model="medicalRecordData.start_date"
                                            :class="{ ' is-invalid': submitted && $v.medicalRecordData.start_date.$error }"
                                            class="mb-2"></b-form-datepicker>
                                    <div v-if="submitted && !$v.medicalRecordData.start_date.required" class="invalid-feedback">
                                        {{formTranslation.medical_records.problem_start_date_required}}
                                    </div>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label for="end_date" class="col-md-4 form-control-label">
                                    {{formTranslation.medical_records.problem_end_date}}
                                </label>
                                <div class="col-sm-8">
                                    <b-form-datepicker
                                            id="end_date" v-model="medicalRecordData.end_date"
                                            :min="medicalRecordData.start_date"
                                            class="mb-2"></b-form-datepicker>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group row">
                                        <label for="outcome" class="col-md-4 form-control-label">
                                            {{formTranslation.medical_records.problem_outcome}}
                                        </label>
                                        <div class="col-sm-8">
                                            <multi-select v-model="medicalRecordData.outcome"
                                                          deselect-label=""
                                                          select-label=""
                                                          :tag-placeholder="formTranslation.medical_records.plh_problem_outcome" id="outcome" :placeholder="formTranslation.medical_records.plh_search"
                                                          label="label" track-by="id" :options="outcomes"
                                            ></multi-select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group row">
                                        <label for="description" class="col-md-4 form-control-label">
                                            {{formTranslation.appointments.description}}
                                        </label>

                                        <div class="col-md-8">
                                            <textarea name="description" v-model="medicalRecordData.description"
                                                      :placeholder="formTranslation.medical_records.plh_medical_desc" class="form-control"
                                                      id="description"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <template v-slot:footer>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="float-right">
                                    <button v-if="!loading" class="btn btn-primary" type="submit"
                                            v-html="buttonText"></button>
                                    <button v-else class="btn btn-primary" type="submit" disabled>
                                        <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                </b-card>
            </form>
        </b-col>
    </b-row>
</template>

<script>
    import { required, numeric } from "vuelidate/lib/validators";
    import { post, get } from "../../config/request";
    import {validateForm} from "../../config/helper";

    export default {
        data: () => {
            return {
                cardTitle: 'Add medical record',
                encounter_id: 0,
                problem_types: [],
                outcomes: [],
                medicalRecordData: {},
                loading: false,
                submitted: false,
                buttonText: '<i class="fa fa-plus"></i> Add',
            }
        },
        validations: {
            medicalRecordData: {
                problem_type: { required },
                start_date: { required },
                outcome: { required }
            },
        },
        mounted() {
            this.medicalRecordData = this.defaultMedicalRecordData();
            this.init();
        },
        methods: {
            init: function () {

                if (this.$route.params.encounter_id !== undefined) {
                    this.medicalRecordData.encounter_id = this.$route.params.encounter_id;
                }

                /// Code for the Edit functionality...
                if (this.$route.params.id !== undefined) {
                    this.cardTitle = this.formTranslation.medical_records.edit_medical_record;
                    this.buttonText = '<i class="fa fa-save"></i> '+this.formTranslation.common.save;

                    post('medical_records_edit', {
                        id: this.$route.params.id
                    })
                        .then((response) => {
                            if (response.data.status !== undefined && response.data.status === true) {
                                this.medicalRecordData = response.data.data
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            displayErrorMessage(this.formTranslation.widgets.record_not_found);
                        })
                }

                // Get dropdown data for Problem types
                get('get_static_data', {
                    data_type: 'static_data_with_label',
                    static_data_type: 'medical_problem_types'
                })
                        .then((response) => {
                            if (response.data.status !== undefined && response.data.status === true) {
                                this.problem_types = response.data.data;
                            } else {
                                displayErrorMessage(response.data.message)
                            }

                        })
                        .catch((error) => {
                            console.log(error);
                            displayErrorMessage(this.formTranslation.common.internal_server_error)
                        })


                // Get dropdown data for Medical outcomes
                get('get_static_data', {
                    data_type: 'static_data_with_label',
                    static_data_type: 'medical_outcomes'
                })
                    .then((response) => {
                        if (response.data.status !== undefined && response.data.status === true) {
                            this.outcomes = response.data.data;
                        } else {
                            displayErrorMessage(response.data.message)
                        }

                    })
                    .catch((error) => {
                        console.log(error);
                        displayErrorMessage(this.formTranslation.common.internal_server_error)
                    })

            },
            handleSubmit: function () {
                this.loading = true;

                this.submitted = true;

                // stop here if form is invalid
                this.$v.$touch();
                if (this.$v.medicalRecordData.$invalid) {
                    this.loading = false;
                    return;
                }

                if (validateForm("medicalRecordDataForm")) {

                    post('medical_records_save', this.medicalRecordData)
                        .then((response) => {
                            this.loading = false;
                            if (response.data.status !== undefined && response.data.status === true) {
                                displayMessage(response.data.message);
                                this.$router.push({ name: 'medical-records' });
                            } else {
                                displayErrorMessage(response.data.message)
                            }

                        })
                        .catch((error) => {
                            console.log(error);
                            this.loading = false;
                            displayErrorMessage(this.formTranslation.common.internal_server_error)
                        })
                }
            },
            defaultMedicalRecordData: function () {
                return {
                    encounter_id: 0,
                    start_date: '',
                    end_date: '',
                    problem_type: {},
                    outcome: {},
                    description: "",
                }
            }
        }
    }
</script>
