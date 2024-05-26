<template>
    <div class="row kivicare_get_help">
        <div class="col-md-12">
             <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                <div class="row">
                    <div class="col-md-8">
                        <h2 class="text-primary"> SMS (Twilio) </h2>
                    </div>
                    <div class="col-md-4">
                        <a class="btn btn-sm btn-primary ext-primary float-right kivicare_external_link" href="https://apps.iqonic.design/docs/product/kivicare/pro-version/sms-notifications-twilio/" target="_blank" rel="noopener noreferrer"> <i class="fas fa-external-link-alt"></i> SMS intigration Documentation </a>
                    </div>
                </div>
                <div class="row p-3">
                    <div class="col-md-12">
                        <p>
                            For sending a SMS with kivicare we are providing  <a href="https://www.twilio.com/sms" target="_blank" rel="noopener noreferrer"> <b> Twilio SMS </b> <i class="fas fa-external-link-alt"></i> </a> support .
                        </p>
                        <p class="border p-2 text-muted"> 
                            <b> Note : </b> Set Twilio Geo Location Pemission with your Twilio account.
                                Basically you need to select country where you want to enable your SMS Service. 
                            <a href="https://www.twilio.com/console/sms/settings/geo-permissions" target="_blank" rel="noopener noreferrer"> <b> Enable Geo Locations </b> <i class="fas fa-external-link-alt"></i> </a> <br />
                        </p>
                        <p>
                            <b> Common issue with Free trial SMS setup with Twilio : </b> <br />
                            <b> With twilio free SMS trial you can send SMS on only verified number. </b> <br />
                                Here you can verify receiver's number with Twilio.
                            <a href="https://www.twilio.com/console/phone-numbers/verified" target="_blank" rel="noopener noreferrer"> <b> Verify receiver's number here </b> <i class="fas fa-external-link-alt"></i> </a>
                        </p>
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
        init: function () {
        }   
    },
}
</script>