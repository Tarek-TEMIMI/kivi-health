<template>
  <b-row>
    <div class="page-loader-section" v-if="formLoader">
      <loader-component-2></loader-component-2>
    </div>
    <b-col v-else sm="12">
      <form 
          id="doctorDataForm" 
          name="doctorDataForm" @submit.prevent="handleSubmit" :novalidate="true"
          enctype="multipart/form-data">
          <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
            <template v-slot:header>
              <b-row>
                <b-col sm="12" md="8" lg="8">
                  <h3 class="mb-0">{{$route.params.id ? formTranslation.doctor.edit_doctor : formTranslation.doctor.add_doctor}}</h3>
                </b-col>
                <b-col sm="12" md="4" lg="4">
                  <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-sm btn-primary" @click="$router.go(-1);">
                      <i class="fa fa-angle-double-left"></i> {{formTranslation.common.back}}
                    </button>
                  </div>
                </b-col>
              </b-row>
            </template>
            <div class="row">
              <div class="col-md-12">
                <h2 class="text-primary mb-4">{{formTranslation.common.basic_details}}</h2>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label for="first_name" class="form-control-label">{{formTranslation.common.fname}}<span
                      class="text-danger">*</span></label>
                  <input
                      id="first_name"
                      :class="{ ' is-invalid': submitted && $v.doctorData.first_name.$error }"
                      v-model="doctorData.first_name"
                      :placeholder="formTranslation.doctor.doctor_name"
                      required="required"
                      name="first_name"
                      type="text"
                      class="form-control">
                  <div v-if="submitted && !$v.doctorData.first_name.required"
                      class="invalid-feedback">{{formTranslation.common.fname_required}}
                  </div>
                  <!-- <div
                      v-else-if="submitted && (!$v.doctorData.first_name.minLength || !$v.doctorData.first_name.maxLength)"
                      class="invalid-feedback"> {{formTranslation.common.fname_validation_2}}
                  </div> -->
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="last_name" class="form-control-label">
                    {{formTranslation.common.lname}}<span class="text-danger">*</span>
                  </label>
                  <input id="last_name"
                        :class="{ ' is-invalid': submitted && $v.doctorData.last_name.$error }"
                        v-model="doctorData.last_name" 
                        :placeholder="formTranslation.doctor.lname_placeholder"
                        required="required" name="last_name" type="text" class="form-control">
                  <div v-if="submitted && !$v.doctorData.last_name.required" class="invalid-feedback">
                    {{formTranslation.common.lname_required}}
                  </div>
                  <div
                      v-else-if="submitted && (!$v.doctorData.last_name.minLength || !$v.doctorData.last_name.maxLength)"
                      class="invalid-feedback"> {{formTranslation.common.lname_validation_2}}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="email" class="form-control-label">{{formTranslation.common.email}} <span
                      class="text-danger">*</span></label>
                  <input id="email"
                        :class="{ ' is-invalid': submitted && $v.doctorData.user_email.$error }"
                        v-model="doctorData.user_email" 
                        :placeholder="formTranslation.doctor.email_placeholder"
                        required="required" name="user_email" type="text" class="form-control">
                  <div v-if="submitted && !$v.doctorData.user_email.required"
                      class="invalid-feedback">{{formTranslation.common.email_required}}
                  </div>
                  <div v-else-if="submitted && !$v.doctorData.user_email.emailValidate"
                      class="invalid-feedback">{{formTranslation.common.invalid_email}}
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div v-if="userData.addOns.kiviPro == true && getUserRole() == 'administrator'" class="col-md-4">
                <div class="form-group" >
                    <label for="doctor_id" class="form-control-label">
                          {{formTranslation.clinic.select_clinic}} <span class="text-danger">*</span>
                      </label>
                    <multi-select
                          deselect-label=""
                          select-label=""
                          v-model="doctorData.clinic_id"
                          :tag-placeholder="formTranslation.doctor.tag_select_clinic_plh" id="clinic_id"
                          :placeholder="formTranslation.doctor.search_placeholder"
                          label="label"
                          track-by="id" :options="clinics"
                          :multiple="true"
                          :taggable="true"
                          :loading="clinicMultiselectLoader"
                      ></multi-select>
                  <div v-if="submitted && !$v.doctorData.clinic_id.required"
                       class="invalid-feedback">{{formTranslation.common.clinic_is_required}}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="mobile_number" class="form-control-label">{{formTranslation.common.contact_no}} <span
                      class="text-danger">*</span>
                  </label>
                  <VuePhoneNumberInput v-model=" doctorData.mobile_number " id="mobile_number"
                  @update=" contactUpdateHandaler " :default-country-code=" defaultCountryCode " clearable 
                  no-example></VuePhoneNumberInput>
                  <div v-if="submitted && !$v.doctorData.mobile_number.required" class="invalid-feedback">
                    {{formTranslation.common.contact_num_required}}
                  </div>
                  <div v-else-if="submitted && (!$v.doctorData.mobile_number.minLength || !$v.doctorData.mobile_number.maxLength )"
                    class="invalid-feedback">{{formTranslation.common.contact_validation_1}}
                  </div>
                  <!-- <div v-else-if="submitted && !$v.doctorData.mobile_number.phoneNumber"
                      class="invalid-feedback">{{formTranslation.common.contact_validation_2}}
                  </div> -->
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="dob" class="form-control-label">{{formTranslation.common.dob}}. 
                    <!-- <span class="text-danger">*</span> -->
                    </label>
                    <input type="date" v-model="doctorData.dob" name="doc_birthdate" id="doc_birthdate" :max="new Date().toISOString().slice(0, 10)">
                      <!-- :class="{ ' is-invalid': submitted && $v.doctorData.dob.$error }" -->
                  <!-- <vc-date-picker
                      id="doc_birthdate"
                      title-position="left"
                      v-model="doctorData.dob"
                      :max-date="new Date().setFullYear(new Date().getFullYear() - 18)"
                      :placeholder="formTranslation.doctor.welcome_date_plh"
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
                  <!-- <div v-if="submitted && !$v.doctorData.dob.required" class="invalid-feedback">
                    {{formTranslation.common.dob_required}}
                  </div> -->
                </div>
              </div>
            </div>

            <div class="row"> 
              <div class="col-md-8"> 
                <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="specialization" class="form-control-label">{{formTranslation.patient_front_widget.specialization}} <span
                            class="text-danger">*</span></label>
                        <multi-select
                            deselect-label=""
                            select-label=""
                            v-model="doctorData.specialties"
                            id="specialization"
                            :tag-placeholder="formTranslation.doctor.tag_doc_sp_plh" 
                            :placeholder="formTranslation.doctor.add_sp_plh"
                            label="label" track-by="id"
                            :class="{ ' is-invalid': submitted && $v.doctorData.specialties.$error }"
                            :options="doctorSpecialization"
                            :multiple="true"
                            @tag="addNewSpecialization"
                            :taggable="true"
                            :loading="specializationMultiselectLoader"
                        >
                        </multi-select>
                        <span class="text-primary small font-weight-bold">{{formTranslation.clinic.note_specialization}}</span>
                        <div v-if="submitted && !$v.doctorData.specialties.required" class="invalid-feedback">
                          {{formTranslation.doctor.doctor_specialization_required}}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="no_of_experience" class="form-control-label">{{formTranslation.doctor.experience_year}} </label>
                        <input type="number" name="no_of_experience" id="no_of_experience" class="form-control"
                              v-model="doctorData.no_of_experience" 
                              :placeholder="formTranslation.doctor.experience_plh">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="gender" class="form-control-label">{{formTranslation.common.gender}} <span
                            class="text-danger">*</span></label>
                        <div class="col-md-12">
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
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="status" class="form-control-label">
                          {{formTranslation.common.status}} <span class="text-danger">*</span>
                        </label>
                        <b-select
                            name="status"
                            v-model="doctorData.user_status"
                            id="status"
                            class="form-control"
                            :class="{ ' is-invalid': submitted && $v.doctorData.user_status.$error }"
                        >
                          <option value=""> {{formTranslation.appointments.select_status}}</option>
                          <option value="0"> {{formTranslation.common.active}}</option>
                          <option value="1"> {{formTranslation.common.inactive}}</option>
                        </b-select>
                        <div v-if="submitted && !$v.doctorData.user_status.required" class="invalid-feedback">
                          {{formTranslation.appointments.status_required}}
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              <!-- profil image upload -->
              <div class="col-md-4"> 
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                    <!-- <label class="form-control-label">  {{ formTranslation.receptionist.upload_profile }} </label> -->
                      <div class="kivicare-avatar-upload">
                        <div class="kivicare-avatar-edit">
                            <input  id="file" type="button"  class="p-2"
                                      @click.prevent="uploadProfile()" style="color: transparent;">
                            <label for="file" v-b-tooltip.hover :title="formTranslation.clinic.edit_profile_img">
                              <i class="fas fa-pencil-alt fa-2x"></i>
                              </label>
                        </div>
                        <div class="kivicare-avatar-preview">
                            <div id="imagePreview" :style="'background-image: url('+ (imagePreview)+');'">
                            </div>
                        </div>
                      </div>
                      <!-- <label class="form-control-label">  {{ formTranslation.receptionist.upload_profile }} </label>
                      <input type="file" id="file" ref="file" class="form-control" v-on:change="uploadProfile()"/> -->
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label for="signature" class="form-control-label">{{formTranslation.common.signature}}
                  </label>
                  <vueSignature h="100px" v-if="showCanvas" ref="signature" :sigOption="signatureOption"  :defaultUrl="doctorData.signature"></vueSignature>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="signature" class="form-control-label">&nbsp
                  </label>
                  <button class="btn btn-secondary" @click.prevent="$refs.signature.undo();">{{formTranslation.common.undo}}</button>
                  <button class="btn btn-primary" @click.prevent="$refs.signature.clear()"> {{formTranslation.common.clear}}</button>
                </div>
              </div>
            </div>
            <hr/>

            <!-- text editor  -->
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="description" class="form-control-label">{{formTranslation.appointments.description}}
                  </label>
                  <vue-editor
                      v-model="doctorData.description"
                  ></vue-editor>
                </div>
              </div>
            </div>

            <hr/>
            <div class="row">
              <div class="col-md-12">
                <h4 class="text-primary mb-4">{{formTranslation.doctor.address_details}}</h4>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="address" class="form-control-label">{{formTranslation.common.address}}</label>
                  <textarea name="address" id="address" class="form-control"
                            v-model="doctorData.address" 
                            :placeholder="formTranslation.doctor.address_placeholder"></textarea>
                </div>
              </div>

            </div>

            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label for="country" class="form-control-label">{{formTranslation.common.country}} </label>
                  <input id="country"
                        v-model="doctorData.country" 
                        :placeholder="formTranslation.doctor.country_placeholder" name="country"
                        type="text" class="form-control">
                  
                  <!-- <div v-if="submitted && !$v.doctorData.country.maxLength"
                      class="invalid-feedback"> {{formTranslation.common.country_validation_2}}
                  </div> -->
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="city" class="form-control-label">{{formTranslation.common.city}}</label>
                  <input id="city"
                        v-model="doctorData.city" 
                        :placeholder="formTranslation.doctor.city_placeholder" name="city" type="text"
                        class="form-control">
                        <!-- :class="{ ' is-invalid': submitted && $v.doctorData.city.$error }" -->
                  
                  <!-- <div v-if="submitted && !$v.doctorData.city.maxLength"
                      class="invalid-feedback"> {{formTranslation.common.city_validation_2}}
                  </div> -->
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="postal_code" class="form-control-label">{{formTranslation.common.postal_code}}</label>
                  <input
                      id="postal_code"
                      v-model="doctorData.postal_code"
                      :placeholder="formTranslation.doctor.pcode_placeholder"
                      name="postal_code"
                      type="text"
                      class="form-control">
                      <!-- :class="{ ' is-invalid': submitted && $v.doctorData.postal_code.$error }" -->
                  <!-- <div v-if="submitted && !$v.doctorData.postal_code.maxLength"
                      class="invalid-feedback"> {{formTranslation.common.postal_code_validation_2}}
                  </div> -->
                </div>
              </div>
            </div>
            <hr/>
            <div class="row">
              <div class="col-md-8">
                <h4 class="text-primary mb-3">{{ qualificationTitle }}</h4>
              </div>
              <b-col sm="12" md="4" lg="4">
                <div class="d-flex justify-content-end">
                  <button v-b-toggle.qualification-add-tab
                          class="btn btn-sm btn-primary"
                          type="button"
                          v-html="qualificationBtn">
                  </button>
                </div>
              </b-col>
            </div>

            <b-collapse id="qualification-add-tab" class="mt-2">
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="degree" class="form-control-label">{{formTranslation.doctor.degree}} <span class="text-danger">*</span></label>
                    <input id="degree"
                          :class="{ ' is-invalid': qualificationSubmitted && $v.qualification.degree.$error }"
                          v-model="qualification.degree" 
                          :placeholder="formTranslation.doctor.degree_plh" name="degree"
                          type="text" class="form-control">
                    <div v-if="qualificationSubmitted && !$v.qualification.degree.required"
                        class="invalid-feedback">{{formTranslation.doctor.degree_required}}
                    </div>
                  
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="university" class="form-control-label">{{formTranslation.doctor.university}}<span
                        class="text-danger">*</span></label>
                    <input id="university"
                          :class="{ ' is-invalid': qualificationSubmitted && $v.qualification.university.$error }"
                          v-model="qualification.university" 
                          :placeholder="formTranslation.doctor.university_plh"
                          name="university" type="text" class="form-control">
                    <div v-if="qualificationSubmitted && !$v.qualification.university.required"
                        class="invalid-feedback">{{formTranslation.doctor.university_required}}
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
                <div class="d-flex justify-content-end">
                  <button v-if="!loading" class="btn btn-sm btn-primary" type="button"
                            @click="addQualification">
                                <i class="fa fa-save"></i> {{ formTranslation.common.save }}
                    </button>
                  <button v-else class="btn btn-sm btn-primary" type="button" disabled>
                    <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                  </button>
                  <button type="button" v-b-toggle.qualification-add-tab class="btn btn-sm btn-outline-primary"> {{formTranslation.common.cancel}}</button>
                </div>
              </div>
            </div>
            </b-collapse>
            <div class="row mb-4 mt-3">
              <div class="col-md-12">
                <div class="table-responsive mb-0">
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
                    <tbody
                        v-if="doctorData.qualifications !== undefined && doctorData.qualifications.length > 0">
                    <tr v-for="(qualification, index) in doctorData.qualifications" :key="index">
                      <td>{{ ++index }}</td>
                      <td>{{ qualification.degree }}</td>
                      <td>{{ qualification.university }}</td>
                      <td>{{ qualification.year }}</td>
                      <td>
                        <div class="btn-group">
                          <button type="button" href="#" v-b-tooltip.hover :title="formTranslation.common.edit"
                                  class="btn btn-sm btn-outline-primary"
                                  @click="editQualification(index)">
                            <i class="fa fa-pen-alt"></i>
                          </button>
                          <button type="button" v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt"
                                  class="btn btn-outline-danger btn-sm"
                                  @click="deleteQualification(index)">
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
            <div class="row" v-if="teleMedEn">
              <div class="col-md-12">
                <hr class="my-4">
                <!-- <div class="row">
                  <div class="col-md-5">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group">
                          <h4 class="text-primary mb-3"> {{formTranslation.common.telemed}} </h4>
                          <b-form-checkbox size="lg"
                            v-model="doctorData.enableTeleMed" name="check-button" switch>
                            <span style="top: 0px !important;"><small>( {{ formTranslation.common.status + ':' + ([true,'true'].includes(doctorData.enableTeleMed) ? "On" : "Off") }})</small></span>
                          </b-form-checkbox>
                        </div>
                      </div>
                      <div class="col-md-12" v-if="[true,'true'].includes(doctorData.enableTeleMed)">
                        <div class="row">
                          <div class="col-md-12">
                            <div class="form-group">
                              <label for="api_key" class="form-control-label">{{formTranslation.doctor.api_key}} <span class="text-danger">*</span></label>
                              <input type="text" id="api_key" 
                              :placeholder="formTranslation.doctor.API_key_plh"
                                    class="form-control" 
                                    :class="{ ' is-invalid': submitted && $v.doctorData.api_key.$error }"
                                    name="api_key"
                                    v-model="doctorData.api_key"/>
                              <div v-if="submitted && !$v.doctorData.api_key.required"
                                  class="invalid-feedback">{{formTranslation.doctor.api_key_required}}
                              </div>
                            </div>
                          </div>
                          <div class="col-md-12">
                            <div class="form-group">
                              <label for="api_secret" class="form-control-label">{{formTranslation.doctor.api_secret}} <span class="text-danger">*</span></label>
                              <input type="text" id="api_secret"
                                    :placeholder="formTranslation.doctor.API_secret_plh"
                                    class="form-control" name="api_secret"
                                    :class="{ ' is-invalid': submitted && $v.doctorData.api_secret.$error }"
                                    v-model="doctorData.api_secret"/>
                              <div v-if="submitted && !$v.doctorData.api_secret.required"
                                  class="invalid-feedback">{{formTranslation.doctor.api_secret_required}}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-7" v-if="[true,'true'].includes(doctorData.enableTeleMed)">
                    <div class="row">
                      <div class="col-md-12">
                        <h4 class="text-primary mb-3">{{formTranslation.doctor.zoom_configuration_guide}}</h4>
                      </div>
                    </div>
                    <b-list-group>
                      <b-list-group-item>{{formTranslation.doctor.zoom_step1}} <a href="https://marketplace.zoom.us/"
                                                                              target="_blank"> {{formTranslation.doctor.zoom_market_place_portal}}</a></b-list-group-item>
                      <b-list-group-item>{{formTranslation.doctor.zoom_step2}}
                        <a href="https://marketplace.zoom.us/develop/create" target="_blank">{{formTranslation.doctor.create_app}}</a>
                      </b-list-group-item>
                      <b-list-group-item>{{formTranslation.doctor.zoom_step3}}</b-list-group-item>
                      <b-list-group-item>{{formTranslation.doctor.zoom_step4}}
                      </b-list-group-item>
                      <b-list-group-item>{{formTranslation.doctor.zoom_step5}}
                      </b-list-group-item>
                    </b-list-group>
                  </div>
                </div> -->
              </div>
            </div>
<!--            <hr v-if="[true,'true'].includes(doctorData.enableTeleMed) || doctorData.is_enable_doctor_gmeet"/>-->
<!--            <div class="row" v-if="[true,'true'].includes(doctorData.enableTeleMed) || doctorData.is_enable_doctor_gmeet" >-->
<!--              <div class="col-md-12">-->
<!--                <h4 class="text-primary mb-3">{{formTranslation.doctor.consultation_fees}} <span class="text-danger">*</span></h4>-->
<!--              </div>-->
<!--              <div  class="col-md-4">-->
<!--                <div class="form-group">-->
<!--                  <label for="video_price" class="form-control-label">{{formTranslation.doctor.video_consultation_fees}}<span-->
<!--                      class="text-danger"></span></label>-->
<!--                  <div>-->
<!--                    <input-->
<!--                      id="video_price"-->
<!--                      v-model="doctorData.video_price" placeholder="Enter fees" name="video_price"-->
<!--                      min="0"-->
<!--                      type="number"-->
<!--                      class="form-control"-->
<!--                      :class="{ ' is-invalid': submitted && $v.doctorData.video_price.$error }"-->
<!--                    >-->
<!--                  <div v-if="submitted && !$v.doctorData.video_price.required"-->
<!--                        class="invalid-feedback">{{formTranslation.doctor.doctor_fees_required}}-->
<!--                    </div>-->
<!--                    <div v-else-if="submitted && (!$v.doctorData.video_price.minValue || !$v.doctorData.video_price.maxValue)"-->
<!--                         class="invalid-feedback">{{formTranslation.service.service_charge_length}}-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
            <hr v-if="isCustomeFieldExist" >
            <div v-if="isCustomeFieldExist" class="row">
              <div class="col-md-12">
                <h4 class="text-primary mb-3"> {{formTranslation.doctor.other_detail}}</h4>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <!-- Component for the custom fields -->
                <get-custom-fields
                    v-if="this.$route.params.id === undefined"
                    module_type="doctor_module"
                    :module_id="String(0)"
                    @bindCustomField="getCustomFieldsValues"
                    :fieldsValue="customFieldsData"
                    @customFieldAvailable="isCustomeFieldExist=true"
                    @requiredCustomField="getRequireFields"
                ></get-custom-fields>
                <edit-custom-fields v-else
                    module_type="doctor_module"
                    :module_id="String(this.$route.params.id )"
                    @bindCustomField="getCustomFieldsValues"
                    :fieldsValue="customFieldsData"
                    @requiredCustomField="getRequireFields"
                ></edit-custom-fields>
              </div>
            </div>
            <template v-slot:footer>
              <div class="row">
                <div class="col-md-12 p-0">
                  <div class="d-flex justify-content-end">
                    <button v-if="!loading" class="btn btn-primary rtl-ml-2" type="submit">
                      <i class="fa fa-save"></i> {{ formTranslation.doctor.save_btn }}
                    </button>
                    <button v-else class="btn btn-primary" type="submit" disabled>
                      <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                    </button>
                    <button type="button" class="btn btn-outline-primary" @click="$router.go(-1);">
                      {{ formTranslation.common.cancel }}
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </b-card>
      </form>
    </b-col>
  </b-row>
</template>
<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import {
  required,
  numeric,
  requiredIf,
  alpha,
  minLength,
  maxLength,
  minValue,
  maxValue,
} from "vuelidate/lib/validators";
import {post, get} from "../../config/request";
import vueSignature from "vue-signature"
import {
  validateForm,
  randomString,
  phoneNumber,
  alphaSpace,
  minimumValue,
  emailValidate
} from "../../config/helper";

export default {
  components:{
    vueSignature,
    VuePhoneNumberInput
  },
  data: () => {
    return {
      imagePreview: pluginBASEURL + 'assets/images/kc-demo-img.png',
      doctorData: {},
      clinics:[],
      loading: false,
      submitted: false,
      qualificationSubmitted: false,
      doctorTimeSlot: "",
      buttonText: '<i class="fa fa-save"></i> Save',
      qualification: {},
      qualificationTitle: 'Add qualifiaction',
      qualificationBtn: '<i class="fa fa-plus"></i> add qualifiaction',
      qualificationEdit: false,
      qualificationYears: [],
      price_type: ['range', 'fixed'],
      timeSlots: [],
      customFields: [],
      requiredFields: [],
      randomString: randomString(8),
      teleMed: {
        apiKey: "",
        apiSecret: "",
        price: ""
      },
      formLoader:false,
      clinicMultiselectLoader:true,
      signatureOption:{
        penColor:"rgb(0, 0, 0)",
        backgroundColor:"rgb(220,220,220)"
      },
      showCanvas:false,
      isCustomeFieldExist:false,
      defaultCountryCode: null,
      doctorClinicId:[],
      defaultUserRegistrationFormSettingData: 'on'
    }
  },
  mounted() {
    this.getCountryCodeData();
    this.getUserRegistrationFormData();
    this.doctorData = this.defaultDoctorData();
    this.qualification = this.defaultQualification();
    this.qualificationYears = this.getQualificationYear();
    this.teleMed = this.defaultTelemed();
    this.init();
    if(window.request_data.proActive){
      this.getClinics();
    }
  },
  validations: {
    doctorData: {
      first_name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(50)
      },
      last_name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(50)
      },
      user_email: {
        required,
        emailValidate
      },
      mobile_number: {
        required,
        // phoneNumber,
        minLength: minLength(4),
        maxLength: maxLength(15)
      },
      specialties: {required},
      gender:{
        required
      },
      clinic_id:{
        required: requiredIf(function () {
          return this.userData.addOns.kiviPro == true && this.getUserRole() == 'administrator'
        })
      },
      // dob: {required},
      user_status: {required},
      // city: {
      //   maxLength: maxLength(30)
      // },
      // country: {
      //   maxLength: maxLength(30)
      // },
      // postal_code: {
      //   maxLength: maxLength(12)
      // },
      api_key: {
        required: requiredIf(function () {
          return [true,'true'].includes(this.doctorData.enableTeleMed)
        })
      },
      api_secret: {
        required: requiredIf(function () {
          return [true,'true'].includes(this.doctorData.enableTeleMed)
        })
      },
      // video_price: {
      //   required: requiredIf(function () {
      //     return [true,'true'].includes(this.doctorData.enableTeleMed) || this.doctorData.is_enable_doctor_gmeet
      //   }),
      //   minValue: minValue(0),
      //   maxValue: maxValue(1000000000000000000)
      // }
    },
    qualification: {
      degree: {required},
      university: {required},
      year: {required}
    },
    custom_fields: {}
  },
  methods: {
    contactUpdateHandaler: function (val) {
      this.doctorData.country_code = val.countryCode;
      this.doctorData.country_calling_code = val.countryCallingCode;
    },
    init: function () {
      this.getTimeSlots();
      /// Code for the Edit functionality...

      this.qualificationTitle= this.formTranslation.doctor.add_qualification
      this.qualificationBtn= '<i class="fa fa-plus"></i> '+this.formTranslation.doctor.add_qualification

      if (this.$route.params.id !== undefined) {
        this.cardTitle = this.formTranslation.doctor.edit_doctor;
        this.buttonText = '<i class="fa fa-save"></i> '+this.formTranslation.common.save;
        this.formLoader = true;
        get('doctor_edit', {
          id: this.$route.params.id
        })
          .then((response) => {
            this.formLoader = false;
            if (response.data.status !== undefined && response.data.status === true) {
              setTimeout(() => {
                this.doctorClinicId = response.data.data.clinic_id.map((value,key)=>{
                  return value.id
                })
                this.doctorData = response.data.data;
                if (response.data.data.country_calling_code !== '' && response.data.data.country_calling_code !== undefined) {
                  this.defaultCountryCode = response.data.data.country_code;
                }
                if (this.doctorData.user_profile) {
                  this.imagePreview = this.doctorData.user_profile
                }
                this.doctorTimeSlot = this.doctorData.time_slot;
                // this.doctorData.dob = new Date(this.doctorData.dob + ' 00:00');
                this.doctorData.custom_fields= response.data.custom_filed
                this.isCustomeFieldExist = (this.doctorData.custom_fields !== undefined && this.doctorData.custom_fields.length > 0)
                this.showCanvas = true;
              }, 200)
            }
          })
          .catch((error) => {
            this.showCanvas = true;
            this.formLoader = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          })
      }else{
        this.showCanvas = true;
      }
      // get dynamic translation key
      this.getDynamicTranslationKey();

    },
    handleTimeSlotChange: function () {
      if (this.doctorData.time_slot !== parseInt(this.doctorTimeSlot) && this.doctorData.ID !== undefined) {
        displayAlert('Warning!', this.formTranslation.doctor.change_time_will_effect)
      }
    },
    checkValuesExist(arr1, arr2) {
      return arr1.every(value => arr2.includes(value));
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
        this.$root.$emit('bv::toggle::collapse', 'qualification-add-tab');
      } else {
        this.qualificationEdit = false;
        this.$root.$emit('bv::toggle::collapse', 'qualification-add-tab');
      }

      this.qualificationTitle = this.formTranslation.doctor.add_qualification;
      this.qualificationBtn = '<i class="fa fa-plus"></i> '+this.formTranslation.doctor.add_qualification;
      this.qualification = this.defaultQualification();

      this.qualificationSubmitted = false;

    },
    getTimeSlots: function () {
      let slot = 5;
      for (let i = 0; i < 12; i++) {

        if (slot <= 60) {
          this.timeSlots.push(slot);
        }
        slot = slot + 5;
      }
    },
    editQualification: function (index) {
      this.$root.$emit('bv::toggle::collapse', 'qualification-add-tab');
      this.qualificationTitle = this.formTranslation.doctor.edit_qualification;
      this.qualificationEdit = true;
      this.qualificationBtn = '<i class="fa fa-save"></i> '+this.formTranslation.doctor.save_qualification;
      this.qualification = this.doctorData.qualifications[index - 1];
    },
    deleteQualification: function (index) {
      if (index !== undefined) {
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
            cancel:{
              text:this.formTranslation.common.cancel
            }
          }
        });
      } else {
        displayErrorMessage(this.formTranslation.custom_field.doctor_profile_data_not_found)
      }
    },
    defaultDoctorData: function () {
      var oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 18);
      return {
        first_name: '',
        last_name: '',
        username: '',
        user_email: '',
        user_pass: '',
        mobile_number: '',
        country_code: '',
        country_calling_code: '',
        gender: '',
        dob: '',
        about_me: '',
        address: '',
        city: '',
        country: '',
        postal_code: '',
        clinic_id:'',
        specialties: [],
        profile_image: '',
        video_price: '',
        price_type: 'range',
        price: 0,
        minPrice: 0,
        maxPrice: 0,
        qualifications: [],
        time_slot: 5,
        custom_fields: {
          id:'',
          name:''
        },
        user_status: 0,
        enableTeleMed: false,
        api_key: "",
        api_secret: "",
        no_of_experience: 0,
        signature:'',
        is_enable_doctor_gmeet:false
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
    defaultTelemed:function(){
      return{
        apiKey: '',
        apiSecret :'',
        price : ''
      }
    },
    getClinics:function () {
      this.clinicMultiselectLoader = true;
      get('get_static_data', {
          data_type: 'clinic_list',
        })
          .then((response) => {
            this.clinicMultiselectLoader = false;
            if (response.data.status !== undefined && response.data.status === true) {
              this.clinics = response.data.data
            }
          })
          .catch((error) => {
            this.clinicMultiselectLoader = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    handleSubmit: function () {
      if(!this.$refs.signature.isEmpty()){
        this.doctorData.signature = this.$refs.signature.save('image/png');
      }else{
        this.doctorData.signature = this.$refs.signature.clear();
      }
      this.loading = true;
      this.submitted = true;

      this.$v.$touch();
      this.$nextTick(() => {
        if (document.querySelector('.is-invalid') !== null && document.querySelector('.is-invalid') !== undefined) {
          document.querySelector('.is-invalid').scrollIntoView({block: "center", behavior: "smooth"})
        } else if (document.querySelector('.invalid-feedback') !== null && document.querySelector('.invalid-feedback') !== undefined) {
          document.querySelector('.invalid-feedback').scrollIntoView({block: "center", behavior: "smooth"})
        }
      })

      // stop here if form is invalid
      if (this.$v.doctorData.$invalid) {
        this.loading = false;
        return;
      }

      if (this.requiredFields.length > 0) {
        this.loading = false;
        displayErrorMessage(this.formTranslation.common.all_required_field_validation)
        return;
      }
      let updatedDoctorClinicId;
      if(this.getUserRole() === 'administrator' && this.userData.addOns.kiviPro){
        updatedDoctorClinicId = this.doctorData.clinic_id.map(value => value.id);        
      }else{
        if(this.defaultClinicData !== undefined){
          updatedDoctorClinicId = [this.defaultClinicData.id];
        }
      }
      if(this.$route.params.id !== undefined
        && this.userData.addOns.kiviPro
        && this.getUserRole() === 'administrator'
        && !this.checkValuesExist(this.doctorClinicId, updatedDoctorClinicId)) {
      
        $.confirm({
          title: this.formTranslation.clinic_schedule.dt_are_you_sure,
          content: 'Removed clinics will delete service and session data of this doctor and removed clinics.',
          type: 'red',
          buttons: {
            ok: {
              text: this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                this.loading = false;
                this.submitted = false;
                this.saveDoctor();
              }
            },
            cancel:{
              text:this.formTranslation.common.cancel,
              action:() =>{
                this.loading = false;
                this.submitted = false;
              }
            }
          }
        });
      }else{
        this.saveDoctor();
      }
    },
    saveDoctor(){
      if (validateForm("doctorDataForm")) {
        post('doctor_save', this.doctorData)
            .then((response) => {
              this.loading = true;
              this.submitted = false;
              if(this.getUserRole() === 'administrator'){
                this.$store.dispatch("userDataModule/fetchUserData", {});
              }
              if (response.data.status !== undefined && response.data.status === true) {
                displayMessage(response.data.message);
                this.$router.push({name: 'doctor'});
              } else {
                this.loading = false;
                displayErrorMessage(response.data.message)
              }

            })
            .catch((error) => {
              console.log(error);
              this.loading = false;
              this.submitted = false;
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
    kcGetCustomFields: function () {
      this.customFields = [];
    },
    getCustomFieldsValues: function (fieldsObj) {
      if(!fieldsObj || fieldsObj === undefined){
        return false;
      }
      this.doctorData.custom_fields = fieldsObj;
    },
    getRequireFields: function (validateRequired) {
      this.requiredFields = validateRequired;
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
      let _this = this;
      post('static_data_save', specialitiesObj)
          .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              _this.doctorData.specialties.push({id: response.data.insert_id, label: value})
              _this.$store.commit("staticDataModule/ADD_OPTION_STATIC_DATA", {
                dataType: 'specialization',
                option: {id: response.data.insert_id, label: value}
              });
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error)
          })
    },
    getDynamicTranslationKey: function () {
      // if(this.$store.state.staticDataModule !== undefined && this.$store.state.staticDataModule.langTranslateData !== undefined && this.$store.state.staticDataModule.langTranslateData !== []) {
      //     this.$store.dispatch("staticDataModule/fetchLangTranslateData", {
      //     filePath: window.request_data.kiviCarePluginURL,
      //     current: 'temp',
      //     module: ''
      //     });
      // }
    },
    uploadProfile() {
      let _this = this;

      var custom_uploader = kivicareCustomImageUploader(this.formTranslation);

      custom_uploader.on('select', function () {
        var attachment = custom_uploader.state().get('selection').first().toJSON();
        _this.imagePreview = attachment.url;
        _this.doctorData.profile_image = attachment.id;
      });

      //Open the uploader dialog
      custom_uploader.open();

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
  },
  computed: {
    customFieldsData() {
      return (this.doctorData.custom_fields ? this.doctorData.custom_fields : []);
    },
    userData() {
      return this.$store.state.userDataModule.user;
    },
    teleMedEn() {
      return this.userData.addOns.telemed
    },
    doctorSpecialization(){
      return this.$store.state.staticDataModule.static_data.specialization
    },
    specializationMultiselectLoader(){
      return this.$store.state.staticDataModule.static_data_loader
    },
    defaultClinicData() {
      return this.$store.state.userDataModule.clinic;
    },
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