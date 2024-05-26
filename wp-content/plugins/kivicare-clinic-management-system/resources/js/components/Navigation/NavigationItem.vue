<template>
    <b-nav-item v-for="(childrens_index, childrens_key) in index.childrens" :key="childrens_key"
        :link-classes="(currentRouteModule === childrens_index.routeClass ? activeRouteClass : '')"
        :to="childrens_index.link === 'patient-medical-report_id' ? { name: childrens_index.link, params: { patient_id: userData.ID } } : { name: childrens_index.link }">
        <i :class="childrens_index.iconClass + ' text-primary'"></i>
        <span class="nav-link-text">{{ childrens_index.label }}</span>
        <span
            v-if="userData.addOns.kiviPro != true &&
                ['clinic', 'billings', 'clinic-revenue-reports', 'reports.reports', 'patient-medical-report_id', 'patient-clinic'].includes(childrens_index.link)"
            v-html="kivicareProFeatureIcon('pro')">
        </span>
        <i class="fas fa-question-circle ml-1  text-danger"
            v-if="childrens_index.link === 'doctor' && !(userData.doctor_available)" v-b-tooltip.hover
            title="Please Add Doctor"></i>
        <i class="fas fa-question-circle ml-1  text-danger"
            v-if="childrens_index.link === 'service' && !(userData.doctor_service_available)" v-b-tooltip.hover
            title="Please Add Doctor Service"></i>
        <i class="fas fa-question-circle ml-1  text-danger"
            v-if="childrens_index.link === 'doctor-session.create' && !(userData.doctor_session_available)"
            v-b-tooltip.hover title="Please Add Doctor Session"></i>
    </b-nav-item>
</template>

<script>
export default {
    data: () => {
        return {

        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init: function () { },
    }
}
</script>