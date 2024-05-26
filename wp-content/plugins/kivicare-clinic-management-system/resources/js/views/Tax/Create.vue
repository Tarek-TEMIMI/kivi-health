<template>
  <b-row>
    <div class="page-loader-section" v-if="formLoader">
      <loader-component-2></loader-component-2>
    </div>
    <b-col v-else sm="12">
      <form id="taxDataForm" @submit.prevent="handleSubmit" :novalidate="true">
        <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
          <template v-slot:header>
            <b-row>
              <b-col sm="12" md="8" lg="8">
                <h3 class="mb-0">{{ cardTitle }}</h3>
              </b-col>
              <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('tax_list')">
                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-sm btn-primary" @click="$router.go(-1);">
                    <i class="fa fa-angle-double-left"></i> {{formTranslation.common.back}}
                  </button>
                </div>
              </b-col>
            </b-row>
          </template>
          <div class="row">
            <div class="col-4">
              <div class="form-group">
                <label for="name" class="form-control-label">{{formTranslation.common.name}}
                  <span class="text-danger">*</span>
                </label>
                <input id="name" v-model="taxData.name"
                       name="name" type="text" class="form-control">
                <div v-if="submitted && !$v.taxData.name.required"
                     class="invalid-feedback">{{formTranslation.common.name_required}}
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="form-group">
                <label for="tax_rate" class="form-control-label">{{formTranslation.common.tax_rate}}
                  <span class="text-danger">*</span>
                </label>
                <b-input-group>
                  <input id="tax_rate" v-model="taxData.tax_value"
                         name="tax_rate" type="number" class="form-control">
                  <b-input-group-append>
                    <select class="form-control" v-model="taxData.tax_type">
                      <option value="percentage">{{ '%' }}</option>
                      <option value="fixed">{{userData.clinic_currency_detail && userData.clinic_currency_detail.prefix ? userData.clinic_currency_detail.prefix : '' }}</option>
                    </select>
                  </b-input-group-append>
                </b-input-group>
                <div v-if="submitted && !$v.taxData.tax_type.required"
                     class="invalid-feedback">{{formTranslation.common.tax_rate + ' ' + formTranslation.common.required}}
                </div>
                <div v-if="submitted && !$v.taxData.tax_value.required"
                    class="invalid-feedback">{{formTranslation.common.tax_rate + ' ' + formTranslation.common.required}}
                </div>
                <div v-if="submitted && (!$v.taxData.tax_value.minValue)" class="invalid-feedback">
                  {{formTranslation.common.tax_greater_then_0}}
                </div>
              </div>
            </div>
            <div class="col-4" v-if="getUserRole() === 'administrator'">
              <div class="form-group">
                <label for="clinic_id" class="form-control-label">{{formTranslation.clinic.clinic}}
                </label>
                <multi-select
                    deselect-label=""
                    select-label=""
                    @select="clinicChange"
                    @remove="clinicChange"
                    v-model="taxData.clinic_id"
                    :tag-placeholder="formTranslation.patient.tag_select_clinic_plh" id="clinic_id"
                    :placeholder="formTranslation.patient.search_placeholder"
                    label="label"
                    :loading="clinicMultiselectLoader"
                    track-by="id"
                    :options="clinics"
                ></multi-select>
                <span class="text-primary small"><b>{{formTranslation.common.tax_clinic_note}}</b></span>
              </div>
            </div>
            <div class="col-4">
              <div class="form-group">
                <label for="doctor_id" class="form-control-label">{{formTranslation.common.doctor}}
                </label>
                <multi-select
                    deselect-label=""
                    select-label=""
                    @select="doctorChange"
                    @remove="doctorChange"
                    v-model="taxData.doctor_id"
                    :tag-placeholder="formTranslation.patient.tag_select_clinic_plh" id="doctor_id"
                    :placeholder="formTranslation.patient.search_placeholder"
                    label="label"
                    :loading="doctorMultiselectLoader"
                    track-by="id"
                    :multiple="!($route.params.id)"
                    :options="doctors"
                ></multi-select>
                <span class="text-primary small"><b>{{formTranslation.common.tax_doctor_note}}</b></span>
              </div>
            </div>
            <div class="col-4">
              <div class="form-group">
                <label for="service_id" class="form-control-label">{{formTranslation.common.service}}
                </label>
                <multi-select
                    deselect-label=""
                    select-label=""
                    v-model="taxData.service_id"
                    :tag-placeholder="formTranslation.patient.tag_select_clinic_plh" id="service_id"
                    :placeholder="formTranslation.patient.search_placeholder"
                    label="label"
                    :loading="serviceMultiselectLoader"
                    track-by="id"
                    :multiple="!($route.params.id)"
                    :options="services"
                ></multi-select>
                <span class="text-primary small"><b>{{formTranslation.common.tax_service_note}}</b></span>
              </div>
            </div>
            <div class="col-4">
              <div class="form-group">
                <label for="status" class="form-control-label">{{formTranslation.common.status}}
                  <span class="text-danger">*</span>
                </label>
                <select id="status" class="form-control" v-model="taxData.status">
                  <option value="1">{{formTranslation.common.active }}</option>
                  <option value="0">{{formTranslation.common.inactive}}</option>
                </select>
                <div v-if="submitted && !$v.taxData.status.required"
                     class="invalid-feedback">{{formTranslation.appointments.status_required}}
                </div>
              </div>
            </div>
          </div>
          <template v-slot:footer>
            <div class="row">
              <div class="col-md-12 p-0">
                <div class="d-flex justify-content-end">
                  <button v-if="!loading" class="btn btn-primary" type="submit"><i class="fa fa-save"></i> {{ formTranslation.patient.save_btn }} </button>
                  <button v-else class="btn btn-primary" type="submit" disabled>
                    <i class="fa fa-sync fa-spin"></i>&nbsp; {{ formTranslation.common.loading }}
                  </button>
                  <button type="button" class="btn btn-outline-primary" @click="$router.go(-1);"> {{formTranslation.common.cancel}}</button>
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
import {required, decimal, minValue} from "vuelidate/lib/validators";
import {post, get} from "../../config/request";

export default {
  data: () => {
    return {
      taxData: {},
      loading: false,
      submitted: false,
      cardTitle: 'Add patient',
      clinics:[],
      doctors:[],
      services:[],
      formLoader:false,
      clinicMultiselectLoader:true,
      doctorMultiselectLoader:true,
      serviceMultiselectLoader:true,
    }
  },
  mounted() {
    this.cardTitle = this.formTranslation.common.add_tax;
    this.taxData = this.defaultTaxData();
    this.init();
  },
  validations: {
    taxData: {
      name: {
        required,
      },
      tax_type: {
        required
      },
      tax_value: {
        required,
        decimal,
        minValue: minValue(0)
      },
      status:{
        required
      }
    }
  },
  methods: {
    init: function () {
      /// Code for the Edit functionality...
      if (this.$route.params.id) {
        this.cardTitle = 'Edit tax';
        this.formLoader = true;
        get('tax_edit', {
          id: this.$route.params.id,
        })
            .then((response) => {
              this.formLoader = false;
              if (response.data.status !== undefined && response.data.status === true) {
                this.taxData = response.data.data
              }
              
              this.getClinics(true);
              this.getDoctors(true);
              this.getServices(true)
            })
            .catch((error) => {
              this.formLoader = false;
              console.log(error);
              displayErrorMessage(this.formTranslation.widgets.record_not_found);
              this.getClinics(true);
              this.getDoctors(true);
              this.getServices(true)
            })
      }else{
        this.getClinics();
        this.getDoctors();
        this.getServices()
      }
    },
    defaultTaxData: function () {
      return {
        name: '',
        tax_type: 'fixed',
        tax_value: '',
        clinic_id: this.getUserRole() === 'clinic_admin' ? {id:this.userData.user_clinic_id} : '',
        doctor_id: '',
        service_id: '',
        status: 1
      }
    },
    handleSubmit: function () {
      this.loading = true;
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      this.$nextTick(() => {
        if(document.querySelector('.is-invalid') !== null && document.querySelector('.is-invalid') !== undefined){
          document.querySelector('.is-invalid').scrollIntoView({block: "center", behavior: "smooth"})
        }else if(document.querySelector('.invalid-feedback') !== null && document.querySelector('.invalid-feedback') !== undefined){
          document.querySelector('.invalid-feedback').scrollIntoView({block: "center", behavior: "smooth"})
        }
      })
      if (this.$v.taxData.$invalid) {
        this.loading = false;
        return;
      }

      post('tax_save', this.taxData)
          .then((response) => {
            this.loading = false;
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message);
              this.$router.push({name: 'tax'});
            } else {
              displayErrorMessage(response.data.message)
            }
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
            displayErrorMessage(this.formTranslation.common.internal_server_error)
          })
    },
    getServices(isedit){
      this.serviceMultiselectLoader=true;
      let doctor_id = 0;
      if(this.taxData.doctor_id){
        if(this.taxData.doctor_id.id){
          doctor_id = this.taxData.doctor_id.id
        }else{
          doctor_id = this.taxData.doctor_id.map((index,key) => {
            return index.id
          }).join();
        }
      }
      
      get('service_list', {
        clinic_id:this.taxData.clinic_id && this.taxData.clinic_id.id ? this.taxData.clinic_id.id : 0,
        doctor_id:doctor_id,
      })
          .then((response) => {
            this.serviceMultiselectLoader=false;
            if (response.data.status !== undefined && response.data.status === true) {
              response.data.data = response.data.data.map((value,key) => {
                 value.id = value.service_id
                 value.label = value.name
                 return value;
              })
              if(!isedit){
                this.taxData.service_id = null;
              }
              this.services = response.data.data
            }
          })
          .catch((error) => {
            this.serviceMultiselectLoader=false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    getDoctors(isedit){
      this.doctorMultiselectLoader=true;
      get('get_static_data', {
        data_type: 'get_users_by_clinic',
        clinic_id:this.taxData.clinic_id && this.taxData.clinic_id.id ? this.taxData.clinic_id.id : '',
        type: 'doctor'
      })
          .then((response) => {
            this.doctorMultiselectLoader=false;
            if (response.data.status !== undefined && response.data.status === true) {
              if(!isedit){
                this.taxData.doctor_id = null
              }
              this.doctors = response.data.data
            }
          })
          .catch((error) => {
            this.doctorMultiselectLoader=false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    getClinics:function (isedit) {
      this.clinicMultiselectLoader=true;
      get('get_static_data', {
        data_type: 'clinic_list',
      })
          .then((response) => {
            this.clinicMultiselectLoader=false;
            if (response.data.status !== undefined && response.data.status === true) {
              this.clinics = response.data.data
            }
          })
          .catch((error) => {
            this.clinicMultiselectLoader=false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    doctorChange(){
      this.getServices();
    },
    clinicChange(){
      this.getDoctors();
      this.getServices();
    }
  },
  computed: {
    userData() {
      return this.$store.state.userDataModule.user;
    }
  }
}
</script>
<style scoped>

</style>