<template>
  <div>
    <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
      <template v-slot:header>
        <b-row>
          <b-col sm="8" md="8" lg="8">
            <h2 class="mb-0">{{ formTranslation.settings.permission_setting }} <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#patient-setting" target="_blank"><i class="fa fa-question-circle"></i></a> </h2>
          </b-col>
        </b-row>
      </template>
      <div class="page-loader-section" v-if="formLoader">
        <loader-component-2></loader-component-2>
      </div>
      <b-overlay :show="userData.addOns.kiviPro != true" variant="white"
                 :opacity="overlayOpacity">
        <template #overlay>
          <overlay-message addon_type="pro"></overlay-message>
        </template>
      <div v-if="userData.addOns.kiviPro" class="iq-role-permission-accordion accordion" role="tablist">
        <b-card v-for="(index,key) in allPermissionListData" :key="key" no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab" >
            <div class="p-2 setting-accorditon">
              <b-button type="button" v-b-toggle="'accordion-'+key"  block variant="link shadow-none text-left" class="pl-0">
                {{ role_list[key] +' role'}}
              </b-button>
            </div>
          </b-card-header>
          <b-collapse :id="'accordion-'+key" visible accordion="my-accordion" role="tabpanel">
            <b-card  v-for="(index2 ,key2) in index.capabilities" :key="key2" no-body class="mt-0 mb-0 ml-3 accordion" v-if="kivicareCheckModule(key,key2)">
              <b-card-header header-tag="header" class="p-1" role="tab" >
                <div class="d-flex align-items-center setting-accorditon">
                  <b-button type="button" v-b-toggle="'accordion-module-'+key2"  block variant="link shadow-none text-left" >
                    {{ formTranslation.common[key2] }}
                  </b-button>
                </div>
              </b-card-header>
              <b-collapse :id="'accordion-module-'+key2" visible accordion="my-accordion-2" role="tabpanel">
                <b-card-body>
                  <div class="row m-3">
                    <div class="col-md-3 col-12" v-for="(capVal ,capKey) in index2" :key="capKey" v-if="kivicareCapability(key,capKey)">
                      <div class="form-group ml-4">
                        <b-form-checkbox
                            size="md"
                            :id="'checkbox-'+key+capKey"
                            v-model="index.capabilities[key2][capKey]"
                            :name="'checkbox-'+key+capKey"
                            switch
                            :value="true"
                            :unchecked-value="false"
                        >
                          <b class="form-control-label"> {{ capKey.split('_').map((v) => {
                            if(v.toLowerCase().includes(plugin_prefix.replace('_','').toLowerCase())){
                              v = '';
                            }
                            v = v.split('');
                            if(v[0]){
                              v[0] = v[0].toUpperCase()
                            }
                            return v.join('');
                          }).join(' ') }} </b>
                        </b-form-checkbox>
                      </div>
                    </div>
                  </div>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card-body>
              <div class="row m-3">
                <div class="col-12 d-flex justify-content-end align-items-center">
                  <button :id="key" class="btn btn-primary"  @click="handleSubmit(key)">
                    {{ formTranslation.doctor.save_btn }}
                  </button>
                  <button class="btn btn-outline-primary"  v-b-toggle="'accordion-'+key" :disabled="isSubmited">
                    {{ formTranslation.common.cancel }}
                  </button>
                </div>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
      <div v-else>
        <div class="iq-role-permission-accordion accordion" role="tablist">
          <b-card v-for="(index,key) in role_list" :key="key" no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab" >
              <div class="p-2 setting-accorditon">
                <b-button type="button" v-b-toggle="'accordion-'+key"  block variant="link shadow-none text-left" class="pl-0">
                  {{ role_list[key] +' role'}}
                </b-button>
              </div>
            </b-card-header>
          </b-card>
        </div>
      </div>
    </b-overlay>
    </b-card>
  </div>
</template>
<script>
import { post, get } from "../../config/request";
export default {
  name: "PermissionSetting",
  components: {
  },
  data: () => {
    return {
      allPermissionListData:{},
      formLoader:true,
      request_status:'off',
      check_value:'on',
      plugin_prefix:window.pluginPREFIX,
      isSubmited:false,
      role_list:{}
    };
  },
  mounted() {
    if(!['administrator'].includes(this.getUserRole())) {
      this.$router.push({ name: "403"})
    }
    this.role_list = {
      administrator:'Administrator',
      kiviCare_clinic_admin:this.formTranslation.common.clinic_admin,
      kiviCare_receptionist:this.formTranslation.common.receptionist,
      kiviCare_doctor:this.formTranslation.doctor_session.dt_lbl_doc,
      kiviCare_patient:this.formTranslation.common.patient,
    }
    this.allPermissionList();
    this.getModule();
  },
  methods: {
    allPermissionList() {
      this.formLoader = true
      get("all_permission_list", {})
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              this.allPermissionListData = response.data.data;
            }
            this.formLoader = false
          })
          .catch((error) => {
            this.formLoader = false
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          });
    },
    handleSubmit(key){
      // this.isSubmited =true
      let but = $('#'+key)
      but.html(this.formTranslation.common.loading)
      but.prop('disabled',true);
      post('save_permission_list', {data : this.allPermissionListData,type:key})
          .then((response) => {
            but.html(this.formTranslation.common.save)
            but.prop('disabled',false);
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message)
              this.$store.dispatch("userDataModule/fetchUserData", {});
            }else{
              displayErrorMessage(response.data.message)
            }
          })
          .catch((error) => {
            but.html(this.formTranslation.common.save)
            but.prop('disabled',false);
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    kivicareCapability(role,capability){
      capability = capability.toLowerCase()
      role = role.toLowerCase()
      let prefix = this.plugin_prefix.toLowerCase()
      let status = capability.includes(prefix)
      if(role === 'administrator'){
        return status && !([prefix+'settings',prefix+'dashboard',prefix+'common_settings',prefix+'terms_condition',prefix+'notification_setting',prefix+'home_page',
          prefix+'patient_clinic',prefix+'patient_view',prefix+'patient_profile',prefix+'prescription_view',prefix+'receptionist_view',prefix+'receptionist_profile',
          prefix+'service_view',prefix+'static_data_view',
          prefix+'custom_field_view',prefix+'clinic_view',prefix+'doctor_dashboard',prefix+'doctor_view',prefix+'doctor_profile', prefix+'patient_encounters'].includes(capability));
      }else if(role === prefix+'clinic_admin'){
        return status && !([prefix+'settings',prefix+'common_settings',prefix+'terms_condition',prefix+'notification_setting',prefix+'custom_field_view',prefix+'doctor_dashboard',prefix+'doctor_view',prefix+'patient_encounters',prefix+'service_view',
          prefix+'patient_clinic',prefix+'patient_view',prefix+'prescription_view',prefix+'receptionist_view',prefix+'static_data_view',prefix+'static_data_delete',prefix+'patient_bill_delete'].includes(capability))
      }else if(role === prefix+'doctor'){
        return status && !([prefix+'settings',prefix+'patient_encounters',prefix+'prescription_view',prefix+'patient_clinic',
          prefix+'patient_view',prefix+'service_view',prefix+'static_data_view',prefix+'static_data_delete'].includes(capability))
      }else if(role === prefix+'receptionist'){
        return status && !([prefix+'settings',prefix+'doctor_dashboard',prefix+'doctor_view',prefix+'patient_encounters',prefix+'patient_clinic',
          prefix+'patient_view',prefix+'prescription_view',prefix+'service_view',prefix+'doctor_session_delete',prefix+'static_data_view',prefix+'static_data_delete',prefix+'patient_bill_delete'].includes(capability))
      }if(role === prefix+'patient'){
        return status && !([prefix+'service_list',prefix+'patient_encounters',prefix+'patient_encounter_add',
          prefix+'patient_encounter_edit',prefix+'patient_encounter_delete',prefix+'prescription_view'].includes(capability));
      }
    },
    kivicareCheckModule(role,module){
      let status = true;
      switch (role){
        case 'administrator':
          break;
        case 'kiviCare_clinic_admin':
          status = !(['clinic_module'].includes(module))
          break;
        case 'kiviCare_doctor':
          status = !(['doctor_module','custom_field_module'].includes(module))
          break;
        case 'kiviCare_patient':
          status = !(['doctor_module','service_module','session_module','static_data_module'].includes(module))
          break;
        case 'kiviCare_receptionist':
          status = !(['receptionist_module','clinic_module'].includes(module))
          break;
      }
      return status;
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

<style scoped>
.accordion .card-header:has(button.not-collapsed):after {
  content: "\F077" !important;
}
</style>