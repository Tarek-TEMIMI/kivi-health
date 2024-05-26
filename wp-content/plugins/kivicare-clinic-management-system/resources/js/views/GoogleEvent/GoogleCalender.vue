<template>
  <div>
    <b-row v-if="userData.is_enable_doctor_gcal == 'off'">
      <b-col sm="12" >
        <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
          <template v-slot:header>
            <b-row>
              <b-col sm="12" md="8" lg="8">
                <h2> {{formTranslation.common.google_calendar}}</h2>
              </b-col>
            </b-row>
          </template>
          <div class="row">
              <b-col md="12">
                <div class="d-flex justify-content-between" style="margin: 30px 15px;">
                  <p style="font-weight: 500;">{{formTranslation.common.please_connect_google_calendar_automatically}}</p>
                  <b-button 
                    class="float-right btn btn-sm btn-primary " type="button"
                    @click ="connect"
                    variant="primary"
                    >
                    <span class="d-flex align-items-center">
                      <img alt="img" class="mr-1" :src="googleSignInImage">
                      {{formTranslation.pro_setting.connect_with_google}}
                    </span>
                  </b-button>
                </div>
              </b-col>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col md="12">
        <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
          <template v-slot:header>
            <b-row>
              <b-col sm="12" md="8" lg="8">
                <h2>{{formTranslation.common.google_calendar}}</h2>
              </b-col>
            </b-row>
          </template>
          <div class="row">
              <div class="col-md-12">
                <div class="d-flex justify-content-between" style="margin: 30px 15px;">
                  <p style="font-weight: 500;">{{formTranslation.common.connected_with_google_calender}} </p>
                  <b-button 
                    class="float-right btn btn-sm btn-primary" 
                    type="button"
                    variant="primary" 
                    @click ="closeConnection">
                    {{formTranslation.common.disconnect}}
                  </b-button>
                </div>
              </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { post } from "../../config/request";
export default {
  name: "GoogleCalender",
  components: {
  },
  data: () => {
    return {
      data: {},
      disconnect: false,
      googleSignInImage: ''
    };
  },
  mounted() {
    if(!['doctor','receptionist'].includes(this.getUserRole())) {
      this.$router.push({ name: "403"})
    }
    setTimeout(()=>{
      this.start();
    },2000)
    this.googleSignInImage= window.pluginBASEURL + 'assets/images/google.svg';
  },
  methods: {
    start() {
      const id = this.userData;
      let calendarConfig ={
        client_id: id.google_client_id,
        scope: "https://www.googleapis.com/auth/calendar",
      };
      if(id.google_app_name){
        calendarConfig.plugin_name = id.google_app_name;
      }
      gapi.load('auth2', function() {
        var auth2 = gapi.auth2.init(calendarConfig);
      });
    },
    connect(){

      let calendarConfig_new ={
        client_id: this.userData.google_client_id,
        scope: "https://www.googleapis.com/auth/calendar",
      };
      if(this.userData.google_app_name){
        calendarConfig_new.plugin_name = this.userData.google_app_name;
      }

      var auth2 = gapi.auth2.init(calendarConfig_new);

      auth2.grantOfflineAccess().then(this.signInCallback)

    },
    closeConnection(){
      let doctor_id = this.userData.ID
      post("diconnect_doctor", {doctor_id: doctor_id})
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              this.$store.dispatch("userDataModule/fetchUserData", {});
              this.disconnect =false;
              displayMessage(response.data.message);

            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          });
    },
    signInCallback(authResult) {
      if (authResult['code']) {
        let doctor_id = this.userData.ID
        let _this = this;
        $.ajax({
          url: window.request_data.ajaxurl,
          type: 'POST',
          data: {
            route_name: 'connect_doctor',
            doctor_id: doctor_id,
            _ajax_nonce: window.request_data.nonce,
            code: authResult['code'],
            action:'ajax_post'
          }, 
          success: function(data) {
            if ( data.status !== undefined && data.status === true ) {
                _this.$store.dispatch("userDataModule/fetchUserData", {});
                _this.disconnect =true;
                displayMessage(data.message);

              }
          }
        });
        // post("connect_doctor", {doctor_id: doctor_id,code:authResult['code']})
        //     .then((response) => {
        //       if (
        //           response.data.status !== undefined &&
        //           response.data.status === true
        //       ) {
        //         this.$store.dispatch("userDataModule/fetchUserData", {});
        //         this.disconnect =true;
        //         displayMessage(response.data.message);

        //       }
        //     })
        //     .catch((error) => {
        //       console.log(error);
        //       displayErrorMessage(this.formTranslation.widgets.record_not_found);
        //     });
      } else {
        console.log('error')
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