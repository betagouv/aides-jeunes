<template>
  <div class="fr-py-4w fr-px-2w">
    <div v-if="!submitted">
      <h1>Qu'avez-vous fait avec votre simulation&nbsp;?</h1>
    </div>
    <div>
      <div>
        <LoadingModal v-if="!droits">
          <p> Récupération de la situation en cours… </p>
        </LoadingModal>
        <div v-if="submitted" class="fr-text--center">
          <div class="fr-container fr-py-4w">
            <div class="fr-grid-row fr-grid-row--center">
              <div class="fr-col-12 fr-col-md-8 fr-col-lg-8">
                <h3 class="last"
                  >Merci d'avoir rempli ce questionnaire&nbsp;!</h3
                >
                <div v-if="droits && showAccompanimentBlock === true">
                  <p class="fr-text--lg">
                    Vous avez besoin d'aide pour effectuer vos démarches ?
                    Prenez rendez-vous pour être accompagné·e par notre
                    équipe.</p
                  >
                  <p>
                    <a
                      class="fr-btn fr-btn--lg"
                      href="https://www.rdv-aide-numerique.fr/?address=1&departement=AJ"
                      >Prendre rendez-vous pour être aidé·e dans mes
                      démarches</a
                    >
                  </p>

                  <p class="fr-mt-3w"
                    >La prise de rendez-vous se fait en quelques minutes et vous
                    permet de bénéficier d'un accompagnement d'une quinzaine de
                    minutes par un·e membre de notre équipe</p
                  >
                </div>
              </div>
            </div>
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
            pertinence des résultats que nous affichons. Ça ne prend pas plus de
            2 minutes !
          </p>
          <div
            v-for="droit in droits"
            :key="droit.id"
            class="fr-tile fr-tile-horizontal fr-mb-2w fr-pb-2w"
            itemscope
            itemtype="http://schema.org/GovernmentService"
          >
            <div class="fr-p-4w">
              <DroitHeader :droit="droit" :show-unexpected="false" />

              <fieldset class="fr-fieldset">
                <legend class="fr-fieldset__legend">
                  Qu'avez-vous fait pour {{ prefix(droit)
                  }}{{ droit.label }}&nbsp;?
                </legend>
                <div class="fr-fieldset__content">
                  <div class="fr-container fr-px-0">
                    <div class="fr-grid-row">
                      <div class="fr-col-12 fr-col-md-8 fr-col-lg-8">
                        <div
                          v-for="choice in droit.choices"
                          :key="choice.value"
                          class="fr-radio-group fr-radio-rich fr-mt-1w"
                        >
                          <input
                            :id="`choices_${droit.id}_${choice.value}`"
                            v-model="droit.choiceValue"
                            type="radio"
                            :name="`choices_${droit.id}_${choice.value}`"
                            :value="choice.value"
                          />
                          <label
                            :for="`choices_${droit.id}_${choice.value}`"
                            class="fr-label"
                          >
                            {{ choice.label }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-show="isNegative(droit.choiceValue)">
                    <label
                      :for="`choiceComments_${droit.id}`"
                      class="fr-label fr-text--bold fr-mt-2w fr-mb-1w"
                    >
                      Pour quelles raisons&nbsp;?
                    </label>
                    <textarea
                      :id="`choiceComments_${droit.id}`"
                      v-model="droit.choiceComments"
                      class="fr-input"
                      placeholder="..."
                    />
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          <button
            type="submit"
            class="fr-btn fr-btn--lg"
            :disabled="!isComplete"
            @click.prevent="submit"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import { getBenefit } from "@/lib/benefits.js"
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
    showAccompanimentBlock: function () {
      return this.droits.some((droit) =>
        ["failed", "nothing"].includes(droit.choiceValue)
      )
    },
  },
  mounted: function () {
    axios
      .get(`/api/followups/surveys/${this.$route.query.token}`)
      .then((response) => {
        this.followup = response.data
        let followupBenefits = this.followup.benefits.map((benefit) =>
          getBenefit(benefit.id)
        )

        const benefitsNormalized = followupBenefits.map((benefit) => {
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
            window.scrollTo(0, 0)
          }
        })
    },
  },
}
</script>
