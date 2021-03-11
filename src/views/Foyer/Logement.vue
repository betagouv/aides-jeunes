<template>
  <form>
    <div>
      <p>Si vous habitez actuellement à l'étranger, préférez le simulateur
        <a target="_blank" rel="noopener" href="http://retour-en-france.simplicite.fr/">Retour en France</a>.
        Des délais de résidence en France sont en effet requis pour certaines aides.
      </p>
    </div>

    <fieldset class="form__group">
      <label v-for="logementType in logementTypes" v-bind:key="logementType.id">
        <input type="radio"
          name="logementType"
          v-model="logement.type"
          v-on:change="changeLogementType()"
          v-bind:value="logementType.id"
          />
          {{ logementType.label | capitalize }}
          <span class="help">{{ logementType.hint }}</span>
      </label>
    </fieldset>

    <YesNoQuestion class="form__group" v-model="menage.coloc" v-if="captureColocation">
      Est-ce une colocation ?
    </YesNoQuestion>

    <YesNoQuestion class="form__group" v-model="famille.proprietaire_proche_famille" v-if="captureProprietaireProcheFamille">
      Avez-vous un lien de parenté direct avec votre propriétaire ?
      <template v-slot:help>Est-il un ascendant ou descendant de vous ou votre conjoint·e (enfant, grand-parent…) ?</template>
    </YesNoQuestion>

    <fieldset class="form__group" v-show="captureLocationType">
      <legend>Quel type de logement louez-vous ?</legend>
      <label class="radio" v-for="locationType in locationTypes" v-bind:key="locationType.id">
        <input
          type="radio"
          name="locationType"
          v-model="logement.locationType"
          v-bind:value="locationType.id">
        {{ locationType.label | capitalize }}
        </label>
    </fieldset>

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
      <input type="number" v-select-on-click v-model.number="menage.loyer">
    </label>

    <p v-if="logement.type == 'proprietaire'">
      Laissez ce champ à 0 € si vous ne remboursez pas actuellement de crédit pour votre logement.
    </p>

    <label v-if="captureCharges" class="form__group">
      Vos charges locatives
      <input type="number" v-select-on-click v-model.number="menage.charges_locatives">
    </label>

    <label v-if="captureCodePostal && logement.type == 'proprietaire'" class="form__group">
      Montant de votre dernière taxe foncière
      <input type="number" v-select-on-click v-model.number="foyer_fiscal.taxe_fonciere_sur_avis[$store.state.dates.fiscalYear.id]">
    </label>

    <YesNoQuestion class="form__group" v-model="logement.pretSigneAvant2018" v-if="capturePretSigneAvant2018">
      Avez-vous signé votre prêt <strong>avant</strong> le 1er janvier 2018 ?
    </YesNoQuestion>

    <div class="form__group" v-if="captureCodePostal">
      <label class="form__group" for="postal-code">Code postal
        <input id="postal-code" v-model="menage._codePostal">
        <p class="notification warning" v-if="displayPostalCodeWarning">
          Ce code postal est invalide
        </p>
      </label>

      <div class="form__group">
        <p v-if="retrievingCommunes"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
        <div v-show="communes && communes.length">
          <label for="commune">Ville</label>
          <select
            v-model="menage.depcom"
            id="commune">
            <option v-for="commune in communes" v-bind:value="commune.code" v-bind:key="commune.code">
              {{ commune.nom }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="captureResidentParis" class="form__group">
      <YesNoQuestion v-model="famille.parisien">
        Avez-vous habité Paris au moins 3 ans depuis {{ yearsAgo(5) }} ?
      </YesNoQuestion>
    </div>

    <p v-if="isResidentMayotte">
      <i class="fa fa-times-circle" aria-hidden="true"></i>
      Les règles spécifiques à Mayotte ne sont pas encore prises en compte par ce simulateur. Nous ne pouvons donc malheureusement pas évaluer vos droits pour ce code postal.
    </p>

    <div class="text-right">
      <button type="submit" class="button large" v-if="maySubmit" v-on:click.prevent="next">Valider</button>
    </div>

  </form>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import { required } from 'vuelidate/lib/validators'

import Commune from '@/lib/Commune'
import Individu from '@/lib/Individu'
import Logement from '@/lib/Logement'
import { locationTypes, logementTypes } from '@/constants/logement'

import YesNoQuestion from '@/components/YesNoQuestion'

export default {
  name: 'logement',
  components: {
    YesNoQuestion,
  },
  data () {
    let situation = this.$store.state.situation
    let logement = Logement.getLogementVariables(situation.menage.statut_occupation_logement)
    logement.pretSigneAvant2018 = moment(situation.menage.aide_logement_date_pret_conventionne, 'YYYY-MM-DD').get('year') < 2018

    return {
      demandeur: situation.demandeur,
      famille: {
        parisien: undefined,
        proprietaire_proche_famille: undefined,
        ...situation.famille,
      },
      foyer_fiscal: {
        ...situation.foyer_fiscal,
        taxe_fonciere_sur_avis: {
          ...situation.foyer_fiscal.taxe_fonciere_sur_avis
        },
      },
      locationTypes,
      logementTypes,
      logement,
      menage: {
        charges_locatives: 0,
        _codePostal: undefined,
        coloc: undefined,
        depcom: undefined,
        logement_chambre: undefined,
        loyer: 0,
        _nomCommune: undefined,
        parisien: undefined,
        participation_frais: undefined,
        ...situation.menage
      },
      retrievingCommunes: false,
      situation,
      submitted: false,
    }
  },
  asyncComputed: {
    communes: {
      get: function() {
        if (! this.menage._codePostal || this.menage._codePostal.length !== 5) {
            return []
        }

        this.retrievingCommunes = true
        return Commune.get(this.menage._codePostal)
          .then((communes) => {
            return communes
          })
          .catch(() => {
            return []
          })
          .finally(() => {
            this.retrievingCommunes = false
          })
      },
      default: []
    },
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
        let age = Individu.age(this.demandeur)
        return (this.logement.type == 'heberge') && this.demandeur.fiscalementIndependant && (age >= 18) && (age < 25) && (this.situation.enfants.length === 0)
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
    displayPostalCodeWarning: function() {
      return (this.menage._codePostal && this.menage._codePostal.length >= 5 || this.submitted) && ! this.retrievingCommunes && this.communes.length === 0
    },
    isNotHomeless: function() {
        return this.logement.type != 'sansDomicile'
    },
    isCommuneParis: function() {
        return this.menage.depcom && this.menage.depcom.indexOf('75') === 0
    },
    isAddressValid: function() {
        return this.menage.depcom && this.menage._codePostal
    },
    isResidentMayotte: function () {
        return this.isAddressValid && this.menage._codePostal.indexOf('976') === 0
    },
    loyerLabel: function()  {
        switch (this.logement.type) {
        case 'locataire':
        {
            let elements = []
            if (this.menage.coloc) {
                elements.push('Votre part du loyer')
            } else {
                elements.push('Votre loyer')
            }

            if (this.captureCharges) {
                elements.push('(hors charges)')
            } else {
                elements.push('(charges comprises)')
            }

            return elements.join(' ')
        }
        default: {
            return 'Montant des mensualités'
        }
        }
    },
    maySubmit: function() {
        return this.captureCodePostal && ! this.isResidentMayotte
    },
  },
  methods: {
    changeLogementType: function() {
        const logementProps = ['locationType', 'primoAccedant']
        logementProps.forEach((field) => {
            this.logement[field] = undefined
        })

        const familleProps = ['proprietaire_proche_famille']
        familleProps.forEach((field) => {
            this.famille[field] = undefined
        })

        const menageProps = ['charges_locatives', 'coloc', 'logement_chambre', 'participation_frais']
        menageProps.forEach((field) => {
            this.menage[field] = undefined
        })
        this.menage.loyer = 0

        this.demandeur.habite_chez_parents = undefined
    },
    next: function() {
      this.submitted = true
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$matomo && this.$matomo.trackEvent('General', 'Invalid form', this.$route.fullPath)
        return
      }

      this.menage.statut_occupation_logement = Logement.getStatutOccupationLogement(this.logement)
      this.menage.aide_logement_date_pret_conventionne = this.logement.pretSigneAvant2018 ? '2017-12-31' : '2018-01-01'

      this.$store.dispatch('updateMenage', this.menage)
      this.$store.dispatch('updateFoyerFiscal', this.foyer_fiscal)
      this.$store.dispatch('updateFamille', this.famille)
      this.$push()
    },
    yearsAgo: function(years) {
      return moment(this.situation.dateDeValeur).subtract(years, 'years').format('MMMM YYYY')
    },
  },
  validations: function() {
    return {
      menage: {
        depcom: { required }
      }
    }
  },
  watch: {
    communes: function() {
      let c = _.find(this.communes, { code: this.menage.depcom }) || Commune.getMostPopulated(this.communes)
      if (c.code) {
        this.menage.depcom = c.code
      }
    },
    'menage.depcom': function() {
      let c = _.find(this.communes, { code: this.menage.depcom })
      if (c) {
        this.menage._nomCommune = c.nom
        if (this.famille.parisien === undefined && this.isCommuneParis) {
          this.famille.parisien = this.isCommuneParis
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
span.help {
    font-style: italic;
}
</style>
