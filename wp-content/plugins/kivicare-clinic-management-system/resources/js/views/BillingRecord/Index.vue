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
            <b-row>
              <b-col sm="12" md="8" lg="8">
                <h3 class="mb-0">{{ formTranslation.patient_bill.bills }}</h3>
              </b-col>
              <b-col sm="12" md="4" lg="4">
                <div class="d-flex justify-content-end">
                  <button class="btn btn-sm btn-primary"
                          v-if="kcCheckPermission('patient_bill_add') && !billCreateModel"
                          @click="billCreateModel = !billCreateModel">
                    <i class="fa fa-plus"></i> {{ formTranslation.patient_bill.add_bill }}
                  </button>
                  <button class="btn btn-sm btn-primary" v-if="kcCheckPermission('patient_bill_add') && billCreateModel"
                          @click="billCreateModel = !billCreateModel">
                    <i class="fa fa-minus"></i> {{ formTranslation.common.close }}
                  </button>
                </div>
              </b-col>
            </b-row>
          </template>
          <ModalPopup
          v-if="billCreateModel"
          modalId="bill-create-modal"
          modalSize="lg"
          :openModal="billCreateModel"
          :modalTitle="formTranslation.patient_bill.add_new_bill"
          @closeModal="billCreateModel = false"
          >
          <div class="m-2">
                <div v-if="withoutBillEncounterData.length > 0">
                  <div class="row p-2">
                    <div class="col-8">
                      <b-select name="status" v-model="selected_encounter_id" id="status" class="form-control"
                                @change="encounterSelect">
                        <option value="">
                          {{ formTranslation.reports.plh_select + ' ' + formTranslation.patient_encounter.encounters + ' ' + formTranslation.common.id }}
                        </option>
                        <option v-for="(index,key) in withoutBillEncounterData" :key="key" :value="index.id">
                          {{ formTranslation.patient_encounter.encounters + '#' + index.id }}
                        </option>
                      </b-select>
                      <div v-if="generateBillSubmittedFalse" class="invalid-feedback">
                        {{ formTranslation.patient_encounter.encounters + ' ' + formTranslation.common.id + ' ' + formTranslation.common.required }}
                      </div>
                    </div>
                    <div class="col-4">
                      <button class="btn btn-primary" @click="generateBill" :disabled="generateBillLoader">
                        {{ generateBillLoader ? formTranslation.common.loading : formTranslation.patient_bill.generate_bill }}
                      </button>
                    </div>
                  </div>
                  <div v-if="selected_encounter_id != ''">
                    <hr class="mt-1 mb-1">
                    <div class="row p-2">
                      <div class="col-12">
                        <h4 class="text-primary text-center pb-0 mb-0">
                          {{ formTranslation.patient_encounter.encounter_details }} </h4>
                      </div>
                    </div>
                    <div class="row p-2">
                      <div
                          v-if="(userData.addOns.kiviPro == true && (getUserRole() == 'administrator' || getUserRole() == 'doctor'))"
                          class="col-md-6">
                        <p class="mb-0 ">
                       <span class="font-weight-bold">
                        {{ formTranslation.clinic.clinic }} :
                       </span>
                          {{ encounterData.clinic_name }}
                        </p>
                      </div>
                      <div v-if="getUserRole() != 'doctor'" class="col-md-6">
                        <p class="mb-0 ">
                       <span class="font-weight-bold">
                        {{ formTranslation.common.doctor }} :
                       </span>
                          {{ encounterData.doctor_name }}
                        </p>
                      </div>
                    </div>
                    <div class="row p-2">
                      <div class="col-md-6">
                        <p class="mb-0 ">
                       <span class="font-weight-bold">
                        {{ formTranslation.common.patient }} :
                       </span>
                          {{ encounterData.patient_name }}
                        </p>
                      </div>
                      <div class="col-md-6">
                        <p class="mb-0 ">
                       <span class="font-weight-bold">
                        {{ formTranslation.common.date }} :
                       </span>
                          {{ encounterData.encounter_date }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="row">
                  <div class="col-12">
                    <h4 class="text-danger text-center mtb-20">
                      {{ formTranslation.patient_bill.no_encounter_found_for_billing }}</h4>
                  </div>
                </div>
              </div>
          </ModalPopup>
          <ModalPopup
          v-if="billEditDetailsModel"
          modalId="bill-details-modal"
          modalSize="lg"
          :openModal="billEditDetailsModel"
          :modalTitle="formTranslation.patient_bill.invoice_detail"
          @closeModal="billEditDetailsModel = false"
          >
          <BillForm v-if="getUserRole() !== 'patient'" :encounterId="encounterId" :checkOutVal="checkOutVal"
                      @onBillSaved="handleBillSave" @onBillCancel="handleBillCancel" :appointmentData="encounterData"
                      :clinic_extra="clinic_extra" :doctorId="doctorId"/>
          </ModalPopup>
          <ModalPopup
          v-if="billDetailsModel"
          modalId="bill-details-modal"
          modalSize="lg"
          :openModal="billDetailsModel"
          :modalTitle="formTranslation.patient_bill.invoice_detail"
          @closeModal="billDetailsModel = false"
          >
          <BillDetails :encounterId="encounterId" :clinic_extra="clinic_extra" @onBillCancel="handleBillCancel"/>
          </ModalPopup>
          <b-row>
            <b-col sm="12" md="12" lg="12">
              <div class="page-loader-section" v-show="pageLoader">
                <loader-component-2></loader-component-2>
              </div>
              <div id="billingTable" >
                <vue-good-table
                    ref="dataTable"
                    :columns="billingList.column"
                    :rows="billingList.data"
                    mode="remote"
                    :search-options="{
                    enabled: true,
                    placeholder:formTranslation.common.search_bills_data_global_placeholder,
                  }"
                    @on-sort-change="onSortChange"
                    @on-column-filter="onColumnFilter"
                    @on-page-change="onPageChange"
                    @on-per-page-change="onPerPageChange"
                    :totalRows="totalRows"
                    :pagination-options="{
                     enabled: true,
                     mode: 'pages',
                  }"
                    @on-search="globalFilter"
                    styleClass="vgt-table striped"
                    compactMode
                >
                  <div slot="emptystate" class="text-danger text-center">
                    {{ formTranslation.common.no_data_found }}
                  </div>
                  <div slot="table-actions">
                    <module-data-export :module_data="billingList.data" :module_name="formTranslation.patient_bill.bills"  module_type="billings" v-if="kcCheckPermission('patient_bill_export')"> </module-data-export>
                  </div>
                  <template slot="column-filter" slot-scope="{ column, updateFilters }">
                    <div v-if="column.field === 'created_at'" class="d-inline-flex justify-content-start align-items-center">
                      <vc-date-picker
                          id="appointmentDate"
                          title-position="left"
                          @input="(value) => updateFilters(column, serverParams.columnFilters.created_at)"
                          v-model="serverParams.columnFilters.created_at"
                          :popover="{ visibility: 'click' }"
                          is-expanded
                          mode='range'
                      >
                        <template v-slot="{ inputValue}">
                          <input
                              :value="inputValue"
                              class="form-control-sm w-100"
                              :placeholder="formTranslation.appointments.plh_date"
                              style="border: #fff"
                          />
                        </template>
                      </vc-date-picker>
                      <span class="form-control-sm" @click="updateFilters(column, serverParams.columnFilters.created_at='')">X</span>
                    </div>
                  </template>
                  <template slot="table-row" slot-scope="props">
                    <div v-if="props.column.field == 'created_at'">
                      {{ props.row.created_at }}
                    </div>
                    <div v-else-if="props.column.field == 'patient_id'">
                      {{ props.row.patient_name }}
                    </div>
                    <div v-else-if="props.column.field == 'status'">
                      <span class="badge badge-success"
                            v-if="props.row.status == '0'"> {{ formTranslation.patient_bill.paid }} </span>
                      <span class="badge badge-danger"
                            v-if="props.row.status == '1'"> {{ formTranslation.patient_bill.unpaid }} </span>
                    </div>
                    <div class="btn-group" v-else-if="props.column.field =='actions' && props.row.last_row !== 'yes'">
                      <button
                          v-if="kcCheckPermission('patient_bill_edit') && props.row.status == '1' && getUserRole() !== 'patient'"
                          v-b-tooltip.hover
                          :title="formTranslation.common.edit"
                          @click="billModelOpen(props.row,'edit')"
                          class="btn btn-sm btn-outline-primary">
                        <i class="fa fa-pen-alt"></i>
                      </button>
                      <button
                          v-if="kcCheckPermission('patient_bill_view')"
                          v-b-tooltip.hover
                          :title="formTranslation.patient_bill.bill_details"
                          @click="billModelOpen(props.row,'detail')"
                          class="btn btn-sm btn-outline-primary">
                        <i class="fa fa-file-invoice"></i>
                      </button>
                      <b-button v-if="kcCheckPermission('patient_encounter_view')" class="btn-sm" variant="outline-primary" v-b-tooltip.hover
                                :title="formTranslation.patient_encounter.encounter_details"
                                :to="{ name: 'patient-encounter.dashboard', params: { encounter_id: props.row.id } }">
                        <i class="fas fa-tachometer-alt"></i>
                      </b-button>
                    </div>
                    <div v-else>
                      {{ props.formattedRow[props.column.field] }}
                    </div>
                  </template>
                </vue-good-table>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-overlay>
    </b-col>
  </b-row>
</template>

<script>

import {post, get} from "../../config/request";
import BillDetails from "../../components/PatientBill/BillDetails";
import BillForm from "../../components/PatientBill/BillForm";
import ModalPopup from '../../components/Modal/Index'

export default {
  components: {BillDetails,BillForm,ModalPopup},
  data: () => {
    return {
      pageLoader: true,
      billingList: {
        data:[],
        column:[]
      },
      serverParams: {
        columnFilters: {
          service_type:''
        },
        sort: [
          {
            field: '',
            type: ''
          }
        ],
        page: 1,
        perPage: 10,
        searchTerm:''
      },
      oldServerParams:{
        columnFilters:{

        },
        searchTerm:'',
        perPage:10
      },
      totalRows: 0,
      clinic_extra:{
        prefix:"",
        postfix:""
      },
      billDetailsModel:false,
      billEditDetailsModel:false,
      encounterId: 0,
      checkOutVal: 0,
      encounterData:{},
      doctorId:0,
      billCreateModel:false,
      selected_encounter_id:'',
      withoutBillEncounterData:[],
      generateBillSubmittedFalse:false,
      generateBillLoader:false
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function () {
      if(this.kcCheckPermission('patient_bill_add')){
        this.getWithoutBillEncounterList();
      }
      this.billingList = this.defaultbillingList()
      this.getBillingDataList();
    },
    defaultbillingList: function () {
      return {
        column: [
          {
            field: 'bill_id',
            label: this.formTranslation.common.id,
            width:'50px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.common.id,
              filterValue: '',
              trigger: 'enter'
            }
          },
          {
            field: 'id',
            label: this.formTranslation.common.encounter_id,
            width:'130px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.common.encounter_id,
              filterValue: '',
              trigger: 'enter'
            }
          },
          {
            field: 'doctor_name',
            label: this.formTranslation.patient_encounter.dt_lbl_doc_name,
            width:'150px',
            hidden: this.doctorField,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.patient_encounter.dt_plh_fltr_by_doc,
              filterValue: '',
              trigger: 'enter'
            }
          },
          {
            field: 'clinic_name',
            label: this.formTranslation.patient_encounter.dt_lbl_clinic,
            width:'150px',
            filterOptions: {
              enabled: !(window.request_data.current_user_role === 'kiviCare_clinic_admin' || window.request_data.current_user_role === 'kiviCare_receptionist'),
              placeholder: this.formTranslation.patient_encounter.dt_plh_fltr_by_clinic,
              filterValue: '',
              trigger: 'enter'
            }
          },
          {
            field: 'patient_name',
            label: this.formTranslation.patient_encounter.dt_lbl_patient,
            width:'150px',
            hidden: this.patientField,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.patient_encounter.dt_plh_fltr_patient,
              filterValue: '',
              trigger: 'enter'
            }
          },
          {
            field: 'service_name',
            width:'180px',
            label: this.formTranslation.common.services,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.service.dt_plh_name_fltr,
              filterValue: '',
              trigger: 'enter'
            }
          },
          {
            field: 'total_amount',
            label: this.formTranslation.common.total,
            width:'50px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.common.total,
              filterValue: '',
              trigger: 'enter'
            }
          },
          {
            field: 'discount',
            label: this.formTranslation.patient_bill.discount,
            width:'100px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.patient_bill.discount,
              filterValue: '',
              trigger: 'enter'
            }
          },
          {
            field: 'actual_amount',
            label: this.formTranslation.patient_bill.amount_due,
            width:'130px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.patient_bill.amount_due,
              filterValue: '',
              trigger: 'enter'
            }
          },
          {
            field: 'created_at',
            label: this.formTranslation.patient_encounter.dt_lbl_name,
            width:'160px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.patient_encounter.dt_plh_fltr_date,
              filterValue: '',
              trigger: 'enter'
            }
          },
          {
            field: 'status',
            label: this.formTranslation.common.status,
            width:'100px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.static_data.dt_lbl_plh_sr_fltr_status,
              filterValue: '',
              filterDropdownItems: [
                { value: '1', text: this.formTranslation.patient_bill.unpaid },
                { value: '0', text: this.formTranslation.patient_bill.paid }  ],
                trigger: 'enter'
            }
          },
          {
            field: 'actions',
            width:'100px',
            sortable:false,
            label: this.formTranslation.patient_encounter.dt_lbl_action,
            html: true
          }
        ],
        data: []
      }
    },
    getWithoutBillEncounterList(){
      get('get_without_bill_encounter_list', {})
          .then((data) => {
            if (data.data.status !== undefined && data.data.status === true) {
              this.withoutBillEncounterData = data.data.data;
            }else{
              this.withoutBillEncounterData = []
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    getBillingDataList: function () {
      this.pageLoader = true;
      let serverParams = Object.assign({},this.serverParams)
      if(serverParams.columnFilters.created_at && serverParams.columnFilters.created_at.start && serverParams.columnFilters.created_at.end){
        serverParams.columnFilters.created_at.start = moment(serverParams.columnFilters.created_at.start).format('YYYY-MM-DD')
        serverParams.columnFilters.created_at.end = moment(serverParams.columnFilters.created_at.end).format('YYYY-MM-DD')
      }
      get('billing_record_list', serverParams)
          .then((data) => {
            this.pageLoader = false;
            if (data.data.status !== undefined && data.data.status === true) {
              this.billingList.data = [];
              this.billingList.data = data.data.data
              this.totalRows = data.data.total_rows;
              if(data.data.clinic_extra !== undefined){
                this.clinic_extra = data.data.clinic_extra;
              }
            }else{
              this.pageLoader = false;
              this.billingList.data = [];
              this.totalRows = 0;
            }
          })
          .catch((error) => {
            this.pageLoader = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    updateParams: function(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
      this.getBillingDataList()
    },

    onPageChange(params) {
      this.updateParams({page: params.currentPage});
    },

    onPerPageChange(params) {
      if(this.oldServerParams.perPage === params.currentPerPage){
        return ;
      }
      this.oldServerParams.perPage = params.currentPerPage;
      this.updateParams({perPage: params.currentPerPage,page: params.currentPage});
    },

    onSortChange(params) {
      this.updateParams({
        sort: params,
      });
    },
    globalFilter:_.debounce(function(params) {

      if(this.oldServerParams.searchTerm === params.searchTerm){
        return;
      }
      this.oldServerParams.searchTerm = params.searchTerm;
      this.updateParams({searchTerm: params.searchTerm,perPage: this.serverParams.perPage,page: 1});
    },300),
    onColumnFilter:_.debounce(function(params) {
      var emptyValue =  true;
      var emptyValue2 = true;
      Object.values(params.columnFilters).map(function (value, index, array){
        if(value){
          emptyValue = false;
        }
      })
      Object.values(this.oldServerParams.columnFilters).map(function (value, index, array){
        if(value){
          emptyValue2 = false;
        }
      })
      if(!emptyValue || !emptyValue2){
        this.oldServerParams.columnFilters = Object.assign({}, params.columnFilters)
        this.updateParams({columnFilters:params.columnFilters,perPage: this.serverParams.perPage,page: 1});
      }
    },300),
    billModelOpen(data,type){
      this.encounterId =  data.id;
      this.encounterData = data;
      this.doctorId = data.doctor_id;
      if(data.appointment_id !== null && data.appointment_id !== ''){
        this.checkOutVal = 1
      }
      if(type === 'edit'){
        this.billEditDetailsModel = true;
      }else{
        this.billDetailsModel  = true;
      }
    },
    handleBillSave: function (data) {
      this.billDetailsModel  = false;
      this.billEditDetailsModel = false;
      this.encounterId =  0;
      this.encounterData = {};
      this.doctorId = 0;
      this.checkOutVal = 0;
      this.getBillingDataList();
      if(this.kcCheckPermission('patient_bill_add')){
        this.getWithoutBillEncounterList();
      }
    },
    handleBillCancel:function (){
      this.billDetailsModel  = false;
      this.billEditDetailsModel = false;
      this.encounterId = 0;
      this.encounterData = {};
      this.doctorId = 0;
      this.checkOutVal = 0;
    },
    generateBill(){
      if(this.selected_encounter_id === '' || parseInt(this.selected_encounter_id ) <= 0){
        this.generateBillSubmittedFalse = true;
        return
      }
      this.generateBillLoader = true;
      this.generateBillSubmittedFalse = false;

      let _this = this;
      let data = this.withoutBillEncounterData.filter(function (value,key){
        return _this.selected_encounter_id == value.id
      })

      if(data.length > 0 ){
        this.billModelOpen(data[0],'edit')
      }
      this.generateBillLoader = false;
      this.billCreateModel = false;
      this.selected_encounter_id = '';
    },
    encounterSelect(){
      if(this.selected_encounter_id === '' || parseInt(this.selected_encounter_id ) <= 0){
        return
      }
      let _this = this;
      let data = this.withoutBillEncounterData.filter(function (value,key){
        return _this.selected_encounter_id == value.id
      })

      if(data.length > 0 ){
        this.encounterData = data[0];
      }
    }
  },
  computed: {
    servicesListExport() {
      return 'Billing List - ' + moment().format('YYYY-MM-DD');
    },
    userData() {
      return this.$store.state.userDataModule.user;
    },
  },
  watch: {}
}
</script>

<style >
#billingTable table tbody tr:last-child td{
  color: var(--primary);
  font-weight: 600;
}

@media (max-width: 576px){
  #billingTable .vgt-compact td:before{
    width: 52%;
    padding-left: 0;
  }
}

</style>
