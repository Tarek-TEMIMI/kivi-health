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
                <b-col sm="8" md="8" lg="8">
                  <h2 class="mb-0">{{ formTranslation.common.dashboard_sidebar_setting}} <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#dashboard-sidebar" target="_blank"><i class="fa fa-question-circle"></i></a> </h2>
                </b-col>
              </b-row>
            </template>
            <div class="page-loader-section" v-if="isLoading">
              <loader-component-2></loader-component-2>
            </div>
            <b-row v-else>
              <b-col sm="12" md="12" lg="12">
                <div class="accordion" role="tablist">
                  <b-card no-body class="mb-1" v-for="(head, headIndex) in allUserList" :key="headIndex">
                    <b-card-header header-tag="header" class="p-1" role="tab" >
                      <div class="d-flex align-items-center p-2 setting-accorditon">
                        <b-button type="button"  block variant="link shadow-none text-left" @click="mainAccordian(head.id)">
                          {{ head.label }}
                        </b-button>
                      </div>
                    </b-card-header>
                    <b-collapse :id="'head_accrodian_'+head.id" :visible="selectedMainAccrodionId === head.id" accordion="my-accordion1" role="tabpanel">
                      <table class="table table-striped">
                        <thead class="thead-dark">
                        <tr>
                          <th scope="col" style="width:5%;"></th>
                          <th scope="col">{{formTranslation.common.label}}</th>
                          <th scope="col" >{{formTranslation.common.url}} </th>
                          <th scope="col">
                            {{formTranslation.common.icon}}
                            <a v-if="request_status == 'off'" href="https://fontawesome.com/v5/search" target="_blank"><i class="fa fa-question-circle"></i></a>
                          </th>
                          <th scope="col">{{formTranslation.doctor.dt_lbl_actions}} </th>
                        </tr>
                        </thead>
                        <draggable v-model="dashboardSidebarData[head.id]" tag="tbody" :options="{ animation:1000, handle:'.my_handle:not(.exclude-this-item)'}">
                          <tr v-for="(itemValue,itemkey) in dashboardSidebarData[head.id]" :key="itemkey" class="draggable my_handle " style="float:unset">
                            <td style="width:5%;"><i class="my_handle fa fa-align-justify"></i></td>
                            <td>
                              <input type="text" class="form-control-sm form-control " v-model="itemValue.label" :disabled="!itemValue.custom">
                              <div class="d-none">
                                <div :id="'labelValid'+head.id+itemkey" class="invalid-feedback">{{formTranslation.clinic_schedule.module_type_required}}
                                </div>
                              </div>
                            </td>
                            <td>
                              <input v-if="itemValue.type === 'href'" type="url" v-model="itemValue.link" class="form-control-sm form-control ">
                              <input v-else type="url" :value="routeUrl(itemValue.link)" class="form-control-sm form-control " disabled>
                              <div class="d-none">
                                <div :id="'urlValid'+head.id+itemkey" class="invalid-feedback">{{formTranslation.clinic_schedule.module_type_required}}
                                </div>
                              </div>
                            </td>
                            <td>
                              <input type="text" class="form-control form-control-sm" v-model="itemValue.iconClass">
                            </td>
                            <td>
                              <button class="btn btn-danger btn-sm" v-if="itemValue.custom" @click.prevent="deleteDashboardSidebarData(head.id,itemkey)">
                                <i class="fa fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        </draggable>
                      </table>
                      <div class="row m-2">
                        <div class="col-12 d-flex justify-content-end align-items-center">
                          <button  class="btn btn-primary "  type="button" @click="addNewDashboardSidebarData(head.id)">
                            <i class="fa fa-plus mr-1"></i> {{'Add New'}}
                          </button>
                          <button  class="btn btn-primary " :id="'sidebarButton'+head.id" type="button" @click="saveDashboardSidebarData(head.id)">
                            <i class="fa fa-save mr-1"></i> {{formTranslation.common.save}}
                          </button>
                        </div>
                      </div>
                    </b-collapse>
                  </b-card>
                </div>
              </b-col>
            </b-row>
          </b-card>
        </form>
      </b-overlay>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {get,post} from "../../config/request";
import draggable from 'vuedraggable';

export default {
  name: "DashboardSidebarSetting",
  components:{
    draggable
  },
  data:() => {
    return {
      isLoading:false,
      request_status: window.request_data.link_show_hide ? window.request_data.link_show_hide : 'off',
      allUserList:[],
      selectedMainAccrodionId:'administrator',
      dashboardSidebarData:[]
    }
  },
  mounted() {
    if(!['administrator'].includes(this.getUserRole())) {
      this.$router.push({ name: "403"})
    }
    this.allUserList = [
      {id:'administrator',label:'Administrator'},
      {id:'clinic_admin',label:this.formTranslation.clinic.clinic},
      {id:'receptionist',label:this.formTranslation.clinic.receptionist},
      {id:'doctor',label:this.formTranslation.common.doctors},
      {id:'patient',label:this.formTranslation.dashboard.patients},
    ];
    this.getSidebarData();
  },
  methods:{
    mainAccordian(value){
      this.selectedMainAccrodionId = this.selectedMainAccrodionId === value ? '' : value;
    },
    getSidebarData(){
      this.isLoading = true;
      get('get_dashbaord_sidebar_data', {})
          .then((response) => {
            this.isLoading = false;
            if (response.data.status !== undefined && response.data.status === true) {
              this.dashboardSidebarData = response.data.data;
            }
          })
          .catch((error) => {
            this.isLoading = false;
            console.log(error);
          })
    },
    saveDashboardSidebarData(type){
      let sidebar_data_valid = true;
      $('.invalid-feedback').parent().addClass('d-none')
      this.dashboardSidebarData[type].forEach((index, key)=> {
        if(!(index.label) || !(index.link)){
          $('#urlValid'+type+key).parent().removeClass('d-none')
          $('#labelValid'+type+key).parent().removeClass('d-none')          
          sidebar_data_valid  = false
        }
      })
      
      if(!(sidebar_data_valid)){
        // displayErrorMessage('LABEL and URL is required')
        return
      }
      let but = $('#sidebarButton' + type);
      but.prop('disabled', true);
      but.html(`<i class='fa fa-sync fa-spin mr-1'></i>`+this.formTranslation.common.loading);
      post('save_dashbaord_sidebar_data', {data:this.dashboardSidebarData[type],type:type})
          .then((response) => {
            but.prop('disabled', false);
            but.html(`<i class='fa fa-save'></i>`+this.formTranslation.common.save);
            if (response.data.status !== undefined && response.data.status === true) {
              this.$store.dispatch("userDataModule/fetchUserData", {});
              displayMessage(response.data.message)
            }else{
              displayErrorMessage(response.data.message)
            }
          })
          .catch((error) => {
            but.prop('disabled', false);
            but.html(`<i class='fa fa-save'></i>`+this.formTranslation.common.save);
            console.log(error);
          })
    },
    addNewDashboardSidebarData(type){
      this.dashboardSidebarData[type].push({
        label :'',
        type: 'href',
        link : '',
        iconClass :'',
        routeClass : '',
        show:true,
        custom:true
      })
    },
    deleteDashboardSidebarData(type,index){
      this.dashboardSidebarData[type].splice(index, 1);
    },
    routeUrl(name){
      let props = this.$router.resolve({
        name: name
      });
      return props.href ? window.request_data.menu_url + props.href : '#'
    }
  },
  computed: {
    userData() {
      return this.$store.state.userDataModule.user;
    }
  }
}
</script>

<style scoped>

</style>