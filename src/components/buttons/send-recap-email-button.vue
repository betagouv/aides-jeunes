<template>
  <button
    v-if="show"
    type="button"
    class="button text-center"
    @click="showModal"
  >
    <i class="fa fa-envelope-o" aria-hidden="true" />
    {{ text }}
  </button>
</template>

<script>
export default {
  name: "SendRecapEmailButton",
  props: {
    text: {
      type: String,
      default: "Recevoir par email",
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
    showModal: function () {
      this.$store.commit("setRecapEmailState", "show")
    },
  },
}
</script>
