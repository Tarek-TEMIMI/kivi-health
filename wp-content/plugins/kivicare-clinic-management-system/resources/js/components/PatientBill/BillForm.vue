<template>

    <div class="page-loader-section" v-if="isLoading">
      <loader-component-2></loader-component-2>
    </div>
    <form v-else id="patientBillDataForm" @submit.prevent="handleSubmit" :novalidate="true">

      <div class="row">
        <div class="col-12 mb-3">
          <button class="btn btn-sm btn-primary float-right " @click="handleBillModal" type="button">  
            <i v-if="!visible" class="fa fa-plus"></i> 
            <i v-else class="fa fa-minus"></i> 
            {{ ( visible ?  formTranslation.patient_bill.bill_close : formTranslation.patient_bill.bill_add_item ) }} 
          </button>
        
        </div>
      </div>
      
      <b-collapse id="bill-item-add" :visible="showAddForm" >
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="item_id" class="form-control-label">{{formTranslation.common.service}} <span
                  class="text-danger">*</span></label>
              <multi-select
                  v-model="billItem.item_id"
                  deselect-label=""
                  select-label=""
                  id="item_id"
                  :class="{ ' is-invalid': billItemSubmitted && $v.billItem.item_id.$error }"
                 :tag-placeholder="formTranslation.patient_bill.select_service" 
                  :placeholder="formTranslation.patient_bill.plh_service"
                  label="label"
                  track-by="id" :options="services"
                  @select="handleBillItemChange"
                  @remove="handleBillItemUnselect"
                  :taggable="true"
                  @tag="addServiceTag"
              ></multi-select>
              <span class="text-primary small"><b>{{formTranslation.common.note}}</b></span>
              <div v-if="billItemSubmitted && !$v.billItem.item_id.required" class="invalid-feedback"> {{formTranslation.patient_bill.service_required}} </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="price" class="form-control-label">{{formTranslation.common.price}} <span
                  class="text-danger">*</span></label>
              <b-input-group size="md" :prepend="clinic_currency_prefix" :append="clinic_currency_postfix">
                <b-form-input
                    :class="{ ' is-invalid': billItemSubmitted && $v.billItem.price.$error }"
                    min="0"
                    v-model="billItem.price"
                    :placeholder="formTranslation.patient_bill.plh_price"
                    required="required" name="first_name" type="number" class="form-control" oninput="validity.valid||(value='');">
                </b-form-input>
              </b-input-group>
              <div v-if="billItemSubmitted && !$v.billItem.price.required" class="invalid-feedback">
                {{formTranslation.patient_bill.price_required}}
              </div>
              <div v-else-if="billItemSubmitted && (!$v.billItem.price.minValue)" class="invalid-feedback">
                {{formTranslation.patient_bill.prize_greater_then_0}}
              </div>
              <div v-else-if="billItemSubmitted && !$v.billItem.price.maxValue" class="invalid-feedback">
                {{formTranslation.patient_bill.prize_between_number}}
              </div>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="qty" class="form-control-label">{{formTranslation.common.quantity}} <span
                  class="text-danger">*</span></label>
              <input id="qty"
                     :class="{ ' is-invalid': billItemSubmitted && $v.billItem.qty.$error }"
                     v-model="billItem.qty" 
                     :placeholder="formTranslation.patient_bill.plh_quality"
                     min="0"
                     required="required" name="first_name" type="number" class="form-control">
              <div v-if="billItemSubmitted && !$v.billItem.qty.required" class="invalid-feedback">
                {{formTranslation.patient_bill.quantity_required}}
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="total" class="form-control-label">{{formTranslation.common.total}} <span
                  class="text-danger">*</span></label>
              <label id="total" class="form-control">{{clinic_currency_prefix}}{{ billItem.total }}{{clinic_currency_postfix}}</label>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12 mb-3">
            <div class="float-right">
              <button class="btn btn-sm btn-primary"  type="button" @click="addBillItem" v-html="billItemBtn"></button>
              <button class="btn btn-sm btn-outline-primary"  type="button" @click="cancelBillItem"> {{formTranslation.common.cancel}} </button>
            </div>
          </div>
        </div>

      </b-collapse>
      <b-collapse  :visible="showEditForm" :static-id="staticId" v-if="staticId" >
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="item_id" class="form-control-label">{{formTranslation.common.service}} <span
                  class="text-danger">*</span></label>
              <multi-select
                  v-model="billItem.item_id"
                  deselect-label=""
                  select-label=""
                  id="item_id"
                  :class="{ ' is-invalid': billItemSubmitted && $v.billItem.item_id.$error }"
                  :tag-placeholder="formTranslation.patient_bill.plh_select_service" 
                  :placeholder="formTranslation.patient_bill.plh_services"
                  label="label"
                  track-by="id" :options="services"
                  @select="handleBillItemChange"
                  @remove="handleBillItemUnselect"
                  :taggable="true"
                  @tag="addServiceTag"
              ></multi-select>
              <span class="text-primary small"><b>{{formTranslation.common.note}}</b></span>
              <div v-if="billItemSubmitted && !$v.billItem.item_id.required" class="invalid-feedback"> {{formTranslation.patient_bill.service_required}} </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="price" class="form-control-label">{{formTranslation.common.price}} <span
                  class="text-danger">*</span></label>
              <b-input-group size="md" :prepend="clinic_currency_prefix" :append="clinic_currency_postfix">
                <b-form-input
                    :class="{ ' is-invalid': billItemSubmitted && $v.billItem.price.$error }"
                    min="0"
                    v-model="billItem.price"
                    :placeholder="formTranslation.patient_bill.plh_price"
                    required="required" name="first_name" type="number" class="form-control">
                </b-form-input>
              </b-input-group>
              <div v-if="billItemSubmitted && !$v.billItem.price.required" class="invalid-feedback">
                {{formTranslation.patient_bill.price_required}}
              </div>
              <div v-else-if="billItemSubmitted && (!$v.billItem.price.minValue)" class="invalid-feedback">
                {{formTranslation.patient_bill.prize_greater_then_0}}
              </div>
              <div v-else-if="billItemSubmitted && !$v.billItem.price.maxValue" class="invalid-feedback">
                {{formTranslation.patient_bill.prize_between_number}}
              </div>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="qty" class="form-control-label">{{formTranslation.common.quantity}} <span
                  class="text-danger">*</span></label>
              <input id="qty"
                     :class="{ ' is-invalid': billItemSubmitted && $v.billItem.qty.$error }"
                     v-model="billItem.qty" 
                     :placeholder="formTranslation.patient_bill.plh_quality"
                     min="0"
                     required="required" name="first_name" type="number" class="form-control">
              <div v-if="billItemSubmitted && !$v.billItem.qty.required" class="invalid-feedback">
                {{formTranslation.patient_bill.quantity_required}}
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="total" class="form-control-label">{{formTranslation.common.total}} <span
                  class="text-danger">*</span></label>
              <label id="total" class="form-control">{{clinic_currency_prefix}}{{ billItem.total }}{{clinic_currency_postfix}}</label>
            </div>
          </div>
<!--           <div class="col-md-2">-->
<!--            <div class="form-group">-->
<!--            <label for="item_id" class="form-control-label">{{formTranslation.common.status}} <span-->
<!--                  class="text-danger">*</span></label>-->
<!--              <multi-select-->
<!--                  v-model="patientBillData.payment_status"-->
<!--                  deselect-label=""-->
<!--                  select-label=""-->
<!--                  @select="handlePaymentChange"-->
<!--                  @remove="removePaymentChage"-->
<!--                  id="payment_status"-->
<!--                  :tag-placeholder="formTranslation.patient_bill.tag_plh_status" -->
<!--                  :placeholder="formTranslation.patient_bill.plh_status"-->
<!--                  label="label"-->
<!--                  track-by="id" :options="status"-->
<!--              ></multi-select>-->
<!--            </div>-->
<!--          </div>-->
        </div>

        <div class="row m-2">
          <div class="col-md-12 ">
            <div class="float-right">
              <button class="btn btn-sm btn-primary"  type="button" @click="addBillItem" v-html="billItemBtn"></button>
              <button class="btn btn-sm btn-outline-primary"  type="button" @click="cancelBillItem"> {{formTranslation.common.cancel}} </button>
            </div>
          </div>
        </div>

      </b-collapse>
      <div class="row">
          <div class="col-md-12 table-responsive">
              <table class="table table-sm text-center table-bordered custom-table">
                  <thead class="thead-light">
                  <tr>
                      <th>{{formTranslation.common.sr_no}}</th>
                      <th>{{formTranslation.common.services}}</th>
                      <th>{{formTranslation.common.price}}</th>
                      <th>{{formTranslation.common.quantity}}</th>
                      <th>{{formTranslation.common.total}}</th>
                      <th>{{formTranslation.common.action}}</th>
                  </tr>
                  </thead>
                  <tbody v-if="patientBillData.billItems !== undefined && patientBillData.billItems.length > 0">
                  <tr v-for="(billing_item, index) in patientBillData.billItems" :key="index">
                      <td>{{ ++index }}</td>
                      <td>{{ (billing_item.item_id !== null && billing_item.item_id.label != null ?  billing_item.item_id.label : ' - ' ) }}</td>
                      <td>{{clinic_currency_prefix}}{{ billing_item.price }}{{clinic_currency_postfix}}</td>
                      <td>{{ billing_item.qty }}</td>
                      <td>{{ clinic_currency_prefix }}{{ billing_item.price * billing_item.qty }}{{clinic_currency_postfix}}</td>
                      <td>
                          <div class="btn-group">
                              <button type="button" href="#" v-b-tooltip.hover :title="formTranslation.common.edit" class="btn btn-sm btn-outline-primary" @click="editBillItem(index)">
                                  <i class="fa fa-pen-alt"></i>
                              </button>
                              <button type="button" v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt" class="btn btn-outline-danger btn-sm" @click="deleteBillItem(index)">
                                  <i class="fa fa-trash"></i>
                              </button>
                          </div>
                      </td>
                  </tr>
                  </tbody>
                  <tbody v-else>
                  <tr>
                      <td colspan="6"><h4 class="text-primary mb-0">{{formTranslation.common.no_records_found}}</h4></td>
                  </tr>
                  </tbody>
              </table>
              <div v-if="submitted && (patientBillData.billItems !== undefined && !(patientBillData.billItems.length > 0))" class="invalid-feedback">
                  {{formTranslation.patient_bill.please_add_bill_items}}
              </div>
          </div>
      </div>

      <hr class="my-4">
       <div class="row" v-if="userData.addOns.kiviPro">
          <div class="col-md-12 table-responsive">
              <table class="table table-sm text-center table-bordered custom-table">
                  <thead class="thead-light">
                  <tr>
                      <th>{{formTranslation.common.sr_no}}</th>
                      <th>{{formTranslation.common.tax + ' ' + formTranslation.common.name}}</th>
                      <th>{{formTranslation.service.charges}}</th>
                  </tr>
                  </thead>
                  <tbody v-if="patientBillData.taxes !== undefined && patientBillData.taxes.length > 0">
                  <tr v-for="(tax_item, index) in patientBillData.taxes" :key="index">
                      <td>{{ ++index }}</td>
                      <td>{{ (tax_item.name ?  tax_item.name : ' - ' ) }}</td>
                      <td>{{clinic_currency_prefix}}{{ tax_item.charges }}{{clinic_currency_postfix}}</td>
                  </tr>
                  <tr>
                      <td colspan="2" class="text-right">{{formTranslation.common.total + ' ' + formTranslation.common.tax}}</td>
                      <td>{{clinic_currency_prefix}}{{ patientBillData.tax_total }}{{clinic_currency_postfix}}</td>
                  </tr>
                  </tbody>
                  <tbody v-else>
                  <tr>
                      <td colspan="3"><h4 class="text-primary mb-0">{{formTranslation.common.no_tax_found}}</h4></td>
                  </tr>
                  </tbody>
              </table>
          </div>
      </div>

      <hr class="my-4">

      <div class="row">
        <div :class="(userData.addOns.kiviPro && patientBillData.tax_total ? 'col-md-3 ' : 'col-md-4 ')+ 'col-sm-12'">
          <div class="form-group">
            <label for="total_amount" class="form-control-label">
              {{formTranslation.common.total}} <span class="text-danger">*</span>
            </label>
            <div >
              <b-input-group size="md" :prepend="clinic_currency_prefix" :append="clinic_currency_postfix">
                <b-form-input
                    id="total_amount"
                    readonly
                    disabled
                    :class="{ ' is-invalid': submitted && $v.patientBillData.total_amount.$error }"
                    :value="userData.addOns.kiviPro && patientBillData.tax_total ? patientBillData.total_amount - patientBillData.tax_total : patientBillData.total_amount"
                    :placeholder="formTranslation.patient_bill.plh_total_amount"
                    required="required" name="total_amount" type="text" class="form-control">
                </b-form-input>
              </b-input-group>
              <div v-if="submitted && !$v.patientBillData.total_amount.required" class="invalid-feedback">
                 {{formTranslation.patient_bill.bill_total_required}}
              </div>
            </div>
          </div>
        </div>
        <div v-if="userData.addOns.kiviPro && patientBillData.tax_total" class="col-md-3 col-sm-12">
          <div class="form-group">
            <label for="tax_total" class="form-control-label">
              {{formTranslation.common.tax}} <span class="text-danger">*</span>
            </label>
            <div >
              <b-input-group size="md" :prepend="clinic_currency_prefix" :append="clinic_currency_postfix">
                <b-form-input
                    id="total_amount"
                    readonly
                    disabled
                    :class="{ ' is-invalid': submitted && $v.patientBillData.total_amount.$error }"
                    v-model="patientBillData.tax_total"
                    :placeholder="formTranslation.patient_bill.plh_total_amount"
                    required="required" name="tax_total" type="text" class="form-control">
                </b-form-input>
              </b-input-group>
              <div v-if="submitted && !$v.patientBillData.total_amount.required" class="invalid-feedback">
                 {{formTranslation.patient_bill.bill_total_required}}
              </div>
            </div>
          </div>
        </div>
        <div :class="(userData.addOns.kiviPro && patientBillData.tax_total ? 'col-md-3 ' : 'col-md-4 ')+ 'col-sm-12'">
          <div class="form-group">
            <label for="discount" class="form-control-label">
              {{formTranslation.patient_bill.discount}} <span class="text-danger">*</span> <span class="text-primary"><small>{{formTranslation.patient_bill.discount_amount}}</small></span>
            </label>
            <div >
              <b-input-group size="md" :prepend="clinic_currency_prefix" :append="clinic_currency_postfix">
                <b-form-input
                    id="discount"
                    :class="{ ' is-invalid': submitted && $v.patientBillData.discount.$error }"
                    v-model="patientBillData.discount"
                    :placeholder="formTranslation.patient_bill.plh_discount"
                    :disabled="(patientBillData.billItems !== undefined && !(patientBillData.billItems.length > 0))"
                    required="required" name="discount" type="number" min="0" class="form-control" oninput="validity.valid||(value='');">
                </b-form-input>
              </b-input-group>
              <div v-if="submitted && !$v.patientBillData.discount.required" class="invalid-feedback">
                {{formTranslation.patient_bill.discount_required}}
              </div>
              <div v-else-if="submitted && (!$v.patientBillData.discount.minValue)" class="invalid-feedback">
                {{formTranslation.patient_bill.discount_greater_then_0}}
              </div>
              <div v-else-if="submitted && !$v.patientBillData.discount.maximumDiscount" class="invalid-feedback">
                {{formTranslation.patient_bill.discount_less_then_total_bill_amount}}
              </div>
            </div>
          </div>
        </div>
        <div :class="(userData.addOns.kiviPro && patientBillData.tax_total ? 'col-md-3 ' : 'col-md-4 ')+ 'col-sm-12'">
          <div class="form-group">
            <label for="actual_amount" class="form-control-label">
              {{formTranslation.patient_bill.payable_amount}}
            </label>
            <div>
              <b-input-group size="md" :prepend="clinic_currency_prefix" :append="clinic_currency_postfix">
                <b-form-input
                    id="actual_amount"
                    readonly
                    disabled
                    :class="{ ' is-invalid': submitted && $v.patientBillData.actual_amount.$error }"
                    v-model="patientBillData.actual_amount"
                    :placeholder="formTranslation.patient_bill.plh_discount"
                    required="required" name="discount" type="number" min="0" class="form-control">
                </b-form-input>
              </b-input-group>
            </div>
          </div>
        </div>
      </div>
      <div class="row" id="payment-status-section">
        <div class="offset-md-7 col-md-5 float-right mb-3 ">
          <div class="row">
            <div class="col-md-5">
              <label class="form-control-label mt-1">
                {{formTranslation.patient_bill.payment_status}}
              </label>
            </div>
            <div class="col-md-7">
              <b-form-radio-group v-model="patientBillData.payment_status" @change="handlePaymentChange">
                <b-form-radio name="payment_status" value="paid"> {{formTranslation.patient_bill.paid}} </b-form-radio>
                <b-form-radio name="payment_status" value="unpaid"> {{formTranslation.patient_bill.unpaid}} </b-form-radio>
              </b-form-radio-group>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="float-left">
            <h4 class="text-center small text-danger">{{formTranslation.patient_encounter.encounter_close_note}}</h4>
          </div>
          <div class="float-right">
            <button v-if="!loading" class="btn btn-primary" type="submit"
                    v-html="buttonText"></button>
            <button v-else class="btn btn-primary" type="submit" disabled>
              <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
            </button>
            <b-button class="btn btn-outline-primary" @click="$emit('onBillCancel')">{{formTranslation.common.cancel}}</b-button>
          </div>
        </div>
      </div>
    </form>

</template>

<script>

import {maxValue, minValue, required} from "vuelidate/lib/validators";
import {get, post} from "../../config/request";
import {minimumValue, validateForm, maximumDiscount, alphaSpace} from "../../config/helper";

export default {
    props: {
        encounterId : {
            type: [ String, Number ],
            default() {
                return 0
            }
        },
        doctorId : {
            type: [ String, Number ],
            default() {
                return 0
            }
        },
       clinic_extra:{
         type: [Object, Array,String],
       },
        appointmentData: {},
        checkOutVal : {
            type: [ String, Number ],
            default() {
                return 0
            }
        },
    },
    data: () => {
        return {
            woocommerceActive: 'off',
            cardTitle: "Add bill",
            buttonText: "Save",
            encounter_id: 0,
            patientBillData: {
              billItems:[]
            },
            services: [],
            billItem: {},
            loading: false,
            submitted: false,
            billItemTitle: "Add Bill Item",
            billItemBtn: '<i class="fa fa-plus"></i> Save',
            billItemSubmitted: false,
            billItemEdit: false,
            visible: false,
            showEditForm: false,
            showAddForm:false,
            staticId: -1,
            status:[
                {
                    id:"paid",
                    label:"Paid"
                },
                {
                    id:"unpaid",
                    label:"Unpaid"
                }
            ],
            clinic_currency_prefix:'',
            clinic_currency_postfix:'',
            isLoading: true,
        }
    },
    validations: {
        patientBillData: {
            total_amount: { required },
            discount: {
                required,
                maximumDiscount,
                minValue: minValue(0)
            },
            actual_amount: { required },
        },
        billItem: {
            item_id: { required },
            qty: {
                required,
                minValue: minValue(1),
                maxValue: maxValue(10000)
            },
            price: {
                required,
                minValue: minValue(0),
                maxValue: maxValue(1000000000000000000)
            },
        }
    },
    mounted() {
        this.init();
        this.clinic_currency_prefix = this.clinic_extra.currency_prefix !== undefined && this.clinic_extra.currency_prefix != null ? this.clinic_extra.currency_prefix : '';
        this.clinic_currency_postfix = this.clinic_extra.currency_postfix !== undefined && this.clinic_extra.currency_postfix != null ? this.clinic_extra.currency_postfix : '';
    },
    methods: {
        init: function () {
            this.buttonText = this.formTranslation.common.save
            this.patientBillData = this.defaultMedicalRecordData();
            this.billItem = this.defaultBillingItemData();
            //this.checkWoocommerceActive();

            if(this.encounterId !== 0) {
                this.patientBillData.encounter_id = this.encounterId;
                this.editBill(this.encounterId);
            }
          get('service_list', { module_type: 'appointment_form', limit: 0, doctor_id: this.doctorId, without_currency : 'yes',clinic_id:this.appointmentData.clinic_id })
              .then((response) => {
                this.appointmentTypes = response.data.data ;
                if(response.data.data.length > 0){
                  let data = response.data.data
                  data = data.map(function(val){
                    let newVal = Object.keys(val).reduce((acc,elem)=>{
                      if(elem === 'name' ){
                        acc['label'] = val[elem]
                      }else if(elem === 'service_id'){
                        acc['id'] = val[elem]
                      }else if(elem === 'charges'){
                        acc['price'] = val[elem]
                      }
                      return acc;
                    },{});
                    return newVal;
                  });
                  this.services = data
                }
              })
              .catch((error) => {
                console.log(error);
                displayErrorMessage(this.formTranslation.common.internal_server_error);
              })
        },
        checkWoocommerceActive(){
          get('get_payment_status', { status: '' } )
            .then((response) => {
              this.woocommerceActive = response.data.data ;
            })
            .catch((error) => {
              console.log('error', error);
            })
        },
        handleBillModal:function(){
          this.showAddForm = true
          this.visible=!this.visible
          this.showEditForm = !this.showAddForm
          this.billItemReset();
          if(this.visible === false){
            this.showAddForm = false;
            this.visible = false
          }
        },
        SendBillToPatient:function(){
            var element =$('#send_bill').find("i");
            element.removeClass('fa fa-paper-plane');
            element.addClass("fa fa-spinner fa-spin");
        },
        handleSubmit: function () {
            this.loading = true;

            this.submitted = true;

            // stop here if form is invalid
            this.$v.$touch();
            if (this.$v.patientBillData.$invalid) {
                this.loading = false;
                return;
            }

            if(this.patientBillData.billItems !== undefined && !(this.patientBillData.billItems.length > 0)) {
              this.loading = false;
              return ;
            }
            if(this.appointmentData.appointment_id !== null){
              this.patientBillData.appointment_id = this.appointmentData.appointment_id
            }
            this.patientBillData.checkOutVal = this.checkOutVal;
            if (validateForm("patientBillDataForm")) {
                this.patientBillData.doctor_id = this.doctorId
                post('patient_bill_save', this.patientBillData)
                    .then((response) => {
                        this.loading = false;
                        if (response.data.status !== undefined && response.data.status === true) {
                            displayMessage(response.data.message);
                            this.$emit('onBillSaved', this.patientBillData);
                            this.showEditForm= false;
                            this.showAddForm = false;
                        } else {
                            displayErrorMessage(response.data.message)
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        this.loading = false;
                        displayErrorMessage(this.formTranslation.common.internal_server_error);
                    })
            }

        },
        addBillItem: function () {

            this.billItemSubmitted = true;
            this.$v.billItem.$touch();

            if (this.$v.billItem.$invalid) {
                return;
            }

            this.getTaxDetails();
        },
        afterTaxDetails:function(){
          if (!this.billItemEdit) {
                if (this.patientBillData.billItems === undefined) {
                    this.patientBillData.billItems = [];
                }
                this.patientBillData.billItems.push(this.billItem);
            } else {
                this.updateBillTotal();
                this.billItemEdit = false;
            }

            this.billItemTitle = this.formTranslation.patient_bill.bill_add_item;
            this.billItemBtn = '<i class="fa fa-plus"></i> '+this.formTranslation.patient_bill.bill_add_item;
            this.billItem = this.defaultBillingItemData();

            this.billItemSubmitted = false;
        },
        editBillItem: function (index) {
            this.staticId = index
            this.showAddForm = false
            this.showEditForm = true
            this.visible=true
            this.billItemTitle = this.formTranslation.common.edit_bill_items;
            this.billItemEdit = true;
            this.billItemBtn = '<i class="fa fa-save"></i>'+ this.formTranslation.common.save_item;
            this.billItem = this.patientBillData.billItems[index - 1];
        },
        deleteBillItem: function (index) {
            if (this.patientBillData.billItems[index - 1] !== undefined) {
                let billItemData = this.patientBillData.billItems[index - 1];
                if (billItemData.id !== undefined) {
                    $.confirm({
                        title: this.formTranslation.clinic_schedule.dt_are_you_sure,
                        content: this.formTranslation.common.press_yes_delete_billitems,
                        type: 'red',
                        buttons: {
                            ok: {
                                text: this.formTranslation.common.yes,
                                btnClass: 'btn-danger',
                                keys: ['enter'],
                                action: () => {
                                    post('patient_bill_item_delete', {
                                        bill_item_id: billItemData.id
                                    })
                                        .then((data) => {
                                            if (data.data.status !== undefined && data.data.status === true) {
                                                this.patientBillData.billItems.splice((index - 1), 1);
                                                displayMessage(data.data.message);
                                                this.billItem = this.defaultBillingItemData();
                                                this.getTaxDetails('delete')
                                            }
                                        })
                                        .catch((error) => {

                                            if (error.response.data !== undefined && error.response.data.message !== undefined) {
                                                displayErrorMessage(error.response.data.message);
                                            } else {
                                                displayErrorMessage(this.formTranslation.common.internal_server_error);;
                                            }

                                        })
                                }
                            },
                            cancel:{
                              text:this.formTranslation.common.cancel
                            }
                        }
                    });
                } else {
                    this.patientBillData.billItems.splice((index - 1), 1);
                    this.billItem = this.defaultBillingItemData();
                    this.getTaxDetails('delete')
                }
            }
        },
        defaultMedicalRecordData: function () {
            return {
                title: '',
                encounter_id: 0,
                appointment_id:0,
                doctor_id:0,
                total_amount: 0,
                discount: 0,
                actual_amount: '',
                status: 0,
                billItems: [],
                payment_status: 'unpaid',
                taxes:[],
                tax_total:''
            }
        },
        defaultBillingItemData: function () {
            return {
                item_id: '',
                qty: 1,
                price: 0,
                total: (this.billItem.price * this.billItem.qty) || 0,
              
            }
        },
        handleBillItemChange: function (selectedOption) {
            this.billItem.price = parseFloat(selectedOption.price);
            this.billItem.qty = 1;
        },
        handlePaymentChange:function(selectedOption){
            if(selectedOption == 'paid'){
              if(this.checkOutVal === '1'){
                this.buttonText = this.formTranslation.common.save_and_close_checkout
              }else{
                this.buttonText = this.formTranslation.common.save_and_close_encounters
              }
            }
            else{
                this.buttonText = this.formTranslation.common.save
            }
        },
        removePaymentChage:function(selectedOption){
            if(selectedOption.id == 'paid'){
                this.buttonText = this.formTranslation.common.save
            }
        },
        handleBillItemUnselect: function () {
            this.billItem.price = 0;
            this.billItem.qty = 1;
        },
        addServiceTag: function (newTag) {
            const tag = {
                id: newTag,
                label: newTag,
                price: 0
            }
            this.billItem.item_id = tag;
            this.billItem.price = 0;
            this.billItem.qty = 1;
            this.billItem.total = 0;
            this.services.push(tag)
        },
        calculateGrandTotal: function () {
            this.patientBillData.total_amount = this.patientBillData.billItem.each((item) => {

            })
        },
        editBill: function (encounterId) {
            if (parseInt(encounterId) !== 0) {
                get('patient_bill_detail', {
                    encounter_id: encounterId
                })
                    .then((response) => {
                        if (response.data.status !== undefined && response.data.status === true) {
                            this.isLoading = false;
                            if (response.data.status) {
                                if(response.data.data.id !== undefined && response.data.data.id !== null  && response.data.data.id !== '') {
                                    this.patientBillData = response.data.data ;
                                }
                            }
                        }
                    })
                    .catch((error) => {
                        this.isLoading = false;
                        console.log(error);
                        displayErrorMessage(this.formTranslation.widgets.record_not_found);
                    })
            }
        },
        getTaxDetails:function(type){
          if(this.userData.addOns.kiviPro === false){
            this.afterTaxDetails()
            return;
          }
          // this.patientBillData.taxes = [];
          let data = JSON.stringify(this.patientBillData);
          data = JSON.parse(data)
          if (!this.billItemEdit && type !== 'delete') {
              if (data.billItems === undefined) {
                data.billItems = [];
              }
              data.billItems.push(this.billItem);
          }
          this.patientBillData.tax_total = '';
          post('tax_calculated_encounter_data',data)
              .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              this.patientBillData.taxes = response.data.data;
              this.patientBillData.tax_total = response.data.tax_total
            }else{
              this.patientBillData.taxes = [];
              this.patientBillData.tax_total = 0
            }
            if(type !== 'delete'){
              this.afterTaxDetails()
            }
            
          }).catch((error) => {
            
            if(type !== 'delete'){
              this.afterTaxDetails()
            }
            console.log(error);
            displayErrorMessage('Internal server error');
          })
        },
        updateBillTotal: function () {
            var sum = 0;
            if (this.patientBillData.billItems !== undefined && this.patientBillData.billItems.length > 0) {
                this.patientBillData.billItems.forEach(e => {
                    sum += (parseFloat(e.price) * parseFloat(e.qty));
                });
            }
            if(this.patientBillData.tax_total){
              sum += this.patientBillData.tax_total
            }
            this.patientBillData.total_amount = sum
        },
        billItemReset: function () {
             this.billItem = this.defaultBillingItemData();
        },
        cancelBillItem: function () {
          this.showAddForm = false
          this.visible=!this.visible
          this.billItem = this.defaultBillingItemData();
        },
        paymentLink(){

          if(this.patientBillData.billItems.length === 0 && this.woocommerceActive === 'off'){
            displayErrorMessage(this.formTranslation.patient_bill.payment_or_bill_item_error)
            return
          }
          post('send_payment_link', {id:this.encounterId})
            .then((response) => {
              displayMessage(response.data.message)
            })
            .catch((error) => {
              console.log('error', error);
            })
        }
    },
    watch: {
        'patientBillData.billItems': function () {
            this.updateBillTotal()
        },
        'patientBillData.total_amount': function () {
            this.patientBillData.actual_amount = this.patientBillData.total_amount - this.patientBillData.discount
        },
        'billItem.price': function () {
            this.billItem.qty = this.billItem.qty == '' ? 0 : this.billItem.qty;
            this.billItem.price = this.billItem.price == '' ? 0 : this.billItem.price;
            this.billItem.total = isNaN(parseFloat(this.billItem.price) * parseFloat(this.billItem.qty)) ? 0 : parseFloat(this.billItem.price) * parseFloat(this.billItem.qty);
        },
        'billItem.qty': function () {
            this.billItem.qty = this.billItem.qty == '' ? 0 : this.billItem.qty;
            this.billItem.price = this.billItem.price == '' ? 0 : this.billItem.price;
            this.billItem.total = isNaN(parseFloat(this.billItem.price) * parseFloat(this.billItem.qty)) ? 0 : parseFloat(this.billItem.price) * parseFloat(this.billItem.qty);
        },
        'patientBillData.discount': function () {
            this.patientBillData.actual_amount = this.patientBillData.total_amount - this.patientBillData.discount
        },
        encounterId(newVal) {
            this.patientBillData.encounter_id = newVal;
        }
    },
    computed:{
      userData() {
        if(this.$store.state.userDataModule !== undefined && this.$store.state.userDataModule.user !== undefined) {
          return this.$store.state.userDataModule.user;
        } else {
          return [];
        }
      },
    }
}
</script>