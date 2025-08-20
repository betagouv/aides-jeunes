<script setup lang="ts">
import { onMounted, nextTick } from "vue"

onMounted(async () => {
  await nextTick()
  const modal = document.getElementById("modal")
  if (modal && window.dsfr) {
    // DSFR API : https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/modale/code-de-la-modale
    window.dsfr(modal).modal.disclose()
  }
})
</script>

<template>
  <dialog
    id="modal"
    role="dialog"
    class="fr-modal"
    aria-labelledby="Calcul des droits en cours"
    aria-modal="true"
    data-fr-concealing-backdrop="false"
  >
    <div class="fr-container fr-container--fluid fr-container-md">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
          <div class="fr-modal__body">
            <div class="fr-modal__content fr-my-4w fr-text--center">
              <slot />
              <div
                class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
                aria-hidden="true"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
