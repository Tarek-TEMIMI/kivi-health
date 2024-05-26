<template>
    <section>
        <form action="action_page.php" style="border:1px solid #ccc">
            <div class="container">
                <h1>{{$('common.sign_up')}}</h1>
                <p>{{formTranslation.patient_front_widget.fill_form}}</p>
                <label for="first_name"><b> {{formTranslation.common.fname}} </b></label>
                <input type="text" v-model="registerRequest.firstname" :placeholder="formTranslation.patient.fname_plh" name="first_name" required>
                <div v-if="submitted && !$v.registerRequest.firstname" class="invalid-feedback">
                    {{formTranslation.common.fname_required}}
                </div>
                <label for="last_name"><b> {{formTranslation.common.lname}}</b></label>
                <input type="text" v-model="registerRequest.lastname" :placeholder="formTranslation.patient.lname_placeholder" name="last_name" required>
                <div v-if="submitted && !$v.registerRequest.lastname" class="invalid-feedback">
                    {{formTranslation.common.lname_required}}
                </div>
                <label for="email"><b>{{formTranslation.common.email}}</b></label>
                <input type="text" v-model="registerRequest.email" :placeholder="formTranslation.patient.email_placeholder" name="email" required>
                <div v-if="submitted && !$v.registerRequest.email" class="invalid-feedback">
                    {{formTranslation.common.email_required}}
                </div>
                <label for="psw"><b>{{formTranslation.common.password}}</b></label>
                <input type="password" v-model="registerRequest.password" :placeholder="formTranslation.patient.plh_pwd" name="psw" required>
                <div v-if="submitted && !$v.registerRequest.password" class="invalid-feedback">
                    {{formTranslation.common.pwd_required}}
                </div>
                <label for="psw-repeat"><b>{{formTranslation.common.repeat_pwd}}</b></label>
                <input type="password" v-model="registerRequest.rep_password" :placeholder="formTranslation.patient.plh_repeat_pwd" name="psw-repeat" required>
                <div v-if="submitted && !$v.registerRequest.rep_password" class="invalid-feedback">
                    {{formTranslation.common.repeat_password_required}}
                </div>
                <div class="clearfix">
                    <button type="button" class="cancelbtn">{{formTranslation.common.cancel}}</button>
                    <button type="button" class="signupbtn" @click="register">{{formTranslation.common.sign_up}}</button>
                </div>
            </div>
        </form>
    </section>
</template>

<script>
import {_axios_post, _patientRegister} from "../../config/request";
import { validateForm } from "../../config/helper";
import { required } from "vuelidate/lib/validators";

export default {
        name: 'RegisterWidget',
        data: () => {
            return {
                submitted: false,
                registerRequest: {
                    first_name: '',
                    last_name: '',
                    user_email: '',
                    password: '',
                    rep_password: '',
                },
            }
        },
        validations: {
            registerRequest: {
                first_name: {required},
                last_name: {required},
                user_email: {required},
                password: {required},
                rep_password: {required},
            }
        },
        methods: {
            register: function () {

                this.submitted = true

                this.$v.$touch();

                if (this.$v.registerRequest.$invalid) {
                    return;
                }

                _axios_post( _patientRegister, this.registerRequest).then((response) => {
                    this.submitted = false
                }).catch((err) => {
                    this.submitted = false
                    console.log(err)
                })
            }
        }
    }
</script>

<style scoped>
* {box-sizing: border-box}

/* Full-width input fields */
input[type=text], input[type=password] {
    width: 100%;
    padding: 15px;
    margin: 5px 0 22px 0;
    display: inline-block;
    border: none;
    background: #f1f1f1;
}

input[type=text]:focus, input[type=password]:focus {
    background-color: #ddd;
    outline: none;
}

hr {
    border: 1px solid #f1f1f1;
    margin-bottom: 25px;
}

/* Set a style for all buttons */
button {
    background-color: #4CAF50;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    width: 100%;
    opacity: 0.9;
}

button:hover {
    opacity:1;
}

/* Extra styles for the cancel button */
.cancelbtn {
    padding: 14px 20px;
    background-color: #f44336;
}

/* Float cancel and signup buttons and add an equal width */
.cancelbtn, .signupbtn {
    float: left;
    width: 50%;
}

/* Add padding to container elements */
.container {
    padding: 16px;
}

/* Clear floats */
.clearfix::after {
    content: "";
    clear: both;
    display: table;
}

/* Change styles for cancel button and signup button on extra small screens */
@media screen and (max-width: 300px) {
    .cancelbtn, .signupbtn {
        width: 100%;
    }
}
</style>
