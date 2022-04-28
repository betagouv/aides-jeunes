<template>
  <button
    v-if="show"
    type="button"
    class="button text-center"
    @click="openPDFUrl"
  >
    <i class="fa fa-download" aria-hidden="true" />
    {{ text }}
  </button>
</template>

<script>
export default {
  name: "SendRecapEmailButton",
  props: {
    id: String,
    text: {
      type: String,
      default: "Télécharger au format pdf",
    },
  },
  computed: {
    show() {
      return (
        this.$store.state.recapEmailState !== "ok" &&
        this.$route.name === "resultats"
      )
    },
  },
  methods: {
    openPDFUrl() {
      window.open(`api/simulation/${this.id}/exports/pdf`, "_blank")
    },
  },
}
</script>
