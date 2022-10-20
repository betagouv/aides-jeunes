<template>
  <div>
    <div class="fr-form-group">
      <h2 class="fr-text--lead">{{ ressource.meta.label }}</h2>
      <label for="liberaleType" class="fr-text--lg">Type d'activité</label>
      <div class="fr-container--fluid">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
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
    </div>
    <div class="fr-form-group">
      <label for="liberaleLastBenef" class="fr-text--lg"
        >Bénéfice sur le dernier exercice clos</label
      >
      <div class="fr-container--fluid">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
            <InputNumber
              id="liberaleLastBenef"
              :value="ressource.amounts[store.dates.lastYear.id]"
              @update:model-value="update(store.dates.lastYear.id, $event)"
            />
          </div>
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

<style scoped lang="css"></style>
