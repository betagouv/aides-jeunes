<template>
  <div>
    <h3>{{ ressource.meta.label }}</h3>
    <fieldset class="form__group">
        <label for="autoType" class="aj-question">Type d'activité</label>
        <select id="autoType" v-bind:value="ressource.extra.tns_auto_entrepreneur_type_activite"
              v-on:input="updateExtra('tns_auto_entrepreneur_type_activite', $event.target.value)">
          <option value="achat_revente">Achat/revente ou fourniture de logement</option>
          <option value="bic">Autre activité relevant des BIC</option>
          <option value="bnc">Activité libérale et/ou intellectuelle (BNC)</option>
        </select>
    </fieldset>

    <fieldset class="form__group">
        <label for="autoAmount" class="aj-question">Chiffre d’affaires {{ $store.state.dates.lastYear.label }}</label>
        <input id="autoAmount"
          type="number" v-select-on-click
          v-bind:value="ressource.amounts[$store.state.dates.lastYear.id]"
          v-on:input="update($store.state.dates.lastYear.id, $event.target.value)">
    </fieldset>

      <fieldset class="form__group">
          <label for="autoAmountLastMonth" class="aj-question">Chiffre d'affaires pour {{ $store.state.dates.thisMonth.label | capitalize }}</label>
          <input id="autoAmountLastMonth"
              type="number" v-select-on-click
              v-bind:value="ressource.amounts[$store.state.dates.thisMonth.id]"
              v-on:input="update($store.state.dates.thisMonth.id, $event.target.value)">
      </fieldset>
      <fieldset class="form__group" v-for="month in $store.state.dates.last3Months" v-bind:key="month.id">
          <label :for="'autoAmount' + month.label" class="aj-question">
            Chiffre d'affaires pour {{ month.label | capitalize }}
          </label>
          <input :id="'autoAmount' + month.label"
              type="number" v-select-on-click
              v-bind:value="ressource.amounts[month.id]"
              v-on:input="update(month.id, $event.target.value)">
      </fieldset>
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
