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

      <!--yes-no-question model="menage.coloc" v-if="captureColocation">
        <question>Est-ce une colocation ?</question>
      </yes-no-question>

      <yes-no-question model="famille.proprietaire_proche_famille" v-if="captureProprietaireProcheFamille">
        <question>Avez-vous un lien de parenté direct avec votre propriétaire ?</question>
        <help-block>Est-il un ascendant ou descendant de vous ou votre conjoint·e (enfant, grand-parent…) ?</help-block>
      </yes-no-question>

      <div class="form-group" v-show="captureLocationType">
        <label class="control-label col-sm-3">Quel type de logement louez-vous ?</label>
        <div class="col-sm-9">
          <div class="radio" v-for="locationType in locationTypes">
            <label>
              <input
                type="radio"
                name="locationType"
                v-model="logement.locationType"
                v-bind:value="locationType.id">
              {{ locationType.label }}
            </label>
          </div>
        </div>
      </div>

      <yes-no-question model="menage.logement_chambre" v-if="captureChambre">
        <question>Est-ce une chambre ?</question>
        <help-block>
          Une chambre est un logement qui ne comporte qu'une seule pièce et n'est pas équipée d'un WC.
        </help-block>
      </yes-no-question>

      <yes-no-question model="logement.primoAccedant" v-if="logement.type == 'proprietaire'">
        <question>Êtes-vous primo-accédant pour cette propriété ?</question>
        <help-block>
          Un primo-accédant est une personne (ou un ménage) qui n’a pas été propriétaire
          de sa résidence principale dans les deux années qui viennent de s’écouler au moment où il achète son bien.
        </help-block>
      </yes-no-question>

      <yes-no-question model="demandeur.habite_chez_parents" v-if="captureHabiteChezParents">
        <question>Habitez-vous avec vos parents ?</question>
      </yes-no-question>

      <yes-no-question model="menage.participation_frais" v-if="captureParticipationFrais">
        <question>Participez-vous aux frais du logement ?</question>
        <help-block>Par exemple aux dépenses d'électricité, de téléphone, etc.</help-block>
      </yes-no-question>

      <div class="row" v-if="captureLoyer">
        <div class="col-sm-6">
          <div class="form-group" ng-class="{'has-error': submitted && form.loyer.$invalid}">
            <label class="col-sm-6 control-label" for="loyer">
              {{ loyerLabel() }}
            </label>
            <div class="col-sm-5">
              <div class="input-group">
                <input type="number" min="0" class="form-control text-right" id="loyer" name="loyer" ng-model="menage.loyer"
                  select-on-focus
                  zero-to-empty
                  ng-required="captureLoyer"
                  >
                <div class="input-group-addon">€</div>
              </div>
              <span class="help-block" v-if="submitted && form.loyer.$invalid">Champ invalide</span>
            </div>
          </div>
        </div>

        <div class="col-sm-5" v-if="logement.type == 'proprietaire'">
          <p class="help-block">
            Laissez ce champ à 0 € si vous ne remboursez pas actuellement de crédit pour votre logement.
          </p>
        </div>

        <div class="col-sm-6" v-if="captureCharges">
          <div class="form-group" ng-class="{'has-error': submitted && form.charges.$invalid}">
            <label class="col-sm-5 control-label" for="charges">
              Vos charges locatives
            </label>
            <div class="col-sm-5">
              <div class="input-group">
                <input type="number" class="form-control text-right" id="charges" name="charges" ng-model="menage.charges_locatives"
                  select-on-focus
                  zero-to-empty
                  >
                <div class="input-group-addon">€</div>
              </div>
              <span class="help-block" v-if="submitted && form.charges.$invalid">Champ invalide</span>
            </div>
          </div>
        </div>
      </div>

      <yes-no-question model="logement.pretSigneAvant2018" v-if="capturePretSigneAvant2018">
        <question>Avez-vous signé votre prêt <strong>avant</strong> le 1er janvier 2018 ?</question>
      </yes-no-question-->

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
                  required
                  v-model="menage.depcom"
                  id="commune">
                  <option v-for="commune in communeOptions" v-bind:value="commune.code" v-bind:key="commune.code">
                    {{ commune.value.nom }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div v-if="captureResidentParis" class="form__group">
        <fieldset>
          <legend><h3>Avez-vous habité Paris au moins 3 ans depuis {{ yearsAgo(5) }} ?</h3></legend>
          <label><input type="radio" v-bind:value="true" name="parisien" v-model="famille.parisien">Oui</label>
          <label><input type="radio" v-bind:value="false" name="parisien" v-model="famille.parisien">Non</label>
        </fieldset>
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

import _ from 'lodash'
import Commune from '@/lib/Commune'
import Individu from '@/lib/Individu'
import Logement from '@/lib/Logement'
import Situation from '@/lib/Situation'
import { locationTypes, logementTypes } from '@/constants/logement'

export default {
  name: 'logement',
  components: {
  },
  data () {
    var s = this.$SituationService.restoreLocal()
    var m = s.menage
    return {
      communes: [],
      demandeur: s.individus[0],
      famille: s.famille,
      locationTypes,
      logementTypes,
      logement: Logement.getLogementVariables(m.statut_occupation_logement),
      menage: m,
      retrievingCommunes: false,
      situation: s,
      submitted: false,
    }
  },
  computed: {
    captureColocation: function() {
        return this.logement.type == 'locataire';
    },
    captureChambre: function() {
        return this.logement.type == 'locataire' && 'foyer' !== this.logement.locationType && this.logement.locationType !== undefined;
    },
    captureHabiteChezParents: function() {
        var age = Individu.age(this.demandeur);
        return (this.logement.type == 'heberge') && this.demandeur.fiscalementIndependant && (age >= 18) && (age < 25) && (! Situation.hasEnfant(this.situation));
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
        return (this.logement.type == 'heberge') && (! this.captureHabiteChezParents || this.demandeur.habite_chez_parents !== undefined);
    },
    capturePretSigneAvant2018:function() {
        return this.logement.type == 'proprietaire' && this.logement.primoAccedant && (this.menage && this.menage.loyer > 0)
    },
    captureProprietaireProcheFamille: function() {
        return this.logement.type == 'locataire' && this.menage.coloc !== undefined;
    },
    captureResidentParis: function() {
        return this.captureCodePostal && this.logement.type != 'sansDomicile' && this.communeStartsWith('Paris');
    },
    communeOptions: function() {
      return this.communes.map(c => { return { value: c, text: c.nom } })
    },
    isAdresseValid: function() {
        return this.menage.depcom && this.menage.code_postal;
    },
    isResidentMayotte: function () {
        return this.isAdresseValid && this.menage.code_postal.indexOf('976') === 0;
    },
    maySubmit: function() {
        return this.captureCodePostal && ! this.isResidentMayotte
    },
  },
  methods: {
    changeLogementType: function() {
        ['locationType', 'primoAccedant'].forEach((field) => {
            delete this.logement[field];
        });
        ['proprietaire_proche_famille'].forEach((field) => {
            delete this.famille[field];
        });
        ['charges_locatives', 'coloc', 'logement_chambre', 'participation_frais'].forEach((field) => {
            delete this.menage[field];
        });
        this.menage.loyer = 0;

        delete this.demandeur.habite_chez_parents;
    },
    communeStartsWith: function(prefix) {
        return this.isAdresseValid && this.menage.nom_commune.toUpperCase().indexOf(prefix.toUpperCase()) === 0;
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
            this.communes = [];
            return;  // the user has made the value invalid since we were called
        }

        this.retrievingCommunes = true;
        Commune.get(this.menage.code_postal)
            .then((communes) => {
                this.communes = communes;
                var commune = this.getSelectedCommune();
                this.menage.depcom = commune.code;
                this.menage.nom_commune = commune.nom;
                if (! initial) {
                    this.famille.parisien = this.communeStartsWith('Paris');
                }
            })
            .catch(function() {
              this.communes = []
            })
            .finally(() => {
                this.retrievingCommunes = false;
            });
    }
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
