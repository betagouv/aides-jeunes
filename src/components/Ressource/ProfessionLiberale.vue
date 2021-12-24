<template>
  <div>
    <h3>{{ ressource.meta.label }}</h3>
    <div class="form__group">
      <label for="liberaleType" class="aj-question">Type d'activité</label>
      <select
        id="liberaleType"
        :value="ressource.extra.tns_autres_revenus_type_activite"
        @input="
          updateExtra('tns_autres_revenus_type_activite', $event.target.value)
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
    <div class="form__group">
      <label for="liberaleLastBenef" class="aj-question"
        >Bénéfice sur le dernier exercice clos</label
      >
      <InputNumber
        id="liberaleLastBenef"
        :value="ressource.amounts[$store.state.dates.lastYear.id]"
        @input="update($store.state.dates.lastYear.id, $event)"
      />
    </div>
  </div>
</template>

<script>
import TNSRessourceUpdator from "@/mixins/TNSRessourceUpdator"
import InputNumber from "@/components/InputNumber"

export default {
  name: "RessourceProfessionLiberale",
  components: { InputNumber },
  mixins: [TNSRessourceUpdator],
}
</script>

<style scoped lang="css"></style>
