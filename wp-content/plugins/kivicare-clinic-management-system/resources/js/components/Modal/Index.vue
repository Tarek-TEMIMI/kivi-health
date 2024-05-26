<template>
    <div>
    <b-modal
        no-close-on-esc no-close-on-backdrop
        :id="modalId"
        centered
        :size="modalSize"
        body-class="pt-0"
        v-model="openModal"
        v-if="openModal"
        :modal-class="['auth-modal-detail','appointment_auth' ].includes(modalId) ? 'kvp-modal' : '' " 
        :dialog-class="['auth-modal-detail','appointment_auth' ].includes(modalId) ? 'kv-dialog' : ''"
        :hide-footer="true">
      <template class="p-1" v-slot:modal-header="{ close }">
        <span v-if="modalId === 'appointment_auth'" v-html="modalTitle"></span>
        <h2 class="text-primary w-100 text-center" v-else>{{modalTitle}}</h2>
        <button type="button" aria-label="Close" class="close" @click="modalClose">×</button>
      </template>
      <slot></slot>
    </b-modal>
    </div>
</template>

<script>

export default {
  name: "ModalPopup",
  props: {
    openModal:{
        type:[Boolean],
        default(){
            return false;
        }
    },
    modalId:{
        type:[String],
        default(){
            return 'kivicarePopup';
        }
    },
    modalTitle:{
        type:[String],
        default(){
            return '';
        }
    },
    modalTitleHtml:{
        type:[String],
        default(){
            return '';
        }
    },
    modalSize:{
        type:[String],
        default(){
            return 'lg';
        }
    }
  },
  data: () => {
    return {
      
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function () {},
    modalClose(){
        this.$emit('closeModal');
    }
  },
  beforeDestroy() {},
}
</script>
<style scoped>

</style>