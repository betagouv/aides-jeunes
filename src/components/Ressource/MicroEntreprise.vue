<template>  
  <div>
    <h3>{{ ressource.meta.label }}</h3>
    <label class="form__group">Type d'activité
      <select v-model="ressource.extra.tns_micro_entreprise_type_activite">
        <option value="achat_revente">Achat/revente ou fourniture de logement</option>
        <option value="bic">Autre activité relevant des BIC</option>
        <option value="bnc">Activité libérale et/ou intellectuelle (BNC)</option>
      </select>
    </label>

    <label class="form__group">Chiffre d’affaires {{ $store.state.dates.lastYear.label }}
      <input
        type="number" v-select-on-click
        v-model="ressource.amounts[$store.state.dates.lastYear.id]">
    </label>
  </div>
</template>

<script>

export default {
  name: 'RessourceMicroEntreprise',
  props: {
    ressource: Object,
  },
}
</script>

<style scoped lang="css">
</style>
