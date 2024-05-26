<template>
  <div>
    <b-row>
      <b-col sm="12" md="12" lg="12">
        <form id="doctorDataForm" :novalidate="true">
          <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
            <template v-slot:header>
              <b-row>
                <b-col sm="8" md="8" lg="8">
                  <h2 class="mb-0">{{ formTranslation.settings.email_template }} <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#email-template" target="_blank"><i class="fa fa-question-circle"></i></a> </h2>
                </b-col>
                <b-col sm="4" md="4" lg="4">
                  <div class="d-flex justify-content-end">
                    <button class="btn btn-sm  btn-primary " type="button" @click="$refs.NotificationTestModal.modalOpen = true;$refs.NotificationTestModal.notificationType='email'"><i class="fas fa-paper-plane"></i> {{formTranslation.widgets.send_test_email}}</button>
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
                  <b-card no-body class="mb-1" v-for="(head, headIndex) in emailTypeList" :key="headIndex">
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
                              <b-button type="button" block variant="link shadow-none text-left" @click="selectedEmailTemplate(item.ID)" :class="activeEmailTemplateIndex === item.ID ? 'not-collapsed' : ' ' ">  {{  item.post_status === 'publish' ? formTranslation.common['enabled_' + item.post_name] : formTranslation.common['disabled_' + item.post_name]    }} </b-button>
                            </div>
                          </b-card-header>
                          <b-collapse :id="'accordion-' + item.ID" :visible="item.ID === activeEmailTemplateIndex" accordion="my-accordion" role="tabpanel">
                            <div class="card-body d-flex flex-wrap">
                              <label for="email_subject" class="form-control-label">{{ formTranslation.settings.lbl_email_subject }}</label>
                              <input
                              :id="'subject' + item.ID"
                              v-model="item.post_title"
                              :placeholder="formTranslation.settings.lbl_email_subject"
                              :name="'subject' + item.ID"
                              type="text"
                              class="form-control">
                            </div>
                            <div class="card-body d-flex " v-if="emailDynamicKey[item.post_name] !== undefined && emailDynamicKey[item.post_name] !== null">
                              <label> {{ formTranslation.settings.dynamic_keys_list }}</label>
                            </div>
                            <div class="card-body d-flex flex-wrap" v-if="emailDynamicKey[item.post_name] !== undefined && emailDynamicKey[item.post_name] !== null">
                              <button class="btn btn-sm  btn-primary mb-1" v-b-tooltip.hover :title="copyToolTipText" v-for="(emailValue, emailIndex) in emailDynamicKey[item.post_name]" :key="emailIndex" @click.prevent="copyDynamicKey(emailValue)" @mouseout="copyToolTipText=formTranslation.settings.click_to_copy">
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
                <div class=" d-flex justify-content-end">
                <button 
                  v-if="!loading" class="btn btn-primary " type="button" @click="saveEmailTemplates"> <i class="fa fa-save mr-1"></i> {{formTranslation.common.save}}
                </button>
                <button v-else class="btn btn-primary float-right" type="button" disabled> <i class="fa fa-sync fa-spin"></i> {{formTranslation.common.loading}} </button>
                </div>
              </b-col>
            </b-row>
          </b-card>
        </form>
      </b-col>
    </b-row>
    <NotificationTestModal ref="NotificationTestModal" ></NotificationTestModal>
  </div>
</template>
<script>
import {post,get} from "../../../config/request";
import NotificationTestModal from "../NotificationTestModal";
export default {
  components:{NotificationTestModal},
  data: () => {
    return {
      loading: false,
      request_status:'off',
      state: '',
      checked: '',
      activeTab: 0,
      emailTemplateTitle: 'Patient Registration Template',
      emailRequest: {
        to: 'akshayrathod482@gmail.com',
        subject: 'Test Email',
        message: 'This is Test email'
      },
      emailTemplateSaveRequest: {
        content: '',
        type: '',
      },
      templateSaveRequest: {
        ID: 0,
        post_content: '',
      },
      emailTemplateGetRequest: {
        type: 'patient_register',
      },
      testEmailRequest: {
        content: ''
      },
      emailTypeList: [],
      activeEmailTemplateIndex: -1,
      selectedMainAccrodionId:-1,
      copyToolTipText:'',
      emailDynamicKey: [],
      isLoading:true,
      labels:[],
      customToolbar: [
        [{
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
        },
        ],
      ]

    }
  },
  mounted() {
    if(!['administrator'].includes(this.getUserRole())) {
      this.$router.push({ name: "403"})
    }
    this.init();
    this.copyToolTipText = this.formTranslation.settings.click_to_copy;
    this.getModule();
  },
  methods: {
    init: function () {
      this.getEmailTemplate();
    },
    mainAccordian(value){
      this.selectedMainAccrodionId = this.selectedMainAccrodionId === value ? -1 : value;
    },
    saveEmailTemplates: function () {
      this.loading = true;
      post('save_email_template', { data : this.emailTypeList } )
        .then((response) => {
          if (response.data.status !== undefined && response.data.status === true) {
            this.getEmailTemplate();
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
    getEmailTemplate: function () {
      get('get_email_template', {})
        .then((response) => {
          if (response.data.status !== undefined && response.data.status === true) {
            this.isLoading = false;
            let data = response.data.data
            this.emailTypeList = data;
            if(response.data.dynamicKey !== undefined ){
              this.emailDynamicKey = response.data.dynamicKey;
            }
            this.labels = response.data.labels;
          }
        })
        .catch((error) => {
          console.log(error);
        })
    },
    selectedEmailTemplate: function (value) {
      this.activeEmailTemplateIndex = this.activeEmailTemplateIndex === value ? ' ' : value;
    },
    onTemplateCheckBoxChecked: function (value) {
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
  watch: {}
}
</script>
<style scoped>
.accordion .card-header:has(button.not-collapsed):after {
  content: "\F077" !important;
}
</style>