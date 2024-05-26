<template>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card p-0">
                    <div class="card-header">{{formTranslation.widgets.example_component}}</div>
                    <button class="btn btn-primary" @click="handleRequest">{{formTranslation.common.handle_request}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => {
            return {
            }
        },
        mounted() {
            this.handleRequest();
        },
        methods: {
            handleRequest: function () {
                this.$store.dispatch('fetchDepartments', { self: this });
            }
        }
    }
</script>