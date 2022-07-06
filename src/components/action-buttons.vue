<template>
  <div>
    <WarningMessage v-if="error" class="aj-actions-error">{{
      error
    }}</WarningMessage>
    <div class="aj-actions">
      <button
        class="button next-button"
        type="submit"
        :class="{ disabled: disableSubmit }"
        @click="localOnSubmit($event)"
      >
        Suivant
      </button>
      <slot />
      <BackButton class="previous-button" @click="goBack" />
    </div>
  </div>
</template>

<script>
import BackButton from "@/components/buttons/back-button.vue"
import WarningMessage from "@/components/warning-message.vue"
export default {
  name: "ActionButtons",
  components: { WarningMessage, BackButton },
  props: {
    onSubmit: {
      type: Function,
      default() {},
    },
    disableSubmit: Boolean,
  },
  data() {
    return {
      window,
    }
  },
  computed: {
    error() {
      return this.$store.state.error
    },
  },
  methods: {
    localOnSubmit: function (event) {
      event.preventDefault()
      this.onSubmit()
    },
    goBack: function () {
      window?.history.back()
      this.$matomo?.trackEvent(
        "Parcours",
        "Bouton précédent",
        this.$route.fullPath
      )
    },
  },
}
</script>

<style type="text/css"></style>
