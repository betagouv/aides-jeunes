<template>
  <div class="container">
    <!-- <pre>{{JSON.stringify(situation, null, 2)}}</pre> -->
  </div>
</template>

<script>
import { useStore } from "@/stores"

export default {
  name: "FoyerRecap",
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    situation: function () {
      return this.store.situation
    },
  },
}
</script>
