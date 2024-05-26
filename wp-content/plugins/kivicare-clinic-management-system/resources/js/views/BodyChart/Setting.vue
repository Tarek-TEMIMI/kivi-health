<template>
    <div>
        <b-row>
            <b-col sm="12" md="12" lg="12">
                <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                    <template v-slot:header>
                        <b-row>
                            <b-col sm="8" md="8" lg="8">
                                <h2 class="mb-0">{{ $t('common.encounter_body_chart') + ' ' + $t('common.settings') }} <a v-if="request_status == 'off'" href="#" target="_blank"><i class="fa fa-question-circle"></i></a> </h2>
                            </b-col>
                        </b-row>
                    </template>
                </b-card>
            </b-col>
        </b-row>
        <b-overlay :show="userData.addOns.bodyChart != true" variant="white"
                 :opacity="overlayOpacity">
            <template #overlay>
                <overlay-message addon_type="bodyChart"></overlay-message>
            </template>
            <b-card class="card-body" header-tag="header" footer-tag="footer">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="theme" class="form-control-label">
                              {{$t('common.theme_mode')}} <span class="text-danger">*</span>
                            </label>
                            <div class="kivi-pr">
                                <multi-select
                                  deselect-label=""
                                  select-label=""
                                  v-model="setting_data.theme"
                                  id="theme"
                                  :options="themeOptions"
                                >
                                </multi-select>
                            </div>
                            <div v-if="submitted && !$v.setting_data.theme.required"
                                 class="invalid-feedback">{{ $t('common.theme_mode') + ' '+$t('patient_encounter.is_required')}}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="menuBarPosition" class="form-control-label">
                              {{$t('common.menu_bar_position')}} <span class="text-danger">*</span>
                            </label>
                            <div class="kivi-pr">
                                <multi-select
                                  deselect-label=""
                                  select-label=""
                                  v-model="setting_data.menuBarPosition"
                                  id="menuBarPosition"
                                  :options="positionOptions"
                                >
                                </multi-select>
                            </div>
                            <div v-if="submitted && !$v.setting_data.menuBarPosition.required"
                                 class="invalid-feedback">{{$t('common.theme_mode') + ' '+$t('patient_encounter.is_required')}}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="replaceOrNewAfterEditImage" class="form-control-label">
                              {{$t('common.image_handle_preference')}} <span class="text-danger">*</span>
                            </label>
                            <div class="kivi-pr">
                                <multi-select
                                  deselect-label=""
                                  select-label=""
                                  :custom-label="formatLabel"
                                  v-model="setting_data.replaceOrNewAfterEditImage"
                                  id="replaceOrNewAfterEditImage"
                                  :options="[ 'new','replace']"
                                >
                                </multi-select>
                            </div>
                            <div v-if="submitted && !$v.setting_data.replaceOrNewAfterEditImage.required"
                                 class="invalid-feedback">{{$t('common.image_handle_preference') + ' '+$t('patient_encounter.is_required')}}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="menu" class="form-control-label">
                              {{$t('common.menu_items')}} <span class="text-danger">*</span>
                            </label>
                            <div class="kivi-pr">
                                <multi-select
                                  deselect-label=""
                                  select-label=""
                                  v-model="setting_data.menu"
                                  id="menuBarPosition"
                                  :placeholder="formTranslation.common.select_menu_items"
                                  :options="menuOptions"
                                  label="label" 
                                  track-by="id"
                                  :multiple="true"
                                >
                                </multi-select>
                            </div>
                            <div v-if="submitted && !$v.setting_data.menu.required"
                                 class="invalid-feedback">{{$t('common.theme_mode') + ' '+$t('patient_encounter.is_required')}}
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="m-1">
                <div class="row">
                    <div class="col-md-12">
                        <h2>
                            {{ $t('common.image_template') }}
                        </h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <p class="font-weight-bold">
                            {{ $t('common.name') }}
                        </p>
                    </div>
                    <div class="col-md-4">
                        <p class="font-weight-bold">
                            {{ $t('common.image') }}
                        </p>
                    </div>
                    <div class="col-md-2">
                        <p class="font-weight-bold">
                            {{ $t('common.default') }}
                        </p>
                    </div>
                    <div class="col-md-2">
                        <p class="font-weight-bold">
                            {{ $t('common.action') }}
                        </p>
                    </div>
                </div>
                <div class="row" v-for="(index,key) in setting_data.defaultImageData" :key="key">
                    <div class="col-md-4">
                        <div class="form-group">
                            <input class="form-control" v-model="index.name" :placeholder="formTranslation.common.name">
                            <div v-if="submitted && !$v.setting_data.defaultImageData.$each[key].name.required"
                                 class="invalid-feedback">{{$t('common.name') + ' '+$t('patient_encounter.is_required')}}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <button class="btn btn-primary" type="button" :id="'body_chart_image_upload_' + key" @click.prevent="fileUpload(key)">{{ formTranslation.common.choose_file }}</button>
                                </div>
                                <label class="input-group-text file-label" :for="'body_chart_image_upload_' + key">{{ index.filename ? index.filename : $t('common.no_file_chosen') }}</label>
                            </div>
                            <!-- <a class="text-primary m-1" :href="index.url" v-if="index.url" target="_blank">
                                {{ index.filename }}
                            </a> -->
                            <div v-if="submitted && !$v.setting_data.defaultImageData.$each[key].url.required"
                                 class="invalid-feedback">{{$t('common.file') + ' '+$t('patient_encounter.is_required')}}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-group" v-if="index.id">
                            <label class="form-control-label d-flex justify-content-start align-items-center" style="gap:0.5rem;">
                                <input type="radio" v-model="setting_data.defaultImage" :value="index.id" style="transform: scale(1.5);">
                                <span>{{$t('common.default')}}</span>
                            </label>
                            <div v-if="submitted && !defaultImageDataSelected"
                                 class="invalid-feedback">{{$t('common.default') + ' '+$t('patient_encounter.is_required')}}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-sm btn-danger" v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt"  @click="removeImage(key)">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <button class="btn btn-sm btn-primary" @click="addNewImage">
                            {{ $t('common.add_new_image') }}
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 d-flex justify-content-end">
                        <button class="btn btn-primary" @click="saveSettingData" v-if="!loading">
                            <i class="fa fa-save"></i>
                            {{ $t('common.save') }}
                        </button>
                        <button class="btn btn-primary" v-else>
                            <i class="fa fa-spinner fa-spin"></i>
                            {{ $t('common.loading') }}
                        </button>
                    </div>
                </div>
            </b-card>
        </b-overlay>
    </div>
</template>
<script>
import {required,requiredIf} from "vuelidate/lib/validators";
import { post, get } from "../../config/request";
export default {
    data: () => {
        return {
            submitted: false,
            loading:false,
            request_status: window.request_data.link_show_hide ? window.request_data.link_show_hide : 'off',
            setting_data:{},
            menuOptions:[],
            positionOptions:[
                'top', 'bottom', 'left', 'right'
            ],
            themeOptions:[
                'BlackTheme','WhiteTheme'
            ],
            defaultImageDataSelected:true
        }
    },
    validations: {
        setting_data: {
            theme: {required},
            menu: { required },
            menuBarPosition: {required},
            defaultImageData:{
                $each: {
                    name: { required },
                    url: { required },
                }
            },
            replaceOrNewAfterEditImage : {required}
        }
    },
    mounted(){
        if(this.userData.addOns.bodyChart != true){
            return;
        }
        if( !['administrator'].includes( this.getUserRole() ) ) {
            this.$router.push({ name: "403"})
        }
        this.menuOptions = ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'].map( (value) => {
            return { id: value, label: value};
        } );
        this.setting_data = this.defaultSettingData();
        if(this.userData.addOns.bodyChart == true){
            this.getSettingData();
        }
    },
    methods:{
        defaultSettingData(){
            return {
                theme : 'WhiteTheme',
                replaceOrNewAfterEditImage:'new',
                menu: this.menuOptions,
                menuBarPosition:'left',
                defaultImageData:[],
                defaultImage:-1
            }
        },
        getSettingData(){
            get('get_body_chart_setting_data', {})
            .then((response) => {
              if (response.data.status !== undefined && response.data.status === true) {
                this.setting_data = response.data.data;
              }else{
                displayErrorMessage(response.data.message);
              }
            })
            .catch((error) => {
                console.log(error);
                displayErrorMessage(this.formTranslation.common.internal_server_error);
            })
        },
        saveSettingData(){
            if(this.userData.addOns.bodyChart != true){
                return;
            }
            this.loading = true;
            this.submitted = true;
            this.$v.$touch();
            if (this.$v.setting_data.$invalid) {
                this.loading = false;
                return;
            }
            if(this.setting_data.defaultImageData.length){
                let defaultImageExistInTemplateImage = this.setting_data.defaultImageData.some(index => parseInt(this.setting_data.defaultImage) === parseInt(index.id));
                if (!defaultImageExistInTemplateImage) {
                    this.loading = false;
                    this.defaultImageDataSelected = false;
                    return;
                }
            }
            this.submitted = false;
            post("save_body_chart_setting_data", {data:this.setting_data})
            .then((response) => {
                this.loading = false;
                if ( response.data.status !== undefined && response.data.status === true) {
                    displayMessage(response.data.message)
                }else{
                    displayErrorMessage(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
                this.loading = false;
                displayErrorMessage(this.formTranslation.common.internal_server_error)
            });

        },
        addNewImage(){
            this.setting_data.defaultImage = -1;
            this.setting_data.defaultImageData.push({
                name:'',
                id:'',
                url:'',
                filename:'',
                extension:'',
                mime:''
            })  
        },
        removeImage(index){
            $.confirm({
                title: this.formTranslation.clinic_schedule.dt_are_you_sure,
                content: this.formTranslation.common.image_delete_confirm_message,
                type: 'red',
                buttons: {
                    ok: {
                        text: this.formTranslation.common.yes,
                        btnClass: 'btn-danger',
                        keys: ['enter'],
                        action: () => {
                            this.setting_data.defaultImageData.splice(index, 1);
                        }
                    },
                    cancel: {
                        text:this.formTranslation.common.cancel
                    }
                }
            });
        },
        fileUpload(index){
            let custom_uploader = kivicareCustomImageUploader(this.formTranslation,'custom_field')
            custom_uploader.on('select', () => {
                let attachment = custom_uploader.state().get('selection').first().toJSON();
                let alreadyExist = this.setting_data.defaultImageData.some(imageData => parseInt(imageData.id) === parseInt(attachment.id));
                if (alreadyExist) {
                    displayErrorMessage(this.formTranslation.common.same_image_exist_in_template);
                    return;
                }
                this.$set(this.setting_data.defaultImageData, index, {
                    id: attachment.id,
                    url: attachment.url,
                    filename: attachment.filename,
                    mime:attachment.mime,
                    extension:attachment.subtype,
                    name:this.setting_data.defaultImageData[index] && this.setting_data.defaultImageData[index].name ? this.setting_data.defaultImageData[index].name :  attachment.name
                });
            });
            //Open the uploader dialog
            custom_uploader.open();
        },
        formatLabel(value){
            let options = {
                new : this.formTranslation.common.create_new_image,
                replace : this.formTranslation.common.replace_orginal_image
            }

            return options[value];
        }
    },
    computed:{
        userData() {
            return this.$store.state.userDataModule.user;
        }
    },
}
</script>
<style scoped>
    .file-label {
        min-width: 150px;
        max-width: 150px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        display: block;
    }
</style>