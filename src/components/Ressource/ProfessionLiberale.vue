<template>
  <div>
    <h3>{{ ressource.meta.label }}</h3>
    <div class="form__group">
      <label for="liberaleType" class="aj-question">Type d'activité</label>
      <select
        id="liberaleType"
        v-bind:value="ressource.extra.tns_autres_revenus_type_activite"
        v-on:input="
          updateExtra('tns_autres_revenus_type_activite', $event.target.value)
        "
      >
        <option value="achat_revente"
          >Achat/revente ou fourniture de logement</option
        >
        <option value="bic">Autre activité relevant des BIC</option>
        <option value="bnc"
          >Activité libérale et/ou intellectuelle (BNC)</option
        >
      </select>
    </div>
    <div class="form__group">
      <label for="liberaleLastBenef" class="aj-question"
        >Bénéfice sur le dernier exercice clos</label
      >
      <input
        id="liberaleLastBenef"
        type="number"
        v-select-on-click
        v-bind:value="ressource.amounts[$store.state.dates.lastYear.id]"
        v-on:input="update($store.state.dates.lastYear.id, $event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import TNSRessourceUpdator from "@/mixins/TNSRessourceUpdator"

export default {
  name: "RessourceProfessionLiberale",
  mixins: [TNSRessourceUpdator],
}
</script>

<style scoped lang="css"></style>
