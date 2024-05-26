<template>
    <b-row>
        <b-col sm="12" >
            <form id="staticDataForm" @submit.prevent="handleSubmit" :novalidate="true">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="label" class="form-control-label">{{formTranslation.static_data.label}} <span class="text-danger">*</span></label>
                                <input id="label"
                                       :class="{ ' is-invalid': submitted && $v.staticData.label.$error }"
                                       v-model="staticData.label" 
                                       :placeholder="this.formTranslation.static_data.data_label_plh"
                                       required="required" name="label"
                                       type="text"
                                       class="form-control">
                                <div v-if="submitted && !$v.staticData.label.required" class="invalid-feedback">{{formTranslation.custom_field.label_name_required}}</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="from-group">
                                <label for="type" class="form-control-label">{{formTranslation.doctor.type}} <span class="text-danger">*</span></label>
                                <div class="kivi-pr">
                                    <multi-select
                                        deselect-label=""
                                        select-label=""
                                        v-model="staticData.type"
                                        id="type"
                                        :tag-placeholder="this.formTranslation.static_data.tag_select_type_plh" 
                                        :placeholder="this.formTranslation.static_data.select_type_plh"
                                        label="type" 
                                        track-by="id"
                                        :options="staticDataTypes"
                                    ></multi-select>
                                    <span class="select_clear_btn"  @click="staticData.type = '' ">×</span>
                                </div>
                                <div v-if="submitted && !$v.staticData.type.required" class="invalid-feedback">{{formTranslation.doctor.type_required}}</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="from-group">
                                <label for="status" class="form-control-label">{{formTranslation.common.status}} <span class="text-danger">*</span></label>
                                <div class="kivi-pr" >
                                    <multi-select
                                        deselect-label=""
                                        select-label=""
                                        v-model="staticData.status"
                                        id="type"
                                        :tag-placeholder="formTranslation.static_data.tag_select_status_plh" :placeholder="formTranslation.static_data.select_status_plh"
                                        label="label" 
                                        track-by="id"
                                        :allow-empty="false"
                                        :options="[{ id: 1, label: formTranslation.common.active }, { id: 0, label: formTranslation.common.inactive }]"
                                        @input="changeStatus"
                                    >
                                    </multi-select>
                                    <span class="select_clear_btn"  @click="staticData.status = ''">×</span>
                                </div>
                                <div v-if="submitted && !$v.staticData.status.required" class="invalid-feedback">{{formTranslation.appointments.status_required}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 pr-2 pt-4">
                            <div class="d-flex justify-content-end">
                                <button v-if="!loading" class="btn btn-primary rtl-ml-2" type="submit">
                                    <i class="fa fa-save"></i> {{ buttonText }}
                                </button>
                                <button v-else class="btn btn-primary" type="submit" disabled>
                                    <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                                </button>
                                <button type="button" class="btn btn-outline-primary" @click="closeForm"> {{formTranslation.common.cancel}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </b-col>
    </b-row>
</template>
<script>
    import { required } from "vuelidate/lib/validators";
    import {post,get} from "../../config/request";
    import {alphaSpace, validateForm} from "../../config/helper";
    export default {
        data: () => {
            return {
                staticDataTypes: [],
                staticData: {},
                loading: false,
                submitted: false,
                cardTitle: 'Add static data',
                buttonText: ''
            }
        },
        props: {
          staticId:[String, Number]
        },
        mounted() {
            this.buttonText = this.formTranslation.common.save ;
            this.staticData = this.defaultStaticData();
            this.init();
        },
        validations: {
            staticData: {
                type: { required },
                label: {
                    required
                },
                status: { required },
            }
        },
        methods: {
            init: function () {
              this.staticDataTypes = [
                {
                  "id": "specialization",
                  "type": this.formTranslation.doctor.dt_lbl_specialties
                },
                {
                  "id": "service_type",
                  "type": this.formTranslation.widgets.service_type
                },
                {
                  "id": "prescription_medicine",
                  "type": this.formTranslation.patient_encounter.prescription
                },
                {
                  "id": "clinical_problems",
                  "type": this.formTranslation.encounter_dashboard.problems
                },
                {
                  "id": "clinical_observations",
                  "type": this.formTranslation.encounter_dashboard.observation
                }
              ];
              if (this.staticId !== undefined && this.staticId != -1  ){
                this.cardTitle = this.formTranslation.common.edit_staic_data;
                this.buttonText = this.formTranslation.common.save ;
                get('static_data_edit', { id: this.staticId })
                    .then((response) => {
                      if (response.data.status !== undefined && response.data.status === true) {
                        this.staticData = response.data.data
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      displayErrorMessage(this.formTranslation.widgets.record_not_found);
                    })
              }
            },
            defaultStaticData: function () {
                return {
                    type: '',
                    label: '',
                    status: { id: 1, label: this.formTranslation.common.active }
                }
            },
            handleSubmit: function () {
                this.loading = true;

                this.submitted = true;

                // stop here if form is invalid
                this.$v.$touch();
                if (this.$v.$invalid) {
                    this.loading = false;
                    return;
                }

                if (validateForm("staticDataForm")) {
                    post('static_data_save', this.staticData)
                        .then((response) => {
                            this.loading = false;
                            if (response.data.status !== undefined && response.data.status === true) {
                                displayMessage(response.data.message)
                                this.$emit('closeForm');
                                this.getData()
                            } else {
                                displayErrorMessage(response.data.message)
                            }

                        })
                        .catch((error) => {
                            this.loading = false;
                            console.log(error);
                            displayErrorMessage(this.formTranslation.common.internal_server_error)
                        })
                }
            },
            getData(){
              this.$emit('getStaticData')
            },
            closeForm(){
              this.$emit('closeForm')
            },
            changeStatus (value, id) {
            }
        },
        watch: {
          staticId (newVal, oldVal) {
            /// Code for the Edit functionality...
                if (newVal !== undefined && (newVal !== -1 || newVal !== '-1')  ) {
                this.cardTitle = this.formTranslation.common.edit_staic_data;
                this.buttonText = this.formTranslation.common.save ;
                get('static_data_edit', { id: newVal })
                    .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        this.staticData = response.data.data
                    }
                    })
                    .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.widgets.record_not_found);
                    })
                }
            }
        },
        computed: {
            // formTranslation: function () {
            //     return this.$store.state.staticDataModule.langTranslateData ;
            // }
        }
    }
</script>