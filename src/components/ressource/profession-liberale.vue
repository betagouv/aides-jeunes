<template>
  <fieldset class="fr-fieldset fr-mt-4w">
    <legend>
      <span class="fr-text--lead fr-text--bold">{{
        ressource.meta.label
      }}</span>
    </legend>
    <div class="fr-fieldset__content fr-pt-2w">
      <label for="liberaleType" class="fr-text--lg">Type d'activité</label>
      <div class="fr-px-0 fr-mb-2w">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-sm-9 fr-col-md-9 fr-col-lg-7">
            <select
              id="liberaleType"
              class="fr-select"
              :value="ressource.extra.tns_autres_revenus_type_activite"
              @input="
                updateExtra(
                  'tns_autres_revenus_type_activite',
                  $event.target.value
                )
              "
            >
              <option value="achat_revente">
                Achat/revente ou fourniture de logement
              </option>
              <option value="bic"> Autre activité relevant des BIC </option>
              <option value="bnc">
                Activité libérale et/ou intellectuelle (BNC)
              </option>
            </select>
          </div>
        </div>
      </div>

      <label for="liberaleLastBenef" class="fr-text--lg"
        >Bénéfice sur le dernier exercice clos</label
      >
      <div class="fr-container fr-px-0">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-sm-6 fr-col-lg-4">
            <InputNumber
              id="liberaleLastBenef"
              :value="ressource.amounts[store.dates.lastYear.id]"
              :min="0"
              @update:model-value="update(store.dates.lastYear.id, $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script lang="ts">
import TNSRessourceUpdator from "@/mixins/tns-ressource-updator.js"
import InputNumber from "@/components/input-number.vue"
import { useStore } from "@/stores/index.js"

export default {
  name: "RessourceProfessionLiberale",
  components: { InputNumber },
  mixins: [TNSRessourceUpdator],
  setup() {
    return {
      store: useStore(),
    }
  },
}
</script>
