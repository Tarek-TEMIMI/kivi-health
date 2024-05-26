<template>
    <div class="row kivicare_get_help">
        <div class="col-md-12">
             <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                <div class="row">
                    <div class="col-md-8">
                        <h2 class="text-primary"> Kivicare Shortcode </h2>
                    </div>
                    <div class="col-md-4">
                        <!-- <a class="btn btn-sm btn-primary ext-primary float-right" href="https://apps.iqonic.design/docs/product/kivicare/kivicare-telemed-add-on/admin/#zoom-configuration" target="_blank" rel="noopener noreferrer"> <i class="fas fa-external-link-alt"></i> Kivicare Telemed Documentation </a> -->
                    </div>
                </div>
                <div class="row p-3">
                    <div class="col-md-12">
                        <ul>
                            <li>
                                <p> 
                                    <b id="shortcode-1" class="mr-3"> [bookAppointment] </b>  <i title='Copy Shortcode' @click="copyToClipboard('#shortcode-1')" style="cursor: copy;" class="fa fa-clipboard mr-3" aria-hidden="true"></i>
                                    <a href="https://apps.iqonic.design/docs/product/kivicare/widgets/book-appointment-widget/" target="_blank" rel="noopener noreferrer"> <i class="fas fa-external-link-alt"></i> overview </a> (Deprecated)
                                </p> 
                                <p>  With following shortcode Users can register/login and book appointment.  </p>
                            </li>
                            <li>
                                <p> 
                                    <b id="shortcode-2" class="mr-3" > [patientDashboard] </b> <i title='Copy Shortcode' @click="copyToClipboard('#shortcode-2')" style="cursor: copy;" class="fa fa-clipboard mr-3" aria-hidden="true"></i>
                                    <a href="https://apps.iqonic.design/docs/product/kivicare/widgets/patient-dashboard-widget/" target="_blank" rel="noopener noreferrer"> <i class="fas fa-external-link-alt"></i> overview </a> (Deprecated)
                                </p> 
                                <p>  With following shortcode patient can register,login, manage profile, manage password and book appointment. </p> 
                            </li>
                            <li>
                                <p> 
                                    <b id="shortcode-3" class="mr-3" > [kivicareBookAppointment] </b> <i title='Copy Shortcode' @click="copyToClipboard('#shortcode-3')" style="cursor: copy;" class="fa fa-clipboard mr-3" aria-hidden="true"></i>
                                    <a href="https://apps.iqonic.design/docs/product/kivicare/widgets/book-appointment-widget-customizable/" target="_blank" rel="noopener noreferrer"> <i class="fas fa-external-link-alt"></i> overview </a> 
                                </p> 
                                <p>  With following shortcode Users can register/login and book appointment. </p>
                            </li>
                            <li>
                                <p> 
                                    <b id="shortcode-4" class="mr-3" > [kivicareRegisterLogin] </b> <i title='Copy Shortcode' @click="copyToClipboard('#shortcode-4')" style="cursor: copy;" class="fa fa-clipboard mr-3" aria-hidden="true"></i>
                                    <!-- <a href="https://apps.iqonic.design/docs/product/kivicare/widgets/patient-dashboard-widget/" target="_blank" rel="noopener noreferrer"> <i class="fas fa-external-link-alt"></i> overview </a>  -->
                                </p> 
                                <p>  With following shortcode kivicare users ( doctor, patient and receptionist ) can register and login </p> 
                            </li>
                          <li>
                            <p>
                              <b id="shortcode-5" class="mr-3" > [kivicareBookAppointmentButton] </b> <i title='Copy Shortcode' @click="copyToClipboard('#shortcode-5')" style="cursor: copy;" class="fa fa-clipboard mr-3" aria-hidden="true"></i>
                              <a href="https://apps.iqonic.design/docs/product/kivicare/widgets/book-appointment-button-widget-customizable/" target="_blank" rel="noopener noreferrer"> <i class="fas fa-external-link-alt"></i> overview </a>
                            </p>
                            <p>  With following shortcode Users can register/login and book appointment In Popup Modal. </p>
                          </li>
                        </ul>
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
        init: function () {},
        copyToClipboard : function (element) {
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val($(element).text()).select();
            document.execCommand("copy");
            displayMessage('Shortcode copied successfully!');
            $temp.remove();
        },
    }
}
</script>