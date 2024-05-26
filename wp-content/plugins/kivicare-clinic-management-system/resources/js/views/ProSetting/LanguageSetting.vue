<template>
    <div>
        <b-row>
            <b-col sm="12">
                <form id="clinicForm" @submit.prevent="langView" :novalidate="true">
                    <b-card class="p-0 shadow"  header-tag="header" footer-tag="footer">
                        <template v-slot:header>
                            <b-row>
                                <b-col sm="12" md="8" lg="8">
                                    <h3 class="mb-0">{{formTranslation.pro_setting.custom_langauge_translation}} </h3>
                                </b-col>
                                <b-col sm="12" md="4" lg="4" >
                                    <div class="d-flex justify-content-end">
                                        <button type="button" class="btn btn-sm btn-primary" @click="$router.go(-1);">
                                            <i class="fa fa-angle-double-left"></i> {{formTranslation.common.back}}
                                        </button>
                                    </div>
                                </b-col>
                            </b-row>
                        </template>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                <h4 >
                                {{ formTranslation.common.loco_translate}}
                                </h4>
                                <label class="custom-toggle">
                                    <input
                                    type="checkbox"
                                    v-model="locoTranslateOn"
                                    @change="locoTranslate()"
                                    checked
                                    />
                                    <span
                                    class="custom-toggle-slider rounded-circle"
                                    data-label-off="No"
                                    data-label-on="Yes"
                                    ></span>
                                </label>
                                </div>
                            </div>
                        </div>
                      <div v-if="!locoTranslateOn">
                        <div class="row d-flex align-items-end">
                            <div class="col-md-4">
                                <div class="form-group">
                                <label class="form-control-label"> {{formTranslation.pro_setting.set_language}}</label>
                                <multi-select
                                    deselect-label=""
                                    select-label=""
                                    @select="langChange"
                                    v-model="selectedLang"
                                    :tag-placeholder="formTranslation.settings.tag_plh_option"
                                    id="lang_id"
                                    :placeholder="formTranslation.settings.plh_search"
                                    label="label"
                                    track-by="id"
                                    :options="langsOption"
                                ></multi-select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="name" class="form-control-label">
                                        {{formTranslation.pro_setting.add_new_langauge}} <span class="text-danger">*</span>
                                    </label>
                                    <!-- <select class="form-control" name="locale" id="language_to_translate" v-model="lang" >
                                        
                                    </select> -->
                                    <multi-select
                                        deselect-label=""
                                        select-label=""
                                        v-model="lang" 
                                        id="language"
                                        label="title"
                                        track-by="id"
                                        @select="onLanguageChange"
                                        :options="language"
                                    ></multi-select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="name" class="form-control-label">
                                    </label>
                                    <button  class="btn btn-primary" type="button" @click="saveLanguage" :disabled="isTranslating" > {{ (isTranslating ? formTranslation.common.loading : formTranslation.pro_setting.translate )  }} </button>
                                    <b-spinner variant="primary" label="Spinning" v-if="isTranslating"></b-spinner>
                                    <button  class="btn btn-primary" type="button" @click="languageFilters" > language filters </button>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="row" v-if="showNote">
                            <div class="custom-alert">
                                <b-alert show variant="warning">
                                    <h2 class="alert-heading"> {{formTranslation.common.important_note}} </h2>
                                    <p> Please add a permission to your <b> Kivicare_lang  </b> folder in <b> wp-conent/uploads/ </b>  </p>
                                    <b-button @click="hide"  variant="warning" class="m-1">
                                    {{formTranslation.i_understand}}
                                    </b-button>
                                </b-alert>
                            </div>
                        </div> -->
                        <!-- <div class="row">
                            <div class="col-md-12">
                                <div class="row d-flex align-items-end">
                                    <div class="col-md-8">
                                        <div class="form-group">
                                            <label for="name" class="col-md-4 form-control-label">
                                               {{formTranslation.pro_setting.add_new_langauge}} <span class="text-danger">*</span>
                                            </label>
                                            <multi-select
                                                deselect-label=""
                                                select-label=""
                                                v-model="lang" 
                                                id="language"
                                                label="title"
                                                track-by="id"
                                                @select="onLanguageChange"
                                                :options="language"
                                            ></multi-select>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <button  class="btn btn-primary" type="button" @click="saveLanguage" :disabled="isTranslating" > {{ (isTranslating ? formTranslation.common.loading : formTranslation.pro_setting.translate )  }} </button>
                                            <b-spinner variant="primary" label="Spinning" v-if="isTranslating"></b-spinner>
                                            <button  class="btn btn-primary" type="button" @click="languageFilters" > language filters </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> -->
                        <div class="row" v-if="filters">
                            <div class="col-md-12">
                                <span v-for="(json,key) in jsonData['en']" :key="key" >  
                                    <a type="button" class="btn btn-sm btn-primary mr-2 mt-2 mb-2 text-white"  :href="'#'+key" > {{ key }} </a>
                                </span>
                            </div>
                        </div>
                        <div class="row" v-if="show">
                            <form id="langSave"  @submit.prevent="saveLanguage" class="w-100">
                                <div class="col-md-12" >
                                    <div class="page-loader-section" v-if="isLanguageLoading">
                                        <loader-component-2></loader-component-2>
                                    </div>
                                    <!-- <div class="table-responsive mb-0" >
                                        <table class="table table-sm table-fixed">
                                            <thead class="thead-light">
                                                <tr>
                                                    <th class="col-sm-3">{{formTranslation.common.key}}</th>
                                                    <th class="col-sm-6">{{formTranslation.common.english}}</th>
                                                    <th class="col-sm-3">{{lang.title}}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <div v-for="(json,key) in jsonData['en']" :key="key"  >
                                                    <tr colspan="3" class="text-center p-2" :id="key" >  <h2 class="p-2"> {{key}} </h2> </tr>
                                                    <tr class="row" v-for="(json1,key1) in Object.keys(json)" :key="key1">
                                                        <td class="col-sm-3">{{json1}}</td>
                                                        <td class="col-sm-4">{{json[json1]}}</td>
                                                        <td class="col-sm-5"><input type ="text" class="form-control" v-model="jsonData[lang.id][key][json1]"  /></td>
                                                        <td style="display:none">{{key}}</td>
                                                    </tr>
                                                </div>
                                            </tbody>
                                        </table>
                                    </div> -->
                                    <b-card class="p-0 shadow" body-class="tanslation-key-scroll" header-tag="header" footer-tag="footer">
                                        <template v-slot:header>
                                            <div class="row text-primary">
                                                <div class="col-md-3 p-4">
                                                    <h3 class="text-primary">  {{ formTranslation.common.key }} </h3>
                                                </div>
                                                <div class="col-md-6 p-4">
                                                    <h3 class="text-primary"> {{ formTranslation.common.english }} </h3>
                                                </div>
                                                <div class="col-md-3 p-4">
                                                    <h3 class="text-primary"> {{ lang.title }} </h3>
                                                </div>
                                            </div>
                                        </template>
                                        <div class="row" v-for="(json,key) in jsonData['en']" :key="key"  >
                                            <div class="col-md-12">
                                                <div class="row"> 
                                                    <div class="col-md-12 text-center text-primary p-4 " :id="key" style="border:1px solid" > <b>  {{key}} </b> </div>
                                                </div>
                                                <div class="row p-3" v-for="(json1,key1) in Object.keys(json)" :key="key1">
                                                    <div class="col-md-3">
                                                        {{json1}}
                                                    </div>
                                                    <div class="col-md-4">
                                                        {{json[json1]}}
                                                    </div>
                                                    <div class="col-md-5">
                                                        <input type ="text" class="form-control" v-model="jsonData[lang.id][key][json1]"  />
                                                    </div>   
                                                </div>
                                            </div>
                                        </div>
                                    </b-card>
                                </div>
                            </form>
                        </div>
                      </div>
                    </b-card>
                    <button  class="btn btn-primary float-right mt-4" type="submit" >{{formTranslation.common.save}}</button> 
                </form>
            </b-col>
        </b-row>
    </div>
</template>
<script>
import {post} from "../../config/request";
export default {
    name: 'LanguageSetting',
    data: () => {
        return {
            locoTranslateOn: false,
            langsOption: [],
            show:false,
            lang: {
                title: "English",
                id: "en",
            },
            selectedLang: {
                label: "English",
                id: "en",
            },
            langTitle:'',
            jsonData:[],
            showNote:false,
            data:[],
            isLanguageLoading: true,
            isTranslating: false,
            filters: false,
            url:window.request_data.kiviCarePluginURL + 'resources/js/lang/en.json',
            locationUrl:'',
            language: [ { title: 'Abkhaz' , id : 'ab'},
                            { title: 'Afar' , id : 'aa'},
                            { title: 'Afrikaans' , id : 'af'},
                            { title: 'Akan' , id : 'ak'},
                            { title: 'Albanian' , id : 'sq'},
                            { title: 'Amharic' , id : 'am'},
                            { title: 'Arabic' , id : 'ar'},
                            { title: 'Aragonese' , id : 'an'},
                            { title: 'Armenian' , id : 'hy'},
                            { title: 'Assamese' , id : 'as'},
                            { title: 'Avaric' , id : 'av'},
                            { title: 'Avestan' , id : 'ae'},
                            { title: 'Aymara' , id : 'ay'},
                            { title: 'Azerbaijani' , id : 'az'},
                            { title: 'Bambara' , id : 'bm'},
                            { title: 'Bashkir' , id : 'ba'},
                            { title: 'Basque' , id : 'eu'},
                            { title: 'Belarusian' , id : 'be'},
                            { title: 'Bengali' , id : 'bn'},
                            { title: 'Bihari' , id : 'bh'},
                            { title: 'Bislama' , id : 'bi'},
                            { title: 'Bosnian' , id : 'bs'},
                            { title: 'Breton' , id : 'br'},
                            { title: 'Bulgarian' , id : 'bg'},
                            { title: 'Burmese' , id : 'my'},
                            { title: 'Catalan; Valencian' , id : 'ca'},
                            { title: 'Chamorro' , id : 'ch'},
                            { title: 'Chechen' , id : 'ce'},
                            { title: 'Chichewa; Chewa; Nyanja' , id : 'ny'},
                            { title: 'Chinese' , id : 'zh'},
                            { title: 'Chuvash' , id : 'cv'},
                            { title: 'Cornish' , id : 'kw'},
                            { title: 'Corsican' , id : 'co'},
                            { title: 'Cree' , id : 'cr'},
                            { title: 'Croatian' , id : 'hr'},
                            { title: 'Czech' , id : 'cs'},
                            { title: 'Danish' , id : 'da'},
                            { title: 'Divehi; Dhivehi; Maldivian;' , id : 'dv'},
                            { title: 'Dutch' , id : 'nl'},
                            { title: 'English' , id : 'en'},
                            { title: 'Esperanto' , id : 'eo'},
                            { title: 'Estonian' , id : 'et'},
                            { title: 'Ewe' , id : 'ee'},
                            { title: 'Faroese' , id : 'fo'},
                            { title: 'Fijian' , id : 'fj'},
                            { title: 'Finnish' , id : 'fi'},
                            { title: 'French' , id : 'fr'},
                            { title: 'Fula; Fulah; Pulaar; Pular' , id : 'ff'},
                            { title: 'Galician' , id : 'gl'},
                            { title: 'Georgian' , id : 'ka'},
                            { title: 'German' , id : 'de'},
                            { title: 'Greek, Modern' , id : 'el'},
                            { title: 'Guaraní' , id : 'gn'},
                            { title: 'Gujarati' , id : 'gu'},
                            { title: 'Haitian; Haitian Creole' , id : 'ht'},
                            { title: 'Hausa' , id : 'ha'},
                            { title: 'Hebrew (modern)' , id : 'he'},
                            { title: 'Herero' , id : 'hz'},
                            { title: 'Hindi' , id : 'hi'},
                            { title: 'Hiri Motu' , id : 'ho'},
                            { title: 'Hungarian' , id : 'hu'},
                            { title: 'Interlingua' , id : 'ia'},
                            { title: 'Indonesian' , id : 'id'},
                            { title: 'Interlingue' , id : 'ie'},
                            { title: 'Irish' , id : 'ga'},
                            { title: 'Igbo' , id : 'ig'},
                            { title: 'Inupiaq' , id : 'ik'},
                            { title: 'Ido' , id : 'io'},
                            { title: 'Icelandic' , id : 'is'},
                            { title: 'Italian' , id : 'it'},
                            { title: 'Inuktitut' , id : 'iu'},
                            { title: 'Japanese' , id : 'ja'},
                            { title: 'Javanese' , id : 'jv'},
                            { title: 'Kalaallisut, Greenlandic' , id : 'kl'},
                            { title: 'Kannada' , id : 'kn'},
                            { title: 'Kanuri' , id : 'kr'},
                            { title: 'Kashmiri' , id : 'ks'},
                            { title: 'Kazakh' , id : 'kk'},
                            { title: 'Khmer' , id : 'km'},
                            { title: 'Kikuyu, Gikuyu' , id : 'ki'},
                            { title: 'Kinyarwanda' , id : 'rw'},
                            { title: 'Kirghiz, Kyrgyz' , id : 'ky'},
                            { title: 'Komi' , id : 'kv'},
                            { title: 'Kongo' , id : 'kg'},
                            { title: 'Korean' , id : 'ko'},
                            { title: 'Kurdish' , id : 'ku'},
                            { title: 'Kwanyama, Kuanyama' , id : 'kj'},
                            { title: 'Latin' , id : 'la'},
                            { title: 'Luxembourgish, Letzeburgesch' , id : 'lb'},
                            { title: 'Luganda' , id : 'lg'},
                            { title: 'Limburgish, Limburgan, Limburger' , id : 'li'},
                            { title: 'Lingala' , id : 'ln'},
                            { title: 'Lao' , id : 'lo'},
                            { title: 'Lithuanian' , id : 'lt'},
                            { title: 'Luba-Katanga' , id : 'lu'},
                            { title: 'Latvian' , id : 'lv'},
                            { title: 'Manx' , id : 'gv'},
                            { title: 'Macedonian' , id : 'mk'},
                            { title: 'Malagasy' , id : 'mg'},
                            { title: 'Malay' , id : 'ms'},
                            { title: 'Malayalam' , id : 'ml'},
                            { title: 'Maltese' , id : 'mt'},
                            { title: 'Māori' , id : 'mi'},
                            { title: 'Marathi (Marāṭhī)' , id : 'mr'},
                            { title: 'Marshallese' , id : 'mh'},
                            { title: 'Mongolian' , id : 'mn'},
                            { title: 'Nauru' , id : 'na'},
                            { title: 'Navajo, Navaho' , id : 'nv'},
                            { title: 'Norwegian Bokmål' , id : 'nb'},
                            { title: 'North Ndebele' , id : 'nd'},
                            { title: 'Nepali' , id : 'ne'},
                            { title: 'Ndonga' , id : 'ng'},
                            { title: 'Norwegian Nynorsk' , id : 'nn'},
                            { title: 'Norwegian' , id : 'no'},
                            { title: 'Nuosu' , id : 'ii'},
                            { title: 'South Ndebele' , id : 'nr'},
                            { title: 'Occitan' , id : 'oc'},
                            { title: 'Ojibwe, Ojibwa' , id : 'oj'},
                            { title: 'Oromo' , id : 'om'},
                            { title: 'Oriya' , id : 'or'},
                            { title: 'Ossetian, Ossetic' , id : 'os'},
                            { title: 'Panjabi, Punjabi' , id : 'pa'},
                            { title: 'Pāli' , id : 'pi'},
                            { title: 'Persian' , id : 'fa'},
                            { title: 'Polish' , id : 'pl'},
                            { title: 'Pashto, Pushto' , id : 'ps'},
                            { title: 'Portuguese' , id : 'pt'},
                            { title: 'Quechua' , id : 'qu'},
                            { title: 'Romansh' , id : 'rm'},
                            { title: 'Kirundi' , id : 'rn'},
                            { title: 'Romanian, Moldavian, Moldovan' , id : 'ro'},
                            { title: 'Russian' , id : 'ru'},
                            { title: 'Sanskrit (Saṁskṛta)' , id : 'sa'},
                            { title: 'Sardinian' , id : 'sc'},
                            { title: 'Sindhi' , id : 'sd'},
                            { title: 'Northern Sami' , id : 'se'},
                            { title: 'Samoan' , id : 'sm'},
                            { title: 'Sango' , id : 'sg'},
                            { title: 'Serbian' , id : 'sr'},
                            { title: 'Scottish Gaelic; Gaelic' , id : 'gd'},
                            { title: 'Shona' , id : 'sn'},
                            { title: 'Sinhala, Sinhalese' , id : 'si'},
                            { title: 'Slovak' , id : 'sk'},
                            { title: 'Slovene' , id : 'sl'},
                            { title: 'Somali' , id : 'so'},
                            { title: 'Southern Sotho' , id : 'st'},
                            { title: 'Spanish; Castilian' , id : 'es'},
                            { title: 'Sundanese' , id : 'su'},
                            { title: 'Swahili' , id : 'sw'},
                            { title: 'Swati' , id : 'ss'},
                            { title: 'Swedish' , id : 'sv'},
                            { title: 'Tamil' , id : 'ta'},
                            { title: 'Telugu' , id : 'te'},
                            { title: 'Tajik' , id : 'tg'},
                            { title: 'Thai' , id : 'th'},
                            { title: 'Tigrinya' , id : 'ti'},
                            { title: 'Tibetan Standard, Tibetan, Central' , id : 'bo'},
                            { title: 'Turkmen' , id : 'tk'},
                            { title: 'Tagalog' , id : 'tl'},
                            { title: 'Tswana' , id : 'tn'},
                            { title: 'Tonga (Tonga Islands)' , id : 'to'},
                            { title: 'Turkish' , id : 'tr'},
                            { title: 'Tsonga' , id : 'ts'},
                            { title: 'Tatar' , id : 'tt'},
                            { title: 'Twi' , id : 'tw'},
                            { title: 'Tahitian' , id : 'ty'},
                            { title: 'Uighur, Uyghur' , id : 'ug'},
                            { title: 'Ukrainian' , id : 'uk'},
                            { title: 'Urdu' , id : 'ur'},
                            { title: 'Uzbek' , id : 'uz'},
                            { title: 'Venda' , id : 've'},
                            { title: 'Vietnamese' , id : 'vi'},
                            { title: 'Volapük' , id : 'vo'},
                            { title: 'Walloon' , id : 'wa'},
                            { title: 'Welsh' , id : 'cy'},
                            { title: 'Wolof' , id : 'wo'},
                            { title: 'Western Frisian' , id : 'fy'},
                            { title: 'Xhosa' , id : 'xh'},
                            { title: 'Yiddish' , id : 'yi'},
                            { title: 'Yoruba' , id : 'yo'},
                        { title: 'Zhuang, Chuang' , id : 'za'}]
        }
    },
    mounted() {
      if(!['administrator'].includes(this.getUserRole())) {
        this.$router.push({ name: "403"})
      }
        this.selectedLang = this.getLang;
        this.locationUrl = window.location.href;
        if(this.getLang.id == undefined){
            this.lang.id = this.lang.id
            this.lang.title =  this.lang.title;
        }else{
            this.lang.id = this.getLang.id
            this.lang.title =  this.getLang.label;
            this.show = true
        }
        this.show = true
        this.getJsonFile();   
        this.getAllLangOption();
        this.getTranslate();
    },
    methods:{
        getAllLangOption(){
            post("get_all_lang_option", {})
                .then((response) => {
                    if (
                        response.data.status !== undefined &&
                        response.data.status === true
                    ) {
                    this.langsOption = response.data.data.lang_option
                    } else {
                    displayErrorMessage(response.data.message);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                    this.submitted = false;
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
            });
        },
        langChange(lang) {
            var loginUser = this.$store.state.userDataModule.user;
            this.$i18n.locale = lang.id;
            post("update_language", { user_id: loginUser.ID, lang: lang })
                .then((response) => {
                if (
                    response.data.status !== undefined &&
                    response.data.status === true
                ) {
                    displayMessage(response.data.message);
                    this.selectedLang = response.data.data;
                    window.location.reload();
                }
                })
                .catch((error) => {
                console.log(error);
                });
        },
        languageFilters () {
            this.filters = !this.filters ;
        },
        langView(){
            this.langTitle = this.lang.title;
            this.show = true
            this.getJsonFile();
        },
        getJsonFile(){
            this.isLanguageLoading  = true ;
            post('get_json_file', {
                 filePath:window.request_data.kiviCarePluginURL,
                 current: this.lang.id
               })
                .then((response) => {
                    this.isLanguageLoading  = false ;
                    if (response.data.status !== undefined && response.data.status === true) {
                        this.jsonData = response.data.data
                    }
                })
                .catch((error) => {
                    this.isLanguageLoading  = false ;
                    console.log(error);
                    displayErrorMessage(this.formTranslation.widgets.record_not_found);
            })
        },
        hide(){
            this.showNote = false
        },
        showWarning(){
            this.showNote = true
        },
        saveLanguage(){
            this.isTranslating = true ;
             post('save_json_data', {
                 data:this.jsonData[ this.lang.id],
                 file_name: this.lang.id,
                 langTitle: this.lang.title
                })
                .then((response) => {
                    this.isTranslating = false ;
                    if (response.data.status !== undefined && response.data.status === true) {
                        displayMessage(response.data.message);
                        this.$store.dispatch("userDataModule/fetchUserData", {});
                        this.$i18n.locale =  this.lang.id;
                        window.location.href =this.locationUrl;
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    this.isTranslating = false ;
                    console.log(error);
                    displayErrorMessage(this.formTranslation.widgets.record_not_found);
            })
        },
        onLanguageChange(val) {
            this.lang = val ;
            let english = JSON.parse(JSON.stringify(this.jsonData['en'])); 
            this.jsonData[val.id] = english
            this.getJsonFile();
        },
        locoTranslate(){
        var state = this.locoTranslateOn;
        post("save_loco_translate", { locoState: state })
            .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
                // this.locoTranslateOn = response.data.data;
                displayMessage(response.data.message);
                window.location.reload();
                // this.$store.dispatch("userDataModule/fetchUserData", {});
            }
            })
            .catch((error) => {
            console.log(error);
            });
        },
        getTranslate(){
            var state = this.locoTranslateOn;
            post("get_loco_translate", { locoState: 0 })
                .then((response) => {
                if (
                    response.data.status !== undefined &&
                    response.data.status === true
                ) {
                    this.locoTranslateOn = response.data.data;
                    // this.$store.dispatch("userDataModule/fetchUserData", {});
                }
                })
                .catch((error) => {
                console.log(error);
                });
        },


        
    },
    computed: {
        userData() {
            return this.$store.state.userDataModule.user;
        },
        getLang() {
            return this.userData.get_lang;
        },
    },
    watch: {
        lang(val) {
        }
    }
}
</script>

<style scoped>
.tanslation-key-scroll {
    width: 100%;
    overflow-y: scroll;
    height: 500px;
}

</style>