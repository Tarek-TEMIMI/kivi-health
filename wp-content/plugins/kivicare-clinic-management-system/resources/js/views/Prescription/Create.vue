<template>
    <b-row>
        <b-col sm="12">
            <form id="prescriptionDataForm" @submit.prevent="handleSubmit" :novalidate="true">
                <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                    <template v-slot:header>
                        <b-row>
                            <b-col sm="12" md="8" lg="8">
                                <h3 class="mb-0">{{ cardTitle }}</h3>
                            </b-col>
                            <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('prescription_list')">
                                <div class="float-right">
                                    <button type="button" class="btn btn-sm btn-primary" @click="$router.go(-1);">
                                        <i class="fa fa-angle-double-left"></i> {{formTranslation.common.back}}
                                    </button>
                                </div>
                            </b-col>
                        </b-row>
                    </template>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group row">
                                        <label for="title" class="col-md-4 form-control-label">
                                            {{formTranslation.common.title}} <span class="text-danger">*</span>
                                        </label>
                                        <div class="col-sm-8">
                                            <input id="title"
                                                   :class="{ ' is-invalid': submitted && $v.prescriptionData.title.$error }"
                                                   v-model="prescriptionData.title" :placeholder="formTranslation.patient.plh_enter_title"
                                                   required="required" name="title" type="text" class="form-control">
                                            <div v-if="submitted && !$v.prescriptionData.title.required" class="invalid-feedback">
                                                {{formTranslation.patient_bill.bill_title_required}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group row">
                                        <label for="notes" class="col-md-4 form-control-label">
                                            {{formTranslation.patient_bill.notes}} <span class="text-danger">*</span>
                                        </label>

                                        <div class="col-md-8">
                                            <textarea name="notes" v-model="prescriptionData.notes"
                                                      :placeholder="formTranslation.patient.plh_enter_notes" class="form-control"
                                                      id="notes"></textarea>
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
                                    <button v-if="!loading" class="btn btn-primary" type="submit">
                                        <i class="fa fa-plus"></i> {{ formTranslation.encounter_dashboard.presciption_save_btn }}
                                    </button>
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
    import { post } from "../../config/request";
    import {validateForm} from "../../config/helper";

    export default {
        data: () => {
            return {
                cardTitle: 'Add prescription',
                encounter_id: 0,
                problem_types: [],
                outcomes: [],
                prescriptionData: {},
                loading: false,
                submitted: false,
                buttonText: '<i class="fa fa-plus"></i> Add',
            }
        },
        validations: {
            prescriptionData: {
                title: { required },
                notes: { required }
            },
        },
        mounted() {
            this.cardTitle = this.formTranslation.patient_encounter.add_prescription;
            this.prescriptionData = this.defaultPrescriptionData();
            this.init();
        },
        methods: {
            init: function () {

                if (this.$route.params.encounter_id !== undefined) {
                    this.prescriptionData.encounter_id = this.$route.params.encounter_id;
                }

                /// Code for the Edit functionality...
                if (this.$route.params.id !== undefined) {
                    this.cardTitle = this.formTranslation.patient_encounter.edit_prescription;
                    this.buttonText = '<i class="fa fa-save"></i>'+this.formTranslation.common.save;

                    post('prescription_edit', {
                        id: this.$route.params.id
                    })
                        .then((response) => {
                            if (response.data.status !== undefined && response.data.status === true) {
                                this.prescriptionData = response.data.data
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            displayErrorMessage(this.formTranslation.widgets.record_not_found);
                        })
                }

            },
            handleSubmit: function () {
                this.loading = true;

                this.submitted = true;

                // stop here if form is invalid
                this.$v.$touch();
                if (this.$v.prescriptionData.$invalid) {
                    this.loading = false;
                    return;
                }

                if (validateForm("prescriptionDataForm")) {

                    post('prescription_save', this.prescriptionData)
                        .then((response) => {
                            this.loading = false;
                            if (response.data.status !== undefined && response.data.status === true) {
                                displayMessage(response.data.message);
                                this.$router.push({ name: 'prescription' });
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
            defaultPrescriptionData: function () {
                return {
                    encounter_id: 0,
                    title: '',
                    notes: "",
                }
            }
        }
    }
</script>