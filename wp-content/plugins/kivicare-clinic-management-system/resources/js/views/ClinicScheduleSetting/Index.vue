
<template>
  <b-row>
    <b-col sm="12">
      <b-card class="p-0 shadow"  body-class="p-0" header-tag="header" footer-tag="footer">
        <template v-slot:header >
          <b-row>
            <b-col sm="12" md="8" lg="8">
              <h2 class="mb-0">{{ formTranslation.clinic_schedule.holiday_list }} 
                <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#holidays" target="_blank"><i class="fa fa-question-circle"></i></a>
              </h2>
            </b-col>
            <b-col sm="12" md="4" lg="4">
              <div class="d-flex justify-content-end">
                <button class="btn btn-sm btn-primary" :to="{ name: 'clinic-schedule.create' }" @click="handleScheduleForm({})" v-if="kcCheckPermission('clinic_schedule_add')">
                  <i v-if="!visible" class="fa fa-plus"></i> <i v-else class="fa fa-minus"></i> {{ ( visible ? formTranslation.clinic_schedule.close_form_btn : formTranslation.clinic_schedule.add_holiday_btn ) }}
                </button>
              </div>
            </b-col>
          </b-row>
        </template>
        <b-collapse id="holiday-add-tab" :visible="showAddForm">
          <Create @getClinicScheduleList="getClinicScheduleList" @closeForm="closeForm" ></Create>
        </b-collapse>
        <b-collapse id="holiday-edit-tab" class="mt-2" :visible="showEditForm">
          <Create :holidayId="holidayId" :holidayDetail="editHolidayDetail" @getClinicScheduleList="getClinicScheduleList" @closeForm="closeForm" v-if="this.holidayId" ></Create>
        </b-collapse>
        <b-row>
          <b-col sm="12" md="12" lg="12">
            <div class="page-loader-section" v-show="pageLoader">
              <loader-component-2></loader-component-2>
            </div>
            <div id="clinicPrint" >
              <div class="mb-0">
                <vue-good-table
                  ref="dataTable"
                  :columns="clinicScheduleList.column"
                  :rows="clinicScheduleList.data"
                  mode="remote"
                  :search-options="{
                    enabled: true,
                    placeholder:formTranslation.common.search_holiday_data_global_placeholder,
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
                    {{formTranslation.common.no_data_found}}
                  </div>
                  <template slot="column-filter" slot-scope="{ column, updateFilters }">
                    <div v-if="column.field === 'start_date'">
                      <input type="date" class="form-control-sm" style="border: #fff" v-model="serverParams.columnFilters.start_date" @onkeydown="() => {return false}" @input="(value) => updateFilters(column, serverParams.columnFilters.start_date)">
                      <span @click="updateFilters(column, serverParams.columnFilters.start_date='')">X</span>
                    </div>
                    <div v-else-if="column.field === 'end_date'">
                      <input type="date" class="form-control-sm" style="border: #fff" v-model="serverParams.columnFilters.end_date" @onkeydown="() => {return false}" @input="(value) => updateFilters(column, serverParams.columnFilters.end_date)">
                      <span @click="updateFilters(column, serverParams.columnFilters.end_date='')">X</span>
                    </div>
                  </template>
                  <div slot="table-actions">
                    <module-data-export v-if="kcCheckPermission('clinic_schedule_export')" :module_data="clinicScheduleList.data" :module_name="formTranslation.clinic_schedule.holiday_list"  module_type="clinic_doctor_holiday"> </module-data-export>
                  </div>
                  <template slot="table-row" slot-scope="props">
                    <div v-if="props.column.field == 'index'" > {{ props.row.originalIndex + 1 }} </div>
                    <div v-else-if="props.column.field == 'start_date'" > {{ props.row.start_date }} </div>
                    <div v-else-if="props.column.field == 'end_date'" > {{  props.row.end_date }} </div>
                    <div class="btn-group" v-else-if="props.column.field =='actions'">
                      <button
                          type="button"
                          v-b-tooltip.hover
                          :title="formTranslation.common.edit"
                          v-if="kcCheckPermission('clinic_schedule_edit')"
                          class="btn btn-sm btn-outline-primary"
                          @click="editClinicSchedule(props.row , props.row.id)"
                      >
                        <i class="fa fa-pen-alt"></i>
                      </button>
                      <button
                          v-if="kcCheckPermission('clinic_schedule_delete')"
                          v-b-tooltip.hover
                          :title="formTranslation.clinic_schedule.dt_lbl_dlt"
                          class="btn btn-outline-danger btn-sm"
                          @click="deleteClinicSchedule(props.index + 1)"
                      >
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                    <div v-else>
                      {{props.formattedRow[props.column.field]}}
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
        holidayCollapse: false,
        visible: false,
        showEditForm: false,
        showAddForm:false,
        holidayId: -1,
        editHolidayDetail:[],
        pageLoader: true,
        clinicScheduleList: {
          column:[],
          data:[]
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
        request_status:'off',
      }
    },
    components:{Create},
    mounted() {
      if(['patient'].includes(this.getUserRole())) {
        this.$router.push({ name: "403"})
      }
      this.init();
      this.getModule();
    },
    methods: {
      init: function () {
        this.holidayCollapse = false ;
        this.clinicScheduleList = this.defaultClinicScheduleList();
        this.getClinicScheduleList()
      },
      defaultClinicScheduleList: function () {
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
              field: 'module_type',
              width:'150px',
              label: this.formTranslation.clinic_schedule.dt_lbl_schedul_of,
              filterOptions: {
                enabled: !(this.getUserRole() === 'doctor'),
                placeholder: this.formTranslation.clinic_schedule.dt_plh_fltr_by_schedule,
                filterValue: '',
                filterDropdownItems: [
                  { value: 'clinic', text: 'Clinic' },
                  { value: 'doctor', text: 'Doctor' }
                ]
              }
            },
            {
              field: 'name',
              label: this.formTranslation.clinic_schedule.dt_lbl_name,
              sortable: false,
              width:'150px',
              filterOptions: {
                enabled: !(this.getUserRole() === 'doctor'),
                placeholder: this.formTranslation.clinic_schedule.dt_plh_fltr_by_doc,
                filterValue: '',
              }
            },
            {
              field: 'start_date',
              label: this.formTranslation.clinic_schedule.dt_lbl_from_date,
              filterOptions: {
                enabled: true,
                placeholder: this.formTranslation.clinic_schedule.dt_plh_fltr_by_date,
                filterValue: '',
              }
            },
            {
              field: 'end_date',
              label: this.formTranslation.clinic_schedule.dt_lbl_to_date,
              filterOptions: {
                enabled: true,
                placeholder: this.formTranslation.clinic_schedule.dt_plh_fltr_by_end_date,
                filterValue: '',
              }
            },
            {
              field: 'actions',
              sortable:false,
              label: this.formTranslation.clinic_schedule.dt_lbl_action
            }
          ],
          data: []
        }
      },
      getClinicScheduleList: function () {
        this.pageLoader = true ;
        get('clinic_schedule_list',  this.serverParams)
            .then((data) => {
              this.pageLoader = false ;
              if (data.data.status !== undefined && data.data.status === true) {
                this.clinicScheduleList.data = data.data.data
                this.totalRows = data.data.total_rows
              }else{
                this.clinicScheduleList.data = []
                this.totalRows = 0
              }
            })
            .catch((error) => {
              console.log(error);
              displayErrorMessage(this.formTranslation.clinic_schedule.dt_srvr_err);
            })
      },
      updateParams: function(newProps) {
        this.serverParams = Object.assign({}, this.serverParams, newProps);
        this.getClinicScheduleList()
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
        setTimeout(()=>{
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
        },300)
      },300),
      deleteClinicSchedule: function (index) {
        if (this.clinicScheduleList.data[index - 1] !== undefined) {
          $.confirm({
            title: this.formTranslation.clinic_schedule.dt_are_you_sure,
            content: this.formTranslation.clinic_schedule.dt_press_dlt,
            type: 'red',
            buttons: {
              ok: {
                text: this.formTranslation.common.yes,
                btnClass: 'btn-danger',
                keys: ['enter'],
                action: () => {
                  get('clinic_schedule_delete', {
                    id: this.clinicScheduleList.data[index - 1].id
                  })
                      .then((data) => {
                        if (data.data.status !== undefined && data.data.status === true) {
                          this.clinicScheduleList.data.splice((index - 1), 1);
                          this.getClinicScheduleList()
                          displayMessage(data.data.message);
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        displayErrorMessage(this.formTranslation.clinic_schedule.dt_srvr_err);
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
      editClinicSchedule: function (data, collapseID) {
        this.editHolidayDetail = data
        this.holidayId = collapseID
        this.showAddForm = false
        this.showEditForm = true
        this.visible=false
        window.scroll({ top: 0, behavior: 'smooth' });
      },
      handleScheduleForm() {
        this.closeForm();
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
      closeForm () {
        this.holidayId = -1 ;
        this.visible = false
        this.showAddForm = false
        this.showEditForm = false
      },
      isCollapse (value) {
        this.holidayCollapse = value ;
      },
      getModule:function (){
        if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
          this.request_status = window.request_data.link_show_hide;
        }
      }
    },
    computed: {
      holidayListExport() {
        return 'Holiday List - ' + moment().format('YYYY-MM-DD');
      },
      userData(){
        return this.$store.state.userDataModule.user;
      }
      // formTranslation: function () {
      //   return this.$store.state.staticDataModule.langTranslateData ;
      // }
    }
  }
</script>
<style scoped>
@-moz-document url-prefix() {
  [type="date"]{
     background-image: none;
  }
}
</style>
