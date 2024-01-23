<template>
  <label>
    {{ monthLabel }}
    <span v-if="showEstimationLabel"> - estimation jusqu'à la fin du mois</span>
  </label>
</template>

<script lang="ts">
import { generator } from "@lib/dates.js"
import { capitalize } from "@lib/utils.js"
import dayjs from "dayjs"

export default {
  name: "MonthLabel",
  props: {
    month: Object,
  },
  setup() {
    return {
      dates: generator(dayjs().format()),
    }
  },
  computed: {
    monthLabel() {
      return capitalize(this.month.label)
    },
    showEstimationLabel() {
      return this.month.id === this.dates.thisMonth.id
    },
  },
}
</script>
