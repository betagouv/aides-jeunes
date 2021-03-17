<template>
  <form>
    <p>
        Indiquez toutes les ressources <strong>nettes versées</strong> perçues <span v-if="individu._role !== 'demandeur'"><strong>par {{ individu._firstName }}</strong></span> en France comme à l'étranger.
    </p>
    <div class="form__group" s v-for="(type, index) in types" v-bind:key="type.meta.id">
      <RessourceMontants v-if="isSimple(type.meta.id)" v-bind:individu="type.individu" v-bind:index="index" v-bind:type="type" v-on:update="process"/>
      <RessourceAutoEntreprise v-if="type.meta.id === 'tns_auto_entrepreneur_chiffre_affaires'" v-bind:individu="type.individu" v-bind:ressource="type" v-on:update="updateTNSAmount" v-on:updateExtra="updateTNSExtra"/>
      <RessourceMicroEntreprise v-if="type.meta.id === 'tns_micro_entreprise_chiffre_affaires'" v-bind:individu="type.individu" v-bind:ressource="type" v-on:update="updateTNSAmount" v-on:updateExtra="updateTNSExtra"/>
      <RessourceProfessionLiberale v-if="type.meta.id === 'tns_autres_revenus'" v-bind:individu="type.individu" v-bind:ressource="type" v-on:update="updateTNSAmount" v-on:updateExtra="updateTNSExtra"/>
      <RessourceExploitantAgricole v-if="type.meta.id === 'tns_benefice_exploitant_agricole'" v-bind:individu="type.individu" v-bind:ressource="type" v-on:update="updateTNSAmount" v-on:updateExtra="updateTNSExtra"/>
    </div>

    <div class="next form__group">
        <!-- Maybe reusable after UX update -->
        <!-- router-link tag="button" type="button" class="button secondary">
        v-bind:to="{ name: 'ressources/types', params:$route.params }">
        Déclarer d'autres ressources
        </router-link -->
        <button class="button secondary large" type="button" v-on:click="window && window.history.back()">Précédent</button>
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

import _ from 'lodash'

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
      window,
      individu,
      types: this.getTypes(individu)
    }
  },
    watch: {
      $route (toRoute, fromRoute){
          if (!_.isEqual(toRoute.params, fromRoute.params)) {
              this.individu = this.getIndividu()
              this.types = this.getTypes(this.individu)
          }
      }
    },
  methods: {
    getIndividu: function() {
      return Individu.find(this.$store.state.situation, this.$route.params.role, this.$route.params.id)
    },
    getTypes: function(individu) {
      const selectedTypes = Ressource.getIndividuRessourceTypesByCategory(individu, this.$route.params.category)
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
      this.$push(this.$store.state.situation)
    },
    updateTNSAmount: function(type, period, value) {
      type.amounts[period] = value
    },
    updateTNSExtra: function(type, item, value) {
      type.extra[item] = value
    },
  }
}
</script>
