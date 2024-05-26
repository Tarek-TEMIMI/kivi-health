<template>
  <div>
    <b-row>
      <b-col sm="12" md="12" lg="12">
        <b-overlay :show="userData.addOns.kiviPro != true" variant="white"
                   :opacity="overlayOpacity">
          <template #overlay>
            <overlay-message addon_type="pro"></overlay-message>
          </template>
          <form id="doctorDataForm" :novalidate="true">
            <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
              <template v-slot:header>
                <b-row>
                  <b-col sm="6" md="6" lg="6">
                    <h2 class="mb-0">{{ formTranslation.settings.sms_template }} <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/pro-version/sms-whatsapp-template/" target="_blank"><i class="fa fa-question-circle"></i></a> </h2>
                  </b-col>
                  <b-col sm="6" md="6" lg="6">
                    <div class="d-flex justify-content-end">
                      <!-- <router-link class="btn btn-sm btn-primary" :to="{ name: 'custom_notification' }">
                        <i class="fas fa-bell"></i> {{ formTranslation.common.custom_notification }}
                      </router-link> -->
                      <button class="btn btn-sm  btn-primary " type="button" @click="$refs.NotificationTestModal.modalOpen = true; $refs.NotificationTestModal.notificationType='sms'"><i class="fas fa-sms"></i> {{formTranslation.widgets.send_test_sms}}</button>
                      <button class="btn btn-sm  btn-primary " type="button" @click="$refs.NotificationTestModal.modalOpen = true; $refs.NotificationTestModal.notificationType='whatsapp'"><i class="fab fa-whatsapp"></i> {{formTranslation.widgets.send_test_whatsapp}}</button>
                    </div>
                  </b-col>
                </b-row>
              </template>
              <div class="page-loader-section" v-if="isLoading">
                <loader-component-2></loader-component-2>
              </div>
              <b-row v-else>
                <b-col sm="12" md="12" lg="12">
                  <div class="accordion" role="tablist">
                    <b-card no-body class="mb-1" v-for="(head, headIndex) in SMSTypeList" :key="headIndex">
                      <b-card-header header-tag="header" class="p-1" role="tab" >
                        <div class="d-flex align-items-center p-2 setting-accorditon">
                          <b-button type="button"  block variant="link shadow-none text-left" @click="mainAccordian(headIndex)" :class="selectedMainAccrodionId === headIndex ? 'not-collapsed' : ' ' ">
                            {{ labels[headIndex] !== undefined ? labels[headIndex] : headIndex }}
                          </b-button>
                        </div>
                      </b-card-header>
                      <b-collapse :id="'head_accrodian_'+headIndex" :visible="selectedMainAccrodionId === headIndex" accordion="my-accordion1" role="tabpanel">
                        <div class="accordion" role="tablist">
                          <b-card no-body class="mb-1 pl-3" v-for="(item, index) in head" :key="index">
                            <b-card-header header-tag="header" class="p-1" role="tab">
                              <div class="d-flex align-items-center p-2 setting-accorditon">
                                <b-form-checkbox
                                    size="md"
                                    :id="'checkbox-'+ item.ID"
                                    :name="'checkbox-'+ item.ID"
                                    v-model="item.post_status"
                                    value="publish"
                                    unchecked-value="draft"
                                >
                                </b-form-checkbox>
                                <b-button type="button" block variant="link shadow-none text-left"  :class="activeSmsTemplateIndex === item.ID ? 'not-collapsed' : ' ' "  @click="selectedSmsTemplate(item.ID)">  {{  item.post_status === 'publish' ? formTranslation.common['enabled_' + item.post_name] : formTranslation.common['disabled_' + item.post_name]    }} </b-button>
                              </div>
                            </b-card-header>
                            <b-collapse :id="'accordion-' + item.ID" :visible="item.ID === activeSmsTemplateIndex" accordion="my-accordion" role="tabpanel">
                              <div class="card-body d-flex " v-if="smsDynamicKey[item.post_name] !== undefined && smsDynamicKey[item.post_name] !== null">
                                <label> {{ formTranslation.settings.dynamic_keys_list }}</label>
                              </div>
                              <div class="card-body d-flex flex-wrap" v-if="smsDynamicKey[item.post_name] !== undefined && smsDynamicKey[item.post_name] !== null">
                                <button class="btn btn-sm  btn-primary mb-1" v-b-tooltip.hover :title="copyToolTipText" v-for="(emailValue, emailIndex) in smsDynamicKey[item.post_name]" :key="emailIndex" @click.prevent="copyDynamicKey(emailValue)" @mouseout="copyToolTipText=formTranslation.settings.click_to_copy">
                                  {{emailValue}}
                                </button>
                              </div>
                              <b-card-body>
                                <vue-editor :editorToolbar="customToolbar" :key="index" v-model="item.post_content" ></vue-editor>
                              </b-card-body>
                            </b-collapse>
                          </b-card>
                        </div>
                      </b-collapse>
                    </b-card>
                  </div>
                </b-col>
              </b-row>
              <b-row class="mt-2">
                <b-col sm="12" md="12" lg="12">
                  <div class="d-flex justify-content-end">
                    <button
                        v-if="!loading" class="btn btn-primary " type="button" @click="saveSMSTemplates"><i
                        class="fa fa-save mr-1"></i> {{ formTranslation.common.save }}
                    </button>
                    <button v-else class="btn btn-primary float-right" type="button" disabled><i
                        class="fa fa-sync fa-spin"></i> {{ formTranslation.common.loading }}
                    </button>
                  </div>
                </b-col>
              </b-row>
            </b-card>
          </form>
          <NotificationTestModal ref="NotificationTestModal" ></NotificationTestModal>
        </b-overlay>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import {post,get} from "../../../config/request";
import NotificationTestModal from "../NotificationTestModal";
export default {
  components:{NotificationTestModal},
  data: () => {
    return {
      SMSTypeList: [],
      activeSmsTemplateIndex: -1,
      smsTemplateTitle: '',
      request_status:'off',
      templateSaveRequest: {
        ID: 0,
        post_content: '',
      },
      loading: false,
      copyToolTipText:'',
      smsDynamicKey: [],
      labels:[],
      selectedMainAccrodionId:-1,
      isLoading:true,
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
    }
  },
  mounted() {
    if(!['administrator'].includes(this.getUserRole())) {
      this.$router.push({ name: "403"})
    }
    this.init();
    this.copyToolTipText = this.formTranslation.settings.click_to_copy
    this.getModule();
  },
  methods: {
    init: function () {
      this.getSMSTemplate();
    },
    mainAccordian(value){
      this.selectedMainAccrodionId = this.selectedMainAccrodionId === value ? -1 : value;
    },
    getSMSTemplate: function () {
      get('get_sms_template', {})
        .then((response) => {
          if (response.data.status !== undefined && response.data.status === true) {
            this.isLoading = false
            this.SMSTypeList = response.data.data
            if(response.data.dynamicKey !== undefined ){
              this.smsDynamicKey = response.data.dynamicKey;
            }
            this.labels = response.data.labels;
          }
        })
        .catch((error) => {
          console.log(error);
        })
    },
    selectedSmsTemplate: function (value) {
      this.activeSmsTemplateIndex = this.activeSmsTemplateIndex === value ? ' ' : value;
    },
    saveSMSTemplates: function () {
      if(this.userData.addOns.kiviPro != true){
        return;
      }
      this.loading = true;
      post('save_sms_template', { data : this.SMSTypeList } )
        .then((response) => {
          if (response.data.status !== undefined && response.data.status === true) {
            this.getSMSTemplate();
            displayMessage(response.data.message);
            displayMessage(response.data.message);
          } else {
            displayErrorMessage(response.data.message);
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          displayErrorMessage(this.formTranslation.common.server_error+'.');
        })
    },
    copyDynamicKey: function(id) {
      const elem = document.createElement("input");
      document.querySelector("body").appendChild(elem);
      elem.value = id;
      elem.select();
      document.execCommand("copy");
      elem.remove();
      this.copyToolTipText =  id + ' ' + this.formTranslation.settings.copied
    },
    getModule:function (){
        if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
        this.request_status = window.request_data.link_show_hide;
        }
    }
  },
  watch: {},
  computed:{
    userData () {
      return this.$store.state.userDataModule.user;
    }
  }
}

</script>
<style>
.accordion .card-header:has(button.not-collapsed):after {
  content: "\F077" !important;
}
</style>