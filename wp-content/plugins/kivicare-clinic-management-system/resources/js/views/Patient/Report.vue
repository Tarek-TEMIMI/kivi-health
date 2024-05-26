<template>
  <b-row>
    <b-col sm="12">
      <b-overlay :show="userData.addOns.kiviPro != true" variant="white" :opacity="overlayOpacity">
        <template #overlay>
          <overlay-message addon_type="pro"></overlay-message>
        </template>
        <div class="card p-0 shadow">
          <div class="card-header">
            <div class="row">
              <div class="col-md-6">
                <h3 class="mb-0">{{ formTranslation.patient.medical_report }}</h3>
              </div>
              <b-col md="6">
                <div class="float-right">
                  <button id='sendReport' v-if="medicalReportList.length > 0" @click="handlePrescriptionMail"
                    class="btn btn-sm btn-primary">
                    <i class="fas fa-paper-plane"></i> {{ getUserRole() === 'patient' && $route.params.patient_id !==
                      undefined ? formTranslation.doctor.dt_lbl_email : formTranslation.clinic.dt_lbl_email }}
                  </button>
                  <button v-if="encounterData.status != 0 && kcCheckPermission('patient_report_add')"
                    @click="handlePrescriptionAdd" class="btn btn-sm btn-primary">
                    <i v-if="!visible && !isEditForm" class="fa fa-plus"></i> <i v-else class="fa fa-minus"></i> {{
                      (!visible && !isEditForm ?
                      formTranslation.patient.add_medical_report : formTranslation.common.close_form_btn) }}
                  </button>
                  <button type="button" v-if="showBackButton" class="btn btn-sm btn-primary" @click="$router.go(-1);">
                    <i class="fa fa-angle-double-left"></i> {{ formTranslation.common.back }}
                  </button>
                </div>
              </b-col>
            </div>
            <b-collapse class="mt-2 position-relative" :visible="showAddForm">
              <div class="row">
                <div class="col-md-12">
                  <hr class="my-4">
                  <div class="row">
                    <div class="col-md-12">
                      <h4 class="">{{ mutation_medical_report_label }}</h4>
                    </div>
                  </div>
                  <form id="medicalReportDataForm" @submit.prevent="handleSubmit" :novalidate="true">
                    <div class="row">
                      <div :class="this.$route.name === 'patient-profile-view' ? 'col-md-3' : 'col-md-4'">
                        <div class="form-group">
                          <label for="name" class="form-control-label">{{ formTranslation.common.name }} <span
                              class="text-danger">*</span></label>
                          <input id="name" :placeholder="formTranslation.patient.plh_enter_report" name="name" type="text"
                            class="form-control" v-model="medicalReportData.name">
                          <div v-if="submitted && !$v.medicalReportData.name.required" class="invalid-feedback">
                            {{ formTranslation.common.name_required }}
                          </div>
                        </div>
                      </div>
                      <div :class="this.$route.name === 'patient-profile-view' ? 'col-md-3' : 'col-md-4'">
                        <div class="form-group">
                          <label for="date" class="form-control-label">
                            {{ formTranslation.common.date }} <span class="text-danger">*</span>
                          </label>
                          <vc-date-picker
                          mode="date"
                          title-position="left" v-model="medicalReportData.date" :max-date="new Date()"
                            :placeholder="formTranslation.patient.welcome_date_plh"
                            :popover="{ placement: 'bottom', visibility: 'click' }">

                            <template v-slot="{ inputValue }">
                              <input class="form-control date-picker" readonly :value="inputValue"
                                :placeholder="formTranslation.patient.welcome_date_plh" />
                            </template>
                          </vc-date-picker>
                          <div v-if="submitted && !$v.medicalReportData.date.required" class="invalid-feedback">
                            {{ formTranslation.widgets.date_required }}
                          </div>
                        </div>
                      </div>
                      <div :class="this.$route.name === 'patient-profile-view' ? 'col-md-6' : 'col-md-4'">
                        <div class="form-group">
                          <label for="report" class="form-control-label">
                            {{ formTranslation.patient.upload_report }} <span class="text-danger">*</span>
                          </label>
                          <div class="input-group kivi-choose-file flex-nowrap">
                            <div class="input-group-prepend flex-shrink-0">
                              <button class="btn btn-primary px-2" type="button" id="siteLogo" :disabled="isEditForm"
                                @click.prevent="uploadProfile()">{{ formTranslation.common.choose_file }}</button>
                            </div>
                            <label class="input-group-text" for="siteLogo">{{ new_report }}</label>
                            <div v-if="upload_report_required" class="invalid-feedback">{{ formTranslation.widgets.file_required }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="float-right">
                          <button v-if="!loading" class="btn btn-primary" type="submit" v-html="buttonText"></button>
                          <button v-else class="btn btn-primary" type="button" disabled>
                            <i class="fa fa-sync fa-spin"></i>&nbsp; {{ formTranslation.common.loading }}
                          </button>
                          <button type="button" class="btn btn-outline-primary" @click="close()">
                            {{ formTranslation.common.cancel }}</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </b-collapse>
            <b-collapse class="mt-2" :visible="showEmailAddForm" v-if="medicalReportList.length > 0">
              <div class="row">
                <div class="col-md-12">
                  <hr class="my-4">
                  <form id="sendMedicalReportDataForm" @submit.prevent="handleEmailSubmit" :novalidate="true">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="form-group">
                          <label for="name" class="form-control-label">{{ formTranslation.reports.plh_select }} {{ ''
                          }}{{ formTranslation.reports.reports }} <span class="text-danger">*</span></label>
                          <multi-select deselect-label="" select-label="" v-model="emailReportSelect"
                            :tag-placeholder="formTranslation.patient.tag_select_clinic_plh" id="emailreport"
                            :placeholder="formTranslation.patient.search_placeholder" label="name" track-by="id"
                            :options="medicalReportList" :multiple="true"></multi-select>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="float-right">
                          <button class="btn btn-primary email-send-button" type="submit">
                            <i class="fas fa-paper-plane"></i>
                            {{ formTranslation.clinic.dt_lbl_email }}
                          </button>
                          <button type="button" class="btn btn-outline-primary" @click="closeEmail()">
                            {{ formTranslation.common.cancel }}</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </b-collapse>
          </div>
          <div class="card-body" v-if="kcCheckPermission('patient_report')">
            <div class="row text-uppercase">
              <div class="col-md-6 col-6 text-left">
                <h5 class="mb-0">{{ formTranslation.common.name }}</h5>
              </div>
              <div class="col-md-4 col-4">
                <h5 class="mb-0">{{ formTranslation.common.date }}</h5>
              </div>
              <div class="col-md-2 col-2" v-if="getUserRole() !== 'patient'">
                <h5 class="mb-0">{{ formTranslation.common.action }}</h5>
              </div>
              <div class="col-md-12">
                <hr class="my-3">
              </div>
            </div>
            <div class="page-loader-section" v-if="isLoading">
              <loader-component-2></loader-component-2>
            </div>
            <div v-if="medicalReportList.length > 0 && !isLoading">
              <div class="row animated fadeInUp mb-3" v-for="(medical, index) in medicalReportList" :key="index">
                <div class="col-md-6 col-6">
                  <h3 class="text-primary mb-0">{{ medical.name }}</h3>
                </div>
                <div class="col-md-4 col-4 d-flex align-items-center">
                  <h5 class="mb-0">{{ medical.medical_date }}</h5>
                </div>
                <div class="col-md-2 col-2 d-flex align-items-center">
                  <div class="float-right">
                    <b-button-group size="sm">
                      <b-button
                        v-if="getUserRole() != 'patient' && kcCheckPermission('patient_report_delete') && (($route.params.encounter_id === undefined) || ($route.params.encounter_id !== undefined && encounterData.status === '1'))"
                        variant="outline-danger" v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt"
                        @click="deletemedicalReportData(index)">
                        <i class="fa fa-trash"></i>
                      </b-button>
                      <b-button variant="outline-primary" v-if="kcCheckPermission('patient_report_view')"
                        v-b-tooltip.hover :title="formTranslation.appointments.view_report"
                        @click="viewReportData(medical.patient_id, medical.id)">
                        <i class="fa fa-eye"></i>
                      </b-button>
                      <b-button variant="outline-primary" v-if="kcCheckPermission('patient_report_edit')"
                        v-b-tooltip.hover :title="formTranslation.common.edit" @click="editReportData(medical)">
                        <i class="fa fa-pen-alt"></i>
                      </b-button>
                    </b-button-group>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="row">
                <div class="col-md-12">
                  <h4 class="text-danger text-center my-3">{{ formTranslation.patient_encounter.no_patient_report_found }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-overlay>
    </b-col>
  </b-row>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { post, get } from "../../config/request";
export default {
  props: {
    patient_profile_id: {
      type: [String, Number],
      default() {
        return ''
      }
    }
  },
  data: () => {
    return {
      patient_id: 0,
      visible: false,
      showAddForm: false,
      staticId: -1,
      medicalReportList: [],
      medicalReportData: {},
      encounterData: {
        status: 1
      },
      isLoading: true,
      showBackButton: true,
      durations: [],
      formTitle: this?.formTranslation?.patient?.add_medical_report,
      buttonText: '<i class="fa fa-save"></i> Save',
      loading: false,
      submitted: false,
      file: '',
      showEmailAddForm: false,
      emailReportSelect: [],
      new_report: '',
      upload_report_required: false,
      mutation_medical_report_label: '',
      isEditForm: false,
    }
  },
  validations: {
    medicalReportData: {
      name: { required },
      date: { required },
    }
  },
  mounted() {
    this.new_report = this.formTranslation.common.no_file_chosen
    if (this.$route.params.encounter_id !== undefined) {
      this.encounterDataDetails()
    }
    if (this.$route.params.patient_id !== undefined) {
      this.patient_id = this.$route.params.patient_id;
      this.getReport();
      if (this.getUserRole() === 'patient') {
        this.showBackButton = false;
      }
    }
    if (this.patient_profile_id) {
      this.patient_id = this.patient_profile_id;
      this.showBackButton = false;
      this.getReport();
    }
    this.medicalReportData = this.defaultmedicalReportData();
  },
  methods: {
    encounterDataDetails() {
      if (this.$route.params.encounter_id !== undefined) {
        this.encounterId = this.$route.params.encounter_id
        get('patient_encounter_details', {
          id: this.encounterId
        })
          .then((data) => {
            if (data.data.status !== undefined && data.data.status === true) {
              this.encounterData = data.data.data
              this.patient_id = this.encounterData.patient_id;
              this.getReport();
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
      }
    },
    defaultmedicalReportData: function () {
      this.new_report = this.formTranslation.common.no_file_chosen
      return {
        name: '',
        date: new Date(),
        upload_report: '',
        patient_id: 0
      }
    },
    getReport() {
      this.isLoading = true;
      get('get_patient_report', { patinet: this.patient_id })
        .then((response) => {
          this.isLoading = false;
          if (response.data.status) {
            this.medicalReportList = response.data.data
          }
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error)
        })
    },
    uploadProfile() {

      let _this = this;
      var custom_uploader = kivicareCustomImageUploader(this.formTranslation, 'report')

      custom_uploader.on('select', function () {
        var attachment = custom_uploader.state().get('selection').first().toJSON();
        _this.medicalReportData.upload_report = attachment.id
        _this.new_report = attachment.filename
        _this.upload_report_required= false;
      });

      //Open the uploader dialog
      custom_uploader.open();
    },
    handlePrescriptionAdd: function () {
      this.showAddForm = !this.showAddForm
      if (this.showAddForm == false) {
        $("#medicalReportDataForm")[0].reset();
      }
      this.visible = !this.visible
      this.mutation_medical_report_label = this.formTranslation.patient.add_medical_report;
      this.isEditForm = false;
      this.medicalReportData = this.defaultmedicalReportData()
    },
    editReportData: function (medical) {

      this.mutation_medical_report_label = this.formTranslation.patient.edit_medical_report;
      this.showAddForm = true;
      this.isEditForm = true;
      this.visible = true;


      this.medicalReportData = medical;
      this.medicalReportData.date = new Date(medical.date)
    },
    handlePrescriptionMail: function () {
      this.showEmailAddForm = true;
    },
    close() {
      this.loading = false;
      this.file = ''
      this.visible = false
      this.showAddForm = false
      this.medicalReportData = this.defaultmedicalReportData()
      $("#medicalReportDataForm")[0].reset();
    },
    closeEmail() {
      $('.email-send-button').html('<i class="fas fa-paper-plane"> </i>' + this.formTranslation.clinic.dt_lbl_email)
      this.emailReportSelect = [];
      this.showEmailAddForm = false;
    },
    handleEmailSubmit: function () {
      if (this.emailReportSelect.length <= 0) {
        displayErrorMessage(this.formTranslation.medical_records.medical_record_not_found);
        return
      }
      $('.email-send-button').html('<i class="fa fa-spinner fa-spin"> </i>' + this.formTranslation.common.loading)
      post('patient_report_mail', { data: this.emailReportSelect, patient_id: this.patient_id })
        .then((response) => {
          $('.email-send-button').html('<i class="fas fa-paper-plane"> </i>' + this.formTranslation.clinic.dt_lbl_email)
          if (response.data.status !== undefined && response.data.status === true) {
            displayMessage(response.data.message);
            this.showEmailAddForm = false;
          } else {
            displayErrorMessage(response.data.message)
          }
        }).catch((error) => {
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error)
        })
    },
    handleSubmit: function () {


      this.loading = true;
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.medicalReportData.$invalid) {
        this.loading = false;
        return;
      } else if (this.medicalReportData.upload_report == undefined || this.medicalReportData.upload_report == '' || this.medicalReportData.upload_report == null) {
        this.upload_report_required = true;
        this.loading = false;
        return
      }

      this.loading = true;
      this.submitted = false;
      this.medicalReportData.patient_id = this.patient_id

      this.medicalReportData.date  =this.medicalReportData.date.getTime();

      if (validateForm("medicalReportDataForm")) {
        post(this.isEditForm ? 'edit_patient_report' : 'upload_patient_report', this.medicalReportData)
          .then((response) => {
            response =  this.isEditForm? response.data: response;
            this.loading = false;
            this.upload_report_required = false;
            if (response.data.status) {
              displayMessage(response.data.message);
              this.visible = !this.visible,
                this.showAddForm = false;
              this.medicalReportData = this.defaultmedicalReportData();
              this.file = ''
              this.getReport();
            } else {
              displayErrorMessage(response.data.message)
              this.visible = false,
              this.showAddForm = false;
              this.isEditForm = false;
              this.medicalReportData = this.defaultmedicalReportData();
              this.getReport();
            }
          })
          .catch((error) => {
            this.loading = false;
            this.upload_report_required = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error)
          })
      }
    },
    viewReportData(id, docId) {
      get('view_patient_report', { patient_id: id, doc_id: docId })
        .then((response) => {
          if (response.data.status) {

            setTimeout(() => {
              window.open(response.data.data, '_blank');
            })
          }
        })
        .catch((error) => {
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error)
        })
    },
    deletemedicalReportData(index) {
      if (this.medicalReportList[index] !== undefined) {
        $.confirm({
          title: this.formTranslation.clinic_schedule.dt_are_you_sure,
          content: this.formTranslation.common.py_delete_report,
          type: 'red',
          buttons: {
            ok: {
              text: this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                get('delete_patient_report', {
                  id: this.medicalReportList[index].id
                })
                  .then((response) => {
                    this.medicalReportList.splice((index), 1);
                  })
                  .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error)
                  })
              }
            },
            cancel: {
              text: this.formTranslation.common.cancel
            }
          }
        });
      }

    }
  },
  computed: {
    userData() {
      return this.$store.state.userDataModule.user;
    }
  }
}
</script>
<style>
</style>