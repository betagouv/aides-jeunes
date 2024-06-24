<script setup lang="ts">
import SupportModalForm from "@/components/modals/support-modal-form.vue"
import { useStore } from "@/stores/index.js"
import { computed } from "vue"

const props = defineProps({
  benefit: {
    type: Object,
    required: true,
  },
})

const store = useStore()
const hide = () => {
  store.setModalState(undefined)
  console.log("hide")
}
const headerTitle = computed(() => {
  return "Prise de rendez-vous téléphonique"
})
</script>

<template>
  <dialog
    id="fr-modal-support"
    aria-labelledby="fr-modal-support-title"
    role="dialog"
    class="fr-modal"
  >
    <div class="fr-container fr-container--fluid fr-container-md">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-md-8 fr-col-lg-7">
          <div class="fr-modal__body">
            <div class="fr-modal__header">
              <h1
                id="fr-modal-support-title"
                class="fr-modal__title fr-pt-2w"
                >{{ headerTitle }}</h1
              >
              <button
                v-analytics="{ action: 'Fermé bouton', category: 'Email' }"
                class="fr-btn--close fr-btn"
                title="Fermer la fenêtre modale"
                aria-controls="fr-modal-support"
                @click="hide"
                >Fermer</button
              >
            </div>
            <SupportModalForm :benefit="benefit"></SupportModalForm>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
