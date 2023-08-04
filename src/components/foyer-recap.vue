<template>
  <div class="container">
    <!-- <pre>{{JSON.stringify(situation, null, 2)}}</pre> -->
  </div>
</template>

<script lang="ts">
import { useStore } from "@/stores/index.js"

export default {
  name: "FoyerRecap",
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    situation() {
      return this.store.situation
    },
  },
}
</script>
