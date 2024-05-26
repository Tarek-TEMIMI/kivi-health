<template>
    <div class="card animated cursor-pointer fadeInRight mb-4 m-3" :class="parseInt(selectedId) === parseInt(details.id) ? 'doctor-selected' : ''" @click="handleClinicClick">
        <div class="card-body">
             <div class="kivi-media">
                <img class="doctor-image" :src="details.profile_image ? details.profile_image : defualtImage" alt="Generic placeholder image" />
                <div class="kivi-media-body">
                    <h5 class="mb-1 kivi-doctor-name kivi-text-primary">{{details.name}}</h5>
                    <h6 v-if="show" class="mt-0 kivi-details mb-1"><small>{{specialities}}</small></h6>
                    <h6 class="mt-0 kivi-details mb-1" :title="details.address" ><small>{{details.address}}</small></h6>
                    <h6 class="mt-0 kivi-details mb-1" ><small>{{details.city}}</small></h6>
                    <h6 class="mt-0 kivi-details mb-1"><small>{{details.telephone_no}}</small></h6>
                </div>
            </div>
             <div class="kivi-media">
                <div class="">
                    <!-- <span class="mb-1 mt-1 kivi-doctor-name kivi-text-primary">{{details.address}}</span> -->
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
                    name: "",
                    telephone_no: "",
                    address: "",
                    city: "",
                    country: "",
                    postal_code: "",
                    specialties: [],
                    profile_image:"",
                    
                }
            }
        }
    },
    data: () => {
        return {
            defualtImage:window.request_data.kiviCarePluginURL + 'assets/images/kc-demo-img.png',
            show: false
        }
    },
    mounted() {
    },
    methods: {
        getImageUrl() {
            return window.pluginBASEURL + '/assets/images/kc-demo-img.png';
        },
        handleClinicClick: function () {
            this.$emit('clinicClick', this.details);
        }
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
            this.show = true;
            return label;
        }
    }
}
</script>
