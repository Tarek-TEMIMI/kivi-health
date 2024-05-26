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
                            <h3 class="mb-0">{{formTranslation.clinic.clinic_list}}</h3>
                        </b-col>
                        <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('clinic_add')">
                            <div class="d-flex justify-content-end">
                              <button v-if="userData.addOns.kiviPro && kivicareCompareVersion(requireProVersion,userData.pro_version)" class="float-right btn btn-sm btn-primary rtl-left"  @click="$refs.module_data_import.openModel = true" >
                                  <i class="fas fa-file-import"></i>{{formTranslation.common.import_data}}
                              </button>
                                <router-link class="btn btn-sm btn-primary" :to="{ name: 'clinic.create' }">
                                    <i class="fa fa-plus"></i> {{formTranslation.clinic.add_clinic}}
                                </router-link>
                            </div>
                        </b-col>
                    </b-row>
                </template>
                <module-data-import v-if="userData.addOns.kiviPro && kcCheckPermission('clinic_add') && kivicareCompareVersion(requireProVersion,userData.pro_version)" ref="module_data_import" @reloadList="getClinicData"
                  :required_data="[
                      { label: formTranslation.clinic.clinic_name, value: 'clinic_name' },
                      { label: formTranslation.clinic.email, value: 'email' },
                      { label: formTranslation.common.country_calling_code, value: 'country_calling_code' },
                      { label: formTranslation.common.country_code, value: 'country_code' },
                      { label: formTranslation.clinic.clinic_contact, value: 'contact' },
                      { label: formTranslation.clinic.dt_lbl_specialties, value: 'specialization' },
                      { label: formTranslation.common.address, value: 'address' },
                      { label: formTranslation.common.city, value: 'city' },
                      { label: formTranslation.common.country, value: 'country' },
                      { label: formTranslation.common.postal_code, value: 'postal_code' },
                      { label: formTranslation.common.clinic_admin + ' ' + formTranslation.common.fname, value: 'clinic_admin_first_name' },
                      { label: formTranslation.common.clinic_admin + ' ' + formTranslation.common.lname, value: 'clinic_admin_last_name' },
                      { label: formTranslation.common.clinic_admin_email, value: 'clinic_admin_email' },
                      { label: formTranslation.common.clinic_admin_country_calling_code, value: 'clinic_admin_country_calling_code' },
                      { label: formTranslation.common.clinic_admin_country_code, value: 'clinic_admin_country_code' },
                      { label: formTranslation.common.clinic_admin + ' ' + formTranslation.doctor.doctor_contact, value: 'clinic_admin_contact' },
                      { label: formTranslation.common.clinic_admin + ' ' + formTranslation.doctor.gender, value: 'clinic_admin_gender' },
                    ]" :module_name="formTranslation.common.clinic" module_type="clinic"></module-data-import>
                <b-row>
                    <b-col sm="12" md="12" lg="12">
                        <div class="page-loader-section" v-show="isLoading">
                            <loader-component-2></loader-component-2>
                        </div>
                        <div id="clinicPrint"  >
                        <vue-good-table
                            ref="dataTable"
                            :columns="clinicsList.column"
                            :rows="clinicsList.data"
                            mode="remote"
                            :search-options="{
                              enabled: true,
                              placeholder:formTranslation.common.search_clinic_field_data_global_placeholder,
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
                            @on-selected-rows-change="(selected_row) => { globalCheckboxApplyData.data = selected_row }" :select-options="{
                              enabled: true,
                              selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
                              selectionInfoClass: 'text-primary bg-white',
                              selectionText: formTranslation.common.rows_selected,
                              clearSelectionText: formTranslation.common.clear,
                              disableSelectInfo: false, // disable the select info panel on top
                              selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
                            }" 
                            styleClass="vgt-table striped"
                            compactMode
                        >
                          <div slot="emptystate" class="text-danger text-center">
                            {{formTranslation.common.no_data_found}}
                          </div>
                          <template slot="column-filter" slot-scope="{ column, updateFilters }">
                            <div v-if="column.field === 'specialties'">
                              <select class="vgt-select" v-model="serverParams.columnFilters.specialties"  @change="(value) => updateFilters(column, serverParams.columnFilters.specialties)">
                                <option value="">{{ column.filterOptions.placeholder }}</option>
                                <option v-for="(value,index) in specialization" :value="value.label" :key="index">{{value.label}}</option>
                              </select>
                            </div>
                          </template>
                            <div slot="table-actions">
                              <module-data-export :module_data="clinicsList.data" :module_name="formTranslation.clinic.clinic_list"  module_type="clinic" v-if="kcCheckPermission('clinic_export')"> </module-data-export>
                            </div>
                            <div slot="selected-row-actions">
                              <div class="d-flex justify-content-end align-items-center">
                                <select class="form-control form-control-sm" v-model="globalCheckboxApplyData.action_perform">
                                  <option v-for="(option, index) in globalCheckboxApplyDataActions" :value="option.value">{{ option.label
                                  }}</option>
                                </select>
                                <button class="ml-2 btn btn-sm btn-primary" @click="confirmDelete">
                                  {{ formTranslation.common.apply }}
                                </button>
                              </div>
                            </div>
                            <template slot="table-row" slot-scope="props">
                            <div v-if="props.column.field == 'name'" class="d-flex align-items-center">
                                <img v-if="props.row.profile_image != '' && props.row.profile_image != null" :src="props.row.profile_image" alt="profile_image" class=" object-cover" height="45px" width="45px" style="border-radius:50%; margin-right:1rem;"/>
                                <b-avatar v-else variant="primary" :text="getInitials(props.formattedRow.name)" class="mr-3" size="45px"></b-avatar>
                                {{props.formattedRow.name}}
                                <!-- {{ props.row.profile_image }} -->
                            </div>
                            <div v-else-if="props.column.field == 'status'" class="d-flex">
                                <b-form-checkbox
                                    v-if="kcCheckPermission('clinic_edit')"
                                  v-model="props.row.status"
                                  name="check-button"
                                  switch
                                  value="1"
                                  size="lg"
                                  unchecked-value="0"
                                  :id="'status_change_' + props.row.id"
                                  @change="changeModuleValueStatus({module_type:'clinics',id: props.row.id,value:props.row.status})"
                              >
                              </b-form-checkbox>
                                <span class="badge badge-success" v-if="props.row.status == '1'"> {{formTranslation.common.active}} </span>
                                <span class="badge badge-danger" v-if="props.row.status == '0'"> {{formTranslation.common.inactive}} </span>
                            </div>
                            <div class="btn-group" v-else-if="props.column.field =='actions'">
                                <router-link v-if="kcCheckPermission('clinic_edit')" class="btn btn-sm btn-outline-primary"
                                                :to="{ name: 'clinic.edit', params: { id: props.row.id } }">
                                    <i class="fa fa-pen-alt"></i>
                                </router-link>
                                <button
                                    v-b-tooltip.hover :title="formTranslation.receptionist.resend_credential"
                                    :id ="'resend_'+ props.row.clinic_admin_id"
                                    v-if="kcCheckPermission('clinic_edit')" class="btn btn-outline-warning btn-sm"
                                    @click="resendRequest(props.row.clinic_admin_id)"> <i class="fa fa-paper-plane" aria-hidden="true"></i>
                                </button>
                                        <button v-if="kcCheckPermission('clinic_delete')" class="btn btn-outline-danger btn-sm" :id="'user_delete_'+props.index + 1" @click="deleteClinicData(props.index + 1,props)"><i
                                            class="fa fa-trash"></i></button>
                            </div>
                            <div v-else>
                                {{props.column.field == 'name' ? '' :props.formattedRow[props.column.field]}}
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

export default {
    data: () => {
        return {
            clinicsList: {
              column:[],
              data:[]
            },
            isLoading: true,
            searchName: '',
            searchEmail: '',
          serverParams: {
            columnFilters: {
              specialties:''
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
        this.clinicsList = this.defaultClinicList();
        this.getClinicData()
        this.globalCheckboxApplyData = this.defaultGlobalCheckboxApplyData()
        this.globalCheckboxApplyDataActions = this.defaultGlobalCheckboxApplyDataActions()
      },
      getClinicData: function () {
        get('clinic_list', this.serverParams, false)
            .then((data) => {
                if (data.data.status !== undefined && data.data.status === true) {
                    this.isLoading = false ;
                    this.clinicsList.data = data.data.data
                    this.totalRows = data.data.total;
                }else{
                  this.clinicsList.data = [];
                  this.totalRows = 0;
                }
            })
            .catch((error) => {
                this.isLoading = false ;
                console.log(error);
                displayErrorMessage(this.formTranlation.common.internal_server_error);
            })
      },

      defaultGlobalCheckboxApplyData() {
        return {
          action_perform: 'delete',
          module: 'clinics',
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
          content = this.formTranslation.common.py_delete_clinic;
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
        this.pageLoader = true;
        post('module_wise_multiple_data_update', this.globalCheckboxApplyData)
          .then((data) => {
            this.pageLoader = false;
            if (data.data.status !== undefined && data.data.status === true) {
              displayMessage(data.data.message);
              this.getClinicData();
            } else {
              displayErrorMessage(data.data.message)
            }
          })
          .catch((error) => {
            this.pageLoader = true;
            console.log(error);
          })
      },

      updateParams:function(newProps) {
        this.serverParams = Object.assign({}, this.serverParams, newProps);
        this.getClinicData()
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
        defaultClinicList: function () {
            return {
                column: [
                    // {
                    //     field: 'profile',
                    //     // label: this.formTranslation.clinic.profile_img,
                    // },
                    {
                      field: 'id',
                      label:this.formTranslation.common.id,
                      width:'80px',
                      filterOptions: {
                        enabled: true, // enable filter for this column
                        placeholder: this.formTranslation.common.id,
                        filterValue: '',
                      },
                    },
                    {
                      field: 'name',
                      label: this.formTranslation.clinic.dt_lbl_name,
                      filterOptions: {
                          enabled: true,
                          placeholder: this.formTranslation.clinic.dt_plh_name_filter,
                          filterValue: '',
                      }
                    },
                    {
                      field: 'email',
                      label: this.formTranslation.clinic.dt_lbl_email,
                      filterOptions: {
                          enabled: true,
                          placeholder: this.formTranslation.clinic.dt_lbl_email,
                          filterValue: '',
                      }
                    },
                  {
                    field: 'clinic_admin_email',
                    label: this.formTranslation.common.clinic_admin_email,
                    filterOptions: {
                      enabled: true,
                      placeholder: this.formTranslation.common.clinic_admin_email,
                      filterValue: '',
                    }
                  },
                    {
                      field: 'telephone_no',
                      label: this.formTranslation.clinic.dt_lbl_contect,
                      width: '160px',
                      filterOptions: {
                          enabled: true,
                          placeholder: this.formTranslation.clinic.dt_plh_fltr_contact,
                          filterValue: '',
                      }
                    },
                    {
                      field: 'specialties',
                      label:this.formTranslation.clinic.dt_lbl_specialties,
                      width: '150px',
                      sortable: false,
                      filterOptions: {
                          enabled: true, // enable filter for this column
                          placeholder: this.formTranslation.clinic.dt_plh_fltr_specialitiy,
                          filterValue: '',
                      },
                      html:true
                    },
                    {
                      field: 'clinic_full_address',
                      label: this.formTranslation.clinic.plh_address,
                      sortable: false,
                      filterOptions: {
                        enabled: true, // enable filter for this column
                        placeholder: this.formTranslation.clinic.plh_address,
                        filterValue: '',
                      },
                    },
                    {
                      field: 'status',
                      label: this.formTranslation.clinic.dt_lbl_status,
                      filterOptions: {
                        enabled: true, // enable filter for this column
                        placeholder: this.formTranslation.static_data.dt_lbl_plh_sr_fltr_status,
                        filterDropdownItems: [
                          { value: '1', text: this.formTranslation.common.active },
                          { value: '0', text: this.formTranslation.common.inactive } ],
                        filterValue: '',
                      },
                    },
                    {
                      field: 'actions',
                      sortable:false,
                      label: this.formTranslation.clinic.dt_lbl_action
                    }
                ],
                data: []
            }
        },

        deleteClinicData: function (index,props) {
            if (this.clinicsList.data[index - 1] !== undefined) {
              let ele = $('#user_delete_'+index);
                $.confirm({
                    title: this.formTranslation.clinic_schedule.dt_are_you_sure,
                    content: this.formTranslation.common.py_delete_clinic,
                    type: 'red',
                    buttons: {
                        ok: {
                            text: this.formTranslation.common.yes,
                            btnClass: 'btn-danger',
                            keys: ['enter'],
                            action: () => {
                              ele.prop('disabled',true);
                              $(ele).find('i').removeClass('fa fa-trash')
                              $(ele).find('i').addClass('fa fa-sync fa-spin')
                                post('clinic_delete', {
                                    id: this.clinicsList.data[index - 1].id
                                })
                                        .then((data) => {
                                          ele.prop('disabled',false);
                                          $(ele).find('i').removeClass('fa fa-sync fa-spin')
                                          $(ele).find('i').addClass('fa fa-trash')
                                            if (data.data.status !== undefined && data.data.status === true) {
                                                if(this.userData.default_clinic != props.row.id){
                                                    this.clinicsList.data.splice((index - 1), 1);
                                                }
                                                this.$store.dispatch("fetchAllClinic", {self: this})
                                                displayMessage(data.data.message);
                                            }else{
                                              displayErrorMessage(data.data.message)
                                            }
                                        })
                                        .catch((error) => {
                                          ele.prop('disabled',false);
                                          $(ele).find('i').removeClass('fa fa-sync fa-spin')
                                          $(ele).find('i').addClass('fa fa-trash')
                                            console.log(error);
                                            displayErrorMessage(this.formTranlation.common.internal_server_error);
                                        })
                            }
                        },
                        cancel:{
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
                  displayErrorMessage(this.formTranlation.common.internal_server_error)
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
    computed: {
        getSpeciality: function () {
            return (salut) => {
                salut = JSON.parse(salut);
                if (salut !== undefined && salut.length > 0) {
                    let specialties = '';
                    salut.map(function (spec, index) {
                        specialties += (salut.length === (index + 1) ? spec.label : spec.label + ', ');
                        return spec;
                    });
                    return specialties;
                }
                return ' - ';
            }
        },
      specialization(){
        if(this.$store.state.staticDataModule.static_data.specialization !== undefined
            && this.$store.state.staticDataModule.static_data.specialization.length > 0){
          return this.$store.state.staticDataModule.static_data.specialization;
        }
        return [];
      },
        userData(){
              return this.$store.state.userDataModule.user;
        }
        // formTranslation: function () {
        //     return this.$store.state.staticDataModule.langTranslateData ;
        // }
    },
    watch: {
    }
}
</script>

<style>
@media (max-width: 576px){
  #clinicPrint .vgt-compact td:before{
    width: 42%;
    padding-left: 0;
  }
}

</style>