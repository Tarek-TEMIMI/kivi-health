<template>
    <div v-if="customFields.length > 0" class="row">
        <div v-for="(field, index) in customFields" class="form-group" :key="index" v-if="field.status !== undefined && field.status == '1'">
            <div class="col-md-12 m-3" >
                <label :for="field.name + '_' + index" class="form-control-label mb-2">
                    {{ field.label }} <span class="text-danger" v-if="parseInt(field.isRequired) === 1">*</span>
                </label>
               
                    <input
                        v-if="field.type === 'text' || field.type === 'number'"
                        :id="field.name + '_' + index"
                        v-model="fieldsObj['custom_field_'+field.id]"
                        :placeholder="field.placeholder"
                        :required="field.isRequired"
                        :name="'custom_field_'+field.id"
                        @change="handleValueChange"
                        :type="field.type"
                        class="form-control"
                    />
                    <div v-if="field.type === 'file_upload'">
                      <input
                        :id="field.name + '_' + index"
                          :placeholder="field.placeholder"
                          :required="field.isRequired"
                          :name="'custom_field_'+field.id"
                          type="file"
                          class="form-control"
                          v-on:change="uploadFile($event,field)"
                          :accept="fileTypeList(field)"
                      />
                      <a class="text-primary m-1 d-none" :id="'custom_field_'+field.id+'_file_upload'" :href="'#'" target="_blank">
                      </a>
                    </div>
                    <b-select
                        v-if="field.type === 'select'"
                        :id="field.name + '_' + index"
                        v-model="fieldsObj['custom_field_'+field.id]"
                        class="form-control text-capitalize"
                        :name="field.name"
                        @change="handleValueChange"
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
                                :name="field.name"
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
                                :name="field.name"
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
                        class="form-control"
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
            type: [String],
            default() {
                return ""
            }
        },
        doctor_id: {
          type: [String,Number],
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
             this.$emit('loader',true);
            if (this.module_type !== "") {
                get('get_custom_fields', {
                    module_type: this.module_type,
                    module_id: this.module_id,
                    doctor_id: this.doctor_id
                })
                    .then((response) => {
                      this.$emit('loader',false);
                        if (response.data.status !== undefined && response.data.status === true) {
                            if (response.data.data !== null && response.data.data !== undefined && response.data.data.length > 0) {
                                this.customFields = response.data.data;
                            }
                            this.handleFormObject()
                            // this.handleValueChange();
                        } else {
                            displayErrorMessage(response.data.message)
                        }

                    })
                    .catch((error) => {
                      this.$emit('loader',false);
                        console.log(error);
                        displayErrorMessage(this.formTranslation.common.internal_server_error);
                    })
            } else {
                this.customFields = this.customFieldsObj;
                this.handleFormObject()
                // this.handleValueChange();
            }
        },
        handleFormObject: function () {
            if (this.customFields.length > 0) {
                this.customFields.map((field) => {
                    if (field.type === "checkbox") {
                        this.fieldsObj['custom_field_'+field.id] = [];
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
                            if (this.fieldsObj[field.name] === []) {
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
      uploadFile(event,data){
        const file = event.target.files[0];
        // Generate the blog URL
        const blogURL = URL.createObjectURL(file);
        $('#custom_field_'+data.id+'_file_upload').removeClass('d-none').addClass('d-block').attr('href',blogURL).html(file.name)
      },
      fileTypeList(data){
        const fileType = data.file_upload_type.map((index) => {
            return index.id;
        });
        return fileType.join(', ');
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