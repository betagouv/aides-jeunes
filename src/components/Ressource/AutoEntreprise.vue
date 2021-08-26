<template>
  <div>
    <h3>{{ ressource.meta.label }}</h3>
    <div class="form__group">
      <label for="autoAmount" class="aj-question"
        >Chiffre d’affaires {{ $store.state.dates.lastYear.label }}</label
      >
      <InputNumber
        id="autoAmount"
        :value="ressource.amounts[$store.state.dates.lastYear.id]"
        @input="update($store.state.dates.lastYear.id, $event)"
      ></InputNumber>
    </div>

    <div class="form__group">
      <label for="autoAmountLastMonth" class="aj-question"
        >Chiffre d'affaires pour
        {{ $store.state.dates.thisMonth.label | capitalize }}</label
      >
      <InputNumber
        id="autoAmountLastMonth"
        :value="ressource.amounts[$store.state.dates.thisMonth.id]"
        @input="update($store.state.dates.thisMonth.id, $event)"
      ></InputNumber>
    </div>
    <div
      class="form__group"
      v-for="month in $store.state.dates.last3Months"
      v-bind:key="month.id"
    >
      <label :for="'autoAmount' + month.label" class="aj-question">
        Chiffre d'affaires pour {{ month.label | capitalize }}
      </label>
      <InputNumber
        :id="'autoAmount' + month.label"
        :value="ressource.amounts[month.id]"
        @input="update(month.id, $event)"
      ></InputNumber>
    </div>
  </div>
</template>

<script>
import TNSRessourceUpdator from "@/mixins/TNSRessourceUpdator"
import InputNumber from "@/components/InputNumber"

export default {
  name: "RessourceAutoEntreprise",
  mixins: [TNSRessourceUpdator],
  components: {
    InputNumber,
  },
}
</script>

<style scoped lang="css"></style>
