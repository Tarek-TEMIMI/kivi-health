<template>
    <b-row>
        <div class="col-md-12 col-lg-12 col-xl-12">
            <apexcharts type="bar" height="320" id="doctorId" ref="barDoctorRevenueChart" :options="barDoctorOption" :series="series"></apexcharts>
        </div>
    </b-row>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
import {post} from "../../config/request";
export default {
    name:'DoctorRevenue',
    data: () => {
        return {
            
            
        }
    },
    mounted() {
        this.filterData = this.defaultFilterData();
        this.init();
    },
    components: {
        apexcharts: VueApexCharts
    },
    methods:{
        init: function () {
            this.doctorRevenue();
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