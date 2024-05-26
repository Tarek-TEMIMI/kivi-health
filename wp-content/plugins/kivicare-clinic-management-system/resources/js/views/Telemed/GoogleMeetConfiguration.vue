<template>
  <div>
    <b-overlay :show="userData.addOns.googlemeet != true" variant="white"
               :opacity="overlayOpacity">
      <template #overlay>
        <overlay-message addon_type="googlemeet"></overlay-message>
      </template>
    <b-card class="card-body google-meet-setting" header-tag="header" footer-tag="footer">
      <div class="row p-2">
        <div class="col-md-12">
          <h2 class=" ">
            {{ formTranslation.googlemeet.googlemeet }}
            <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/google-meet-telemed-woocommerce-addon/admin/" target="_blank"><i class="fa fa-question-circle"></i></a>
          </h2>
        </div>
      </div>
      <hr class="p-2 m-0" />
      <div class="row">
        <div class="col-md-12">

          <div class="row">
            <div class="col-md-5">
              <form
                  id="googleCalform"
                  name="googleCalform"
                  @submit.prevent="handleCalenderSubmit"
                  :novalidate="true"
                  enctype="multipart/form-data"
              >
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                      <b-row class="mt-2 ml-4">
                        <b-col sm="12" md="12" lg="12">
                          <div class="form-group">
                            <b-form-checkbox
                              size="md"
                              id="google-meet-configuration"
                              v-model="googleCalData.enableCal"
                              name="google-meet-configuration"
                              value="Yes"
                              unchecked-value="No"
                              switch
                              @change="handleCalenderSubmit"
                            >
                              <b> {{formTranslation.googlemeet.google_meet_configuration}} </b>
                            </b-form-checkbox>
                          </div>
                        </b-col>
                      </b-row>
                    </div>
                  </div>
                  <div class="col-md-12" v-if="googleCalData.enableCal == 'Yes'">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label for="client_id" class="form-control-label"
                          >{{formTranslation.googlemeet.google_meet_client_id}}
                          </label>
                          <input
                              type="text"
                              id="client_id"
                              class="form-control"
                              name="client_id"
                              v-model="googleCalData.client_id"
                          />
                        </div>
                        <div v-if="submitted && !$v.googleCalData.client_id.required" class="invalid-feedback">{{formTranslation.googlemeet.google_meet_client_id_required}}</div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label for="client_secret" class="form-control-label"
                          >{{formTranslation.googlemeet.google_meet_client_secret}}
                          </label>
                          <input
                              type="text"
                              id="client_secret"
                              class="form-control"
                              name="client_secret"
                              v-model="googleCalData.client_secret"
                          />
                        </div>
                        <div v-if="submitted && !$v.googleCalData.client_secret.required" class="invalid-feedback">{{formTranslation.googlemeet.google_meet_client_secret_required}}</div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label for="app_name" class="form-control-label"
                          >{{formTranslation.common.app_name}}
                          </label>
                          <input
                              type="text"
                              id="app_name"
                              class="form-control"
                              name="app_name"
                              v-model="googleCalData.app_name"
                          />
                        </div>
                        <div v-if="submitted && !$v.googleCalData.app_name.required" class="invalid-feedback">{{formTranslation.common.app_name_required}}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row" v-if="googleCalData.enableCal == 'Yes'">
                  <div class="col-md-12">
                    <div class="d-flex justify-content-end">
                      <button type="submit" id="btn-google-submit" class="btn btn-primary">
                        <i class="fa fa-save"></i> {{ formTranslation.common.save }}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div class="col-md-7 mt-3" v-if="googleCalData.enableCal == 'Yes'">
              <div class="row">
                <div class="col-md-12">
                  <h4 class="text-primary mb-3">
                    {{formTranslation.googlemeet.guide_to_setup_google_meet}}
                  </h4>
                </div>
              </div>
              <b-list-group>
                <b-list-group-item
                > <b> {{'Step:1'}} </b>
                  <a href="https://apps.iqonic.design/docs/product/kivicare/google-calendar/" target="_blank">
                    {{ formTranslation.pro_setting.please_refer_link}}</a
                  ></b-list-group-item
                >
                <b-list-group-item>
                  <p> <b>Note:</b> If you have already setup Google calendar then You can use same ClientID and Client Secret here.</p>
                  </b-list-group-item>
              </b-list-group>
            </div>
          </div>
        </div>
      </div>
    </b-card>
    <div class="page-loader-section" v-if="formLoader">
      <loader-component-2></loader-component-2>
    </div>
    <form v-else id="googleMeetForm" :novalidate="true">
      <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row>
            <b-col sm="8" md="8" lg="8">
              <h2 class="mb-0">{{ formTranslation.googlemeet.google_event_template }}</h2>
            </b-col>
          </b-row>
        </template>
        <div v-for="(item, index) in googleEventList" :key="index">
          <b-collapse :id="'accordion'" :visible="true" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <label class="form-control-label">{{formTranslation.google_event.google_event_title}}</label>
              <input
                  class="form-control"
                  type="text"
                  id="example-color-input"
                  v-model="item.post_title"
              />
              <label class="form-control-label">{{formTranslation.google_event.google_event_desc}} </label>
              <vue-editor :editorToolbar="customToolbar" v-model="item.post_content" ></vue-editor>
            </b-card-body>
          </b-collapse>
        </div>
        <b-row class="mt-2">
          <b-col sm="12" md="12" lg="12">
            <div class="d-flex justify-content-end">
              <button v-if="!loading" class="btn btn-primary rtl-ml-2" type="button" @click="saveGoogleEventTemplate">
                <i class="fa fa-save mr-1"></i> {{ formTranslation.common.save }}
              </button>
              <button v-else class="btn btn-primary" type="submit" disabled>
                <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
              </button>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </form>
    </b-overlay>
  </div>
</template>
<script>
import { post,get } from "../../config/request";
import {maxValue, minValue, required} from "vuelidate/lib/validators";
import {alphaSpace, validateForm} from "../../config/helper";
export default {
  name: "generalSetting",
  components: {
  },
  data: () => {
    return {
      googleCalData: {},
      loading: false,
      googleEventList:[],
      eventTitle: '',
      request_status:'off',
      templateSaveRequest: {
        ID: 0,
        post_content: '',
      },
      formLoader:true.valueOf,
      submitted: false,
      customToolbar: [[{
        header: [false, 1, 2, 3, 4, 5, 6]
      }], ["bold", "italic", "underline", "strike"], // toggled buttons
        [{
          align: ""
        }, {
          align: "center"
        }, {
          align: "right"
        }, {
          align: "justify"
        }], ["blockquote", "code-block"], [{
          list: "ordered"
        }, {
          list: "bullet"
        }, {
          list: "check"
        }], [{
          indent: "-1"
        }, {
          indent: "+1"
        }], // outdent/indent
        [{
          color: []
        }, {
          background: []
        }], // dropdown with defaults from theme
      ]
    };
  },
  mounted() {
    if(!['administrator'].includes(this.getUserRole())) {
      this.$router.push({ name: "403"})
    }
    this.googleCalData = this.defaultGoogleData();
    this.getGoogleEventTemplate();
    this.getModule();
  },
  validations: {
    googleCalData: {
        client_id: { required },
        client_secret: { required },
        app_name:{required}
    }
  },
  methods: {
    handleCalenderSubmit() {
      if(this.userData.addOns.googlemeet != true){
        return
      }

      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.googleCalData.$invalid) {
        // this.submitted = false;
        return;
      }
      var element =$('#btn-google-submit').find("i");
      element.removeClass('fa fa-save ')
      element.addClass("fa fa-spinner fa-spin");

      post("google_meet_config",this.googleCalData)
          .then((response) => {
                this.submitted = false;
                element.removeClass("fa fa-spinner fa-spin");
                element.addClass("fa fa-save");
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
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          });
    },
    defaultGoogleData() {
      return {
        client_id: "",
        client_secret: "",
        app_name: "",
        enableCal: false,
      };
    },
    getGoogleEventTemplate: function () {
      this.formLoader = true;
      get('get_google_meet_event_template_and_config', {})
          .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              this.googleEventList = response.data.data
            }
            if(response.data.config !== undefined && response.data.config.status !== undefined && response.data.config.status === true){
              this.googleCalData = response.data.config.data;
            }
            this.formLoader = false;
          })
          .catch((error) => {
            this.formLoader = false;
            console.log(error);
          })
    },
    saveGoogleEventTemplate: function () {
      if(this.userData.addOns.googlemeet != true){
        return
      }
      this.loading = true;
      post('save_google_meet_event_template', { data : this.googleEventList } )
          .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message);
            } else {
              displayErrorMessage(response.data.message);
            }
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            displayErrorMessage(this.formTranslation.common.server_error);
          })
    },
    getModule:function (){
        if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
        this.request_status = window.request_data.link_show_hide;
        }
    }
  },
  computed:{
    userData() {
      return this.$store.state.userDataModule.user;
    },
  }
};
</script>

<style scoped>

</style>