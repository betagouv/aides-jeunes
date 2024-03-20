<template>
  <div data-testid="recapitulatif">
    <div class="fr-mb-5w">
      <template
        v-for="(chapter, chapterIndex) in myChapters"
        :key="chapter.name"
      >
        <div class="chapter-block fr-mb-4w">
          <h2 class="fr-display-sm fr-text--lead">{{ chapter.label }}</h2>
          <template
            v-for="(question, questionIndex) in chapter.questions"
            :key="`chapter_${chapterIndex}_question_${questionIndex}`"
          >
            <div class="fr-container fr-px-0">
              <div class="fr-grid-row fr-mb-3v">
                <div class="fr-col-12 fr-col-sm-6" data-testid="question-row">
                  <h3
                    v-if="question.labelClass"
                    class="fr-my-0 fr-text--md"
                    v-html="question.label"
                  ></h3>
                  <p v-else class="fr-my-0" v-html="question.label"></p>
                </div>
                <div class="fr-col-12 fr-col-sm-4">
                  <p
                    v-if="
                      !['undefined', 'object'].includes(typeof question.value)
                    "
                    class="fr-my-0"
                  >
                    {{ question.value }}
                  </p>
                </div>
                <div class="fr-col-12 fr-col-sm-2 fr-print-hidden">
                  <p v-if="!question.hideEdit" class="fr-my-0">
                    <router-link
                      :to="question.path"
                      :title="`Modifier la réponse à la question ${question.label}`"
                      >Modifier</router-link
                    >
                  </p>
                </div>
              </div>
            </div>
            <hr v-if="question.labelClass == 'individu-title'" />
            <div
              v-if="typeof question.value === 'object'"
              class="fr-grid-row fr-mb-1w"
            >
              <div
                v-for="(value, name) in question.value"
                :key="name"
                class="fr-col-6 fr-col-sm-4 fr-col-md-3 fr-mb-1w fr-pb-1w"
              >
                <p class="fr-hint-text fr-my-0">{{ name }} :</p>
                <p class="fr-my-0">{{ value }}</p>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
    <div class="aj-action-buttons">
      <ul class="fr-btns-group fr-btns-group--inline">
        <li>
          <BackButton class="fr-btn--icon-center" fallback="/simulation" />
        </li>
        <li v-if="showResultButton">
          <router-link class="fr-btn" to="/simulation/resultats"
            >Accéder aux résultats
          </router-link>
        </li>
        <li v-else-if="store.lastUnansweredStep">
          <router-link
            :to="store.lastUnansweredStep.path"
            class="fr-btn"
            data-testid="button-continue"
            >Continuer
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getPropertyOfStep } from "@lib/mutualized-steps"
import BackButton from "@/components/buttons/back-button.vue"
import { useIndividu } from "@/composables/individu.js"
import ComplexeProperties from "@lib/properties/others/complexe-properties"
import { getChapters } from "@lib/state"
import { useRoute, useRouter } from "vue-router"
import { RecapPropertyLine } from "@lib/types/property.d.js"
import { StepStrict } from "@lib/types/steps.d.js"
import { computed, ComputedRef, onMounted, onUnmounted } from "vue"
import { useProgress } from "@/composables/progress.js"
import { useStore } from "@/stores/index.js"
import { categoriesRnc, patrimoineTypes } from "@lib/resources.js"
import Simulation from "@/lib/simulation.js"
import ABTestingService from "@/plugins/ab-testing-service.js"

const store = useStore()
const route = useRoute()
const router = useRouter()
const progress: ComputedRef<number> = useProgress()
const answeredSteps = computed(() => store.getAllAnsweredSteps)
const propertyData = computed(() => {
  return {
    openFiscaParameters: store.openFiscaParameters,
    simulation: store.simulation,
    periods: store.dates,
    abtestingService: ABTestingService,
  }
})

const showResultButton = computed(() => {
  return (
    progress.value === 1 &&
    router.options.history.state.back !== "/simulation/resultats"
  )
})

onMounted(async () => {
  if (answeredSteps.value.length === 0 || route.query.simulationId) {
    await Simulation.restoreLatestSimulationWithoutResultsComputing()
  }
  document.body.setAttribute("data-action-buttons", "true")
})

onUnmounted(() => {
  document.body.removeAttribute("data-action-buttons")
})

const addIndividuQuestions = (questions, individuLabel, data, path) => {
  questions.push({
    rowClass: "row-space",
    label: individuLabel,
    labelClass: "individu-title",
    hideEdit: true,
  })
  categoriesRnc.forEach((category) => {
    if (data[category.id]) {
      questions.push({
        label: category.label,
        value: `${data[category.id]} €`,
        path,
      })
    }
  })
}

const addFiscalResourcesResChapter = (resChapters) => {
  const ressourcesFiscales = store.simulation.ressourcesFiscales
  if (ressourcesFiscales) {
    const demandeur = ressourcesFiscales.demandeur
    if (demandeur) {
      const path = "/simulation/ressources/fiscales"
      const myFiscalResourcesChapter = {
        label: "Mes ressources fiscales",
        questions: [],
      }
      for (const property in ressourcesFiscales) {
        if (property === "demandeur") {
          addIndividuQuestions(
            myFiscalResourcesChapter.questions,
            "Vous",
            demandeur,
            path
          )
        }
        if (property.includes("enfant_")) {
          const childIndex = property.substring(property.indexOf("_") + 1)
          addIndividuQuestions(
            myFiscalResourcesChapter.questions,
            `${store.situation.enfants[childIndex]._firstName}`,
            ressourcesFiscales[property],
            path
          )
        }
      }
      resChapters.push(myFiscalResourcesChapter)
    }
  }
  return resChapters
}

const addPatrimoineResChapter = (resChapters) => {
  if (store.hasPatrimoine) {
    const path = "/simulation/ressources/patrimoine"
    const questions = []
    patrimoineTypes.forEach((type, index) => {
      const value = store.simulation.patrimoine[patrimoineTypes[index].id]
      if (value) {
        const label = patrimoineTypes[index].label
        questions.push({
          label,
          value: `${value} €`,
          path,
        })
      }
    })
    resChapters.push({
      label: "Mon patrimoine",
      questions,
    })
  }
  return resChapters
}

const myChapters = computed(() => {
  let resChapters = getChapters(route.path, store.getAllSteps).map(
    (chapter) => {
      let questions = stepPerChapter(chapter.name).reduce(
        (accum: RecapPropertyLine[], step: StepStrict) => {
          accum.push(
            ...questionsPerStep(step).map((recapLine: RecapPropertyLine) => {
              recapLine.path = step.path
              return recapLine
            })
          )
          return accum
        },
        []
      )
      return {
        label: chapter.label,
        questions,
      }
    }
  )
  resChapters = addFiscalResourcesResChapter(resChapters)
  resChapters = addPatrimoineResChapter(resChapters)
  return resChapters
})

function stepPerChapter(chapterName: string) {
  return answeredSteps.value.filter(
    (step: StepStrict) => step.chapter === chapterName
  )
}

function questionsPerStep(step: StepStrict): RecapPropertyLine[] {
  const individu = step.entity === "individu" ? useIndividu(step.id) : undefined

  const currentPropertyData = { ...propertyData.value, individu }
  const property = getPropertyOfStep(step)

  if (property) {
    return [
      property.recapHeader?.(currentPropertyData),
      property.getRecap(currentPropertyData, step),
    ].filter((block) => block) as RecapPropertyLine[]
  }

  const match = Object.keys(ComplexeProperties).find((key) =>
    ComplexeProperties[key].matcher(step)
  )
  if (match && ComplexeProperties[match].getRecap) {
    return ComplexeProperties[match].getRecap(currentPropertyData, step)
  }

  return []
}
</script>
