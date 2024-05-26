<template>
  <div>
    <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
      <template v-slot:header>
        <b-row>
          <b-col sm="8" md="8" lg="8">
            <h2 class="mb-0">{{ formTranslation.settings.patient_setting }} <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#patient-setting" target="_blank"><i class="fa fa-question-circle"></i></a> </h2>
          </b-col>
        </b-row>
      </template>
      <div class="page-loader-section" v-if="formLoader">
        <loader-component-2></loader-component-2>
      </div>
      <form
          id="patient form"
          name="patient form"
          @submit.prevent="handleSubmit"
          :novalidate="true"
          enctype="multipart/form-data"
          v-else
      >
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <b-row class="mt-2 ml-4">
                <b-col sm="12" md="12" lg="12">
                  <div class="form-group">
                    <b-form-checkbox
                        size="md"
                        id="checkbox-1"
                        v-model="patientdata.enable"
                        name="checkbox-1"
                        @change="handleSubmit"
                        switch
                    >
                      <b> {{ formTranslation.patient.patient_unique_setting }} </b>
                    </b-form-checkbox>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
          <div class="col-md-12" v-if="patientdata.enable">
            <div class="form-group">
              <b-row class="mt-2 ml-4">
                <b-col sm="12" md="12" lg="12">
                  <div class="form-group">
                    <b-form-checkbox
                        size="md"
                        id="checkbox-only-number"
                        v-model="patientdata.only_number"
                        name="checkbox-only-number"
                        switch
                    >
                      <b> {{ formTranslation.patient.only_number_in_patient_unique_id }} </b>
                    </b-form-checkbox>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
          <div class="col-md-12" v-if="patientdata.enable">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="prefix_value" class="form-control-label"
                  >{{ formTranslation.patient.lbl_prefix }}
                  </label>
                  <input
                      type="text"
                      id="prefix_value"
                      class="form-control"
                      name="prefix_value"
                      v-model="patientdata.prefix_value"
                  />
                </div>
              </div>
              <div class="col-md-6" v-if="patientdata.enable">
                <div class="form-group">
                  <label for="postfix_value" class="form-control-label"
                  >{{ formTranslation.patient.lbl_postfix }}
                  </label>
                  <input
                      type="text"
                      id="postfix_value"
                      class="form-control"
                      name="postfix_value"
                      v-model="patientdata.postfix_value"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12" v-if="patientdata.enable">
            <div class="d-flex justify-content-end">
              <button v-if="!loading" class="btn btn-primary rtl-ml-2" type="submit">
                <i class="fa fa-save"></i> {{ formTranslation.common.save }}
              </button>
              <button v-else class="btn btn-primary" type="submit" disabled>
                <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
              </button>
            </div>
          </div>
        </div>
      </form>
    </b-card>
  </div>
</template>
<script>
import { post, get } from "../../config/request";
export default {
  name: "UniqueIdSetting",
  components: {
  },
  data: () => {
    return {
      patientdata:{},
      formLoader:true,
      loading: false,
      request_status:'off',
    };
  },
  mounted() {
    if(!['administrator'].includes(this.getUserRole())) {
      this.$router.push({ name: "403"})
    }
    this.patientdata = this.defaultData();
    this.edit();
    this.getModule();
  },
  methods: {
    defaultData() {
      return {
        prefix_value: "",
        postfix_value: "",
        enable: false,
        only_number:false,
      };
    },
    handleSubmit() {
      this.loading = true;
      post("patient_id_config",this.patientdata)
          .then((response) => {
            this.loading = false;
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              // location.reload();
              displayMessage(response.data.message);
              // this.$router.push({ name: "setting.patient_setting" });
            } else {
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            this.loading = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          });
    },
    edit() {
      this.formLoader = true
      get("edit_patient_id_config", {})
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              this.patientdata = response.data.data;
            }
            this.formLoader = false
          })
          .catch((error) => {
            this.formLoader = false
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          });
    },
    getModule:function (){
        if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
        this.request_status = window.request_data.link_show_hide;
        }
    }
  },
  computed: {
    userData() {
      return this.$store.state.userDataModule.user;
    }
  },
  watch: {
  },
  formTranslation: function () {
    return this.$store.state.staticDataModule.langTranslateData ;
  },
};
</script>