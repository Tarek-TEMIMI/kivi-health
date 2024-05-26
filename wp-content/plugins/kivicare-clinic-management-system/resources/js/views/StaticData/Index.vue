<template>
    <b-row>
        <b-col sm="12" >
            <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
                <template v-slot:header>
                    <b-row>
                        <b-col sm="12" md="8" lg="8">
                            <h2 class="mb-0">{{formTranslation.static_data.listing_data}} <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#listing" target="_blank"><i class="fa fa-question-circle"></i></a> </h2>
                        </b-col>
                        <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('static_data_add')">
                          <div class="d-flex justify-content-end">
                            <button v-if="userData.addOns.kiviPro && kivicareCompareVersion(requireProVersion,userData.pro_version)" class="btn btn-sm btn-primary"  @click="$refs.module_data_import.openModel = true" >
                              <i class="fas fa-file-import"></i>{{formTranslation.common.import_data}}
                            </button>
                            <button class="btn btn-sm btn-primary" :to="{ name: 'static-data.create' }" @click="handleStaticDataForm({})" >
                              <i v-if="!visible" class="fa fa-plus"></i> <i v-else class="fa fa-minus"></i> {{ ( visible ? formTranslation.common.close_form_btn : formTranslation.static_data.add_list_data_btn ) }}
                            </button>
                          </div>
                        </b-col>
                    </b-row>
                </template>
              <module-data-import v-if="userData.addOns.kiviPro && kcCheckPermission('static_data_add') && kivicareCompareVersion(requireProVersion,userData.pro_version)" ref="module_data_import" @reloadList="getStaticData" :required_data="[{label:formTranslation.static_data.dt_lbl_name,value:'name'},{label:formTranslation.static_data.dt_lbl_type,value:'type'}]" :module_name="formTranslation.static_data.listing_data" module_type="static_data"></module-data-import>
              <Create v-if="showAddForm" :static-id="staticId" @getStaticData="getStaticData" @closeForm="closeForm" ></Create>
              <Create :static-id="staticId" @getStaticData="getStaticData" @closeForm="closeForm" v-if="showEditForm && staticId" ></Create>
                <b-row>
                  <b-col sm="12" md="12" lg="12">
                      <div class="mb-0">
                        <div class="page-loader-section" v-show="pageLoader">
                          <loader-component-2></loader-component-2>
                        </div>
                        <div id="printStaticData">
                          <vue-good-table
                            ref="dataTable"
                            :columns="staticDataList.column"
                            :rows="staticDataList.data"
                            mode="remote"
                            :search-options="{
                              enabled: true,
                              placeholder:formTranslation.common.search_listing_data_global_placeholder,
                            }"
                            @on-sort-change="onSortChange"
                            @on-column-filter="onColumnFilter"
                            @on-page-change="onPageChange"
                            @on-per-page-change="onPerPageChange"
                            :totalRows="totalRows"
                            :pagination-options="{
                              enabled: true,
                              mode: 'pages'
                            }"
                            @on-search="globalFilter"
                            styleClass="vgt-table striped"
                            compactMode
                        >
                            <div slot="emptystate" class="text-danger text-center">
                              {{formTranslation.common.no_data_found}}
                            </div>
                          <div slot="table-actions">
                            <module-data-export :module_data="staticDataList.data" :module_name="formTranslation.static_data.listing_data"  module_type="listing_data" v-if="kcCheckPermission('static_data_export')"> </module-data-export>
                          </div>
                          <template slot="table-row" slot-scope="props">
                            <div v-if="props.column.field == 'status'" class="d-flex">
                              <b-form-checkbox
                                  v-if="kcCheckPermission('static_data_edit')"
                                  v-model="props.row.status"
                                  name="check-button"
                                  switch
                                  value="1"
                                  size="lg"
                                  unchecked-value="0"
                                  :id="'status_change_' + props.row.id"
                                  @change="changeModuleValueStatus({module_type:'static_data',id: props.row.id,value:props.row.status})"
                              >
                              </b-form-checkbox>
                              <span class="badge badge-success" v-if="props.row.status == '1'"> {{formTranslation.common.active}} </span>
                              <span class="badge badge-danger" v-else > {{formTranslation.common.inactive}} </span>
                            </div>
                            <div class="btn-group" v-else-if="props.column.field =='actions'">
                              <button v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_edit" v-if="kcCheckPermission('static_data_edit')" class="btn btn-sm btn-outline-primary"
                                @click="editStaticData(props.row, props.row.id)">
                                <i class="fa fa-pen-alt"></i>
                              </button>
                              <button v-if="getUserRole() == 'administrator' && kcCheckPermission('static_data_delete')" v-b-tooltip.hover class="btn btn-outline-danger btn-sm"
                                      :title="formTranslation.clinic_schedule.dt_lbl_dlt"
                                      type="button" @click="deleteListingData(props.row, props.index + 1)">
                                <i class="fa fa-trash"></i>
                              </button>
                            </div>
                            <div v-else>
                              {{  props.formattedRow[props.column.field ]}}
                            </div>
                          </template>
                        </vue-good-table>
                        </div>
                      </div>
                  </b-col>
                </b-row>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
  import {post,get} from "../../config/request";
  import Create from "./Create";
  export default {
    data: () => {
      return {
        visible: false,
        request_status:'off',
        showEditForm: false,
        showAddForm:false,
        staticId: -1,
        pageLoader: true,
        staticDataList: {
          column:[],
          data:[]
        },
        serverParams: {
          columnFilters: {},
          sort: [
            {
              field: '',
              type: ''
            }
          ],
          page: 1,
          perPage: 10,
          searchTerm:'',
        },
        oldServerParams:{
          columnFilters:{

          },
          searchTerm:'',
          perPage:10
        },
        totalRows: 0,
      }
    },
    components:{Create},
    mounted() {
      if(['patient'].includes(this.getUserRole())) {
        this.$router.push({ name: "403"})
      }
        this.init()
        this.getModule();
    },
    methods: {
      init: function () {

        this.staticDataList = this.defaultStaticDataList()
        this.getStaticData()
        if (!this.$store.state.staticDataModule.static_data.static_data_types !== undefined) {
          this.$store.dispatch("staticDataModule/fetchStaticData", {type : 'static_data_types'})
        }
      },
      defaultStaticDataList: function () {
          return {
              column: [
                  {
                    field: 'id',
                    label: this.formTranslation.common.id,
                    width:'100px',
                    filterOptions: {
                      enabled: true,
                      placeholder: this.formTranslation.common.id,
                      filterValue: '',
                    }
                  },
                  {
                      field: 'label',
                      label: this.formTranslation.static_data.dt_lbl_name,
                      filterOptions: {
                        enabled: true,
                        placeholder: this.formTranslation.static_data.dt_lbl_plh_fltr_name,
                        filterValue: '',
                      }
                  },
                  {
                      field: 'type',
                      label: this.formTranslation.static_data.dt_lbl_type,
                      filterOptions: {
                        enabled: true,
                        placeholder: this.formTranslation.static_data.dt_lbl_plh_fltr_type,
                        filterValue: '',
                        filterDropdownItems: [
                          { value: 'specialization', text: this.formTranslation.doctor.dt_lbl_specialties },
                          { value: 'service_type', text: this.formTranslation.widgets.service_type },
                          { value: 'prescription_medicine', text: this.formTranslation.patient_encounter.prescription },
                          { value: "clinical_problems", text: this.formTranslation.encounter_dashboard.problems},
                          { value: "clinical_observations", text: this.formTranslation.encounter_dashboard.observation}
                        ]
                      }
                  },
                  {
                    field: 'status',
                    label: this.formTranslation.static_data.dt_lbl_status,
                    width:'150px',
                    filterOptions: {
                      enabled: true,
                      placeholder: this.formTranslation.static_data.dt_lbl_plh_sr_fltr_status,
                      filterValue: '',
                      filterDropdownItems: [
                        { value: '1', text: this.formTranslation.common.active },
                        { value: '0', text: this.formTranslation.common.inactive }
                      ]
                    },
                    html:true
                  },
                  {
                    field: 'actions',
                    sortable:false,
                    label: this.formTranslation.static_data.dt_lbl_action,
                    html:true
                  }
              ],
              data: []
          }
      },
      getStaticData() {
        this.pageLoader = true ;
          get('static_data_list', this.serverParams)
            .then((data) => {
              if (data.data.status !== undefined && data.data.status === true) {
                  this.pageLoader = false ;
                  this.staticDataList.data = data.data.data ;
                  this.totalRows = data.data.total_rows ;
              } else {
                this.pageLoader = false ;
                  this.staticDataList.data = [] ;
                  this.totalRows = 0 ;
              }
            })
            .catch((error) => {
                  console.log(error);
                  displayErrorMessage(this.formTranslation.common.internal_server_error);
              })
      },
      deleteListingData: function (data, index) {
        if (this.staticDataList.data[index - 1] !== undefined) {
          $.confirm({
          title: this.formTranslation.clinic_schedule.dt_are_you_sure,
            content: this.formTranslation.common.reset_appointment_slot,
            type: 'red',
            buttons: {
              ok: {
                text: this.formTranslation.common.yes,
                btnClass: 'btn-danger',
                keys: ['enter'],
                action: () => {
                  post('static_data_delete', {id: data.id})
                    .then((response) => {
                      if (response.data.status !== undefined && response.data.status === true) {
                        if (this.staticDataList.data !== undefined) {
                          this.staticDataList.data.splice((data.index), 1);
                          displayMessage(response.data.message);
                        }
                      } else {
                        displayErrorMessage(response.data.message);
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      displayErrorMessage(this.formTranslation.common.internal_server_error);;
                  })
                }
              },
              cancel: {
                text:this.formTranslation.common.cancel
              }
            }
          });
        } else {
          displayErrorMessage(this.formTranslation.static_data.static_data_not_found)
        }
      },
      updateParams: function(newProps) {
        this.serverParams = Object.assign({}, this.serverParams, newProps);
        this.getStaticData()
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
      deleteStaticData: function (index) {
          $.confirm({
              title: this.formTranslation.clinic_schedule.dt_are_you_sure,
              content: this.formTranslation.common.press_yes_to_delete_static_data,
              type: 'red',
              buttons: {
                  ok: {
                      text:this.formTranslation.common.yes,
                      btnClass: 'btn-danger',
                      keys: ['enter'],
                      action: () => {
                          post('static_data_delete', {
                              id: this.staticDataList.data[index - 1].id
                          })
                              .then((data) => {
                                  if (data.data.status !== undefined && data.data.status === true) {
                                      this.staticDataList.data.splice((index - 1), 1);
                                      displayMessage(data.data.message);
                                  }
                              })
                              .catch((error) => {
                                  if (error.response.data !== undefined && error.response.data.message !== undefined) {
                                      displayErrorMessage(error.response.data.message);
                                  } else {
                                      displayErrorMessage(this.formTranslation.common.internal_server_error);
                                  }
                              })
                      }
                  },
                  cancel: {
                    text:this.formTranslation.common.cancel
                  }
              }
          });
      },
      editStaticData (data, collapseID) {
        this.staticId = collapseID
        this.showAddForm = false
        this.showEditForm = true
        this.visible=true;
        window.scroll({ top: 0, behavior: 'smooth' });
      },
      handleStaticDataForm() {
        if (!this.showAddForm) {
          this.visible=true
          this.showAddForm = true
          this.showEditForm = false
        } else {
          this.visible = false
          this.showAddForm = false
          this.showEditForm = false
        }
      },
      closeForm() {
        this.visible=false
        this.staticId = -1
        this.showAddForm = false
        this.showEditForm = false
      },
      getModule:function (){
          if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
          this.request_status = window.request_data.link_show_hide;
          }
      }
    },
    computed: {
      ListingDataExport() {
        return 'Listing Data - ' + moment().format('YYYY-MM-DD');
      },
      userData() {
        return this.$store.state.userDataModule.user;
      },
      // formTranslation: function () {
      //   return this.$store.state.staticDataModule.langTranslateData ;
      // }
    },
    watch: {
    }
  }
</script>
