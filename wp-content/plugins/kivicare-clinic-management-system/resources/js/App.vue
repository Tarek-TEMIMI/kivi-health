<template>
    <div>
        <div v-if="formTranslationData !== undefined && formTranslationData.common !== undefined && formTranslation.common.clinic_is_required !== 'common.clinic_is_required' && userData.addOns !== undefined">
            <loader-component></loader-component>
            <div v-if="$route.meta.fullPage === undefined || $route.meta.fullPage === false">
                <SideBar :mode="getMode" />
                <Body />
            </div>
            <div class="container-fluid" v-else>
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
        <div v-else>
            <loader-component></loader-component>
        </div>
    </div>
</template>

<script>

import SideBar from "./components/Partials/SideBar";
import Body from "./components/Partials/Body";

export default {
    components: {
        SideBar,
        Body,
    },
    data: () => {
        return {
            tempColor: localStorage.getItem('temp_color'),
            backgroundImage: 'url('+pluginBASEURL + 'images/vendor/vue-phone-number-input/dist/flags.9c96e0ed.png)'
        }
    },
    watch: {
        'getMode': function (value) {
            if(value == 'true'){
                document.body.classList.add("rtl");
                var h1 = document.getElementsByTagName("html")[0];   // Get the first <h1> element in the document
                var att = document.createAttribute("dir");       // Create a "class" attribute
                att.value = "rtl";                           // Set the value of the class attribute
                h1.setAttributeNode(att);      
            } else {
                document.body.classList.remove("rtl");
                document.getElementsByTagName("html")[0].removeAttribute("dir");
            }
        },
        'getLang': function (value) {
             this.$i18n.locale = value.id;
        }
    },
    mounted() {
        this.init();
        if(window.request_data.current_user_role !== '' && window.request_data.current_user_role !== 'kiviCare_patient'){
          this.$store.dispatch("staticDataModule/fetchStaticData", {
            type: "static_data",
            static_data_type: "specialization"
          });
        }
        this.$store.dispatch("userDataModule/fetchDefaultClinic");
        this.$store.dispatch("logout_redirect_url",{data:window.request_data.logout_redirect_url});
        this.$store.commit("appointmentModule/FILE_UPLOAD_STATUS",{data:window.request_data.file_upload_status});
        this.$store.commit("appointmentModule/DESCRIPTION_STATUS",{data:window.request_data.description_status});
        this.$store.commit("appointmentModule/PATIENT_INFO_STATUS",{data:window.request_data.patient_detail_info_status});
        this.$store.commit("FETCH_DATE_FORMAT",{data:window.request_data.date_format});
        this.$store.commit("FETCH_FOOTER_COPYRIGHT_TEXT",{data:window.request_data.copyrightText});
        this.$store.commit("FETCH_WORDPRESS_LOGO",{data: {
          logo:window.request_data.wordpress_logo,
            status:window.request_data.wordpress_logo_status,
        }});

    },
    methods: {
        init: function () {
            $('.notice.notice-warning').remove();
            $('.notice.e-notice').remove();
            this.getDynamicTranslation()
          if(this.formTranslation.months_short !== undefined && this.formTranslation.months !== undefined){
            window.moment.updateLocale('en', {
              monthsShort : Object.values(this.formTranslation.months_short),
              months : Object.values(this.formTranslation.months)
            });
          }
        },
        getDynamicTranslation: function () {
            this.$store.dispatch("staticDataModule/fetchLangTranslateData", {
                filePath: window.request_data.kiviCarePluginURL,
                current: 'temp',
                module: ''
            });
        }
    },
    computed: {
        userData() {
            if(this.$store.state !== undefined) {
                return this.$store.state.userDataModule.user;
            }
        },
        getColor() {
            if(this.tempColor == '' || this.tempColor == null){
                return this.userData.theme_color;
            }
            return this.tempColor;
        },
        getLang() {
            return this.userData.get_lang;
        },
        getMode(){ 
            return this.userData.theme_mode
        },
        formTranslationData: function () {
            if(this.$store.state.staticDataModule.langTranslateData !== undefined ) {
                return this.$store.state.staticDataModule.langTranslateData ;
            }
        },
    }

//////////////////// Timeout Appointment //////////////////
export default {
  data() {
    return {
      timeoutInterval: null // Identifiant du timer
    };
  },
  mounted() {
    this.init(); // Votre méthode d'initialisation existante

    // Configurer l'intervalle pour vérifier les rendez-vous toutes les 5 minutes
    this.timeoutInterval = setInterval(() => {
      this.checkExpiredAppointments();
    }, 5 * 60 * 1000); // 5 minutes en millisecondes
  },
  methods: {
    // Méthode pour annuler les rendez-vous qui dépassent 60 minutes
    checkExpiredAppointments() {
      const now = new Date().getTime(); // Heure actuelle en millisecondes

      // Exemple : Parcourir les rendez-vous depuis le store Vuex
      this.$store.state.appointmentModule.appointments.forEach(appointment => {
        const createdAt = new Date(appointment.created_at).getTime();
        if (now - createdAt > 1 * 60 * 1000) { // 1s minutes en millisecondes
          this.$store.dispatch('appointmentModule/cancelAppointment', appointment.id);
        }
      });
    },

    // Votre méthode d'initialisation existante
    init() {
      // ...
    }
  },
  beforeDestroy() {
    // Supprimez l'intervalle pour éviter les fuites de mémoire
    clearInterval(this.timeoutInterval);
  }
}

}
</script>
<style>
.iti-flag{
  background-image: v-bind(backgroundImage) !important;
}
</style>
