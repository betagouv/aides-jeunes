<template>
  <div class="droits-list">
    <div v-if="!ineligible">
        <a v-for="(droit, index) in list"
          class="aj-aide-box a-unstyled" v-bind:key="index" @click="push(droit)"
          itemscope itemtype="http://schema.org/GovernmentService"
          >
            <img class="aj-aide-illustration" v-bind:src="require(`./../../public/img/${ droit.provider.imgSrc }`)" v-bind:alt="droit.label">
            <div class="aj-aide-text">
                <h2 class="aj-question" itemprop="name">{{ droit.label }}</h2>
                <p class="aj-aide-description" v-html="droit.description"></p>
                <div class="aj-aide-warning" v-if="droit.montant && isBoolean(droit.montant) && droit.symbol === 'fa-exclamation-triangle'">
                    <img src="@/assets/images/warning.svg"> Attention, cette aide vous est accessible sous certaines conditions supplémentaires.
                </div>
            </div>
            <div class="aj-aide-montant">
                <DroitMontant v-bind:droit="droit" v-if="droit.montant && (isString(droit.montant) || isNumber(droit.montant))"></DroitMontant>
                <div v-if="droit.montant && isBoolean(droit.montant)">
                    <i v-bind:class="`fa ${droit.symbol ? droit.symbol : 'fa-check-circle'} fa-2x`"></i>
                </div>
            </div>
            <div class="aj-aide-cta">
                <a class="button primary">Demander cette aide</a>
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
      return this.droits.filter(function(value) {
        return (!vm.filter) || vm.filter.includes(value.id)
      })
    },
  },
  methods: {
    isEmpty: (array) => array.length === 0,
    isNotEmpty: (array) => array.length !== 0,
    isBoolean: val => typeof val === 'boolean',
    isNumber: val => typeof val === 'number',
    isString: val => typeof val === 'string',
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
