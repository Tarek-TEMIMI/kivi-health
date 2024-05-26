<template>
  <div>
    <ModalPopup
        v-if="appointmentReviewModal"
        modalId="appointment-details-modal"
        modalSize="lg"
        :openModal="appointmentReviewModal"
        :modalTitle="formTranslation.appointments.add_review"
        @closeModal="closeModal"
        >
          <div class="add_review">
            <div class="rating">
              <div class="d-flex justify-content-center align-items-center" v-if="!showMessage ">
                <ul class="list" v-if="getUserRole() === 'patient'">
                  <li @click="getStars = star" v-for="star in maxStars" :class="{ 'active': star <= getStars }"
                      :key="star.stars" class="star">
                    <i :class="star <= getStars  ? 'fas  fa-star' : 'far fa-star'"></i>
                  </li>
                </ul>
                <div v-else class="row" >
                  <div class="text-center col-sm-12 col-md-12 col-lg-12 pt-1">
                    <i class="kivi-star" :data-star="doctor_review_details.average_rating" style="font-size:60px;font-weight: 900"></i>
                    <div>
                      <h2 class="mb-0">{{ doctor_review_details.total_rating + ' ' +formTranslation.appointments.ratings }} </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row" v-else>
                <div class="text-center col-sm-12 col-md-12 col-lg-12 pt-1">
                  <div v-if="showMessage">
                    <i class="text-primary fas fa-thumbs-up" style="font-size:40px"></i>
                  </div>
                  <div class="pt-2">
                    <h1>{{ message }}</h1>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" v-if="!showMessage && getUserRole() === 'patient'">
              <div class="col-12">
                <div class="form-group">
                  <label for="description" class="form-control-label">
                    {{formTranslation.common.please_share_your_experience}}
                  </label>
                  <textarea id="description" class="form-control" v-model="description"></textarea>
                </div>
              </div>
              <div class="col-12 d-flex justify-content-end">
                <button class="btn btn-primary" @click="submit_rate">
                  {{formTranslation.common.save}}
                </button>
              </div>
            </div>
            <div v-else>
        <div class="col-12" v-for="(value,key) in doctor_review_details.detail" :key="key">
          <hr class="m-2 mr-0 ml-0">
          <div class="row">
            <div class="col-8 d-flex justify-content-start align-items-center">
              <i class="kivi-star" :data-star="value.review"></i>
              <p class="ml-2 mb-0"> {{'By ' + value.patient_name}}</p>
            </div>
            <div class="col-4">
              <p class="mb-0 text-right"> {{value.updated_at}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <p class="mb-0 font-weight-400 text-dark" > {{value.review_description}}</p>
            </div>
          </div>
        </div>
            </div>
          </div>
      </ModalPopup>
  </div>
</template>

<script>

import {post, get} from "../../config/request";
import ModalPopup from '../Modal/Index'

export default {
  name: "AppointmentReviewCard",
  components: {ModalPopup},
  props: {
    appointmentReviewModal:{
      type:[Boolean],
      default(){
        return false;
      }
    },
    appointmentDetails: {
      type: [Object, Array],
      default() {
        return [
          
        ]
      }
    },
    doctor_id: {
      type: [Number,String],
      default() {
        return 0
      }
    },
  },
  data: () => {
    return {
      showMessage: false,
      getStars: 1,
      message: "",
      reviewId: 0,
      maxStars: 5,
      image: window.request_data.kiviCarePluginURL + 'assets/images/check-circle.gif',
      description:'',
      total_doctor_rating:0,
      doctor_review_details:{
        average_rating:0,
        total_rating:0,
        detail:[]
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function () {
      if(this.getUserRole() === 'patient'){
         this.getReview(this.appointmentDetails.doctor_id.id, this.appointmentDetails.patient_id.id)
      }else{
        this.getDoctorReview()
      }
    },
    getDoctorReview:function (){
      get('doctor_review_detail', {doctor_id: this.doctor_id})
          .then((data) => {
            if (data.data.status) {
               this.doctor_review_details = data.data.data
            }
          })
          .catch((error) => {
            console.log(error);
          })
    },
    getReview: function (doctor_id, patient_id) {

      if (doctor_id !== undefined || patient_id !== undefined) {
        get('patient_get_review', {doctor_id: doctor_id, patient_id: patient_id})
            .then((data) => {
              if (data.data.status) {
                this.getStars = parseInt(data.data.data.review)
                this.reviewId = parseInt(data.data.data.id)
                this.description = data.data.data.review_description
              } else {
                this.getStars = 1
                this.reviewId = 0
              }
              this.showMessage = false
            })
            .catch((error) => {
              console.log(error);
            })
      }
    },
    submit_rate: function () {
      if (typeof this.getStars === 'number' && this.getStars <= this.maxStars && this.getStars >= 0) {
        if (this.appointmentDetails.doctor_id.id !== undefined || this.appointmentDetails.patient_id.id !== undefined) {
          this.showMessage = false;
          post('patient_save_review', {
            id: this.reviewId,
            doctor_id: this.appointmentDetails.doctor_id.id,
            patient_id: this.appointmentDetails.patient_id.id,
            star: this.getStars,
            description:this.description
          })
              .then((data) => {
                if (data.data.status) {
                  this.message = data.data.message;
                  this.showMessage = true;
                }
              })
              .catch((error) => {
                console.log(error);
              })
        }
      }

    },
    closeModal(){
      this.$emit('closeModal')
    }
  },
  beforeDestroy() {
    this.showMessage = false;
    this.reviewId = 0;
    this.getStars = 1;
    this.description = '';
    this.doctor_review_details = {
      average_rating: 0,
      total_rating: 0,
      detail: []
    }
  },
}
</script>

<style scoped>

</style>