<template>
  <div class="container-fluid">
      <div class="row justify-content-center">
          <div class="form-group mt-1" style="margin-top:20px">
          <label for="patient" class="col-md-2 form-control-label">
            {{formTranslation.common.patient}} <span class="text-danger">*</span>
          </label>
          <div class="col-md-6">
            <input type="text" class="form-control" id="patient" name="patient_id">
          </div>
          </div>
          <div class="form-group mt-1" style="margin-top:20px">
              <label for="clinicDoctor" class="col-md-2 form-control-label">
                {{formTranslation.common.doctors}} <span class="text-danger">*</span>
              </label>
              <div class="col-md-6">
                  <multi-select
                      v-model="patientBookingData.doctor_id"
                      id="clinicDoctor"
                      :tag-placeholder="formTranslation.appointments.tag_plh_session_doc"
                      :placeholder="formTranslation.appointments.plh_search"
                      label="text" :options="doctorData"
                      :multiple="true" :taggable="true">
                  </multi-select>
              </div>
          </div>
          <div class="form-group mt-1" style="margin-top:20px">
            <label for="clinicDoctor" class="col-md-2 form-control-label">
            {{formTranslation.appointments.appointment_type}} <span class="text-danger">*</span>
          </label>
            <div class="col-md-6">
              <multi-select
                  v-model="patientBookingData.visit_type"
                  id="appointmentType"
                  :tag-placeholder="formTranslation.appointments.tag_plh_appointment_type"
                  :placeholder="formTranslation.appointments.plh_search"
                  label="text" :options="appointmentTypes"
                  :multiple="true" :taggable="true">
              </multi-select>
            </div>
          </div>
          <div class="form-group mt-1" style="margin-top:20px">
            <label for="clinicDoctor" class="col-md-2 form-control-label">
              {{formTranslation.appointments.appointment_date}}<span class="text-danger">*</span>
            </label>
            <div class="col-md-6">
              <flat-pickr v-model="patientBookingData.appointment_date" :config="flatPickerDateConfig"></flat-pickr>
            </div>
          </div>
          <div class="form-group mt-1" style="margin-top:20px">
            <label for="clinicDoctor" class="col-md-2 form-control-label">
              {{formTranslation.appointments.appointment_time}}<span class="text-danger">*</span>
            </label>
            <div class="col-md-6">
              <flat-pickr v-model="patientBookingData.appointment_start_time" :config="flatPickerTimeConfig"></flat-pickr>
            </div>
        </div>
          <div class="form-group mt-1" style="margin-top:20px">
            <div class="col-md-6">
              <button class="btn btn-sm btn-primary" @click="handleSubmit" >{{formTranslation.appointments.book_appointment}}</button>
            </div>
          </div>
      </div>
  </div>
</template>
<script>
import Index from "../../views/Clinic/Index";
export default {
  components: {Index},
  data: () => {
      return {
      date: null,
      patientBookingData: {},
      doctorData: [
          {
            id: 1,
            text: 'Doctor-1'
          },
          {
            id: 2,
            text: 'Doctor-2'
          },
          {
            id: 3,
            text: 'Doctor-3'
          }
      ],
      appointmentTypes: [
        {
          id: 1,
          text: 'type-1',
        },
        {
          id: 1,
          text: 'type-2',
        },
        {
          id: 1,
          text: 'type-3',
        }
      ],
      flatPickerDateConfig: {
        wrap: true,
        altFormat: 'M	j, Y',
        altInput: true,
        dateFormat: "Y-m-d",
        minDate: new Date()
      },
      flatPickerTimeConfig: {
        wrap: true,
        enableTime: true,
        enableSeconds: true,
        noCalendar: true
      }
    }
  },
  mounted() {
        this.init();
  },
  methods: {
    init: function() {
      this.patientBookingData = this.defaultPatientBookingData()
      if (this.$store.state.staticDataModule.static_data.appointment_types !== undefined && this.$store.state.staticDataModule.static_data.appointment_types.length > 0) {
        this.appointmentTypes = this.$store.state.staticDataModule.static_data.appointment_types;
      } else {
        this.$store.dispatch("staticDataModule/fetchStaticData", {
          type: "static_data_with_label",
          static_data_type: "appointment_types"
        });
        setTimeout(() => {
          this.appointmentTypes = this.$store.state.staticDataModule.static_data.appointment_types
        }, 1000);
      }
    },
    handleSubmit: function () {},
    defaultPatientBookingData: function() {
        return {
            patient_id: '',
            doctor_id: '',
            clinic_id: '',
            appointment_date: '',
            appointment_start_time: '',
            visit_type: '',
            description: '',
            status: 0,
        }
    }
  }
}
</script>
