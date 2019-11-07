<template>
  <span class="droit-montant droit-montant--unexpected" itemscope itemtype="http://schema.org/Offer" itemprop="offers">
    <span class="droit-montant-label">
      <span itemprop="price" ng-if="isNumber(droit.montant)" class="montant">
        {{ droit.montant | currency(( droit.unit || '€' ), getFractionSize(droit)) }}
      </span>
      <span v-if="isString(droit.montant)">
        <i class="fa fa-question-circle fa-2x"></i>
      </span>
      <span v-if="isNumber(droit.montant)" class="montant-detail">
        {{ droit.legend || (droit.isMontantAnnuel ? '/ an' : '/ mois') }}
      </span>
    </span>
    <a class="droit-montant-unexpected"
      v-on:click="openModal"
      analytics-on="click"
      v-bind:analytics-name="droit.label"
      analytics-event="show-unexpected"
      v-if="showUnexpected">
      Montant inattendu ?
    </a>
  </span>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'DroitMontant',
  props: {
    droit: Object,
  },
  data: function() {
    // TODO1 showUnexpected
    // var situation = SituationService.restoreLocal();
    // var isProprietaireAvecPretEnCours = SituationService.isProprietaireAvecPretEnCours(situation);
    // var isHebergeParticipeFrais = SituationService.isHebergeParticipeFrais(situation);
    // var isPpa = scope.droit.id === 'ppa';

    // scope.showUnexpected = attributes.hasOwnProperty('unexpected') && (isPpa && (isProprietaireAvecPretEnCours || isHebergeParticipeFrais));
    return {
      showUnexpected: false,
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
  filters : {
    currency: function(value, currency/*, frac*/) {
      return `${value} ${currency}`
    }
  },
  methods: {
    isEmpty: (array) => array.length === 0,
    isNotEmpty: (array) => array.length !== 0,
    isBoolean: _.isBoolean,
    isNumber: _.isNumber,
    isString: _.isString,
    getFractionSize: function(droit) {
      return droit.floorAt < 1 ? 2 : 0;
    },
    openModal: function() {
      alert('TODO1')
      /*
      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        size: 'lg',
        templateUrl: '/partials/ppa-help.html',
        controller: 'ppaHelpCtrl',
        resolve: {
          situation: function() {
            return situation
          },
          droit: function() {
            return scope.droit;
          }
        }
      })//*/
    }
  },
}
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.droit-montant {

  display: inline-block;
  text-align: right;
  color: $text-color;

  &:hover,
  &:active {
    text-decoration: none;
  }

  .montant {
    font-size: 18px;
    font-weight: 600;

    @media (min-width: $screen-md-min) {
      font-size: 22px;
    }
  }

  .montant-detail {
    display: inline-block;
  }

  &--unexpected {
    .droit-montant-label {
      display: block;
    }
  }

  .droit-montant-unexpected {
    cursor: pointer;
  }
}
</style>
