<template>
    <b-row>
        <b-col sm="12" md="12" lg="12">
            <div class="card p-0 shadow">
                <div class="card-header">
                    <h3 class="mb-0">{{ cardTitle }}</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <ModuleConfig ref="moduleConfiguration"></ModuleConfig>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row mt-3">
                        <div class="col-md-6">
                            <button type="button" class="btn btn-primary float-left"
                                    @click="handlePrevClick"
                                    v-if="currentStep.prevStep !== undefined && currentStep.prevStep !== ''"

                            >
                                <i class="fa fa-angle-double-left" aria-hidden="true"></i> Previous
                            </button>
                        </div>
                        <div class="col-md-6">
                            <button type="button" class="btn btn-primary float-right"
                                    v-if="!loading && currentStep.nextStep !== undefined && currentStep.nextStep !== ''"
                                    @click="handleNextClick"
                                    v-html="saveNextBtn"
                                >
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

import {post, get} from "../../config/request";
import ModuleConfig from "../../components/ModuleConfig/ModuleConfig";

export default {
    name: 'moduleConfig',
    components: {
        ModuleConfig
    },
    data: () => {
        return {
            loading: false,
            cardTitle: 'Configuration',
            moduleList: [],
            saveNextBtn: 'Save & Next <i class="fa fa-angle-double-right" aria-hidden="true"></i>'
        }
    },
    mounted() {
        this.$emit('can-continue', {value: true});
        this.init();
    },
    methods: {
        init: function () {
            this.getModules();
        },
        getModules: function () {
            get('module_list', {})
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        this.moduleList = response.data.data;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage('Internal server error')
                })
        },
        handleSubmit: function () {
            this.loading = true;
            this.$refs.moduleConfiguration.handleSubmit().then(() => {
                this.loading = true;
            });
        },
        handleNextClick() {
            this.$refs.moduleConfiguration.handleSubmit();
        },
        handlePrevClick() {
            this.$store.commit('userDataModule/HANDLE_PREV_STEP', this.currentStep);
        }
    },
    computed: {
        currentStep() {
            const step = this.$store.state.userDataModule.setups.filter((obj) => {
                return obj.name === 'configuration';
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