<template>
  <div class="fr-hidden-sm fr-col-1 fr-mr-2w">
    <dialog
      aria-labelledby="fr-modal-en-savoir-plus-title"
      id="fr-modal-en-savoir-plus"
      class="fr-modal fr-modal--opened fr-modal--large"
      data-fr-js-modal="true"
      role="dialog"
      aria-modal="true"
      open="true"
    >
      <div class="fr-container fr-container--fluid fr-container-md">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12">
            <div class="fr-modal__body">
              <div class="fr-modal__header">
                <button
                  class="fr-link--close fr-link"
                  aria-controls="fr-modal-en-savoir-plus"
                  @click="window?.history.back()"
                  >Fermer</button
                >
              </div>
              <div class="fr-modal__content">
                <h4>En savoir plus</h4>
                <p>{{ text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </div>
  <div class="fr-mb-4w">
    <h4>En savoir plus</h4>
    <p>{{ text }}</p>
    <BackButton size="small" @click="window?.history.back()">
      Retour
    </BackButton>
  </div>
</template>

<script>
import Hint from "@/lib/hint"
import BackButton from "@/components/buttons/back-button.vue"

export default {
  name: "EnSavoirPlusContent",
  components: {
    BackButton,
  },
  data() {
    return {
      open: false,
      window,
    }
  },
  computed: {
    attribute: function () {
      return this.source[this.source.length - 1]
    },
    source: function () {
      return this.$route.params.parent
    },
    text: function () {
      return Hint.get(this.attribute, this.source)
    },
  },
  mounted() {
    this.open = true
  },
}
</script>
