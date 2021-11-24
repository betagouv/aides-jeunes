<template>
  <div>
    <h3>{{ ressource.meta.label }}</h3>
    <div class="form__group">
      <label
        for="autoAmount"
        class="aj-question"
      >Chiffre d’affaires {{ $store.state.dates.lastYear.label }}</label>
      <InputNumber
        id="autoAmount"
        :value="ressource.amounts[$store.state.dates.lastYear.id]"
        @input="update($store.state.dates.lastYear.id, $event)"
      />
    </div>

    <div class="form__group">
      <label
        for="autoAmountLastMonth"
        class="aj-question"
      >Chiffre d'affaires pour
        {{ capitalize($store.state.dates.thisMonth.label) }}</label>
      <InputNumber
        id="autoAmountLastMonth"
        :value="ressource.amounts[$store.state.dates.thisMonth.id]"
        @input="update($store.state.dates.thisMonth.id, $event)"
      />
    </div>
    <div
      v-for="month in $store.state.dates.last3Months"
      :key="month.id"
      class="form__group"
    >
      <label
        :for="'autoAmount' + month.label"
        class="aj-question"
      >
        Chiffre d'affaires pour {{ capitalize(month.label) }}
      </label>
      <InputNumber
        :id="'autoAmount' + month.label"
        :value="ressource.amounts[month.id]"
        @input="update(month.id, $event)"
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
