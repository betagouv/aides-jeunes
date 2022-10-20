<template>
  <div class="fr-form-group">
    <h2 class="fr-text--lead">{{ ressource.meta.label }}</h2>
    <label for="microAmount" class="fr-label fr-text--lg"
      >Chiffre d’affaires {{ store.dates.lastYear.label }}</label
    >
    <div class="fr-container--fluid">
      <div class="fr-grid-row">
        <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
          <InputNumber
            id="microAmount"
            :value="ressource.amounts[store.dates.lastYear.id]"
            @update:model-value="update(store.dates.lastYear.id, $event)"
          />
        </div>
      </div>
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
