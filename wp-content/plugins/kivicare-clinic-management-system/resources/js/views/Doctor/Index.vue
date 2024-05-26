<template>
  <b-row>
    <b-col sm="12">
      <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row class="align-items-center">
            <b-col sm="6" md="8" lg="8">
              <h3 class="h3 mb-0">{{ formTranslation.doctor.doctors_list }}</h3>
            </b-col>
            <b-col sm="6" md="4" lg="4" v-if="kcCheckPermission('doctor_add')">
              <div class="d-flex justify-content-end  align-items-center">
                <button v-if="userData.addOns.kiviPro && kivicareCompareVersion(requireProVersion, userData.pro_version)"
                  class="float-right btn btn-sm btn-primary rtl-left" @click="$refs.module_data_import.openModel = true">
                  <i class="fas fa-file-import"></i>{{ formTranslation.common.import_data }}
                </button>
                <router-link class="float-right btn btn-sm btn-primary rtl-left" :to="{ name: 'doctor.create' }">
                  <i class="fa fa-plus"></i> {{ formTranslation.doctor.add_doctor }}
                </router-link>
              </div>
            </b-col>
          </b-row>



        </template>
        <module-data-import
          v-if="userData.addOns.kiviPro && kcCheckPermission('doctor_add') && kivicareCompareVersion(requireProVersion, userData.pro_version)"
          ref="module_data_import" @reloadList="getDoctorList" :required_data="[
            { label: formTranslation.doctor.first_name, value: 'first_name' },
            { label: formTranslation.doctor.last_name, value: 'last_name' },
            { label: formTranslation.doctor.email, value: 'email' },
            { label: formTranslation.common.country_calling_code, value: 'country_calling_code' },
            { label: formTranslation.common.country_code, value: 'country_code' },
            { label: formTranslation.doctor.doctor_contact, value: 'contact' },
            { label: formTranslation.doctor.gender, value: 'gender' },
            { label: formTranslation.doctor.specilization, value: 'specialization' },
          ]" :module_name="formTranslation.common.doctors" module_type="doctor"></module-data-import>
        <ModalPopup v-if="doctorServiceOpen" modalId="doctor-list-modal" modalSize="xl" :openModal="doctorServiceOpen"
          :modalTitle="formTranslation.common.service_add" @closeModal="doctorServiceOpen = false">
          <doctorService @closeServiceModal="closeServiceModal" :props_doctor_id="serviceDoctorId" :serviceId="-1" />
        </ModalPopup>
        <ModalPopup v-if="doctorTelemedConfigurationModal" modalId="doctor-list-modal" modalSize="lg"
          :openModal="doctorTelemedConfigurationModal" :modalTitle="formTranslation.widgets.zoom_config"
          @closeModal="doctorTelemedConfigurationModal = false">
          <div class="page-loader-section" v-if="doctorTelemedConfigurationLoader">
            <loader-component-2></loader-component-2>
          </div>
          <div v-else class="m-4">
            <div class="row">
              <div class="col-md-5">
                <form id="doctor_zoom_configuration" @submit.prevent="handleZoomConfigurationSubmit" :novalidate="true">
                  <div>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group">
                          <b-form-checkbox size="lg" v-model="telemed.enableTeleMed" name="check-button" switch>
                            <span style="top: 0px !important;"><small>({{ formTranslation.common.status + ':' +
                              (['true', true].includes(telemed.enableTeleMed) ? "On" : "Off") }})</small></span>
                          </b-form-checkbox>
                        </div>
                      </div>
                    </div>
                    <div v-if="['true', true].includes(telemed.enableTeleMed)">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="api_key" class="form-control-label">{{ formTranslation.doctor.api_key }} <span
                                class="text-danger">*</span></label>
                            <input type="text" id="api_key" :placeholder="formTranslation.doctor.API_key_plh"
                              class="form-control"
                              :class="{ ' is-invalid': telemedSubmitted && $v.telemed.api_key.$error }" name="api_key"
                              v-model="telemed.api_key" />
                            <div v-if="telemedSubmitted && !$v.telemed.api_key.required" class="invalid-feedback">{{
                              formTranslation.doctor.api_key_required }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="api_secret" class="form-control-label">{{ formTranslation.doctor.api_secret }} <span
                                class="text-danger">*</span></label>
                            <input type="text" id="api_secret" :placeholder="formTranslation.doctor.API_secret_plh"
                              class="form-control" name="api_secret"
                              :class="{ ' is-invalid': telemedSubmitted && $v.telemed.api_secret.$error }"
                              v-model="telemed.api_secret" />
                            <div v-if="telemedSubmitted && !$v.telemed.api_secret.required" class="invalid-feedback">{{
                              formTranslation.doctor.api_secret_required }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <!--                        <div class="row">-->
                      <!--                          <div class="col-md-12">-->
                      <!--                            <label for="video_price" class="form-control-label">-->
                      <!--                              {{ formTranslation.doctor.video_consultation_fees }}<span-->
                      <!--                                class="text-danger"></span></label>-->
                      <!--                            <div>-->
                      <!--                              <input-->
                      <!--                                  id="video_price"-->
                      <!--                                  v-model="telemed.video_price"-->
                      <!--                                  :placeholder="formTranslation.doctor.consultation_fees" name="video_price"-->
                      <!--                                  min="0"-->
                      <!--                                  type="number"-->
                      <!--                                  class="form-control"-->
                      <!--                                  :class="{ ' is-invalid': telemedSubmitted && $v.telemed.video_price.$error }"-->
                      <!--                              >-->
                      <!--                              <div v-if="telemedSubmitted && !$v.telemed.video_price.required"-->
                      <!--                                   class="invalid-feedback">{{ formTranslation.doctor.doctor_fees_required }}-->
                      <!--                              </div>-->
                      <!--                            </div>-->
                      <!--                          </div>-->
                      <!--                        </div>-->
                    </div>
                    <div class="row mt-4">
                      <div class="col-md-12">
                        <div class="d-flex justify-content-start">
                          <button class="btn btn-primary btn-sm" type="submit" :disabled="telemedFormLoader">
                            <i :class="!telemedFormLoader ? 'fa fa-save' : 'fa fa-sync fa-spin'"></i> {{
                              !telemedFormLoader
                              ? formTranslation.common.test_and_save : formTranslation.common.loading }}
                          </button>
                          <button type="button" class="btn btn-outline-primary btn-sm"
                            @click="telemedConfigurationModalClose"> {{ formTranslation.common.cancel }}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="col-md-7" v-if="['true', true].includes(telemed.enableTeleMed)">
                <div class="row">
                  <div class="col-md-12">
                    <h4 class="text-primary mb-3">{{ formTranslation.doctor.zoom_configuration_guide }}</h4>
                  </div>
                </div>
                <b-list-group>
                  <b-list-group-item>{{ formTranslation.doctor.zoom_step1 }} <a href="https://marketplace.zoom.us/" target="_blank">
                      {{ formTranslation.doctor.zoom_market_place_portal }}</a></b-list-group-item>
                  <b-list-group-item>{{ formTranslation.doctor.zoom_step2 }}
                    <a href="https://marketplace.zoom.us/develop/create" target="_blank">{{ formTranslation.doctor.create_app }}</a>
                  </b-list-group-item>
                  <b-list-group-item>{{ formTranslation.doctor.zoom_step3 }}</b-list-group-item>
                  <b-list-group-item>{{ formTranslation.doctor.zoom_step4 }}
                  </b-list-group-item>
                  <b-list-group-item>{{ formTranslation.doctor.zoom_step5 }}
                  </b-list-group-item>
                </b-list-group>
              </div>
            </div>
          </div>
        </ModalPopup>
        <CustomForm :data="doctorCustomFormData" :viewMode="doctorCustomFormViewMode" :customFormModal="doctorCustomFormModal" v-if="doctorCustomFormModal" @closeModal="doctorCustomFormModal=false"></CustomForm>
        <AppointmentReviewCard :appointmentDetails="{}" :doctor_id="select_doctor_id"
          :appointmentReviewModal="appointmentReviewModal" v-if="appointmentReviewModal"
          @closeModal="appointmentReviewModal = false">
        </AppointmentReviewCard>
        <ModalPopup v-if="verifyPopupModal" modalId="verifymodal" modalSize="lg" :openModal="verifyPopupModal"
          :modalTitle="formTranslation.common.verified" @closeModal="verifyPopupModal = false">
          <div class="m-2">
            <div class="row border-bottom p-2">
              <div class="col-6">
                <p class="mb-0 ">
                  <span class="font-weight-bold">
                    {{ formTranslation.doctor.dt_lbl_name }} :
                  </span>
                  {{ verifyModalData.display_name }}
                </p>
              </div>
              <div class="col-6">
                <p class="mb-0 ">
                  <span class="font-weight-bold">
                    {{ formTranslation.common.contact_no }} :
                  </span>
                  {{ verifyModalData.mobile_number }}
                </p>
              </div>
            </div>
            <div class="row border-bottom p-2">
              <div class="col-12">
                <p class="mb-0 ">
                  <span class="font-weight-bold">
                    {{ formTranslation.common.email }} :
                  </span>
                  {{ verifyModalData.user_email }}
                </p>
              </div>
            </div>
            <div class="row border-bottom p-2">
              <div class="col-6">
                <p class="mb-0 ">
                  <span class="font-weight-bold">
                    {{ formTranslation.clinic.clinic }} :
                  </span>
                  {{ verifyModalData.clinic_name }}
                </p>
              </div>
              <div class="col-6">
                <p class="mb-0 ">
                  <span class="font-weight-bold">
                    {{ formTranslation.patient.reg_date }} :
                  </span>
                  {{ verifyModalData.user_registered_formated }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-12 d-flex justify-content-end">
                <button class="btn btn-primary mt-2" @click="verifyUser(verifyModalData)" :disabled="verifyButtonLoading">
                  {{ !verifyButtonLoading ? (formTranslation.common.verified + ' ' + formTranslation.service.dt_lbl_doctor) :
                    formTranslation.common.loading }}
                </button>
              </div>
            </div>
          </div>
        </ModalPopup>
        <b-row>
          <b-col sm="12" md="12" lg="12">
            <div class="page-loader-section" v-show="isLoading">
              <loader-component-2></loader-component-2>
            </div>
            <div id="doctorPrint">
              <vue-good-table ref="dataTable" :columns="doctorsList.column" :rows="doctorsList.data" mode="remote"
                :search-options="{
                  enabled: true,
                  placeholder: formTranslation.common.search_doctor_global_placeholder,
                }" @on-sort-change="onSortChange" @on-column-filter="onColumnFilter" @on-page-change="onPageChange"
                @on-per-page-change="onPerPageChange" :totalRows="totalRows" :pagination-options="{
                  enabled: true,
                  mode: 'pages',
                }" @on-search="globalFilter" styleClass="vgt-table striped"
                @on-selected-rows-change="(selected_row) => { globalCheckboxApplyData.data = selected_row }"
                :select-options="{
                  enabled: true,
                  selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
                  selectionInfoClass: 'text-primary bg-white',
                  selectionText: formTranslation.common.rows_selected,
                  clearSelectionText: formTranslation.common.clear,
                  disableSelectInfo: false, // disable the select info panel on top
                  selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
                }" compact-mode>
                <div slot="emptystate" class="text-danger text-center">
                  {{ formTranslation.common.no_data_found }}
                </div>
                <template slot="column-filter" slot-scope="{ column, updateFilters }">
                  <div v-if="column.field === 'specialties'">
                    <select class="vgt-select" v-model="serverParams.columnFilters.specialties"
                      @change="(value) => updateFilters(column, serverParams.columnFilters.specialties)">
                      <option value="">{{ column.filterOptions.placeholder }}</option>
                      <option v-for="(value, index) in specialization" :value="value.label" :key="index">{{ value.label }}
                      </option>
                    </select>
                  </div>
                </template>
                <div slot="table-actions">
                  <module-data-export :module_data="doctorsList.data" :module_name="formTranslation.doctor.doctors_list"
                    module_type="doctor" v-if="kcCheckPermission('doctor_export')"> </module-data-export>
                </div>
                <div slot="selected-row-actions">
                  <div class="d-flex justify-content-end align-items-center">
                    <select class="form-control form-control-sm" v-model="globalCheckboxApplyData.action_perform">

                      <option v-for="(option, index) in globalCheckboxApplyDataActions" :value="option.value">{{
                        option.label
                      }}</option>
                    </select>
                    <button class="ml-2 btn btn-sm btn-primary" @click="confirmDelete">
                      {{ formTranslation.common.apply }}
                    </button>
                  </div>
                </div>
                <template slot="table-row" slot-scope="props">
                  <div v-if="props.column.field == 'display_name'" class="d-flex align-items-center">
                    <img v-if="props.row.profile_image != '' && props.row.profile_image != null"
                      :src="props.row.profile_image" alt="profile_image" height="45px" width="45px"
                      style="border-radius:50%; margin-right:1rem;" />
                    <b-avatar v-else variant="primary" :text="getInitials(props.formattedRow.display_name)" class="mr-3" size="45px"></b-avatar>
                    {{ props.formattedRow.display_name }}
                    <!-- {{ props.row.profile_image != "" }} -->
                  </div>
                  <div v-else-if="props.column.field == 'specialties'">
                    {{ getSpeciality(props.row.specialties) }}
                  </div>
                  <div v-else-if="props.column.field == 'user_status'" class="d-flex">
                    <b-form-checkbox v-model="props.row.user_status"
                      v-if="props.row.user_deactivate !== 'no' && kcCheckPermission('doctor_edit')" name="check-button"
                      switch value="0" size="lg" unchecked-value="1" :id="'status_change_' + props.row.ID"
                      @change="changeModuleValueStatus({ module_type: 'doctors', id: props.row.ID, value: props.row.user_status })">
                    </b-form-checkbox>
                    <span class="badge badge-success" v-if="props.row.user_status == '0'"> {{ formTranslation.common.active }}
                    </span>
                    <span class="badge badge-danger" v-if="props.row.user_status == '1'"> {{ formTranslation.common.inactive +
                      (props.row.user_deactivate == 'no' ? ' (' + formTranslation.common.not_verified + ')' : '') }} </span>
                  </div>
                  <div class="btn-group" v-else-if="props.column.field == 'actions'">
                    <router-link v-b-tooltip.hover :title="formTranslation.common.edit"
                      v-if="kcCheckPermission('doctor_edit')" class="btn btn-sm btn-outline-primary"
                      :to="{ name: 'doctor.edit', params: { id: props.row.ID } }">
                      <i class="fa fa-pen-alt"></i>
                    </router-link>
                    <button v-b-tooltip.hover :title="formTranslation.receptionist.resend_credential"
                      v-if="kcCheckPermission('doctor_edit')" class="btn btn-outline-warning btn-sm"
                      :id="'resend_' + props.row.ID" @click="resendRequest(props.row.ID)"> <i class="fa fa-paper-plane"
                        aria-hidden="true"></i>
                    </button>
                    <router-link v-if="kcCheckPermission('doctor_session_add')" v-b-tooltip.hover
                      :title="formTranslation.common.add_session" class="btn btn-sm btn-outline-primary"
                      :to="{ name: 'doctor-session.create', params: { id: props.row.ID } }">
                      <i class="fa fa-calendar"></i>
                    </router-link>
                    <button v-b-tooltip.hover :title="formTranslation.common.service_add"
                      v-if="kcCheckPermission('service_add')" class="btn btn-sm btn-outline-primary"
                      @click="addService(props.row.ID)">
                      <i class="fa fa-server"></i>
                    </button>
                    <button v-if="props.row.user_deactivate == 'no' && getUserRole() === 'administrator'"
                      v-b-tooltip.hover :title="formTranslation.common.verify" class="btn btn-sm btn-outline-primary"
                      @click="verifyPopupModal = true; verifyModalData = props.row">
                      <i class="fas fa-check-circle"></i>
                    </button>
                    <!-- <button v-b-tooltip.hover :title="formTranslation.common.telemed"
                      class="btn btn-sm btn-outline-primary" @click="openTelemedConfigurationModal(props.row.ID)"
                      v-if="userData.addOns.telemed && kcCheckPermission('doctor_edit')">
                      <i class="fas fa-video"></i>
                    </button> -->
                    <b-button class="btn-sm" v-if="userData.addOns.kiviPro == true" variant="outline-success"
                      :id="'doctor_rating' + props.row.ID" v-b-tooltip.hover
                      :title="formTranslation.appointments.patient_review"
                      @click="select_doctor_id = props.row.ID; appointmentReviewModal = true">
                      <i class="fa fa-star" aria-hidden="true"></i>
                    </b-button>
                    <button class="btn btn-sm btn-outline-primary" v-for="(custom_form_data,key) in props.row.custom_forms" :key="key" 
                      v-if=" userData.addOns.kiviPro == true && customFormCondition(props.row,custom_form_data)" @click="customFormOpen(props.row,custom_form_data)"
                      v-b-tooltip.hover :title="custom_form_data.name && custom_form_data.name.text ? custom_form_data.name.text : '' " >
                      <i :class="(custom_form_data.name && custom_form_data.name.icon ? custom_form_data.name.icon : 'fas fa-book-medical')"></i>
                    </button>
                    <button v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt"
                      :id="'user_delete_' + props.index + 1" v-if="kcCheckPermission('doctor_delete')"
                      class="btn btn-outline-danger btn-sm" @click="deleteDoctorData(props.index + 1)"><i
                        class="fa fa-trash"></i></button>
                  </div>
                  <div v-else>
                    {{ props.column.field == 'display_name' ? '' : props.formattedRow[props.column.field] }}
                  </div>
                </template>
              </vue-good-table>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>

import { post, get } from "../../config/request";
import doctorService from "../Service/Create"
import { required } from "vuelidate/lib/validators";
import AppointmentReviewCard from "../../components/appointment/AppointmentReviewCard";
import ModalPopup from "../../components/Modal/Index"
import CustomForm from "../CustomForm/Form.vue"
export default {
  components: {
    doctorService,
    AppointmentReviewCard,
    ModalPopup,
    CustomForm
  },
  data: () => {
    return {
      isSending: false,
      isLoading: true,
      doctorsList: {
        data: [],
        column: []
      },
      clinic: [],
      filterClinic: [],
      doctorRequest: {},
      doctorSpecialization: [],
      serverParams: {
        columnFilters: {
          specialties: ''
        },
        sort: [
          {
            field: '',
            type: ''
          }
        ],
        page: 1,
        perPage: 10,
        searchTerm: '',
        type: 'list'
      },
      oldServerParams: {
        columnFilters: {

        },
        searchTerm: '',
        perPage: 10
      },
      totalRows: 0,
      verifyModalData: {},
      verifyPopupModal: false,
      verifyButtonLoading: false,
      doctorServiceOpen: false,
      serviceDoctorId: -1,
      telemed: {},
      telemedSubmitted: false,
      doctorTelemedConfigurationModal: false,
      doctorTelemedConfigurationLoader: true,
      telemedFormLoader: false,
      appointmentReviewModal: false,
      select_doctor_id: 0,
      globalCheckboxApplyData: {},
      globalCheckboxApplyDataActions: [

      ],
      doctorCustomFormData:{},
      doctorCustomFormModal:false,
      doctorCustomFormViewMode:false
    }
  },
  validations: {
    telemed: {
      api_key: { required },
      api_secret: { required },
      // video_price: {required}
    },
  },
  mounted() {
    this.init();
    this.telemed = this.defaultZoomConfifurationValue();
  },
  methods: {
    init: function () {
      this.getDoctorList();
      this.doctorsList = this.defaultDoctorDataList(this.formTranslation);
      this.globalCheckboxApplyData = this.defaultGlobalCheckboxApplyData()
      this.globalCheckboxApplyDataActions = this.defaultGlobalCheckboxApplyDataActions()

      setTimeout(() => {
        this.clinic = this.clinics
        this.clinic.forEach(element => {
          this.filterClinic.push({ value: element.id, text: element.label })
        });
      }, 1000)
    },
    defaultGlobalCheckboxApplyData() {
      return {
        action_perform: 'delete',
        module: 'doctors',
        data: []
      }
    },
    defaultGlobalCheckboxApplyDataActions: function () {
      return [
        {
          value: "active",
          label: this.formTranslation.service.dt_active
        },
        {
          value: "inactive",
          label: this.formTranslation.service.dt_inactive
        },
        {
          value: "resend_credential",
          label: this.formTranslation.receptionist.resend_credential
        },
        {
          value: "delete",
          label: this.formTranslation.clinic_schedule.dt_lbl_dlt
        },
      ]
    },
    getDoctorList: function () {
      get('doctor_list', this.serverParams)
        .then((data) => {
          if (data.data.status !== undefined && data.data.status === true) {
            this.isLoading = false;
            this.doctorsList.data = data.data.data;
            this.totalRows = data.data.total_rows;
          } else {
            this.isLoading = false;
            this.doctorsList.data = [];
            this.totalRows = 0;
          }
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error);
        })
    },
    defaultDoctorDataList: function () {
      return {
        column: [
          {
            field: 'ID',
            label: this.formTranslation.common.id,
            width: '70px',
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: this.formTranslation.common.id,
              filterValue: '',
            },
          },
          {
            field: 'display_name',
            width: '100px',
            label: this.formTranslation.doctor.dt_lbl_name,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.doctor.dt_name_filter_plh,
              filterValue: '',
            }
          },
          {
            field: 'clinic_name',
            label: this.formTranslation.doctor.dt_lbl_clinic_name,
            sortable: false,
            filterOptions: {
              enabled: this.userData.addOns.kiviPro && ['administrator'].includes(this.getUserRole()),
              filterValue: '',
              filterDropdownItems: this.filterClinic
            }
          },
          {
            field: 'user_email',
            label: this.formTranslation.doctor.dt_lbl_email,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.doctor.dt_email_fltr_plh,
              filterValue: '',
            }
          },
          {
            field: 'mobile_number',
            label: this.formTranslation.doctor.dt_lbl_mobile_number,
            width: '150px',
            sortable: false,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.doctor.dt_mobile_fltr_number,
              filterValue: '',
            }
          },
          {
            field: 'specialties',
            label: this.formTranslation.doctor.dt_lbl_specialties,
            sortable: false,
            width: '200px',
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: this.formTranslation.doctor.dt_specialities_filter_plh,
              filterValue: '',
            },
            html: true
          },
          {
            field: 'user_status',
            label: this.formTranslation.service.dt_lbl_status,
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: this.formTranslation.static_data.dt_lbl_plh_sr_fltr_status,
              filterDropdownItems: [
                { value: '0', text: this.formTranslation.common.active },
                { value: '1', text: this.formTranslation.common.inactive }],
                filterValue: '',
            },
            html: true
          },
          {
            field: 'actions',
            label: this.formTranslation.doctor.dt_lbl_actions,
            sortable: false
          }
        ],
        data: []
      }
    },
    updateParams: function (newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
      this.getDoctorList()
    },

    onPageChange(params) {
      this.updateParams({ page: params.currentPage });
    },

    onPerPageChange(params) {
      if (this.oldServerParams.perPage === params.currentPerPage) {
        return;
      }
      this.oldServerParams.perPage = params.currentPerPage;
      this.updateParams({ perPage: params.currentPerPage, page: params.currentPage });
    },

    onSortChange(params) {
      this.updateParams({
        sort: params,
      });
    },
    globalFilter: _.debounce(function (params) {

      if (this.oldServerParams.searchTerm === params.searchTerm) {
        return;
      }
      this.oldServerParams.searchTerm = params.searchTerm;
      this.updateParams({ searchTerm: params.searchTerm, perPage: this.serverParams.perPage, page: 1 });
    }, 300),
    onColumnFilter: _.debounce(function (params) {
      var emptyValue = true;
      var emptyValue2 = true;
      Object.values(params.columnFilters).map(function (value, index, array) {
        if (value) {
          emptyValue = false;
        }
      })
      Object.values(this.oldServerParams.columnFilters).map(function (value, index, array) {
        if (value) {
          emptyValue2 = false;
        }
      })
      if (!emptyValue || !emptyValue2) {
        this.oldServerParams.columnFilters = Object.assign({}, params.columnFilters)
        this.updateParams({ columnFilters: params.columnFilters, perPage: this.serverParams.perPage, page: 1 });
      }
    }, 300),
    deleteDoctorData: function (index) {
      if (this.doctorsList.data[index - 1] !== undefined) {
        let ele = $('#user_delete_' + index);
        $.confirm({
          title: this.formTranslation.clinic_schedule.dt_are_you_sure,
          content: this.formTranslation.clinic_schedule.dt_delete_doctor_appointment,
          type: 'red',
          buttons: {
            ok: {
              text: this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                ele.prop('disabled', true);
                $(ele).find('i').removeClass('fa fa-trash')
                $(ele).find('i').addClass('fa fa-sync fa-spin')
                get('doctor_delete', {
                  id: this.doctorsList.data[index - 1].ID
                })
                  .then((data) => {
                    if (this.getUserRole() === 'administrator') {
                      this.$store.dispatch("userDataModule/fetchUserData", {});
                    }
                    ele.prop('disabled', false);
                    $(ele).find('i').removeClass('fa fa-sync fa-spin')
                    $(ele).find('i').addClass('fa fa-trash')
                    if (data.data.status !== undefined && data.data.status === true) {
                      this.doctorsList.data.splice((index - 1), 1);
                      displayMessage(data.data.message);
                    }
                  })
                  .catch((error) => {
                    ele.prop('disabled', false);
                    $(ele).find('i').removeClass('fa fa-sync fa-spin')
                    $(ele).find('i').addClass('fa fa-trash')
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                  })
              }
            },
            cancel: {
              text: this.formTranslation.common.cancel
            }
          }
        });
      }
    },

    confirmDelete() {
      let content = '';
      if (this.globalCheckboxApplyData.action_perform === 'delete') {
        content = this.formTranslation.common.py_delete;
      } else if (this.globalCheckboxApplyData.action_perform === 'resend_credential') {
        content = this.formTranslation.common.py_resend_credential;
      } else if (this.globalCheckboxApplyData.action_perform === 'active' || this.globalCheckboxApplyData.action_perform === 'inactive') {
        content = this.formTranslation.common.py_status;
      }
      $.confirm({
        title: this.formTranslation.clinic_schedule.dt_are_you_sure,
        content: content,
        type: 'red',
        buttons: {
          ok: {
            text: this.formTranslation.common.yes,
            btnClass: 'btn-danger',
            keys: ['enter'],
            action: () => {        
              this.globalCheckboxApply();
            }
          },
          cancel:{
            text:this.formTranslation.common.cancel
          }
        }
      });
    },

    globalCheckboxApply() {
      this.isLoading = true;
      post('module_wise_multiple_data_update', this.globalCheckboxApplyData)
        .then((data) => {
          this.isLoading = false;
          if (data.data.status !== undefined && data.data.status === true) {
            displayMessage(data.data.message);
            this.getDoctorList();
          } else {
            displayErrorMessage(data.data.message)
          }
        })
        .catch((error) => {
          this.isLoading = true;
          console.log(error);
        })
    },
    addService(id) {
      this.serviceDoctorId = id;
      this.doctorServiceOpen = true;
    },
    closeServiceModal() {
      this.doctorServiceOpen = false;
    },
    resendRequest: function (id) {
      var element = $('#resend_' + id).find("i");
      element.removeClass('fa fa-paper-plane ')
      element.addClass("fa fa-spinner fa-spin");
      post('resend_credential', { id: id })
        .then((data) => {
          element.removeClass("fa fa-spinner fa-spin");
          element.addClass("fa fa-paper-plane")
          if (data.data.status !== undefined && data.data.status === true) {
            displayMessage(data.data.message)
          } else {
            displayErrorMessage(data.data.message)
          }
        })
        .catch((error) => {
          console.log(error);
        })
    },
    verifyUser(data) {
      this.verifyButtonLoading = true;
      post('verify_user', { data: data })
        .then((response) => {
          this.verifyButtonLoading = false;
          if (response.data.status !== undefined && response.data.status === true) {
            displayMessage(response.data.message);
            this.verifyPopupModal = false;
            this.getDoctorList();
          } else {
            displayErrorMessage(response.data.message);
          }
        }).catch((error) => {
          this.verifyButtonLoading = false;
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error);
        })
    },
    defaultZoomConfifurationValue() {
      return {
        enableTeleMed: 'off',
        api_key: '',
        api_secret: '',
        zoom_id: '',
        video_price: ''
      }
    },
    handleZoomConfigurationSubmit() {
      this.$v.$touch();
      this.telemedSubmitted = true;
      if (this.$v.telemed.$invalid) {
        return;
      }
      this.telemedSubmitted = false;
      this.telemedFormLoader = true;
      let configRequest = {
        api_key: this.telemed.api_key,
        api_secret: this.telemed.api_secret,
        doctor_id: this.telemed.doctor_id,
        enableTeleMed: this.telemed.enableTeleMed,
        video_price: this.telemed.video_price
      }
      post('save_doctor_zoom_configuration', configRequest).then((response) => {
        this.telemedFormLoader = false;
        if (response.data.status !== undefined && response.data.status === true) {
          displayMessage(response.data.message);
          this.telemedConfigurationModalClose();
        } else {
          displayErrorMessage(response.data.message);
        }
      }).catch((error) => {
        this.telemedFormLoader = false;
        console.log(error);
        displayErrorMessage(this.formTranslation.common.internal_server_error);
      })

    },
    telemedConfigurationModalClose() {
      this.telemedSubmitted = false;
      this.doctorTelemedConfigurationModal = false;
      this.telemed = this.defaultZoomConfifurationValue()
      this.doctorTelemedConfigurationLoader = true
      this.telemedFormLoader = false
    },
    openTelemedConfigurationModal(id) {
      this.doctorTelemedConfigurationModal = true;
      this.getConfigurationData(id)
    },
    getConfigurationData: function (id) {
      this.doctorTelemedConfigurationLoader = true
      get('get_doctor_zoom_configuration', {
        user_id: id
      })
        .then((response) => {
          this.doctorTelemedConfigurationLoader = false;
          if (response.data.status !== undefined && response.data.status === true) {
            this.telemed = response.data.data;
            this.telemed.doctor_id = id;
          } else {
            displayErrorMessage(response.data.message)
          }
        })
        .catch((error) => {
          console.log(error);
          this.doctorTelemedConfigurationLoader = false;
          displayErrorMessage(this.formTranslation.common.internal_server_error)
        })
    },
    getInitials(name) {
      if(name !== undefined && name !== '' && name !== null){
        const patient_name = name.split(" ");
        const initials = patient_name.map(patient_name => patient_name.charAt(0).toUpperCase());
        return initials.join("");
      }else{
        return ' - ';
      }
    },
    customFormOpen(props,custom_form_data){
        this.doctorCustomFormData = custom_form_data;
        this.doctorCustomFormData.module_id = props.ID;
        this.doctorCustomFormViewMode = false;
        this.doctorCustomFormModal = true;
    },
    customFormCondition(props,custom_form_data){
      return props.custom_forms && props.custom_forms.length 
      &&  (custom_form_data.clinic_ids.length === 0 || custom_form_data.clinic_ids.some(value => props.clinic_id.includes(value)))
    }
  },
  computed: {
    doctorListExport() {
      return 'Doctor List - ' + moment().format('YYYY-MM-DD');
    },
    getSpeciality: function () {
      return (salut) => {
        if (salut !== undefined && salut !== null && salut.length > 0) {
          let specialties = '';
          if (typeof salut !== 'string') {
            salut.map(function (spec, index) {
              specialties += (salut.length === (index + 1) ? spec.label : spec.label + ', ');
              return spec;
            });
            return specialties;
          } else {
            return salut;
          }
        }
        return ' - ';
      }
    },
    clinics() {
      return this.$store.state.clinic
    },
    userData() {
      return this.$store.state.userDataModule.user;
    },
    specialization() {
      if (this.$store.state.staticDataModule.static_data.specialization !== undefined
        && this.$store.state.staticDataModule.static_data.specialization.length > 0) {
        return this.$store.state.staticDataModule.static_data.specialization;
      }
      return [];
    },
  },
  watch: {
  }
}

</script>
<style>
#verifymodal header {
  min-height: unset;
}
</style>