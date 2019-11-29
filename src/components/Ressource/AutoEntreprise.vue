<template>  
  <div>
    <h3>{{ ressource.meta.label }}</h3>
    <label class="form__group">Type d'activité
      <select v-model="ressource.extra.tns_auto_entrepreneur_type_activite">
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

    <fieldset class="form__group">
      <label>
        Chiffre d'affaires pour {{ $store.state.dates.thisMonth.label | capitalize }}
        <input
          type="number" v-select-on-click
          v-model="ressource.amounts[$store.state.dates.thisMonth.id]">
      </label>
      <label v-for="month in $store.state.dates.last3Months" v-bind:key="month.id">
        Chiffre d'affaires pour {{ month.label | capitalize }}
        <input
          type="number" v-select-on-click
          v-model="ressource.amounts[month.id]">
      </label>
    </fieldset>
  </div>
</template>

<script>

export default {
  name: 'RessourceAutoEntreprise',
  props: {
    ressource: Object,
  },
}
</script>

<style scoped lang="css">
</style>
