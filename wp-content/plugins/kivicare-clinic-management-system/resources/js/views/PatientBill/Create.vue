<template>
    <b-row>
        <b-col sm="12">
            <form id="patientBillDataForm" @submit.prevent="handleSubmit" :novalidate="true">
                <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                    <template v-slot:header>
                        <b-row>
                            <b-col sm="12" md="8" lg="8">
                                <h3 class="mb-0">{{ cardTitle }}</h3>
                            </b-col>
                            <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('patient_bill_list')">
                                <div class="float-right">
                                    <router-link class="btn btn-sm btn-primary" :to="{ name: 'patient-bill' }">
                                        <i class="fa fa-angle-double-left"></i> {{formTranslation.common.back}}
                                    </router-link>
                                </div>
                            </b-col>
                        </b-row>
                    </template>

                    <div class="row">
                        <div class="col-md-6">

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group row">
                                        <label for="title" class="col-md-4 form-control-label">
                                            {{formTranslation.patient_bill.bill_title}} <span class="text-danger">*</span>
                                        </label>
                                        <div class="col-sm-8">
                                            <input id="title"
                                                   :class="{ ' is-invalid': submitted && $v.patientBillData.title.$error }"
                                                   v-model="patientBillData.title" :placeholder="formTranslation.patient_bill.plh_enter_title"
                                                   required="required" name="title" type="text" class="form-control">
                                            <div v-if="submitted && !$v.patientBillData.title.required" class="invalid-feedback">
                                                {{formTranslation.patient_bill.bill_title_required}}
                                            </div>
                                        </div>
                                    </div>

                                    <hr>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <h4 class="text-primary mb-4">{{formTranslation.patient_bill.bill_items}}</h4>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <table class="table table-sm text-center table-bordered">
                                <thead class="thead-light">
                                <tr>
                                    <th>{{formTranslation.common.sr_no}}</th>
                                    <th>{{formTranslation.common.item_name}}</th>
                                    <th>{{formTranslation.common.price}}</th>
                                    <th>{{formTranslation.common.quantity}}</th>
                                    <th>{{formTranslation.common.total}}</th>
                                    <th>{{formTranslation.common.action}}</th>
                                </tr>
                                </thead>
                                <tbody v-if="patientBillData.billItems !== undefined && patientBillData.billItems.length > 0">
                                <tr v-for="(billing_item, index) in patientBillData.billItems" :key="index">
                                    <td>{{ ++index }}</td>
                                    <td>{{ billing_item.item_id.label }}</td>
                                    <td>{{ billing_item.price }}</td>
                                    <td>{{ billing_item.qty }}</td>
                                    <td>{{ billing_item.price * billing_item.qty }}</td>
                                    <td>
                                        <i class="fa fa-pen-fancy text-primary cursor-pointer mr-2"
                                           @click="editBillItem(index)"></i>
                                        <i class="fa fa-trash text-danger cursor-pointer"
                                           @click="deleteBillItem(index)"></i>
                                    </td>
                                </tr>
                                </tbody>
                                <tbody v-else>
                                <tr>
                                    <td colspan="6"><h4 class="text-primary mb-0">{{formTranslation.common.no_records_found}}</h4></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="row mt-4">
                        <div class="col-md-12">
                            <h4 class="text-primary mb-3">{{ billItemTitle }}</h4>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="item_id" class="form-control-label">{{formTranslation.common.service}} <span
                                        class="text-danger">*</span></label>
                                <multi-select
                                        deselect-label=""
                                        select-label=""
                                        v-model="billItem.item_id"
                                        id="item_id"
                                        :class="{ ' is-invalid': billItemSubmitted && $v.billItem.item_id.$error }"
                                        :tag-placeholder="formTranslation.patient_bill.tag_plh_service" :placeholder="formTranslation.patient_bill.plh_search"
                                        label="label" track-by="id" :options="services"
                                        @select="handleBillItemChange"
                                        @remove="handleBillItemUnselect"
                                        :taggable="true"></multi-select>
                                <div v-if="billItemSubmitted && !$v.billItem.item_id.required" class="invalid-feedback">
                                    {{formTranslation.patient_bill.service_required}}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="price" class="form-control-label">{{formTranslation.common.price}} <span
                                        class="text-danger">*</span></label>
                                <input id="price"
                                       :class="{ ' is-invalid': billItemSubmitted && $v.billItem.price.$error }"
                                       min="0"
                                       v-model="billItem.price" 
                                       :placeholder="formTranslation.patient_bill.plh_price"
                                       required="required" name="first_name" type="number" class="form-control">
                                <div v-if="billItemSubmitted && !$v.billItem.price.required" class="invalid-feedback">
                                    {{formTranslation.patient_bill.price_required}}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
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
                                <label id="total" class="form-control">{{ (billItem.qty * billItem.price) || 0 }}</label>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <div class="float-right">
                                <button class="btn btn-sm btn-primary" type="button" @click="addBillItem"
                                        v-html="billItemBtn"></button>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group row">
                                        <label for="total_amount" class="col-md-4 form-control-label">
                                            {{formTranslation.patient_bill.grand_total}} <span class="text-danger">*</span>
                                        </label>
                                        <div class="col-sm-8">
                                            <input id="total_amount"
                                                   readonly
                                                   disabled
                                                   :class="{ ' is-invalid': submitted && $v.patientBillData.total_amount.$error }"
                                                   v-model="patientBillData.total_amount" 
                                                   :placeholder="formTranslation.patient_bill.plh_total_amount"
                                                   required="required" name="total_amount" type="text" class="form-control">
                                            <div v-if="submitted && !$v.patientBillData.total_amount.required" class="invalid-feedback">
                                                {{formTranslation.patient_bill.grand_total_required}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group row">
                                        <label for="discount" class="col-md-4 form-control-label">
                                            {{formTranslation.patient_bill.discount}} <span class="text-danger">*</span> <span class="text-primary"><small>{{formTranslation.patient_bill.discount_amount}}</small></span>
                                        </label>
                                        <div class="col-sm-8">
                                            <input id="discount"
                                                   :class="{ ' is-invalid': submitted && $v.patientBillData.discount.$error }"
                                                   v-model="patientBillData.discount" 
                                                   :placeholder="formTranslation.patient_bill.plh_discount"
                                                   required="required" name="discount" type="number" min="0" class="form-control">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group row">
                                        <label for="actual_amount" class="col-md-4 form-control-label">
                                            {{formTranslation.patient_bill.amount}}
                                        </label>
                                        <div class="col-sm-8">
                                            <input id="actual_amount"
                                                   readonly
                                                   disabled
                                                   :class="{ ' is-invalid': submitted && $v.patientBillData.actual_amount.$error }"
                                                   v-model="patientBillData.actual_amount" 
                                                   :placeholder="formTranslation.patient_bill.plh_discount"
                                                   required="required" name="discount" type="number" min="0" class="form-control">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <template v-slot:footer>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="float-right">
                                    <button v-if="!loading" class="btn btn-primary" type="submit"
                                            v-html="buttonText"></button>
                                    <button v-else class="btn btn-primary" type="submit" disabled>
                                        <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
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
    import { required, numeric } from "vuelidate/lib/validators";
    import { post, get } from "../../config/request";
    import {validateForm} from "../../config/helper";

    export default {
        data: () => {
            return {
                cardTitle: 'Add bill',
                buttonText: '<i class="fa fa-plus"></i> Add',
                encounter_id: 0,
                patientBillData: {},
                services: [],
                billItem: {},
                loading: false,
                submitted: false,
                billItemTitle: 'Add item',
                billItemBtn: '<i class="fa fa-plus"></i> Add item',
                billItemSubmitted: false,
                billItemEdit: false,
            }
        },
        validations: {
            patientBillData: {
                title: { required },
                total_amount: { required },
                discount: { required },
                actual_amount: { required },
            },
            billItem: {
                item_id: { required },
                qty: { required },
                price: { required },
            }
        },
        mounted() {
            this.cardTitle = this.formTranslation.patient.add_bill;
            this.patientBillData = this.defaultMedicalRecordData();
            this.billing_item = this.defaultBillingItemData();

            this.init();
        },
        methods: {
            init: function () {

                if (this.$route.params.encounter_id !== undefined) {
                    this.patientBillData.encounter_id = this.$route.params.encounter_id;
                }

                /// Code for the Edit functionality...
                if (this.$route.params.id !== undefined) {
                    this.cardTitle = this.formTranslation.patient.edit_bill;
                    this.buttonText = '<i class="fa fa-save"></i> '+this.formTranslation.common.save;

                    post('patient_bill_edit', {
                        id: this.$route.params.id
                    })
                        .then((response) => {
                            if (response.data.status !== undefined && response.data.status === true) {
                                this.patientBillData = response.data.data
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            displayErrorMessage(this.formTranslation.widgets.record_not_found);
                        })
                }

                // Get dropdown data for Problem types
                get('get_static_data', {
                    data_type: 'services_with_price'
                })
                        .then((response) => {
                            if (response.data.status !== undefined && response.data.status === true) {
                                this.services = response.data.data;
                            } else {
                                displayErrorMessage(response.data.message)
                            }

                        })
                        .catch((error) => {
                            console.log(error);
                            displayErrorMessage(this.formTranslation.common.internal_server_error)
                        })


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

                if (validateForm("patientBillDataForm")) {

                    post('patient_bill_save', this.patientBillData)
                        .then((response) => {
                            this.loading = false;
                            if (response.data.status !== undefined && response.data.status === true) {
                                displayMessage(response.data.message);
                                this.$router.push({ name: 'patient-bill' });
                            } else {
                                displayErrorMessage(response.data.message)
                            }

                        })
                        .catch((error) => {
                            console.log(error);
                            this.loading = false;
                            displayErrorMessage(this.formTranslation.common.internal_server_error)
                        })
                }
            },
            addBillItem: function () {

                this.billItemSubmitted = true;

                this.$v.billItem.$touch();
                if (this.$v.billItem.$invalid) {
                    return;
                }
                if (!this.billItemEdit) {
                    if (this.patientBillData.billItems === undefined) {
                        this.patientBillData.billItems = [];
                    }

                    this.patientBillData.billItems.push(this.billItem);
                } else {
                    this.billItemEdit = false;
                }

                this.billItemTitle = this.formTranslation.patient_bill.bill_add_item;
                this.billItemBtn = '<i class="fa fa-plus"></i> '+this.formTranslation.patient_bill.add_item;
                this.billItem = this.defaultBillingItemData();

                this.billItemSubmitted = false;
            },
            editBillItem: function (index) {
                this.billItemTitle = this.formTranslation.common.edit_bill_items;
                this.billItemEdit = true;
                this.billItemBtn = '<i class="fa fa-save"></i> '+this.formTranslation.common.save_item;

                this.billItem = this.patientBillData.billItems[index - 1];
            },
            deleteBillItem: function (index) {
                if (this.patientBillData.billItems[index - 1] !== undefined) {
                    let billItemData = this.patientBillData.billItems[index - 1];
                    if (billItemData.id !== undefined) {
                        $.confirm({
                            title: this.formTranslation.clinic_schedule.dt_are_you_sure,
                            content: this.formTranslation.common.py_delete,
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
                                                }
                                            })
                                            .catch((error) => {
                                                if (error.response.data !== undefined && error.response.data.message !== undefined) {
                                                    displayErrorMessage(error.response.data.message);
                                                } else {
                                                    displayErrorMessage(this.formTranslation.common.internal_server_error);
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
                    }
                }
            },
            defaultMedicalRecordData: function () {
                return {
                    title: '',
                    encounter_id: 0,
                    total_amount: 0,
                    discount: 0,
                    actual_amount: '',
                    status: 0,
                    billItems: []
                }
            },
            defaultBillingItemData: function () {
                return {
                    item_id: {},
                    qty: 1,
                    price: 0,
                    total: this.billItem.price * this.billItem.qty
                }
            },
            handleBillItemChange: function (selectedOption) {
                this.billItem.price = selectedOption.price;
                this.billItem.qty = 1;
            },
            handleBillItemUnselect: function () {
                this.billItem.price = 0;
                this.billItem.qty = 1;
            }
        },
        watch: {
            'patientBillData.billItems': function () {
                var sum = 0;
                if (this.patientBillData.billItems !== undefined && this.patientBillData.billItems.length > 0) {
                    this.patientBillData.billItems.forEach(e => {
                        sum += (parseInt(e.price) * parseInt(e.qty));
                    });
                }
                this.patientBillData.total_amount = sum
            },
            'patientBillData.total_amount': function () {
                this.patientBillData.actual_amount = this.patientBillData.total_amount - this.patientBillData.discount
            },
            'patientBillData.discount': function () {
                this.patientBillData.actual_amount = this.patientBillData.total_amount - this.patientBillData.discount
            }
        }
    }
</script>
