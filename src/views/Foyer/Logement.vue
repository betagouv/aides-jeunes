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

      <YesNoQuestion v-model="menage.coloc" v-if="captureColocation">
        Est-ce une colocation ?
      </YesNoQuestion>

      <YesNoQuestion v-model="famille.proprietaire_proche_famille" v-if="captureProprietaireProcheFamille">
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

      <YesNoQuestion v-model="menage.logement_chambre" v-if="captureChambre">
        Est-ce une chambre ?
        <template v-slot:help>
          Une chambre est un logement qui ne comporte qu'une seule pièce et n'est pas équipée d'un WC.
        </template>
      </YesNoQuestion>

      <YesNoQuestion v-model="logement.primoAccedant" v-if="logement.type == 'proprietaire'">
        Êtes-vous primo-accédant pour cette propriété ?
        <template v-slot:help>
          Un primo-accédant est une personne (ou un ménage) qui n’a pas été propriétaire
          de sa résidence principale dans les deux années qui viennent de s’écouler au moment où il achète son bien.
        </template>
      </YesNoQuestion>

      <YesNoQuestion v-model="demandeur.habite_chez_parents" v-if="captureHabiteChezParents">
        Habitez-vous avec vos parents ?
      </YesNoQuestion>

      <YesNoQuestion v-model="menage.participation_frais" v-if="captureParticipationFrais">
        Participez-vous aux frais du logement ?
        <template v-slot:help>Par exemple aux dépenses d'électricité, de téléphone, etc.</template>
      </YesNoQuestion>

      <div v-if="captureLoyer">
        <div>
          <div class="form__group" v-bind:class="{'has-error': submitted && form.loyer.$invalid}">
            <label for="loyer">
              {{ loyerLabel }}
            </label>
            <input type="number" id="loyer" name="loyer" v-model.number="menage.loyer">
            <span v-if="submitted && form.loyer.$invalid">Champ invalide</span>
          </div>
        </div>

        <p v-if="logement.type == 'proprietaire'">
          Laissez ce champ à 0 € si vous ne remboursez pas actuellement de crédit pour votre logement.
        </p>

        <div v-if="captureCharges">
          <div class="form__group" v-bind:class="{'has-error': submitted && form.charges.$invalid}">
            <label for="charges">
              Vos charges locatives
            </label>
            <div>
              <div>
                <input type="number" id="charges" name="charges" v-model.number="menage.charges_locatives">
              </div>
              <span v-if="submitted && form.charges.$invalid">Champ invalide</span>
            </div>
          </div>
        </div>
      </div>

      <YesNoQuestion v-model="logement.pretSigneAvant2018" v-if="capturePretSigneAvant2018">
        Avez-vous signé votre prêt <strong>avant</strong> le 1er janvier 2018 ?
      </YesNoQuestion>

      <div v-show="captureCodePostal">
        <div class="row">
          <div>
            <label for="postal-code">Code postal</label>
            <div>
              <input
                type="text"
                minlength="5"
                maxlength="5"
                id="postal-code"
                required
                v-model="menage.code_postal">
              <span v-if="submitted && ! isAdresseValid">Ce code postal est invalide</span>
            </div>
          </div>
        </div>

        <div>
          <div>
            <p v-if="retrievingCommunes"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
            <div v-show="communes.length">
              <label for="commune">Ville</label>
              <div>
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
        </div>
      </div>

      <div v-if="captureResidentParis" class="form__group">
        <YesNoQuestion v-model="parentsPayPensionsAlimentaires"><h1>
          <h3>Avez-vous habité Paris au moins 3 ans depuis {{ yearsAgo(5) }} ?</h3>
        </h1></YesNoQuestion>
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
import Commune from '@/lib/Commune'
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
      communes: [],
      demandeur: situation.individus[0],
      famille: situation.famille,
      locationTypes,
      logementTypes,
      logement,
      menage,
      retrievingCommunes: false,
      situation,
      submitted: false,
    }
  },
  computed: {
    captureColocation: function() {
        return this.logement.type == 'locataire';
    },
    captureChambre: function() {
        return this.logement.type == 'locataire' && 'foyer' !== this.logement.locationType && this.logement.locationType !== undefined
    },
    captureCharges: function() {
        return (this.logement.type == 'locataire') && (this.logement.locationType !== 'meublehotel')
    },
    captureHabiteChezParents: function() {
        var age = Individu.age(this.demandeur);
        return (this.logement.type == 'heberge') && this.demandeur.fiscalementIndependant && (age >= 18) && (age < 25) && (! Situation.hasEnfant(this.situation))
    },
    captureCodePostal: function() {
        return _.some([
            this.logement.primoAccedant !== undefined,
            this.logement.locationType == 'foyer',
            this.menage.logement_chambre !== undefined,
            this.logement.type == 'heberge' && this.menage.participation_frais !== undefined,
            this.logement.type == 'sansDomicile'
        ]);
    },
    captureLocationType: function() {
        return this.logement.type == 'locataire' && this.famille.proprietaire_proche_famille !== undefined;
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
        return this.captureCodePostal && this.logement.type != 'sansDomicile' && this.communeStartsWith('Paris')
    },
    isAdresseValid: function() {
        return this.menage.depcom && this.menage.code_postal
    },
    isResidentMayotte: function () {
        return this.isAdresseValid && this.menage.code_postal.indexOf('976') === 0
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
    communeStartsWith: function(prefix) {
        return this.isAdresseValid && this.menage.nom_commune.toUpperCase().indexOf(prefix.toUpperCase()) === 0
    },
    getSelectedCommune: function() {
        return _.find(this.communes, { code: this.menage.depcom }) || Commune.getMostPopulated(this.communes)
    },
    next: function() {
      this.menage.statut_occupation_logement = Logement.getStatutOccupationLogement(this.logement)
      this.menage.aide_logement_date_pret_conventionne = this.logement.pretSigneAvant2018 ? '2017-12-31' : '2018-01-01'
      this.$SituationService.saveLocal()
      this.$router.push('/foyer/pensions-alimentaires')
    },
    updateCommunes: function(initial) {
        if (! this.menage.code_postal || this.menage.code_postal.length !== 5) {
            this.communes = []
            return // the user has made the value invalid since we were called
        }

        this.retrievingCommunes = true
        Commune.get(this.menage.code_postal)
            .then((communes) => {
                this.communes = communes
                var commune = this.getSelectedCommune()
                this.menage.depcom = commune.code
                this.menage.nom_commune = commune.nom
                if (! initial) {
                    this.famille.parisien = this.communeStartsWith('Paris')
                }
            })
            .catch(function() {
              this.communes = []
            })
            .finally(() => {
                this.retrievingCommunes = false
            });
    }
  },
  mounted: function() {
    this.updateCommunes(true)
  },
  watch: {
    'menage.code_postal': function() {
      this.updateCommunes()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
