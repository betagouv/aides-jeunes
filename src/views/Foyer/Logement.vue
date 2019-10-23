<template>
  <div class="container">
    <div class="frame-foyer">
      <h1>Votre logement principal</h1>

      <div>
        <p>Si vous habitez actuellement à l'étranger, préférez le simulateur <a target="_blank" rel="noopener" href="http://retour-en-france.simplicite.fr/">Retour en France</a>. Des délais de résidence en France sont en effet requis pour certaines aides.</p>
      </div>

      <div class="form__group">
        <label v-for="logementType in logementTypes" v-bind:key="logementType.id">
          <input type="radio"
              name="logementType"
              v-model="logement.type"
              v-on:change="changeLogementType()"
              v-bind:value="logementType.id"
              />
              {{ logementType.label }}
              <span class="help-col">{{ logementType.hint }}</span>
        </label>
      </div>

      <YesNoQuestion class="form__group" v-model="menage.coloc" v-if="captureColocation">
        Est-ce une colocation ?
      </YesNoQuestion>

      <YesNoQuestion class="form__group" v-model="famille.proprietaire_proche_famille" v-if="captureProprietaireProcheFamille">
        Avez-vous un lien de parenté direct avec votre propriétaire ?
        <template v-slot:help>Est-il un ascendant ou descendant de vous ou votre conjoint·e (enfant, grand-parent…) ?</template>
      </YesNoQuestion>

      <div class="form__group" v-show="captureLocationType">
        <label>Quel type de logement louez-vous ?</label>
        <div>
          <label class="radio" v-for="locationType in locationTypes" v-bind:key="locationType.id">
            <input
              type="radio"
              name="locationType"
              v-model="logement.locationType"
              v-bind:value="locationType.id">
            {{ locationType.label }}
          </label>
        </div>
      </div>

      <YesNoQuestion class="form__group" v-model="menage.logement_chambre" v-if="captureChambre">
        Est-ce une chambre ?
        <template v-slot:help>
          Une chambre est un logement qui ne comporte qu'une seule pièce et n'est pas équipée d'un WC.
        </template>
      </YesNoQuestion>

      <YesNoQuestion class="form__group" v-model="logement.primoAccedant" v-if="logement.type == 'proprietaire'">
        Êtes-vous primo-accédant pour cette propriété ?
        <template v-slot:help>
          Un primo-accédant est une personne (ou un ménage) qui n’a pas été propriétaire
          de sa résidence principale dans les deux années qui viennent de s’écouler au moment où il achète son bien.
        </template>
      </YesNoQuestion>

      <YesNoQuestion class="form__group" v-model="demandeur.habite_chez_parents" v-if="captureHabiteChezParents">
        Habitez-vous avec vos parents ?
      </YesNoQuestion>

      <YesNoQuestion class="form__group" v-model="menage.participation_frais" v-if="captureParticipationFrais">
        Participez-vous aux frais du logement ?
        <template v-slot:help>Par exemple aux dépenses d'électricité, de téléphone, etc.</template>
      </YesNoQuestion>

      <label v-if="captureLoyer" class="form__group">
        {{ loyerLabel }}
        <input type="number" v-model.number="menage.loyer">
      </label>

      <p v-if="logement.type == 'proprietaire'">
        Laissez ce champ à 0 € si vous ne remboursez pas actuellement de crédit pour votre logement.
      </p>

      <label v-if="captureCharges" class="form__group">
        Vos charges locatives
        <input type="number" v-model.number="menage.charges_locatives">
      </label>

      <YesNoQuestion class="form__group" v-model="logement.pretSigneAvant2018" v-if="capturePretSigneAvant2018">
        Avez-vous signé votre prêt <strong>avant</strong> le 1er janvier 2018 ?
      </YesNoQuestion>

      <!-- TODO captureCodePostal -->

      <div v-if="captureResidentParis" class="form__group">
        <YesNoQuestion v-model="famille.parisien">
          Avez-vous habité Paris au moins 3 ans depuis {{ yearsAgo(5) }} ?
        </YesNoQuestion>
      </div>

      <p v-if="isResidentMayotte">
        <i class="fa fa-times-circle" aria-hidden="true"></i>
        Les règles spécifiques à Mayotte ne sont pas encore prises en compte par ce simulateur. Nous ne pouvons donc malheureusement pas évaluer vos droits pour ce code postal.
      </p>
    </div>

    <div class="text-right">
      <button class="button large" v-if="maySubmit" v-on:click="next">Valider</button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import Individu from '@/lib/Individu'
import Logement from '@/lib/Logement'
import Situation from '@/lib/Situation'
import { locationTypes, logementTypes, loyerLabels } from '@/constants/logement'

import YesNoQuestion from '@/components/YesNoQuestion'

export default {
  name: 'logement',
  components: {
    YesNoQuestion,
  },
  data () {
    var situation = this.$SituationService.restoreLocal()
    var menage = situation.menage
    var logement = Logement.getLogementVariables(menage.statut_occupation_logement)
    logement.pretSigneAvant2018 = moment(menage.aide_logement_date_pret_conventionne, 'YYYY-MM-DD').get('year') < 2018
    return {
      demandeur: situation.individus[0],
      famille: situation.famille,
      locationTypes,
      logementTypes,
      logement,
      menage,
      selectedCodePostal: menage.code_postal,
      situation,
      submitted: false,
    }
  },
  computed: {
    captureColocation: function() {
        return this.logement.type == 'locataire'
    },
    captureChambre: function() {
        return this.logement.type == 'locataire' && 'foyer' !== this.logement.locationType && this.logement.locationType !== undefined
    },
    captureCharges: function() {
        return (this.logement.type == 'locataire') && (this.logement.locationType !== 'meublehotel') && this.captureLoyer
    },
    captureHabiteChezParents: function() {
        var age = Individu.age(this.demandeur)
        return (this.logement.type == 'heberge') && this.demandeur.fiscalementIndependant && (age >= 18) && (age < 25) && (! Situation.hasEnfant(this.situation))
    },
    captureCodePostal: function() {
        return _.some([
            this.logement.primoAccedant !== undefined,
            this.logement.locationType == 'foyer',
            this.menage.logement_chambre !== undefined,
            this.logement.type == 'heberge' && this.menage.participation_frais !== undefined,
            this.logement.type == 'sansDomicile'
        ])
    },
    captureLocationType: function() {
        return this.logement.type == 'locataire' && this.famille.proprietaire_proche_famille !== undefined
    },
    captureLoyer: function() {
        if (this.logement.type == 'heberge') {
            return false
        }
        return _.some([
            this.logement.primoAccedant !== undefined,
            this.logement.locationType == 'foyer',
            this.menage.logement_chambre !== undefined
        ])
    },
    captureParticipationFrais: function() {
        return (this.logement.type == 'heberge') && (! this.captureHabiteChezParents || this.demandeur.habite_chez_parents !== undefined)
    },
    capturePretSigneAvant2018:function() {
        return this.logement.type == 'proprietaire' && this.logement.primoAccedant && (this.menage && this.menage.loyer > 0)
    },
    captureProprietaireProcheFamille: function() {
        return this.logement.type == 'locataire' && this.menage.coloc !== undefined
    },
    captureResidentParis: function() {
        return this.captureCodePostal && this.isNotHomeless && this.isCommuneParis
    },
    isNotHomeless: function() {
        return this.logement.type != 'sansDomicile'
    },
    isCommuneParis: function() {
        return this.menage.depcom && this.menage.depcom.indexOf('75') === 0
    },
    isAddressValid: function() {
        return this.menage.depcom && this.menage.code_postal
    },
    isResidentMayotte: function () {
        return this.isAddressValid && this.menage.code_postal.indexOf('976') === 0
    },
    loyerLabel: function() {
        var result = loyerLabels[this.logement.type]
        if (this.logement.type === 'locataire') {
            if (this.captureCharges) {
                result += ' (hors charges)'
            } else {
                result += ' (charges comprises)'
            }
        }

        return result
    },
    maySubmit: function() {
        return this.captureCodePostal && ! this.isResidentMayotte
    },
  },
  methods: {
    changeLogementType: function() {
        const logementProps = ['locationType', 'primoAccedant']
        logementProps.forEach((field) => {
            delete this.logement[field]
        })

        const familleProps = ['proprietaire_proche_famille']
        familleProps.forEach((field) => {
            delete this.famille[field]
        })

        const menageProps = ['charges_locatives', 'coloc', 'logement_chambre', 'participation_frais']
        menageProps.forEach((field) => {
            delete this.menage[field]
        })
        this.menage.loyer = 0

        delete this.demandeur.habite_chez_parents
    },
    next: function() {
      this.menage.statut_occupation_logement = Logement.getStatutOccupationLogement(this.logement)
      this.menage.aide_logement_date_pret_conventionne = this.logement.pretSigneAvant2018 ? '2017-12-31' : '2018-01-01'
      this.$SituationService.saveLocal()
      this.$router.push('/foyer/pensions-alimentaires')
    },
    yearsAgo: function(years) {
      return moment(this.situation.dateDeValeur).subtract(years, 'years').format('MMMM YYYY')
    },
  },
}
</script>

<style scoped lang="scss">
</style>
