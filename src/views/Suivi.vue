<template>
  <form>
    <h1>Suivi Mes Aides</h1>
    <p v-show="!this.droits"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Récupération de la situation en cours…</p>


    <div class="alert alert-success" v-if="submitted">
      Merci d'avoir rempli ce questionnaire !
    </div>

    <div v-if="this.droits && ! submitted">
      <p>
        Vous avez effectué une simulation le <strong>{{createdAt}}</strong>.
      </p>
      <p>
        Répondez à ce questionnaire afin de nous aider à améliorer la pertinence des résultats que nous affichons. Ça ne prend pas plus de 2 minutes !
      </p>

      <div class="droit-details">
        <div v-for="droit in droits" v-bind:key="droit.id" class="droit-detail"
          itemscope itemtype="http://schema.org/GovernmentService">

          <div class="droit-detail-heading">
            <h3 itemprop="name">{{ droit.label }}</h3>
            <div class="dotted-line"></div>
            <droit-montant v-bind:droit="droit" v-if="droit.montant && (isString(droit.montant) || isNumber(droit.montant))"></droit-montant>
          </div>

          <div v-for="choice in droit.choices" v-bind:key="choice.value">
            <label>
              <input type="radio" v-bind:name="`choices_${ droit.id }_${ choice.value }`" v-bind:value="choice.value"
                v-model="droit.choiceValue">
              {{ choice.label }}
            </label>
          </div>
          <textarea v-show="isNegative(droit.choiceValue)" v-model="droit.choiceComments" placeholder="Pour quelle raison ?"></textarea>
        </div>
      </div>

      <button type="submit" v-bind:class="`button large ${!isComplete ? 'secondary  ' : ''}`" v-bind:disabled="! isComplete" v-on:click.prevent="submit">Envoyer</button>
    </div>
  </form>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'

import DroitMontant from '@/components/DroitMontant'
import { forEach } from '../../backend/lib/mes-aides'

const choices = [
    { value: 'already', label: "J'en bénéficiais déjà" },
    { value: 'asked',   label: "J'ai fait une demande" },
    { value: 'failed',  label: "Je n'ai pas réussi à faire une demande" },
    { value: 'nothing', label: "Je n'ai rien fait" },
]

function isNegative(value) {
    return value === 'failed' || value === 'nothing'
}

export default {
  name: 'Suivi',
  data: function() {
    return {
      submitted: false,
      droits: null,
      followup: null
    }
  },
  components: {
    DroitMontant
  },
  computed: {
    createdAt: function() {
      return this.followup && moment(this.followup.createdAt).format('ll')
    },
    isComplete: function() {
        let choiceValues = _.map(this.droits, droit => droit.choiceValue)
        return _.filter(choiceValues).length === this.droits.length
    }
  },
  methods: {
    isString: _.isString,
    isNumber: _.isNumber,
    isNegative,
    submit: function() {
      let answers = this.droits.map(droit => ({
        id: droit.id,
        value: droit.choiceValue,
        comments: droit.choiceComments
      }))

      let that = this
      axios.post(`/api/followups/surveys/${this.$route.query.token}/answers`, answers)
        .then(function(response) {
          if (response.status === 201) {
            that.submitted = true
          }
        })
    }
  },
  mounted: function() {
    axios.get(`/api/followups/surveys/${this.$route.query.token}`)
      .then((response) => {
        this.followup = response.data
        let benefitsIds = this.followup.benefits.map(benefit => benefit.id)
        let benefitsNormalized = []

        forEach((benefit, benefitId, provider, providerId) => {

          if (! benefitsIds.includes(benefitId)) {
              return
          }

          let montant = _.find(this.followup.benefits, benefit => benefit.id === benefitId).amount

          benefitsNormalized.push(_.assign({},
            benefit,
            {
              id: benefitId,
              montant: montant,
              provider: provider,
              providerId: providerId,
              choices: choices,
              choiceValue: null,
              choiceComments: ''
            }
          ))
        })

        this.droits = benefitsNormalized
      })
  }
}
</script>

<style scoped lang="scss">
form {
  flex-grow: 1;
  padding: 1em;
}
</style>
