<template>
  <div>
    <h3>{{ ressource.meta.label }}</h3>
    <div class="form__group">
      <label for="microAmount" class="aj-question"
        >Chiffre d’affaires {{ store.dates.lastYear.label }}</label
      >
      <InputNumber
        id="microAmount"
        :value="ressource.amounts[store.dates.lastYear.id]"
        @update:model-value="update(store.dates.lastYear.id, $event)"
      />
    </div>
  </div>
</template>

<script>
import TNSRessourceUpdator from "@/mixins/tns-ressource-updator"
import InputNumber from "@/components/input-number.vue"
import { useStore } from "@/stores"

export default {
  name: "RessourceMicroEntreprise",
  components: { InputNumber },
  mixins: [TNSRessourceUpdator],
  setup() {
    return {
      store: useStore(),
    }
  },
}
</script>

<style scoped lang="css"></style>
