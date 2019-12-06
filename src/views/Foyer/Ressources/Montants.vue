<template>
  <form>
    <p>
      Indiquez toutes les ressources <strong>nettes versées</strong> perçues en France comme à l'étranger.
    </p>
    <div class="form__group" s v-for="(type, index) in types" v-bind:key="type.meta.id">
      <RessourceMontants v-if="isSimple(type.meta.id)" v-bind:individu="type.individu" v-bind:index="index" v-bind:type="type" v-on:update="process"/>
      <RessourceAutoEntreprise v-if="type.meta.id === 'tns_auto_entrepreneur_chiffre_affaires'" v-bind:individu="type.individu" v-bind:ressource="type"/>
      <RessourceMicroEntreprise v-if="type.meta.id === 'tns_micro_entreprise_chiffre_affaires'" v-bind:individu="type.individu" v-bind:ressource="type"/>
      <RessourceProfessionLiberale v-if="type.meta.id === 'tns_autres_revenus'" v-bind:individu="type.individu" v-bind:ressource="type"/>
      <RessourceExploitantAgricole v-if="type.meta.id === 'tns_benefice_exploitant_agricole'" v-bind:individu="type.individu" v-bind:ressource="type"/>
    </div>

    <div class="next form__group">
      <router-link tag="button" type="button" class="button secondary"
        v-bind:to="{ name: 'ressources/types', params:$route.params }">
        Déclarer d'autres ressources
      </router-link>
      <button type="submit" class="button large" v-on:click.prevent="next">Valider</button>
    </div>
  </form>
</template>

<script>
import RessourceAutoEntreprise from '@/components/Ressource/AutoEntreprise'
import RessourceExploitantAgricole from '@/components/Ressource/ExploitantAgricole'
import RessourceMicroEntreprise from '@/components/Ressource/MicroEntreprise'
import RessourceProfessionLiberale from '@/components/Ressource/ProfessionLiberale'
import RessourceMontants from '@/components/Ressource/Montants'

import RessourceProcessor from '@/mixins/RessourceProcessor'
import {ressourceTypes} from '@/constants/resources'
import Ressource from '@/lib/Ressource'
import Individu from '@/lib/Individu'

export default {
  name: 'ressources-montants',
  mixins: [RessourceProcessor],
  components: {
    RessourceAutoEntreprise,
    RessourceExploitantAgricole,
    RessourceMicroEntreprise,
    RessourceProfessionLiberale,
    RessourceMontants,
  },
  data: function() {
    const individu = this.getIndividu()
    return {
      individu,
      types: this.getTypes(individu)
    }
  },
  methods: {
    getIndividu: function() {
      return Individu.find(this.$store.state.situation, this.$route.params.role, this.$route.params.id)
    },
    getTypes: function(individu) {
      const selectedTypes = Ressource.getIndividuRessourceTypes(individu)

      return ressourceTypes.reduce((result, type) => {
        if (selectedTypes[type.id]) {

          let amounts = Object.assign({}, individu[type.id])
          let months = Ressource.getPeriodsForCurrentYear(this.$store.state.dates, type)

          result.push({
            amounts,
            individu,
            months,
            displayMonthly: this.getDisplayMonthly(months, amounts),
            meta: type,
            extra: (type.extra || []).reduce((a, e) => {
              a[e] = individu[e]
              return a
            }, {})
          })
        }
        return result
      }, [])
    },
    isSimple: function(type) {
      const complex = [
        'tns_auto_entrepreneur_chiffre_affaires',
        'tns_benefice_exploitant_agricole',
        'tns_micro_entreprise_chiffre_affaires',
        'tns_autres_revenus',
      ]
      return complex.indexOf(type) === - 1
    },
    next: function() {
      this.save(this.types, true)

      this.individu = this.getIndividu()
      this.types = this.getTypes(this.individu)

      this.$push(this.$store.state.situation)
    }
  }
}
</script>
