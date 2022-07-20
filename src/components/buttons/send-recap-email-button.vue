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
import { useStore } from "@/stores"

export default {
  name: "SendRecapEmailButton",
  props: {
    text: {
      type: String,
      default: "Recevoir par email",
    },
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    show() {
      return (
        this.store.recapEmailState !== "ok" && this.$route.name === "resultats"
      )
    },
  },
  methods: {
    showModal() {
      this.store.setRecapEmailState("show")
    },
  },
}
</script>
