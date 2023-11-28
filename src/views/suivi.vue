<template>
  <div class="fr-py-4w fr-px-2w">
    <LoadingModal v-if="loading">
      <p> Récupération de la situation en cours… </p>
    </LoadingModal>
    <div v-else>
      <div v-if="submitted" class="fr-text--center">
        <div class="fr-container fr-py-4w">
          <div class="fr-grid-row fr-grid-row--center">
            <div class="fr-col-12 fr-col-md-8 fr-col-lg-8">
              <h3>Merci d'avoir rempli ce questionnaire !</h3>
              <div v-if="showAccompanimentBlock">
                <p class="fr-text--lg">
                  Vous avez besoin d'aide pour effectuer vos démarches ? Prenez
                  rendez-vous avec notre équipe pour vous faire accompagner.</p
                >
                <p>
                  <a
                    v-analytics="accompanimentClickEvent"
                    class="fr-btn fr-btn--lg"
                    href="https://www.rdv-aide-numerique.fr/?address=1&departement=AJ"
                  >
                    Je prends rendez-vous pour me faire aider dans mes démarches
                  </a>
                </p>

                <p class="fr-mt-3w"
                  >La prise de rendez-vous se fait en quelques minutes et vous
                  permet de bénéficier d'un accompagnement d'une quinzaine de
                  minutes par une personne de notre équipe</p
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <form v-else>
        <h1>Qu'avez-vous fait avec votre simulation ?</h1>
        <p>
          Vous avez effectué une simulation le
          <strong>{{ followupCreatedAt }}</strong
          >.
        </p>
        <div class="fr-mb-4w">
          <div v-if="simulationWasUseful" class="fr-alert fr-alert--success">
            <h3 class="fr-alert__title"> Merci pour votre réponse </h3>
            <p>
              Aidez-nous à améliorer la pertinence des résultats en répondant à
              ce questionnaire :
            </p>
            <p class="fr-text--bold"> Ça ne prend pas plus de 2 minutes ! </p>
          </div>
          <div v-else class="fr-alert fr-alert--warning">
            <h3 class="fr-alert__title">
              Merci, nous sommes désolés que le simulateur ne vous ait pas été
              utile
            </h3>
            <p
              >À la fin de ce questionnaire vous aurez la possibilité de prendre
              un RDV téléphonique avec une personne de l'équipe pour poser vos
              questions sur les aides et les démarches.
            </p>
            <p class="fr-text--bold"> Ça ne prend pas plus de 2 minutes ! </p>
          </div>
        </div>
        <div
          v-for="droit in benefitsWithChoice"
          :key="droit.id"
          class="fr-tile fr-tile-horizontal fr-mb-2w fr-pb-2w"
          itemscope
          itemtype="http://schema.org/GovernmentService"
        >
          <div class="fr-p-4w">
            <DroitHeader :droit="droit" :show-unexpected="false" />

            <fieldset class="fr-fieldset">
              <legend class="fr-fieldset__legend fr-px-0">
                Qu'avez-vous fait pour {{ prefix(droit) }}{{ droit.label }} ?
              </legend>
              <div class="fr-fieldset__content">
                <div class="fr-container fr-px-0">
                  <div class="fr-grid-row">
                    <div class="fr-col-12 fr-col-md-8 fr-col-lg-8">
                      <div
                        v-for="choice in choices"
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
                    Pour quelles raisons ?
                  </label>
                  <textarea
                    :id="`choiceComments_${droit.id}`"
                    v-model="droit.choiceComments"
                    class="fr-input"
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
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"
import LoadingModal from "@/components/loading-modal.vue"
import DroitHeader from "@/components/droit-header.vue"
import StatisticsMixin from "@/mixins/statistics.js"
import { EventAction, EventCategory } from "@lib/enums/event.js"
import { useFollowupSurveyData } from "@/composables/use-followup-survey-data.js"

const choices = [
  { value: "already", label: "Rien, j'en bénéficiais déjà." },
  { value: "failed", label: "Je n'ai pas réussi à faire une demande." },
  { value: "asked", label: "J'ai fait une demande." },
  { value: "nothing", label: "Je n'ai rien fait." },
]

function isNegative(value) {
  return value === "failed" || value === "nothing"
}

const route = useRoute()
const submitted = ref(false)
const { followupCreatedAt, benefitsWithChoice, simulationWasUseful, loading } =
  useFollowupSurveyData(route.query.token as string)

const isComplete = computed(() => {
  const choiceValues = benefitsWithChoice.value.map(
    (droit) => droit.choiceValue
  )
  return (
    choiceValues.filter((choiceValue) => choiceValue).length ===
    benefitsWithChoice.value.length
  )
})

const showAccompanimentBlock = computed(() => {
  return benefitsWithChoice.value.some(
    (droit) => droit.choiceValue === "failed" || droit.choiceValue === "nothing"
  )
})

const accompanimentClickEvent = computed(() => {
  return {
    name: route.path,
    action: EventAction.ClickLienAccompagnement,
    category: EventCategory.Accompagnement,
  }
})

const prefix = (droit: { prefix: string }) => {
  if (droit.prefix) {
    return `${droit.prefix}${droit.prefix.endsWith("’") ? "" : " "}`
  }
  return ""
}

const submit = async () => {
  const answers = benefitsWithChoice.value.map((droit) => ({
    id: droit.id,
    value: droit.choiceValue,
    comments: droit.choiceComments,
  }))

  const { status } = await axios.post(
    `/api/followups/surveys/${route.query.token}/answers`,
    answers
  )

  if (status !== 201) {
    return
  }

  submitted.value = true
  window.scrollTo(0, 0)

  if (showAccompanimentBlock.value) {
    StatisticsMixin.methods.sendEventToMatomo(
      EventCategory.Accompagnement,
      EventAction.AfficheLienAccompagnement,
      route.path
    )
  }
}
</script>
