<template>
  <b-row>
      <b-col sm="12">
          <b-overlay
              :show="userData.addOns.bodyChart != true"
              variant="white"
              :opacity="overlayOpacity"
          >
              <template #overlay>
                  <overlay-message addon_type="bodyChart"></overlay-message>
              </template>
              <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
                  <template v-slot:header>
                      <b-row>
                          <b-col sm="12" md="8" lg="8">
                              <h3 class="mb-0">{{ $t("common.body_chart") }}</h3>
                          </b-col>
                          <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('body_chart_add')">
                              <div class="d-flex justify-content-end">
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-primary"
                                        @click="$router.go(-1);"
                                    >
                                        {{$t('common.back')}}
                                    </button>
                                  <router-link
                                      v-if="encounter_data.status == '1'"
                                      class="btn btn-sm btn-primary"
                                      :to="{
                                          name: 'patient-encounter.body-create',
                                          params: { encounter_id: $route.params.encounter_id },
                                      }"
                                  >
                                      <i class="fa fa-plus"></i> {{ $t("common.add_new_image") }}
                                  </router-link>
                              </div>
                          </b-col>
                      </b-row>
                  </template>
                  <b-row v-if="kcCheckPermission('body_chart_list')">
                      <b-col sm="12" md="12" lg="12">
                          <div class="page-loader-section" v-show="isLoading">
                              <loader-component-2></loader-component-2>
                          </div>
                          <div id="bodyChartPrint">
                              <vue-good-table
                                  ref="dataTable"
                                  :columns="bodyChartData.column"
                                  :rows="bodyChartData.data"
                                  mode="remote"
                                  :search-options="{
                                      enabled: true,
                                      placeholder:
                                          formTranslation.common
                                              .search_body_chart_data_global_placeholder,
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
                                  <!-- <div slot="selected-row-actions">
                            <div class="d-flex justify-content-end align-items-center">
                              <select class="form-control form-control-sm" v-model="globalCheckboxApplyData.action_perform">
                                <option v-for="(option, index) in globalCheckboxApplyDataActions" :value="option.value">{{ option.label
                                }}</option>
                              </select>
                              <button class="ml-2 btn btn-sm btn-primary" @click="confirmDelete">
                                {{ formTranslation.common.apply }}
                              </button>
                            </div>
                          </div> -->
                                  <template slot="table-row" slot-scope="props">
                                      <div
                                          v-if="props.column.field == 'name'"
                                          class="d-flex align-items-center"
                                      >
                                          <img
                                              v-if="props.row.chart_image"
                                              :src="props.row.chart_image"
                                              alt="chart_image"
                                              class="object-cover"
                                              height="45px"
                                              width="45px"
                                              style="border-radius: 50%; margin-right: 1rem"
                                          />
                                          <b-avatar
                                              v-else
                                              variant="primary"
                                              :text="getInitials(props.formattedRow.name)"
                                              class="mr-3"
                                              size="45px"
                                          ></b-avatar>
                                          {{ props.formattedRow.name }}
                                      </div>
                                      <div v-if="props.column.field == 'patient_name'">                                                        
                                          {{ encounter_data.patient_name }}
                                      </div>
                                      <div v-if="props.column.field == 'doctor_name'">                                                        
                                          {{ encounter_data.doctor_name }}
                                      </div>
                                      <div v-if="props.column.field == 'status'">                                                        
                                          <span class="badge badge-danger" v-if="encounter_data.status == '0'"> {{ formTranslation.common.closed }} </span>
                                          <span class="badge badge-success" v-if="encounter_data.status == '1'"> {{ formTranslation.common.active }} </span>
                                      </div>
                                      <div
                                          class="btn-group"
                                          v-else-if="props.column.field == 'actions'"
                                      >
                                          <router-link
                                              v-if="kcCheckPermission('body_chart_edit') && encounter_data.status == '1'"
                                              class="btn btn-sm btn-outline-primary"
                                              :to="{
                                                  name: 'patient-encounter.body-edit',
                                                  params: { body_chart_id: props.row.id, encounter_id: props.row.encounter_id  },
                                              }"
                                              v-b-tooltip.hover
                                              :title="formTranslation.common.edit"
                                          >
                                              <i class="fa fa-pen-alt"></i>
                                          </router-link>
                                          <a
                                              class="btn btn-outline-primary btn-sm"
                                              :href="props.row.chart_image"
                                              target="_blank"
                                              v-if="kcCheckPermission('body_chart_view')"
                                              v-b-tooltip.hover
                                              :title="formTranslation.common.view"
                                          >
                                              <i class="fas fa-eye"></i>
                                          </a>
                                          <a
                                              :href="props.row.chart_image"
                                              :download="props.row.chart_image"
                                              v-if="kcCheckPermission('body_chart_download')"
                                              class="btn btn-outline-primary btn-sm"
                                              v-b-tooltip.hover
                                              :title="formTranslation.common.download"
                                          >
                                              <i class="fas fa-download"></i>
                                          </a>
                                          <button
                                              v-if="kcCheckPermission('body_chart_delete') && encounter_data.status == '1' "
                                              class="btn btn-outline-danger btn-sm"
                                              v-b-tooltip.hover
                                              :title="formTranslation.clinic_schedule.dt_lbl_dlt"
                                              :id="'user_delete_' + props.index + 1"
                                              @click="deleteBodyChartData(props.index + 1, props)"
                                          >
                                              <i class="fa fa-trash"></i>
                                          </button>
                                      </div>
                                      <div v-else-if="![ 'name', 'doctor_name', 'status', 'patient_name' ].includes(props.column.field)">
                                          {{
                                              props.formattedRow[props.column.field]
                                                  ? props.formattedRow[props.column.field]
                                                  : "-"
                                          }}
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
import { post, get } from "../../config/request";

export default {
  data: () => {
      return {
          bodyChartData: {
              column: [],
              data: [],
          },
          isLoading: true,
          searchName: "",
          searchEmail: "",
          serverParams: {
              columnFilters: {
                  specialties: "",
              },
              sort: [
                  {
                      field: "",
                      type: "",
                  },
              ],
              page: 1,
              perPage: 10,
              searchTerm: "",
              type: "list",
          },
          oldServerParams: {
              columnFilters: {},
              searchTerm: "",
              perPage: 10,
          },
          totalRows: 0,
          globalCheckboxApplyData: {},
          globalCheckboxApplyDataActions: [],
          encounter_data:{

          }
      };
  },
  mounted() {
      if(this.userData.addOns.bodyChart != true){
        return;
      }
      if( !this.$route.params.encounter_id){
          this.$router.push({ name: "403"});
          return;
      }
      this.init();
  },
  methods: {
      init: function () {
          this.bodyChartData = this.defaultBodyChartList();
          this.encounter_data = this.defaultEncounterData();
          this.getBodyChartData();
          this.globalCheckboxApplyData = this.defaultGlobalCheckboxApplyData();
          this.globalCheckboxApplyDataActions = this.defaultGlobalCheckboxApplyDataActions();
      },
      defaultEncounterData: function(){
        return {
          status : 0,
          id : "",
          encounter_date : "",
          clinic_id : "",
          doctor_id : "",
          patient_id : "",
          appointment_id : "",
          description : "",
          status : "",
          added_by : "",
          created_at : "",
          template_id : null,
          doctor_name : "",
          patient_name : "",
          patient_email : "",
          clinic_name : "",
          patient_unique_id : "",
          patient_address : "",
          custom_forms : [],
          doctor_signature : "",
          custom_fields : [],
        }
      },
      getBodyChartData: function () {
          this.serverParams.encounter_id = this.$route.params.encounter_id;
          this.serverParams.totalRows = this.totalRows;
          get("encounter_body_chart_data_list", this.serverParams, false)
              .then((data) => {
                  if (data.data.status !== undefined && data.data.status === true) {
                      this.bodyChartData.data = data.data.data;
                      this.totalRows = data.data.total;
                  } else {
                      this.bodyChartData.data = [];
                      this.totalRows = 0;
                    }
                  this.encounter_data = data.data.encounter_data;
                  this.isLoading = false;
              })
              .catch((error) => {
                  this.isLoading = false;
                  console.log(error);
                  displayErrorMessage(this.formTranlation.common.internal_server_error);
              });
      },

      defaultGlobalCheckboxApplyData() {
          return {
              action_perform: "delete",
              module: "clinics",
              data: [],
          };
      },

      defaultGlobalCheckboxApplyDataActions: function () {
          return [
              {
                  value: "delete",
                  label: this.formTranslation.clinic_schedule.dt_lbl_dlt,
              },
          ];
      },

      confirmDelete() {
          $.confirm({
              title: this.formTranslation.clinic_schedule.dt_are_you_sure,
              content: this.formTranslation.common.body_chart_delete_confirm_message,
              type: "red",
              buttons: {
                  ok: {
                      text: this.formTranslation.common.yes,
                      btnClass: "btn-danger",
                      keys: ["enter"],
                      action: () => {
                          this.globalCheckboxApply();
                      },
                  },
                  cancel: {
                      text: this.formTranslation.common.cancel,
                  },
              },
          });
      },

      globalCheckboxApply() {
          this.pageLoader = true;
          post("encounter_body_chart_data_delete_multiple", this.globalCheckboxApplyData)
              .then((data) => {
                  this.pageLoader = false;
                  if (data.data.status !== undefined && data.data.status === true) {
                      displayMessage(data.data.message);
                      this.getBodyChartData();
                  } else {
                      displayErrorMessage(data.data.message);
                  }
              })
              .catch((error) => {
                  this.pageLoader = true;
                  console.log(error);
              });
      },

      updateParams: function (newProps) {
          this.serverParams = Object.assign({}, this.serverParams, newProps);
          this.getBodyChartData();
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
          this.updateParams({
              searchTerm: params.searchTerm,
              perPage: this.serverParams.perPage,
              page: 1,
          });
      }, 300),
      onColumnFilter: _.debounce(function (params) {
          var emptyValue = true;
          var emptyValue2 = true;
          Object.values(params.columnFilters).map(function (value, index, array) {
              if (value) {
                  emptyValue = false;
              }
          });
          Object.values(this.oldServerParams.columnFilters).map(function (value, index, array) {
              if (value) {
                  emptyValue2 = false;
              }
          });
          if (!emptyValue || !emptyValue2) {
              this.oldServerParams.columnFilters = Object.assign({}, params.columnFilters);
              this.updateParams({
                  columnFilters: params.columnFilters,
                  perPage: this.serverParams.perPage,
                  page: 1,
              });
          }
      }, 300),
      defaultBodyChartList: function () {
          return {
              column: [
                  {
                      field: "id",
                      label: this.formTranslation.common.id,
                      width: "80px",
                      filterOptions: {
                          enabled: true, // enable filter for this column
                          placeholder: this.formTranslation.common.id,
                          filterValue: "",
                      },
                  },
                  {
                      field: "name",
                      label: this.formTranslation.clinic.dt_lbl_name,
                      filterOptions: {
                          enabled: true,
                          placeholder: this.formTranslation.clinic.dt_plh_name_filter,
                          filterValue: "",
                      },
                  },
                  // {
                  //     field: "encounter_id",
                  //     label: this.formTranslation.common.encounter_id,
                  //     width: "150px",
                  //     filterOptions: {
                  //         enabled: false,
                  //     },
                  // },
                  {
                      field: "description",
                      label: this.formTranslation.appointments.description,
                      width: "200px",
                      filterOptions: {
                          enabled: true,
                          placeholder: this.formTranslation.common.filter_by_description,
                          filterValue: "",
                      },
                  },
                  {
                      field: "patient_name",
                      label: this.formTranslation.patient.patient_name,
                      filterOptions: {
                          enabled: false,
                      },
                  },
                  {
                      field: "doctor_name",
                      label: this.formTranslation.doctor.doctor_name,
                      filterOptions: {
                          enabled: false,
                      },
                  },
                //   {
                //     field: 'status',
                //     label: this.formTranslation.clinic.dt_lbl_status,
                //     filterOptions: {
                //       enabled: false,
                //     },
                //   },
                  {
                      field: "last_update_user",
                      label: this.formTranslation.common.last_updated_by,
                      filterOptions: {
                          enabled: true,
                          placeholder: this.formTranslation.common.filter_by_last_updated_by,
                          filterValue: "",
                      },
                  },
                  {
                      field: "actions",
                      sortable: false,
                      label: this.formTranslation.clinic.dt_lbl_action,
                  },
              ],
              data: [],
          };
      },

      deleteBodyChartData: function (index, props) {
          if (this.bodyChartData.data[index - 1] !== undefined) {
              let ele = $("#user_delete_" + index);
              $.confirm({
                  title: this.formTranslation.clinic_schedule.dt_are_you_sure,
                  content: this.formTranslation.common.body_chart_delete_confirm_message,
                  type: "red",
                  buttons: {
                      ok: {
                          text: this.formTranslation.common.yes,
                          btnClass: "btn-danger",
                          keys: ["enter"],
                          action: () => {
                              ele.prop("disabled", true);
                              $(ele).find("i").removeClass("fa fa-trash");
                              $(ele).find("i").addClass("fa fa-sync fa-spin");
                              post("encounter_body_chart_data_delete", {
                                  body_chart_id: this.bodyChartData.data[index - 1].id,
                              })
                                  .then((data) => {
                                      ele.prop("disabled", false);
                                      $(ele).find("i").removeClass("fa fa-sync fa-spin");
                                      $(ele).find("i").addClass("fa fa-trash");
                                      if (
                                          data.data.status !== undefined &&
                                          data.data.status === true
                                      ) {
                                          if (this.userData.default_clinic != props.row.id) {
                                              this.bodyChartData.data.splice(index - 1, 1);
                                          }
                                          this.getBodyChartData();
                                          displayMessage(data.data.message);
                                      } else {
                                          displayErrorMessage(data.data.message);
                                      }
                                  })
                                  .catch((error) => {
                                      ele.prop("disabled", false);
                                      $(ele).find("i").removeClass("fa fa-sync fa-spin");
                                      $(ele).find("i").addClass("fa fa-trash");
                                      console.log(error);
                                      displayErrorMessage(
                                          this.formTranlation.common.internal_server_error,
                                      );
                                  });
                          },
                      },
                      cancel: {
                          text: this.formTranslation.common.cancel,
                      },
                  },
              });
          }
      },
      getInitials(name) {
          if (name !== undefined && name !== "" && name !== null) {
              const patient_name = name.split(" ");
              const initials = patient_name.map((patient_name) =>
                  patient_name.charAt(0).toUpperCase(),
              );
              return initials.join("");
          } else {
              return " - ";
          }
      },
  },
  computed: {
      userData() {
          return this.$store.state.userDataModule.user;
      },
  },
  watch: {},
};
</script>

<style>
@media (max-width: 576px) {
  #bodyChartPrint .vgt-compact td:before {
      width: 42%;
      padding-left: 0;
  }
}
</style>
