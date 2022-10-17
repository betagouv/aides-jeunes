<template>
  <button
    v-if="show"
    class="button text-center"
    type="button"
    @click="showModal"
  >
    <i aria-hidden="true" class="ri ri-mail-line" />
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
