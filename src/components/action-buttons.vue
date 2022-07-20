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
import BackButton from "@/components/buttons/back-button"
import WarningMessage from "@/components/warning-message"
import { useStore } from "@/stores"
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
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    return {
      window,
    }
  },
  computed: {
    error() {
      return this.store.error
    },
  },
  methods: {
    localOnSubmit(event) {
      event.preventDefault()
      this.onSubmit()
    },
    goBack() {
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
