<template>
    <b-row>
        <b-col sm="12" md="12" lg="12">
            <form id="ReceptionistDataFrom" @submit.prevent="handleSubmit" :novalidate="true">
                <b-card class="p-0 shadow" header-tag="header" footer-tag="footer" no-body>

                    <b-card-header>
                        <h3 class="mb-0">{{ cardTitle }}</h3>
                    </b-card-header>

                    <b-card-body class="pb-0">

                        <div class="row">

                            <div class="col-md-8">

                                <div class="row">
                                    <div class="col-md-12">
                                        <h4 class="text-primary mb-4">{{formTranslation.common.basic_details}} </h4>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <label for="first_name" class="col-md-4 form-control-label">{{formTranslation.common.fname}}<span
                                        class="text-danger">*</span></label>
                                    <div class="col-sm-8">
                                        <input id="first_name"
                                               :class="{ ' is-invalid': submitted && $v.receptionistData.first_name.$error }"
                                               v-model="receptionistData.first_name" :placeholder="formTranslation.setup_wizard.plh_enter_fname"
                                               required="required" name="first_name" type="text" class="form-control">
                                        <div v-if="submitted && !$v.receptionistData.first_name.required"
                                             class="invalid-feedback">{{formTranslation.common.fname_required}}
                                        </div>
                                        <div v-else-if="submitted && !$v.receptionistData.first_name.alpha"
                                             class="invalid-feedback"> {{formTranslation.common.fname_validation_1}}
                                        </div>
                                        <div v-else-if="submitted && (!$v.receptionistData.first_name.minLength || !$v.receptionistData.first_name.maxLength)"
                                             class="invalid-feedback"> {{formTranslation.common.fname_validation_2}}
                                        </div>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <label for="last_name" class="col-md-4 form-control-label">
                                      {{formTranslation.common.lname}}<span class="text-danger">*</span>
                                    </label>
                                    <div class="col-sm-8">
                                        <input id="last_name"
                                               :class="{ ' is-invalid': submitted && $v.receptionistData.last_name.$error }"
                                               v-model="receptionistData.last_name" :placeholder="formTranslation.setup_wizard.plh_enter_lame"
                                               required="required" name="last_name" type="text" class="form-control">
                                        <div v-if="submitted && !$v.receptionistData.last_name.required" class="invalid-feedback">
                                            {{formTranslation.common.lname_required}}
                                        </div>
                                        <div v-else-if="submitted && !$v.receptionistData.last_name.alpha"
                                             class="invalid-feedback">   {{formTranslation.common.lname_validation_1}}
                                        </div>
                                        <div v-else-if="submitted && (!$v.receptionistData.last_name.minLength || !$v.receptionistData.last_name.maxLength)"
                                             class="invalid-feedback"> {{formTranslation.common.lname_validation_2}}
                                        </div>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <label for="email" class="col-md-4 form-control-label">{{formTranslation.common.email}} <span
                                        class="text-danger">*</span></label>
                                    <div class="col-sm-8">
                                        <input id="email"
                                               :class="{ ' is-invalid': submitted && $v.receptionistData.user_email.$error }"
                                               v-model="receptionistData.user_email" :placeholder="formTranslation.setup_wizard.plh_enter_email"
                                               required="required" name="user_email" type="text" class="form-control">
                                        <div v-if="submitted && !$v.receptionistData.user_email.required"
                                             class="invalid-feedback">{{formTranslation.common.email_required}}
                                        </div>
                                        <div v-if="submitted && !$v.receptionistData.user_email.emailValidate"
                                             class="invalid-feedback">{{formTranslation.common.invalid_email}}
                                        </div>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <label for="mobile_number" class="col-md-4 form-control-label"> {{formTranslation.common.contact_no}}<span
                                        class="text-danger">*</span></label>
                                    <div class="col-sm-8">
                                        <input id="mobile_number"
                                               :class="{ ' is-invalid': submitted && $v.receptionistData.mobile_number.$error }"
                                               v-model="receptionistData.mobile_number" 
                                               :placeholder="formTranslation.setup_wizard.plh_enter_contct"
                                               required="required" name="mobile_number" type="text" class="form-control">
                                        <div v-if="submitted && !$v.receptionistData.mobile_number.required"
                                             class="invalid-feedback">{{formTranslation.common.contact_num_required}}
                                        </div>
                                        <div v-else-if="submitted && (!$v.receptionistData.mobile_number.minLength || !$v.receptionistData.mobile_number.maxLength )"
                                             class="invalid-feedback">{{formTranslation.common.contact_validation_1}}
                                        </div>
                                        <div v-else-if="submitted && !$v.receptionistData.mobile_number.phoneNumber"
                                             class="invalid-feedback">                                             class="invalid-feedback">{{formTranslation.common.contact_validation_2}}

                                        </div>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <label for="dob" class="col-md-4 form-control-label">                                             class="invalid-feedback">{{formTranslation.common.dob}}
. <span
                                        class="text-danger">*</span></label>
                                    <div class="col-sm-8">
                                        <input type="date" v-model="receptionistData.dob" name="doc_birthdate" id="doc_birthdate" :max="new Date().toISOString().slice(0, 10)">
                                        <!-- <vc-date-picker
                                            id="recept_bithsate"
                                            title-position="left"
                                            v-model="receptionistData.dob"
                                            :max-date="new Date().setFullYear(new Date().getFullYear() - 18)"
                                            :popover="{ placement: 'bottom', visibility: 'click' }"
                                        >
                                            <template v-slot="{ inputValue }">
                                                <input
                                                    class="form-control date-picker"
                                                    readonly
                                                    :value="inputValue"
                                                />
                                            </template>
                                        </vc-date-picker> -->
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <label for="gender" class="col-md-4 form-control-label">                                             class="invalid-feedback">{{formTranslation.common.gender}}
 </label>
                                    <div class="col-sm-8" id="gender">
                                        <div class="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="male" name="gender" v-model="receptionistData.gender"
                                                   value="male" class="custom-control-input">
                                            <label class="custom-control-label" for="male">                                             class="invalid-feedback">{{formTranslation.common.male}}
</label>
                                        </div>
                                        <div class="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="female" name="gender" v-model="receptionistData.gender"
                                                   value="female" class="custom-control-input">
                                            <label class="custom-control-label" for="female">                                             class="invalid-feedback">{{formTranslation.common.female}}
</label>
                                        </div>
                                        <div class="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="other" name="gender" v-model="receptionistData.gender"
                                                   value="other" class="custom-control-input">
                                            <label class="custom-control-label" for="other">                                             class="invalid-feedback">{{formTranslation.common.other}}
</label>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </b-card-body>

                    <b-card-footer :class="`pb-0 mb-3`">
                        <div class="row mt-3" >
                            <div class="col-md-6">
                                <button type="button" class="btn btn-primary float-left"
                                        @click="handlePrevClick"
                                        v-if="currentStep.prevStep !== undefined && currentStep.prevStep !== ''"><i class="fa fa-angle-double-left" aria-hidden="true"></i> {{formTranslation.setup_wizard.previous}}
                                </button>
                            </div>
                            <div class="col-md-6">
                                <div class="float-right">
                                    <button  @click="handleSubmit" v-if="!loading && (currentStep.nextStep !== undefined && currentStep.nextStep !== '')"
                                             class="btn btn-primary float-right" type="submit"
                                             v-html="saveNextBtn"
                                    ></button>
                                    <button v-else class="btn btn-primary float-right" type="submit" disabled>
                                        <i class="fa fa-sync fa-spin"></i>&nbsp;{{formTranslation.common.loading}}                                </button>
                                </div>
                            </div>
                        </div>
                    </b-card-footer>

                </b-card>
            </form>
        </b-col>
    </b-row>
</template>
<script>

import {numeric, alpha, required, minLength, maxLength} from "vuelidate/lib/validators";
import {validateForm, phoneNumber, emailValidate} from "../../config/helper";
import {post} from "../../config/request";

export default {
    name: "SetupStep5",
    data: () => {
        return {
            stepStatus: false,
            submitted: false,
            loading: false,
            cardTitle: 'Receptionist',
            receptionistData: {},
            saveNextBtn: 'Save & Finish <i class="fa fa-angle-double-right" aria-hidden="true"></i>',
        }
    },
    mounted() {
        this.init();
    },
    validations: {
        receptionistData: {
            first_name: {
                required,
                alpha,
                minLength: minLength(2),
                maxLength: maxLength(15)
            },
            last_name: {
                required,
                alpha,
                minLength: minLength(2),
                maxLength: maxLength(15)
            },
            user_email: {
                required,
                emailValidate
            },
            mobile_number: {
                required,
                phoneNumber,
                minLength: minLength(6),
                maxLength: maxLength(15)
            }
        }
    },
    methods: {
        init: function () {
            this.receptionistData = this.defaultReceptionistData() ;
            this.getCurrentStepStatus();
        },
        defaultReceptionistData: function () {
            var oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 18);
            return {
                ID: '',
                first_name: '',
                last_name: '',
                user_email: '',
                mobile_number: '',
                gender: 'male',
                dob: '',
                about_me: ''
            }
        },
        complete: function () {
            this.$emit('can-continue', {value: true});
        },
        handleSubmit: function () {

            this.loading = true;
            this.submitted = true;
            this.$v.$touch();

            if (this.$v.receptionistData.$invalid) {
                this.loading = false;
                return;
            }

            // this.receptionistData.dob = moment(this.receptionistData.dob).format("YYYY-MM-DD") ;

            if (validateForm("ReceptionistDataFrom")) {
                let _this = this ;
                post('setup_receptionist', this.receptionistData)
                    .then((response) => {
                        this.loading = false;
                        this.submitted = false;
                        if (response.data.status !== undefined && response.data.status === true) {
                            this.$store.dispatch('userDataModule/updateSetupStep',this.currentStep).then(() => {
                                this.$store.dispatch('userDataModule/finishSetup', {}).then(() => {
                                   displayMessage('Clinic setup finish successfully');
                                   _this.$router.push({ name: 'dashboard'});
                                }) ;
                            })
                        } else {
                            // this.receptionistData.dob = new Date(this.receptionistData.dob + ' 00:00');
                            displayErrorMessage(response.data.message);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        this.loading = false;
                        this.submitted = false;
                        displayErrorMessage('Internal server error')
                    })
            }

        },
        getCurrentStepStatus: function () {
            post('get_setup_step_status', { step: 4 })
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        let receptionist  = response.data.data
                        this.stepStatus = true
                        this.receptionistData = this.setReceptionistData(receptionist[0])
                        // this.receptionistData.dob = new Date(this.receptionistData.dob + ' 00:00');
                        this.complete();
                    }
                })
                .catch((error) => {
                    displayErrorMessage('Internal server error')
                })
        },
        setReceptionistData: function (receptionistData) {
            this.receptionistData = {} ;
            return {
                ID: receptionistData.ID,
                first_name: receptionistData.first_name,
                last_name: receptionistData.last_name,
                username: receptionistData.username,
                user_email: receptionistData.user_email,
                mobile_number: receptionistData.mobile_number,
                gender: receptionistData.gender,
                dob: receptionistData.dob,
                about_me: receptionistData.about_me,
                address: receptionistData.address,
                city: receptionistData.city,
                state: receptionistData.state,
                country: receptionistData.country,
                postal_code: receptionistData.postal_code
            }
        },
        handlePrevClick() {
            this.$store.commit('userDataModule/HANDLE_PREV_STEP', this.currentStep);
        }
    },
    computed: {
        currentStep() {
            const step = this.$store.state.userDataModule.setups.filter((obj) => {
                return obj.name === 'receptionist';
            });
            if (step.length > 0) {
                return step[0];
            } else {
                return {}
            }
        }
    },
}
</script>
<style scoped>
    [type="date"] {
    background:#fff url(https://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/calendar_2.png)  97% 50% no-repeat ;
    }
    [type="date"]::-webkit-inner-spin-button {
    display: none;
    }
    [type="date"]::-webkit-calendar-picker-indicator {
    opacity: 0;
    }
    label {
    display: block;
    }
    #doc_birthdate {
        border: 1px solid #c4c4c4;
        border-radius: 5px;
        background-color: #fff;
        padding: 3px 5px;
        box-shadow: inset 0 3px 6px rgba(0,0,0,0.1);
        /* width: 190px; */
        width: 100%;
        height: 45px;
        color:#8c9cad
    }
    #doc_birthdate ::placeholder{
        color:#8c9cad
    }
</style>