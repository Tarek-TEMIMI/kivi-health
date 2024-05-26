<template>
    <b-row>
        <b-col sm="12" md="12" lg="12">
            <form id="wp-clinic-term-condition-form" @submit.prevent="handleSubmit" >
                <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                    <template v-slot:header>
                        <b-row>
                            <b-col sm="12" md="8" lg="8">
                                <h3 class="mb-0">{{ termConditionTitle }}</h3>
                            </b-col>
                        </b-row>
                        <b-row class="mt-3">
                            <b-col sm="12" lg="12" md="12">
                                <vue-editor  v-model="termsConditionRequest.content"></vue-editor>
                            </b-col>
                        </b-row>
                        <b-row class="mt-3">
                            <b-col sm="12" md="12" lg="12">
                                <div class="float-right">
                                    <button type="submit" class="btn btn-primary" v-html="sessionButtonText"></button>
                                </div>
                            </b-col>
                        </b-row>
                    </template>
                </b-card>
            </form>
        </b-col>
    </b-row>
</template>

<script>
import {get, post} from "../../config/request";

export default {
    data: () => {
        return {
            termsConditionRequest: {},
            termConditionTitle: 'Terms & Condition',
            sessionButtonText: '<i class="fa fa-save"></i> Save',
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init: function () {
            this.termsConditionRequest = this.defaultTermsConditionRequest();
            this.getTermCondition();
        },
        handleSubmit: function () {
            post('terms_condition_save', this.termsConditionRequest)
                .then((response) => {
                    this.loading = false;
                    if (response.data.status !== undefined && response.data.status === true) {
                        displayMessage(response.data.message);
                    } else {
                        displayErrorMessage(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                    displayErrorMessage(this.formTranslation.common.internal_server_error)
                })
        },
        defaultTermsConditionRequest: function () {
            return {
                isVisible: 'accepted',
                content: ''
            }
        },
        getTermCondition () {
            get('terms_condition_list', {})
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        if (response.data.data.content) {
                            this.termsConditionRequest.content = response.data.data.content
                            if(this.termsConditionRequest.content !== '') {
                                this.sessionButtonText ='<i class="fa fa-save"></i>'+this.formTranslation.common.save ;
                            }
                        }

                        if (response.data.data.isVisible) {
                            this.termsConditionRequest.isVisible = response.data.data.isVisible
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })
        }

    }
}
</script>

<style scoped>
.ql-editor {
    min-height: 300px !important;
}
</style>
