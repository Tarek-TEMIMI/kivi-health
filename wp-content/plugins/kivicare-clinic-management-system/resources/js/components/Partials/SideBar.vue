<template>
  <nav
    :class="`sidenav navbar navbar-vertical navbar-expand-xs ${mode == 'true' ? 'fixed-right' : ' fixed-left'} navbar-light bg-white`"
    id="sidenav-main" @mouseenter="handleMouseIn" @mouseleave="handleMouseOut">
    <div id="scrollbar-inner" class="scrollbar-inner">
      <!-- Brand -->
      <div class="sidenav-header  d-flex  align-items-center">
        <b-navbar-brand :to="{ name: 'dashboard' }" class="p-0">
          <img v-if="getSiteLogo != -1 && getSiteLogo != null && getSiteLogo != ''" :src="getSiteLogo"
            class="navbar-brand-img ml-2" alt="get">
          <img :src="logoURL" class="navbar-brand-img ml-2" alt="else" v-else>
        </b-navbar-brand>
        <div class=" ml-auto ">
          <!-- Sidenav toggler -->
          <div class="sidenav-toggler active" data-action="sidenav-unpin" data-target="#sidenav-main"
            @click="handleSideBarToggle">
            <div class="sidenav-toggler-inner">
              <i class="sidenav-toggler-line"></i>
              <i class="sidenav-toggler-line"></i>
              <i class="sidenav-toggler-line"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="navbar-inner kivicare-navbar-inner">
        <!-- Collapse -->
        <div class="collapse navbar-collapse" id="sidenav-collapse-main">
          <!-- Nav items -->
          <ul class="navbar-nav">
            <div v-for="(index, key) in sideBarJson" :key="key" v-if="sideBarTabWiseData(index, 'show')">
              <b-nav-item v-if="index.type === 'route'"
                :link-classes="(currentRouteModule === index.routeClass ? activeRouteClass : '')"
                :to="index.link === 'patient-medical-report_id' ? { name: index.link, params: { patient_id: userData.ID } } : { name: index.link }">
                <i :class="index.iconClass + ' text-primary'"></i>
                <span class="nav-link-text">{{ formTranslation.sidebar[index.routeClass] }}</span>
                <span
                  v-if="userData.addOns.kiviPro != true &&
                    ['clinic','tax', 'billings', 'clinic-revenue-reports', 'reports.reports', 'patient-medical-report_id', 'patient-clinic'].includes(index.link)"
                  v-html="kivicareProFeatureIcon('pro')">
                </span>
                <i class="fas fa-question-circle ml-1  text-danger"
                  v-if="index.link === 'doctor' && !(userData.doctor_available)" v-b-tooltip.hover
                  title="Please Add Doctor"></i>
                <i class="fas fa-question-circle ml-1  text-danger"
                  v-if="index.link === 'service' && !(userData.doctor_service_available)" v-b-tooltip.hover
                  title="Please Add Doctor Service"></i>
                <i class="fas fa-question-circle ml-1  text-danger"
                  v-if="index.link === 'doctor-session.create' && !(userData.doctor_session_available)" v-b-tooltip.hover
                  title="Please Add Doctor Session"></i>
              </b-nav-item>

              <div v-else-if="index.type == 'parent'">
                <b-nav-item :target="index.link" @click="dropDownToggler(index.link, $event)">
                  <i :class="index.iconClass + ' text-primary'"></i>
                  <span class="nav-link-text">{{ formTranslation.sidebar[index.routeClass] }}</span>
                  <span
                    v-if="userData.addOns.kiviPro != true &&
                      ['clinic','tax', 'billings', 'clinic-revenue-reports', 'reports.reports', 'patient-medical-report_id', 'patient-clinic'].includes(index.link)"
                    v-html="kivicareProFeatureIcon('pro')">
                  </span>
                  <i class="fas fa-question-circle ml-1  text-danger"
                    v-if="index.link === 'doctor' && !(userData.doctor_available)" v-b-tooltip.hover
                    title="Please Add Doctor"></i>
                  <i class="fas fa-question-circle ml-1  text-danger"
                    v-if="index.link === 'service' && !(userData.doctor_service_available)" v-b-tooltip.hover
                    title="Please Add Doctor Service"></i>
                  <i class="fas fa-question-circle ml-1  text-danger"
                    v-if="index.link === 'doctor-session.create' && !(userData.doctor_session_available)"
                    v-b-tooltip.hover title="Please Add Doctor Session"></i>
                  <span class="ml-auto">
                    <i class="fa fa-chevron-right " aria-hidden="true"></i>
                  </span>
                </b-nav-item>
                <b-collapse :visible="isCollapse" :id="index.link" :ref="'collapse-' + index.link">
                  <b-navbar-nav class="mx-3">
                    <b-nav-item v-for="(childrens_index, childrens_key) in index.childrens" :key="childrens_key"
                      v-if="sideBarTabWiseData(childrens_index, 'show')"
                      :link-classes="(currentRouteModule === childrens_index.routeClass ? activeRouteClass : '')"
                      :to="childrens_index.link === 'patient-medical-report_id' ? { name: childrens_index.link, params: { patient_id: userData.ID } } : { name: childrens_index.link }  ">
                      <i :class="childrens_index.iconClass + ' text-primary'"></i>
                      <span class="nav-link-text">{{ formTranslation.sidebar[childrens_index.routeClass] }}</span>
                      <span v-if="userData.addOns.kiviPro != true &&
                        ['encounter-template'].includes(childrens_index.link)" v-html="kivicareProFeatureIcon('pro')">
                      </span>
                      <i class="fas fa-question-circle ml-1  text-danger"
                        v-if="childrens_index.link === 'doctor' && !(userData.doctor_available)" v-b-tooltip.hover
                        title="Please Add Doctor"></i>
                      <i class="fas fa-question-circle ml-1  text-danger"
                        v-if="childrens_index.link === 'service' && !(userData.doctor_service_available)"
                        v-b-tooltip.hover title="Please Add Doctor Service"></i>
                      <i class="fas fa-question-circle ml-1  text-danger"
                        v-if="childrens_index.link === 'doctor-session.create' && !(userData.doctor_session_available)"
                        v-b-tooltip.hover title="Please Add Doctor Session"></i>
                    </b-nav-item>
                  </b-navbar-nav>
                </b-collapse>
              </div>
              <b-nav-item v-else :href="index.link" target="_blank">
                <i :class="index.iconClass + ' text-primary'"></i>
                <span class="nav-link-text">{{ index.label }}</span>
              </b-nav-item>
            </div>
          </ul>
        </div>
      </div>
    </div>
    <slot />
  </nav>
</template>
<script>

import { post } from "../../config/request";

export default {
  props: ['mode'],
  data: () => {
    return {
      patient_id: '',
      logoURL: '',
      settingOption: ['custom-field', 'static-data', 'static-data.create', 'static-data.edit', 'custom-field.create', 'custom-field.edit', 'clinic-schedule', 'notification.create', 'terms-condition.create', 'clinic-schedule.index', 'common-settings.create', 'clinic-schedule.create', 'clinic-schedule.edit'],
      activeRouteClass: 'router-link-exact-active router-link-active',
      homeUrl: window.request_data.homePage,
      moduleList: [],
      request_status: 'off',
      showSupportLink: 'off',
      isCollapse: false
    }
  },
  mounted() {
    this.init();
    setTimeout(() => { this.kiviPro }, 1000);
    this.logoURL = window.request_data.kiviCarePluginURL + 'assets/images/logo-banner.png';
    this.getModule();
    this.getRequestHelper();
  },
  methods: {
    dropDownToggler: function (id, $event) {
      $event.target.closest(".nav-item").classList.toggle('active')
      this.isCollapse = !this.isCollapse
    },
    // togglerActiveHandler: function (childrens, currentRouteModule) {

    //   childrens?.forEach(element => {
    //     if (element.routeClass.includes(currentRouteModule)) {
    //       return ;
    //     }
    //   });
    //   return false

    // },
    getRequestHelper: function () {
      if (window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== '') {
        this.showSupportLink = window.request_data.link_show_hide;
      }
    },
    init: function () {
      if (localStorage.getItem('sidebarToggle') === "false") {
        this.$store.commit('TOGGLE_SIDEBAR', false)
        this.handleMouseOut();
      } else {
        $('body').addClass('g-sidenav-show g-sidenav-pinned');
        this.$store.commit('TOGGLE_SIDEBAR', true)
      }

      new window.PerfectScrollbar('#sidenav-main', {
        wheelPropagation: false
      });
    },
    handleMouseOut: function () {
      if (!this.fullSideBar) {
        $('.sidenav .navbar-brand').hide();
        $('.sidenav-toggler').removeClass('active');
        $('body').removeClass('g-sidenav-show').addClass('g-sidenav-hidden');
        $('body').removeClass('g-sidenav-pinned');
      }
    },
    handleMouseIn: function () {
      if (!this.fullSideBar) {
        $('.sidenav .navbar-brand').show();
        $('body').addClass('g-sidenav-show').removeClass('g-sidenav-hidden');
      }
    },
    backToWordpress: function () {
      window.location = window.location.href.split("admin.php")[0];
    },
    handleSideBarToggle: function () {
      this.$store.commit('TOGGLE_SIDEBAR', !this.fullSideBar)
    },
    getModule: function () {
      if (window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== '') {
        this.request_status = window.request_data.link_show_hide;
      }
    },
    sideBarTabWiseData(data) {
      let status = false;
      if (data.show) {
        return data.show;
      }
      switch (data.routeClass) {
        case 'home':
          status = this.kcCheckPermission('home_page') && !(this.getUserRole() === 'administrator');
          break;
        case 'dashboard':
          status = true;
          break;
        case 'appointment_list':
          status = this.kcCheckPermission('appointment_list');
          break;
        case 'parent':
          status = this.kcCheckPermission('patient_encounter_list') || this.kcCheckPermission('encounters_template_list');
          break;
        case 'patient_encounter_list':
          status = this.kcCheckPermission('patient_encounter_list');
          break;
        case 'encounter_template':
          status = this.kcCheckPermission('encounters_template_list');
          break;
        case 'encounters_template_list':
          status = this.kcCheckPermission('encounters_template_list') && this.getUserRole() == 'doctor';
          break;
        case 'clinic':
          status = this.getUserRole() === 'administrator';
          break;
        case 'patient':
          status = this.kcCheckPermission('patient_list');
          break;
        case 'doctor':
          status = this.kcCheckPermission('doctor_list');
          break;
        case 'receptionist':
          status = this.kcCheckPermission('receptionist_list') && this.checkEnableModule('receptionist');
          break;
        case 'service':
          status = this.getUserRole() !== 'patient' && this.kcCheckPermission('service_list');
          break;
        case 'doctor_session':
          status = this.kcCheckPermission('doctor_session_list') && this.getUserRole() !== 'receptionist' && this.getUserRole() !== 'doctor';
          break;
        case 'tax':
            status = this.kcCheckPermission('tax_list');
          break;
        case 'billings':
          status = this.kcCheckPermission('patient_bill_list') && this.checkEnableModule('billing');
          break;
        case 'clinic-revenue-reports':
          status = this.getUserRole() === 'administrator' || this.getUserRole() === 'clinic_admin';
          break;
        case 'settings':
          status = this.getUserRole() === 'administrator';
          break;
        case 'clinic_settings':
          status = this.kcCheckPermission('settings') && ['clinic_admin', 'doctor', 'receptionist'].includes(this.getUserRole());
          break;
        case 'get_help':
          status = this.getUserRole() === 'administrator' && this.request_status == 'off';
          break;
        case 'get_pro':
          status = this.getUserRole() === 'administrator' && this.userData.addOns.kiviPro != true && this.request_status == 'off';
          break;
        case 'request_feature':
          status = this.getUserRole() === 'administrator' && this.request_status == 'off';
          break;
        case 'patient_medical':
          status = this.getUserRole() === 'patient' && this.kcCheckPermission('patient_report');
          break;
        // case 'patient_clinic':
        //   status = this.getUserRole() === 'patient' && this.kcCheckPermission('patient_clinic');
        //   break;
      }
      return status;
    }
  },
  watch: {
    fullSideBar(newVal) {
      if (newVal) {
        $('.sidenav-toggler').addClass('active');
        $('.sidenav-toggler').data('action', 'sidenav-unpin');
        $('body').removeClass('g-sidenav-hidden').addClass('g-sidenav-show g-sidenav-pinned');
        localStorage.setItem('sidebarToggle', true)
      } else {
        $('.sidenav-toggler').removeClass('active');
        $('.sidenav-toggler').data('action', 'sidenav-pin');
        $('body').removeClass('g-sidenav-pinned').addClass('g-sidenav-hidden');
        $('body').find('.backdrop').remove();
        localStorage.setItem('sidebarToggle', false)
      }
    },
    logout: function () {
      this.$store.dispatch("logout", { self: this })
    }
  },
  computed: {
    currentRouteModule: function () {
      if (window.innerWidth < 1500) {
        let wrapperMenu = document.querySelector('.main-content .sidenav-toggler')
        if (wrapperMenu) {
          wrapperMenu.classList.remove('active')
          document.querySelector('.main-content .sidenav-toggler').classList.remove('active')
          document.querySelector('body').classList.add('g-sidenav-hidden')
          localStorage.setItem('sidebarToggle', false)
        }
      }
      return this.$route.meta.module;
    },
    fullSideBar: function () {
      return this.$store.state.fullSideBar;
    },
    userData() {
      return this.$store.state.userDataModule.user;
    },
    teleMedEn() {
      return this.userData.addOns.telemed
    },
    kiviPro() {
      return this.userData.addOns.kiviPro
    },
    getSiteLogo() {
      return this.userData.site_logo
    },
    sideBarJson: function () {
      if (this.userData.dashboard_sidebar_data) {
        return this.userData.dashboard_sidebar_data;
      }
      return {}
    },
  }
}
</script>

<style>
body:not(.g-sidenav-pinned) .navbar-vertical.navbar-expand-xs:not(:hover) ul.navbar-nav.mx-3 {
  margin-inline: 0 !important;
}

.navbar-vertical.navbar-expand-xs .navbar-nav,
.nav-item .fa-chevron-right {
  transition: all 0.2s ease-in-out;
}

.nav-item.active .fa-chevron-right {
  transform: rotate(90deg);
}

.navbar-vertical .navbar-nav .nav-link {
  white-space: break-spaces
}
</style>