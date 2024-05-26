<template>
  <b-row>
    <b-col sm="12" md="12" lg="12">
      <ModalPopup
        v-if="modalOpen"
        modalId="bill-modal"
        modalSize="lg"
        :openModal="modalOpen"
        :modalTitle="formTranslation.widgets.test_email"
        @closeModal="modalOpen = false"
        >
        <div class="form-group">
          <label for="email" class="form-control-label"> {{ notificationType === 'email' ? formTranslation.common.email : formTranslation.patient.contact}}</label>
          <input class="form-control" :type="notificationType === 'email' ? 'email' : 'tel' " id="email" v-model="testEmail.recieverDetails" :placeholder="notificationType === 'email' ? formTranslation.notification.plh_enter_email : formTranslation.patient.contact">
          <div v-if="testSubmitted && (!$v.testEmail.recieverDetails.required )" class="invalid-feedback"> {{ (notificationType === 'email' ? formTranslation.common.email : formTranslation.patient.contact) + ' ' + formTranslation.common.required}}. </div>
        </div>
        <div class="form-group">
          <label for="email_content" class="form-control-label"> {{formTranslation.notification.test_content}} </label>
          <textarea class="form-control" id="email_content" v-model="testEmail.content"></textarea>
          <div v-if="testSubmitted && (!$v.testEmail.content.required)" class="invalid-feedback"> {{formTranslation.notification.test_content_required}}. </div>
        </div>
        <div v-if="notificationType !== 'email'">
          <p class="text-primary">Note: Standard Twillo {{notificationType}} Charges Applicable</p>
        </div>
        <div class="d-flex justify-content-end">
            <button class="btn btn-outline-primary" @click="modalOpen=false">
              {{formTranslation.common.cancel}}
            </button>
            <button class="btn btn-primary" @click="sendTestEmail">
              Test
            </button>
          </div>
      </ModalPopup>
    </b-col>
  </b-row>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import {post} from "../../config/request";
import ModalPopup from "../../components/Modal/Index"

export default {
  name: "NotificationTestModal",
  components:{
    ModalPopup
  },
  data:() =>{
    return {
      testSubmitted: false,
      testEmail: {
        recieverDetails: '',
        content: 'Welcome to Kivicare, This is test ',
        type:''
      },
      modalOpen:false,
      notificationType:'email'
    }
  },
  validations: {
    testEmail: {
      recieverDetails: { required },
      content: { required }
    }
  },
  mounted() {
    this.testEmail.content =  'Welcome to Kivicare, This is test message'
  },
  methods:{
    sendTestEmail: function () {

      this.testSubmitted = true;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.testEmail.$invalid) {
        return;
      }

      let btn = $('.modal-footer button:nth-child(2)')

      btn.prop('disabled',true);
      btn.text(this.formTranslation.common.loading)
      this.testEmail.type = this.notificationType
      post('send_test_notification', this.testEmail)
          .then((response) => {
            this.testSubmitted = false ;
            btn.prop('disabled',false);
            btn.text('Send')
            if (response.data.status !== undefined && response.data.status === true) {
              displayMessage(response.data.message);
              this.modalOpen = false
              this.testEmail = {
                recieverDetails: '',
                content: 'Welcome to Kivicare, This is test ',
                type: ''
              };
            } else {
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            btn.prop('disabled',false);
            btn.text('Send')
            this.testSubmitted = false ;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.server_error);
          })
    },
  }
}
</script>

<style scoped>

</style>