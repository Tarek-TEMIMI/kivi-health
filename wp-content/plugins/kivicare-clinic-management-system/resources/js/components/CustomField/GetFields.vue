<template>
  <div class="row" v-if="customFields.length > 0">
    <div v-for="(field, index) in customFields" class="col-md-5 mb-3" :key="index" v-if="field.status !== undefined && field.status == '1'">
      <label :for="field.name + '_' + index" class="form-control-label text-capitalize">
          {{ field.label }} <span class="text-danger" v-if="parseInt(field.isRequired) === 1">*</span>
      </label>
      <input
          v-if="field.type === 'text' || field.type === 'number'"
          :id="field.name + '_' + index"
          v-model="fieldsObj['custom_field_'+field.id]"
          :placeholder="field.placeholder"
          :required="parseInt(field.isRequired) === 1"
          :name="'custom_field_'+field.id"
          @change="handleValueChange"
          :type="field.type"
          class="form-control"
      />
      <div v-if="field.type === 'file_upload'">
      <div class="input-group">
        <div class="input-group-prepend">
            <button class="btn btn-primary" type="button" :id="field.name + '_' + index" @click.prevent="fileUpload(field)">{{ formTranslation.common.choose_file }}</button>
        </div>
        <label class="input-group-text" :for="field.name + '_' + index">{{ formTranslation.common.no_file_chosen }}</label>
      </div>
        <a class="text-primary m-1" :id="'custom_field_'+field.id+'_file_upload'" :href="fieldsObj['custom_field_'+field.id] && fieldsObj['custom_field_'+field.id].url ?  fieldsObj['custom_field_'+field.id].url : '' " target="_blank">
          {{fieldsObj['custom_field_'+field.id] && fieldsObj['custom_field_'+field.id].name ?  fieldsObj['custom_field_'+field.id].name : ''}}
        </a>
      </div>
      <b-select
          v-if="field.type === 'select'"
          :id="field.name + '_' + index"
          v-model="fieldsObj['custom_field_'+field.id]"
          class="form-control text-capitalize"
          :name="field.name"
          @change="handleValueChange"
          :required="parseInt(field.isRequired) === 1"
      >
          <option value=""> {{formTranslation.common.select_option}} </option>
          <option v-for="(option, index) in field.options" :value="option.id" :key="index" >{{ option.text }}</option>
      </b-select>
      <div v-if="field.type === 'radio'">
        <span v-if="field.placeholder" class="mb-0 d-block"> {{ field.placeholder }}  </span>
          <div v-for="(option, key) in field.options" class="custom-control custom-radio custom-control-inline" :key="key">
              <input
                  type="radio"
                  :id="field.name + '_' +key"
                  :name="'custom_field_'+field.id"
                  :required="parseInt(field.isRequired) === 1"
                  v-model="fieldsObj['custom_field_'+field.id]"
                  :value="option.id"
                  class="custom-control-input"
                  @change="handleValueChange"
              >
              <label class="custom-control-label" :for="field.name + '_' +key">{{ option.text }}</label>
          </div>
      </div>
      <div v-if="field.type === 'checkbox'">
          <div v-for="(option, key) in field.options" class="custom-control custom-checkbox custom-control-inline" :key="key">
              <input
                  type="checkbox"
                  :id="field.name + '_' +key"
                  :name="'custom_field_'+field.id"
                  :required="parseInt(field.isRequired) === 1"
                  v-model="fieldsObj['custom_field_'+field.id]"
                  :value="option.id"
                  class="custom-control-input"
                  @change="handleValueChange"
              >
              <label class="custom-control-label" :for="field.name + '_' +key">{{ option.text }}</label>
          </div>
      </div>
      <div v-if="field.type === 'calendar'">
        <input type="date" v-model="fieldsObj['custom_field_'+field.id]" id="doc_birthdate" @input="handleValueChange">
      </div>
      <textarea
          v-if="field.type === 'textarea'"
          :id="field.name + '_' + index"
          v-model="fieldsObj['custom_field_'+field.id]"
          :placeholder="field.placeholder"
          @change="handleValueChange"
          :name="'custom_field_'+field.id"
          class="form-control"
          :required="parseInt(field.isRequired) === 1"
      ></textarea>
      <multi-select
        v-if="field.type === 'multiselect'"
        :id="field.name + '_' + index"
        v-model="fieldsObj['custom_field_'+field.id]"
        :placeholder="field.placeholder"
        :name="'custom_field_'+field.id"
        label="text"
        track-by="id"
        :options="field.options"
        :multiple="true"
        @input="handleValueChange"
      ></multi-select>
    </div>
  </div>
</template>
<script>
import {post, get} from "../../config/request";
export default {
    props: {
        module_type: {
            type: [String],
            default() {
                return ""
            }
        },
        module_id: {
            type: [String,Number],
            default() {
                return ""
            }
        },
        doctor_id: {
          type: [String],
          default() {
            return ""
          }
        },
        fieldsValue: {
            type: [Array, Object],
            default() {
                return {};
            }
        },
        customFieldsObj: {
            type: [Array, Object],
            default() {
                return {};
            }
        }
    },
    data: () => {
        return {
            fieldsObj: {},
            validateRequired: [],
            customFields: []
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init: function () {
            if (this.module_type !== "") {

                get('get_custom_fields', {
                    module_type: this.module_type,
                    module_id: this.module_id,
                    doctor_id: this.doctor_id
                })
                    .then((response) => {
                        if (response.data.status !== undefined && response.data.status === true) {
                            if (response.data.data !== null && response.data.data !== undefined && response.data.data.length > 0) {
                                this.customFields = response.data.data;
                                this.$emit('customFieldAvailable');
                            }
                            this.handleFormObject()
                            this.handleValueChange();
                        } else {
                            displayErrorMessage(response.data.message)
                        }

                    })
                    .catch((error) => {
                        console.log(error);
                        displayErrorMessage(this.formTranslation.common.internal_server_error);
                    })
            } else {
                this.customFields = this.customFieldsObj;
                this.handleFormObject()
                this.handleValueChange();
            }
        },
        handleFormObject: function () {
            if (this.customFields.length > 0) {
                this.customFields.map((field) => {
                    if (field.type === "checkbox") {
                        this.fieldsObj['custom_field_'+field.id] = [];
                    } else if (field.type === "calendar") {
                      var date =  moment(field.field_data).format("YYYY-MM-DD");
                      this.fieldsObj['custom_field_'+field.id] = date;
                    }  else if(field.type === 'multiselect'){
                        this.$set(this.fieldsObj, 'custom_field_'+field.id, field.field_data ? field.field_data :[]);
                    }else {
                         this.fieldsObj['custom_field_'+field.id] = "";
                    }
                })
            }

        },
        handleValueChange: function () {
            this.validateRequired = []

            if (this.customFields.length > 0) {
                this.customFields.map((field) => {
                    var add = false;
                    if (parseInt(field.isRequired) === 1 && parseInt(field.status) === 1) {
                        if (Array.isArray(this.fieldsObj['custom_field_'+field.id])) {
                          if (this.fieldsObj['custom_field_'+field.id] === []) {
                                add = true;
                            }
                        } else {
                            if (!this.fieldsObj['custom_field_'+field.id]) {
                                add = true;
                            }
                        }

                        if (add === true) {
                            if (!this.validateRequired.includes('custom_field_'+field.id)) {
                                this.validateRequired.push('custom_field_'+field.id);
                            }
                        }
                    }
                })
            }
            this.$emit('bindCustomField', this.fieldsObj);
            this.$emit('requiredCustomField', this.validateRequired);
        },
        fileUpload(data){
            let _this = this;
            let mediaType = data.file_upload_type.map((index) => {
                return index.id;
            })
            let custom_uploader = kivicareCustomImageUploader(this.formTranslation,'custom_field',false,{
                mediaType:mediaType,

            })
            custom_uploader.on('select', function () {
                let attachment = custom_uploader.state().get('selection').first().toJSON();
                _this.fieldsObj['custom_field_'+data.id] = {
                    id:attachment.id,
                    url:attachment.url,
                    name:attachment.filename
                };
               $('#custom_field_'+data.id+'_file_upload').attr('href',attachment.url).html(attachment.name)
                _this.handleValueChange();
            });
            //Open the uploader dialog
            custom_uploader.open();
        }
    },
    computed: {
    },
    watch: {
        fieldsValue: function (newObj) {
            this.handleValueChange();
        },
        customFieldsObj: function (newObj) {
            this.customFields = newObj;
        }
    }
}
</script>

<style>
#doc_birthdate {
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  background-color: #fff;
  padding: 3px 5px;
  box-shadow: inset 0 3px 6px rgba(0,0,0,0.1);
  /* width: 190px; */
  width: 100%;
  height: 45px;
  color:#8c9cad
}
#doc_birthdate ::placeholder{
  color:#8c9cad
}
</style>