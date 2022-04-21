<template>
  <button
    v-if="show"
    type="button"
    class="button text-center"
    @click="showModal"
  >
    <i class="fa fa-envelope-o" aria-hidden="true" />
    Recevoir par email
  </button>
</template>

<script>
export default {
  name: "SendRecapEmailButton",
  computed: {
    show() {
      return this.$store.state.recapEmailState !== "ok"
    },
  },
  methods: {
    showModal: function () {
      this.$store.commit("setRecapEmailState", "show")
    },
  },
}
</script>

<style scoped lang="scss">
.modal__backdrop {
  display: flex;
  align-items: flex-start;
  padding: 4em;
}
</style>
