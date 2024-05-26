<template>
    <b-row>
        <div class="col-md-12 col-lg-12 col-xl-12">
             <apexcharts type="bar" height="320" id="barId" ref="barRevenueChart" :options="barChartOption" :series="barseries"></apexcharts>
        </div>
    </b-row>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
import {post} from "../../config/request";
export default {
    name:'ClinicRevenue',
    data: () => {
        return {
            barseries:[{
                name:'',
                data: [],
            }],
            barChartOption: {
                chart: {
                    type: 'bar',
                    height: 350
                },
                xaxis: {
                    categories: [],
                },
                colors: ['#09E5A9', '#19C9E8'],
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
                    y: {
                        formatter: function (val) {
                            return  val ;
                        }
                    }
                }
            },
            filterData:{}
        }
    },
    mounted() {
        this.filterData = this.defaultFilterData();
        this.init();
    },
    components: {
        apexcharts: VueApexCharts,
    },
    methods:{
        init: function () {
            this.barChartClinicRevenue();
        },
        defaultFilterData: function () {
            return {
                clinic_id: 'all',
                filter_id: 'daily',
            }
        },
       
        
    },
    computed: {
        clinics() {
            return this.$store.state.clinic
        },
    }
}
</script>