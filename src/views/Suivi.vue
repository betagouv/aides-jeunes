<template>
  <div class="container">
    <div class="aj-main-container">
      <div class="aj-category-title-wrapper">
        <h1>Suivi Mes Aides</h1>
      </div>
      <div class="aj-box-wrapper">
      <!-- <p v-show="!this.droits"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Récupération de la situation en cours…</p> -->
      <div class="aj-unbox">
        <LoadingModal v-if="!this.droits">
          <p v-show="!this.droits">Récupération de la situation en cours…</p>
        </LoadingModal>
        <div class="alert alert-success" v-if="submitted">
          Merci d'avoir rempli ce questionnaire !
        </div>

        <form v-if="this.droits && ! submitted">
          <p>
            Vous avez effectué une simulation le <strong>{{createdAt}}</strong>.
          </p>
          <p>
            Répondez à ce questionnaire afin de nous aider à améliorer la pertinence des résultats que nous affichons. Ça ne prend pas plus de 2 minutes !
          </p>
          <div class="droit-details">
            <div v-for="droit in droits" v-bind:key="droit.id" class="droit-detail aj-aide-box aj-suivi-box"
              itemscope itemtype="http://schema.org/GovernmentService">
              <div class="aj-suivi-box-aide">
                <img class="aj-aide-illustration" v-bind:src="require(`./../../public/img/${ droit.provider.imgSrc }`)" v-bind:alt="droit.label">
                <div class="aj-aide-text">
                    <h2 class="aj-question" itemprop="name">{{ droit.label }}</h2>
                    <p class="aj-aide-description">
                      {{ droit.description }}
                    </p>
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
              </div>
              <div class="aj-suivi-box-question">
                <div class="form__group">
                  <legend>
                    <h2 class="aj-question">Avez-vous demandé l'aide ?</h2>
                  </legend>
                  <div v-for="choice in droit.choices" v-bind:key="choice.value" class="aj-selection-wrapper">
                    <input type="radio"
                      :id="`choices_${ droit.id }_${ choice.value }`"
                      v-bind:name="`choices_${ droit.id }_${ choice.value }`"
                      v-bind:value="choice.value"
                        v-model="droit.choiceValue"/>
                    <label :for="`choices_${ droit.id }_${ choice.value }`">
                      {{ choice.label }}
                    </label>
                  </div>
                </div>
                <div class="form__group" v-show="isNegative(droit.choiceValue)">
                  <legend>
                    <h2 class="aj-question">Pour quelle raison ?</h2>
                  </legend>
                  <textarea  v-model="droit.choiceComments" placeholder="..."/>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" v-bind:class="`button large ${!isComplete ? 'secondary  ' : ''}`" v-bind:disabled="! isComplete" v-on:click.prevent="submit">Envoyer</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

import DroitMontant from '@/components/DroitMontant'
import Institution from '@/lib/Institution'
import LoadingModal from '@/components/LoadingModal'

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
    DroitMontant,
    LoadingModal
  },
  computed: {
    createdAt: function() {
      return this.followup && moment(this.followup.createdAt).format('ll')
    },
    isComplete: function() {
        let choiceValues = this.droits.map(droit => droit.choiceValue)
        return choiceValues.filter(choiceValue => choiceValue).length === this.droits.length
    }
  },
  methods: {
    isBoolean: val => typeof val === 'boolean',
    isString: (val) => typeof val === 'string',
    isNumber: (val) => typeof val === 'number',
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

        Institution.forEachBenefit((benefit, benefitId, provider, providerId) => {

          if (! benefitsIds.includes(benefitId)) {
              return
          }

          let montant = this.followup.benefits.find(benefit => benefit.id === benefitId).amount

          benefitsNormalized.push({
            ...benefit,
            id: benefitId,
            montant: montant,
            provider: provider,
            providerId: providerId,
            choices: choices,
            choiceValue: null,
            choiceComments: ''
          })
        })

        this.droits = benefitsNormalized
      })
  }
}
</script>

<style scoped lang="scss">
.aj-suivi-box {
    flex-direction: column;
}
.aj-suivi-box-aide {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
}
.aj-suivi-box-question {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.break {
  flex-basis: 100%;
  height: 0;
}
</style>
