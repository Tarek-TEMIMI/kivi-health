<template>
  <div class="text-center loader-2-container">
    <loading :active.sync="isLoading" 
              :can-cancel="false"
              :is-full-page="fullPage"
              color = 'var(--primary)'
             :loader="loader"
    ></loading>
  </div>
</template>
<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    props:{
      loader:{
        type:[String],
        default(){
          return 'spinner'
        }
      }
    },
    components: {
      Loading
    },
    mounted() {
        this.loderImage = window.request_data.loaderImage;
    },
    data : () => {
      return {
        fullPage: false,
        isLoading:true
      }
    }
  }
</script>