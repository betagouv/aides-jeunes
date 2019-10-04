<template>
  <div class="droit-details">
    <div v-for="droit in droits" v-bind:id="droit.id" class="droit-detail"
      itemscope itemtype="http://schema.org/GovernmentService">

      <div class="droit-detail-heading">
        <h2 itemprop="name">{{ droit.label }}</h2>
        <div class="dotted-line"></div>
        <DroitMontant v-bind:droit="droit" unexpected v-if="droit.montant && (isString(droit.montant) || isNumber(droit.montant))" />
      </div>

      <div class="notification warning print-hidden" v-if="droit.isBaseRessourcesYearMoins2 && ! ressourcesYearMoins2Captured && ! isString(droit.montant)">
        <span>
          <i class="fa fa-warning" aria-hidden="true"></i>  Cette aide se base sur vos ressources de l'année {{ yearMoins2 }}
        </span>
        <a class="button-outline warning" ui-sref="foyer.ressourcesYearMoins2">Déclarez vos ressources {{ yearMoins2 }}</a>
      </div>

      <div class="notification warning print-hidden" v-if="droit.isBaseRessourcesPatrimoine && ! patrimoineCaptured && ! isString(droit.montant)">
        <span>
          <i class="fa fa-warning" aria-hidden="true"></i> Cette aide se base sur votre patrimoine. Vous avez un patrimoine immobilier, d'épargne, des revenus fonciers et/ou du capital ? Vous devez renseigner des informations complémentaires.
        </span>
        <a class="button-outline warning text-center" ui-sref="foyer.patrimoine">Déclarez votre patrimoine</a>
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
            v-bind:analytics-name="droit.label"
            v-bind:link="droit.link"
            type="link"
            level="'inline'"
            itemprop="termsOfService"
          />
        </p>
        <div v-if="droit.conditions">
          <p>Pour en bénéficier, vous devez également :</p>
          <ul class="list-unstyled">
            <li v-for="condition in droit.conditions">
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
          class="btn btn-sm btn-secondary"
          href="http://www.msa.fr/lfr/web/msa/espace-prive"
          analytics-on="click"
          v-bind:analytics-name="droit.label"
          analytics-event="msa"
        >
          Démarches pour les professions agricoles
        </a>
<!--         <etablissements-cta
          class="droit-detail-buttons-cta"
          city="city"
          types="droit.provider.etablissements"
          droit="droit"
          v-if="droit.provider.etablissements.length > 0"
        >
        </etablissements-cta> -->
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
    ressourcesYearMoins2Captured: Boolean,
    yearMoins2: String,
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
    goToFeedback: function() {
      alert('TODO')
    },
    isEmpty: (array) => array.length === 0,
    isNotEmpty: (array) => array.length !== 0,
    isBoolean: _.isBoolean,
    isNumber: _.isNumber,
    isString: _.isString,

  },
}
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.notification {
  display: flex;
    justify-content: space-between;
    align-items: center;

}
.droit-detail {
  margin-bottom: 30px;

  &-heading {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 15px 0;
    position: relative;

    h2 {
      font-weight: 600;
      margin: 0;
    }
  }

  &-description {
    margin-bottom: 15px;
  }

  &-buttons {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 15px;

    &-cta {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
    }

    @media (max-width: $screen-sm-max) {
      &, > * {
        flex-direction: column;
        width: 100%;
      }
      .btn-secondary {
        order: 3;
      }
    }
  }

  .alert-warning {
    align-items: center;
    display: flex;
    font-weight: 400;
    justify-content: space-between;
  }
}

.montant i {
  position: relative;
  top: 0.4em;
}

@media print {
  .droit-detail {
    page-break-inside: avoid;
  }
}

</style>