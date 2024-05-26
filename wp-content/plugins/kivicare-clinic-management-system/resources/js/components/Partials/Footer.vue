<template>
    <footer class="footer pt-0">
        <div class="row align-items-center justify-content-lg-between">
            <div class="col-lg-6">
                <div class="copyright text-center  text-lg-left  text-muted">
                    &copy; <a href="#" class="font-weight-bold ml-1" target="_blank">{{text}}</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>

export default {
    data: () => {
        return {

        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init: function () {},
    },
    computed:{
      text:function(){
        if(this.$store.state.date_format !== undefined){
          return this.$store.state.footer_copyright_text
        }
        return window.request_data.copyrightText;
      }
    }
}
</script>