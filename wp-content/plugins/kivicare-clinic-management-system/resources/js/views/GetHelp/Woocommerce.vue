<template>
    <div class="row">
        <div class="col-md-12">
             <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                <div class="row">
                    <div class="col-md-8">
                        <h2 class="text-primary">  Woocommerce Paymet Gateway </h2>
                    </div>
                    <div class="col-md-4">
                        <a class="btn btn-sm btn-primary ext-primary float-right" href="https://apps.iqonic.design/docs/product/kivicare/kivicare-telemed-add-on/admin/" target="_blank" rel="noopener noreferrer"> <i class="fas fa-external-link-alt"></i> Woocommerce Documentation </a>
                    </div>
                </div>
                <div class="row p-3">
                    <div class="col-md-12">
                        <p>
                            For setting up a woocommerce payment gateway with kivicare payment, You have a basic woocommmerce setup with any payment method on it.
                        </p>
                        <p>
                            By default woocommerce payment is  <b> Disabled </b> you need to <b> Enabled </b> it from <b> payment tab </b> in <b> Setting page </b>.
                        </p>
                        <p>
                            Appointment Service charges are considered for appointment's woocommerce payment.
                        </p>
                        <!-- <p class="border p-2 text-muted"> 
                            <b> Note : </b> Service name Telemed cannot be changed.
                        </p> -->
                    </div>
                </div>
             </b-card>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
        }
    },
    mounted() {
    },
    methods: {
        init: function () {}   
    },
}
</script>