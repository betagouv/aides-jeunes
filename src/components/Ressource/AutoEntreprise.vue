<template>  
  <div>
    <h3>{{ ressource.meta.label }}</h3>
    <label class="form__group">Type d'activité
      <select v-bind:value="ressource.extra.tns_auto_entrepreneur_type_activite"
        v-on:input="updateExtra('tns_auto_entrepreneur_type_activite', $event.target.value)">
        <option value="achat_revente">Achat/revente ou fourniture de logement</option>
        <option value="bic">Autre activité relevant des BIC</option>
        <option value="bnc">Activité libérale et/ou intellectuelle (BNC)</option>
      </select>
    </label>

    <label class="form__group">Chiffre d’affaires {{ $store.state.dates.lastYear.label }}
      <input
        type="number" v-select-on-click
        v-bind:value="ressource.amounts[$store.state.dates.lastYear.id]"
        v-on:input="update($store.state.dates.lastYear.id, $event.target.value)">
    </label>

    <div class="form__group">
      <label>
        Chiffre d'affaires pour {{ $store.state.dates.thisMonth.label | capitalize }}
        <input
          type="number" v-select-on-click
          v-bind:value="ressource.amounts[$store.state.dates.thisMonth.id]"
          v-on:input="update($store.state.dates.thisMonth.id, $event.target.value)">
      </label>
      <label v-for="month in $store.state.dates.last3Months" v-bind:key="month.id">
        Chiffre d'affaires pour {{ month.label | capitalize }}
        <input
          type="number" v-select-on-click
          v-bind:value="ressource.amounts[month.id]"
          v-on:input="update(month.id, $event.target.value)">
      </label>
    </div>
  </div>
</template>

<script>
import TNSRessourceUpdator from '@/mixins/TNSRessourceUpdator'

export default {
  name: 'RessourceAutoEntreprise',
  mixins: [TNSRessourceUpdator],
}
</script>

<style scoped lang="css">
</style>
