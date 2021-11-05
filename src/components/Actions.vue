<template>
  <div>
    <div class="notification warning aj-actions-error" v-if="error">
      {{ error }}
    </div>
    <div class="aj-actions">
      <BackButton @click.native="goBack"></BackButton>
      <button
        class="button"
        type="submit"
        v-show="onSubmit"
        v-on:click="localOnSubmit($event)"
        >Suivant</button
      >
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
