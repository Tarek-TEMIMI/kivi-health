<template>
    <b-row>
        <b-col sm="12" >
            <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                <template v-slot:header>
                    <b-row>
                        <b-col sm="12" md="8" lg="8">
                            <h3 class="mb-0">{{formTranslation.patient_encounter.encounter_details}}</h3>
                        </b-col>
                        <b-col sm="12" md="4" lg="4">
                            <div class="d-flex justify-content-end">
                                <router-link class="btn btn-sm btn-primary" :to="{ name: 'patient-encounter', params: { patient_id: patient_id } }">
                                    <i class="fa fa-angle-double-left"></i> {{formTranslation.common.back}}
                                </router-link>
                            </div>
                        </b-col>
                    </b-row>
                </template>

                <div class="row">
                    <div class="col-md-8">
                        <h3 class="mb-0"><span class="font-weight-bold">{{formTranslation.common.name}} : </span> {{ encounterData.patient_name }}</h3>
                        <h4 class="mb-0"><span class="font-weight-bold">{{formTranslation.common.email}} : </span>{{ encounterData.patient_email }}</h4>
                    </div>
                    <div class="col-md-4 text-right">
                        <p class="mb-0"><span class="font-weight-bold">{{formTranslation.patient_encounter.encounter_date}} : </span>{{encounterData.encounter_date}}</p>
                        <p class="mb-0">
                            <span class="badge badge-success" v-if="encounterData.status === '1'" > {{formTranslation.common.active}}</span>
                            <span class="badge badge-danger" v-if="encounterData.status === '0'" > {{formTranslation.common.closed}}</span>
                        </p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <hr class="m-2">
                        <h4 class="mb-0"><span class="font-weight-bold">{{formTranslation.clinic.clinic_name}} : </span>{{ encounterData.clinic_name }}</h4>
                        <h4 class="mb-0"><span class="font-weight-bold">{{formTranslation.doctor.doctor_name}} : </span>{{ encounterData.doctor_name }}</h4>
                        <h4 class="mb-0"><span class="font-weight-bold">{{formTranslation.appointments.description}} : </span>{{ encounterData.description }}</h4>
                    </div>
                </div>


            </b-card>
        </b-col>

        <b-col sm="12" >
            <div class="nav-wrapper">
                <ul class="nav nav-pills nav-fill flex-column flex-md-row" id="tabs-text" role="tablist">
                    <li class="nav-item">
                        <router-link v-if="kcCheckPermission('medical_records_list')" class="nav-link mb-sm-3 mb-md-0" :to="{ name: 'medical-records' }">
                            <i class="fas fa-list-alt"></i> {{formTranslation.medical_records.medical_records}}
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link v-if="kcCheckPermission('prescription_list')" class="nav-link mb-sm-3 mb-md-0" :to="{ name: 'prescription' }">
                            <i class="fa fa-list-alt"></i> {{formTranslation.patient_encounter.prescription}}
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link v-if="kcCheckPermission('patient_bill_list')" class="nav-link mb-sm-3 mb-md-0" :to="{ name: 'patient-bill' }">
                            <i class="fas fa-money-bill"></i> {{formTranslation.patient_bill.bills}}
                        </router-link>
                    </li>
                </ul>
            </div>
        </b-col>

        <b-col sm="12" >
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </b-col>

    </b-row>
</template>

<script>
import {post} from "../../config/request";

export default {
    data: () => {
        return {
            encounterId: 0,
            patient_id: 0,
            encounterData: {}
        }
    },
    mounted() {
        this.encounterData = this.defaultEncounterDetails();
        this.init();
    },
    methods: {
        init: function () {

            if (this.$route.params.encounter_id !== undefined) {
                this.encounterId = this.$route.params.encounter_id
                get('patient_encounter_details', {
                    id: this.encounterId
                })
                        .then((data) => {
                            if (data.data.status !== undefined && data.data.status === true) {
                                this.encounterData = data.data.data
                                this.patient_id = this.encounterData.patient_id
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            displayErrorMessage(this.formTranslation.common.internal_server_error);
                        })
            }
        },
        defaultEncounterDetails: function () {
            return {
                patient_id: 0,
                patient_name: '',
                clinic_name: '',
                doctor_name: '',
            }
        }
    }
}
</script>