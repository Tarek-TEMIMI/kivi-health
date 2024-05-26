<template>
    <b-row>
        <b-col sm="12">
            <div id="bill">
                <div class="row">
                    <div class="col-md-6">
                        <h2 class="mb-0 ">{{ patientBillData.clinic !== undefined && patientBillData.clinic.name !== undefined ? patientBillData.clinic.name : '' }} </h2>
                        <h3 class="mb-0 font-weight-bold">{{formTranslation.patient_bill.invoice_id}} <span class="text-primary">#{{ patientBillData.id }}</span> </h3>
                        <h4 class="mb-0 "><span class="font-weight-bold"> {{formTranslation.patient_bill.created_at}} </span> {{ patientBillData.created_at }}</h4>
                    </div>
                    <div class="col-md-6 text-right">
                        <p class="mb-0 ">{{ patientBillData.clinic.address }}, {{ patientBillData.clinic.city }}, {{ patientBillData.clinic.postal_code }}</p>
                        <p class="mb-0 ">{{ patientBillData.clinic.email }}</p>
                        <p class="mb-0 mt-2">
                            {{formTranslation.patient_bill.payment_status}}
                            <span class="badge badge-success" v-if="patientBillData.payment_status == 'paid'">{{formTranslation.patient_bill.paid}}</span>
                            <span class="badge badge-danger" v-if="patientBillData.payment_status == 'unpaid'">{{formTranslation.patient_bill.unpaid}}</span>
                        </p>
                    </div>
                </div>
                <hr class="my-3">
                <div class="row">
                    <div class="col-md-12">
                        <h3>{{formTranslation.patient_bill.patient_details}}</h3>
                    </div>
                    <div class="col-md-12">
                        <table class="table table-sm custom-table">
                            <thead class="thead-light">
                            <tr>
                                <th>{{formTranslation.patient.patient_name}}</th>
                                <th>{{formTranslation.common.gender}}</th>
                                <th>{{formTranslation.common.dob}}</th>
                            </tr>
                            </thead>
                            <tbody class="text-capitalize">
                            <tr>
                                <td>{{ patientBillData.patient.display_name }}</td>
                                <td>{{ patientBillData.patient.gender }}</td>
                                <td>{{  patientBillData.patient.dob }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <hr class="my-3">
                <div class="row">
                    <div class="col-md-12">
                        <h3>{{formTranslation.common.services}}</h3>
                    </div>
                    <div class="col-md-12">
                        <div class="table-responsive">
                            <table class="table custom-table">
                            <thead class="thead-light">
                            <tr>
                                <th>{{formTranslation.common.sr_no}}</th>
                                <th>{{formTranslation.common.item_name}}</th>
                                <th>{{formTranslation.common.price}}</th>
                                <th>{{formTranslation.common.quantity}}</th>
                                <th>{{formTranslation.common.total}}</th>
                            </tr>
                            </thead>
                            <tbody v-if="patientBillData.billItems !== undefined && patientBillData.billItems.length > 0">
                            <tr v-for="(billing_item, index) in patientBillData.billItems" :key="index">
                                <td>{{ ++index }}</td>
                                <td>{{ billing_item.item_id.label }}</td>
                                <td>{{clinic_currency_prefix}}{{ billing_item.price }}{{clinic_currency_postfix}}</td>
                                <td>{{ billing_item.qty }}</td>
                                <td>{{clinic_currency_prefix}}{{ billing_item.price * billing_item.qty }}{{clinic_currency_postfix}}</td>
                            </tr>
                            </tbody>
                            <tbody v-else>
                            <tr>
                                <td colspan="6"><h4 class="text-primary mb-0">{{formTranslation.common.no_records_found}}</h4></td>
                            </tr>
                            </tbody>
                            <tfoot v-if="!patientBillData.taxes || !patientBillData.taxes.length > 0">
                                <tr>
                                <th colspan="4" class="text-right">{{formTranslation.common.total}}</th>
                                <th>{{clinic_currency_prefix}}{{ patientBillData.total_amount }}{{clinic_currency_postfix}}</th>
                            </tr>
                            <tr>
                                <th colspan="4" class="text-right">{{formTranslation.patient_bill.discount}}</th>
                                <th >{{clinic_currency_prefix}}{{ patientBillData.discount }}{{clinic_currency_postfix}}</th>
                            </tr>
                            <tr>
                                <th colspan="4" class="text-right">{{formTranslation.patient_bill.amount_due}}</th>
                                <th >{{clinic_currency_prefix}}{{ patientBillData.actual_amount }}{{clinic_currency_postfix}}</th>
                            </tr>
                            </tfoot>
                        </table>
                        </div>
                    </div>
                </div>
                <hr class="my-3" v-if="patientBillData.taxes && patientBillData.taxes.length > 0">
                <div class="row" v-if="patientBillData.taxes && patientBillData.taxes.length > 0" >
                    <div class="col-md-12">
                        <h3>{{formTranslation.common.tax}}</h3>
                    </div>
                    <div class="col-md-12">
                        <div class="table-responsive">
                            <table class="table custom-table">
                                <thead class="thead-light">
                                <tr>
                                    <th>{{formTranslation.common.sr_no}}</th>
                                    <th></th>
                                    <th></th>
                                    <th>{{formTranslation.common.tax_name}}</th>
                                    <th></th>
                                    <th></th>
                                    <th colspan="2">
                                        <div class="text-right">
                                            {{formTranslation.service.charges}}
                                        </div>
                                    </th>
                                </tr>
                                </thead>
                                <tbody >
                                <tr v-for="(tax, index) in patientBillData.taxes" :key="index">
                                    <td>{{ ++index }}</td>
                                    <td></td>
                                    <td></td>
                                    <td>{{ tax.name }}</td>
                                    <td></td>
                                    <td></td>
                                    <td colspan="2" class="text-right">{{clinic_currency_prefix}}{{ tax.charges }}{{clinic_currency_postfix}}</td>
                                </tr>
                                </tbody>
                                <tr>
                                    <th colspan="6" class="text-right">{{formTranslation.common.total}}</th>
                                    <th class="text-right">{{clinic_currency_prefix}}{{ patientBillData.tax_total ?  patientBillData.total_amount - patientBillData.tax_total : patientBillData.total_amount }}{{clinic_currency_postfix}}</th>
                                </tr>
                                <tfoot>
                                    <tr v-if="patientBillData.tax_total">
                                    <th colspan="6" class="text-right">{{formTranslation.common.total + ' ' +formTranslation.common.tax}}</th>
                                    <th class="text-right">{{clinic_currency_prefix}}{{ patientBillData.tax_total }}{{clinic_currency_postfix}}</th>
                                </tr>
                                <tr>
                                    <th colspan="6" class="text-right">{{formTranslation.patient_bill.discount}}</th>
                                    <th class="text-right">{{clinic_currency_prefix}}{{ patientBillData.discount }}{{clinic_currency_postfix}}</th>
                                </tr>
                                <tr>
                                    <th colspan="6" class="text-right">{{formTranslation.patient_bill.amount_due}}</th>
                                    <th class="text-right">{{clinic_currency_prefix}}{{ patientBillData.actual_amount }}{{clinic_currency_postfix}}</th>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-end align-items-center">
            <button  class="btn btn-sm btn-primary" id="billPrint" v-b-tooltip.hover :title="formTranslation.patient.print" @click="printData()"  v-if="userData.addOns.kiviPro == true " >
                <i class="fa fa-print"></i>{{formTranslation.patient_bill.print}}
            </button>
              <button class="btn btn-sm btn-primary" v-b-tooltip.hover :title="formTranslation.common.cancel" @click="$emit('onBillCancel')">
                <i class="fa fa-times"></i> {{formTranslation.common.cancel}}</button>
            </div>
            <div id="editor"></div>
        </b-col>
    </b-row>
</template>

<script>
import {post,get} from "../../config/request";
export default {
    data: () => {
        return {
            services: [],
            patientBillData: {
                clinic:{
                    address:'',
                    city:'',
                    postal_code:''
                },
                patient:{
                    display_name:'',
                    gender:'',
                    dobL:new Date(),
                },
                total_amount:'',
                discount:'',
                actual_amount:''
            },
            woocommerceActive:'off',
            clinic_currency_prefix:'',
            clinic_currency_postfix:'',
        }
    },
    mounted() {
        this.init();
        if(this.clinic_extra.currency_prefix !== undefined && this.clinic_extra.currency_prefix != null){
            this.clinic_currency_prefix = this.clinic_extra.currency_prefix;
        }else if(this.clinic_extra.prefix !== undefined && this.clinic_extra.prefix != null){
            this.clinic_currency_prefix = this.clinic_extra.prefix;
        }else{
            this.clinic_currency_prefix = '';
        }

        if(this.clinic_extra.currency_postfix !== undefined && this.clinic_extra.currency_postfix != null){
            this.clinic_currency_postfix = this.clinic_extra.currency_postfix;
        }else if(this.clinic_extra.postfix !== undefined && this.clinic_extra.postfix != null){
            this.clinic_currency_postfix = this.clinic_extra.postfix;
        }else{
            this.clinic_currency_postfix = '';
        }
    },
    props: {
        encounterId : {
            type: [ String, Number ],
            default() {
                return 0
            }
        },
       clinic_extra:{
         type: [Object, Array,String],
       },
    },
    methods: {
        init: function () {
              get('patient_bill_detail', {
                encounter_id: this.encounterId
            })
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        if (response.data.data.length === 0) {
                            this.createBillButton = true;
                        } else {
                            this.createBillButton = false;
                            this.patientBillData = response.data.data
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.widgets.record_not_found);
                })
        },
        printData(){
          let but = $('#billPrint');
          but.prop('disabled', true);
          but.html(`<i class='fa fa-sync fa-spin'> </i>`);
          get('print_encounter_bill_detail', { id: this.encounterId,data:this.patientBillData } )
              .then((response) => {
                if (response.data.status !== undefined && response.data.status === true) {
                  $(response.data.data).printArea({});
                }
                setTimeout(() => {
                  but.prop('disabled', false);
                  but.html(`<i class='fa fa-print'> </i>`+this.formTranslation.patient_bill.print);
                }, 1000)
              }).catch((error) => {
            but.prop('disabled', false);
            but.html(`<i class='fa fa-print'> </i>`+this.formTranslation.patient_bill.print);
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
        paymentLink(){

        if( this.woocommerceActive == 'off'){
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
    computed: {
        userData() {
            return this.$store.state.userDataModule.user;
        },
      }
}
</script>

<style scoped>
 @media print {
   @page {
     margin: 10px;
   }
 }
</style>