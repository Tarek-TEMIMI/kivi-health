<template>
    <div class="row">
        <div class="col-md-12">
             <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                <div class="row">
                    <div class="col-md-8">
                        <h2 class="text-primary ml-3 mt-3">  Multi-Language <sup style="color:red"> (Soft deprecated) </sup> </h2>
                    </div>
                    <!-- <div class="col-md-4">
                        <a class="btn btn-sm btn-primary ext-primary float-right" href="https://apps.iqonic.design/docs/product/kivicare/kivicare-telemed-add-on/admin/" target="_blank" rel="noopener noreferrer"> <i class="fas fa-external-link-alt"></i> Woocommerce Documentation </a>
                    </div> -->
                </div>
                <div class="row p-3">
                    <div class="col-md-12">
                        <p>
                            For changing a language in your kivicare setup you we have provided a change language option in Pro settings tab in <b> Settings page </b>.
                        </p>
                        <p>
                            You need to change text for your selected language manually from <b> Language setting tab </b> in <b> Settings page </b>. 
                        </p>
                        <p class="border p-2 text-muted"> 
                            <b> Note : </b> Kivicare plguin requires a folder permission on mention path <b> wp-content/uploads/kiviCare_lang </b> 
                        </p>
                        <p class="border p-2 text-muted"> 
                            <b> Common issue :  Kivicare dashboard blank ? </b> <br>  
                            This is happening because your kivicare setup has not given a appropriate permission for this <b> wp-content/uploads/kiviCare_lang </b> path. <br>
                            <b> Solution : </b> You need to manually copy language json files from plugin folder <b> resources/assets/lang </b> and paste it to <b> wp-content/uploads/kiviCare_lang </b> folder.
                        </p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <h2 class="text-primary ml-3 mt-3"> Wordpress Translation Plugin Support <sup style="color:red"> (New) </sup> </h2>
                    </div>
                </div>
                <div class="row p-3">
                    <div class="col-md-12">
                        <p>
                            You can change kivicare plugin text with the use of any wordpress translation plugin.
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
        init: function () {}   
    },
}
</script>