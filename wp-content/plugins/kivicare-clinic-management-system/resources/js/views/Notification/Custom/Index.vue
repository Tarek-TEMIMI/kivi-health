<template>
  <b-row>
    <b-col sm="12" md="12" lg="12">
      <!-- Display overlay only when userModuleData.addOns.kiviPro is not true -->
      <b-overlay :show="!userModuleData.addOns.kiviPro" variant="white" :opacity="overlayOpacity">
        <template #overlay>
          <!-- Use a dedicated component for overlay message -->
          <overlay-message addon_type="pro"></overlay-message>
        </template>
        <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
          <template v-slot:header>
            <b-row>
              <b-col sm="12" md="12" lg="12">
                <h2 class="mb-0">{{ formTranslation.common.custom_notification }}
                  <a v-if="requestStatus == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/pro-version/custom-notification/" target="_blank">
                    <i class="fa fa-question-circle"></i>
                  </a>
                </h2>
              </b-col>
            </b-row>
          </template>
          <b-row id="api-builder">
            <b-col sm="12" md="12" lg="12">
              <b-tabs>
                <b-tab :title="formTranslation.common.form" :active="viewMode === 1" @click="viewMode=1">
                  <form @submit.prevent="executeApiRequest" class="mt-2">
                    <!-- URL and Method selection -->
                    <div class="form-group">
                      <label for="url">{{formTranslation.common.url}}<span class="text-danger">*</span></label>
                      <b-input-group>
                        <!-- Dropdown for HTTP methods -->
                        <template #prepend>
                          <select v-model="apiRequest.method" class="form-control">
                            <option value="GET">{{formTranslation.common.get}}</option>
                            <option value="POST">{{formTranslation.common.post}}</option>
                          </select>
                        </template>
                        <!-- URL input field -->
                        <input v-model="apiRequest.url" type="url" class="form-control" autocomplete="on" />
                        <!-- Validation feedback messages -->
                        <div v-if="isTestSubmitted && (!$v.apiRequest.url.required)" class="invalid-feedback">
                          {{formTranslation.common.url+' '+formTranslation.common.required}}
                        </div>
                        <div v-if="isTestSubmitted && (!$v.apiRequest.method.required)" class="invalid-feedback">
                          {{formTranslation.Method +' '+formTranslation.common.required}}
                        </div>
                      </b-input-group>
                    </div>
                    <!-- Header data input -->
                    <div class="form-group">
                      <label for="header-data">{{formTranslation.common.headers}}&nbsp;&nbsp;
                        <button type="button" v-if="!(apiRequest.headers.length)" class="btn btn-primary btn-sm" @click="addHeaderData">{{formTranslation.common.add_header}}</button>
                      </label>
                      <div v-for="(header, index) in apiRequest.headers" :key="index" class="d-flex mb-2 align-items-center">
                        <input v-model="header.key" type="text" :placeholder="formTranslation.common.enter_key" class="form-control mr-2" />
                        <input list="header-list-suggestion" v-model="header.value" type="text" :placeholder="formTranslation.common.enter_value" class="form-control mr-2" />
                        <datalist id="header-list-suggestion">
                          <option v-for="(dynamicKey, key) in dynamicKeys" :value="dynamicKey.key" :key="key">{{ dynamicKey.key }}</option>
                        </datalist>
                        <button type="button" class="btn btn-outline-danger btn-sm" @click="removeHeaderData(index)">{{formTranslation.common.remove}}</button>
                      </div>
                      <button type="button" v-if="apiRequest.headers.length" class="btn btn-primary btn-sm" @click="addHeaderData">{{formTranslation.common.add_header}}</button>
                    </div>
                    <!-- Query parameters input -->
                    <div class="form-group" v-if="apiRequest.method === 'GET'">
                      <label for="query-params">{{formTranslation.common.query_parameters}}&nbsp;&nbsp;
                        <button type="button" v-if="!queryParams" class="btn btn-primary btn-sm" @click="addQueryParam">{{formTranslation.common.add_query_parameter}}</button>
                      </label>
                      <div v-for="(param, index) in queryParams" :key="index" class="d-flex mb-2 align-items-center">
                        <input v-model="param.key" type="text" :placeholder="formTranslation.common.enter_key" class="form-control mr-2" />
                        <input v-model="param.value" list="query-list-suggestion" type="text" :placeholder="formTranslation.common.enter_value" class="form-control mr-2" />
                        <datalist id="query-list-suggestion">
                          <option v-for="(dynamicKey, key) in dynamicKeys" :value="dynamicKey.key" :key="key">{{ dynamicKey.key }}</option>
                        </datalist>
                        <button type="button" class="btn btn-outline-danger btn-sm" @click="removeQueryParam(index)">{{formTranslation.common.remove}}</button>
                      </div>
                      <button type="button" v-if="queryParams" class="btn btn-primary btn-sm" @click="addQueryParam">{{formTranslation.common.add_query_parameter}}</button>
                    </div>
                    <!-- Body input for non-GET requests -->
                    <div class="form-group" v-else>
                      <label for="body">Body</label>
                      <textarea v-model="apiRequest.body" class="form-control" rows="5"></textarea>
                    </div>
                    <!-- Action buttons -->
                    <div class="d-flex justify-content-end">
                      <button type="button" class="btn btn-outline-danger" @click="clearForm">{{formTranslation.common.clear}}</button>
                      <button type="button" v-if="isLoading" class="btn btn-primary" disabled>{{formTranslation.common.loading}}</button>
                      <button type="submit" v-else class="btn btn-outline-primary">{{ formTranslation.common.send_request }}</button>
                      <button type="button" class="btn btn-primary" @click="saveApiList(true)">{{formTranslation.common.save}}</button>
                    </div>
                  </form>
                  <ModalPopup
                    v-if="isModalOpen"
                    modalId="bill-modal"
                    modalSize="sm"
                    :openModal="isModalOpen"
                    :modalTitle="formTranslation.common.save_custom_notification"
                    @closeModal="isModalOpen = false"
                    >
                    <div class="form-group">
                      <label for="name" class="form-control-label"> {{ formTranslation.common.name }}</label>
                      <input class="form-control" type="text" id="name" v-model="modalData.name" :placeholder="formTranslation.common.enter_name">
                    </div>
                    <div class="form-group">
                      <label for="type" class="form-control-label"> {{formTranslation.common.notification_type}} </label>
                      <select class="form-control" v-model="modalData.type">
                        <option value="sms">{{ formTranslation.common.sms }}</option>
                        <option value="whatsapp">{{ formTranslation.common.whatsapp }}</option>
                      </select>
                    </div>
                    <div class="d-flex justify-content-end">
                      <button class="btn btn-outline-primary" @click="isModalOpen=false">
                        {{formTranslation.common.cancel}}
                      </button>
                      <button class="btn btn-primary" @click="saveApiList(false)" :disabled="modalLoading">
                        {{ modalLoading ? formTranslation.common.loading : formTranslation.common.save }}
                      </button>
                    </div>
                  </ModalPopup>
                </b-tab>
                <!-- Response tab -->
                <b-tab  :title="formTranslation.common.response" :active="viewMode === 2" @click="viewMode=2">
                  <div v-if="showStatusCodeAlert" class="alert" :class="responseClass">
                    {{formTranslation.common.status_code}}: {{ apiResponse ? apiResponse.status : '' }}
                  </div>
                  <div class="mt-4" style="max-height: 600px; overflow-y: auto;">
                    <pre>{{apiResponse}}</pre>
                  </div>
                </b-tab>
                <!-- Dynamic keys tab -->
                <b-tab :title="formTranslation.common.dynamic_keys" :active="viewMode === 3" @click="viewMode=3">
                  <form @submit.prevent="saveDynamicKeys">
                    <div class="form-group">
                      <div class="row mb-2">
                        <div class="col-5"><label >{{formTranslation.common.key}}</label></div>
                        <div class="col-5"><label >{{formTranslation.common.value}}</label></div>
                        <div class="col-2"><label >{{formTranslation.common.action}}</label></div>
                      </div>
                      <hr class="mt-2 mb-2 m-0">
                      <div v-for="(dynamicKey, index) in dynamicKeys" :key="index" class="row mb-2 ">
                        <div class="col-5">
                          <input v-model="dynamicKey.key" type="text" :placeholder="formTranslation.common.enter_key" class="form-control mr-2" />
                        </div>
                        <div class="col-5">
                          <input list="dynamic-key-list-suggestion" v-model="dynamicKey.value" type="text" :placeholder="formTranslation.common.enter_value" class="form-control mr-2" />
                          <datalist id="dynamic-key-list-suggestion">
                            <option v-for="(value, key) in ['[dynamic_reciever_number]', '[dynamic_sms_body]']" :key="key" :value="value">{{ value }}</option>
                          </datalist>
                        </div>
                        <div class="col-2">
                          <button type="button" class="btn btn-outline-danger btn-sm" @click="removeDynamicKey(index)">{{formTranslation.common.remove}}</button>
                        </div>
                      </div>
                      <div class="d-flex justify-content-start align-items-center">
                        <button type="button" class="btn btn-primary btn-sm" @click="addDynamicKey">{{formTranslation.common.add_dynamic_key}}</button>
                        <button type="submit" v-if="dynamicKeys.length" class="btn btn-primary btn-sm" :disabled="dynamicsKeysloading">{{ dynamicsKeysloading ? formTranslation.common.loading : 'Save dynamic keys'}}</button>
                      </div>
                    </div>
                  </form>
                </b-tab>
                <!-- save api list tab -->
                <b-tab :title="formTranslation.common.collections" :active="viewMode === 4" @click="viewMode=4">
                  <table class="w-100">
                    <thead>
                      <tr>
                        <th>{{formTranslation.common.id}}</th>
                        <th>{{formTranslation.common.name}}</th>
                        <th>{{formTranslation.doctor.type}}</th>
                        <th>{{formTranslation.common.action}}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- Loop through your data and populate the rows -->
                      <tr v-for="(collection,key) in collections" :key="collection.id">
                        <td>{{ key+1 }}</td>
                        <td>{{ collection.name ? collection.name : '-'  }}</td>
                        <td>{{ collection.type === 'sms' ? formTranslation.common.sms : formTranslation.common.whatsapp }}</td>
                        <td>
                          <div class="d-flex justify-content-start align-items-center">
                            <button class="btn btn-sm btn-outline-primary" @click="editApiData(collection,key)">{{ formTranslation.clinic_schedule.dt_lbl_edit }}</button>
                            <button class="btn btn-sm btn-outline-danger" @click="deleteApiData(key)">{{ formTranslation.clinic_schedule.dt_lbl_dlt }}</button>
                          </div>  
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </b-tab>
              </b-tabs>
            </b-col>
          </b-row>
        </b-card>
      </b-overlay>
    </b-col>
  </b-row>
</template>
<script>
import axios from 'axios';
import ModalPopup from "../../../components/Modal/Index";
import {get, post} from "../../../config/request";
import {required} from "vuelidate/lib/validators";

export default {
  components:{
    ModalPopup
  },
  data() {
    return {
      apiRequest: {
        method: 'GET',
        url: '',
        body: JSON.stringify({ apikey: '' }),
        headers: [{ key: 'Content-Type', value: 'application/json' }]
      },
      apiResponse: null,
      showStatusCodeAlert: false,
      isModalOpen: false,
      isTestSubmitted: false,
      isLoading: false,
      viewMode: 1,
      queryParams: [],
      requestStatus: 'off',
      isDynamicKeyTabActive: false,
      dynamicKeys: [
      ],
      dynamicsKeysloading:false,
      collections:[
      ],
      modalLoading:false,
      modalData:{
        name:'',
        type:'sms'
      },
      iseditIndex:''
    };
  },
  validations: {
    apiRequest: {
      method: { required },
      url: { required }
    }
  },
  mounted() {
    this.initializeModule();
    this.getDynamicKeys();
    this.getApiList();
  },

  methods: {
    async executeApiRequest() {
      try {
        this.isTestSubmitted = true;
        this.isLoading = true;
        this.$v.$touch();

        if (this.$v.apiRequest.$invalid) {
          this.isLoading = false;
          return;
        }

        this.isTestSubmitted = false;
        this.sendRequest()
        // const requestOptions = {
        //   method: this.apiRequest.method,
        //   url: this.replaceDynamicKeys(this.apiRequest.url)
        // };

        // if (this.apiRequest.headers && this.apiRequest.headers.length > 0) {
        //   requestOptions.headers = this.apiRequest.headers.map(header => ({
        //     [header.key]: this.replaceDynamicKeys(header.value)
        //   }));
        // }

        // if (this.apiRequest.method === 'POST') {
        //   requestOptions.data = this.parseJsonInput(this.apiRequest.body);
        // }

        // const response = await axios(requestOptions);
        // this.handleApiResponse(response);
      } catch (error) {
        this.handleApiResponse(error.response);
      } finally {
        this.isLoading = false;
      }
    },
    parseJsonInput(jsonInput) {
      try {
        return JSON.parse(this.replaceDynamicKeys(jsonInput) || '{}');
      } catch (error) {
        console.error('Invalid JSON input:', error);
        return {};
      }
    },
    handleApiResponse(response) {
      this.viewMode = 2;
      this.apiResponse = {
        status: response ? response.status : 'error',
        data: response ? response.body : null
      };
      this.showStatusCodeAlert = true;
    },
    parseQueryParams(url) {
      const queryParams = [];
      const queryString = url.split('?')[1];
      if (queryString) {
        const paramsArray = queryString.split('&');
        paramsArray.forEach(paramString => {
          const [key, value] = paramString.split('=');
          queryParams.push({ key, value });
        });
      }
      return queryParams;
    },
    addQueryParam() {
      this.queryParams.push({ key: '', value: '' });
    },
    removeQueryParam(index) {
      this.queryParams.splice(index, 1);
    },
    addHeaderData() {
      this.apiRequest.headers.push({ key: '', value: '' });
    },
    removeHeaderData(index) {
      this.apiRequest.headers.splice(index, 1);
    },
    addDynamicKey() {
      this.dynamicKeys.push({ key: '', value: '' });
    },
    removeDynamicKey(index) {
      this.dynamicKeys.splice(index, 1);
    },
    editApiData(data,index){
      this.apiRequest = {
        method: data.method,
        url: data.url,
        body: data.body,
        headers: data.headers
      }
      this.modalData = {
        name:data.name,
        type:data.type
      }
      this.viewMode = 1;
      this.iseditIndex = index + 1;
    },
    deleteApiData(index){
      this.collections.splice(index, 1);
      this.saveApiListCall(false);
    },
    saveDynamicKeys() {
      this.dynamicsKeysloading = true;
      post('custom_notification_save_dynamic_keys', { data : this.dynamicKeys } )
        .then((response) => {
          if (response.data.status !== undefined && response.data.status === true) {
            displayMessage(response.data.message);
          } else {
            displayErrorMessage(response.data.message);
          }
          this.dynamicsKeysloading = false;
        })
        .catch((error) => {
          this.dynamicsKeysloading = false;
          displayErrorMessage(this.formTranslation.common.server_error+'.');
        })
    },
    saveApiList(openModel=false) {
      if(this.iseditIndex){
        // Replace the existing object's value with the new one
        this.collections.splice((this.iseditIndex - 1), 1, {
          name: this.modalData.name,
          type: this.modalData.type,
          method: this.apiRequest.method,
          url: this.apiRequest.url,
          headers: this.apiRequest.headers,
          body: this.apiRequest.body
        });
        this.saveApiListCall(true);
        
      }else if(openModel){
        this.isTestSubmitted = true;
        this.$v.$touch();
        if (this.$v.apiRequest.$invalid) {
          return;
        }
        this.isTestSubmitted = false;
        this.isModalOpen=true;
      }else{
         // Check if an object with the same name exists
        const isNameAlreadyExists = this.collections.some(collection => collection.name === this.modalData.name);
        const isTypeAlreadyExists = this.collections.some(collection => collection.type === this.modalData.type);
        if(isNameAlreadyExists){
          // Handle the case where the name already exists, e.g., show an error message
          displayErrorMessage('Name already exists. Cannot add the same name.')
          return;
        }
        if(isTypeAlreadyExists){
          // Handle the case where the name already exists, e.g., show an error message
          displayErrorMessage('Notification type already exists. Cannot add the same notification type.')
          return;
        }
        this.modalLoading = true;
        // Push the new object only if the name doesn't already exist
        this.collections.push({
          name: this.modalData.name,
          type: this.modalData.type,
          method: this.apiRequest.method,
          url: this.apiRequest.url,
          headers: this.apiRequest.headers,
          body: this.apiRequest.body
        });

        this.saveApiListCall(true);
    
      }
    },
    saveApiListCall(modalSave=true){
      post('custom_notification_save_api_configuration_list', { data : this.collections } )
        .then((response) => {
          if(modalSave){
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message);
              this.isModalOpen=false;
              this.modalData={
                name:'',
                type:'sms'
              }
              this.apiRequest = {
                method: 'GET',
                url: '',
                body: JSON.stringify({ apikey: '' }),
                headers: [{ key: 'Content-Type', value: 'application/json' }]
              }
              this.iseditIndex = '';
            } else {
              displayErrorMessage(response.data.message);
            }
            this.modalLoading = false;
          }
        })
        .catch((error) => {
          if(modalSave){
            this.modalLoading = false;
            displayErrorMessage(this.formTranslation.common.server_error+'.');
          }
          
        })
    },
    getApiList(){
      get('custom_notification_get_api_configuration_list', {})
        .then((response) => {
          if (response.data.status !== undefined && response.data.status === true) {
            this.collections = response.data.data
          }
        })
        .catch((error) => {
          console.log(error);
        })
    },
    getDynamicKeys(){
      get('custom_notification_get_dynamic_keys', {})
        .then((response) => {
          if (response.data.status !== undefined && response.data.status === true) {
            this.dynamicKeys = response.data.data
          }
        })
        .catch((error) => {
          console.log(error);
        })
    },
    replaceDynamicKeys(data) {
      this.dynamicKeys.forEach(keyValuePair => {
        data = data.replace(keyValuePair.key, keyValuePair.value);
      });
      return data;
    },
    initializeModule() {
      const { link_show_hide } = window.request_data;
      if (link_show_hide !== undefined && link_show_hide !== '') {
        this.requestStatus = link_show_hide;
      }
    },
    clearForm(){
      this.apiRequest = {
        method: 'GET',
        url: '',
        body: JSON.stringify({ apikey: '' }),
        headers: [{ key: 'Content-Type', value: 'application/json' }]
      }
      this.openModal = {
        name:'',
        type:'sms'
      }
      this.queryParams = [];
      this.iseditIndex = '';
    },
    sendRequest(){
      post('send_custom_notification_request', this.apiRequest)
        .then((response) => {
          if (response.data.status !== undefined && response.data.status === 'success') {
            this.handleApiResponse(response);
          }
        })
        .catch((error) => {
          console.log(error);
        })
    },
  },
  computed: {
    responseClass() {
      if (this.apiResponse) {
        return this.apiResponse.status >= 200 && this.apiResponse.status < 300
          ? 'alert-success'
          : 'alert-danger';
      }
      return '';
    },
    userModuleData() {
      return this.$store.state.userDataModule.user;
    }
  },
  watch: {
    'apiRequest.url'(newUrl) {
      this.queryParams = this.parseQueryParams(newUrl);
    },
    queryParams: {
      deep: true,
      handler(newQueryParams) {
        if (this.apiRequest.method === 'GET') {
          const queryParamsString = newQueryParams
            .filter(param => param.key.trim() !== '' || param.value.trim() !== '')
            .map(param => `${param.key}=${param.value}`)
            .join('&');
          this.apiRequest.url =
            this.apiRequest.url.split('?')[0] + (queryParamsString ? `?${queryParamsString}` : '');
        }
      }
    }
  }
};
</script>

<style>
#api-builder .nav.nav-tabs{
    margin-bottom: 1rem;
}
#api-builder .nav-tabs .nav-link.active{
    color: var(--primary);
    /* border-top-color: var(--primary);
    border-left-color: var(--primary);
    border-right-color: var(--primary); */
}
#api-builder  .nav-tabs .nav-link{
    font-size: 1rem;
    font-weight: 400;
    background-color:#fff;
    border-bottom-color: #dee2e6;
}
</style>
  