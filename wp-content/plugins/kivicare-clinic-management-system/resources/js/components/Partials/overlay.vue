<template>
  <div class="text-center">
    <a :href="href" target="_blank">
      <i class="fas fa-lock text-primary" style="font-size: 30px;"></i>
      <p id="cancel-label" v-html="kivicareProFeatureIcon(addon_type,message)"> </p>
    </a>
  </div>
</template>

<script>
export default {
  props:{
    addon_type:{
      type:[String],
      default(){
        return 'pro';
      }
    }
  },
  name: "overlay",
  data: () => {
    return {
      href:"https://codecanyon.net/item/kivicare-pro-clinic-patient-management-system-ehr-addon/30690654?s_rank=3",
      message:"Available In Pro"
    }
  },
  mounted() {

    let addons = {
      telemed: {
        href: "https://codecanyon.net/item/kivicare-telemed-addon/29363726?s_rank=9",
        message: "Available In Telemed Addon",
      },
      googlemeet: {
        href: "https://codecanyon.net/item/kivicare-google-meet-telemed-addon/35301137?s_rank=21",
        message: "Available In Googlemeet Addon",
      },
      app: {
        href: "https://codecanyon.net/item/kivicare-flutter-app-clinic-patient-management-system/30970616",
        message: "Available For Kivicare Flutter App",
      },
      bodyChart:{
          href: "",
          message: "Available In Encounter Body Chart Addon",
      }
    }
    this.href= addons[this.addon_type] ?  addons[this.addon_type].href : this.href
    this.message= addons[this.addon_type] ? addons[this.addon_type].message : this.message

  },
  methods:{

  }
}
</script>

<style scoped>

</style>