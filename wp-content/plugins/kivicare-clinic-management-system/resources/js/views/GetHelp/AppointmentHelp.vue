<template>
    <div class="row">
        <div class="col-md-12">
             <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                 <p class="border p-2 text-muted">
                    <b>Note :- </b> If Woocommerce payment settings is toggle on, then appointment message sent through Email/SMS/Whatsapp after payment successfully done by patient And this feature is only available on Kivicare-Pro.
                 </p>
                <div class="row">
                    <div class="col-md-8">
                        <h2 class="text-primary"> Restrict Advance Appointment Booking </h2>
                    </div>
                </div>
                <div class="row p-3">
                    <div class="col-md-12">
                        <p>
                            <ul>
                                <li>
                                    <b> Open booking days :- </b> As consideration of current date booking already opened as mentioned days in settings. <br/>
                                </li>
                                <li>
                                    <b> Close booking days :- </b> As consideration of current date booking already closed as mentioned days in settings.  <br /><br />
                                </li>
                            </ul>
                            <b> Example: </b> <br/>
                            current Date => 25 November<br/>
                            Pre-booking  => 10 days , so patient/doctor/receptionist can't select the date from 25 November to 5 December.<br/>
                            Post-booking => 10 days, so patient/doctor/receptionist can't select the date after 5 December.<br/>
                        </p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-8">
                        <h2 class="text-primary"> File Upload Setting </h2>
                    </div>
                </div>
                <div class="row p-3">
                    <div class="col-md-12">
                        <p>
                            If <b>Appointment File Upload </b>toggle is on, then patient can add their reports at the time of booking an appointment. <br/>
                        </p>
                        <p class="border p-2 text-muted"> 
                            <b>Note :- </b> If kivicare pro version is activate then patients can add more then one report, else patients can only add one report at a time while booking an appointment. <br />
                        </p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-8">
                        <h2 class="text-primary">Appointment Reminder</h2>
                    </div>
                </div>
                <div class="row p-3">
                    <div class="col-md-12">
                        <p>
                            <ol>
                                <li>
                                    <b>Appointment Email Reminder :- </b> If the toggle is on ,Then an <b>Appointment Email Reminder</b> will be send to <b>patient</b> through <b>Email</b>. <br/>
                                </li>
                                <li>
                                    <b>Appointment Sms Reminder :- </b> If the toggle is on ,Then an <b>Appointment Sms Reminder</b> will be send to <b>patient</b> through <b>SMS</b>. <br/>
                                </li>
                                <li>
                                    <b>Appointment Whatsapp Reminder :- </b> If the toggle is on ,Then an <b>Appointment Whatsapp Reminder</b> will be send to <b>patient</b> through <b>WhatsApp</b>. <br/>
                                </li>
                            </ol>
                        </p>
                        <p class="border p-2 text-muted">
                             
                                    <b>Note :- </b> Appointment Sms Reminder and Appointment Whatsapp Reminder, Required Kivicare-Pro to be Activated and also from pro settings :-  toggle on WhatsApp and  SMS, for access Appointment Sms Reminder and Appointment Whatsapp Reminder, this two setting is required to toggle on.<br />
                            
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