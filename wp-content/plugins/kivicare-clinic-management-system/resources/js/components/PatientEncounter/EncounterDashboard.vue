<template>
    <b-row>
        <b-col sm="12" >
            <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                <h2>{{formTranslation.patient_encounter.encounter_dashboard}}</h2>
            </b-card>
        </b-col>
    </b-row>
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
        init: function () {
        }
    }
}
</script>