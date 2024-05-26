<template>
    <div>
        <AdminDashboard v-if="getUserRole() === 'administrator' "/>
        <ClinicAdminDashboard v-if="getUserRole() === 'clinic_admin'"/>
        <DoctorDashboard v-if="getUserRole() === 'doctor'"/>
        <ReceptionistDashboard v-if="getUserRole() === 'receptionist'"/>
        <PatientDashboard v-if="getUserRole() === 'patient'"/>
    </div>
</template>

<script>

import AdminDashboard from "./AdminDashboard";
import ReceptionistDashboard from "./ReceptionistDashboard";
import DoctorDashboard from "./DoctorDashboard";
import ClinicAdminDashboard  from './ClinicAdminDashboard'
import PatientDashboard from './PatientDashboard.vue';

export default {
    components: {
        AdminDashboard,
        ReceptionistDashboard,
        DoctorDashboard,
        ClinicAdminDashboard,
        PatientDashboard
    },
    data: () => {
        return {}
    }
}
</script>
