<template>
  <div class="container">
    <div class="aj-main-container">
      <div v-if="!submitted" class="aj-category-title-wrapper">
        <h1>Qu'avez-vous fait avec votre simulation&nbsp;?</h1>
      </div>
      <div class="aj-box-wrapper">
        <div class="aj-unbox">
          <LoadingModal v-if="!droits">
            <p v-show="!droits"> Récupération de la situation en cours… </p>
          </LoadingModal>
          <div v-if="submitted" class="alert alert-success survey-result-block">
            <div class="is-align-vertically-center">
              <h3 class="last">Merci d'avoir rempli ce questionnaire&nbsp;!</h3>
            </div>
            <div v-if="droits && showAccompaniementBlock === true">
              <p class="survey-result-text md">
                Vous avez besoin d'aide pour effectuer vos démarches ? Prenez
                rendez-vous pour être accompagné·e par notre équipe.</p
              >
              <div class="survey-result-button">
                <a
                  class="button primary survey-result-button"
                  href="https://www.rdv-aide-numerique.fr/?address=1&departement=AJ"
                  >Prendre rendez-vous pour être aidé·e dans mes démarches</a
                >
              </div>

              <p class="survey-result-text sm"
                >La prise de rendez-vous se fait en quelques minutes et vous
                permet de bénéficier d'un accompagnement d'une quinzaine de
                minutes par un·e membre de notre équipe</p
              >
            </div>
          </div>

          <form v-if="droits && !submitted">
            <p>
              Vous avez effectué une simulation le
              <strong>{{ createdAt }}</strong
              >.
            </p>
            <p>
              Répondez à ce questionnaire afin de nous aider à améliorer la
              pertinence des résultats que nous affichons. Ça ne prend pas plus
              de 2 minutes !
            </p>
            <div
              v-for="droit in droits"
              :key="droit.id"
              class="aj-box normal-padding-bottom aj-survey-details"
              itemscope
              itemtype="http://schema.org/GovernmentService"
            >
              <div class="aj-droit-survey normal-padding-bottom">
                <DroitHeader :droit="droit" />

                <div class="aj-droit-content">
                  <fieldset class="form__group">
                    <legend>
                      <h3 class="aj-question">
                        Qu'avez-vous fait pour {{ prefix(droit)
                        }}{{ droit.label }}&nbsp;?
                      </h3>
                    </legend>
                    <div
                      v-for="choice in droit.choices"
                      :key="choice.value"
                      class="aj-selection-wrapper"
                    >
                      <input
                        :id="`choices_${droit.id}_${choice.value}`"
                        v-model="droit.choiceValue"
                        type="radio"
                        :name="`choices_${droit.id}_${choice.value}`"
                        :value="choice.value"
                      />
                      <label :for="`choices_${droit.id}_${choice.value}`">
                        {{ choice.label }}
                      </label>
                    </div>
                  </fieldset>
                  <div
                    v-show="isNegative(droit.choiceValue)"
                    class="form__group"
                  >
                    <label
                      ><h3
                        :for="`choiceComments_${droit.id}`"
                        class="aj-question"
                      >
                        Pour quelles raisons&nbsp;?
                      </h3></label
                    >
                    <textarea
                      :id="`choiceComments_${droit.id}`"
                      v-model="droit.choiceComments"
                      placeholder="..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              :class="`button large ${!isComplete ? 'secondary  ' : ''}`"
              :disabled="!isComplete"
              @click.prevent="submit"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"

import Institution from "@/lib/institution"
import LoadingModal from "@/components/loading-modal.vue"
import DroitHeader from "@/components/droit-header.vue"
import dayjs from "dayjs"

const choices = [
  { value: "already", label: "Rien, j'en bénéficiais déjà." },
  { value: "failed", label: "Je n'ai pas réussi à faire une demande." },
  { value: "asked", label: "J'ai fait une demande." },
  { value: "nothing", label: "Je n'ai rien fait." },
]

function isNegative(value) {
  return value === "failed" || value === "nothing"
}

export default {
  name: "Suivi",
  components: {
    DroitHeader,
    LoadingModal,
  },
  data: function () {
    return {
      submitted: false,
      droits: null,
      followup: null,
    }
  },
  computed: {
    createdAt: function () {
      return (
        this.followup && dayjs(this.followup.createdAt).format("DD MMMM YYYY")
      )
    },
    isComplete: function () {
      let choiceValues = this.droits.map((droit) => droit.choiceValue)
      return (
        choiceValues.filter((choiceValue) => choiceValue).length ===
        this.droits.length
      )
    },
    showAccompaniementBlock: function () {
      if (this.droits.length === 0) {
        return false
      }
      return (
        this.droits.map((droit) => droit.choiceValue).includes("failed") ||
        this.droits.map((droit) => droit.choiceValue).includes("nothing")
      )
    },
  },
  mounted: function () {
    axios
      .get(`/api/followups/surveys/${this.$route.query.token}`)
      .then((response) => {
        this.followup = response.data
        let benefitsIds = this.followup.benefits.map((benefit) => benefit.id)

        const benefitsNormalized = Institution.benefits.all
          .filter((benefit) => benefitsIds.includes(benefit.id))
          .map((benefit) => {
            let montant = this.followup.benefits.find(
              (followupBenefit) => followupBenefit.id === benefit.id
            ).amount

            return {
              ...benefit,
              montant: montant,
              choices: choices,
              choiceValue: null,
              choiceComments: "",
            }
          })

        this.droits = benefitsNormalized
      })
  },
  methods: {
    isBoolean: (val) => typeof val === "boolean",
    isString: (val) => typeof val === "string",
    isNumber: (val) => typeof val === "number",
    isNegative,
    prefix: function (droit) {
      if (droit.prefix) {
        return `${droit.prefix}${
          droit.prefix[droit.prefix.length - 1] == "’" ? "" : " "
        }`
      }
      return ""
    },
    submit: function () {
      let answers = this.droits.map((droit) => ({
        id: droit.id,
        value: droit.choiceValue,
        comments: droit.choiceComments,
      }))

      let that = this
      axios
        .post(
          `/api/followups/surveys/${this.$route.query.token}/answers`,
          answers
        )
        .then(function (response) {
          if (response.status === 201) {
            that.submitted = true
          }
        })
    },
  },
}
</script>

<style scoped>
.survey-result-block {
  margin: 0 15% 15%;
  padding: 4% 0 4% 0;
}

.survey-result-button {
  margin: auto 20% auto 20%;
}

@media (max-width: 576px) {
  .survey-result-button {
    margin: auto 1% auto 1%;
  }
}
.survey-result-text {
  text-align: center;
  line-height: 130%;
  color: #526ab6;
  margin: 4% 0 4% 0;
}

.survey-result-text.md {
  font-size: 1.2em;
}
.survey-result-text.sm {
  font-size: 1em;
}
</style>
