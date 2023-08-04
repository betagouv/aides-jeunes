<template>
  <dialog
    aria-labelledby="Calcul des droits en cours"
    role="dialog"
    class="fr-modal fr-modal--opened"
    open="true"
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

<script lang="ts">
export default {
  name: "LoadingModal",
}
</script>
