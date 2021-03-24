<template>
  <div class="container">
    <DroitsDetails
        :droit="droit"
        :city="situation.menage.depcom"
        :droits="droits"
        :patrimoine-captured="! shouldPatrimoineBeCaptured"
        :ressources-year-minus-two-captured="ressourcesYearMinusTwoCaptured" />
  </div>
</template>

<script>
import _ from 'lodash'

import DroitsDetails from '../../components/DroitsDetails.vue'

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
    DroitsDetails,
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
