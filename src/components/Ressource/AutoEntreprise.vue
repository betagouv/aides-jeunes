<template>
  <div>
    <h3>{{ ressource.meta.label }}</h3>
    <div class="form__group">
      <label for="autoAmount" class="aj-question"
        >Chiffre d’affaires {{ $store.state.dates.lastYear.label }}</label
      >
      <InputNumber
        id="autoAmount"
        :modelValue="ressource.amounts[$store.state.dates.lastYear.id]"
        @input="
          updateFloat($store.state.dates.lastYear.id, $event.target.value)
        "
      />
    </div>

    <div class="form__group">
      <label for="autoAmountLastMonth" class="aj-question"
        >Chiffre d'affaires pour
        {{ $filters.capitalize($store.state.dates.thisMonth.label) }}</label
      >
      <InputNumber
        id="autoAmountLastMonth"
        :modelValue="ressource.amounts[$store.state.dates.thisMonth.id]"
        @input="
          updateFloat($store.state.dates.thisMonth.id, $event.target.value)
        "
      />
    </div>
    <div
      v-for="month in $store.state.dates.last3Months"
      :key="month.id"
      class="form__group"
    >
      <label :for="'autoAmount' + month.label" class="aj-question">
        Chiffre d'affaires pour {{ $filters.capitalize(month.label) }}
      </label>
      <InputNumber
        :id="'autoAmount' + month.label"
        :modelValue="ressource.amounts[month.id]"
        @input="updateFloat(month.id, $event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import TNSRessourceUpdator from "@/mixins/TNSRessourceUpdator"
import InputNumber from "@/components/InputNumber"

export default {
  name: "RessourceAutoEntreprise",
  components: {
    InputNumber,
  },
  mixins: [TNSRessourceUpdator],
}
</script>

<style scoped lang="css"></style>
