<template>
  <label :for="id">
    {{ capitalize(month.label) }}
    <span v-if="month.id === dates?.thisMonth.id">
      - estimation jusqu'à la fin du mois</span
    >
  </label>
</template>

<script lang="ts">
import { generator } from "@lib/dates.js"
import dayjs from "dayjs"

export default {
  name: "MonthLabel",
  props: {
    month: Object,
    id: String,
  },
  setup() {
    return {
      dates: generator(dayjs().format()),
    }
  },
  methods: {
    capitalize(value: string = "") {
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
  },
}
</script>
