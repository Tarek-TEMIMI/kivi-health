<template>
  <div>
    <ModalPopup
          v-if="openModel"
          modalId="appointment-details-modal"
          modalSize="lg"
          :openModal="openModel"
          :modalTitle="module_name + ' ' + formTranslation.common.import"
          @closeModal="model_close"
        >
        <div v-if="submitting">
        <loader-component-2 ></loader-component-2>
      </div>
      <div v-if="import_done">
        <div class="row">
          <div class="col-md-6">
            <p class="mb-0 ">
              <span class="font-weight-bold">
                {{ formTranslation.common.total_rows }} :
              </span>
              {{ totals }}
            </p>
          </div>
          <div class="col-md-6">
            <p class="mb-0 ">
              <span class="font-weight-bold">
                {{ formTranslation.common.total_rows_inserted }} :
              </span>
              {{ total_row_inserted }}
            </p>
          </div>
          <div class="col-6 mt-2" v-for="(value,key) in Object.values(detail_report)" :key="key" v-if="value.value > 0">
            <p class="mb-0 ">
              <span class="font-weight-bold">
                {{ value.label}} :
              </span>
              {{ value.value }}
            </p>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-12 d-flex justify-content-center align-items-center">
            <button class="btn btn-primary" @click="resetForm"> {{formTranslation.common.import_more_file}}</button>
            <button type="button" class="btn btn-outline-primary" @click="model_close">
              {{formTranslation.common.close}}
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="row">
          <div class="col-4">
            <div class="form-group">
              <label for="select_type" class="form-control-label">
                {{formTranslation.static_data.tag_select_type_plh}}
              </label>
              <b-select @change="typeChange" v-model="upload_file_detail.type" class="form-control" id="select_type">
                <option v-for="(index,key) in importTypeOption" :key="key" :value="index.type"> {{index.label}}</option>
              </b-select>
              <div v-if="submittedValidation && !$v.upload_file_detail.type.required"
                   class="invalid-feedback">{{formTranslation.common.file_type + formTranslation.common.required}}
              </div>
            </div>
          </div>
          <div class="col-8">
            <div class="form-group">
              <label for="file_upload" class="form-control-label">{{ formTranslation.common.upload_file }} </label>
              <div class="input-group kivi-choose-file flex-nowrap">
                <div class="input-group-prepend flex-shrink-0">
                  <button class="btn btn-primary px-2" type="button" id="file_upload" @click.prevent="upload_import_data_file()" :disabled="fileUploadLoader">{{ fileUploadLoader ? formTranslation.common.loading  : formTranslation.common.choose_file }}</button>
                </div>
                <label class="input-group-text" for="file_upload">{{ upload_file_detail.name }}</label>
              </div>
              <div v-if="submittedValidation && !$v.upload_file_detail.url.required"
                   class="invalid-feedback">{{ formTranslation.common.no_file_chosen}}
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <p class="font-weight-bold" v-if="sample_file[upload_file_detail.type]">
              <a :href="sample_file[upload_file_detail.type]" class="text-primary" target="_blank" :download="module_type +'.'+(upload_file_detail.type === 'xls' ? 'xlsx' : upload_file_detail.type)">
                {{formTranslation.common.lbl_download_sample_file}}
              </a>
            </p>
            <p class="font-weight-bold">
              {{formTranslation.common.lbl_required_field + ' ' + upload_file_detail.type + ' ' + formTranslation.common.lbl_file }}
            </p>
            <ul>
              <li v-for="(index,key) in required_data" :key="key">
                {{index.label}}
              </li>
            </ul>
          </div>
        </div>
        <div class="row" v-if="['clinic','doctor','patient','receptionist'].includes(module_type)">
          <div class="col-12">
            <p class="font-weight-bold mb-1">
              {{formTranslation.common.send_notification_when_user_register }}
            </p>
            <div id="send_notification_to_user" class="custom-control custom-checkbox mr-2">

              <input
                  id="email_notification"
                  v-model="upload_file_detail.e_mail"
                  :value="1"
                  class="custom-control-input"
                  name="email_notification"
                  type="checkbox"

              />
              <label class="custom-control-label text-capitalize" for="email_notification">
                {{ formTranslation.common.email }} </label>
            </div>
            <div id="send_notification_to_user" class="custom-control custom-checkbox  mr-2">
              <input
                  id="sms_notification"
                  v-model="upload_file_detail.sms"
                  :value="1"
                  class="custom-control-input"
                  name="sms_notification"
                  type="checkbox"

              />
              <label class="custom-control-label text-capitalize" for="sms_notification">
                {{ formTranslation.common.message }} </label>
            </div>
            <div class="mt-2">
              <span class="text-primary small font-weight-bold">{{formTranslation.common.note_notification}}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="d-flex justify-content-end">
              <button class="btn btn-sm btn-primary" type="button"   @click="handleSubmit" >
                <i v-if="submitting" class="fa fa-sync fa-spin"></i> <i v-else class="fa fa-save"></i> {{ ( submitting ? formTranslation.common.loading : formTranslation.common.save ) }}
              </button>
              <button type="button"  class="btn btn-sm btn-outline-primary" @click="model_close" :disabled="submitting">
                {{formTranslation.common.cancel}}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPopup>
  </div>
</template>

<script>
import {get, post} from "../../config/request";
import {required,requiredIf} from "vuelidate/lib/validators";
import ModalPopup from '../Modal/Index';

export default {
  name: "ModuleDataImport",
  components:{
    ModalPopup
  },
  props:{
    module_type:{
      type:[String],
      default(){
        return ''
      }
    },
    module_name:{
      type:[String],
      default(){
        return ''
      }
    },
    required_data:{
      type:[Array,Object],
      default(){
        return []
      }
    },
    encounter_id:{
      type:[String,Number],
      default(){
        return 0;
      }
    }
  },
  data:() =>{
    return {
      openModel:false,
      importTypeOption:[
        {
          type:'csv',
          label:'CSV'
        },
        {
          type:'xls',
          label:'XLS'
        }
      ],
      upload_file_detail: {
        name :'',
        type:'csv',
        url:'',
        id:'',
        module_type:'',
        sms:0,
        e_mail:0
      },
      fileUploadLoader:false,
      submitting:false,
      submittedValidation:false,
      sample_file:{
        csv:'',
        xls:'',
      },
      totals:0,
      total_row_inserted:0,
      import_done:false,
      detail_report:{

      }
    }
  },
  validations: {
    upload_file_detail: {
      url: {
        required
      },
      type:{
        required
      },
      id:{
        required
      }
    }
  },
  mounted() {
    this.upload_file_detail.name = this.formTranslation.common.no_file_chosen
    this.get_demo_sample_file()
  },
  methods:{
    upload_import_data_file() {
      if(this.userData.addOns.kiviPro !== true){
        return;
      }
      let _this = this;

      this.fileUploadLoader = true;
      var custom_uploader = kivicareCustomImageUploader(this.formTranslation,this.upload_file_detail.type)

      custom_uploader.on('select', function () {
        var attachment = custom_uploader.state().get('selection').first().toJSON();
        _this.upload_file_detail.name = attachment.filename
        _this.upload_file_detail.url = attachment.url
        _this.upload_file_detail.id = attachment.id
        _this.fileUploadLoader = false;
      });

      //Open the uploader dialog
  
      custom_uploader.on('open',function (){
        _this.openModel = false;
      })
      
      custom_uploader.open()

      custom_uploader.on('close',function (){
        _this.openModel = true;
        _this.fileUploadLoader = false;
        custom_uploader.close()
      })

    },
    typeChange:function (){
      this.fileUploadLoader = false;
      this.upload_file_detail.id = '';
      this.upload_file_detail.url = '';
      this.upload_file_detail.name = this.formTranslation.common.no_file_chosen;
    },
    model_close:function (modal=true){
      if(modal){
        this.openModel = false;
      }
      this.upload_file_detail = {
        name: this.formTranslation.common.no_file_chosen,
        type: 'csv',
        url: '',
        id: '',
        module_type: '',
        sms:0,
        e_mail:0
      }
      this.import_done = false;
      this.fileUploadLoader = false;
      this.detail_report = {};
    },
    handleSubmit(){
      this.submittedValidation = true;
      this.$v.$touch();
      // stop here if form is invalid
      if (this.$v.upload_file_detail.$invalid) {
        return;
      }
      this.submittedValidation = false;
      this.submitting = true
      this.upload_file_detail.module_type = this.module_type
      this.upload_file_detail.encounter_id = this.encounter_id

      get('import_module_data', {...this.upload_file_detail,required_field:this.required_data})
          .then((data) => {
            this.submitting = false ;
            if (data.data.status !== undefined && data.data.status === true) {
              this.totals = data.data.total_row
              this.total_row_inserted = data.data.total_data_insert
              this.import_done= true;
              this.detail_report = data.data.detail_report
              this.$emit('reloadList')
              displayMessage(data.data.message)
            } else {
              displayErrorMessage(data.data.message)
            }
          })
          .catch((error) => {
            this.submitting =false
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    get_demo_sample_file(){
      get('import_demo_files', {module_type:this.module_type})
          .then((data) => {
            if (data.data.status !== undefined && data.data.status === true) {
              this.sample_file = data.data.data
            }
          })
          .catch((error) => {
            console.log(error);
          })
    },
    resetForm(){
      this.model_close(false);
      this.import_done = false;
    }
  },
  computed: {
    userData() {
      return this.$store.state.userDataModule.user;
    }
  },
  watch:{

  }
}
</script>

<style scoped>

</style>