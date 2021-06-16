<template>
  <div>
    <h3>{{ ressource.meta.label }}</h3>
    <div class="form__group">
      <label for="microType" class="aj-question">Type d'activité</label>
      <select
        id="microType"
        v-bind:value="ressource.extra.tns_micro_entreprise_type_activite"
        v-on:input="
          updateExtra('tns_micro_entreprise_type_activite', $event.target.value)
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
      <label for="microAmount" class="aj-question"
        >Chiffre d’affaires {{ $store.state.dates.lastYear.label }}</label
      >
      <InputNumber
        id="microAmount"
        :value="ressource.amounts[$store.state.dates.lastYear.id]"
        @input="update($store.state.dates.lastYear.id, $event.target.value)"
      ></InputNumber>
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
