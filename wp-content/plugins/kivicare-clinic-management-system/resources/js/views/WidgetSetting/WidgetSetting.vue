<template>
  <div :style="cssProps">
    <div class="page-loader-section" v-if="formLoader">
      <loader-component-2></loader-component-2>
    </div>
    <b-card v-else class="p-0 shadow" header-tag="header" footer-tag="footer">
      <div class="row">
        <div class="col-md-12">
          <h2>
            {{ formTranslation.widget_setting.widget_setting }}
            <a v-if="request_status == 'off'"
              href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#widget-setting"
              target="_blank"><i class="fa fa-question-circle"></i></a>
          </h2>
        </div>
      </div>
      <hr class="p-2 m-0" />
      <form id="widgetSettingForm" name="widgetSettingForm" @submit.prevent="handleSubmit" :novalidate="true"
        enctype="multipart/form-data">
        <div class="row p-2" v-if="userData.addOns.kiviPro == true">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.widget_setting.clinic_setting }}
            </h2>
          </div>
        </div>
        <div class="row" v-if="userData.addOns.kiviPro == true">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="show-clinic-image" v-model="widgetConfigData.showClinicImage"
                          name="show-clinic-image" switch>
                          <b> {{ formTranslation.widget_setting.show_clinic_image }} </b>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="show-clinic-address" v-model="widgetConfigData.showClinicAddress"
                          name="show-clinic-address" switch>
                          <b> {{ formTranslation.widget_setting.show_clinic_address }} </b>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label class="form-control-label">{{ formTranslation.widget_setting.contact_details }} </label>
                  <div class="kivi-pr">
                    <multi-select id="mode" v-model="widgetConfigData.clinicContactDetails" label="label" track-by="id"
                      :options="dropDownOption" :placeholder="formTranslation.settings.tag_plh_option"></multi-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr class="p-2 m-0" v-if="userData.addOns.kiviPro == true" />
        <div class="row p-2">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.widget_setting.doctor_setting }}
            </h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="show-doctor-image" v-model="widgetConfigData.showDoctorImage"
                          name="show-doctor-image" switch>
                          <b> {{ formTranslation.widget_setting.show_doctor_image }} </b>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="show-doctor-experience"
                          v-model="widgetConfigData.showDoctorExperience" name="show-doctor-experience" switch>
                          <b> {{ formTranslation.widget_setting.show_doctor_experience }} </b>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="mode" class="form-control-label">{{ formTranslation.widget_setting.contact_details }} </label>
                  <div class="kivi-pr">
                    <multi-select id="mode" v-model="widgetConfigData.doctorContactDetails" label="label" track-by="id"
                      :options="dropDownOption" :placeholder="formTranslation.settings.tag_plh_option"></multi-select>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="show-doctor-speciality"
                          v-model="widgetConfigData.showDoctorSpeciality" name="show-doctor-speciality" switch>
                          <b> {{ formTranslation.widget_setting.show_doctor_speciality }} </b>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="show-doctor-degree" v-model="widgetConfigData.showDoctorDegree"
                          name="show-doctor-degree" switch>
                          <b> {{ formTranslation.widget_setting.show_doctor_degree }} </b>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="show-doctor-rating" v-model="widgetConfigData.showDoctorRating"
                          name="show-doctor-rating" switch>
                          <b> {{ formTranslation.widget_setting.show_doctor_rating }} </b>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr class="p-2 m-0" />
        <div class="row p-2">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.widget_setting.service_setting }}
            </h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="show-service-image" v-model="widgetConfigData.showServiceImage"
                          name="show-service-image" switch>
                          <b> {{ formTranslation.widget_setting.show_service_image }} </b>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="show-service-type" v-model="widgetConfigData.showServicetype"
                          name="show-service-type" switch>
                          <b> {{ formTranslation.widget_setting.show_service_type }} </b>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="show-service-price" v-model="widgetConfigData.showServicePrice"
                          name="show-service-price" switch>
                          <b> {{ formTranslation.widget_setting.show_service_price }} </b>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div class="col-md-4" v-if="userData.addOns.kiviPro">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="show-service-duration"
                          v-model="widgetConfigData.showServiceDuration" name="show-service-duration" switch>
                          <b> {{ formTranslation.widget_setting.show_service_duration }} </b>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="skip-service-when-single"
                          v-model="widgetConfigData.skip_service_when_single" name="skip-service-when-single" switch>
                          <b> {{ formTranslation.widget_setting.skip_service_when_single }} </b>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr class="p-2 m-0" />
        <div class="row p-2">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.widget_setting.loader_setting }}
            </h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label class="form-control-label">{{ formTranslation.widget_setting.loader_select }} </label>
                  <div class="input-group kivi-choose-file flex-nowrap">
                    <div class="input-group-prepend flex-shrink-0">
                      <button class="btn btn-primary px-2" type="button" id="widgetLoader"
                        @click.prevent="uploadWidgetLoader()">{{ formTranslation.common.choose_file }}</button>
                    </div>
                    <label class="input-group-text" for="widgetLoader">{{ widgetLoader }}</label>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card-profile-image mt-3 d-flex justify-content-center">
                  <img style="max-height: 100px;" :src="widgetLoaderPreview" v-if="widgetLoaderPreview != ''"
                    class="navbar-brand-img ml-2 mt-3" alt="else">
                  <div class="double-lines-spinner" v-else></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr class="p-2 m-0" />
        <div class="row p-2">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.widget_setting.widget_color }}
            </h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3">
            <label class="form-control-label">
              {{ formTranslation.widget_setting.set_widget_primary_color }}
            </label>
            <input class="form-control form-control-color" type="color" v-model="widgetConfigData.primaryColor"
              id="example-color-input" />
          </div>
          <div class="col-md-3">
            <label class="form-control-label">
              {{ formTranslation.widget_setting.set_widget_primary_hover_color }}
            </label>
            <input class="form-control form-control-color" type="color" v-model="widgetConfigData.primaryHoverColor"
              id="example-color-input1" />
          </div>
          <div class="col-md-3">
            <label class="form-control-label">
              {{ formTranslation.widget_setting.set_widget_secondary_color }}
            </label>
            <input class="form-control form-control-color" type="color" v-model="widgetConfigData.secondaryColor"
              id="example-color-input2" />
          </div>
          <div class="col-md-3">
            <label class="form-control-label">
              {{ formTranslation.widget_setting.set_widget_secondary_hover_color }}
            </label>
            <input class="form-control form-control-color" type="color" v-model="widgetConfigData.secondaryHoverColor"
              id="example-color-input4" />
          </div>
        </div>
        <hr class="p-2 m-0 mt-4" />
        <b-overlay :show="userData.addOns.kiviPro != true" variant="white" :opacity="overlayOpacity">
          <template #overlay>
            <overlay-message addon_type="pro"></overlay-message>
          </template>
          <div class="row p-2">
            <div class="col-md-12">
              <h2>
                {{ formTranslation.widget_setting.widget_order }}
              </h2>
            </div>
          </div>
          <div class="row">
            <div v-if="listLoader" class="col-md-12 d-flex justify-content-center">
              <i class="fa fa-spinner fa-spin" aria-hidden="true" style="font-size:50px"></i>
            </div>
            <div class="col-md-6" v-else>
              <table class="table table-striped">
                <thead class="thead-dark">
                  <tr>
                    <th scope="col" style="width:10%;"></th>
                    <th scope="col">{{ formTranslation.static_data.dt_lbl_name }}</th>
                  </tr>
                </thead>
                <draggable v-model="widgetListOrder" tag="tbody"
                  :options="{ animation: 1000, handle: '.my_handle:not(.exclude-this-item)' }" :move="checkMove">
                  <tr v-for="item in widgetListOrder" v-if="!(!userData.addOns.kiviPro && item.att_name === 'clinic')"
                    :key="item.name" :class="!item.fixed ? 'draggable my_handle' : ' '" style="float:unset">
                    <td style="width:10%;"><i
                        :class="'my_handle ' + (item.fixed ? ' exclude-this-item' : ' fa fa-align-justify')"></i></td>
                    <td>{{ item.name }}</td>
                  </tr>
                </draggable>
              </table>
            </div>
          </div>
          <br />
          <hr class="p-2 m-0" />
        </b-overlay>
        <div class="row p-2">
          <div class="col-md-12">
            <h2>
              {{ formTranslation.widget_setting.widget_print_setting }}
            </h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="widget-print" v-model="widgetConfigData.widget_print"
                          @change="printStatusChange" name="widget-print" switch>
                          <b> {{ formTranslation.widget_setting.print }} </b>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div class="col-md-4"
                v-if="widgetConfigData.widget_print == true && (userData.addOns.kiviPro == true || userData.addOns.telemed == true || userData.addOns.googlemeet == true)">
                <div class="form-group">
                  <b-row class="mt-2 ml-4">
                    <b-col sm="12" md="12" lg="12">
                      <div class="form-group">
                        <b-form-checkbox size="md" id="widget-print-redirect"
                          v-model="widgetConfigData.afterWoocommerceRedirect" name="widget-print" switch>
                          <b> {{ formTranslation.widget_setting.redirectAfterWoocommerce }} </b>
                          <small>{{ formTranslation.widget_setting.redirectAfterWoocommerceNotice }}</small>
                        </b-form-checkbox>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary" :disabled="loader">
                <i :class="loader ? 'fa fa-sync fa-spin' : 'fa fa-save'"></i> {{ loader ? formTranslation.common.loading :
                  formTranslation.common.save }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </b-card>
</div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import { post, get } from "../../config/request";
import { alphaSpace, validateForm } from "../../config/helper";
import draggable from 'vuedraggable';
import { Chrome } from "vue-color";

export default {
  name: "WidgetSetting",
  display: "Table",
  order: 8,
  components: {
    draggable,
    "chrome-color-picker": Chrome,
  },
  data: () => {
    return {
      widgetConfigData: {},
      submitted: false,
      listLoader: true,
      dragging: false,
      request_status: 'off',
      dropDownOption: [
        { id: 1, label: 'phone_email' },
        { id: 2, label: 'show_phone_number' },
        { id: 3, label: 'show_email_address' },
        { id: 4, label: 'hide_contact_details' }
      ],
      loader: false,
      widgetLoaderPreview: '',
      formLoader: true,
      widgetListOrder: [],
      widgetLoader: ''
    };
  },
  mounted() {
    if (!['administrator'].includes(this.getUserRole())) {
      this.$router.push({ name: "403" })
    }
    this.widgetLoader = this.formTranslation.common.no_file_chosen
    this.widgetConfigData = this.defaultWidgetData();
    this.widgetEdit();
    this.init();
    this.getWidgetLoader();
    this.getModule();
  },
  validations: {
    widgetConfigData: {
      showClinicImage: {},
      showClinicAddress: {},
      clinicContactDetails: {},
      showDoctorImage: {},
      showDoctorExperience: {},
      doctorContactDetails: {},
      showDoctorSpeciality: {},
      showDoctorDegree: {},
      showDoctorRating: {},
      showServiceImage: {},
      skip_service_when_single: {},
      showServicetype: {},
      showServicePrice: {},
      showServiceDuration: {},
      primaryColor: {},
      primaryHoverColor: {},
      secondaryColor: {},
      secondaryHoverColor: {},
      widget_print: {},
      afterWoocommerceRedirect: {},
      widgetLoader: {}
    }
  },
  methods: {
    init() {
      this.dropDownOption = this.dropDownOption.map((item) => {
        item.label = this.formTranslation.widget_setting[item.label];
        return item;
      })
    },
    checkMove(e) {
      return this.isDraggable(e.draggedContext);
    },
    isDraggable(context) {
      const { index, futureIndex } = context
      return !(this.widgetConfigData.list[index].fixed || this.widgetConfigData.list[futureIndex].fixed);
    },
    defaultWidgetData() {
      return {
        showClinicImage: '1',
        showClinicAddress: '1',
        clinicContactDetails: '',
        showDoctorImage: '1',
        showDoctorExperience: '1',
        doctorContactDetails: '',
        showDoctorSpeciality: '1',
        showDoctorDegree: '1',
        showDoctorRating: '1',
        showServiceImage: '1',
        skip_service_when_single: '0',
        showServicetype: '1',
        showServicePrice: '1',
        showServiceDuration: '1',
        primaryColor: '#7093e5',
        primaryHoverColor: '#948f8f',
        secondaryColor: '#f68685',
        secondaryHoverColor: '#df504e',
        widget_print: '1',
        afterWoocommerceRedirect: '1',
        list: [],
      };
    },
    getWidgetLoader: function () {
      this.formLoader = true;
      get("get_widget_loader", {})
        .then((response) => {
          if (
            response.data.status !== undefined &&
            response.data.status === true
          ) {
            this.widgetLoaderPreview = response.data.url
          }
          this.formLoader = false;
        })
        .catch((error) => {
          this.formLoader = false;
          console.log(error);
        });
    },
    uploadWidgetLoader: function () {
      let _this = this;

      var custom_uploader = kivicareCustomImageUploader(this.formTranslation)

      custom_uploader.on('select', function () {
        var attachment = custom_uploader.state().get('selection').first().toJSON();
        _this.widgetLoaderPreview = attachment.url;
        _this.widgetLoader = attachment.filename
        post("upload_widget_loader", { widget_loader: attachment.id })
          .then((response) => {
            if (
              response.data.status !== undefined &&
              response.data.status === true
            ) {
              _this.widgetLoaderPreview = response.data.data;
              displayMessage(response.data.message);
            } else {
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });

      //Open the uploader dialog
      custom_uploader.open();
    },
    handleSubmit() {

      this.submitted = true;
      this.loader = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.loader = false;
        return;
      }

      if (validateForm("widgetSettingForm")) {
        post("widget_setting_save", { data: this.widgetConfigData, list: this.widgetListOrder })
          .then((response) => {
            this.loader = false;
            if (
              response.data.status !== undefined &&
              response.data.status === true
            ) {
              displayMessage(response.data.message);
            } else {
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            this.loader = false;
            this.submitted = false;
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          });
      }
    },
    widgetEdit() {
      this.formLoader = true;
      get("get_widget_setting", {})
        .then((response) => {
          this.formLoader = false;
          this.listLoader = false;
          if (
            response.data.status !== undefined &&
            response.data.status === true
          ) {
            this.widgetConfigData = response.data.data;
            this.widgetConfigData.list = response.data.widgetOrder;
          }
          if (response.data.widgetOrder !== undefined && response.data.widgetOrder.length > 0) {
            this.widgetListOrder = response.data.widgetOrder
          }
        })
        .catch((error) => {
          this.listLoader = false;
          this.formLoader = false;
          console.log(error);
          displayErrorMessage(this.formTranslation.widgets.record_not_found);
        });
    },
    printStatusChange() {
      if (this.widgetConfigData.widget_print != true) {
        this.widgetConfigData.afterWoocommerceRedirect = false
      }
    },
    getModule: function () {
      if (window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== '') {
        this.request_status = window.request_data.link_show_hide;
      }
    }
  },
  computed: {
    userData() {
      return this.$store.state.userDataModule.user;
    },
    cssProps() {
      return {
        '--color-spinner': this.widgetConfigData.primaryColor,
      }
    }
  },
  watch: {

  },
  formTranslation: function () {
    return this.$store.state.staticDataModule.langTranslateData;
  },
};
</script>
<style scoped>
.buttons {
  margin-top: 35px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.my_handle {
  float: right;
}


*,
*:before {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
}

.double-lines-spinner {
  width: 64px !important;
  height: 64px !important;
  border-radius: 50% !important;
  position: relative !important;
}

.double-lines-spinner::before {
  content: "" !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  border-radius: 50% !important;
  border: 2px solid rgba(0, 0, 0, 0.05) !important;
}

.double-lines-spinner::before {
  border-right: 2px solid var(--color-spinner) !important;
  -webkit-animation: kivi-spin 0.5s 0s linear infinite;
  -moz-animation: kivi-spin 0.5s 0s linear infinite;
  animation: kivi-spin 0.5s 0s linear infinite !important;
}


@keyframes kivi-spin {
  100% {
    transform: rotate(360deg) !important;
    -webkit-transform: rotate(360deg);
  }
}

@-moz-keyframes kivi-spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}

@-webkit-keyframes kivi-spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>