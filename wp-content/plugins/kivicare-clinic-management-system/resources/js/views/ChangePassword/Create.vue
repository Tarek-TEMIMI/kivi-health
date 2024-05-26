<template>
    <b-row>
        <b-col sm="12" md="12" lg="12">
            <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                <template v-slot:header>
                    <b-row>
                        <b-col sm="12" md="8" lg="8">
                            <h3 class="mb-0">{{ cardTitle }}</h3>
                        </b-col>
                    </b-row>
                </template>
                <b-row>
                    <b-col>
                        <b-row class="mt-2">
                            <b-col sm="12" md="6" lg="6">
                                <b-form-group
                                    id="current_password_label"
                                    :label="this.formTranslation.widgets.current_pwd"
                                    label-for="current_password"
                                >
                                    <b-form-input v-model="passwordChangeRequest.currentPassword" id="current_password" :type="currentPasswordType" :placeholder="formTranslation.change_password.plh_old_pwd"></b-form-input>
                                    <span :class="currentPasswordIcon" class="field-icon toggle-password" @click="viewPassword('current_password');"></span>
                                    <div v-if="submitted && !$v.passwordChangeRequest.currentPassword.required"
                                        class="invalid-feedback">{{formTranslation.widgets.current_pwd_required}}
                                    </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="12" md="6" lg="6">
                                <b-form-group
                                    id="new_password_label"
                                    :label="this.formTranslation.change_password.plh_new_password"
                                    label-for="new_password"
                                >
                                    <b-form-input v-model="passwordChangeRequest.newPassword" id="new_password" :type="newPasswordType" :placeholder="formTranslation.change_password.plh_new_pwd"></b-form-input>
                                    <span :class="newPasswordIcon" class="field-icon toggle-password" @click="viewPassword('new_password');"></span>
                                    <div v-if="submitted && !$v.passwordChangeRequest.newPassword.required"
                                        class="invalid-feedback">{{formTranslation.widgets.new_pwd_required}}
                                    </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="12" md="6" lg="6">
                                <b-form-group
                                    id="confirm_password_label"
                                    :label="this.formTranslation.change_password.plh_confirm_password"
                                    label-for="confirm_password"
                                >
                                  <b-form-input v-model="passwordChangeRequest.confirmPassword" id="confirm_password" :type="confirmPasswordType" :placeholder="formTranslation.change_password.plh_confirm_pwd"></b-form-input>
                                  <span :class="confirmPasswordIcon" class="field-icon toggle-password" @click="viewPassword('confirm_password');"></span>
                                  <div v-if="submitted && !$v.passwordChangeRequest.confirmPassword.required"
                                        class="invalid-feedback">{{formTranslation.widgets.confirm_pwd_required}}
                                    </div>
                                </b-form-group>
                                <div v-if="this.submitted === true && !this.isConfimMatched" class="invalid-feedback">
                                    {{formTranslation.common.pwd_not_match}}
                                </div>
                            </b-col>
                        </b-row>

                        <div class="card-footer">
                            <div class="row">
                                <div class="col-md-12 p-0">
                                    <div class="float-right">
                                        <button type="button" class="float-right btn btn-primary" @click="saveChangePassword" > {{formTranslation.common.change_password}}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-col>
                </b-row>
            </b-card>
        </b-col>
    </b-row>
</template>
<script>

import { post } from "../../config/request";
import {validateForm, minTime, maxTime, validateTimeSlot, objToTime} from "../../config/helper";
import {required} from "vuelidate/lib/validators";

export default {
    validations: {
        passwordChangeRequest: {
            currentPassword: {required},
            newPassword: {required},
            confirmPassword: {required}
        },
    },
    data: () => {
        return {
            submitted: false,
            passwordChangeRequest: {
               currentPassword: '',
               newPassword: '',
               confirmPassword: ''
            },
            emailChangeRequest: {
              newEmail: ''
            },
            cardTitle: 'Change Password',
            currentPasswordType: 'password',
            newPasswordType: 'password',
            confirmPasswordType: 'password',
            currentPasswordIcon: 'fa fa-eye',
            newPasswordIcon: 'fa fa-eye',
            confirmPasswordIcon: 'fa fa-eye'
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init: function () {
          this.cardTitle = this.formTranslation.common.change_password
        },
        saveChangePassword: function () {

            this.submitted = true ;
            this.loading = true;

            // stop here if form is invalid
            this.$v.$touch();

            if (this.$v.passwordChangeRequest.$invalid) {
                this.loading = false;
                return;
            }

           if(!this.isConfimMatched) {
              return false ;
           }
           post('change_password', this.passwordChangeRequest)
                .then((response) => {
                    this.loading = false;
                    this.submitted = false;
                  if (response.data.status !== undefined && response.data.status === true) {
                        displayMessage(response.data.message);
                        setTimeout(function() {
                            location.reload();
                        }, 1000);
                    } else {
                        displayErrorMessage(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                    this.submitted = false;
                    displayErrorMessage(this.formTranslation.common.internal_server_error)
                })
        },
        saveChangeEmail: function () {
            post('doctor_change_email', this.emailChangeRequest)
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
        viewPassword: function (value) {
            if(value === 'current_password'){
                this.currentPasswordType = this.currentPasswordType === 'password' ? 'text' : 'password'
                if(this.currentPasswordType === 'password') {
                    this.currentPasswordIcon = 'fa fa-eye'
                }else{
                    this.currentPasswordIcon = 'fa fa-eye-slash'
                }
            } else if (value === 'confirm_password') {
              this.confirmPasswordType = this.confirmPasswordType === 'password' ? 'text' : 'password'
              if(this.confirmPasswordType === 'password') {
                this.confirmPasswordIcon = 'fa fa-eye'
              }else{
                this.confirmPasswordIcon = 'fa fa-eye-slash'
              }
            } else {
                $(this).toggleClass("fa-eye");
                this.newPasswordType = this.newPasswordType === 'password' ? 'text' : 'password'
                if(this.newPasswordType === 'password') {
                    this.newPasswordIcon = 'fa fa-eye'
                }else{
                    this.newPasswordIcon = 'fa fa-eye-slash'
                }
            }
        },
    },
    computed: {
        isConfimMatched: function () {
            if(this.passwordChangeRequest.newPassword === this.passwordChangeRequest.confirmPassword) {
                return true;
            } else {
                return false;
            }
        },
        // formTranslation: function () {
        //     return this.$store.state.staticDataModule.langTranslateData ;
        // },
    },
    watch: {}
}
</script>
