<template>
  <div>
    <span class="badge badge-primary"
          @click="add_to_calendar_url('googleCalender')">
      <i class="fab fa-google"></i>  {{ formTranslation.common.google }}
    </span>
    <span class="badge badge-primary"
          @click="add_to_calendar_url('microSoftOutlookLive')">
      <i class="fas fa-calendar-alt"></i>  {{ formTranslation.common.outlook }}
    </span>
    <span class="badge badge-primary"
          @click="add_to_calendar_url('microSoftOutlookoffice')">
      <i class="fab fa-windows"></i>  {{ formTranslation.common.microsoft }}
    </span>
<!--    <span class="badge badge-primary"-->
<!--          @click="add_to_calendar_url('microSoftTeam')">-->
<!--      <i class="fas fa-calendar-alt"></i>  {{ 'Microsoft Team' }}-->
<!--    </span>-->
    <span class="badge badge-primary"
          @click="add_to_calendar_url('apple')">
      <i class="fas fab-apple"></i>  {{ 'Apple' }}
    </span>
    <span class="badge badge-primary"
          @click="add_to_calendar_url('yahoo')">
      <i class="fab fa-yahoo"
         aria-hidden="true"></i>{{ formTranslation.common.yahoo }}
    </span>
  </div>
</template>

<script>
export default {
  name: "addToCalendar",
  props:{
    calendar_content:{
      type:[Object],
      default(){
        return {
          description: "",
          endDate: "",
          endTime:"",
          location:"",
          name:"",
          startDate:"",
          startTime:"",
          timeZone:"",
          iCalFileName: ""
        }
      }
    }
  },
  data: () => {
    return {
    }
  },
  mounted() {

  },
  methods:{
    add_to_calendar_url(type=''){
      kivicare_add_to_calendar_url(this.calendar_content,type);
    },
  }
}
</script>

<style scoped>
span{
  cursor: pointer;
}
</style>