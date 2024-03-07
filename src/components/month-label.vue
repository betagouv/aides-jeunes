<script lang="ts" setup>
import { useStore } from "@/stores/index.js"
import { capitalize } from "@lib/utils.js"

defineProps({
  month: {
    type: Object,
    required: true,
  },
  id: String,
})
const store = useStore()
</script>

<template>
  <label :for="id">
    {{ capitalize(month.label) }}
    <span v-if="month.id === store.dates.thisMonth.id">
      - estimation jusqu'à la fin du mois</span
    >
  </label>
</template>
