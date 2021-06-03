<template>
  <div>
    {{ month.label | capitalize }}
    <span v-if="month.id === $store.state.dates.thisMonth.id">
      - estimation jusqu'à la fin du mois</span
    >
  </div>
</template>

<script>
export default {
  name: "MonthLabel",
  props: {
    month: Object,
  },
}
</script>
