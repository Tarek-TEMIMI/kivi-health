<template>
    <div id="doctor_profile">
      <div class="page-loader-section" v-if="formLoader">
        <loader-component-2></loader-component-2>
      </div>
      <b-row v-else>
        <AppointmentReviewCard :appointmentDetails="{}" :doctor_id="select_doctor_id" :appointmentReviewModal="appointmentReviewModal" v-if="appointmentReviewModal" @closeModal="appointmentReviewModal=false">
        </AppointmentReviewCard>
        <b-col class="col-xl-9 order-xl-1">
          <div class="card">
            <div class="card-header pb-0 border-0">
              <div class="row">
                <div class="col-12">
                  <b-tabs>
                    <b-tab :title="formTranslation.patient.edit_profile" :active="viewMode === 'editProfile'" @click="viewMode='editProfile'">
                    </b-tab>
                    <b-tab  :title="custom_form_data.name && custom_form_data.name.text ? custom_form_data.name.text : ''" :active="viewMode === 'custom_form_'+custom_form_data.id" @click="viewMode='custom_form_'+custom_form_data.id" v-for="(custom_form_data,key) in doctorData.custom_forms" :key="key" v-if=" userData.addOns.kiviPro == true &&doctorData.custom_forms && doctorData.custom_forms.length">
                    </b-tab>
                  </b-tabs>
                </div>
              </div>
            </div>
            <form id="doctorDataForm" @submit.prevent="handleSubmit" enctype="multipart/form-data" :novalidate="true" v-if="viewMode === 'editProfile'">
              <div class="card-body pt-0">
                <h6 class="heading-small text-muted mb-4">{{formTranslation.doctor.basic_information}}</h6>
                  <div class="pl-lg-4">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="first_name" class="form-control-label">
                            {{formTranslation.common.fname}} <span class="text-danger">*</span>
                          </label>
                          <input id="first_name"
                                 :class="{ ' is-invalid': submitted && $v.doctorData.first_name.$error }"
                                 v-model="doctorData.first_name" :placeholder="formTranslation.doctor.fname_plh"
                                 required="required" name="name" type="text" class="form-control">
                          <div v-if="submitted && !$v.doctorData.first_name.required"
                               class="invalid-feedback">{{formTranslation.common.fname_required}}
                          </div>
                          <div v-else-if="submitted && (!$v.doctorData.first_name.minLength || !$v.doctorData.first_name.maxLength)"
                               class="invalid-feedback"> {{formTranslation.common.fname_validation_2}}
                          </div>
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="last_name" class="form-control-label">
                            {{formTranslation.common.lname}} <span class="text-danger">*</span>
                          </label>
                          <input id="last_name"
                                 :class="{ ' is-invalid': submitted && $v.doctorData.last_name.$error }"
                                 v-model="doctorData.last_name" :placeholder="formTranslation.doctor.lname_placeholder"
                                 required="required" name="name" type="text" class="form-control">
                          <div v-if="submitted && !$v.doctorData.last_name.required" class="invalid-feedback">
                            {{formTranslation.common.lname_required}}
                          </div>
                          <div v-else-if="submitted && (!$v.doctorData.last_name.minLength || !$v.doctorData.last_name.maxLength)"
                               class="invalid-feedback"> {{formTranslation.common.lname_validation_2}}
                          </div>
                        </div>
                      </div>

                    </div>

                    <div class="row">

                      <div class="col-lg-6">
                        <div class="form-group">
                          <label for="email" class="form-control-label">
                            {{formTranslation.common.email_address}} <span class="text-danger">*</span>
                          </label>
                          <input id="email"
                                 :class="{ ' is-invalid': submitted && $v.doctorData.user_email.$error }"
                                 v-model="doctorData.user_email" :placeholder="formTranslation.doctor.address_placeholder"
                                 required="required" name="email" type="email" class="form-control">
                          <div v-if="submitted && !$v.doctorData.user_email.required"
                               class="invalid-feedback">{{formTranslation.common.email_required}}
                          </div>
                          <div v-else-if="submitted && !$v.doctorData.user_email.emailValidate"
                               class="invalid-feedback">{{formTranslation.common.invalid_email}}
                          </div>
                        </div>
                      </div>

                      <div class="col-lg-6">
                        <div class="form-group">
                          <label for="telephone_no" class="form-control-label">
                            {{formTranslation.common.contact_no}} <span class="text-danger">*</span>
                          </label>
                          <VuePhoneNumberInput v-model="doctorData.mobile_number" id="telephone_no" clearable 
                          :default-country-code="defaultCountryCode" @update="contactUpdateHandaler" no-example>
                        </VuePhoneNumberInput>
                          <div v-if="submitted && !$v.doctorData.mobile_number.required"
                               class="invalid-feedback">{{formTranslation.common.contact_num_required}}
                          </div>
                          <div v-else-if="submitted && (!$v.doctorData.mobile_number.minLength || !$v.doctorData.mobile_number.maxLength )"
                               class="invalid-feedback">{{formTranslation.common.contact_validation_1}}
                          </div>
                          <!-- <div v-else-if="submitted && !$v.doctorData.mobile_number.phoneNumber"
                               class="invalid-feedback">{{formTranslation.common.contact_validation_2}}
                          </div> -->
                        </div>
                      </div>

                    </div>

                    <div class="row">

                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="doctor_birthdate" class="form-control-label">{{formTranslation.common.dob}}.
                            <!-- <span class="text-danger">*</span> -->
                          </label>
                          <input type="date" v-model="doctorData.dob" name="doc_birthdate" id="doc_birthdate" :max="new Date().toISOString().slice(0, 10)">
                          <!-- <vc-date-picker
                              id="doctor_birthdate"
                              title-position="left"
                              v-model="doctorData.dob"
                              :max-date="new Date().setFullYear(new Date().getFullYear() - 18)"
                              :popover="{ placement: 'bottom', visibility: 'click' }"
                          /> -->
                          <!-- :class="{ ' is-invalid': submitted && $v.doctorData.dob.$error }" -->
                          <!-- <div v-if="submitted && !$v.doctorData.dob.required" class="invalid-feedback">{{formTranslation.common.dob_required}}
                          </div> -->
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="gender" class="form-control-label">{{formTranslation.common.gender}} <span
                              class="text-danger">*</span></label>
                          <div class="col-sm-8" id="gender">
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
                            <div class="custom-control custom-radio custom-control-inline" v-if="defaultUserRegistrationFormSettingData === 'on'">
                              <input type="radio" id="other" name="gender" v-model="doctorData.gender"
                                     value="other" class="custom-control-input">
                              <label class="custom-control-label" for="other">{{formTranslation.common.other}}</label>
                            </div>
                          </div>
                          <div v-if="submitted && !$v.doctorData.gender.required" class="invalid-feedback">{{formTranslation.common.gender_required}}
                          </div>
                        </div>
                      </div>

                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="specialization" class="form-control-label">{{formTranslation.patient_front_widget.specialization}} <span
                              class="text-danger">*</span></label>
                          <multi-select
                              v-model="doctorData.specialties"
                              deselect-label=""
                              select-label=""
                              :tag-placeholder="formTranslation.doctor.tag_doc_sp_plh"
                              id="specialization"
                              :placeholder="formTranslation.doctor.search_placeholder"
                              :class="{ ' is-invalid': submitted && $v.doctorData.specialties.$error }"
                              label="label" track-by="id" :options="doctorSpecialization"
                              :multiple="true" :taggable="true"
                              :loading="specializationMultiselectLoader"
                              :disabled="specializationMultiselectLoader"

                          >

                          </multi-select>
                          <div v-if="submitted && !$v.doctorData.specialties.required" class="invalid-feedback">
                            {{formTranslation.doctor.doctor_specialization_required}}
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group">
                          <label for="signature" class="form-control-label">{{formTranslation.common.signature}}
                          </label>
                          <vueSignature h="100px" v-if="showCanvas" ref="signature" :sigOption="signatureOption"  :defaultUrl="doctorData.signature"></vueSignature>
                        </div>
                      </div>
                      <div class="col-md-2">
                        <div class="form-group">
                          <label for="signature" class="form-control-label">&nbsp
                          </label>
                          <button class="btn btn-secondary p-1" @click.prevent="$refs.signature.undo();">{{formTranslation.common.undo}}</button>
                          <button class="btn btn-primary p-1" @click.prevent="$refs.signature.clear()"> {{formTranslation.common.clear}}</button>
                        </div>
                      </div>
                      <div class="col-md-6"  v-if="$store.state.userDataModule.user.addOns.kiviPro!==false" >
                          <label for="choose_language" class="form-control-label">
                              {{formTranslation.common.choose_language}}
                          </label>

                          <multi-select
                              deselect-label=""
                              select-label=""
                              v-model="doctorData.choose_language"
                              id="choose_language"
                              :placeholder="formTranslation.common.choose_language"
                              label="label" track-by="lang" :options="kc_available_translations"
                              :multiple="false"
                          ></multi-select>
                        </div>
                    </div>

                  </div>

                  <hr class="my-4" />
                  <!-- Address -->

                  <h6 class="heading-small text-muted mb-4">{{formTranslation.common.contact_info}}</h6>

                  <div class="pl-lg-4">

                    <div class="row">

                      <div class="col-md-12">
                        <div class="form-group">
                          <label for="address" class="form-control-label">{{formTranslation.common.address}} </label>
                          <textarea
                              name="address" id="address" class="form-control"
                              v-model="doctorData.address" :placeholder="formTranslation.doctor.plh_clinic_address"></textarea>
                        </div>
                      </div>

                      

                    </div>

                    <div class="row">
                      <div class="col-md-4">
                        <div class="form-group">
                          <label for="city" class="form-control-label"> {{formTranslation.common.city}} </label>
                          <input id="city"
                                 v-model="doctorData.city"
                                 :placeholder="formTranslation.doctor.plh_enter_city"
                                 name="city" type="text"
                                 class="form-control">
                          <!-- :class="{ ' is-invalid': submitted && $v.doctorData.city.$error }" -->
                          <!-- <div v-if="submitted && !$v.doctorData.city.alphaSpace"
                               class="invalid-feedback"> {{formTranslation.common.city_validation_1}}
                          </div>
                          <div v-if="submitted && !$v.doctorData.city.maxLength"
                               class="invalid-feedback"> {{formTranslation.common.city_validation_2}}
                          </div> -->
                        </div>
                      </div>

                      <div class="col-lg-4">
                        <div class="form-group">
                          <label for="country" class="form-control-label"> {{formTranslation.common.country}} </label>
                          <!-- :class="{ ' is-invalid': submitted && $v.doctorData.country.$error }" -->
                          <input id="country"
                                 v-model="doctorData.country"
                                 :placeholder="formTranslation.doctor.plh_enter_country_name"
                                 name="country" type="text" class="form-control">
                          <!-- <div v-if="submitted && !$v.doctorData.country.alphaSpace"
                               class="invalid-feedback"> {{formTranslation.common.country_validation_1}}
                          </div>
                          <div v-if="submitted && !$v.doctorData.country.maxLength"
                               class="invalid-feedback"> {{formTranslation.common.country_validation_2}}
                          </div> -->
                        </div>
                      </div>
                      <div class="col-lg-4">
                        <div class="form-group">
                          <label for="postal_code" class=" form-control-label"> {{formTranslation.common.postal_code}} </label>
                          <!-- :class="{ ' is-invalid': submitted && $v.doctorData.postal_code.$error }" -->
                          <input id="postal_code"
                                 v-model="doctorData.postal_code" :placeholder="formTranslation.doctor.plh_enter_postal_code"
                                 name="postal_code" type="text" class="form-control">
                          <!-- <div v-if="submitted && (doctorData.postal_code !== '' && !$v.doctorData.postal_code.postalCode)"
                               class="invalid-feedback"> {{formTranslation.common.postal_code_validation_1}}
                          </div>
                          <div v-else-if="submitted && !$v.doctorData.postal_code.maxLength"
                               class="invalid-feedback"> {{formTranslation.common.postal_code_validation_2}}
                          </div> -->
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            <div class="card">
              <div class="card-header">
                <h3> {{formTranslation.doctor.qualification_information}} </h3>
              </div>
              <div class="card-body">

                <div class="row mb-4">
                  <div class="col-md-12">
                    <div class="table-responsive mb-0">
                      <table class="table table-sm text-center table-bordered custom-table">
                        <thead class="thead-light">
                        <tr>
                          <th>{{formTranslation.common.sr_no}}</th>
                          <th>{{formTranslation.doctor.degree}}</th>
                          <th>{{formTranslation.doctor.university}}</th>
                          <th>{{formTranslation.doctor.year}}</th>
                          <th>{{formTranslation.common.action}}</th>
                        </tr>
                        </thead>
                        <tbody v-if="doctorData.qualifications !== undefined  && doctorData.qualifications !== null">
                        <tr v-for="(qualification, index) in doctorData.qualifications" :key="index">
                          <td>{{ ++index }}</td>
                          <td>{{ qualification.degree }}</td>
                          <td>{{ qualification.university }}</td>
                          <td>{{ qualification.year }}</td>
                          <td>
                            <div class="btn-group">
                              <button type="button" v-b-tooltip.hover href="#" title="Edit" class="btn btn-sm btn-outline-primary" @click="editQualification(index)">
                                <i class="fa fa-pen-alt"></i>
                              </button>
                              <button type="button" v-b-tooltip.hover title="Delete" class="btn btn-outline-danger btn-sm" @click="deleteQualification(index)">
                                <i class="fa fa-trash"></i>
                              </button>
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
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <h6 class="heading-small text-muted mb-4">{{ qualificationTitle }}</h6>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="degree" class="form-control-label">{{formTranslation.doctor.degree}} <span class="text-danger">*</span></label>
                      <input id="degree"
                             :class="{ ' is-invalid': qualificationSubmitted && $v.qualification.degree.$error }"
                             v-model="qualification.degree" :placeholder="formTranslation.doctor.plh_enter_degree" name="degree"
                             type="text" class="form-control">
                      <div v-if="qualificationSubmitted && !$v.qualification.degree.required"
                           class="invalid-feedback">{{formTranslation.doctor.degree_required}}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="university" class="form-control-label">{{formTranslation.doctor.university}} <span class="text-danger">*</span></label>
                      <input id="university"
                             :class="{ ' is-invalid': qualificationSubmitted && $v.qualification.university.$error }"
                             v-model="qualification.university" :placeholder="formTranslation.doctor.plh_enter_university"
                             name="university" type="text" class="form-control">
                      <div v-if="qualificationSubmitted && !$v.qualification.university.required"
                           class="invalid-feedback">{{formTranslation.doctor.degree_required}}
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
                        <option value=""> {{formTranslation.doctor.select_year}}</option>
                        <option v-for="(year, index) in qualificationYears" :value="year" :key="index" >{{ year }}</option>
                      </b-select>
                      <div v-if="qualificationSubmitted && !$v.qualification.year.required"
                           class="invalid-feedback">{{formTranslation.doctor.year_required}}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <div class="float-right">
                      <button
                          class="btn btn-sm btn-primary"
                          type="button"
                          @click="addQualification"
                          v-html="qualificationBtn">
                      </button>
                    </div>
                  </div>
                </div>

              </div>
<!--              <hr v-if="(doctorData.enableTeleMed != null && doctorData.enableTeleMed.toString() === 'true') || userData.is_enable_googleMeet == 'on'"/>-->
<!--              <div class="ml-4" v-if="(doctorData.enableTeleMed != null && doctorData.enableTeleMed.toString() === 'true') || userData.is_enable_googleMeet == 'on'">-->
<!--                <div class="row">-->
<!--                  <div class="col-md-4">-->
<!--                    <h4 class="text-primary mb-3">{{formTranslation.doctor.consultation_fees}}</h4>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="row">-->
<!--                  <div  class="col-md-4">-->
<!--                    <div class="form-group">-->
<!--                      <label for="video_price" class="form-control-label">{{formTranslation.doctor.video_consultation_fees}}<span-->
<!--                          class="text-danger">*</span></label>-->
<!--                      <div>-->
<!--                        <input-->
<!--                            id="video_price"-->
<!--                            v-model="doctorData.video_price"-->
<!--                            placeholder="Enter fees" name="video_price"-->
<!--                            min="0"-->
<!--                            type="number"-->
<!--                            class="form-control"-->
<!--                        >-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
              <div v-if="showCustomField" class="ml-4">
                <hr class="my-4"/>
                <h6 class="heading-small text-muted mb-4">{{formTranslation.doctor.extra_detail}}</h6>
                <edit-custom-fields
                    module_type=""
                    :module_id="String(doctorData.ID)"
                    @bindCustomField="getCustomFieldsValues"
                    :fieldsValue="custom_fields !== undefined ? custom_fields : []"
                    :customFieldsObj="custom_fields !== undefined ? custom_fields : []"
                    @requiredCustomField="getRequireFields"
                ></edit-custom-fields>
              </div>
              <div class="card-footer">
                <div class="row">
                  <div class="col-md-12 pr-0">
                    <div class="d-flex justify-content-end">
                      <button v-if="!loading" class="btn btn-primary" type="submit"><i class="fa fa-save"></i> {{ formTranslation.common.save }}</button>
                      <button v-else class="btn btn-primary" type="submit" disabled> <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div class="card-body pt-0" v-for="(custom_form_data,key) in doctorData.custom_forms" :key="key" v-if="doctorData.custom_forms && doctorData.custom_forms.length">
            <div class="pl-lg-4">
              <CustomForm :data="customFormDataUpdate(custom_form_data,doctorData.ID)" :viewMode="false" :customFormModal="viewMode === 'custom_form_'+custom_form_data.id" v-if="viewMode === 'custom_form_'+custom_form_data.id" :useModal="false"></CustomForm>
            </div>
          </div>
          </div>
        </b-col>
        <b-col class="col-xl-3 order-xl-2">
          <div class="card card-profile">
            <!-- <div class="card-img-top" style="height: 100px;">
            </div> -->
            <div class="row justify-content-center mt-4">
              <div class="kivicare-avatar-upload">
                <div class="kivicare-avatar-edit">
                  <input  id="file" type="button"  class="p-2"
                          @click.prevent="uploadProfile()" style="color: transparent;">
                  <label for="file" v-b-tooltip.hover :title="formTranslation.clinic.edit_profile_img">
                    <i class="fas fa-pencil-alt fa-2x"></i>
                  </label>
                </div>
                <div class="kivicare-avatar-preview">
                  <div id="imagePreview" :style="'background-image: url('+ ( profileImage)+');'">
                  </div>
                </div>
              </div>
              <!-- <div class="col-lg-3 order-lg-2"> -->
              <!-- <div class="card-profile-image"> -->
              <!-- <a href="#"> -->
              <!-- <img alt="img" style="height: 180px ;width: 150px" class="rounded-circle" :src="doctorData.profile_photo ? doctorData.profile_photo : profileImage"> -->
              <!-- <img :src="profileImage" style="height: 150px ;width: 150px" class="rounded-circle" /> -->
              <!-- </a> -->
              <!-- </div> -->
              <!-- </div> -->
            </div>
            <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
            </div>
            <div class="card-body pt-0 mt-2">
              <div class="text-center">
                <h5 class="h3">
                  {{ doctorData.display_name }}
                </h5>
                <div class="h5 font-weight-300">
                  {{ doctorData.user_email }}
                </div>
                <div class="h5 mt-4">
                  {{  doctorData.specialties | clinicSpecialityFormat }}
                </div>
                <div  v-if="userData.addOns.kiviPro == true && doctorData.rating > 0">
                  <i class="kivi-star" :data-star="doctorData.rating"></i>
                  <div class="row">
                    <div class="text-center col-sm-12 col-md-12 col-lg-12 pt-1">
                      {{ doctorData.total_rating + ' ' +formTranslation.appointments.ratings }}
                    </div>
                    <div class="text-center col-sm-12 col-md-12 col-lg-12 pt-1">
                      <button class="btn btn-sm btn-primary" @click="select_doctor_id = doctorData.ID;appointmentReviewModal=true">
                        {{formTranslation.appointments.ratings + ' ' + formTranslation.common.detail }}
                      </button>
                    </div>
                  </div>
                </div>
                <!-- <div>
                    <input type="file" id="file" ref="file" class="form-control" v-on:change="uploadProfile()" multiple/>
                </div> -->
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
</template>
<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import CustomForm from '../CustomForm/Form.vue'
import {
    required,
    numeric,
    requiredIf,
    alpha,
    minLength,
    maxLength,
    minValue,
    maxValue
} from "vuelidate/lib/validators";
import { post, get } from "../../config/request";
import vueSignature from "vue-signature"
import AppointmentReviewCard from "../../components/appointment/AppointmentReviewCard";
import {alphaSpace, minimumValue, objToTime, phoneNumber, postalCode, validateForm, emailValidate} from "../../config/helper";
    export default {
      components:{
        vueSignature,
        AppointmentReviewCard,
        VuePhoneNumberInput,
        CustomForm
      },
        data: () => {
            return {
                isEditProfile: false,
                doctorData: {},
                loading: false,
                submitted: false,
                qualificationSubmitted: false,
                cardTitle: 'Edit Profile',
                doctorTimeSlot: "",
                buttonText: '<i class="fa fa-plus"></i> Add',
                editProfileBtnText: '<i class="fa fa-pen-fancy"></i> Edit Profile',
                qualification: {},
                qualificationTitle: 'Add Qualification',
                qualificationBtn: '<i class="fa fa-plus"></i> Add qualification',
                qualificationEdit: false,
                qualificationYears: [],
                price_type: ['range', 'fixed'],
                timeSlots: [],
                customFields: [],
                profileImage: '',
                enableTeleMed: false,
              formLoader:true,
              signatureOption:{
                penColor:"rgb(0, 0, 0)",
                backgroundColor:"rgb(220,220,220)"
              },
              showCanvas:false,
              showCustomField:false,
              custom_fields:[],
              select_doctor_id:0,
              appointmentReviewModal:false,
              defaultCountryCode: null,
              requiredFields: [],
              defaultUserRegistrationFormSettingData: 'on',
              viewMode:'editProfile'
            }
        },
        mounted() {
            this.getCountryCodeData();
            this.getUserRegistrationFormData();
            this.doctorData = this.defaultDoctorData();
            this.qualification = this.defaultQualification();
            this.qualificationYears = this.getQualificationYear();
            this.init();
            this.profileImage = window.request_data.kiviCarePluginURL + 'assets/images/kc-demo-img.png';
        },
        validations: {
            doctorData: {
                first_name: {
                    required,
                    minLength: minLength(2),
                    maxLength: maxLength(15)
                },
                last_name: {
                    required,
                    minLength: minLength(2),
                    maxLength: maxLength(15)
                },
                user_email: {
                    required,
                    emailValidate
                },
                gender:{
                    required
                },
                mobile_number: {
                    required,
                    // phoneNumber,
                    minLength: minLength(4),
                    maxLength: maxLength(15)
                },
                specialties: {required},
                // state: {
                //     alphaSpace,
                //     maxLength: maxLength(30)
                // },
                // city: {
                //     alphaSpace,
                //     maxLength: maxLength(30)
                // },
                // country: {
                //     alphaSpace,
                //     maxLength: maxLength(30)
                // },
                // postal_code: {
                //     postalCode,
                //     maxLength: maxLength(12)
                // },
                // dob: {required}
            },
            qualification: {
                degree: {required},
                university: {required},
                year: {required}
            },
        },
        filters: {
            clinicSpecialityFormat: function (Speciality) {
                let doctors = Speciality
                let result = [] ;
                if (doctors != undefined && doctors.length > 0)
                {
                    doctors.forEach(function (doctor) {
                        result.push(doctor.label);
                    });
                    let implodedArray = result.join(' , ');
                    return implodedArray ;
                } else {
                    return "No" ;
                }
            },
            dateFormat: function (date) {
                return moment(date).format("YYYY-MM-DD") ;
            }
        },
        methods: {
            contactUpdateHandaler: function (val) {
              this.doctorData.country_code = val.countryCode;
              this.doctorData.country_calling_code = val.countryCallingCode;
            },
            init: function () {
              this.qualificationTitle= this.formTranslation.doctor.add_qualification
              this.qualificationBtn= '<i class="fa fa-plus"></i> '+this.formTranslation.doctor.add_qualification

                if (this.$store.state.userDataModule.user.ID !== undefined) {
                    let profileID  =  this.$store.state.userDataModule.user.ID ;
                    this.editProfileData(profileID);
                } else {
                    this.$store.dispatch("userDataModule/fetchUserData", {});
                    setTimeout(() => {
                        let profileID = this.$store.state.userDataModule.user.ID
                        this.editProfileData(profileID);
                    }, 1000);
                }

                this.getTimeSlots();

            },
            handleTimeSlotChange : function () {
                if (this.doctorData.time_slot !== parseInt(this.doctorTimeSlot)) {
                    displayAlert('Warning!', this.formTranslation.doctor.change_time_will_effect)
                }
            },
            getCustomFieldsValues: function (fieldsObj) {
                if(!fieldsObj || fieldsObj === undefined){
                    return false;
                }
                this.doctorData.custom_fields = fieldsObj;
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
                this.qualificationTitle = this.formTranslation.doctor.add_qualification;
                this.qualificationBtn = '<i class="fa fa-plus"></i> '+this.formTranslation.doctor.add_qualification;
                this.qualification = this.defaultQualification();
                this.qualificationSubmitted = false;
            },
            getTimeSlot: function (startTime, endTime, doctor) {
                var timeSlotDiff = (doctor !== null && doctor.timeSlot !== undefined) ? doctor.timeSlot : "" ;
                var newTimeSlot = "";
                let slots = [];

                if (startTime.HH !== "" && startTime.mm !== "" && endTime.HH !== "" && endTime.mm !== "" && timeSlotDiff !== "") {

                    let sessionOneStartTime = objToTime(startTime);
                    let sessionOneEndTime = objToTime(endTime);

                    let timeDiff = sessionOneEndTime.diff(sessionOneStartTime, 'minutes');

                    let loopCount = Math.ceil(timeDiff/ timeSlotDiff);

                    for (let i = 0;i <= loopCount; i++) {

                        if (i === 0) {
                            newTimeSlot = sessionOneStartTime.format("HH:mm");
                        } else {
                            newTimeSlot = moment(newTimeSlot, 'HH:mm').add(timeSlotDiff, 'minutes').format('HH:mm')
                        }

                        let temp = {
                            time: newTimeSlot,
                            isValid: true,
                            timeSlotDiff: timeSlotDiff
                        }

                        if (moment(newTimeSlot, 'HH:mm').isAfter(sessionOneEndTime)) {
                            let timeDiff = moment(newTimeSlot, 'HH:mm').diff(sessionOneEndTime, 'minutes')
                            temp.isValid = false;
                            temp.timeSlotDiff =  Math.abs(timeSlotDiff - timeDiff)

                        }

                        slots.push(temp);
                    }
                }
                return slots;
            },
            editQualification: function (index) {
                this.qualificationTitle =this.formTranslation.doctor.edit_qualification;
                this.qualificationEdit = true;
                this.qualificationBtn = '<i class="fa fa-save"></i> '+this.formTranslation.doctor.save_qualification;
                this.qualification = this.doctorData.qualifications[index - 1];
            },
            deleteQualification: function (index) {
                if (this.doctorData.qualifications[index - 1] !== undefined) {
                    $.confirm({
                        title: this.formTranslation.clinic_schedule.dt_are_you_sure,
                        content: this.formTranslation.clinic_schedule.dt_press_dlt,
                        type: 'red',
                        buttons: {
                            ok: {
                                text: this.formTranslation.common.yes,
                                btnClass: 'btn-danger',
                                keys: ['enter'],
                                action: () => {
                                    if (this.doctorData.qualifications[index - 1] !== undefined) {
                                        this.doctorData.qualifications.splice((index - 1), 1);
                                    }
                                }
                            },
                            cancel: {
                                text:this.formTranslation.common.cancel
                            }
                        }
                    });
                }
            },
            defaultDoctorData: function () {
                return {
                    first_name: '',
                    last_name: '',
                    username: '',
                    user_email: '',
                    user_pass: '',
                    country_calling_code: '',
                    country_code: '',
                    mobile_number: '',
                    gender: this.formTranslation.common.male,
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
                    user_status: 0,
                    signature:"",
                    rating:0,
                    total_rating:0,
                    profile_image:''
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
            handleSubmit: function () {

              if(!this.$refs.signature.isEmpty()){
                this.doctorData.signature = this.$refs.signature.save('image/svg+xml');
              }
                this.loading = true;

                this.submitted = true;

                // stop here if form is invalid
                this.$v.$touch();
                this.$nextTick(() => {
                  if (document.querySelector('.is-invalid') !== null && document.querySelector('.is-invalid') !== undefined) {
                    document.querySelector('.is-invalid').scrollIntoView({block: "center", behavior: "smooth"})
                  } else if (document.querySelector('.invalid-feedback') !== null && document.querySelector('.invalid-feedback') !== undefined) {
                    document.querySelector('.invalid-feedback').scrollIntoView({block: "center", behavior: "smooth"})
                  }
                })
                if (this.$v.doctorData.$invalid) {
                    this.loading = false;
                    return;
                }

                if (this.requiredFields.length > 0) {
                  this.loading = false;
                  displayErrorMessage(this.formTranslation.common.all_required_field_validation)
                  return;
                }

                if (validateForm("doctorDataForm")) {
                    post('doctor_save', this.doctorData)
                        .then((response) => {
                            this.loading = false;
                            if (response.data.status !== undefined && response.data.status === true) {
                                // this.doctorData.dob =  new Date(moment(this.doctorData.dob ).format("YYYY-MM-DD"));
                                if(response.data.choose_language_updated){
                                  this.$store.dispatch("staticDataModule/refreshDashboardLocale", {self: this}) 
                                }
                                displayMessage(response.data.message);
                                this.isEditProfile = false
                            } else {
                                // this.doctorData.dob =  new Date(moment(this.doctorData.dob ).format("YYYY-MM-DD"));
                                displayErrorMessage(response.data.message)
                            }
                        })
                        .catch((error) => {
                            // this.doctorData.dob =  new Date(moment(this.doctorData.dob ).format("YYYY-MM-DD"));
                            console.log(error);
                            this.loading = false;
                            displayErrorMessage(this.formTranslation.common.internal_server_error)
                        })
                }
            },
            getQualificationYear: function () {
                let years = [];
                let d = new Date();
                let x = d.getFullYear();
                for (let i = 1940; i <= x; i++) {
                    years.push(i);
                }

                return years.reverse();
            },
            editProfileData: function (editId) {
                if(editId !== undefined) {
                    this.cardTitle = this.formTranslation.doctor.edit_profile;
                    this.buttonText = '<i class="fa fa-save"></i> '+this.formTranslation.common.save;
                    this.formLoader = true;
                    get('doctor_edit', {
                        id: editId
                    })
                        .then((response) => {
                            if (response.data.status !== undefined && response.data.status === true) {
                              this.doctorData = response.data.data;
                              if (response.data.data.country_calling_code !== '' && response.data.data.country_calling_code !== undefined) {
                                this.defaultCountryCode = response.data.data.country_code;
                              }
                              this.doctorTimeSlot = this.doctorData.time_slot;
                              this.isEditProfile = false ;
                              // this.doctorData.dob = new Date(this.doctorData.dob + ' 00:00');
                              if (this.doctorData.user_profile) {
                                // this.doctorData.profile_photo = this.doctorData.user_profile
                                this.profileImage = this.doctorData.user_profile
                              }
                              if( response.data.custom_filed !== undefined &&  response.data.custom_filed.length > 0){
                                this.showCustomField = true;
                                this.custom_fields = response.data.custom_filed
                              }
                                this.doctorData.choose_language = this.kc_available_translations.find(el => el.lang === response.data.data.choose_language )
                            }
                            this.formLoader = false;
                            this.showCanvas = true;
                        })
                        .catch((error) => {
                          this.formLoader = false;
                            console.log(error);
                            displayErrorMessage(this.formTranslation.widgets.record_not_found);
                        })
                } else {
                    displayErrorMessage(this.formTranslation.widgets.login_user_not_found);
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
            handleResetCharge: function () {
                if (this.doctorData.price_type === "range") {
                    this.doctorData.price = 0;
                } else {
                    this.doctorData.minPrice = 0;
                    this.doctorData.maxPrice = 0;
                }
            },
          uploadProfile() {
            let _this = this;

            var custom_uploader = kivicareCustomImageUploader(this.formTranslation);

            custom_uploader.on('select', function () {
              var attachment = custom_uploader.state().get('selection').first().toJSON();
              _this.profileImage = attachment.url;
              _this.doctorData.profile_image = attachment.id;
            });

            //Open the uploader dialog
            custom_uploader.open();

          },
          getRequireFields: function (validateRequired) {
              this.requiredFields = validateRequired;
          },
          getCountryCodeData: function () {
            get('get_country_code_settings_data', {})
              .then((response) => {
                if (response.data.status !== undefined && response.data.status === true) {
                  this.defaultCountryCode = response.data.data.country_code;
                }
              })
              .catch((error) => {
                console.log(error);
                displayErrorMessage(this.formTranslation.common.internal_server_error);
              })
          },
          getRequireFields: function (validateRequired) {
            this.requiredFields = validateRequired;
          },
          getUserRegistrationFormData: function () {
            get('get_user_registration_form_settings_data', {})
              .then((response) => {
                if (response.data.status !== undefined && response.data.status === true) {
                    this.defaultUserRegistrationFormSettingData = response.data.data.userRegistrationFormSettingData;
                }
              })
              .catch((error) => {
                console.log(error);
                displayErrorMessage(this.formTranslation.common.internal_server_error);
              })
          },
          customFormDataUpdate(custom_form_data,id){
            custom_form_data.module_id = id;
            return custom_form_data;
          }
        },
        computed: {
            userData() {
                return this.$store.state.userDataModule.user;
            },
          doctorSpecialization(){
            return this.$store.state.staticDataModule.static_data.specialization
          },
          specializationMultiselectLoader(){
            return this.$store.state.staticDataModule.static_data_loader
          },
          kc_available_translations () {
            return this.$store.state.userDataModule.user.kc_available_translations;
          }
        }
    }
</script>
<style >
    #doctor_profile [type="date"] {
    background:#fff url(https://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/calendar_2.png)  97% 50% no-repeat ;
    }
    #doctor_profile [type="date"]::-webkit-inner-spin-button {
    display: none;
    }
    #doctor_profile [type="date"]::-webkit-calendar-picker-indicator {
    opacity: 0;
    }
    #doctor_profile label {
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
    
#doctor_profile .nav.nav-tabs{
    margin-bottom: 1rem;
}
#doctor_profile .nav-tabs .nav-link.active{
    color: var(--primary);
    /* border-top-color: var(--primary);
    border-left-color: var(--primary);
    border-right-color: var(--primary); */
}
#doctor_profile  .nav-tabs .nav-link{
    font-size: 1rem;
    font-weight: 400;
    background-color:#fff;
    border-bottom-color: #dee2e6;
}
</style>