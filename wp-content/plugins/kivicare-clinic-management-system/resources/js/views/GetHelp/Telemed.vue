<template>
    <div class="row kivicare_get_help">
        <div class="col-md-12">
             <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                <div class="row">
                    <div class="col-md-8">
                        <h2 class="text-primary">  Telemed  <small class="text-muted" > ( Zoom Intigration ) </small> </h2>
                    </div>
                    <div class="col-md-4">
                        <a class="btn btn-sm btn-primary ext-primary float-right kivicare_external_link" href="https://apps.iqonic.design/docs/product/kivicare/kivicare-telemed-add-on/admin/#zoom-configuration" target="_blank" rel="noopener noreferrer"> <i class="fas fa-external-link-alt"></i> Telemed Documentation </a>
                    </div>
                </div>
                <div class="row p-3">
                    <div class="col-md-12">
                        <p> 
                            Setting up a <b> Telemed </b> (Zoom) appointment booking for a doctor.
                            Doctor need to just follow few steps as mention below. We have also mention following steps in doctor detail page.
                            A <b> Administrator </b> OR <b> Clinic admin </b> can also do this for a doctor.
                        </p>
                        <p> 
                           When a doctor is done with saving the zoom Api keys & charges a doctor will get a <b> Telemed </b> service in his appointment services list. 
                        </p>
                        <p class="border p-2 text-muted"> 
                            <b> Note : </b> Service name Telemed cannot be changed.
                        </p>
                    </div>
                </div>
                <div class="row p-3">
                    <div class="col-md-7">
                        <div class="row">
                            <div class="col-md-12">
                                <h4 class="text-primary mb-3">{{formTranslation.doctor.zoom_configuration_guide}}</h4>
                            </div>
                        </div>
                        <b-list-group>
                            <b-list-group-item>{{formTranslation.doctor.zoom_step1}} 
                                <a href="https://marketplace.zoom.us/" target="_blank"> 
                                    {{formTranslation.doctor.zoom_market_place_portal}} 
                                </a>
                            </b-list-group-item>
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