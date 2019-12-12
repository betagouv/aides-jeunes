<template>
  <div>
    <p>Cette aide se base sur <strong>vos ressources de l'année {{ $store.state.dates.fiscalYear.label }}</strong>, que vous n'avez pas encore déclarées lors de cette simulation.</p>

    <router-link class="button text-center" to="/foyer/ressources/fiscales/">Déclarez vos ressources {{ $store.state.dates.fiscalYear.label }}</router-link>
  </div>
</template>

<script>

export default {
  name: 'ResultatInattenduYearMinusTwo'
}

</script>
