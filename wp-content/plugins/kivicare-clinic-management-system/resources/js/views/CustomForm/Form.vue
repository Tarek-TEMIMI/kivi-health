<template>
    <div>
        <component 
           :is="useModal ? 'b-modal' : 'div'" 
            no-close-on-esc no-close-on-backdrop
            id="custom-form-modal"
            centered
            size="xl"
            body-class="pt-0"
            v-model="customFormModal"
            v-if="customFormModal"
            :hide-footer="true">
            <template class="p-1" v-slot:modal-header="{ close }">
                <span v-html="formTitle" style="width: 100%;"></span>
                <button type="button" aria-label="Close" class="close" @click="closeModal">×</button>
            </template>
            <div class="page-loader-section" v-show="overlay">
              <loader-component-2></loader-component-2>
            </div>
            <form id="customFormDataForm" @submit.prevent="handleSubmit" :novalidate="true" v-show="!overlay">
              <span v-html="formTitle" style="width: 100%;" v-if="!useModal"></span>
                <div class="row">
                    <div :class="(['hr','heading'].includes(field.type.id) ? 'col-md-12 ' : 'col-md-6 ' )" v-for="(field, index) in data.fields" :key="index" >
                      <div class="form-group">
                        <label :for="field.name" v-if="!['heading','hr'].includes(field.type.id)">
                            {{ field.label }}<span class="text-danger">{{ field.is_required && ['1','true'].includes(field.is_required.toString())  ? '*' : '' }}</span>
                        </label>
                        <input
                            v-if="field.type.id === 'text' || field.type.id === 'number'"
                            :id="field.name"
                            v-model="formData[field.name]"
                            :placeholder="field.placeholder"
                            :type="field.type.id"
                            class="form-control"
                            :class="field.class"
                            :disabled="viewMode"
                        />
                        <div v-else-if="field.type.id === 'heading'">
                          <component  :is="field.tag ? field.tag : 'h2'" :class="field.class">{{field.label}}</component> 
                        </div>
                        <div v-else-if="field.type.id === 'hr'">
                          <hr :class="field.class">
                        </div>
                        <div v-else-if="field.type.id === 'file_upload'">
                          <div class="input-group kivi-choose-file flex-nowrap">
                            <div class="input-group-prepend flex-shrink-0">
                              <button class="btn btn-primary px-2" :disabled="viewMode" :class="field.class"  type="button" :id="field.name" @click.prevent="fileUpload(field)">{{ formTranslation.common.choose_file }}</button>
                            </div>
                            <label class="input-group-text" :for="field.name">
                            <a class="text-primary m-1" :id="'custom_field_'+field.name+'_file_upload'" :href="formData[field.name] && formData[field.name].url ?  formData[field.name].url : '' " target="_blank">
                              {{formData[field.name] && formData[field.name].name ?  formData[field.name].name : formTranslation.common.no_file_chosen}}
                            </a>
                            </label>
                          </div>
                        </div>
                        <b-select
                            v-else-if="field.type.id === 'select'"
                            class="form-control text-capitalize"
                            :class="field.class"
                            :id="field.name"
                            v-model="formData[field.name]"
                            :disabled="viewMode"
                        >
                          <option value=""> {{formTranslation.common.select_option}} </option>
                          <option v-for="(option, index) in field.options" :value="option.id" :key="index" >{{ option.text }}</option>
                        </b-select>
                        <div v-else-if="field.type.id === 'radio'">
                          <div v-for="(option, key) in field.options" class="custom-control custom-radio custom-control-inline" :key="key">
                            <input
                                type="radio"
                                :id="field.name+ '_' +key"
                                v-model="formData[field.name]"
                                class="custom-control-input"
                                :class="field.class"
                                :disabled="viewMode"
                                :name="field.name"
                                :value="option.text.replace(' ','-')"
                            >
                            <label class="custom-control-label" :for="field.name + '_' +key">{{ option.text }}</label>
                          </div>
                        </div>
                        <div v-else-if="field.type.id === 'checkbox'">
                            <b-form-checkbox-group
                                :id="field.name"
                                v-model="formData[field.name]"
                                :disabled="viewMode"
                                :class="field.class"
                            >
                            <b-form-checkbox :value="option.id" v-for="(option,key) in field.options" :key="key">{{option.text}}</b-form-checkbox>
                        </b-form-checkbox-group>
                        </div>
                        <div v-else-if="field.type.id === 'calendar'">
                          <input type="date"
                                :class="field.class"
                                :id="'doc_birthdate'"
                                v-model="formData[field.name]"
                                :disabled="viewMode"
                          >
                        </div>
                        <textarea
                            v-else-if="field.type.id === 'textarea'"
                            :id="field.name"
                            :placeholder="field.placeholder"
                            class="form-control"
                            :class="field.class"
                            v-model="formData[field.name]"
                            :disabled="viewMode"
                        ></textarea>
                        <multi-select
                          v-else-if="field.type.id === 'multi_select'"
                          :id="field.name + '_' + index"
                          :placeholder="field.placeholder"
                          :name="'custom_field_'+field.id"
                          :class="field.class"
                          label="text"
                          track-by="id"
                          :options="field.options"
                          :multiple="true"
                          v-model="formData[field.name]"
                          :disabled="viewMode"
                      ></multi-select>
                        <div  class="invalid-feedback-new d-none" :id="field.name+'_invalid-feedback'" 
                        v-if="field.is_required && ['1','true'].includes(field.is_required.toString()) && !['hr','heading'].includes(field.type.id)"> {{ field.label + ' ' + formTranslation.common.required}}</div>
                      </div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12 d-flex justify-content-end align-items-center">
                      <div v-if="!viewMode" class="mr-2">
                        <button v-if="!formLoading" class="btn btn-primary rtl-ml-2" type="submit">
                          <i class="fa fa-save"></i> {{ formTranslation.common.save }}
                        </button>
                        <button v-else class="btn btn-primary" type="submit" disabled>
                          <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                        </button>
                      </div>
                      <button type="button" class="btn btn-outline-danger" @click="closeModal"> {{formTranslation.common.cancel}}</button>
                    </div>
                </div>
            </form>
        </component >
    </div>
  </template>
  
  <script>
  
  import {post, get} from "../../config/request";
  
  export default {
    name: "CustomForm",
    props: {
        customFormModal:{
        type:[Boolean],
        default(){
          return false;
        }
      },
      useModal:{
        type:[Boolean],
        default(){
          return true;
        }
      },
      data: {
        type: [Object, Array],
        default() {
          return [
            
          ]
        }
      },
      viewMode:{
        type:[Boolean],
        default(){
          return false;
        }
      },
      fields:{
        type:[Object,Array],
        default(){
          return [];
        }
      }
    },
    data: () => {
      return {
        formLoading:false,
        overlay:true,
        formData:{

        },
        requiredFields:[]
      }
    },
    mounted() {
      console.log(this.fields)
      if(!this.fields || !this.fields.length){
        this.init();
      }else{
        this.data.fields = this.fields
        this.overlay = false;
      }
    },
    methods: {
      init: function () {
        this.data.fields.map((index) => {
            if(index.is_required && ['1','true'].includes(index.is_required.toString())){
                this.requiredFields.push(index.name)
            }
        })
        console.log(this.requiredFields)
        this.overlay = true;
        get('custom_form_data_get', {form_id: this.data.id, module_id: this.data.module_id})
            .then((response) => {
              if (response.data.status && response.data.status === true ) {
                this.formData = response.data.data
              }
              this.overlay = false;
            })
            .catch((error) => {
                this.overlay = false;
                console.log(error);
            })
      },
      closeModal(){
        this.$emit('closeModal')
      },
      handleSubmit(){
        this.submit = true;
        let validationFalse = false;
        let firstScroll = true;
        if(this.requiredFields.length){
            this.requiredFields.map((index,key) =>  {
                if(!this.formData[index]){
                    validationFalse = true;
                    $('#'+index+'_invalid-feedback').removeClass('d-none');
                    if(firstScroll){
                        document.querySelector('#'+index+'_invalid-feedback').scrollIntoView({block: "center", behavior: "smooth"})
                    }else{
                        firstScroll = false;
                    }
                }else{
                    $('#'+index+'_invalid-feedback').addClass('d-none');
                }
            })
        }
        if(validationFalse){
            displayErrorMessage(this.formTranslation.common.please_fill_all_required_fields);
            return;
        }
        this.formLoading = true;
        post('custom_form_data_save', {form_id: this.data.id, module_id: this.data.module_id,form_data:this.formData})
            .then((response) => {
              if (response.data.status && response.data.status === true ) {
                displayMessage(response.data.message)
                this.closeModal();
              } else {
                displayErrorMessage(response.data.message)
              }
              this.formLoading = false;
            })
            .catch((error) => {
                this.formLoading = false;
                console.log(error);
            })

      },
      fileUpload(data){
            let mediaType = data.file_upload_type.map((index) => {
                return index.id;
            })
            let custom_uploader = kivicareCustomImageUploader(this.formTranslation,'custom_field',false,{
                mediaType:mediaType
            })
            custom_uploader.on('select', () => {
                let attachment = custom_uploader.state().get('selection').first().toJSON();
                $('#custom_field_'+data.name+'_file_upload').attr('href',attachment.url).html(attachment.name)
                  // Use $set to update this.formData[data.name]
                this.$set(this.formData, data.name, {
                    id: attachment.id,
                    url: attachment.url,
                    name: attachment.filename
                });
            })
            //Open the uploader dialog
            custom_uploader.open();
        }
    },
    computed:{
        formTitle(){
            if(this.data.name && this.data.name.text){
                return `<h2 class="${this.data.name.color} ${this.data.name.align}">${this.data.name.text}</h2>`
            }
            return '';
        }
    }
  }
  </script>
  
  <style scoped>
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
#customFormDataForm .invalid-feedback-new{
    width: 100%;
    margin-top: 0.25rem;
    font-size: 100%;
    color: #f6993f;
}
  </style>