<template>
    <div>
      <div class="page-loader-section" v-if="chartLoading">
        <loader-component-2></loader-component-2>
      </div>
        <apexcharts v-show="!chartLoading" type="bar" height="320" id="someId" ref="weekChart" :options="chartOptions" :series="series"></apexcharts>
    </div>
</template>

<script>
    import VueApexCharts from "vue-apexcharts";
    import {get} from "../../config/request";
    export default {
        components: {
            apexcharts: VueApexCharts
        },
        props:{
          chartFilterType:{
            type:[String],
            default(){
              return 'weekly'
            }
          }
        },
        data: () => {
            return {
                series: [{
                    name: 'Total Appointment: ',
                    data: []
                }],
                chartOptions: {
                    chart: {
                        type: 'bar',
                        height: 350
                    },
                    colors: ["#4874dc"],
                    noData: {
                    text: 'Loading........',
                    align: 'center',
                    verticalAlign: 'middle',
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '30%',
                            endingShape: 'rounded'
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        show: true,
                        width: 1,
                        colors: ['transparent']
                    },
                    fill: {
                        opacity: 1
                    },
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return  val ;
                            }
                        }
                    },
                    xaxis:{
                      tickPlacement: 'on',
                      labels:{
                        rotate: -45,
                        rotateAlways: true,
                      }
                    }
                },
                chartLoading:true
            }
        },
        mounted() {
            this.init();
        },
        methods:  {
            init: function () {
                this.getWeeklyAppointments();
                this.series = this.series.map((value)=>{
                   if(this.formTranslation.common !== undefined){
                     value.name = this.formTranslation.common.total_appointment;
                   }
                  return value;
                })
            },
            getWeeklyAppointments: function () {
                let _this = this ;
                this.chartLoading=true;
                get('get_weekly_appointment', {filterType:this.chartFilterType})
                    .then((response) => {
                        let series = [];
                        if (response.data.status !== undefined && response.data.status === true) {
                          if(this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode)){
                            series = response.data.data.reverse();
                          }else{
                            series = response.data.data
                          }
                        }
                        _this.$refs.weekChart.updateOptions({
                          noData:{
                            text:_this.formTranslation.common.no_appointments
                          },
                          yaxis:{
                            opposite: this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode) ? true : false
                          },
                          colors:[_this.getColor]
                        })
                        _this.$refs.weekChart.updateSeries([{
                          name: _this.formTranslation.dashboard.total_appointments,
                          data:  series
                        }]);
                      _this.chartLoading=false;
                    })
                    .catch((error) => {
                        console.log(error);
                      _this.chartLoading=false;
                    })
            }
        },
        computed:{
          userData() {
            return this.$store.state.userDataModule.user;
          },
          getColor() {
            if(this.userData.addOns.kiviPro !== true){
              return "#4874dc"
            }else{
              return this.userData.theme_color;
            }
          },
        },
        watch:{
          chartFilterType:function(newVal,oldVal){
            if(newVal !== oldVal){
              this.getWeeklyAppointments();
            }
          }
        }
    }
</script>