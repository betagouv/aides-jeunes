<template>
  <div>
    {{ $filters.capitalize(month.label) }}
    <span v-if="month.id === store.dates.thisMonth.id">
      - estimation jusqu'à la fin du mois</span
    >
  </div>
</template>

<script>
import { useStore } from "@/stores"

export default {
  name: "MonthLabel",
  props: {
    month: Object,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
}
</script>
