<template>
  <b-row>
    <b-col sm="12">
      <b-overlay :show="userData.addOns.kiviPro != true" variant="white" :opacity="overlayOpacity">
        <template #overlay>
          <overlay-message addon_type="pro"></overlay-message>
        </template>
        <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
          <template v-slot:header>
            <b-row>
              <b-col sm="12" md="8" lg="8">
                <h3 class="mb-0"> {{ formTranslation.common.tax_list }} </h3>
              </b-col>
              <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('tax_add')">
                <div class="d-flex justify-content-end">
                  <button
                    v-if="false && userData.addOns.kiviPro && kivicareCompareVersion(requireProVersion, userData.pro_version)"
                    class="float-right btn btn-sm btn-primary rtl-left"
                    @click="$refs.module_data_import.openModel = true">
                    <i class="fas fa-file-import"></i>{{ formTranslation.common.import_data }}
                  </button>
                  <router-link class="btn btn-sm btn-primary" :to="{ name: 'tax.create' }">
                    <i class="fa fa-plus"></i> {{ formTranslation.common.new_tax }}
                  </router-link>
                </div>
              </b-col>
            </b-row>
          </template>
          <module-data-import v-if="userData.addOns.kiviPro && kcCheckPermission('tax_add')
            && kivicareCompareVersion(requireProVersion, userData.pro_version)" ref="module_data_import"
            @reloadList="getTaxData" :required_data="[]" :module_name="formTranslation.common.clinic"
            module_type="clinic"></module-data-import>
          <b-row>
            <b-col sm="12" md="12" lg="12">
              <div class="page-loader-section" v-show="isLoading">
                <loader-component-2></loader-component-2>
              </div>
              <div id="taxPrint">
                <vue-good-table ref="dataTable" :columns="taxList.column" :rows="taxList.data" mode="remote"
                  :search-options="{
                    enabled: true,
                    placeholder: formTranslation.common.search_tax_data_global_placeholder,
                  }" @on-sort-change="onSortChange" @on-column-filter="onColumnFilter"
                  @on-page-change="onPageChange" @on-per-page-change="onPerPageChange" :totalRows="totalRows"
                  :pagination-options="{
                    enabled: true,
                    mode: 'pages',
                  }" @on-search="globalFilter"
                  @on-selected-rows-change="(selected_row) => { globalCheckboxApplyData.data = selected_row }"
                  :select-options="{
                    enabled: true,
                    selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
                    selectionInfoClass: 'text-primary bg-white',
                    selectionText: formTranslation.common.rows_selected,
                    clearSelectionText: formTranslation.common.clear,
                    disableSelectInfo: false, // disable the select info panel on top
                    selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
                  }" styleClass="vgt-table striped" compactMode>
                  <div slot="emptystate" class="text-danger text-center">
                    {{ formTranslation.common.no_data_found }}
                  </div>
                  <template slot="column-filter" slot-scope="{ column, updateFilters }">
                    <div v-if="column.field === 'module_type'">
                      <select class="vgt-select" v-model="serverParams.columnFilters.module_type"
                        @change="(value) => updateFilters(column, serverParams.columnFilters.module_type)">
                        <option value="">{{ column.filterOptions.placeholder }}</option>
                        <option v-for="(value, index) in module_types" :value="value.label" :key="index">{{ value.label }}
                        </option>
                      </select>
                    </div>
                  </template>
                  <div slot="table-actions">
                    <module-data-export :module_data="taxList.data" :module_name="formTranslation.clinic.clinic_list"
                      module_type="tax" v-if="kcCheckPermission('tax_export')"> </module-data-export>
                  </div>
                  <div slot="selected-row-actions">
                    <div class="d-flex justify-content-end align-items-center">
                      <select class="form-control form-control-sm" v-model="globalCheckboxApplyData.action_perform">
                        <option v-for="(option, index) in globalCheckboxApplyDataActions" :value="option.value">{{
                          option.label }}</option>
                      </select>
                      <button class="ml-2 btn btn-sm btn-primary" @click="confirmDelete">
                        {{ formTranslation.common.apply }}
                      </button>
                    </div>
                  </div>
                  <template slot="table-row" slot-scope="props">
                    <div v-if="props.column.field == 'status'" class="d-flex">
                      <b-form-checkbox v-if="kcCheckPermission('tax_edit')" v-model="props.row.status" name="check-button"
                        switch value="1" size="lg" unchecked-value="0" :id="'status_change_' + props.row.id"
                        @change="changeModuleValueStatus({ module_type: 'tax', id: props.row.id, value: props.row.status })">
                      </b-form-checkbox>
                      <span class="badge badge-success" v-if="props.row.status == '1'"> {{ formTranslation.common.active }} </span>
                      <span class="badge badge-danger" v-if="props.row.status == '0'"> {{ formTranslation.common.inactive }} </span>
                    </div>
                    <div class="btn-group" v-else-if="props.column.field == 'actions'">
                      <router-link
                        v-if="kcCheckPermission('tax_edit') && getUserRole() === 'administrator' || (getUserRole() === 'clinic_admin' && props.row.added_by == userData.ID)"
                        class="btn btn-sm btn-outline-primary" :to="{ name: 'tax.edit', params: { id: props.row.id } }">
                        <i class="fa fa-pen-alt"></i>
                      </router-link>
                      <button
                        v-if="kcCheckPermission('tax_delete') && getUserRole() === 'administrator' || (getUserRole() === 'clinic_admin' && props.row.added_by == userData.ID)"
                        class="btn btn-outline-danger btn-sm" :id="'user_delete_' + props.row.id"
                        @click="deleteTaxData(props.row.id)"><i class="fa fa-trash"></i></button>
                    </div>
                    <div v-else-if="props.column.field == 'tax_rate'" v-html="printTaxRate(props.formattedRow[props.column.field])" />
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
<script >
import { post, get } from "../../config/request";
export default {
  data: () => {
    return {
      isLoading: true,
      taxList: {
        column: [],
        data: []
      },
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
      globalCheckboxApplyData: {},
      globalCheckboxApplyDataActions: [

      ]
    }
  },
  mounted() {
    if (!['administrator', 'clinic_admin'].includes(this.getUserRole())) {
      this.$router.push({ name: "403" })
    }
    this.init();
  },
  methods: {
    init() {
      this.taxList = this.defaultTaxList();
      this.globalCheckboxApplyData = this.defaultGlobalCheckboxApplyData()
      this.globalCheckboxApplyDataActions = this.defaultGlobalCheckboxApplyDataActions()
      if (this.userData.addOns.kiviPro) {
        this.getTaxData();
      }
    },
    defaultGlobalCheckboxApplyData() {
      return {
        action_perform: 'delete',
        module: 'tax',
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
          value: "delete",
          label: this.formTranslation.clinic_schedule.dt_lbl_dlt
        },
      ]
    },
    globalCheckboxApply() {
      this.pageLoader = true;
      post('module_wise_multiple_data_update', this.globalCheckboxApplyData)
        .then((data) => {
          this.pageLoader = false;
          if (data.data.status !== undefined && data.data.status === true) {
            displayMessage(data.data.message);
            this.getTaxData();
          } else {
            displayErrorMessage(data.data.message)
          }
        })
        .catch((error) => {
          this.pageLoader = true;
          console.log(error);
        })
    },
    updateParams: function (newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
      this.getTaxData();
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
    defaultTaxList: function () {
      return {
        column: [
          {
            field: 'id',
            label: this.formTranslation.common.id,
            width: '100px',
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: this.formTranslation.common.id,
              filterValue: '',
            },
          },
          {
            field: 'name',
            label: this.formTranslation.common.name,
            width: '200px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.common.name,
              filterValue: '',
            }
          },
          {
            field: 'tax_rate',
            label: this.formTranslation.common.tax_rate,
            width: '200px',
            filterOptions: {
              enabled: false,
            }
          },
          {
            field: 'clinic_name',
            label: this.formTranslation.patient_encounter.dt_lbl_clinic,
            sortable: false,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.patient_encounter.dt_plh_fltr_by_clinic,
              filterValue: '',
            }
          },
          {
            field: 'doctor_name',
            label: this.formTranslation.service.dt_lbl_doctor,
            sortable: false,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.service.dt_plh_fltr_by_doc,
              filterValue: '',
            }
          },
          {
            field: 'service_name',
            label: this.formTranslation.service.service_name,
            sortable: false,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.service.dt_plh_name_fltr,
              filterValue: '',
            }
          },
          {
            field: 'added_by',
            label: 'Added by',
            width: '200px',
            hidden: true,
            sortable: false,
            filterOptions: {
              enabled: false,
            }
          },
          {
            field: 'status',
            label: this.formTranslation.clinic.dt_lbl_status,
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: this.formTranslation.static_data.dt_lbl_plh_sr_fltr_status,
              filterDropdownItems: [
                { value: '1', text: this.formTranslation.common.active },
                { value: '0', text: this.formTranslation.common.inactive }],
              filterValue: '',
            },
          },
          {
            field: 'actions',
            sortable: false,
            label: this.formTranslation.clinic.dt_lbl_action
          }
        ],
        data: []
      }
    },
    getTaxData() {
      this.pageLoader = true;
      get('tax_list', this.serverParams)
        .then((data) => {
          this.pageLoader = false;
          if (data.data.status !== undefined && data.data.status === true) {
            this.isLoading = false;
            this.taxList.data = data.data.data;
            this.totalRows = data.data.total_rows;
          } else {
            this.isLoading = false;
            this.taxList.data = [];
            this.totalRows = 0;
          }
        })
        .catch((error) => {
          this.isLoading = false;
          this.pageLoader = false;
          console.log(error);
        })
    },
    deleteTaxData(id) {
      let ele = $('#user_delete_' + id);
      $.confirm({
        title: this.formTranslation.clinic_schedule.dt_are_you_sure,
        content: this.formTranslation.common.delete_tax,
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
              post('tax_delete', {
                id: id
              })
                .then((data) => {
                  ele.prop('disabled', false);
                  $(ele).find('i').removeClass('fa fa-sync fa-spin')
                  $(ele).find('i').addClass('fa fa-trash')
                  if (data.data.status !== undefined && data.data.status === true) {
                    this.getTaxData();
                    displayMessage(data.data.message)
                  } else {
                    displayErrorMessage(data.data.message)
                  }
                })
                .catch((error) => {
                  ele.prop('disabled', false);
                  $(ele).find('i').removeClass('fa fa-sync fa-spin')
                  $(ele).find('i').addClass('fa fa-trash')
                  console.log(error);
                  displayErrorMessage(this.formTranlation.common.internal_server_error);
                })
            }
          },
          cancel: {
            text: this.formTranslation.common.cancel
          }
        }
      });
    },
    confirmDelete() {
      let content = '';
      if (this.globalCheckboxApplyData.action_perform === 'delete') {
        content = this.formTranslation.common.py_delete_clinic;
      } else if (this.globalCheckboxApplyData.action_perform === 'active'
        || this.globalCheckboxApplyData.action_perform === 'inactive') {
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
          cancel: {
            text: this.formTranslation.common.cancel
          }
        }
      });
    },
    printTaxRate(tax_rate) {

      if(tax_rate.indexOf("%")==-1)
        return this.$store.state.userDataModule.user.clinic_currency_detail.prefix+tax_rate
      
      return tax_rate;
    }
  },
  computed: {
    userData() {
      if (this.$store.state.userDataModule !== undefined && this.$store.state.userDataModule.user !== undefined) {
        return this.$store.state.userDataModule.user;
      } else {
        return [];
      }
    },
    teleMedEn() {
      return this.userData.addOns.telemed
    },
    module_types() {
      return []
    },
  }
}
</script>
<style scoped></style>