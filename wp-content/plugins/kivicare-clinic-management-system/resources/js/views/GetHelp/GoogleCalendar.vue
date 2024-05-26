<template>
    <div class="row">
        <div class="col-md-12">
             <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                <div class="row">
                    <div class="col-md-8">
                        <h2 class="text-primary">  Google Calendar </h2>
                    </div>
                    <div class="col-md-4">
                        <a class="btn btn-sm btn-primary ext-primary float-right" href="https://apps.iqonic.design/docs/product/kivicare/google-calendar/" target="_blank" rel="noopener noreferrer"> <i class="fas fa-external-link-alt"></i> Google Calendar Documentation </a>
                    </div>
                </div>
                <div class="row p-3">
                    <div class="col-md-12">
                        <p>
                            For setting up a <b> Google Calendar (Appointment reminder) </b> in kivicare setup we have provide a setup option in Pro Setting tab.
                            You just nedd to enable google calendar service and fillup the Api key details. 
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
        init: function () {
        }   
    },
}
</script>