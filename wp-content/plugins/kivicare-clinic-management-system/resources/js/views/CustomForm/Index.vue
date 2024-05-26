<template>
  <b-row>
    <b-col sm="12">
      <b-overlay :show="!userData.addOns.kiviPro" variant="white" :opacity="0.2">
        <template #overlay>
          <!-- Use a dedicated component for overlay message -->
          <overlay-message addon_type="pro"></overlay-message>
        </template>
      <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row>
            <b-col sm="12" md="8" lg="8">
              <h2 class="mb-0">{{formTranslation.common.custom_form_list}} <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#custom-form" target="_blank"><i class="fa fa-question-circle"></i></a> </h2>
            </b-col>
            <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('custom_form_add')">
              <div class="d-flex justify-content-end">
                <router-link
                    class="btn btn-sm btn-primary"
                    :to="{ name: 'custom-form.create' }">
                  <i class="fa fa-plus"></i> {{formTranslation.common.add_form}}
                </router-link>
              </div>
            </b-col>
          </b-row>
        </template>
        <b-row>
          <b-col sm="12" md="12" lg="12">
            <div class="page-loader-section" v-show="pageLoader">
              <loader-component-2></loader-component-2>
            </div>
            <div id="customFormPrint" >
              <div class="mb-0">
                <vue-good-table
                    ref="dataTable"
                    :columns="customFormList.column"
                    :rows="customFormList.data"
                    mode="remote"
                    :search-options="{
                    enabled: true,
                    placeholder:formTranslation.common.search_custom_form_data_global_placeholder,
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
                  <template slot="table-row" slot-scope="props">
                    <div v-if="props.column.field == 'status'" class="d-flex">
                      <b-form-checkbox
                          v-model="props.row.status"
                          v-if="kcCheckPermission('custom_form_edit')"
                          name="check-button"
                          switch
                          value="1"
                          size="lg"
                          unchecked-value="0"
                          :id="'status_change_' + props.row.id"
                          @change="changeModuleValueStatus({module_type:'custom_form',id: props.row.id,value:props.row.status})"
                      >
                      </b-form-checkbox>
                      <span class="badge badge-success" v-if="props.row.status === '1'"> {{formTranslation.common.active}} </span>
                      <span class="badge badge-danger" v-else> {{formTranslation.common.inactive}}  </span>
                    </div>
                    <div class="btn-group" v-else-if="props.column.field === 'actions'">
                      <router-link
                          v-b-tooltip.hover :title="formTranslation.common.edit" v-if="kcCheckPermission('custom_form_edit')"
                          class="btn btn-sm btn-outline-primary"
                          :to="{ name: 'custom-form.edit', params: { id: props.row.id } }">
                        <i class="fa fa-pen-alt"></i>
                      </router-link>
                      <button
                          v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt"
                          class="btn btn-outline-danger btn-sm"
                          v-if="kcCheckPermission('custom_form_delete')"
                          @click="deleteCustomFormData(props.index + 1)">
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                    <div v-else>
                      {{ props.formattedRow[props.column.field] | typeFiled }}
                    </div>
                  </template>
                </vue-good-table>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-overlay>

    </b-col>
  </b-row>
</template>

<script>

import {post,get} from "../../config/request";

export default {
  data: () => {
    return {
      pageLoader: true,
      customFormList: {
        column:[],
        data:[]
      },
      customFormRequest: {},
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
      moduleType:[
        {"value":"doctor_module","text":"Doctor module"},
        {"value":"patient_module","text":"Patient module"},
        {"value":"patient_encounter_module","text":"Patient encounter module"},
        {"value":"appointment_module","text":"Appointment module"}
      ],
      request_status:'off',
    }
  },
  mounted() {
    if(['patient','receptionist','doctor'].includes(this.getUserRole())) {
      this.$router.push({ name: "403"})
    }
    this.init();
    this.moduleType.unshift({"value":"","text":this.formTranslation.common.all})
    this.getModule();
  },
  methods: {
    init: function () {
      this.customFormList = this.defaultCustomFormData();
      this.getCustomFormList();
    },
    getCustomFormList(){
      get('custom_form_list', this.serverParams)
          .then((data) => {
            this.pageLoader = false;
            if (data.data.status !== undefined && data.data.status === true) {
              this.customFormList.data = data.data.data;
              this.totalRows = data.data.total;
            }else {
              this.customFormList.data = data.data.data;
              this.totalRows = 0;
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    updateParams:function(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
      this.getCustomFormList()
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
    defaultCustomFormData: function () {
      return {
        data: [],
        column: [
          {
            field: 'id',
            label: this.formTranslation.common.id,
            width:'100px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.common.id,
              filterValue: ''
            }
          },
          {
            field: 'name',
            label: this.formTranslation.common.name,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.common.name,
              filterValue: '',
            }
          },
          {
            field: 'module_type',
            label: this.formTranslation.custom_field.dt_lbl_type,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.custom_field.dt_plh_fltr_by_type,
              filterDropdownItems:this.moduleType,
              filterValue: ''
            }
          },
          {
            field: 'status',
            label: this.formTranslation.service.dt_lbl_status,
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: this.formTranslation.static_data.dt_lbl_plh_sr_fltr_status,
              filterDropdownItems: [
                {value:"",text:this.formTranslation.common.all},
                { value: '1', text: this.formTranslation.common.active },
                { value: '0', text: this.formTranslation.common.inactive }  ]
            },
            html:true
          },
          {
            field: 'actions',
            sortable:false,
            label: this.formTranslation.custom_field.dt_lbl_action
          }
        ]
      }
    },
    deleteCustomFormData: function (index) {
      if (this.customFormList.data[index - 1] !== undefined) {

        $.confirm({
          title: this.formTranslation.clinic_schedule.dt_are_you_sure,
          content: this.formTranslation.common.py_delete_field,
          type: 'red',
          buttons: {
            ok: {
              text: "Yes",
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                post('custom_form_delete', {
                  id: this.customFormList.data[index - 1].id
                })
                    .then((data) => {
                      if (data.data.status !== undefined && data.data.status === true) {
                        this.customFormList.data.splice((index - 1), 1);
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
            cancel: () => {
            }
          }
        });
      }
    },
    getModule:function (){
      if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
        this.request_status = window.request_data.link_show_hide;
      }
    }
  },
  computed: {
    userData(){
      return this.$store.state.userDataModule.user;
    }
  },
  filters: {
    typeFiled: function (value) {
      let label = value;
      let lableValue = '';
      if (label !== '' && label !== null) {
        if (label !== undefined && label !== '') {
          lableValue = label;
          lableValue = lableValue.replace(/_/gi, ' ');
        }
      }
      return lableValue;
    }
  }
}
</script>
