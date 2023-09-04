<template>
  <div class="fr-py-4w fr-px-2w">
    <div v-if="!submitted">
      <h1>Qu'avez-vous fait avec votre simulation&nbsp;?</h1>
    </div>
    <div>
      <div>
        <LoadingModal v-if="!droits.length">
          <p> Récupération de la situation en cours… </p>
        </LoadingModal>
        <div v-if="submitted" class="fr-text--center">
          <div class="fr-container fr-py-4w">
            <div class="fr-grid-row fr-grid-row--center">
              <div class="fr-col-12 fr-col-md-8 fr-col-lg-8">
                <h3 class="last"
                  >Merci d'avoir rempli ce questionnaire&nbsp;!</h3
                >
                <div v-if="showAccompanimentBlock">
                  <p class="fr-text--lg">
                    Vous avez besoin d'aide pour effectuer vos démarches ?
                    Prenez rendez-vous avec notre équipe pour vous faire
                    accompagner.</p
                  >
                  <p>
                    <a
                      v-analytics="{
                        name: currentPath,
                        action: 'click-accompaniment-link',
                        category: 'Accompaniment',
                      }"
                      class="fr-btn fr-btn--lg"
                      href="https://www.rdv-aide-numerique.fr/?address=1&departement=AJ"
                    >
                      Je prends rendez-vous pour me faire aider dans mes
                      démarches
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

        <form v-if="droits && !submitted">
          <p>
            Vous avez effectué une simulation le
            <strong>{{ createdAt }}</strong
            >.
          </p>
          <div class="fr-alert fr-alert--info fr-mb-4w">
            <p>
              Aidez-nous à améliorer la pertinence des résultats en répondant à
              ce questionnaire :
            </p>
            <p class="fr-text--bold"> Ça ne prend pas plus de 2 minutes ! </p>
          </div>
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
                <legend class="fr-fieldset__legend fr-px-0">
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

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"
import dayjs from "dayjs"
import { getBenefit } from "@/lib/benefits.js"
import LoadingModal from "@/components/loading-modal.vue"
import DroitHeader from "@/components/droit-header.vue"
import StatisticsMixin from "@/mixins/statistics.js"
import { EventCategories } from "@lib/enums/event-categories.js"
import { StandardBenefit } from "@data/types/benefits.d.js"
import { FetchSurvey } from "@lib/types/survey.d.js"

const choices = [
  { value: "already", label: "Rien, j'en bénéficiais déjà." },
  { value: "failed", label: "Je n'ai pas réussi à faire une demande." },
  { value: "asked", label: "J'ai fait une demande." },
  { value: "nothing", label: "Je n'ai rien fait." },
]

function isNegative(value) {
  return value === "failed" || value === "nothing"
}

interface FollowupBenefit extends StandardBenefit {
  choices: { value: string; label: string }[]
  choiceValue: string | null
  choiceComments: string
}

const route = useRoute()
const submitted = ref(false)
const droits = ref<FollowupBenefit[]>([])
const followup = ref<FetchSurvey | null>(null)

const createdAt = computed(() => {
  return (
    followup.value && dayjs(followup.value.createdAt).format("DD MMMM YYYY")
  )
})

const isComplete = computed(() => {
  const choiceValues = droits.value.map((droit) => droit.choiceValue)
  return (
    choiceValues.filter((choiceValue) => choiceValue).length ===
    droits.value.length
  )
})

const showAccompanimentBlock = computed(() => {
  return droits.value.some(
    (droit) => droit.choiceValue === "failed" || droit.choiceValue === "nothing"
  )
})

const currentPath = computed(() => {
  return route.path
})

onMounted(async () => {
  const { data: followupData } = await axios.get(
    `/api/followups/surveys/${route.query.token}`
  )
  followup.value = followupData as FetchSurvey
  const followupBenefits: StandardBenefit[] = followup.value.benefits.map(
    (benefit) => getBenefit(benefit.id)
  )

  droits.value = followupBenefits.map((benefit) => {
    const montant = followup.value!.benefits.find(
      ({ id }) => id === benefit.id
    )?.amount

    return {
      ...benefit,
      montant,
      choices,
      choiceValue: null,
      choiceComments: "",
    }
  }) as FollowupBenefit[]
})

const prefix = (droit: FollowupBenefit) => {
  if (droit.prefix) {
    return `${droit.prefix}${droit.prefix.endsWith("’") ? "" : " "}`
  }
  return ""
}

const submit = async () => {
  const answers = droits.value.map((droit) => ({
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
      EventCategories.ACCOMPAGNEMENT,
      "show-accompaniment-link",
      currentPath.value
    )
  }
}
</script>
