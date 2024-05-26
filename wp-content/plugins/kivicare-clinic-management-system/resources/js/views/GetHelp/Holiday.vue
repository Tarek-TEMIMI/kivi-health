<template>
    <div class="row">
        <div class="col-md-12">
            <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                <div class="row">
                    <div class="col-md-8">
                        <h2 class="text-primary">Add Holiday </h2>
                    </div>
                </div>
                <div class="row p-3">
                    <div class="col-md-12">
                        <p>
                            If an holiday is set and they have an appointment between that holiday dates then all appointments will get cancelled and appointment cancelled mail/sms/whatsapp message will send to patients.
                        </p>
                        <p class="border p-2 text-muted"> 
                            <ul>
                                <li>
                                    sms/whatsapp only work in kivicare-pro only.
                                </li>
                                <li>
                                  Note:-  once an holiday is set and appointments get cancelled then cancelled appointments cannot be reverted.
                                </li>
                            </ul>
                        </p>
                    </div>
                </div>
            </b-card>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>