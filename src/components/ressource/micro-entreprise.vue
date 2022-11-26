<template>
  <fieldset class="fr-fieldset fr-mb-4w">
    <legend>
      <span class="fr-text--lead fr-text--bold">{{
        ressource.meta.label
      }}</span>
    </legend>
    <div class="fr-fieldset__content">
      <label :for="`${ressource.meta.id}_microAmount`" class="fr-label"
        >Chiffre d’affaires {{ store.dates.lastYear.label }}</label
      >
      <div class="fr-container--fluid">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
            <InputNumber
              :id="`${ressource.meta.id}_microAmount`"
              :value="ressource.amounts[store.dates.lastYear.id]"
              @update:model-value="update(store.dates.lastYear.id, $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </fieldset>
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
