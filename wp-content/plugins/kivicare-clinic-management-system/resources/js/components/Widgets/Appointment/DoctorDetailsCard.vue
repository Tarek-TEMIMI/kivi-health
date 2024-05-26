<template>
    <div class="card animated cursor-pointer fadeInRight mb-4 m-3" @click="handleDoctorClick" :class="parseInt(selectedId) === parseInt(details.id) ? 'doctor-selected' : ''" >
        <div class="card-body">
             <div class="kivi-media">
                <img class="doctor-image"  :src="(details.user_profile ? details.user_profile : doctorMaleImage)" alt="Generic placeholder image" />
                <div class="kivi-media-body">
                    <h5 class="mb-1 kivi-doctor-name kivi-text-primary" > {{ formTranslation.widgets.dr_prefix }}  {{ details.display_name }}</h5>
                    <h6 class="mt-0 kivi-details mb-1" ><small>{{ specialities }}</small></h6>
                    <p class="mt-0 mb-0" > <i v-if="details.enableTeleMed !== undefined && details.enableTeleMed === true" class="fas fa-video float-right"></i> </p>
                    <!-- <button class="btn" type="button" @click="showDocProfile(details)">Show Detail</button> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        selectedId: {
            type: [String, Number],
            default() {
                return 0
            }
        },
        details: {
            type: [Object, Array],
            default() {
                return {
                    id: "0",
                    display_name: "",
                    gender: "",
                    address: "",
                    city: "",
                    country: "",
                    state: "",
                    postal_code: "",
                    price: "",
                    qualifications: [],
                    specialties: [],
                    timeSlot: "",
                }
            }
        }
    },
    data: () => {
        return {
            doctorMaleImage: '',
            doctorFemaleImage: ''
        }
    },
    mounted() {
        this.doctorMaleImage = window.pluginBASEURL + '/assets/images/male-doctor.png';
        this.doctorFemaleImage = window.pluginBASEURL + '/assets/images/female-doctor.png';
    },
    methods: {
        getImageUrl() {
            return window.pluginBASEURL + '/assets/images/kc-demo-img.png';
        },
        handleDoctorClick: function () {
            this.$emit('doctorClick', this.details);
        },
        // showDocProfile(data){
        //     this.$emit("doctorProfileShow",data)
        // }
    },
    computed: {
        specialities() {
            let label = "";
            this.details.specialties.map((obj, index) => {
                ++index
                label = label + obj.label;
                if (index !== this.details.specialties.length) {
                    label = label + ", "
                }
                return obj;
            });

            return label;
        }
    }
}
</script>
