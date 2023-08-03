<template>
  <label :for="id">
    {{ $filters.capitalize(month.label) }}
    <span v-if="month.id === store.dates.thisMonth.id">
      - estimation jusqu'à la fin du mois</span
    >
  </label>
</template>

<script lang="ts">
import { useStore } from "@/stores/index.js"

export default {
  name: "MonthLabel",
  props: {
    month: Object,
    id: String,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
}
</script>
