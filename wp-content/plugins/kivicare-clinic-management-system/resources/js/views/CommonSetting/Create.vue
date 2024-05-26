<template>
    <b-row>
        <b-col sm="12" md="12" lg="12">
            <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                <template v-slot:header>
                    <b-row>
                        <b-col sm="12" md="8" lg="8">
                            <h2 class="mb-0"> {{formTranslation.common.en_dis_module}}
                                <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#configurations" target="_blank"><i class="fa fa-question-circle"></i></a>
                            </h2>
                        </b-col>
                    </b-row>
                </template>
                <b-row>
                    <b-col sm="12" md="12" lg="12">
                       <ModuleConfig ref="moduleConfiguration" ></ModuleConfig>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="12" md="12" lg="12">
                        <div class="d-flex justify-content-end">
                            <b-button variant="primary" class=" mr-2" @click="saveCommonSettings" v-html="saveSettingBtn"></b-button>
                        </div>
                   </b-col>
                </b-row>
            </b-card>
        </b-col>
    </b-row>
</template>
<script>
    import ModuleConfig from "../../components/ModuleConfig/ModuleConfig";
    export default {
        components: { ModuleConfig },
        data: () => {
            return { 
                    saveSettingBtn: '<i class="fa fa-save"></i> Save',
                    request_status:'off',
                    }
        },
        mounted() {
          if(!['administrator'].includes(this.getUserRole())) {
            this.$router.push({ name: "403"})
          }
            saveSettingBtn: '<i class="fa fa-save"></i>'+ this.formTranslation.common.save;
            this.init ();
            this.getModule();
        },
        methods: {
            init: function () {},
            saveCommonSettings: function () { this.$refs.moduleConfiguration.saveSetting(); },
            getModule:function (){
                if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
                this.request_status = window.request_data.link_show_hide;
                }
            }
        }
    }
</script>