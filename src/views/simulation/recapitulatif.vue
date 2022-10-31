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
                <router-link :to="question.path">Modifier</router-link>
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
      <template v-if="propertyData.simulation.ressourcesFiscales">
        <h2 class="aj-question">Ma fiscalité</h2>
        <div class="recapitulatif-row">
          <div class="question-col">
            Indiquez toutes les ressources nettes versées perçues par vous en
            France comme à l'étranger.
          </div>
          <div class="value-col">
            <div v-for="(ressource, key) in propertyData.simulation.ressourcesFiscales.demandeur">
              <span class="value-col-first-line">{{ categoriesFiscales[key] }}&nbsp;:</span>
              <div class="value-col-second-line">
                {{ ressource }}&nbsp;€
              </div>
            </div>
          </div>
          <div class="edit-col">
            <router-link to="/simulation/ressources/fiscales">
              Modifier
            </router-link>
          </div>
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
import { useIndividu } from "@/composables/individu.ts"
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
  periods: store.dates
}
const categoriesFiscales = {
  salaire_imposable: "Salaires imposable",
  chomage_imposable: "Chômage imposable",
  retraite_imposable: "Retraite imposable",
  frais_reels: "Frais réels",
  pensions_alimentaires_versees: "Pensions alimentaires versées",
  pensions_alimentaires_percues: "Pensions alimentaires perçues",
  revenus_locatifs: "Revenus locatifs"
}
const showResultButton = computed(() => {
  return (
    progress.value === 1 &&
    router.options.history.state.back !== "/simulation/resultats"
  )
})

const myChapters = chapters(route.path, store.getAllSteps).map((chapter) => {
  return {
    label: chapter.label,
    questions: stepPerChapter(chapter.name).reduce(
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
  }
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
      property.getRecap(currentPropertyData, step)
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
