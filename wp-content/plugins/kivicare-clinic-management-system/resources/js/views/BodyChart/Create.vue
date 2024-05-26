<template>
    <div>
        <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
            <template v-slot:header>
                <b-row>
                    <b-col sm="12" md="4" lg="4">
                        <h3 class="mb-0">{{$t('common.edit')+' '+$t('common.image')}}</h3>
                    </b-col>
                    <b-col sm="12" md="8" lg="8">
                        <div class="d-flex justify-content-end">
                            <button
                                type="button"
                                class="btn btn-sm btn-primary"
                                @click="$router.go(-1);"
                            >
                                {{$t('common.back')}}
                            </button>
                            <b-dropdown
                                variant="link"
                                no-caret
                                right
                                toggle-class="btn btn-sm btn-primary mr-2"
                                v-if="!loading && templateImage.length > 0 && kcCheckPermission('body_chart_select_template')"
                            >
                                <template v-slot:button-content>
                                    <button type="button" class="btn btn-sm btn-primary">
                                        {{$t('common.select_template')}}
                                    </button>
                                    <button class="d-none"></button>
                                </template>
                                <b-dropdown-item
                                    @click="selectTemplate(index)"
                                    v-for="(index,key) in templateImage"
                                    :key="key"
                                >
                                    <b-card
                                        :img-src="index.url"
                                        img-height="150"
                                        body-class="d-flex justify-content-center align-items-center"
                                        img-alt="Card image"
                                        img-left
                                        class="mb-3"
                                        :style="index.id == imageEditorOptions?.includeUI?.loadImage?.id ? 'border-color:var(--primary)' : '' "
                                    >
                                        <b-card-text>
                                            {{index.name}}
                                        </b-card-text>
                                    </b-card>
                                </b-dropdown-item>
                            </b-dropdown>
                            <button
                                type="button"
                                class="btn btn-sm btn-primary"
                                @click="selectImage"
                                v-if="!loading && kcCheckPermission('body_chart_upload_image')"
                            >
                                {{$t('common.upload_new_image')}}
                            </button>
                            <button
                                class="btn btn-sm btn-primary"
                                id="reload_image"
                                @click="reloadDefaultImage"
                                v-if="!loading && kcCheckPermission('body_chart_edit')"
                            >
                                {{$t('common.reset')}}
                            </button>
                            <b-dropdown
                                variant="link"
                                class="pr-0"
                                no-caret
                                right
                                toggle-class="btn btn-sm btn-primary"
                                v-if="!loading"
                                :open="buttonLoading"
                            >
                                <template v-slot:button-content>
                                    <button class="btn btn-sm btn-primary">
                                        {{ buttonLoading ? $t('Saving...') : $t('common.save') }}
                                    </button>
                                </template>
                                <b-dropdown-item
                                    @click="viewImage"
                                    v-if="kcCheckPermission('body_chart_view')"
                                >
                                    <i class="fas fa-eye"></i> {{ $t('common.view')}}
                                </b-dropdown-item>
                                <b-dropdown-item
                                    @click="downloadImage"
                                    v-if="kcCheckPermission('body_chart_download')"
                                >
                                    <i class="fas fa-download"></i> {{$t('common.download')}}
                                </b-dropdown-item>
                                <div v-if="kcCheckPermission('body_chart_save')">
                                    <b-dropdown-item v-if="buttonLoading">
                                        <i class="fa fa-sync fa-spin"></i> {{ $t('common.loading')}}
                                    </b-dropdown-item>
                                    <b-dropdown-item @click="saveImage" id="save_image" v-else>
                                        <i class="fas fa-save"></i> {{$t('common.save_image')}}
                                    </b-dropdown-item>
                                </div>
                            </b-dropdown>
                        </div>
                    </b-col>
                </b-row>
            </template>
        </b-card>
        <div class="row mb-2" v-if="!loading">
            <b-col sm="12" md="12" lg="12">
                <div class="accordion" role="tablist">
                    <b-card no-body class="mb-2">
                        <b-card-header header-tag="header" role="tab">
                            <div class="d-flex align-items-center setting-accorditon">
                                <b-button
                                    type="button"
                                    block
                                    variant="link shadow-none text-left"
                                    class="pl-1"
                                    v-b-toggle.collapse-1
                                >
                                    {{  $t('patient_encounter.encounter_details')   }}
                                </b-button>
                            </div>
                        </b-card-header>
                        <b-collapse id="collapse-1" accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                                <div class="row ml-2">
                                    <div class="col-md-6">
                                        <div class="mb-0">
                                            <strong>{{formTranslation.common.name}} : </strong>
                                            {{ encounterData.patient_name }}
                                        </div>
                                        <div class="mb-0">
                                            <strong
                                                >{{formTranslation.patient.unique_id}} :
                                            </strong>
                                            {{ encounterData.patient_unique_id }}
                                        </div>
                                        <div class="mb-0">
                                            <strong class="font-weight-bold">
                                                {{ formTranslation.common.email}} : </strong
                                            >{{ encounterData.patient_email }}
                                        </div>
                                        <div class="mb-0">
                                            <strong class="font-weight-bold">
                                                {{ formTranslation.patient_encounter.encounter_date}}
                                                : </strong
                                            >{{ encounterData.encounter_date }}
                                        </div>
                                        <div class="mb-0">
                                            <strong class="font-weight-bold">
                                                {{ formTranslation.common.address }} : </strong
                                            >{{ encounterData.patient_address || formTranslation.common.no_records_found}}
                                        </div>
                                    </div>
                                    <hr class="m-2 ml-0 d-md-none" />
                                    <div class="col-md-6">
                                        <div class="mb-0">
                                            <strong class="font-weight-bold"
                                                >{{$t('clinic.clinic_name')}} : </strong
                                            >{{ encounterData.clinic_name }}
                                        </div>
                                        <div class="mb-0">
                                            <strong class="font-weight-bold"
                                                >{{$t('doctor.doctor_name')}} : </strong
                                            >{{ encounterData.doctor_name }}
                                        </div>
                                        <div class="mb-0">
                                            <strong class="font-weight-bold"
                                                >{{$t('appointments.description')}} : </strong
                                            >{{ encounterData.description || $t('common.no_records_found') }}
                                        </div>
                                        <div class="mb-0 mt-1">
                                            <p class="mb-0 float-left">
                                                <span
                                                    class="badge badge-success p-2"
                                                    v-if="encounterData.status == 1"
                                                >
                                                    {{formTranslation.common.active}}</span
                                                >
                                                <span
                                                    class="badge badge-danger"
                                                    v-if="encounterData.status == 0"
                                                >
                                                    {{formTranslation.common.closed}}</span
                                                >
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-if="(encounterData.appointment_custom_field && encounterData.appointment_custom_field.length > 0) 
                            || (encounterData.appointment_report && encounterData.appointment_report.length > 0)"
                                >
                                    <hr class="mb-1" />
                                    <div class="row ml-2">
                                        <div
                                            class="col-md-6"
                                            v-if="encounterData.appointment_report && encounterData.appointment_report.length > 0"
                                        >
                                            <div class="mb-0">
                                                <strong
                                                    >{{formTranslation.patient.medical_report}}
                                                </strong>
                                            </div>
                                            <div
                                                v-for="(report, index) in encounterData.appointment_report"
                                                :key="index"
                                            >
                                                <div class="mt-2">
                                                    <a
                                                        variant="outline-primary"
                                                        v-b-tooltip.hover
                                                        :title="formTranslation.common.view_report"
                                                        :href="report.url"
                                                        target="_blank"
                                                    >
                                                        <i class="fas fa-external-link-alt mr-1"></i
                                                        >{{report.name}}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <hr class="m-2 ml-0 d-md-none" />
                                        <div
                                            class="col-md-6"
                                            v-if="encounterData.appointment_custom_field && encounterData.appointment_custom_field.length > 0"
                                        >
                                            <div class="mb-0">
                                                <strong
                                                    >{{formTranslation.patient_bill.other_info}}
                                                </strong>
                                            </div>
                                            <div
                                                v-html="customFieldContent(encounterData.appointment_custom_field)"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                </div>
            </b-col>
            <b-col sm="12" md="12" lg="12">
                <b-card no-body class="mb-2">
                    <b-card-header header-tag="header">
                        <div class="d-flex align-items-center text-primary">
                            <b-button
                                type="button"
                                block
                                variant="link shadow-none text-left"
                                class="pl-1"
                            >
                                {{  $t('Image details')   }}
                            </b-button>
                        </div>
                    </b-card-header>
                    <b-card-body>
                        <div class="row ml-2">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="image-title">
                                        {{ $t('common.image_title') }}
                                        <span class="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="imageEditorOptions.includeUI.loadImage.title"
                                        id="image-title"
                                        :placeholder="formTranslation.common.enter_image_title"
                                    />
                                    <div
                                        v-if="submitted && !$v.imageEditorOptions.includeUI.loadImage.title.required"
                                        class="invalid-feedback"
                                    >
                                        {{formTranslation.common.address_required}}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>
                                        {{ $t('common.image_description') }}
                                    </label>
                                    <textarea
                                        class="form-control"
                                        v-model="imageEditorOptions.includeUI.loadImage.description"
                                        id="image-title"
                                        :placeholder="formTranslation.common.enter_image_description"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </b-card-body>
                </b-card>
            </b-col>
            <div :class="'col-12 '+ imageEditorOptions.includeUI.themeMode">
                <tui-image-editor
                    ref="tuiImageEditor"
                    :options="imageEditorOptions"
                ></tui-image-editor>
            </div>
        </div>
        <div class="row" v-else>
            <div class="col-12" style="height: 400px">
                <loader-component-2></loader-component-2>
            </div>
        </div>
    </div>
</template>

<script>
import 'tui-color-picker/dist/tui-color-picker.css';
import 'tui-image-editor/dist/tui-image-editor.css';
import {required} from "vuelidate/lib/validators";
import ImageEditor from '@toast-ui/vue-image-editor/src/ImageEditor.vue';
import {post,get} from "../../config/request";
export default {
    name: "ImageEdit",
    components:{
        'tui-image-editor': ImageEditor
    },
    data:() => {
        return {
            imageEditorOptions:{
                cssMaxWidth: document.documentElement.clientWidth,
                cssMaxHeight: 768,
                usageStatistics:false,
                includeUI:{
                    loadImage:{
                        path: '',
                        name: 'SampleImage',
                        title: '',
                        description: ''
                    },
                    uiSize:{
                        width: "100%",
                        height: "1000px"
                    },
                    theme : {},
                    themeMode:'whiteTheme',
                    menuBarPosition:'left'
                }
            },
            encounterData:{},
            loading:true,
            buttonLoading:false,
            templateImage:[

            ],
            submitted:false
        }
    },
    validations: {
        imageEditorOptions: {
            includeUI: {
                loadImage:{
                    title: {required}
                }
            }
        }
    },
    mounted(){
        if(this.userData.addOns.bodyChart != true){
            return;
        }
        if( !this.$route.params.encounter_id && !this.$route.params.body_chart_id){
            this.$router.push({ name: "403"});
            return;
        }
        this.imageEditorOptions.includeUI.loadImage.encounter_id = this.$route?.params?.encounter_id ? this.$route.params.encounter_id : 0;
        this.imageEditorOptions.includeUI.loadImage.body_chart_id = this.$route?.params?.body_chart_id ? this.$route.params.body_chart_id : 0;
        this.init();
    },
    methods:{
        init(){
            const params = Object.assign( {}, this.imageEditorOptions.includeUI.loadImage );
            get('encounter_body_chart_data_edit', params )
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        const data = response.data.data;
                        this.templateImage = data.setting.defaultImageData;
                        this.encounterData = data.encounter_data;
                        this.imageEditorOptions.includeUI.menuBarPosition = data.setting.menuBarPosition;
                        this.imageEditorOptions.includeUI.menu = data.setting.menu;
                        this.imageEditorOptions.includeUI.themeMode = data.setting.theme;
                        this.imageEditorOptions.includeUI.theme = data.setting.theme_data;
                        this.imageEditorOptions.includeUI.locale = data.setting.langauge;
                        this.imageEditorOptions.includeUI.mobileDefaultHeight =  data.setting.mobile_default_height;
                        if(window.innerWidth <= 680 ){
                            this.imageEditorOptions.includeUI.menuBarPosition = 'bottom';
                            this.imageEditorOptions.includeUI.uiSize.height = this.imageEditorOptions.includeUI.mobileDefaultHeight;
                        }
                        this.imageEditorOptions.includeUI.locale = data.setting.langauge;
                        this.updateImageData(data.image)
                        this.loading = false;
                        setTimeout(() => {
                            this.loadImage()
                        },500)
                    } else {
                        this.loading = false;
                        displayErrorMessage(response.data.message)
                    }
                })
                .catch((error) => {
                    this.loading = false;
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error)
                })
        },
        selectImage: function() {
            let custom_uploader = kivicareCustomImageUploader(this.formTranslation)
            custom_uploader.on('select', () => {
                let attachment = custom_uploader.state().get('selection').first().toJSON();
                this.updateImageData(attachment);
                this.loadImage();
            });
            //Open the uploader dialog
            custom_uploader.open();
        },
        updateImageData(value){
            if(value.title){
                this.imageEditorOptions.includeUI.loadImage.title = value.title;
            }
            if(value.description){
                this.imageEditorOptions.includeUI.loadImage.description = value.description;
            }
            if(value.encounter_id){
                this.imageEditorOptions.includeUI.loadImage.encounter_id = value.encounter_id;
            }
            this.imageEditorOptions.includeUI.loadImage.url = value.url;
            this.imageEditorOptions.includeUI.loadImage.id = value.id;
            this.imageEditorOptions.includeUI.loadImage.mime = value.mime;
            this.imageEditorOptions.includeUI.loadImage.extension = value.extension ? value.extension : value.subtype;
            this.imageEditorOptions.includeUI.loadImage.name = value.name;
        },
        selectTemplate(value){
            this.updateImageData(value);
            this.loadImage();
        },
        downloadImage(){
            let imageName = this.imageEditorInstance.getImageName();
            let dataURL = this.imageEditorInstance.toDataURL();
            let blob, type;
            if (window.File && window.FileList && window.FileReader) {
                blob = this.base64ToBlob(dataURL);
                type = blob.type.split('/')[1];
                if (imageName.split('.').pop() !== type) {
                  imageName += '.' + type;
                }
                // Library: FileSaver - saveAs
                saveAs(blob, imageName); // eslint-disable-line
            } else {
                window.open().document.body.innerHTML = '<img src="' + dataURL + '">';
            }
        },
        viewImage(){
            let dataURL = this.imageEditorInstance.toDataURL();
            if (window.File && window.FileList && window.FileReader) {
                let blob = this.base64ToBlob(dataURL);
                let tempURL = URL.createObjectURL(blob);
                window.open(tempURL, '_blank');
            }else{
                window.open().document.body.innerHTML = '<img src="' + dataURL + '">';
            }
        },
        base64ToBlob(data) {
            let mimeString = '';
            let raw, uInt8Array, i, rawLength;
            let rImageType = /data:(image\/.+);base64,/;
            raw = data.replace(rImageType, function (header, imageType) {
                mimeString = imageType;
                return '';
            });
            raw = atob(raw);
            rawLength = raw.length;
            uInt8Array = new Uint8Array(rawLength); // eslint-disable-line

            for (i = 0; i < rawLength; i += 1) {
                uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], { type: mimeString });
        },
        saveImage(){
            if(!this.imageEditorInstance){
                return;
            }
            this.submitted = true;
            this.$v.$touch();
            if (this.$v.imageEditorOptions.$invalid) {
                return;
            }
            const params = Object.assign({},this.imageEditorOptions.includeUI.loadImage);
            params.image_path = this.imageEditorInstance.toDataURL();
            this.submitted = false;
            this.buttonLoading = true;
            post('encounter_body_chart_data_save', params)
                .then((response) => {
                    this.buttonLoading = false;
                    if (response.data.status !== undefined && response.data.status === true) {
                        displayMessage(response.data.message)
                        this.$router.go(-1);
                        // this.$router.push({name: 'patient-encounter.body-chart' ,params:{encounter_id:this.$route.params.encounter_id}})
                    } else {
                        displayErrorMessage(response.data.message)
                    }
                })
                .catch((error) => {
                    this.buttonLoading = false;
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error)
                })
        },
        reloadDefaultImage(){
            if(!this.imageEditorInstance){
                return;
            }
            this.imageEditorInstance.clearObjects();
            this.imageEditorInstance.clearUndoStack();
            this.imageEditorInstance.clearRedoStack();
        },
        loadImage(){
            if(!this.imageEditorInstance){
                return;
            }
            const image = this.imageEditorOptions.includeUI.loadImage;
            this.imageEditorInstance.clearObjects().then(() => {
                this.imageEditorInstance.loadImageFromURL(image.url , image.name).then(result => {
                    const height = result.newHeight > 1000 ? 1000 : result.newHeight + 170 ;
                    this.imageEditorInstance.ui.resizeEditor({
                        uiSize:{
                            width: '100%',
                            height: window.innerWidth <= 680 ? this.imageEditorOptions.includeUI.mobileDefaultHeight : (height + 'px')
                        },
                        imageSize:{
                            oldHeight: result.oldHeight,
                            oldWidth: result.oldWidth,
                            newHeight: result.newHeight,
                            newWidth: result.newWidth,
                        }
                    });
                    this.imageEditorInstance.ui.activeMenuEvent()
                }).catch(err => {
                    console.error("Something went wrong:", err);
                });
            });
        },
        customFieldContent(custom_fields){
            let customContent = ''
            custom_fields.forEach(function(key,index) {
                customContent += `<div class="mt-2"> <p class="mb-0"><span class="font-weight-bold">`
                customContent +=  key.label;
                customContent +=  `: </span>`;
                customContent +=  key.field_data !== null ? (Array.isArray(key.field_data) ? key.field_data.join(', ') : key.field_data) : ' ';
                customContent += `</p></div>`
            });
            return customContent
        },
    },
    computed:{
        imageEditorInstance(){
            return this.$refs.tuiImageEditor && this.$refs.tuiImageEditor.editorInstance ? this.$refs.tuiImageEditor.editorInstance : '';
        },
        userData() {
          return this.$store.state.userDataModule.user;
        },
    }

}
</script>

<style lang="scss" scoped>
$background-color_1: #fff;
$background-color_2: #151515;
.whiteTheme {
  &::v-deep {
    .tui-image-editor-container {
      .tui-image-editor-help-menu,
      .tui-image-editor-controls {
        background-color: $background-color_1 !important;
      }
    }
  }
}
.tui-image-editor-container {
  &::v-deep {
    .tui-image-editor-help-menu.bottom {
      height: 50px !important;
      width: 100% !important;
    }
    .tui-image-editor-help-menu.top {
      height: 50px !important;
      width: 100% !important;
      top: 0 !important;
    }
    .tui-image-editor-help-menu.left {
      height: 100% !important;
      width: 50px !important;
      flex-direction: column;
      left: 0 !important;
    }
    .tui-image-editor-help-menu.right {
      height: 100% !important;
      width: 50px !important;
      flex-direction: column;
      right: 0 !important;
    }
    .tie-btn-delete {
      display: none !important;
    }
    .tie-btn-deleteAll {
      display: none !important;
    }
    .tie-btn-reset {
      display: none !important;
    }
    .tui-image-editor-item {
      &:has(.tui-image-editor-icpartition) {
        display: none !important;
      }
    }
    .tui-image-editor-header-logo {
      display: none !important;
    }
    .tui-image-editor-header-buttons {
      display: none !important;
    }
    .editor-container.right {
      .tui-image-editor-help-menu {
        li {
          display: inline-block;
          margin: 4px auto;
        }
      }
    }
    .tui-image-editor-help-menu {
      background-color: $background-color_2 !important;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: unset !important;
      flex-direction: row;
    }
  }
  &::v-deep.top {
    .tui-image-editor-controls-logo {
      display: none !important;
    }
    .tui-image-editor-controls-buttons {
      display: none !important;
    }
  }
}
</style>
