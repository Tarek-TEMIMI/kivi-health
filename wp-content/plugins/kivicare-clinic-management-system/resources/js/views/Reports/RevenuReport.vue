<template>
  <b-row>
    <div class="col-md-12 col-lg-12 col-xl-12">
      <b-overlay :show="userData.addOns.kiviPro != true" variant="white"
                 :opacity="overlayOpacity">
        <template #overlay>
          <overlay-message addon_type="pro"></overlay-message>
        </template>
        <div class="card">
          <div class="row mt-2">
            <div class="col-md-12 p-2 ml-4">
              <h3 class="text-primary ">{{ formTranslation.common.filters }}</h3>
            </div>
          </div>
          <div class="row ml-3 mr-3 mb-3">
            <div class="col-lg-3 col-md-6" v-if="currentUser !== 'kiviCare_clinic_admin'">
              <div class="form-group">
                <label for="doctor_id" class="form-control-label">
                  {{ formTranslation.clinic.select_clinic }} <span class="text-danger">*</span>
                </label>
                <multi-select
                    deselect-label=""
                    select-label=""
                    v-model="filterData.clinic_id"
                    :tag-placeholder="formTranslation.reports.tag_plh_select_clinic"
                    id="clinic_id"
                    @select="clinicChange"
                    @remove="clinicChange"
                    :placeholder="formTranslation.plh_search"
                    label="label"
                    track-by="id" :options="clinics"
                    :loading="clinicMultiselectLoader"
                    :disabled="clinicMultiselectLoader"
                ></multi-select>
              </div>
            </div>
            <div class="col-lg-3 col-md-6" v-if="getUserRole !== 'doctor'">
              <div class="form-group">
                <label for="doctor_id" class="form-control-label">
                  {{ formTranslation.patient_encounter.tag_select_doctor }} <span class="text-danger">*</span>
                </label>
                <multi-select
                    deselect-label=""
                    select-label=""
                    v-model="filterData.doctor_id"
                    :tag-placeholder="formTranslation.patient_encounter.tag_select_doctor"
                    id="doctor_id"
                    @select="getAllSubType"
                    :placeholder="formTranslation.plh_search"
                    label="label"
                    track-by="id" :options="doctors"
                    :loading="doctorMultiselectLoader"
                    :disabled="doctorMultiselectLoader"
                ></multi-select>
              </div>
            </div>
            <div class="col-lg-3  col-md-6">
              <div class="form-group">
                <label for="doctor_id" class="form-control-label">
                  {{ formTranslation.reports.filter_by }} <span class="text-danger">*</span>
                </label>
                <multi-select
                    deselect-label=""
                    select-label=""
                    v-model="filterData.filter_id"
                    :tag-placeholder="formTranslation.plh_flter_by"
                    id="filter_id"
                    :placeholder="formTranslation.plh_select"
                    @select="getAllSubType"
                    label="label"
                    track-by="id" :options="filterReport"></multi-select>
              </div>
            </div>
            <div class="col-lg-3  col-md-6">
              <div class="form-group">
                <label for="sub_type_id" class="form-control-label">
                  {{ formTranslation.reports.filter_by }} <span class="text-danger">*</span>
                </label>
                <multi-select
                    deselect-label=""
                    select-label=""
                    v-model="filterData.sub_type"
                    id="sub_type_id"
                    @select="getAllSubType"
                    :placeholder="formTranslation.doctor.select_year"
                    :options="Object.keys(filterSubType)">
                </multi-select>
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-lg-4 col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="text-primary ">{{ formTranslation.reports.clinic_revenue_overall }}</h3>                
              </div>
              <div class="card-body">
                <div class="page-loader-section" v-if="chartLoading">
                  <loader-component-2></loader-component-2>
                </div>
                <apexcharts v-show="!chartLoading" type="donut" :height="320 + Math.floor(Math.random() * 2) + 1"
                            id="someId" ref="revenueChart" :options="chartOptions"
                            :series="series"></apexcharts>
              </div>
            </div>
          </div>
          <div class="col-lg-8 col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="text-primary ">{{ formTranslation.reports.clinic_revenue_detail }}</h3>
              </div>
              <div class="card-body">
                <div class="page-loader-section" v-if="chartLoading">
                  <loader-component-2></loader-component-2>
                </div>
                <apexcharts v-show="!chartLoading" type="bar" height="320" id="barId" ref="barRevenueChart"
                            :options="barChartOption" :series="barseries"></apexcharts>
              </div>
            </div>
          </div>
          <div class="col-lg-12 col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="text-primary ">{{ formTranslation.reports.clinic_doctor_revenue }}</h3>
              </div>
              <div class="card-body">
                <div class="page-loader-section" v-if="chartLoading">
                  <loader-component-2></loader-component-2>
                </div>
                <apexcharts v-show="!chartLoading" type="bar" height="320" id="doctorId" ref="barDoctorRevenueChart"
                            :options="barDoctorOption" :series="docseries"></apexcharts>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="card">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-center flex-wrap">
                  <h3 class="text-primary mr-2">{{ formTranslation.common.clinic_appointment_count }}</h3>
                  <b-select class="form-control" v-model="filterData.appointment_status_clinic" style="width: auto" @change="clinicAppointmentCount">
                    <option v-for="(index,key) in allStatus" :key="key" :value="index.value">{{ index.label }}</option>
                  </b-select>
                </div>
              </div>
              <div class="card-body">
                <div class="page-loader-section" v-if="appointmentClinicChartLoading">
                  <loader-component-2></loader-component-2>
                </div>
                <apexcharts v-show="!appointmentClinicChartLoading" type="bar" height="320" id="clinicId" ref="barClinicAppointmentCountChart"
                            :options="barDoctorOption" :series="clinicAppointmentSeries"></apexcharts>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="card">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-center flex-wrap">
                  <h3 class="text-primary mr-2">{{ formTranslation.common.doctor_appointment_count }}</h3>
                  <b-select class="form-control" v-model="filterData.appointment_status_doctor" style="width: auto" @change="appointmentCount">
                    <option v-for="(index,key) in allStatus" :key="key" :value="index.value">{{ index.label }}</option>
                  </b-select>
                </div>
              </div>
              <div class="card-body">
                <div class="page-loader-section" v-if="appointmentDoctorChartLoading">
                  <loader-component-2></loader-component-2>
                </div>
                <apexcharts v-show="!appointmentDoctorChartLoading" type="bar" height="320" id="doctorId" ref="barAppointmentCountChart"
                            :options="barDoctorOption" :series="appointmentSeries"></apexcharts>
              </div>
            </div>
          </div>
        </div>
      </b-overlay>
    </div>
  </b-row>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
import {post,get} from "../../config/request";
export default {
    name:'RevenueReport',
    data: () => {
        return {
            currentUser:window.request_data.current_user_role,
            key:0,
            series: [],
            chartOptions: {
                chart: {
                    type: 'donut',
                    height:320
                },
                legend:{
                  showForSingleSeries:true,
                  position: 'bottom'
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 320
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }],
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                      total: {
                        show: true,
                        showAlways:true,
                        label: 'Total',
                      }
                    }
                  }
                }
              },
                series: [],
                noData: {
                    text: 'Loading.....',
                    align: 'center',
                    verticalAlign: 'middle',
                    offsetX: 0,
                    offsetY: 0,
                },
                labels:[],
              tooltip:{
                y: {
                  formatter:function(val){
                    return val;
                  }
                }
              }
            },
            barseries:[{
                name:'',
                data: [],
            }],
            docseries:[{
                name:'',
                data: [],
            }],
            barChartOption: {
                chart: {
                    type: 'bar',
                    height: 320
                },
                xaxis: {
                    categories: [],
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
                    width: 2,
                    colors: ['transparent']
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                },
                noData: {
                    text: 'Loading.....',
                    align: 'center',
                    verticalAlign: 'middle',
                    offsetX: 0,
                    offsetY: 0,
                },
                legend:{
                  showForSingleSeries:true
                }
            },
            barDoctorOption: {
                chart: {
                    type: 'bar',
                    height: 350
                },
                xaxis: {
                    categories: [],
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
                    width: 2,
                    colors: ['transparent']
                },
                fill: {
                    opacity: 1
                },
                tooltip: {

                },
                noData: {
                    text: 'Loading.....',
                    align: 'center',
                    verticalAlign: 'middle',
                    offsetX: 0,
                    offsetY: 0,
                },
                legend:{
                  showForSingleSeries:true
                }
            },
            filterData:{},
            filterReport:[
                {
                    id:"weekly",
                    label:"Weekly"
                },
                {
                    id:"monthly",
                    label:"Monthly"
                },
                {
                    id:"yearly",
                    label:"Yearly"
                }
            ],
            getAllType:[],
            filterSubType:[],
            clinic_currency:{
              prefix:'',
              postfix:''
            },
            clinics:[],
          clinicMultiselectLoader:true,
          chartLoading:false,
          appointmentClinicChartLoading:false,
          appointmentDoctorChartLoading:false,
          doctorMultiselectLoader:true,
          doctors:[],
          doctorApiData :{
            data_type: 'clinic_doctors',
            clinic_id: ''
          },
          allStatus: [
            {label: "all", value: "all"},
            {label: "booked", value: "1"},
            {label: "completed", value: "3"},
            {label: "cancelled", value: "cancel"},
            {label: "checkin", value: "4"},
            {label: "pending", value: "2"},
          ],
          appointmentSeries:[{
            name:'',
            data: [],
          }],
          clinicAppointmentSeries:[{
            name:'',
            data: [],
          }],
          doctor_colors:[],
          clinic_colors:[]
        }
    },
    mounted() {
      if(['doctor','patient'].includes(this.getUserRole())) {
        this.$router.push({ name: "403"})
      }
      this.allStatus = this.allStatus.map( (item) => {
        if(['booked','pending'].includes(item.label)){
          item.label = this.formTranslation.appointments[item.label];
        }else{
          item.label = this.formTranslation.common[item.label];
        }
        return item;
      })
        this.filterData = this.defaultFilterData();
        get('get_all_report_type',{})
            .then((response) => {
                if (response.data.status !== undefined && response.data.status === true) {
                    this.getAllType = response.data.data
                    this.filterSubType = this.getAllType.years
                    this.filterData.sub_type= this.getAllType.default_year
                    this.clinic_currency = response.data.clinic_currency
                    this.doctor_colors = response.data.doctor_colors
                    this.clinic_colors = response.data.clinic_colors
                }
              this.init();
            })
            .catch((error) => {
                console.log(error);
        })
    },
    components: {
        apexcharts: VueApexCharts
    },
    methods:{
        init: function () {
            this.getClinicRevenue();
            this.barChartClinicRevenue();
            this.doctorRevenue()
            this.getClinic()
            this.appointmentCount();
            this.clinicAppointmentCount();
            this.getDoctorsData(0);
        },
        defaultFilterData: function () {
            return {
                clinic_id: {
                    id:"all",
                    label:this.formTranslation.common.all
                },
                filter_id: {
                    id:"yearly",
                    label:this.formTranslation.common.yearly
                },
              doctor_id: {
                id:"all",
                label:this.formTranslation.common.all
              },
                sub_type:'',
              appointment_status_clinic:'all',
              appointment_status_doctor:'all',
              patient_id :  ''
            }
        },
        getClinicRevenue: function () {
          let _this = this;
          this.chartLoading = true;
            get('get_clinic_revenue',  this.filterData)
                .then((response) => {
                  _this.chartLoading = false;
                    if (response.data.status !== undefined && response.data.status === true) {
                      _this.series = response.data.data
                      _this.chartOptions.labels = response.data.labels;
                      _this.chartOptions.noData.text = _this.formTranslation.common.no_data_found;
                      _this.chartOptions.series = response.data.data;
                      _this.chartOptions.plotOptions.pie.donut.labels.total.label = _this.formTranslation.common.total;
                      _this.chartOptions.legend.formatter = function(seriesName, opts) {
                        let val = _this.clinic_currency.prefix + (typeof numberWithCommas !== "undefined" ? numberWithCommas(opts.w.globals.series[opts.seriesIndex]) : opts.w.globals.series[opts.seriesIndex]) + _this.clinic_currency.postfix
                        return `<div class="legend-info"><span>${seriesName}</span>: <strong>${val}</strong></div>`;
                      };
                      _this.chartOptions.plotOptions.pie.donut.labels.total.formatter = function (w) {
                        let totals = w.globals.seriesTotals.reduce((a, b) => {
                          return a + b;
                        }, 0)
                        return _this.clinic_currency.prefix + (typeof numberWithCommas !== "undefined" ? numberWithCommas(totals) : val) + _this.clinic_currency.postfix;
                      }
                      _this.chartOptions.tooltip.y.formatter = function (val) {
                        return _this.clinic_currency.prefix + (typeof numberWithCommas !== "undefined" ? numberWithCommas(val) : val) + _this.clinic_currency.postfix;
                      }
                      if(this.clinic_colors.length > 0){
                        let color  = this.clinic_colors.slice(0, response.data.data.length)
                        _this.chartOptions.colors = color;
                        _this.chartOptions.fill = {
                          colors : color
                        };
                      }
                      _this.$refs.revenueChart.updateSeries(response.data.data);
                      _this.$refs.revenueChart.updateOptions(_this.chartOptions);
                    }
                })
                .catch((error) => {
                  _this.chartLoading = false;
                    console.log(error);
            })
        },
        barChartClinicRevenue(){
           let _this = this;
          this.chartLoading = true;
            get('get_clinic_bar_revenue',  this.filterData)
                .then((response) => {
                  _this.chartLoading = false;
                    if (response.data.status !== undefined && response.data.status === true) {
                        _this.barseries =response.data.data
                        if(this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode)){
                          response.data.data = response.data.data.map( (item) => {
                            item.data = item.data.reverse();
                            return item;
                          })
                          _this.$refs.barRevenueChart.updateSeries(response.data.data);
                        }else{
                          _this.$refs.barRevenueChart.updateSeries(response.data.data);
                        }
                      if(this.clinic_colors.length > 0){
                        let color  = this.clinic_colors.slice(0, response.data.data.length)
                        _this.chartOptions.colors = color;
                        _this.chartOptions.fill = {
                          colors : color
                        };
                      }
                      let updateOptions = {
                        xaxis:{
                          categories: this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode) ? response.data.date.reverse() : response.data.date
                        },
                        noData:{
                          text:_this.formTranslation.common.no_data_found
                        },
                        yaxis:{
                          labels:{
                            formatter:function(val){
                              return _this.clinic_currency.prefix + (typeof numberWithCommas !== "undefined" ? numberWithCommas(val) : val) + _this.clinic_currency.postfix;
                            }
                          },
                          opposite: this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode) ? true : false
                        }
                      }
                      if(this.clinic_colors.length > 0){
                        let color  = this.clinic_colors.slice(0, response.data.data.length)
                        updateOptions.colors = color;
                        updateOptions.fill = {
                          colors : color
                        };
                      }
                        _this.$refs.barRevenueChart.updateOptions(updateOptions);
                        // this.doctorRevenue()
                    }
                })
                .catch((error) => {
                  _this.chartLoading = false;
                    console.log(error);
            })
        },
        doctorRevenue(){
          let _this = this;
          _this.chartLoading = true;
            get('get_doctor_wise_revenue',  this.filterData)
                .then((response) => {
                  _this.chartLoading = false;
                    if (response.data.status !== undefined && response.data.status === true) {
                       _this.docseries =  response.data.data
                       if(this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode)){
                          response.data.data = response.data.data.map( (item) => {
                            item.data = item.data.reverse();
                            return item;
                          })
                          _this.$refs.barDoctorRevenueChart.updateSeries(response.data.data);
                        }else{
                          _this.$refs.barDoctorRevenueChart.updateSeries(response.data.data);
                        }
                       let chartOption = {
                         xaxis:{
                          categories: this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode) ? response.data.date.reverse() : response.data.date
                         },
                         noData:{
                           text:_this.formTranslation.common.no_data_found
                         },
                         yaxis:{
                           labels:{
                             formatter:function(val){
                               return _this.clinic_currency.prefix + (typeof numberWithCommas !== "undefined" ? numberWithCommas(val) : val)  + _this.clinic_currency.postfix;
                             }
                           },
                           opposite: this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode) ? true : false
                         }
                       }
                      if(this.doctor_colors.length > 0){
                        let color  = this.doctor_colors.slice(0, response.data.data.length)
                        chartOption.colors = color;
                        chartOption.fill = {
                          colors : color
                        };
                      }
                        _this.$refs.barDoctorRevenueChart.updateOptions(chartOption);
                    }
                })
                .catch((error) => {
                  _this.chartLoading = false;
                    console.log(error);
            })
        },
        clinicChange(selectOption){
          let clinic_id = 0;
          if(selectOption.id && selectOption.id !== 'all'){
            this.doctorApiData.data_type = 'get_users_by_clinic';
            clinic_id = selectOption.id;
          }else{
            this.doctorApiData.data_type = 'clinic_doctors';
          }
          this.getDoctorsData(clinic_id);
          this.getAllSubType(selectOption)
        },
      appointmentCount(){
        let _this = this;
        _this.appointmentDoctorChartLoading = true;
        get('get_appointment_count',  this.filterData)
            .then((response)=>{
              _this.appointmentDoctorChartLoading = false;
              if (response.data.status !== undefined && response.data.status === true) {
                _this.appointmentSeries =  response.data.data
                if(this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode)){
                  response.data.data = response.data.data.map( (item) => {
                    item.data = item.data.reverse();
                    return item;
                  })
                  _this.$refs.barAppointmentCountChart.updateSeries(response.data.data);
                }else{
                  _this.$refs.barAppointmentCountChart.updateSeries(response.data.data);
                }
                let chartOption = {
                  xaxis:{
                    categories: this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode) ? response.data.date.reverse() : response.data.date
                  },
                  yaxis:{
                    opposite: this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode) ? true : false
                  },
                  noData:{
                    text:_this.formTranslation.common.no_data_found
                  },

                }
                if(this.doctor_colors.length > 0){
                  let color  = this.doctor_colors.slice(0, response.data.data.length)
                  chartOption.colors = color;
                  chartOption.fill = {
                    colors : color
                  };
                }
                _this.$refs.barAppointmentCountChart.updateOptions(chartOption);
              }
            })
      },
      clinicAppointmentCount(){
        let _this = this;
        _this.appointmentClinicChartLoading = true;
        get('get_clinic_appointment_count',  this.filterData)
            .then((response)=>{
              _this.appointmentClinicChartLoading = false;
              if (response.data.status !== undefined && response.data.status === true) {
                _this.clinicAppointmentSeries =  response.data.data
                if(this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode)){
                  response.data.data = response.data.data.map( (item) => {
                    item.data = item.data.reverse();
                    return item;
                  })
                  _this.$refs.barClinicAppointmentCountChart.updateSeries(response.data.data);
                }else{
                  _this.$refs.barClinicAppointmentCountChart.updateSeries(response.data.data);
                }
                let  chartOption = {
                  xaxis:{
                    categories: this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode) ? response.data.date.reverse() : response.data.date
                  },
                  yaxis:{
                    opposite: this.userData.theme_mode !== undefined && [true,'true'].includes(this.userData.theme_mode) ? true : false
                  },
                  noData:{
                    text:_this.formTranslation.common.no_data_found
                  },

                }
                if(this.clinic_colors.length > 0){
                  let color  = this.clinic_colors.slice(0, response.data.data.length)
                  chartOption.colors = color;
                  chartOption.fill = {
                    colors : color
                  };
                }
                _this.$refs.barClinicAppointmentCountChart.updateOptions(chartOption);
              }
            })
      },
        getAllSubType(selectOption){
            var data = this.filterData
            if(selectOption.id == "weekly"){
                this.filterSubType = this.getAllType.weeks
                this.filterData.sub_type =  this.getAllType.default_week
            }
            if(selectOption.id == "monthly"){
                this.filterSubType = this.getAllType.months
                this.filterData.sub_type =  this.getAllType.default_month
            }
            if(selectOption.id == "yearly"){
                this.filterSubType = this.getAllType.years
                this.filterData.sub_type =  this.getAllType.default_year
            }
            let _this = this ;
            this.getClinicRevenue();
            this.barChartClinicRevenue();
            this.doctorRevenue()
            this.clinicAppointmentCount()
            this.appointmentCount()
        },
      getClinic:function(){
        this.filterReport = this.filterReport.map( (item) => {
          item.label = this.formTranslation.common[item.id];
          return item;
        })
        // Get dropdown data for clinics
        this.clinicMultiselectLoader = true;
        get('get_static_data', {
          data_type: 'clinics'
        })
            .then((response) => {
              if (response.data.status !== undefined && response.data.status === true) {
                this.clinics = response.data.data
                if(this.clinics.length > 0){
                  this.clinics.push({id:'all',label:this.formTranslation.common.all})
                }
              } else {
                displayErrorMessage(response.data.message)
              }
              this.clinicMultiselectLoader = false;
            })
            .catch((error) => {
              console.log(error);
              this.clinicMultiselectLoader = false;
              displayErrorMessage(this.formTranslation.common.internal_server_error)
            })
      },
      getDoctorsData: function (clinic_id) {
        this.doctorApiData.clinic_id = clinic_id
        this.doctorMultiselectLoader = true;
        get('get_static_data', this.doctorApiData)
            .then((data) => {
              this.doctorMultiselectLoader = false;
              if (data.data.status !== undefined && data.data.status === true) {
                if(data.data.data.length > 0){
                  data.data.data.unshift({id:'all',label:this.formTranslation.common.all})
                }
                this.doctors = data.data.data;
              }
            })
            .catch((error) => {
              this.doctorMultiselectLoader = false;
              console.log(error);
              displayErrorMessage(this.formTranslation.common.internal_server_error);
            })
      }
    },
    computed: {
      userData() {
        return this.$store.state.userDataModule.user;
      },
        // clinics() {
        //     return this.$store.state.clinic
        // },
    //     formTranslation: function () {
    //   return this.$store.state.staticDataModule.langTranslateData ;
    // },
    }
}
</script>