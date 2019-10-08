<template>
  <div class="droits-list">
    <a v-for="droit in list"
      href
      v-on:click="scrollTo(droit)"
      class="droits-list-item"
      itemscope itemtype="http://schema.org/GovernmentService"
      analytics-on="click"
      v-bind:analytics-name="droit.label"
      analytics-event="click"
      analytics-category="General"
      >
      <div class="droits-list-item-cell">
        <div class="droits-list-item-cell-left">
          <img v-bind:src="require(`./../../public/img/${ droit.provider.imgSrc }`)" v-bind:alt="droit.label">
          <div>
            <h2>
              <span itemprop="name">{{ droit.label }}</span>
              <small>Comment l'obtenir ?</small>
            </h2>
          </div>
        </div>
        <div class="dotted-line"></div>
        <droit-montant v-bind:droit="droit" v-if="droit.montant && (isString(droit.montant) || isNumber(droit.montant))"></droit-montant>
        <div v-if="droit.montant && isBoolean(droit.montant)">
          <i class="fa fa-check-circle fa-2x"></i>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
import _ from 'lodash'

import DroitMontant from './DroitMontant'

export default {
  name: 'DroitsEligiblesList',
  props: {
    city: Object,
    droits: Array,
    filter: Array,
    patrimoineCaptured: Boolean,
    ressourcesYearMoins2Captured: Boolean,
    yearMoins2: String,
  },
  components: {
    DroitMontant
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
@import '~font-awesome/scss/variables';
$fa-font-path: '~font-awesome/fonts';

@import '~font-awesome/scss/mixins';

.droits-list {
  background-color: white;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
  display: block;
  margin-bottom: 40px;
}

.droits-list-item-cell {
  align-items: center;
  color: #333;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-between;

  &-left {
    align-items: center;
    display: flex;
    flex-direction: row;

    h2 {
      margin: 0;

      @media (max-width: 300/*$screen-xs-max*/) {
        font-size: 0.6;
      }

      small {
        color: $link-color;
        display: block;
        margin-top: 6px;
        font-size: 65%;
        font-weight: 400;
      }
    }

    img {
      margin-right: 15px;
      width: 60px;

      @media (max-width: $screen-xs-max) {
        width: 40px;
      }
    }
  }
}


.droits-list-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
  text-decoration: none;


  &:active,
  &:focus,
  &:hover {
    * {
      color: #999;
    }

    text-decoration: none;


    h2 small {
      color: $link-color;
      text-decoration: underline;
    }
  }

  &::after {
    @include fa-icon();

    color: #ccc;
    content: $fa-var-chevron-right;
    display: none;
    margin-left: 15px;
    text-align: right;
  }

  @media (max-width: $screen-sm-max) {
    border-bottom: 1px solid #e0e0e0;

    &::after {
      display: inline-block;
    }
  }
}
</style>
