<template>
  <div>
    <div
      v-if="error"
      class="notification warning aj-actions-error"
    >
      {{ error }}
    </div>
    <div class="aj-actions">
      <button
        class="button next-button"
        type="submit"
        @click="localOnSubmit($event)"
      >
        Suivant
      </button>
      <slot />
      <BackButton @click.native="goBack"  class="previous-button"/>
    </div>
  </div>
</template>

<script>
import BackButton from "@/components/Buttons/BackButton"
export default {
  name: "Actions",
  components: { BackButton },
  props: {
    onSubmit: {
      type: Function,
      default() {},
    },
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
      window && window.history.back()
      this.$matomo &&
        this.$matomo.trackEvent(
          "Parcours",
          "Bouton précédent",
          this.$route.fullPath
        )
    },
  },
}
</script>

<style type="text/css"></style>
