<template>
  <b-row>
    <b-col sm="12">
      <b-overlay :show="userData.addOns.kiviPro != true" variant="white"
                 :opacity="overlayOpacity">
        <template #overlay>
          <overlay-message addon_type="pro"></overlay-message>
        </template>
        <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
          <template v-slot:header>
            <b-row class="align-items-center">
              <b-col sm="12" md="8" lg="8">
                <h3 class="mb-0">{{ formTranslation.patient.clinic_check_out_in }}</h3>
              </b-col>
            </b-row>
          </template>
          <b-row>
            <b-col>
              <form id="encounterDataForm" @submit.prevent="handleSubmit" :novalidate="true">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label for="doctor_id" class="form-control-label">
                          {{ formTranslation.clinic.select_clinic }} <span class="text-danger">*</span>
                        </label>
                        <multi-select
                            deselect-label=""
                            select-label=""
                            v-model="patientclinic"
                            :tag-placeholder="formTranslation.patient_encounter.tag_select_clinic_plh"
                            id="clinic_id"
                            :placeholder="formTranslation.patient_encounter.tag_select_clinic_plh"
                            label="label"
                            track-by="id" :options="clinic"
                            :loading="clinicMultiselectLoader"
                            :disabled="clinicMultiselectLoader"
                        ></multi-select>

                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <button v-if="!loading" class="btn btn-primary rtl-ml-2" type="submit"
                                style="margin-top: 28px;">
                          <i class="fa fa-save"></i> {{ formTranslation.patient_encounter.save_btn }}
                        </button>
                        <button v-else class="btn btn-primary" type="submit" disabled style="margin-top: 28px;">
                          <i class="fa fa-sync fa-spin"></i>&nbsp; {{ formTranslation.common.loading }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </b-col>
          </b-row>
        </b-card>
      </b-overlay>
    </b-col>
  </b-row>
</template>

<script>
import { post, get } from "../../config/request";

export default {
  data: () => {
      return {
          clinic: [],
          patientclinic:{},
          loading: false,
          submitted: false,
          buttonText: '<i class="fa fa-save"></i> Save',
        clinicMultiselectLoader:true
      }
  },
  mounted() {
      this.getClinic();
      this.getPatientClinic()
  },
  methods: {
      handleSubmit:function(){
        this.loading = true;
        post('patient_clinic_check_out', {data:this.patientclinic})
            .then((response) => {
              this.loading = false;
              if (response.data.status !== undefined && response.data.status === true) {
                displayMessage(response.data.message)
                this.$store.dispatch("fetchAllClinic", {self: this})
              } else {
                displayErrorMessage(response.data.message)
              }
            })
            .catch((error) => {
              this.loading = false;
              console.log(error);
              displayErrorMessage(this.formTranslation.common.internal_server_error)
            })
      },
      getClinic:function(){
        this.clinicMultiselectLoader = true;
        // Get dropdown data for clinics
          get('get_static_data', {
              data_type: 'clinics'
          })
            .then((response) => {
              this.clinicMultiselectLoader = false;
                if (response.data.status !== undefined && response.data.status === true) {
                     this.clinic = response.data.data;
                  } else {
                      displayErrorMessage(response.data.message)
                  }
                })
              .catch((error) => {
                this.clinicMultiselectLoader = false;
                  console.log(error);
                  displayErrorMessage(this.formTranslation.common.internal_server_error)
              })
      },
      getPatientClinic:function(){
           get('get_static_data', {
              data_type: 'patient_clinic',
          })
            .then((response) => {
                if (response.data.status !== undefined && response.data.status === true) {
                    if(response.data.data !== undefined && response.data.data.length > 0){
                        if(response.data.data.length > 0){
                          this.patientclinic = response.data.data[0]
                        }
                    }
                  } else {
                      displayErrorMessage(response.data.message)
                  }
                })
              .catch((error) => {
                  console.log(error);
                  displayErrorMessage(this.formTranslation.common.internal_server_error)
              })
      }
  },
  computed:{
    userData(){
      return this.$store.state.userDataModule.user;
    }
  }
}
</script>