<template>
  <div>
    <b-row v-if="userData.is_enable_doctor_gmeet == 'off'">
      <b-col sm="12" >
        <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
          <template v-slot:header>
            <b-row>
              <b-col sm="12" md="8" lg="8">
                <h2> {{formTranslation.googlemeet.googlemeet}}</h2>
              </b-col>
            </b-row>
          </template>
          <div class="row">
              <b-col md="12">
                <div class="d-flex justify-content-between" style="margin: 30px 15px;">
                  <p style="font-weight: 500;">{{formTranslation.googlemeet.please_connect_google_meet_service}}</p>
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
              <div class="col-md-12 pb-0">
                <div class="d-flex justify-content-between flex-wrap gap-3" style="margin: 30px 15px;">
                  <p style="font-weight: 500;">{{formTranslation.common.connected_with_google_meet}}</p>
                
                  <b-button class="float-right btn btn-sm btn-primary" type="button"
                            variant="primary" @click ="closeConnection">
                    {{formTranslation.common.disconnect}}
                  </b-button>
                </div>
              </div>
            <!--<b-col md="12" class="pb-0">
              <p for="video_price" class="pl-3" style="font-weight: 500;">
                {{ formTranslation.doctor.video_consultation_fees }}<span
                  class="text-danger"></span></p>
              <div class="d-flex justify-content-between" style="margin: 30px 15px;">
                <input
                    id="video_price"
                    v-model="googlemeet.video_price"
                    :placeholder="formTranslation.doctor.consultation_fees" name="video_price"
                    min="0"
                    type="number"
                    class="form-control w-50"
                    :class="{ ' is-invalid': googlemeetSubmitted && $v.googlemeet.video_price.$error }"
                >
                <div v-if="googlemeetSubmitted && !$v.googlemeet.video_price.required"
                     class="invalid-feedback">{{ formTranslation.doctor.doctor_fees_required }}
                </div>
                <b-button
                    class="btn-sm"
                    type="button"
                    variant="primary"
                    @click ="savePrice">
                  {{ googlemeetloading ? formTranslation.common.loading : formTranslation.common.save}}
                </b-button>
              </div>
            </b-col>-->
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { post } from "../../config/request";
import {required} from "vuelidate/lib/validators";
export default {
  name: "GoogleMeet",
  components: {
  },
  validations: {
    googlemeet:{
      video_price:{required}
    }
  },
  data: () => {
    return {
      data: {},
      disconnect: false,
      googleSignInImage: '',
      googlemeetloading:false,
      googlemeetSubmitted:false,
      googlemeet:{
        video_price:0,
        telemed_service_id:0,
        doctor_id:0
      }
    };
  },
  mounted() {
    if(!['doctor'].includes(this.getUserRole())) {
      this.$router.push({ name: "403"})
    }
    setTimeout(()=>{
      this.start();
    },2000)
    this.googleSignInImage= window.pluginBASEURL + 'assets/images/google.svg';
    this.googlemeet = {
      video_price: this.userData.doctor_telemed_price,
      telemed_service_id:this.userData.telemed_service_id,
      doctor_id:this.userData.ID
    };
  },
  methods: {
    start() {
      const id = this.userData;
      let calendarConfig ={
        client_id: id.googlemeet_client_id,
        scope: "https://www.googleapis.com/auth/calendar",
      };
      if(id.googlemeet_app_name){
        calendarConfig.plugin_name = id.googlemeet_app_name;
      }
      gapi.load('auth2', function() {
        var auth2 = gapi.auth2.init(calendarConfig);
      });
    },
    connect(){
      let calendarConfig_new ={
        client_id: this.userData.googlemeet_client_id,
        scope: "https://www.googleapis.com/auth/calendar",
      };
      if(this.userData.googlemeet_app_name){
        calendarConfig_new.plugin_name = this.userData.googlemeet_app_name;
      }

      var auth2 = gapi.auth2.init(calendarConfig_new);

      auth2.grantOfflineAccess().then(this.signInCallback)
    },
    closeConnection(){
      let doctor_id = this.userData.ID
      post("diconnect_meet_doctor", {doctor_id: doctor_id})
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
    savePrice(){
      this.googlemeetSubmitted = true;

      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.googlemeet.$invalid) {
        return;
      }
      this.googlemeetSubmitted = false;
      this.googlemeetloading = true;
      post('save_doctor_googlemeet_data_save', this.googlemeet)
          .then((response) => {
            this.googlemeetloading = false;
            if (response.data.status !== undefined && response.data.status === true) {
              this.$store.dispatch("userDataModule/fetchUserData", {});
              displayMessage(response.data.message);
            } else {
              displayErrorMessage(response.data.message)
            }
          })
          .catch((error) => {
            console.log(error);
            this.googlemeetloading = false;
            displayErrorMessage(this.formTranslation.common.internal_server_error)
          })
    },
    signInCallback(authResult) {
      if (authResult['code']) {
        let doctor_id = this.userData.ID
        let _this = this
        $.ajax({
          url: window.request_data.ajaxurl,
          type: 'POST',
          data: {
            route_name: 'connect_meet_doctor',
            doctor_id: doctor_id,
            _ajax_nonce: window.request_data.nonce,
            code: authResult['code'],
            action:'ajax_post'
          }, 
          success: function(data) {
            // data = JSON.parse(data);
            if (
                  data.status !== undefined &&
                  data.status === true
              ) {
                _this.$store.dispatch("userDataModule/fetchUserData", {});
                _this.disconnect =true;
                displayMessage(data.message);
              }
          }
        });
        // post("connect_meet_doctor", {doctor_id: doctor_id,code:authResult['code']})
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