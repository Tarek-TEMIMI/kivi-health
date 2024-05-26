<template>
  <div>
    <ModalPopup
        v-if="appointmentDetailsModel"
        modalId="appointment-details-modal"
        modalSize="lg"
        :openModal="appointmentDetailsModel"
        :modalTitle="formTranslation.appointments.appointment_details"
        @closeModal="closeModal"
        >
      <div class="row border-bottom p-2">
      <div class="col-md-6">
        <p class="mb-0 d-flex">
          <span class="font-weight-bold">
            {{ formTranslation.common.date }} :&nbsp;
          </span>
          <span>
            {{ appointmentDetails.appointment_start_date }}
          </span>
        </p>
      </div>
      <div class="col-md-6">
        <p class="mb-0 d-flex">
          <span class="font-weight-bold">
            {{ formTranslation.common.time }} :&nbsp;
          </span>
          <span>
            {{ appointmentDetails.appointment_start_time }}
          </span>
        </p>
      </div>
    </div>
    <div class="row border-bottom p-2">
      <div class="col-md-6">
        <p class="mb-0 d-flex">
          <span class="font-weight-bold">
            {{ formTranslation.common.doctor }} :&nbsp;
          </span>
          <span>
            {{ appointmentDetails.doctor_id.label }}
          </span>
        </p>
      </div>
      <div class="col-md-6">
        <p class="mb-0 d-flex">
          <span class="font-weight-bold">
            {{ formTranslation.common.patient }} :&nbsp;
          </span>
          <span>
            {{ appointmentDetails.patient_id.label }}
          </span>
        </p>
      </div>
    </div>
    <div class="row border-bottom p-2">
      <div class="col-md-6">
        <p class="mb-0 d-flex">
          <span class="font-weight-bold">
            {{ formTranslation.common.clinic }} :&nbsp;
          </span>
          <span>
            {{ appointmentDetails.clinic_id.label }}
          </span>
        </p>
      </div>
      <div class="col-md-6">
        <p class="mb-0 d-flex">
          <span class="font-weight-bold">
            {{ formTranslation.common.patient + ' ' +formTranslation.common.contact }} :&nbsp;
          </span>
          <span>
            {{ appointmentDetails.patient_contact_no }}
          </span>
        </p>
      </div>
    </div>
    <div class="row border-bottom p-2">
      <div class="col-md-6">
        <p class="mb-0">
          <span class="font-weight-bold">
            {{ appointmentDetails.service_array.length === 1 ? formTranslation.common.service : formTranslation.common.services }} :&nbsp;
          </span>
          <span>
            {{ appointmentDetails.all_services }}
          </span>
        </p>
      </div>
      <div class="col-md-6">
        <p class="mb-0 d-flex">
          <span class="font-weight-bold">
            {{formTranslation.service.charges}} :&nbsp;
          </span>
          <span>
            {{ appointmentDetails.clinic_prefix !== undefined ? appointmentDetails.clinic_prefix : ''}}{{ appointmentDetails.all_service_charges !== '' ? appointmentDetails.all_service_charges : '0' }}{{ appointmentDetails.clinic_postfix !== undefined ? appointmentDetails.clinic_postfix : '' }}
          </span>
        </p>
      </div>
    </div>
    <div class="row border-bottom p-2">
      <div class="col-md-6">
        <p class="mb-0 font-weight-bold d-flex">
          <span class="font-weight-bold">
            {{ formTranslation.common.status }} :&nbsp;
          </span>
          <span class="text-primary" v-if="appointmentDetails.status == '1'"> {{formTranslation.appointments.booked }}</span>
          <span class="text-primary" v-if="appointmentDetails.status == '4'"> {{formTranslation.appointments.check_in }}</span>
          <span class="text-danger" v-if="appointmentDetails.status  == '0'"> {{ formTranslation.appointments.cancelled }}</span>
          <span class="text-warning" v-if="appointmentDetails.status  == '2'"> {{ formTranslation.appointments.pending }}</span>
          <span class="text-success" v-if="appointmentDetails.status == '3'"> {{ formTranslation.appointments.check_out }}</span>
        </p>
      </div>
      <div class="col-md-6">
        <p class="mb-0 d-flex">
          <span class="font-weight-bold">
            {{ formTranslation.settings.payment + ' ' +formTranslation.paypal.mode }} :&nbsp;
          </span>
          <span>
            {{ appointmentDetails.payment_mode }}
          </span>
        </p>
      </div>
    </div>
    <div class="row border-bottom p-2"  v-if="appointmentDetails.description !== null && appointmentDetails.description !== undefined && appointmentDetails.description !== ''">
      <div class="col-md-12">
        <p class="mb-0 d-flex">
          <span class="font-weight-bold">
            {{ formTranslation.appointments.description }}:&nbsp;
          </span>
          <span>
            {{ appointmentDetails.description }}
          </span>
        </p>
      </div>
    </div>
    <div class="row border-bottom p-2" v-if="appointmentDetails.appointment_report !== undefined && appointmentDetails.appointment_report !== null  && appointmentDetails.appointment_report !== '' && appointmentDetails.appointment_report.length > 0">
      <div class="col-md-12">
        <div>
          <p class="mb-0 text-center d-flex">
          <span class="font-weight-bold">
             {{formTranslation.patient.medical_report}}
          </span>
          </p>
          <div class="row mb-2">
            <div class="col-6" v-for="(medRep ,medRepKey) in appointmentDetails.appointment_report" :key="medRepKey">
              <a variant="outline-primary" v-b-tooltip.hover :title="formTranslation.appointments.view_report" :href="medRep.url" target="_blank">
                <i class="fas fa-external-link-alt"></i>  {{medRep.name}}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row p-2" v-if="appointmentDetails.custom_fields !== undefined && appointmentDetails.custom_fields !== null  && appointmentDetails.custom_fields !== '' && appointmentDetails.custom_fields.length > 0">
      <div class="col-md-12">
        <div>
          <p class="mb-0 text-center d-flex">
          <span class="font-weight-bold">
             {{formTranslation.doctor.extra_detail}}
          </span>
          </p>
          <div class="row">
            <div class="col-6" v-for="(index,key) in appointmentDetails.custom_fields" :key="key">
              <p class="mb-0 font-weight-bold d-flex">
                <span class="font-weight-bold">
                  {{ index.label }} :&nbsp;
                </span>
                {{ index.field_data ? (Array.isArray(index.field_data) ? index.field_data.join(', ') : index.field_data) : ' ' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ModalPopup>
  </div>
</template>

<script>
import ModalPopup from '../Modal/Index'
export default {
  name: "AppointmentViewCard",
  components:{ModalPopup},
  props:{
    appointmentDetailsModel:{
      type:[Boolean],
      default(){
        return false
      }
    },
    appointmentDetails:{
      type:[Object,Array],
      default(){
        return {}
      }
    }
  },
  data: () => {
    return {
    }
  },
  mounted() {
    this.init();
  },
  methods:{
    init(){

      console.log(this.appointmentDetails.appointment_report);

    },
    closeModal(){
      this.$emit('closeModal')
    }
  },
}
</script>

<style scoped>

</style>