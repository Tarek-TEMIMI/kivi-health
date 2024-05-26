<template>
    <div class="loader-page" v-if="loader">
        <img :src="loderImage" alt="Loader" v-if="loderImage !== ''" />
    </div>
</template>

<script>

export default {
    data: () => {
        return {
            loderImage: ''
        }
    },
    mounted() {
        this.init();
        this.loderImage = window.request_data.loaderImage;
    },
    methods: {
        init: function () {
        },
    },
    computed: {
        loader() {
            return this.$store.state.loader
        }
    }
}
</script>