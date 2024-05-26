<template>
  <b-row>
    <b-col sm="12">
      <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row class="align-items-center">
            <b-col sm="6" md="8" lg="8">
              <h3 class="h3 mb-0">{{ formTranslation.clinic.receptionists_list }}</h3>
            </b-col>
            <b-col sm="6" md="4" lg="4" v-if="kcCheckPermission('receptionist_add')">
              <div class="d-flex justify-content-end  align-items-center">
                <button v-if="userData.addOns.kiviPro && kivicareCompareVersion(requireProVersion,userData.pro_version)" class="float-right btn btn-sm btn-primary rtl-left"  @click="$refs.module_data_import.openModel = true" >
                  <i class="fas fa-file-import"></i>{{formTranslation.common.import_data}}
                </button>
                <router-link class="float-right btn btn-sm btn-primary"  :to="{ name: 'receptionist.create' }">
                  <i class="fa fa-plus"></i> {{formTranslation.clinic.add_receptionist}}
                </router-link>
              </div>
            </b-col>
          </b-row>
          
        </template>
        <module-data-import v-if="userData.addOns.kiviPro && kcCheckPermission('receptionist_add') && kivicareCompareVersion(requireProVersion,userData.pro_version)" ref="module_data_import" @reloadList="getReceptionistList"
          :required_data="[
              {label:formTranslation.receptionist.first_name,value:'first_name'},
              {label:formTranslation.receptionist.last_name,value:'last_name'},
              {label:formTranslation.receptionist.email,value:'email'},
              {label: formTranslation.common.country_calling_code, value: 'country_calling_code' },
              {label: formTranslation.common.country_code, value: 'country_code' },
              {label:formTranslation.receptionist.receptionist_contact,value:'contact'},
              {label:formTranslation.receptionist.gender,value:'gender'},
            ]" :module_name="formTranslation.common.receptionist" module_type="receptionist"></module-data-import>
        <ModalPopup
          v-if="verifyPopupModal"
          modalId="appointment-details-modal"
          modalSize="md"
          :openModal="verifyPopupModal"
          :modalTitle="formTranslation.common.verified"
          @closeModal="verifyPopupModal=false"
        >
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
              <div class="row p-2">
                <div class="col-12 d-flex justify-content-end">
                  <button class="btn btn-primary mt-2" @click="verifyUser(verifyModalData)"  :disabled="verifyButtonLoading">
                    {{ !verifyButtonLoading ? (formTranslation.common.verified+ ' '+formTranslation.clinic.receptionist) : formTranslation.common.loading}}
                  </button>
                </div>
              </div>
            </div>
        </ModalPopup>
        <b-row>
          <b-col sm="12" md="12" lg="12">
            <div class="page-loader-section" v-show="pageLoader">
              <loader-component-2></loader-component-2>
            </div>
            <div id="receptionistPrint" >
              <vue-good-table
                ref="dataTable"
                :columns="receptionistsList.column"
                :rows="receptionistsList.data"
                mode="remote"
                :search-options="{
                    enabled: true,
                    placeholder:formTranslation.common.search_receptionist_global_placeholder,
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
                @on-selected-rows-change="(selected_row) => { globalCheckboxApplyData.data = selected_row }"
                :select-options="{
                  enabled: true,
                  selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
                  selectionInfoClass: 'text-primary bg-white',
                  selectionText: formTranslation.common.rows_selected,
                  clearSelectionText: formTranslation.common.clear,
                  disableSelectInfo: false, // disable the select info panel on top
                  selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
                }" compact-mode
            >
                <div slot="emptystate" class="text-danger text-center">
                  {{formTranslation.common.no_data_found}}
                </div>
              <div slot="table-actions">
                <module-data-export :module_data="receptionistsList.data" :module_name="formTranslation.clinic.receptionists_list"  module_type="receptionist" v-if="kcCheckPermission('receptionist_export')"> </module-data-export>
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
                    <img v-if="props.row.profile_image != '' && props.row.profile_image != null" :src="props.row.profile_image" alt="profile_image"  height="45px" width="45px" style="border-radius:50%; margin-right:1rem;"/>
                    <b-avatar v-else variant="primary" :text="getInitials(props.formattedRow.display_name)" class="mr-3" size="45px"></b-avatar>
                    {{props.formattedRow.display_name}}
                    <!-- {{ props.row.profile_image != "" }} -->
                </div>
                <div v-else-if="props.column.field == 'user_status'" class="d-flex">
                  <b-form-checkbox
                      v-model="props.row.user_status"
                      v-if="props.row.user_deactivate !== 'no' && kcCheckPermission('receptionist_edit')"
                      name="check-button"
                      switch
                      value="0"
                      size="lg"
                      unchecked-value="1"
                      :id="'status_change_' + props.row.ID"
                      @change="changeModuleValueStatus({module_type:'doctors',id: props.row.ID,value:props.row.user_status})"
                  >
                  </b-form-checkbox>
                  <span class="badge badge-success" v-if="props.row.user_status == '0'"> {{formTranslation.common.active}} </span>
                  <span class="badge badge-danger" v-if="props.row.user_status == '1'"> {{formTranslation.common.inactive + (props.row.user_deactivate == 'no' ? ' (' +formTranslation.common.not_verified+')' : '') }} </span>
                </div>
                <div class="btn-group" v-else-if="props.column.field =='actions'">
                  <router-link  v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_edit" v-if="kcCheckPermission('receptionist_edit')" class="btn btn-sm btn-outline-primary"
                                :to="{ name: 'receptionist.edit', params: { id: props.row.ID } }">
                    <i class="fa fa-pen-alt"></i>
                  </router-link>
                  <button
                      v-b-tooltip.hover :title="formTranslation.receptionist.resend_credential"
                      :id ="'resend_'+ props.row.ID"
                      v-if="kcCheckPermission('receptionist_edit')" class="btn btn-outline-warning btn-sm"
                      @click="resendRequest(props.row.ID)"> <i class="fa fa-paper-plane" aria-hidden="true"></i>
                  </button>
                  <button v-if="props.row.user_deactivate == 'no' && getUserRole() === 'administrator'" v-b-tooltip.hover :title="formTranslation.common.verified"  class="btn btn-sm btn-outline-primary" @click="verifyPopupModal = true;verifyModalData=props.row">
                    <i class="fas fa-check-circle"></i>
                  </button>
                  <button v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt" :id="'user_delete_'+props.index + 1" v-if="kcCheckPermission('receptionist_delete')" class="btn btn-outline-danger btn-sm"
                          @click="deleteReceptionistData(props.index + 1)"><i
                      class="fa fa-trash"></i></button>
                </div>
                <div v-else>
                  {{props.column.field == 'display_name' ? '' :props.formattedRow[props.column.field]}}
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

import {post, get} from "../../config/request";
import ModalPopup from "../../components/Modal/Index"
export default {
  components:{
    ModalPopup
  },  
  data: () => {
    return {
      pageLoader: true,
      receptionistsList: {
        data:[],
        column:[]
      },
      clinic:[],
      filterClinic:[],
      verifyModalData:{},
      verifyPopupModal:false,
      verifyButtonLoading:false,
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
        searchTerm:'',
        type:'list'
      },
      oldServerParams:{
        columnFilters:{

        },
        searchTerm:'',
        perPage:10
      },
      totalRows: 0,
      globalCheckboxApplyData: {},
      globalCheckboxApplyDataActions: [

      ]
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function () {
      this.getReceptionistList();
      this.receptionistsList = this.defaultDoctorDataList();
      this.globalCheckboxApplyData = this.defaultGlobalCheckboxApplyData()
      this.globalCheckboxApplyDataActions = this.defaultGlobalCheckboxApplyDataActions()
      setTimeout(()=>{
          this.clinic = this.clinics
          this.clinic.forEach(element => {
            this.filterClinic.push( { value: element.id, text: element.label })
        });
      },1000)
    },
    defaultGlobalCheckboxApplyData() {
      return {
        action_perform: 'delete',
        module: 'receptionists',
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
            this.getReceptionistList();
          } else {
            displayErrorMessage(data.data.message)
          }
        })
        .catch((error) => {
          this.isLoading = true;
          console.log(error);
        })
    },
    getReceptionistList: function () {
      get('receptionist_list', this.serverParams)
          .then((data) => {
            this.pageLoader = false ;
            if (data.data.status !== undefined && data.data.status === true) {
              this.receptionistsList.data = data.data.data;
              this.totalRows = data.data.total_rows;
            } else {
              this.receptionistsList.data = [];
              this.totalRows = 0;
            }
          })
          .catch((error) => {
            this.pageLoader = false ;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    defaultDoctorDataList: function () {
      return {
        column: [
          // {
          //   field: 'profile',
          //   // label: this.formTranslation.clinic.profile_img,
          // },
          {
            field: 'ID',
            label: this.formTranslation.common.id,
            width:'150px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.common.id,
              filterValue: '',
            }
          },
          {
            field: 'display_name',
            label: this.formTranslation.receptionist.dt_lbl_name,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.receptionist.dt_plh_name_fltr,
              filterValue: '',
            }
          },
          {
            field: 'clinic_name',
            label: this.formTranslation.receptionist.dt_lbl_clinic_name,
            sortable: false,
            filterOptions: {
              enabled:  this.userData.addOns.kiviPro && ['administrator'].includes(this.getUserRole()),
              filterValue: '',
              filterDropdownItems:this.filterClinic
            }
          },
          {
            field: 'user_email',
            label: this.formTranslation.receptionist.dt_lbl_email,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.receptionist.dt_plh_email_fltr,
              filterValue: '',
            }
          },
          {
            field: 'mobile_number',
            label: this.formTranslation.receptionist.dt_lbl_mobile,
            width: '200px',
            sortable:false,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.receptionist.dt_plh_mobilr_fltr,
              filterValue: '',
            }
          },
          {
            field: 'user_status',
            label: this.formTranslation.receptionist.dt_lbl_status,
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: this.formTranslation.receptionist.dt_all,
              filterValue: '',
              filterDropdownItems: [
                { value: '0', text: this.formTranslation.common.active },
                { value: '1', text: this.formTranslation.common.inactive } ]
            },
          },
          {
            field: 'actions',
            label: this.formTranslation.receptionist.dt_lbl_action,
            sortable:false,
            html:true
          }
        ],
        data: []
      }
    },
    updateParams: function(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
      this.getReceptionistList()
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
    deleteReceptionistData: function (index) {
      if (this.receptionistsList.data[index - 1] !== undefined) {
        let ele = $('#user_delete_'+index);
        $.confirm({
          title: this.formTranslation.clinic_schedule.dt_are_you_sure,
          content: this.formTranslation.receptionist.press_yes_to_delete_receptionist,
          type: 'red',
          buttons: {
            ok: {
              text:this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                ele.prop('disabled',true);
                $(ele).find('i').removeClass('fa fa-trash')
                $(ele).find('i').addClass('fa fa-sync fa-spin')
                get('receptionist_delete', {
                  id: this.receptionistsList.data[index - 1].ID
                })
                    .then((data) => {
                      ele.prop('disabled',false);
                      $(ele).find('i').removeClass('fa fa-sync fa-spin')
                      $(ele).find('i').addClass('fa fa-trash')
                      if (data.data.status !== undefined && data.data.status === true) {
                        this.receptionistsList.data.splice((index - 1), 1);
                        displayMessage(data.data.message);
                      }
                    })
                    .catch((error) => {
                      ele.prop('disabled',false);
                      $(ele).find('i').removeClass('fa fa-sync fa-spin')
                      $(ele).find('i').addClass('fa fa-trash')
                      console.log(error);
                      displayErrorMessage(this.formTranslation.common.internal_server_error);
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
    resendRequest: function (id) {
      var element =$('#resend_'+id).find("i");
      element.removeClass('fa fa-paper-plane ')
      element.addClass("fa fa-spinner fa-spin");
      post('resend_credential', {id: id})
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
    verifyUser(data){
      this.verifyButtonLoading = true;
      post('verify_user', {data: data})
          .then((response) => {
            this.verifyButtonLoading = false;
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message);
              this.verifyPopupModal = false;
              this.getReceptionistList();
            }else{
              displayErrorMessage(response.data.message);
            }
          }).catch((error) => {
        this.verifyButtonLoading = false;
        console.log(error);
        displayErrorMessage(this.formTranslation.common.internal_server_error);
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
    }
  },
  watch: {
  },
  computed:{
    receptionistListExport() {
      return 'Receptionist List - ' + moment().format('YYYY-MM-DD');
    },
    clinics() {
      return this.$store.state.clinic
    },
    userData() {
      return this.$store.state.userDataModule.user;
    },
    // formTranslation: function () {
    //   return this.$store.state.staticDataModule.langTranslateData ;
    // }
  }
}

</script>
<style>
#verifymodal header{
  min-height:unset;
}
</style>