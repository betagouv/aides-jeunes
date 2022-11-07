<template>
  <div class="recapitulatif">
    <div>
      <template
        v-for="(chapter, chapterIndex) in myChapters"
        :key="chapter.name"
      >
        <div class="chapter-block">
          <h2 class="aj-question">{{ chapter.label }}</h2>
          <template
            v-for="(question, questionIndex) in chapter.questions"
            :key="`chapter_${chapterIndex}_question_${questionIndex}`"
          >
            <div :class="question.rowClass" class="recapitulatif-row">
              <div
                :class="question.labelClass || 'question-col'"
                v-html="question.label"
              ></div>
              <div
                v-if="!['undefined', 'object'].includes(typeof question.value)"
                class="value-col"
              >
                {{ question.value }}
              </div>
              <div v-if="!question.hideEdit" class="edit-col">
                <router-link :to="question.path"> Modifier </router-link>
              </div>
            </div>

            <div
              v-if="typeof question.value === 'object'"
              class="recapitulatif-row recapitulatif-row-wrap"
            >
              <div
                v-for="(value, name) in question.value"
                :key="name"
                class="value-cell"
              >
                <div style="font-style: italic">{{ name }} :</div>
                <div>{{ value }}</div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
    <div class="aj-actions">
      <BackButton @click="goBack"></BackButton>
      <router-link
        v-if="showResultButton"
        class="button next-button"
        to="/simulation/resultats"
        >Accéder aux résultats
      </router-link>
      <router-link
        v-else-if="store.lastUnansweredStep"
        :to="store.lastUnansweredStep.path"
        class="button next-button"
        >Continuer
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getPropertyOfStep } from "@lib/mutualized-steps"
import BackButton from "@/components/buttons/back-button.vue"
import { useIndividu } from "@/composables/individu"
import ComplexeProperties from "@lib/properties/others/complexe-properties"
import { chapters } from "@lib/state"
import { useRoute, useRouter } from "vue-router"
import { RecapPropertyLine, Step } from "@lib/types/property"
import { computed, ComputedRef } from "vue"
import { useProgress } from "@/composables/progress"
import { useStore } from "@/stores"

const store = useStore()
const route = useRoute()
const router = useRouter()
const progress: ComputedRef<number> = useProgress()
const activeJourney = store.getAllAnsweredSteps
const propertyData = {
  openFiscaParameters: store.openFiscaParameters,
  simulation: store.simulation,
  periods: store.dates,
}

const showResultButton = computed(() => {
  return (
    progress.value === 1 &&
    router.options.history.state.back !== "/simulation/resultats"
  )
})

const addIndividuQuestions = (questions, individuLabel, data, path) => {
  questions.push(
    {
      rowClass: "row-space",
      label: individuLabel,
      labelClass: "individu-title",
      hideEdit: true,
    },
    {
      label: "Revenus d'activité connus",
      value: data.salaire_imposable,
      path,
    },
    {
      label: "Autre revenus imposables",
      value: data.chomage_imposable,
      path,
    },
    {
      label: "Pensions, retraite, rente",
      value: data.retraite_imposable,
      path,
    },
    {
      label: "Frais réels déductibles",
      value: data.frais_reels,
      path,
    },
    {
      label: "Pensions alimentaires reçues",
      value: data.pensions_alimentaires_percues,
      path,
    },
    {
      label: "Pensions alimentaires versées",
      value: data.pensions_alimentaires_versees,
      path,
    },
    {
      label: "Revenus fonciers nets",
      value: data.revenus_locatifs,
      path,
    }
  )
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

const myChapters = computed(() => {
  const resChapters = chapters(route.path, store.getAllSteps).map((chapter) => {
    let questions = stepPerChapter(chapter.name).reduce(
      (accum: RecapPropertyLine[], step: Step) => {
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
  })
  return addFiscalResourcesResChapter(resChapters)
})

function stepPerChapter(chapterName: string) {
  return activeJourney.filter((step: Step) => step.chapter === chapterName)
}

function questionsPerStep(step: Step): RecapPropertyLine[] {
  const individu = step.entity === "individu" ? useIndividu(step.id) : undefined

  const currentPropertyData = { ...propertyData, individu }
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

function goBack() {
  window?.history.back()
}
</script>
