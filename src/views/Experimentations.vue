<template>
  <div class="text container">
    <h1>🎉 Bonjour 👋</h1>
    <p>
      Comme vous n'êtes pas arrivé.e ici par hasard, commencons avec un mot&nbsp;: <strong>Merci</strong> 🤗 (d'avoir commencé et d'être arrivé.e jusqu'ici 😅)
    </p>

    <p>
      Vous devriez trouver ici les informations que vous avez saisies précédemment auxquelles nous avons ajouté notre petite touche.
    </p>

    <div v-for="(provider, index) in providers" v-bind:key="'n'+index">
      <hr />
      <h2>{{provider.label}}</h2>
      <ProviderView v-bind:id="provider.id" v-bind:item="provider" />
    </div>

    <p>
      Maintenant vous pouvez faire une simulation en indiquant un logement dans le département que vous avez choisi.
      <ul>
        <li>Dans un premier temps, n'indiquez <strong>aucune</strong> ressource. Cela devrait faire apparaître l'aide que vous avez ajoutée.</li>
        <li>Dans un second temps, vous pouvez modifier la situation décrite en indiquant un salaire de 1200&nbsp;€ par mois. Dans ce cas-là, votre aide ne devrez plus apparaître.</li>
      </ul>
    </p>

    <router-link target="_blank" rel="noopener" to="/foyer/demandeur" class="button primary">
      Faire une simulation
    </router-link>
  </div>
</template>

<script>
import ProviderView from '@/components/ProviderView'

export default {
  name: 'experimentations',
  components: {
    ProviderView
  },
  data: () => {
    return {}
  },
  computed: {
    raw: function() { return this.$store.state.experimentations.results },
    providers: function() { return this.raw && Object.keys(this.raw).map(k => this.raw[k]) },
  },
  mounted: function () {
    this.$store.dispatch('getExperimentations')
  }
}
</script>
