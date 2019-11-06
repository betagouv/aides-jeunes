<template>
  <form @submit.prevent="submit">
    <h1>{{title | capitalize}}</h1>
    <div class="form__group">
      <label>Date de naissance
        <InputDate v-model="individu.date_naissance" />
        <p class="notification warning" v-if="$v.individu.date_naissance.$dirty && $v.individu.date_naissance.$error">
          Ce champ est obligatoire.
        </p>
      </label>
    </div>

    <p class="notification warning" v-if="isDemandeurMineur">
      <i class="fa fa-warning" aria-hidden="true"></i>
      Les aides simulées ne peuvent normalement être attribuées qu'à des personnes majeures.<br>
      Pour bénéficier d'aides, vous devrez démontrer aux organismes qui les distribuent que vous n'avez plus de liens avec vos parents ou tuteurs.<br>
      Si ce n'est pas le cas, faites plutôt la simulation du point de vue d'un de vos parents ou tuteurs.
    </p>

    <div class="form__group" v-if="captureFirstName">
      <label>Prénom
        <span>(il servira uniquement à vous faciliter la saisie par la suite)</span>
        <input type="text" v-model="individu.firstName">
        <p class="notification warning" v-if="$v.individu.firstName.$error">
          Ce champ est obligatoire.
        </p>
      </label>
    </div>

    <div class="form__group">
      <label>Nationalité</label>
      <NationalityChoice v-model="individu.nationalite" />
    </div>
    
    <div class="form__group" v-if="captureOutOfFranceQuestions">
      <label>
        <input type="checkbox" v-model="satisfyResidentialDurationPrerequisite">
        Résidant en France plus de 9 mois par an
        <p class="notification warning" v-if="$v.satisfyResidentialDurationPrerequisite.$error">
          Vous devez remplir cette condition pour être éligible aux aides sociales calculées par ce simulateur.
        </p>
      </label>
    </div>

    <div class="form__group" v-if="captureOutOfFranceQuestions && satisfyResidentialDurationPrerequisite">
      <label>
        <input
          type="checkbox"
          v-model="satisfyResidentialPermitPrerequisite[getZone()]"
        >
        <span v-html=residentialPermitLabel[getZone()]></span>
        <p class="notification warning" v-if="$v.satisfyResidentialPermitPrerequisite[getZone()].$error">
          Vous devez remplir cette condition pour être éligible aux aides sociales calculées par ce simulateur.
        </p>
      </label>
    </div>

    <div class="form__group" v-if="individu.role == 'conjoint'">
      <label>Votre relation
        <select v-model="individu.statut_marital">
          <option v-for="situationFamiliale in situationsFamiliales" v-bind:value="situationFamiliale.value" v-bind:key="situationFamiliale.value">
            {{situationFamiliale.label}}
          </option>
        </select>
      </label>
    </div>

    <div class="form__group">
      <label>
        <span v-if="individu.role == 'demandeur'">Vous êtes</span>
        <span v-if="individu.role == 'conjoint'">Votre conjoint·e est</span>
        <span v-if="individu.role == 'enfant'">Il ou elle est</span>
        <span>(plusieurs choix possibles)</span>
      </label>
      <div>
        <label v-if="captureGardeAlternee">
          <input type="checkbox" v-model="individu.garde_alternee">
          En garde alternée
        </label>
        <label v-for="statut in specificSituations" v-bind:key="statut.id">
          <input type="checkbox" v-model="selectedStatuts[statut.id]">
          {{ statut.label }}
        </label>
        <label>
          <input type="checkbox" v-model="individu.enceinte">
          Enceinte
        </label>
        <label>
          <input type="checkbox" v-model="individu.no_specific_situation">
          <i>{{ individu.role == 'demandeur' ? 'Je ne suis dans' : 'Il ou elle n\'est dans' }} aucune de ces situations</i>
        </label>
      </div>
    </div>

    <ASSQuestions class="form__group" v-bind:individu="individu" v-if="captureEligibiliteAss" />

    <div class="form__group" v-if="captureTauxIncapacite">
      <label for="tauxIncapacite">
        {{ individu.role == 'demandeur' ? 'Votre' : 'Son' }} taux d'incapacité
        <span>
        évalué par <a target="_blank" rel="noopener" href="http://informations.handicap.fr/carte-france-mdph.php">votre <abbr title="Maison départementale des personnes handicapées">MDPH</abbr></a>.
        </span>
      </label>
      <label v-for="tauxIncapacite in tauxIncapaciteOptions" v-bind:key="tauxIncapacite.value">
        <input type="radio"
            name="tauxIncapacite"
            v-model="individu.taux_incapacite"
            v-bind:value=" tauxIncapacite.value"
            />
            {{ tauxIncapacite.label }}
      </label>
    </div>

    <YesNoQuestion class="form__group" v-model="individu.aah_restriction_substantielle_durable_acces_emploi"
      v-if="captureRestrictionSubstantielleDurableAccesEmploi"
    >
    {{ individu.role == 'demandeur' ? 'Avez-vous' : 'A-t-il/elle' }}
      une restriction substantielle et durable d'accès à l'emploi reconnue par la <abbr title="Commission des droits et de l'autonomie des personnes handicapées">CDAPH</abbr> ?
      <span>Attention, cette restriction est différente de la reconnaissance de la qualité de travailleur handicapé.</span>
    </YesNoQuestion>

    <YesNoQuestion class="form__group" v-model="individu.enfant_place" v-if="captureEnfantPlace">
      Est-il/elle placé·e en structure spécialisée ou famille d'accueil ?
    </YesNoQuestion>

    <label class="form__group" v-if="selectedStatuts.etudiant">
      À quel échelon {{ individu.role == 'demandeur' ? 'êtes-vous' : 'est-il/elle' }} boursier ?
      <input id="echelon-bourse" v-model="individu.echelon_bourse" type="range" min="-1" max="7">
      {{ individu.echelon_bourse == -1 ? 'Non boursier': 'Boursier échelon ' + individu.echelon_bourse }}
    </label>

    <YesNoQuestion class="form__group" v-model="fiscalementIndependant" v-if="captureDemandeurACharge">
      Remplirez-vous vous-même votre prochaine déclaration de revenus aux impôts ?
    </YesNoQuestion>

    <label class="form__group" v-if="captureScolarite">
      Où sera-t-il/elle scolarisé·e à la rentrée prochaine ?
      <select v-model="individu.scolarite">
        <option v-for="scolarite in scolariteOptions" v-bind:value="scolarite.value" v-bind:key="scolarite.value">{{scolarite.label}}</option>
      </select>
    </label>

    <YesNoQuestion class="form__group" v-model="individu.enfant_a_charge[dates.thisYear.id]" v-if="captureEnfantACharge">
      Figure-t-il/elle sur votre dernière déclaration d'impôt sur le revenu ?
    </YesNoQuestion>


    <div class="form__group" v-if="capturePerteAutonomie">
      <label for="gir" id="girQuestion">
        Avez-vous besoin d’une aide à la personne ?
      </label>
      <label v-for="gir in GIROptions" v-bind:key="gir.value">
        <input type="radio" name="gir" v-bind:value="gir.value" v-model="individu.gir"/>
        {{ gir.label }}
      </label>
    </div>

    <div v-if="showCancelButton">
    </div>

    <div class="text-right" >
      <button type="submit" class="button large">Valider</button>
    </div>

    <button v-if="showCancelButton" class="button large secondary" v-on:click.prevent="$emit('cancel')">Annuler</button>
  </form>
</template>

<script>
import _ from 'lodash'
import { required } from 'vuelidate/lib/validators'

import InputDate from '@/components/InputDate'
import { specificSituations } from '@/constants/specificSituations'
import ASSQuestions from '@/components/ASSQuestions'
import Individu from '@/lib/Individu'
import Nationality from '@/lib/Nationality'
import NationalityChoice from '@/components/NationalityChoice'
import YesNoQuestion from '@/components/YesNoQuestion'

const tauxIncapaciteOptions = [
  {
    value: 0.3,
    label: 'Moins de 50%'
  },
  {
    value: 0.7,
    label: 'Entre 50% et 80%'
  },
  {
    value: 0.9,
    label: 'Plus de 80%'
  }
]

const scolariteOptions = [
  {
      value: 'inconnue',
      label: 'Aucun des deux'
  },
  {
      value: 'college',
      label: 'Au collège'
  },
  {
      value: 'lycee',
      label: 'Au lycée / En CAP / En CPA'
  }
]

const GIROptions = [
    {
        value: 'gir_6',
        label: 'Jamais',
    },
    {
        value: 'gir_5',
        label: 'Ponctuellement',
    },
    {
        value: 'gir_1',
        label: 'Régulièrement'
    }
]

const residentialPermitLabel = {
  autre: 'En possession d‘une carte de résident ou d‘un titre de séjour valide',
  ue: 'En possession d‘un <a target="_blank" rel="noopener" href="https://www.service-public.fr/particuliers/vosdroits/F2651">droit au séjour</a> valide',
}

const situationsFamiliales = [
  {
      value: 'marie',  // Enum value 1 in OpenFisca
      label: 'Marié·e',
  },
  {
      value: 'pacse',  // Enum value 5 in OpenFisca
      label: 'Pacsé·e',
  },
  {
      value: 'celibataire',  // Enum value 2 in OpenFisca
      label: 'En union libre',
  }
]

const mustBeTruthy = function(value) { return Boolean(value) }

export default {
  name: 'IndividuForm',
  components: {
    ASSQuestions,
    InputDate,
    NationalityChoice,
    YesNoQuestion,
  },
  props: {
    existingIndividu: Boolean,
    value: Object,
  },
  data: function() {
    let individu = this.value
    let selectedStatuts = {}
    individu.specificSituations.forEach(function(specificSituation) {
        selectedStatuts[specificSituation] = true
    })

    let satisfyResidentialPermitPrerequisite = {}
    if (this.existingIndividu) {
      satisfyResidentialPermitPrerequisite = {[this.getZone(individu && individu.nationalite)] :  true}
    }

    return {
      GIROptions,
      individu,
      isIndividuParent: Individu.isRoleParent(individu.role),
      residentialPermitLabel,
      satisfyResidentialDurationPrerequisite: this.existingIndividu,
      satisfyResidentialPermitPrerequisite,
      scolariteOptions,
      selectedStatuts,
      situationsFamiliales,
      specificSituations,
      tauxIncapaciteOptions,
      title: (individu.role === 'enfant' && ! this.existingIndividu) ? 'Nouvel enfant' : Individu.label(individu),
    }
  },
  computed: {
    captureDemandeurACharge: function() {
      let age = Individu.age(this.individu, this.dates.today.value)
      return this.individu.role == 'demandeur' && (age >= 18) && (age < 25)
    },
    captureEligibiliteAss: function() {
      return this.isIndividuParent && this.selectedStatuts['chomeur']
    },
    captureEnfantACharge: function() {
      return (! this.isIndividuParent) && Individu.age(this.individu, this.dates.today.value) >= 1
    },
    captureEnfantPlace: function() {
      return (! this.isIndividuParent) && this.selectedStatuts.handicap
    },
    captureGardeAlternee: function() {
      return ! this.isIndividuParent
    },
    captureOutOfFranceQuestions: function() {
      return this.individu.role == 'demandeur' && this.individu.nationalite != 'FR'
    },
    capturePerteAutonomie: function() {
      return Individu.age(this.individu, this.dates.today.value) >= 60
    },
    captureFirstName: function() {
      return ! this.isIndividuParent
    },
    captureRestrictionSubstantielleDurableAccesEmploi: function() {
      return this.captureTauxIncapacite && this.isIndividuParent && this.individu.taux_incapacite == 0.7
    },
    captureScolarite: function() {
      if (! this.isIndividuParent) {
          let age = Individu.age(this.individu, this.dates.today.value)
          return age <= 25 && age > 8
      }

      return false
    },
    captureTauxIncapacite: function() {
      return this.selectedStatuts.handicap
    },
    fiscalementIndependant: {
      get: function() {
        return !this.individu.enfant_a_charge[this.dates.thisYear.id]
      },
      set: function(value) {
        this.individu.enfant_a_charge[this.dates.thisYear.id] = !value
      }
    },
    isNaissanceValid: function() {
      return ! this.$v.individu.date_naissance.$invalid
    },
    isDemandeurMineur: function() {
      return this.individu.role === 'demandeur' && this.isNaissanceValid && Individu.age(this.individu, this.date) < 18
    },
    showCancelButton: function() {
      return (this.individu.role === 'enfant' && ! this.existingIndividu)
    },
  },
  methods: {
    getZone: function(nationalite) {
      return Nationality.getZone(nationalite || this.individu && this.individu.nationalite)
    },
    submit: function() {
      this.individu.specificSituations = []
      let individu = this.individu
      _.forEach(this.selectedStatuts, function(selected, statut) {
          if (selected) {
              individu.specificSituations.push(statut)
          }
      })

      if (! this.captureDureePossessionTitreSejour) {
          delete this.individu.duree_possession_titre_sejour
      }

      if (! this.captureEligibiliteAss) {
          delete this.individu.ass_precondition_remplie
          delete this.individu.date_debut_chomage
      }

      if (! this.captureTauxIncapacite) {
          delete this.individu.taux_incapacite
      }

      if (! this.captureRestrictionSubstantielleDurableAccesEmploi) {
          delete this.individu.aah_restriction_substantielle_durable_acces_emploi
      }

      if (! this.captureScolarite) {
          delete this.individu.scolarite
      }

      this.$v.$touch()
      if (! this.$v.$invalid) {
        this.$emit('input', this.individu)
      }
    },
  },
  validations: function() {
    let validations = {
      individu: {
        date_naissance: { required }
      }
    }

    if (this.captureFirstName) {
      validations.individu.firstName = { required }
    }

    if (this.captureOutOfFranceQuestions) {
      validations.satisfyResidentialDurationPrerequisite = { mustBeTruthy }
      validations.satisfyResidentialPermitPrerequisite = { [this.getZone()] : { mustBeTruthy }}
    }

    return validations
  }
}
</script>
