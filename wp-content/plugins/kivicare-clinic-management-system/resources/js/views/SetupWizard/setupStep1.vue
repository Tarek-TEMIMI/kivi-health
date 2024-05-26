<template>
    <b-row>
        <b-col sm="12" md="12" lg="12">
            <div class="card p-0 shadow">
                <div class="card-header">
                    <h3 class="mb-0">Get started</h3>
                </div>
                <div class="card-body">
                    <b-list-group>
                        <b-list-group-item href="#">
                            <h5 class="mb-0"> <b>  {{formTranslation.setup_wizard.kivicare_ehr}}</b> </h5>
                        </b-list-group-item>
                    </b-list-group>

                </div>
                <div class="card-footer">
                    <div class="row mt-3">
                        <div class="col-md-6">
                            <button type="button" class="btn btn-primary float-left"
                                    v-if="currentStep.prevStep !== undefined && currentStep.prevStep !== ''">{{formTranslation.setup_wizard.prev}}
                            </button>
                        </div>
                        <div class="col-md-6">
                            <button type="button"
                                    class="btn btn-primary float-right"
                                    v-if="!loading && currentStep.nextStep !== undefined && currentStep.nextStep !== ''"
                                    @click="handleNextClick">Next <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                            </button>
                            <button v-else class="btn btn-primary float-right" type="submit" disabled>
                                <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </b-col>
    </b-row>
</template>

<script>
export default {
    name: "setupStep1",
    props: ['clickedNext'],
    data: () => {
        return {
            loading: false
        }
    },
    mounted() {
        this.$emit('can-continue', {value: true});
        displayTooltip();
    },
    methods: {
        complete() {
            this.$emit('can-continue', {value: true});
        },
        handleNextClick() {
            this.loading = true;
            this.$store.dispatch('userDataModule/updateSetupStep', this.currentStep);
            this.loading = false;
        }
    },
    watch: {
        $v: {
            handler: function (val) {
                if (!val.$invalid) {
                    this.$emit('can-continue', {value: true});
                } else {
                    this.$emit('can-continue', {value: false});
                }
            },
            deep: true
        }
    },
    computed: {
        currentStep() {
            const step = this.$store.state.userDataModule.setups.filter((obj) => {
                return obj.name === 'getting_started';
            });
            if (step.length > 0) {
                return step[0];
            } else {
                return {}
            }
        }
    }
}
</script>

<style scoped>

</style>
