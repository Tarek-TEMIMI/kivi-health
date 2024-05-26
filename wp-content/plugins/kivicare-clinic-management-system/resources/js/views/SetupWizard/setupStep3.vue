<template>
    <b-row>
        <b-col sm="12">
            <form id="doctorDataForm" @submit.prevent="handleSubmit" :novalidate="true">
                <b-card class="p-0 shadow" header-tag="header" footer-tag="footer" no-body>
                    <b-card-header>
                        <b-row>
                            <b-col sm="8" md="8" lg="8">
                                <h3 class="mb-2">{{ cardTitle }}</h3>
                            </b-col>
                        </b-row>
                    </b-card-header>
                    <b-card-body class="pb-0">
                        <div>
                            <div class="row">
                                <div class="col-md-12">
                                    <h4 class="text-primary mb-2"> {{formTranslation.setup_wizard.doctor_list}}</h4>
                                </div>
                            </div>
                            <div class="row">
                                <div class="table-responsive">
                                    <table class="table table-sm text-center table-bordered">
                                        <thead class="thead-light">
                                        <tr>
                                            <th>{{formTranslation.common.sr_no}}</th>
                                            <th> {{formTranslation.common.name}}</th>
                                            <th> {{formTranslation.common.email}}</th>
                                            <th> {{formTranslation.common.contact_no}}</th>
                                            <th> {{formTranslation.clinic.speciality}}</th>
                                            <th> {{formTranslation.common.action}}</th>
                                        </tr>
                                        </thead>
                                        <tbody v-if="doctorsData.dataList.length > 0">
                                        <tr v-for="(doctor, index) in doctorsData.dataList" :key="index" >
                                            <td>{{ ++index }}</td>
                                            <td>{{ doctor.display_name }}</td>
                                            <td>{{ doctor.user_email }}</td>
                                            <td>{{ doctor.mobile_number | checkUndefined }}</td>
                                            <td>{{ getSpeciality(doctor.specialties) }}</td>
                                            <td>
                                                <div class="btn-group">
                                                    <button v-b-tooltip.hover :title="formTranslation.common.edit"  type="button" class="btn btn-outline-primary btn-sm" @click="getDoctorDetail(doctor.ID)" ><i class="fa fa-pen-alt"></i></button>
                                                    <button v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt" type="button"  class="btn btn-outline-danger btn-sm" @click="deleteDoctor(doctor.ID)" ><i class="fa fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                        <tbody v-else>
                                            <tr>
                                                <td colspan="8" class="text-center">{{formTranslation.clinic.doctor_record_not_found}}</td>
                                                <td class="d-none"></td>
                                                <td class="d-none"></td>
                                                <td class="d-none"></td>
                                                <td class="d-none"></td>
                                                <td class="d-none"></td>
                                                <td class="d-none"></td>
                                                <td class="d-none"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <hr>
                            <div class="row mt-4" >

                                    <div class="col-md-12">
                                        <h4 class="text-primary mb-2">{{formTranslation.common.basic_details}}</h4>
                                    </div>

                                    <div class="col-md-4 form-group">
                                        <label for="first_name" class="form-control-label">{{formTranslation.common.fname}} <span
                                                class="text-danger">*</span></label>
                                        <input id="first_name"
                                               :class="{ ' is-invalid': submitted && $v.doctorData.first_name.$error }"
                                               v-model="doctorData.first_name" :placeholder="formTranslation.setup_wizard.plh_enter_fname"
                                               required="required" name="first_name" type="text" class="form-control">
                                        <div v-if="submitted && !$v.doctorData.first_name.required"
                                             class="invalid-feedback">{{formTranslation.common.fname_required}}
                                        </div>
                                        <div v-else-if="submitted && !$v.doctorData.first_name.alpha"
                                             class="invalid-feedback"> {{formTranslation.common.fname_validation_1}}
                                        </div>
                                        <div v-else-if="submitted && (!$v.doctorData.first_name.minLength || !$v.doctorData.first_name.maxLength)"
                                             class="invalid-feedback"> {{formTranslation.common.fname_validation_2}}
                                        </div>
                                    </div>

                                    <div class="col-md-4 form-group">
                                        <label for="last_name" class="form-control-label">
                                           {{formTranslation.common.lname}} <span class="text-danger">*</span>
                                        </label>
                                        <input id="last_name"
                                               :class="{ ' is-invalid': submitted && $v.doctorData.last_name.$error }"
                                               v-model="doctorData.last_name" :placeholder="formTranslation.setup_wizard.plh_enter_lame"
                                               required="required" name="first_name" type="text" class="form-control">
                                        <div v-if="submitted && !$v.doctorData.last_name.required" class="invalid-feedback">
                                            {{formTranslation.common.lname_required}}
                                        </div>
                                        <div v-else-if="submitted && !$v.doctorData.last_name.alpha"
                                             class="invalid-feedback">  {{formTranslation.common.lname_validation_1}}
                                        </div>
                                        <div v-else-if="submitted && (!$v.doctorData.last_name.minLength || !$v.doctorData.last_name.maxLength)"
                                             class="invalid-feedback"> {{formTranslation.common.lname_validation_2}}
                                        </div>
                                    </div>

                                    <div class="col-md-4 form-group">
                                        <label for="email" class="form-control-label">{{formTranslation.common.email}} <span
                                                class="text-danger">*</span></label>
                                        <input id="email"
                                               :class="{ ' is-invalid': submitted && $v.doctorData.user_email.$error }"
                                               v-model="doctorData.user_email" :placeholder="formTranslation.setup_wizard.plh_enter_email"
                                               required="required" name="user_email" type="text" class="form-control">
                                        <div v-if="submitted && !$v.doctorData.user_email.required"
                                             class="invalid-feedback">{{formTranslation.common.email_required}}
                                        </div>
                                        <div v-else-if="submitted && !$v.doctorData.user_email.emailValidate" class="invalid-feedback">{{formTranslation.common.invalid_email}}
                                        </div>
                                    </div>

                                    <div v-if="doctorData.ID === undefined" class="col-md-4 form-group">
                                        <label for="user_pass" class="form-control-label">{{formTranslation.common.password}}<span
                                                class="text-danger">*</span></label>
                                        <input id="user_pass" v-model="doctorData.user_pass" 
                                        :placeholder="formTranslation.setup_wizard.plh_enter_pwd"
                                               required="required" name="user_pass" type="text" class="form-control">
                                        <div v-if="submitted && !$v.doctorData.user_pass.required"
                                             class="invalid-feedback">{{formTranslation.common.pwd_required}}
                                        </div>
                                    </div>

                                    <div class="col-md-4 form-group">
                                        <label for="mobile_number" class="form-control-label"> {{formTranslation.common.contact_no}}<span
                                                class="text-danger">*</span></label>
                                        <input id="mobile_number"
                                               :class="{ ' is-invalid': submitted && $v.doctorData.mobile_number.$error }"
                                               v-model="doctorData.mobile_number" :placeholder="formTranslation.setup_wizard.plh_enter_contct"
                                               required="required" name="mobile_number" type="text" class="form-control">
                                        <div v-if="submitted && !$v.doctorData.mobile_number.required"
                                             class="invalid-feedback">{{formTranslation.common.contact_num_required}}
                                        </div>
                                        <div v-else-if="submitted && (!$v.doctorData.mobile_number.minLength || !$v.doctorData.mobile_number.maxLength )"
                                             class="invalid-feedback">{{formTranslation.common.contact_validation_1}}
                                        </div>
                                        <div v-else-if="submitted && !$v.doctorData.mobile_number.phoneNumber"
                                             class="invalid-feedback">{{formTranslation.common.contact_validation_2}}
                                        </div>
                                    </div>

                                    <div class="col-md-4 form-group">
                                        <label for="doc_birthdate" class="form-control-label">{{formTranslation.common.dob}}. <span
                                                class="text-danger">*</span></label>
                                                <input type="date" v-model="doctorData.dob" name="doc_birthdate" id="doc_birthdate" :max="new Date().toISOString().slice(0, 10)">
                                            <!-- <vc-date-picker
                                                id="doc_birthdate"
                                                title-position="left"
                                                v-model="doctorData.dob"
                                                :max-date="new Date().setFullYear(new Date().getFullYear() - 18)"
                                                :placeholder="formTranslation.setup_wizard.plh_welcome_date"
                                                :popover="{ placement: 'bottom', visibility: 'click' }"
                                                :class="{ ' is-invalid': submitted && $v.doctorData.dob.$error }"
                                            >
                                                <template v-slot="{ inputValue }">
                                                    <input
                                                        class="form-control date-picker"
                                                        readonly
                                                        :value="inputValue"
                                                    />
                                                </template>
                                            </vc-date-picker> -->
                                            <div v-if="submitted && !$v.doctorData.dob.required" class="invalid-feedback">{{formTranslation.common.dob_required}}
                                            </div>
                                    </div>

                                    <div class="col-md-4 form-group">
                                        <label for="gender" class="form-control-label">{{formTranslation.common.gender}} <span
                                                class="text-danger">*</span></label>
                                        <div id="gender">
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input type="radio" id="male" name="gender" v-model="doctorData.gender"
                                                       value="male" class="custom-control-input">
                                                <label class="custom-control-label" for="male">{{formTranslation.common.male}}</label>
                                            </div>
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input type="radio" id="female" name="gender" v-model="doctorData.gender"
                                                       value="female" class="custom-control-input">
                                                <label class="custom-control-label" for="female">{{formTranslation.common.female}}</label>
                                            </div>
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input type="radio" id="other" name="gender" v-model="doctorData.gender"
                                                       value="other" class="custom-control-input">
                                                <label class="custom-control-label" for="other">{{formTranslation.common.other}}</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-4 form-group">
                                        <label for="last_name" class="form-control-label">{{formTranslation.patient_front_widget.specialization}} <span
                                            class="text-danger">*</span></label>
                                            <multi-select
                                                deselect-label=""
                                                select-label=""
                                                v-model="doctorData.specialties"
                                                :tag-placeholder="formTranslation.setup_wizard.plh_doc_specialization" :placeholder="formTranslation.setup_wizard.plh_search"
                                                label="label" track-by="id" :options="doctorSpecialization"
                                                :multiple="true"
                                                @tag="addNewSpecialization"
                                                :taggable="true"
                                                :loading="specializationMultiselectLoader"
                                                :disabled="specializationMultiselectLoader"
                                            >
                                            </multi-select>
                                            <span class="text-primary small font-weight-bold">{{formTranslation.clinic.note_specialization}}</span>
                                            <div v-if="submitted && !$v.doctorData.specialties.required" class="invalid-feedback">
                                                 {{formTranslation.doctor.doctor_specialization_required}}
                                            </div>
                                    </div>

                                    <div class="col-md-4 form-group">
                                        <label for="price_type" class="form-control-label">{{formTranslation.doctor.fees_type}} <span class="text-danger">*</span></label>
                                        <div id="price_type">
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input type="radio" id="range" @change="handleResetCharge" name="price_type" v-model="doctorData.price_type" value="range" class="custom-control-input">
                                                <label class="custom-control-label" for="range">{{formTranslation.doctor.range}}</label>
                                            </div>
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input type="radio" id="fixed" @change="handleResetCharge" name="price_type" v-model="doctorData.price_type" value="fixed" class="custom-control-input">
                                                <label class="custom-control-label" for="fixed">{{formTranslation.doctor.fixed}}</label>
                                            </div>
                                        </div>
                                        <div v-if="submitted && !$v.doctorData.price_type.required" class="invalid-feedback">
                                             {{formTranslation.doctor.fees_type_required}}
                                        </div>
                                    </div>
                                   <!-- <div class="col-md-4 form-group">
                                        <label for="price_type" class="form-control-label">Fees type <span
                                            class="text-danger">*</span></label>
                                            <select name="price_type"
                                                    id="price_type"
                                                    :class="{ ' is-invalid': submitted && $v.doctorData.price_type.$error }"
                                                    v-model="doctorData.price_type"
                                                    class="form-control text-capitalize"
                                                    @change="handleResetCharge"
                                            >
                                            <option :value="type" v-for="type in price_type">{{ type }}</option>
                                        </select>
                                        <div v-if="submitted && !$v.doctorData.price_type.required" class="invalid-feedback">
                                            Fees type is required
                                        </div>
                                    </div>-->

                                    <div class="col-md-4 form-group">
                                        <label for="price" class="form-control-label">Fees <span
                                            class="text-danger">*</span></label>
                                            <div v-if="doctorData.price_type !== undefined && doctorData.price_type === 'fixed'">
                                                <input  id="price"
                                                        :class="{ ' is-invalid': submitted && $v.doctorData.price.$error }"
                                                        v-model="doctorData.price" :placeholder="formTranslation.setup_wizard.plh_enter_fees" name="price"
                                                        min="0"
                                                        type="number"
                                                        class="form-control"
                                                >
                                                <div v-if="submitted && !$v.doctorData.price.required" class="invalid-feedback">
                                                    {{formTranslation.doctor.doc_fee_required}}
                                                </div>
                                                <div v-else-if="submitted && (!$v.doctorData.price.minValue)" class="invalid-feedback">
                                                     {{formTranslation.doctor.doc_fee_validation_1}}
                                                </div>
                                                <div v-else-if="submitted && !$v.doctorData.price.maxValue" class="invalid-feedback">
                                                     {{formTranslation.doctor.doc_fee_validation_2}}
                                                </div>
                                            </div>
                                            <div v-if="doctorData.price_type !== undefined && doctorData.price_type === 'range'" class="input-group">
                                                <input type="number"
                                                       :class="{ ' is-invalid': submitted && $v.doctorData.minPrice.$error }"
                                                       v-model="doctorData.minPrice"
                                                       min="0"
                                                       :placeholder="formTranslation.setup_wizard.plh_min_price_range" class="form-control" />
                                                <div class="input-group-prepend bg-gray">
                                                    <span class="input-group-text">  {{formTranslation.common.to}}</span>
                                                </div>
                                                <input type="number"
                                                       :class="{ ' is-invalid': submitted && $v.doctorData.maxPrice.$error }"
                                                       v-model="doctorData.maxPrice"
                                                       :placeholder="formTranslation.setup_wizard.plh_max_price_range"  class="form-control pl-2"
                                                       :min="0" />
                                                <div v-if="submitted && (!$v.doctorData.minPrice.required || !$v.doctorData.maxPrice.required )" class="invalid-feedback">
                                                    {{formTranslation.doctor.doc_fee_validation_3}}
                                                </div>
                                                <div v-else-if="submitted && (!$v.doctorData.minPrice.minValue)" class="invalid-feedback">
                                                     {{formTranslation.doctor.doc_fee_validation_4}}
                                                </div>
                                                <div v-else-if="submitted && !$v.doctorData.maxPrice.minimumValue" class="invalid-feedback">
                                                     {{formTranslation.doctor.doc_fee_validation_5}}
                                                </div>
                                                <div v-else-if="submitted && (!$v.doctorData.minPrice.maxValue || !$v.doctorData.maxPrice.maxValue)" class="invalid-feedback">
                                                  {{formTranslation.doctor.doc_fee_validation_6}}
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <h4 class="text-primary mb-2"> {{formTranslation.doctor.qualification_speciality_details}}</h4>
                                </div>
                            </div>
                            <div class="row mb-4">
                                <div class="col-md-12">
                                    <table class="table table-sm text-center table-bordered custom-table">
                                        <thead class="thead-light">
                                        <tr>
                                            <th>{{formTranslation.common.sr_no}}</th>
                                            <th>{{formTranslation.doctor.degree}}</th>
                                            <th>{{formTranslation.doctor.college_university}}</th>
                                            <th>{{formTranslation.doctor.year}}</th>
                                            <th>{{formTranslation.common.action}}</th>
                                        </tr>
                                        </thead>
                                        <tbody v-if="doctorData.qualifications !== undefined && doctorData.qualifications.length > 0">
                                        <tr v-for="(qualification, index) in doctorData.qualifications">
                                            <td>{{ ++index }}</td>
                                            <td>{{ qualification.degree }}</td>
                                            <td>{{ qualification.university }}</td>
                                            <td>{{ qualification.year }}</td>
                                            <td>
                                                <div class="btn-group">
                                                    <button v-b-tooltip.hover :title="formTranslation.common.edit"  type="button" class="btn btn-outline-primary btn-sm" @click="editQualification(index)" ><i class="fa fa-pen-alt"></i></button>
                                                    <button v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt" type="button"  class="btn btn-outline-danger btn-sm" @click="deleteQualification(index)" ><i class="fa fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                        <tbody v-else>
                                        <tr>
                                            <td colspan="5"><h4 class="text-primary mb-0">{{formTranslation.common.no_records_found}}</h4></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <h4 class="text-primary mb-2">{{ qualificationTitle }}</h4>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="degree" class="form-control-label"> {{formTranslation.doctor.degree}} <span class="text-danger">*</span></label>
                                        <input id="degree"
                                               :class="{ ' is-invalid': qualificationSubmitted && $v.qualification.degree.$error }"
                                               v-model="qualification.degree" :placeholder="formTranslation.setup_wizard.plh_enter_degree" name="degree"
                                               type="text" class="form-control">
                                        <div v-if="qualificationSubmitted && !$v.qualification.degree.required"
                                             class="invalid-feedback"> {{formTranslation.doctor.degree_required}}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="university" class="form-control-label">  {{formTranslation.doctor.university}} <span class="text-danger">*</span></label>
                                        <input id="university"
                                               :class="{ ' is-invalid': qualificationSubmitted && $v.qualification.university.$error }"
                                               v-model="qualification.university" :placeholder="formTranslation.setup_wizard.plh_enter_university"
                                               name="university" type="text" class="form-control">
                                        <div v-if="qualificationSubmitted && !$v.qualification.university.required"
                                             class="invalid-feedback"> {{formTranslation.doctor.university_required}}
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="year" class="form-control-label">{{formTranslation.doctor.year}} <span
                                                class="text-danger">*</span></label>
                                        <b-select name="year" id="year" class="form-control"
                                                :class="{ ' is-invalid': qualificationSubmitted && $v.qualification.year.$error }"
                                                v-model="qualification.year">
                                            <option value="">  {{formTranslation.doctor.select_year}}</option>
                                            <option v-for="year in qualificationYears" :value="year">{{ year }}</option>
                                        </b-select>
                                        <div v-if="qualificationSubmitted && !$v.qualification.year.required"
                                             class="invalid-feedback"> {{formTranslation.doctor.year_required}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-12">
                                    <div class="float-left">
                                        <button class="btn btn-sm btn-primary " type="button" @click="addQualification"
                                                v-html="qualificationBtn"></button>
                                    </div>
                                </div>
                            </div>
                            <hr class="p-0 m-0">
                            <div class="row mb-4 mt-4">
                                <div class="col-md-12">
                                    <div class="float-right">
                                        <b-button v-if="!loading" variant="primary" class="btn btn-primary" type="submit" v-html="buttonText" @click="complete" >
                                            <!--                                            <b-spinner variant="primary" label="Spinning" v-show="loading" ></b-spinner>-->
                                        </b-button>
                                        <button v-else class="btn btn-primary" type="submit" disabled>
                                            <i class="fa fa-sync fa-spin"></i>&nbsp;  {{formTranslation.common.loading}}
                                        </button>
                                    </div>
                                </div>
                            </div>
                    </b-card-body>

                    <b-card-footer :class="`pb-0 mb-3`">
                        <div class="row ">
                            <div class="col-md-6">
                                <button
                                    type="button" class="btn btn-primary float-left"
                                    @click="handlePrevClick"
                                    v-if="currentStep.prevStep !== undefined && currentStep.prevStep !== ''"><i class="fa fa-angle-double-left" aria-hidden="true"></i>  {{formTranslation.setup_wizard.previous}}
                                </button>
                            </div>
                            <div class="col-md-6 pr-0">
                                <button
                                    v-if="!nextLoader && (currentStep.nextStep !== undefined && currentStep.nextStep !== '')"
                                    @click="handleNexClick"
                                    class="btn btn-primary float-right" type="button"
                                    v-html="nextButtonText"
                                    :disabled="(doctorsData.dataList.length > 0 ? false : true)"
                                ></button>
                                <button v-else class="btn btn-primary float-right" type="submit" disabled>
                                    <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                                </button>
                            </div>
                        </div>
                    </b-card-footer>
                </b-card>
            </form>
        </b-col>
    </b-row>
</template>

<script>

    import {alpha, minValue, maxValue, maxLength, minLength, numeric, required, requiredIf} from "vuelidate/lib/validators";
    import {validateForm, phoneNumber, alphaSpace, postalCode, minimumValue, emailValidate} from "../../config/helper";
    import {post,get} from "../../config/request";

    export default {
        name: "setupStep3",
        data: () => {
            return {
                cardTitle: 'Add Doctor',
                stepStatus: false,
                doctorData: {},
                loading: false,
                nextLoader: false,
                submitted: false,
                timeSlots: [],
                qualificationSubmitted: false,
                doctorsData: {
                    dataList: []
                },
                buttonText: '<i class="fa fa-plus"></i> Add doctor',
                qualification: {},
                qualificationTitle: 'Add Qualification',
                qualificationBtn: '<i class="fa fa-plus"></i> Add qualification',
                qualificationEdit: false,
                qualificationYears: [],
                price_type: ['range', 'fixed'],
                clinicSession: [],
                nextButtonText: 'Save & Next <i class="fa fa-angle-double-right" aria-hidden="true"></i>',
            }
        },
        mounted() {
            this.init()
            this.complete()
        },
        validations: {
            doctorData: {
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
                },
                specialties: {required},
                dob: {required},
                price_type: {required},
                price: {
                    required: requiredIf((doctorData) => {
                        return doctorData.price_type === 'fixed';
                    }),
                    minValue: minValue(0),
                    maxValue: maxValue(1000000000000000000)
                },
                minPrice: {
                    required: requiredIf((doctorData) => {
                        return doctorData.price_type === 'range';
                    }),
                    minValue: minValue(0),
                    maxValue: maxValue(1000000000000000000)
                },
                maxPrice: {
                    required: requiredIf((doctorData) => {
                        return doctorData.price_type === 'range';
                    }),
                    minimumValue,
                    maxValue: maxValue(1000000000000000000)
                },
                time_slot: {required},
            },
            qualification: {
                degree: {required},
                university: {required},
                year: {required}
            }
        },
        methods: {
            init: function () {
                this.getCurrentStepStatus();
                // this.getTimeSlots();
                this.doctorData = this.defaultDoctorData();
                this.qualification = this.defaultQualification();
                this.qualificationYears = this.getQualificationYear();
            },
            handleSubmit: function () {

                this.loading = true;
                this.submitted = true;
                this.$v.$touch();

                if (this.$v.doctorData.$invalid) {
                    this.loading = false;
                    return;
                }

                if(this.$v.qualification.$touch()) {
                    this.loading = false;
                    return;
                }

                // this.doctorData.dob = moment(this.doctorData.dob).format("YYYY-MM-DD") ;

                if (validateForm("doctorDataForm")) {
                    post('setup_doctor', this.doctorData)
                        .then((response) => {
                            if (response.data.status !== undefined && response.data.status === true) {
                                this.doctorData = this.defaultDoctorData();
                                this.getCurrentStepStatus()
                                displayMessage(response.data.message);
                                this.buttonText = '<i class="fa fa-plus"></i> Add doctor';
                                if(this.doctorData.ID !== '' && this.doctorData.ID !== null && this.doctorData.ID !==  undefined) {
                                    this.$store.dispatch("userDataModule/fetchUserData", {});
                                }
                            } else {
                                displayErrorMessage(response.data.message)
                            }
                            this.loading = false;
                            this.submitted = false;
                            this.qualificationSubmitted = false;
                        })
                        .catch((error) => {
                            console.log(error);
                            this.loading = false;
                            this.submitted = false;
                            displayErrorMessage('Internal server error')
                        })
                }

            },
            addQualification: function () {

                this.qualificationSubmitted = true;

                this.$v.qualification.$touch();
                if (this.$v.qualification.$invalid) {
                    return;
                }
                if (!this.qualificationEdit) {
                    if (this.doctorData.qualifications === undefined) {
                        this.doctorData.qualifications = [];
                    }

                    this.doctorData.qualifications.push(this.qualification);
                } else {
                    this.qualificationEdit = false;
                }

                this.qualificationTitle = 'Add qualification';
                this.qualificationBtn = '<i class="fa fa-plus"></i> Add qualification';
                this.qualification = this.defaultQualification();

                this.qualificationSubmitted = false;
            },
            editQualification: function (index) {
                this.qualificationTitle = 'Edit qualification';
                this.qualificationEdit = true;
                this.qualificationBtn = '<i class="fa fa-save"></i> Save qualification';
                this.qualification = this.doctorData.qualifications[index - 1];
            },
            deleteQualification: function (index) {
                if(this.doctorData.qualifications[index - 1] !== undefined) {
                    $.confirm({
                        title: 'Are you sure ?',
                        content: 'Press yes to delete',
                        type: 'red',
                        buttons: {
                            ok: {
                                text: "Yes",
                                btnClass: 'btn-danger',
                                keys: ['enter'],
                                action: () => {
                                    if (this.doctorData.qualifications[index - 1] !== undefined) {
                                        this.doctorData.qualifications.splice((index - 1), 1);
                                    }
                                }
                            },
                            cancel: () => {
                            }
                        }
                    });
                } else {
                    displayErrorMessage('Doctor data not found.');
                }
            },
            defaultDoctorData: function () {
                var oneYearFromNow = new Date();
                oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 18);
                return {
                    ID: '',
                    first_name: '',
                    last_name: '',
                    user_email: '',
                    user_pass: '',
                    mobile_number: '',
                    gender: 'male',
                    dob: '',
                    about_me: '',
                    address: '',
                    city: '',
                    state: '',
                    country: '',
                    postal_code: '',
                    specialties: [],
                    price_type: 'range',
                    price: 0,
                    minPrice: 0,
                    maxPrice: 0,
                    qualifications: [],
                    time_slot: 5,
                    custom_fields: {},
                    user_status: 0
                }
            },
            defaultQualification: function () {
                return {
                    degree: '',
                    university: '',
                    year: '',
                    file: ''
                }
            },
            getCurrentStepStatus: function () {
                post('get_setup_step_status', { step: 2 })
                    .then((response) => {
                        if (response.data.status !== undefined && response.data.status === true) {
                            let doctorData  = response.data.data.doctors ;
                            this.clinicSession = response.data.data.clinic_session;
                            this.stepStatus = true ;
                            this.doctorsData.dataList = doctorData ;
                            this.complete() ;
                          }
                    })
                    .catch((error) => {
                      console.log(error);
                      displayErrorMessage('Internal server error')
                    })
            },
            setDoctorData: function (doctorData) {
                return {
                    ID: doctorData.ID,
                    first_name: doctorData.first_name,
                    last_name: doctorData.last_name,
                    username: doctorData.username,
                    user_email: doctorData.user_email,
                    user_pass: doctorData.user_pass,
                    mobile_number: doctorData.mobile_number,
                    gender: doctorData.gender,
                    dob: doctorData.dob,
                    about_me: doctorData.about_me,
                    specialties: doctorData.specialties,
                    price_type: doctorData.price_type,
                    minPrice: doctorData.minPrice,
                    maxPrice: doctorData.maxPrice,
                    price: doctorData.price,
                    time_slot: doctorData.time_slot,
                    qualifications: doctorData.qualifications
                }
            },
            complete: function () {
                this.$emit('can-continue', {value: true});
            },
            getQualificationYear: function () {
                let years = [];
                let d = new Date();
                let x = d.getFullYear();
                for (let i = 1950; i <= x; i++) {
                    years.push(i);
                }
                return years.reverse();
            },
            getDoctorDetail: function (doctorId) {
                get('doctor_edit', {
                    id: doctorId
                })
                    .then((response) => {
                        if (response.data.status !== undefined && response.data.status === true) {
                            this.doctorData = this.setDoctorData(response.data.data)
                            this.buttonText = '<i class="fa fa-save"></i> Save' ;
                            if(this.doctorData.ID !== '' && this.doctorData.ID !== undefined ) {
                                // this.doctorData.dob = new Date(this.doctorData.dob + ' 00:00');

                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        displayErrorMessage('Record not found');
                    })
            },
            deleteDoctor: function (doctorId) {
                let doctorDataIndex = this.doctorsData.dataList.findIndex( (value) => value.ID === doctorId )
                if (doctorId !== undefined) {
                    $.confirm({
                        title: 'Are you sure ?',
                        content: 'Press yes to delete',
                        type: 'red',
                        buttons: {
                            ok: {
                                text: "Yes",
                                btnClass: 'btn-danger',
                                keys: ['enter'],
                                action: () => {
                                    get('doctor_delete', {
                                        id: doctorId
                                    })
                                        .then((response) => {
                                            if (response.data.status !== undefined && response.data.status === true) {
                                                displayMessage(response.data.message);
                                                this.doctorsData.dataList.splice(doctorDataIndex, 1);
                                            }
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                            displayErrorMessage('Record not found');
                                        })
                                }
                            },
                            cancel: () => {
                            }
                        }
                    });
                }
            },
            getTimeSlots: function () {
                let slot = 5;
                for (let i = 0;i < 12; i++) {

                    if (slot <= 60) {
                        this.timeSlots.push(slot);
                    }
                    slot = slot + 5;
                }
            },
            handleTimeSlotChange : function () {
                if (this.doctorData.ID !== '' && this.doctorData.ID !== null && this.doctorData.ID !== undefined) {
                    let isDoctorSlotExist = this.checkDoctorTimeSlotExist();
                    if(isDoctorSlotExist) {
                        displayAlert('Warning!', 'Changing time slot will reset session time slot.');
                    }
                }
            },
            checkDoctorTimeSlotExist: function() {
                let _this = this ;
                let searchResult = [];
                searchResult =this.clinicSession.filter((item) => {
                    return item.doctor_id = _this.doctorData.ID
                });
                if(searchResult.length !== undefined && searchResult.length > 0) {
                    return true;
                }
                return false ;
            },
            handlePrevClick() {
                this.$store.commit('userDataModule/HANDLE_PREV_STEP', this.currentStep);
            },
            handleNexClick() {
                this.nextLoader = true;
                this.$store.dispatch('userDataModule/updateSetupStep',this.currentStep).then(() => {
                    this.nextLoader = false;
                });
            },
            handleResetCharge: function () {
                if (this.doctorData.price_type === "range") {
                    this.doctorData.price = 0;
                } else {
                    this.doctorData.minPrice = 0;
                    this.doctorData.maxPrice = 0;
                }
            },
            addNewSpecialization: function (value) {
                let specialitiesObj = {
                    label: value,
                    type: 'specialization',
                    value: value.replace(' ', '_'),
                    status: 1,
                }
                let _this = this ;
                post('static_data_save', specialitiesObj )
                    .then((response) => {
                        if (response.data.status !== undefined && response.data.status === true) {
                            _this.doctorData.specialties.push({ id: response.data.insert_id, label: value })
                            _this.$store.commit("staticDataModule/ADD_OPTION_STATIC_DATA", {
                                dataType: 'specialization',
                                option: { id: response.data.insert_id, label: value }
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        displayErrorMessage('Internal server error')
                    })
            },
        },
        computed: {
            getSpeciality: function () {
                return (salut) => {
                    salut = salut;
                    if (salut !== undefined && salut !== null && salut.length > 0) {
                        let specialties = '';
                        salut.map(function (spec, index) {
                            specialties += (salut.length === (index + 1) ? spec.label : spec.label + ', ') ;
                            return spec;
                        });
                        return specialties;
                    }
                    return ' - ';
                }
            },
            currentStep() {
                const step = this.$store.state.userDataModule.setups.filter((obj) => {
                    return obj.name === 'doctor';
                });
                if (step.length > 0) {
                    return step[0];
                } else {
                    return {}
                }
            },
          doctorSpecialization(){
            return this.$store.state.staticDataModule.static_data.specialization
          },
          specializationMultiselectLoader(){
            return this.$store.state.staticDataModule.static_data_loader
          }
        },
        watch: {
            stepStatus: function (value) {
                if (value) {
                    this.complete()
                }
            }
        }
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