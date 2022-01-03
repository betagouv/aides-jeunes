<template>
  <div>
    <h3>{{ ressource.meta.label }}</h3>
    <div class="form__group">
      <label for="microAmount" class="aj-question"
        >Chiffre d’affaires {{ $store.state.dates.lastYear.label }}</label
      >
      <InputNumber
        id="microAmount"
        :value="ressource.amounts[$store.state.dates.lastYear.id]"
        @input="update($store.state.dates.lastYear.id, $event)"
      />
    </div>
  </div>
</template>

<script>
import TNSRessourceUpdator from "@/mixins/tns-ressource-updator"
import InputNumber from "@/components/InputNumber"

export default {
  name: "RessourceMicroEntreprise",
  components: { InputNumber },
  mixins: [TNSRessourceUpdator],
}
</script>

<style scoped lang="css"></style>
