<template>
  <div class="row" v-if="userData.addOns.kiviPro && exportData.length > 0">
    <download-csv :data="exportData" :name="fileExportName + '.csv'" >
      <button v-b-tooltip.hover :title="formTranslation.patient.exports_CSV" class="btn  btn-sm"><i class="fas fa-file-csv"></i>
      </button>
    </download-csv>
    <vue-excel-xlsx
        :data="exportData"
        :columns="exportData.length > 0 ? Object.keys(exportData[0]).map(elem => ({label: elem, field: elem})) : []"
        :sheet-name="module_type"
        :file-type="'xlsx'"
        :file-name="fileExportName" v-if="userData.addOns.kiviPro == true" class="btn btn-sm mr-0" v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_export_excel">
      <i class="fa fa-file-excel"></i>
    </vue-excel-xlsx>
    <button  v-b-tooltip.hover :title="formTranslation.common.export_pdf" class="btn  btn-sm"   @click="printPdfFromArray(exportData,module_name)">
      <i class="fa fa-file-pdf"></i>
    </button>
  </div>
</template>
<script>
export default {
  name: "ModuleDataExport",
  props:{
    module_name:{
      type:[String],
      default(){
        return ''
      }
    },
    module_type:{
      type:[String],
      default(){
        return ''
      }
    },
    module_data:{
      type:[Array,Object],
      default(){
        return []
      }
    },
    tableData:{
      type:[Boolean],
      default(){
        return true
      }
    }
  },
  data:() => {
    return {
      exportData: [],
    }
  },
  mounted() {
    this.formatData(this.module_data)
  },
  methods:{
    formatPatientData(elem,tempValue,acc){
      let _this = this;
      switch (elem){
        case 'u_id':
        case 'ID':
          acc[ _this.patientUniqueIdEnable ? _this.formTranslation.patient.unique_id : _this.formTranslation.common.id] = tempValue;
          break;
        case 'display_name':
          acc[_this.formTranslation.patient.dt_lbl_name] = tempValue
          break;
        case 'profile_image':
          acc[_this.formTranslation.clinic.profile_img] = tempValue;
          break;
        case 'clinic_name':
          acc[_this.formTranslation.patient.clinic] = tempValue;
          break;
        case 'user_email':
          acc[_this.formTranslation.patient.dt_lbl_email] = tempValue;
          break;
        case 'mobile_number':
          acc[_this.formTranslation.patient.dt_lbl_mobile_number] = tempValue;
          break;
        case 'gender':
          acc[_this.formTranslation.common.gender] = tempValue;
          break;
        case 'dob':
          acc[_this.formTranslation.common.dob] = tempValue;
          break;
        case 'full_address':
          acc[_this.formTranslation.common.address] = tempValue;
          break;
        case 'blood_group':
          acc[_this.formTranslation.clinic.blood_group] = tempValue;
          break;
        case 'user_registered':
          acc[_this.formTranslation.patient.dt_lbl_registered] = tempValue === '-' ? tempValue : tempValue;
          break;
        case 'user_status':
          acc[_this.formTranslation.common.status] = tempValue === '0' ? _this.formTranslation.common.active : _this.formTranslation.common.inactive;
          break;
        case 'default':
          break;
      }
      return acc;
    },
    formatStaticData(elem,tempValue,acc){
      let _this = this;
      switch (elem){
        case 'id':
        case 'type':
          acc[elem] = tempValue
          break;
        case 'label':
          acc['name'] = tempValue;
          break;
        case 'status':
          acc[elem] = tempValue === '1' ? _this.formTranslation.common.active : _this.formTranslation.common.inactive;
          break;
        case 'default':
          break;
      }
      return acc;
    },
    formatCustomFieldData(elem,tempValue,acc){
      let _this = this;
      switch (elem){
        case 'id':
        case 'module_type':
          acc[elem] = tempValue
          break;
        case 'fields':
          let temp = JSON.parse(tempValue)
          acc['label'] = temp.label
          acc['placeholder'] = temp.placeholder  ? temp.placeholder : ''
          acc['options'] = temp.options !== undefined && Array.isArray(temp.options) ? temp.options.map(ele =>{ return ele.text}).join(',') : ''
          acc['type'] = temp.type
          acc['required']  = temp.isRequired
          break;
        case 'status':
          acc[elem] = tempValue === '1' ? _this.formTranslation.common.active : _this.formTranslation.common.inactive;
          break;
        case 'default':
          break;
      }
      return acc;
    },
    formatClinicDoctorHolidayData(elem,tempValue,acc){
      let _this = this;
      switch (elem){
        case 'id':
        case 'module_type':
        case 'doctor_name':
        case 'clinic_name':
          acc[elem] = tempValue
          break;
        case 'start_date':
        case 'end_date':
          acc[elem] = tempValue
          break;
        case 'status':
          acc[elem] = tempValue === '1' ? _this.formTranslation.common.active : _this.formTranslation.common.inactive;
          break;
        case 'default':
          break;
      }
      return acc;
    },
    formatBillingsData(elem,tempValue,acc){
      let _this = this;
      switch (elem){
        case 'bill_id':
          acc['id'] = tempValue
          break;
        case 'id':
          acc['encounter_id'] = tempValue
          break;
        case 'total_amount':
        case 'discount':
        case 'actual_amount':
        case 'clinic_id':
        case 'doctor_id':
        case 'patient_id':
        case 'appointment_id':
        case 'doctor_name':
        case 'patient_name':
        case 'clinic_name':
        case 'service_name':
          acc[elem] = tempValue
          break;
        case 'encounter_date':
          acc[elem] = tempValue
          break;
        case 'status':
          acc[elem] = tempValue === '1' ? _this.formTranslation.patient_bill.unpaid : _this.formTranslation.patient_bill.paid;
          break;
        case 'default':
          break;
      }
      return acc;
    },
    formatSessionData(elem,tempValue,acc,val){
      let _this = this;

      switch (elem){
        case 'id':
        case 'time_slot':
          acc[elem] = tempValue
          break;
        case 'days':
          acc[elem] = tempValue !== undefined && Array.isArray(tempValue) ? tempValue.join(',') : ''
          break;
        case 's_one_start_time':
          let temp = '';
          if(val.s_one_start_time.HH !== '' && val.s_one_end_time.MM !== '' && val.s_one_start_time.MM !== '' && val.s_one_end_time.HH !== ''){
            temp = this.timeObjectToString(val.s_one_start_time) + ' to ' + this.timeObjectToString(val.s_one_end_time)
          }
          acc[_this.formTranslation.doctor_session.dt_lbl_morning_session] = temp
          break;
        case 's_two_start_time':
          let temp2 = '';
          if(val.s_two_start_time.HH !== '' && val.s_two_end_time.MM !== '' && val.s_two_start_time.MM !== '' && val.s_two_end_time.HH !== ''){
            temp2 = this.timeObjectToString(val.s_two_start_time) + ' to ' + this.timeObjectToString(val.s_two_end_time)
          }
          acc[_this.formTranslation.doctor_session.dt_lbl_evening_session] = temp2
          break;
        case 'clinic_id':
          acc['clinic_id'] = tempValue.id
          acc['clinic_name'] = tempValue.label
          break;
        case 'doctors':
          acc['doctor_id'] = tempValue.id
          acc['doctor_name'] = tempValue.label
          break;
        case 'default':
          break;
      }
      return acc;
    },
    formatServicesData(elem,tempValue,acc,val){
      let _this = this;
      switch (elem){
        case 'id':
        case 'doctor_id':
        case 'charges':
        case 'telemed_service':
        case 'name':
        case 'doctor_name':
          acc[elem] = tempValue
          break;
        case 'multiple':
          acc['allow_multiple'] = tempValue && tempValue !== '-'? tempValue : 'yes'
          break;
        case 'service_type':
          acc['service_category'] = tempValue.replace(' ', '_');
          break;
        case 'service_id':
          acc['service_category_id'] = tempValue;
          break;
        case 'service_name_alias':
          acc['service_category_alias'] = tempValue ? tempValue : '';
          break;
        case 'image':
          acc['image'] = tempValue && tempValue !== '-' ? tempValue : pluginBASEURL + 'assets/images/kc-demo-img.png';
          break;
        case 'status':
          acc[elem] = tempValue === '1' ? _this.formTranslation.common.active : _this.formTranslation.common.inactive;
          break;
        case 'default':
          break;
      }
      return acc;
    },
    formatReceptionistData(elem,tempValue,acc,val){
      let _this = this;
      switch (elem){
        case 'ID':
        case 'clinic_id':
        case 'clinic_name':
        case 'mobile_number':
        case 'gender':
        case 'dob':
        case 'full_address':
          acc[elem] = tempValue
          break;
        case 'display_name':
          acc['name'] = tempValue && tempValue !== '-'? tempValue : 'yes'
          break;
        case 'user_email':
          acc['email'] = tempValue;
          break;
        case 'image':
          acc['profile_image'] = tempValue;
          break;
        case 'user_status':
          acc[elem] = tempValue === '0' ? _this.formTranslation.common.active : _this.formTranslation.common.inactive;
          break;
        case 'default':
          break;
      }
      return acc;
    },
    formatDoctorData(elem,tempValue,acc,val){
      let _this = this;
      switch (elem){
        case 'ID':
        case 'clinic_id':
        case 'clinic_name':
        case 'mobile_number':
        case 'gender':
        case 'dob':
        case 'specialties':
        case 'full_address':
          acc[elem] = tempValue
          break;
        case 'display_name':
          acc['name'] = tempValue && tempValue !== '-'? tempValue : 'yes'
          break;
        case 'user_email':
          acc['email'] = tempValue;
          break;
        case 'image':
          acc['profile_image'] = tempValue;
          break;
        case 'user_status':
          acc[elem] = tempValue === '0' ? _this.formTranslation.common.active : _this.formTranslation.common.inactive;
          break;
        case 'default':
          break;
      }
      return acc;
    },
    formatClinicData(elem,tempValue,acc,val){
      let _this = this;
      switch (elem){
        case 'clinic_admin_email':
        case 'clinic_admin_id':
        case 'dob':
        case 'specialties':
        case 'clinic_full_address':
          acc[elem] = tempValue
          break;
        case 'id':
          acc['clinic_id'] = tempValue;
          break;
        case 'name':
          acc['clinic_name'] = tempValue && tempValue !== '-'? tempValue : 'yes'
          break;
        case 'email':
          acc['clinic_email'] = tempValue;
          break;
        case 'telephone_no':
          acc['clinic_contact_no'] = tempValue;
          break;
        case 'profile_image':
          acc['clinic_admin_profile_image'] = tempValue;
          break;
        case 'clinic_image':
          acc['clinic_image'] = tempValue;
          break;
        case 'status':
          acc[elem] = tempValue === '1' ? _this.formTranslation.common.active : _this.formTranslation.common.inactive;
          break;
        case 'default':
          break;
      }
      return acc;
    },
    formatEncounterData(elem,tempValue,acc,val){
      let _this = this;
      switch (elem){
        case 'id':
        case 'clinic_id':
        case 'clinic_name':
        case 'doctor_id':
        case 'doctor_name':
        case 'patient_id':
        case 'patient_name':
        case 'appointment_id':
        case 'description':
          acc[elem] = tempValue
          break;
        case 'encounter_date':
        case 'created_at':
          acc['clinic_name'] = tempValue
          break;
        case 'status':
          acc[elem] = tempValue === '1' ? _this.formTranslation.common.active : _this.formTranslation.common.closed;
          break;
        case 'default':
          break;
      }
      return acc;
    },
    formatPrescriptionData(elem,tempValue,acc,val){
      acc[elem] = tempValue
      return acc;
    },
    formatAppointmentData(elem,tempValue,acc,val){
      acc[elem] = tempValue
      return acc;
    },
    formatData(newVal){
      if(newVal.length <= 0){
        return;
      }

      let _this = this;
      this.exportData = newVal.map(function(val){
        return Object.keys(val).reduce((acc, elem) => {
          let tempValue = val[elem] !== '' ? val[elem] : '-';
          switch (_this.module_type){
            case 'patient':
              acc = _this.formatPatientData(elem,tempValue,acc)
              break;
            case 'listing_data':
              acc = _this.formatStaticData(elem,tempValue,acc)
              break;
            case 'custom_field':
              acc = _this.formatCustomFieldData(elem,tempValue,acc)
              break;
            case 'clinic_doctor_holiday':
              acc = _this.formatClinicDoctorHolidayData(elem,tempValue,acc)
              break;
            case 'billings':
              acc = _this.formatBillingsData(elem,tempValue,acc)
              break;
            case 'session':
              acc = _this.formatSessionData(elem,tempValue,acc,val)
              break;
            case 'services':
              acc = _this.formatServicesData(elem,tempValue,acc,val)
              break;
            case 'receptionist':
              acc = _this.formatReceptionistData(elem,tempValue,acc,val)
              break;
            case 'doctor':
              acc = _this.formatDoctorData(elem,tempValue,acc,val)
              break;
            case 'clinic':
              acc = _this.formatClinicData(elem,tempValue,acc,val)
              break;
            case 'encounter':
              acc = _this.formatEncounterData(elem,tempValue,acc,val)
              break;
            case 'prescription':
              acc = _this.formatPrescriptionData(elem,tempValue,acc,val)
              break;
            case 'appointment':
              acc = _this.formatAppointmentData(elem,tempValue,acc,val)
              break;
          }
          return acc;
        }, {});
      });
    },
    timeObjectToString(value){
      return value.HH + ":" + value.mm;
    }
  },
  computed:{
    userData() {
      return this.$store.state.userDataModule.user;
    },
    fileExportName() {
      return this.module_name + ' - ' + moment().format('YYYY-MM-DD');
    },
    patientUniqueIdEnable(){
      if(this.userData.unquie_id_status !== undefined && this.userData.unquie_id_status == true ){
        return  this.userData.unquie_id_status;
      }else{
        return  false
      }
    },
  },
  watch:{
    module_data:function (newVal,oldVal){
      this.formatData(newVal)
    }

  }
}
</script>

<style scoped>

</style>