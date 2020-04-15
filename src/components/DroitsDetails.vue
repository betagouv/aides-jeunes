<template>
  <div class="droit-details">
    <div v-for="droit in droits" v-bind:id="droit.id" v-bind:key="droit.id" class="droit-detail"
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
          <span v-html="droit.description" itemprop="description"></span>
           <BenefitCtaLink
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

import BenefitCta from './BenefitCta'
import BenefitCtaLink from './BenefitCtaLink'
import DroitMontant from './DroitMontant'

export default {
  name: 'DroitsDetails',
  props: {
    droits: Array,
    filter: Array,
    patrimoineCaptured: Boolean,
    ressourcesYearMinusTwoCaptured: Boolean,
  },
  components: {
    BenefitCta,
    BenefitCtaLink,
    DroitMontant,
  },
  data: function() {
    return {
    }
  },
  computed: {
    list: function() {
      let vm = this
      return _.filter(this.droits, function(value) {
        return (!vm.filter) ||_.includes(vm.filter, value.id)
      })
    },
  },
  methods: {
    isEmpty: (array) => array.length === 0,
    isNotEmpty: (array) => array.length !== 0,
    isBoolean: _.isBoolean,
    isNumber: _.isNumber,
    isString: _.isString,

  },
}
</script>

<style lang="scss">
.droit-detail-buttons {
  text-align: center;
}
</style>
