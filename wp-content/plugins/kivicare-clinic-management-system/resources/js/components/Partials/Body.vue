<template>
    <div class="main-content" id="panel">
      <!-- code for sandbox demo -->
      <div v-if="demoPluginActive && getUserRole() === 'administrator'">
        
        <ModalPopup
          v-if="showQrcode"
          modalId="appointment-details-modal"
          modalSize="md"
          :openModal="showQrcode"
          :modalTitle="formTranslation.common.qrcode"
          @closeModal="showQrcode=false"
        >
        <div class="d-flex justify-content-center p-2">
              <VueQRCodeComponent  :text="qrUrl"></VueQRCodeComponent>
            </div>
            <div class="row p-2">
              <div class="col-12">
                <div class="form-group">
                  <input class="form-control" v-model="qrUrl"/>
                </div>
              </div>
            </div>
      </ModalPopup>
        <ModalPopup
          v-if="showChatBot"
          modalId="credentials"
          modalSize="md"
          :openModal="showChatBot"
          modalTitle="Demo User Credentials"
          @closeModal="showChatBot=false"
        >
        <div v-for="(item, key, index) in demoUser" :key="key">
              <hr class="m-2"/>
              <div class="row">
                <div class="col-12 text-center">
                  <h3 class="mb-0">{{ key}}</h3>
                </div>
              </div>
              <hr class="m-2"/>
              <div class="row m-2">
                <div class="col-12">
                  <p class="mb-0 ">
                 <span>
                  Email:
                  </span>
                    <span class="font-weight-bold" :id="'copy-text'+item+'email'">
                    {{ item + splitEmail + '@kivicare.com' }}
                  </span>
                    <span :title="formTranslation.common.copy" class="text-primary" @click.prevent="copyParentText(item + splitEmail + '@kivicare.com',$event)">
                    <i class="fas fa-copy"></i>
                  </span>
                  </p>
                </div>
                <div class="col-12">
                  <p class="mb-0 ">
                  <span>
                   Password:
                  </span>
                    <span class="font-weight-bold" :id="'copy-text'+item+'password'">
                    123456
                  </span>
                    <span :title="formTranslation.common.copy" class="text-primary" @click.prevent="copyParentText(123456,$event)">
                    <i class="fas fa-copy"></i>
                  </span>
                  </p>
                </div>
              </div>
            </div>
            <input type="text" id="modal-hidden-field" style="opacity:0"/>
      </ModalPopup>
      </div>
      <!-- sandbox demo code end  -->
        <!-- Topnav -->
        <nav class="navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom">
            <div class="container-fluid">
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <div class="navbar-search navbar-search-light form-inline mr-sm-3" v-if="getUserRole() === 'administrator'">
                    <a :href="adminUrl" target="_blank">
                            <span id="wp-logo" class="cursor">
                                <img :src="wordpress_logo_status ?  wordpressLogo : default_wordpress_logo" class="navbar-brand-img ml-2" alt="..." style="width:40px; height: 40px">
                                <b-tooltip placement="right" target="wp-logo" custom-class="my-tooltip-class">{{formTranslation.common.back_to_wordpress}}</b-tooltip>
                            </span>
                    </a>
                  </div>
                    <ul class="navbar-nav align-items-center">
                        <li class="nav-item d-xl-none">
                            <!-- Sidenav toggler -->
                            <div class="pr-3 sidenav-toggler sidenav-toggler-dark" @click="handleSideBarToggle">
                                <div class="sidenav-toggler-inner">
                                    <i class="sidenav-toggler-line"></i>
                                    <i class="sidenav-toggler-line"></i>
                                    <i class="sidenav-toggler-line"></i>
                                </div>
                            </div>
                        </li>
                    </ul>
                  <div v-for="(value ,key) in userData.head_external_toolbar" :key="key" >
                    <ul class="navbar-nav align-items-center ml-auto" v-if="value.link && value.label">
                      <li class="nav-item mr-2">
                        <a :href="value.link" target="_blank">
                          <span class="text-white" > <i :class="value.icon" v-if="value.icon"></i> {{ value.label }} </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                    <ul class="navbar-nav align-items-center ml-auto">
                      <li class="nav-item mr-2" v-if="getUserRole() == 'administrator' && demoPluginActive" @click.prevent="showQrcode = true">
                        <span class="text-white" > <i class="fa fa-qrcode"></i> QR for App </span>
                      </li>
                      <li class="nav-item mr-2" v-if="getUserRole() == 'administrator' && demoPluginActive" @click.prevent="showChatBot = true">
                        <span class="text-white"> <i class="fas fa-id-card"></i> Demo User Credentials </span>
                      </li>
                        <li class="nav-item" v-if="documentationLink == 'off' && getUserRole() == 'administrator'">
                            <a class="text-white" href="https://apps.iqonic.design/docs/product/kivicare/what-is-kivicare/" target="_blank" rel="noopener noreferrer"> <i class="fas fa-external-link-alt"></i> {{ formTranslation.common.documentation }} </a>   
                        </li>

                        <li class="nav-item" id="hero-navbar">
                            <b-dropdown variant="link" class="pr-0" no-caret right>
                                <template v-slot:button-content>
                                    <div class="media align-items-center">
                                        <span class="avatar avatar-sm rounded-circle">
                                            <img alt="img" :src="userData.profile_photo ? userData.profile_photo : adminImage" style="height:100%">
                                        </span>
                                        <div class="media-body  ml-2  d-none d-lg-block">
                                            <span class="mb-0 text-sm  font-weight-bold text-white text-capitalize">
                                                {{ getUserRole() == 'administrator' && demoPluginActive ? 'SuperAdmin' : displayUsername }}
                                            </span>
                                        </div>
                                    </div>
                                </template>
                                <b-dropdown-item :to="{ name: 'receptionist.profile'}"
                                                 v-if="kcCheckPermission('receptionist_profile') && getUserRole() === 'receptionist' ">
                                    <i class="fas fa-user"></i>  {{formTranslation.common.my_profile}}
                                </b-dropdown-item>
                                <b-dropdown-item :to="{ name: 'doctor.profile'}"
                                                 v-if="kcCheckPermission('doctor_profile') && getUserRole() === 'doctor'">
                                    <i class="fas fa-user-md"></i> {{formTranslation.common.my_profile}}
                                </b-dropdown-item>
                                <b-dropdown-item :to="{ name: 'patient.profile'}"
                                                 v-if="kcCheckPermission('patient_profile') && getUserRole() === 'patient'">
                                    <i class="fas fa-user-injured"></i> {{formTranslation.common.my_profile}}
                                </b-dropdown-item>
                                <b-dropdown-item :to="{ name: 'clinic.profile' }"
                                                 v-if="kcCheckPermission('clinic_profile') && (getUserRole() === 'clinic_admin' ||  getUserRole() === 'administrator')">
                                    <i class="fas fa-user"></i> {{formTranslation.common.my_profile}}
                                </b-dropdown-item>
                                <b-dropdown-item :to="{ name: 'account-setting.password' }"
                                                 v-if="kcCheckPermission('change_password')">
                                    <i class="fas fa-unlock-alt"></i> {{formTranslation.common.change_password}}
                                </b-dropdown-item>
                                <b-dropdown-item @click="logout">
                                    <i class="fas fa-sign-out-alt"></i> {{formTranslation.common.logout}}
                                </b-dropdown-item>
                            </b-dropdown>
                        </li>
                        <li class="nav-item" >
                          <div class="full-screen" id="full-screen">
                            <a href="#"  id="btnFullscreen">
                              <span class="mb-0 text-sm  font-weight-bold text-white text-capitalize">
                                <i class="fa fa-expand"></i>
                                <b-tooltip placement="right" target="btnFullscreen" custom-class="my-tooltip-class" triggers="hover" noninteractive>{{formTranslation.common.full_screen}}</b-tooltip>
                              </span>
                            </a>
                          </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <!-- Header -->
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row" v-if="teleMedWarning && getUserRole() === 'doctor'">
                        <div class="col-md-12 custom-alert">
                            <b-alert show dismissible variant="warning"><i class="fa fa-exclamation-triangle"></i> {{formTranslation.common.warning_zoom_configuration}} <router-link :to="{ name: 'doctor.zoom-configuration' }">{{formTranslation.common.zoom_configuration_link}}</router-link></b-alert>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Page content -->
        <div class="container-fluid mt--5"> 
            <div style="min-height: 70vh">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>

            <!-- Footer -->
            <Footer/>
        </div>
    </div>
</template>
<script>

import Footer from "./Footer";
import {fullScreen} from "../../config/helper";
import {post} from "../../config/request";
import VueQRCodeComponent from 'vue-qrcode-component'
import ModalPopup from '../Modal/Index'
export default {
    components: {
        Footer,
      VueQRCodeComponent,
      ModalPopup
    },
    data: () => {
        return {
          showChatBot:false,
          demoUser: {
            doctor: 'doctor_',
            Patient:'patient_',
            Receptionist:'receptionist_'
          },
            demoPluginActive:window.request_data.demo_plugin_active,
            adminImage: window.request_data.kiviCarePluginURL + 'assets/images/male-doctor.png',
            documentationLink: 'off',
            adminUrl: window.request_data.adminUrl,
          showQrcode:false,
          qrUrl:window.request_data.homePage + '?user=',
          splitEmail:'',
          default_wordpress_logo:window.request_data.kiviCarePluginURL + 'assets/images/wp-logo.png'
        }
    },
    mounted() {
        this.init();
        fullScreen();
        this.getRequestHelper();
        if(this.getUserRole()  === 'administrator'){
          this.splitEmail = this.userData.user_email.split('@')[0]
          this.qrUrl += this.splitEmail;
        }
    },
    methods: {
        init: function () {
            if (localStorage.getItem('sidebarToggle') === "false") {
                this.$store.commit('TOGGLE_SIDEBAR', false)
            } else {
                this.$store.commit('TOGGLE_SIDEBAR', true)
            }
            new window.PerfectScrollbar('#sidenav-main', {
                wheelPropagation: false
            });
        },
        copyParentText(value,event){
          $('#credentials i').removeClass('fa-clipboard');
          $('#credentials i').addClass('fa-copy');
          $('#credentials i').parent().attr('title','Copy');
          $(event.target).removeClass('fa-copy')
          $(event.target).addClass('fa-clipboard')
          $(event.target).parent().attr('title','Value Copied to clipboard');
          const elem = document.getElementById('modal-hidden-field');
          elem.value = value;
          elem.select();
          console.log(elem);
          document.execCommand("copy");
        },
        getRequestHelper:function(){
            if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
              this.documentationLink = window.request_data.link_show_hide;
            }
        },
        logout: function () {
            this.$store.dispatch("logout", {self: this})
        },
        backToWordpress: function () {
            window.location = window.location.href.split("admin.php")[0];
        },
        handleSideBarToggle: function () {
            this.$store.commit('TOGGLE_SIDEBAR', !this.fullSideBar)
        }
    },
    computed: {
        displayUsername() {
            return (this.$store.state.userDataModule.user !== undefined && this.$store.state.userDataModule.user.display_name ? this.$store.state.userDataModule.user.display_name : '')
        },
        fullSideBar: function () {
            return this.$store.state.fullSideBar;
        },
        userData() {
            return this.$store.state.userDataModule.user;
        },
        teleMedWarning() {
            return this.userData.teleMedWarning;
        },
      wordpressLogo:function(){
        if(this.$store.state.wordpress_logo !== undefined && this.$store.state.wordpress_logo.logo !== undefined){
          return this.$store.state.wordpress_logo.logo;
        }
        return window.request_data.wordpress_logo;
      },
      wordpress_logo_status:function (){
        if(this.$store.state.wordpress_logo !== undefined && this.$store.state.wordpress_logo.status !== undefined){
          return ['1','true'].includes(this.$store.state.wordpress_logo.status) && this.userData.addOns.kiviPro
        }
        return false;
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
        }
    }
}
</script>
