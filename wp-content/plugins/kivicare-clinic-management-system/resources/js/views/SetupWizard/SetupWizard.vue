<template>
    <b-row>
        <b-col sm="12 text-center mb-3">
            <div class="card p-0 shadow m-0">
                <div class="card-body p-0">
                    <div class="d-inline-flex flex-row custom-stepper" v-for="(step,index) in setups" :key="index">
                        <div class="p-2 text-center" v-if="step.completed">
                            <p class="stepper-icon " :class="$route.name === step.routeName ? 'bg-primary ' : 'bg-success'">
                                <i class="fa fa-check" v-if="step.completed"></i>
                                <i :class="step.icon" v-else></i>
                            </p>
                            <h4 :class="$route.name === step.routeName ? 'text-primary ' : 'text-success'">{{ step.title }}</h4>
                        </div>
                        <div class="p-2 text-center" v-else>
                            <p class="stepper-icon" :class="$route.name === step.routeName ? 'bg-primary ' : 'bg-light '"><i :class="step.icon"></i></p>
                            <h4 :class="$route.name === step.routeName ? 'text-primary ' : 'text-light '">{{ step.title }}</h4>
                        </div>
                    </div>
                </div>

            </div>
        </b-col>

        <b-col sm="12">
            <transition
                name="fade"
                mode="out-in"
            >
                <router-view></router-view>
            </transition>
        </b-col>
    </b-row>
</template>

<script>

export default {
    data: () => {
        return {
            tempColor: localStorage.getItem('temp_color'),
        }
    },
    mounted() {
        this.init();
        setTimeout(() => {
            if(this.userData.addOns.kiviPro === true){
               document.documentElement.style.setProperty("--primary", this.getColor);
            }
        }, 1000);
    },
    methods: {
        init: function () {
        },
        handleActiveStep: function (step) {
            this.$store.commit('userDataModule/HANDLE_ACTIVE_STEP',step);
        }
    },
    computed: {
        setups() {
            return this.$store.state.userDataModule.setups;
        },
        userData() {
          return this.$store.state.userDataModule.user;
        },
        getColor() {
            if(this.tempColor == '' || this.tempColor == null){
                return this.userData.theme_color;
            }
            return this.tempColor;
        },
    }
}
</script>
