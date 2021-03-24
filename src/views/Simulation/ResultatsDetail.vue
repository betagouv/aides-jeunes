<template>
  <div class="container">
    <div class="droit-detail"
      itemscope itemtype="http://schema.org/GovernmentService">

      <div class="droit-detail-heading">
        <h2 itemprop="name">{{ droit.label }}</h2>
        <div class="dotted-line"></div>
        <DroitMontant v-bind:droit="droit" unexpected v-if="droit.montant && (isString(droit.montant) || isNumber(droit.montant))" />
      </div>

      <div class="notification warning print-hidden" v-if="droit.isBaseRessourcesYearMinusTwo && ! ressourcesYearMinusTwoCaptured && ! isString(droit.montant)">
        <span>
          <i class="fa fa-warning" aria-hidden="true"></i>  Cette aide se base sur vos ressources de l'année {{ $store.state.dates.fiscalYear.label }}
        </span>

        <router-link class="button-outline warning text-center" to="ressources/fiscales">Déclarez vos ressources {{ $store.state.dates.fiscalYear.label }}</router-link>
      </div>

      <div class="notification warning print-hidden" v-if="droit.isBaseRessourcesPatrimoine && ! patrimoineCaptured && ! isString(droit.montant)">
        <span>
          <i class="fa fa-warning" aria-hidden="true"></i> Cette aide se base sur votre patrimoine. Vous avez un patrimoine immobilier, d'épargne, des revenus fonciers et/ou du capital ? Vous devez renseigner des informations complémentaires.
        </span>

        <router-link class="button-outline warning text-center" to="ressources/patrimoine">Déclarez votre patrimoine</router-link>
      </div>

      <div class="notification warning print-hidden" v-if="isString(droit.montant)">
        <p>
          L'application Mes Aides ne peut pas calculer le montant de cette prestation, car <span v-html="droit.uncomputability[droit.montant].reason.user"></span>.
          <br>
          <strong
            v-if="droit.uncomputability[droit.montant].solution"
            v-html="droit.uncomputability[droit.montant].solution"></strong>
        </p>
      </div>

      <div class="droit-detail-description">
        <p>
          <span v-html="droit.description" itemprop="description"></span> <BenefitCtaLink
            v-if="droit.link"
            v-bind:analytics-name="droit.label"
            v-bind:link="droit.link"
            v-bind:benefit="droit"
            type="link"
            level="'inline'"
            itemprop="termsOfService"
          />
        </p>
        <div v-if="droit.conditions">
          <p>Pour en bénéficier, vous devez également :</p>
          <ul class="list-unstyled">
            <li v-for="(condition, index) in droit.conditions" v-bind:key="index">
              <i class="fa fa-check" aria-hidden="true"></i> <span v-html="condition"></span>
            </li>
          </ul>
        </div>
      </div>

      <div class="droit-detail-buttons print-hidden">
        <BenefitCta class="droit-detail-buttons-cta" v-bind:benefit="droit"></BenefitCta>
        <a v-if="droit.msa"
          target="_blank"
          rel="noopener"
          href="http://www.msa.fr/lfr/web/msa/espace-prive"
          v-analytics="{ name:droit.label, action:'msa', category:'General'}"
        >
          Démarches pour les professions agricoles
        </a>
        <router-link
          class="button-outline primary"
          v-if="droit.provider.etablissements && droit.provider.etablissements.length > 0"
          v-analytics="{ name:droit.label, action:'show-locations', category:'General'}"
          v-bind:to="{ name: 'resultat/lieux', params: { id: droit.id }}">
          <i class="fa fa-home"></i> Trouver une agence
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

import BenefitCta from '../../components/BenefitCta'
import BenefitCtaLink from '../../components/BenefitCtaLink'
import DroitMontant from '../../components/DroitMontant'

export default {
  name: 'SimulationResultats',
  data: function() {
    return {
      openfiscaTracerURL: false,
      openfiscaAxeURL: false,
      showExpertLinks: false,
      showPrivate: false
    }
  },
    components: {
    BenefitCta,
    BenefitCtaLink,
    DroitMontant,
  },
  computed: {
    droits: function() { return this.resultats && this.resultats.droitsEligibles },
    resultats: function() { return this.$store.state.calculs.resultats },
    situation: function() { return this.$store.state.situation },
    droit: function() {
        const droitId = this.$route.params.droitId
        const droit = _.find(this.droits || [], function(droit) {
            return droit.id === droitId;
        });
        return droit || {}
    },
    patrimoineCaptured: function() {
        return !this.shouldPatrimoineBeCaptured
    },
    shouldPatrimoineBeCaptured: function() {
      if (! this.droits) {
        return
      }

      return _.some(this.droits, 'isBaseRessourcesPatrimoine') && this.$store.getters.hasPatrimoine === undefined
    },
    ressourcesYearMinusTwoCaptured: function() { return this.$store.getters.ressourcesYearMinusTwoCaptured },
    city: function() {
      return this.situation.menage.depcom
    }
  },
  methods: {
    isEmpty: (array) => array.length === 0,
    isNotEmpty: (array) => array.length !== 0,
    isBoolean: _.isBoolean,
    isNumber: _.isNumber,
    isString: _.isString,
  }
}
</script>

<style scoped lang="scss">

h4 {
  margin-top: 0.7em;
}

.container, .panel {
  opacity: 1;
}

.injected .droit-detail-heading {
  padding: 0;
}

.injected .droit-detail-description p {
  margin: 0;
}

pre {
  white-space: pre-wrap;
}
.droit-detail-buttons {
  text-align: center;
}
</style>
