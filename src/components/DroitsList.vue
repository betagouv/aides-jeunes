<template>
  <div class="droits-list">
    <div v-if="!ineligible">
      <a v-for="(droit, index) in list"
        v-on:click="push(droit)"
        class="droits-list-item"
        itemscope itemtype="http://schema.org/GovernmentService"
        v-analytics="{ name:droit.label, action:'click', category:'General'}"
        v-bind:key="index"
        >
        <div class="droits-list-item-cell">
          <div class="droits-list-item-cell-left">
            <img v-bind:src="require(`./../../public/img/${ droit.provider.imgSrc }`)" v-bind:alt="droit.label">
            <div>
              <h2>
                <div itemprop="name">{{ droit.label }}</div>
                <small v-bind:aria-label="longCta(droit)">Comment l'obtenir ?</small>
              </h2>
            </div>
          </div>
          <div class="dotted-line"></div>
          <DroitMontant v-bind:droit="droit" v-if="droit.montant && (isString(droit.montant) || isNumber(droit.montant))"></DroitMontant>
          <div v-if="droit.montant && isBoolean(droit.montant)">
            <i v-bind:class="`fa ${droit.symbol ? droit.symbol : 'fa-check-circle'} fa-2x`"></i>
          </div>
        </div>
      </a>
    </div>
    <div v-if="ineligible">
      <a v-for="(droit, index) in list"
        class="droits-list-item"
        v-bind:href="droit.link"
        target="_blank"
        rel="noopener"
        itemscope itemtype="http://schema.org/GovernmentService"
        v-analytics="{ name:droit.label, action:'link-ineligible', category:'General'}"
        v-bind:key="index"
        >
        <div class="droits-list-item-cell">
          <div class="droits-list-item-cell-left">
            <img v-bind:src="require(`./../../public/img/${ droit.provider.imgSrc }`)" v-bind:alt="droit.label">
            <div>
              <h2>
                <div itemprop="name">{{ droit.label }}</div>
                <small v-bind:aria-label="`Plus d'informations sur ${ droit.label }`">Plus d'informations</small>
              </h2>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

import DroitMontant from './DroitMontant'

export default {
  name: 'DroitsList',
  props: {
    droits: Array,
    ineligible: Boolean,
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
    isEmpty: (array) => array.length === 0,
    isNotEmpty: (array) => array.length !== 0,
    isBoolean: _.isBoolean,
    isNumber: _.isNumber,
    isString: _.isString,
    longCta: function(benefit) {
      return `Comment obtenir ${benefit.prefix}${ benefit.prefix && benefit.prefix.endsWith('’') ? '' : ' ' }${benefit.label} ?`
    },
    scrollTo: function(event, droit)
    {
        return this.$ScrollService.go(event, document.getElementById(droit.id));
    },
    push: function(droit) {
      this.$router.push(`/simulation/resultats/${droit.id}`)
    }
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

      @media (max-width: $screen-xs-max) {
        font-size: ($font-size-h2 * 0.6);
      }

      small {
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
