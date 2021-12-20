<template>
  <div>
    <h3>{{ ressource.meta.label }}</h3>
    <div class="form__group">
      <label for="microAmount" class="aj-question"
        >Chiffre d’affaires {{ $store.state.dates.lastYear.label }}</label
      >
      <InputNumber
        id="microAmount"
        :modelValue="ressource.amounts[$store.state.dates.lastYear.id]"
        @input="
          updateFloat($store.state.dates.lastYear.id, $event.target.value)
        "
      />
    </div>
  </div>
</template>

<script>
import TNSRessourceUpdator from "@/mixins/TNSRessourceUpdator"
import InputNumber from "@/components/InputNumber"

export default {
  name: "RessourceMicroEntreprise",
  components: { InputNumber },
  mixins: [TNSRessourceUpdator],
}
</script>

<style scoped lang="css"></style>
