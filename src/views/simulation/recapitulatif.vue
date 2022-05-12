<template>
  <div class="recapitulatif">
    <div>
      <template v-for="(chapter, chapterIndex) in chapters" :key="chapter.name">
        <div class="chapter-block">
          <h2 class="aj-question">{{ chapter.label }}</h2>
          <template
            v-for="(question, questionIndex) in chapter.questions"
            :key="`chapter_${chapterIndex}_question_${questionIndex}`"
          >
            <div class="recapitulatif-row" :class="question.rowClass">
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
              <div v-if="!question.hideEdit" class="edit-col"
                ><router-link :to="question.path">Modifier</router-link></div
              >
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
        >Accéder aux résultats</router-link
      >
    </div>
  </div>
</template>

<script>
import {
  capitalize,
  displayValue,
  executeFunctionOrReturnValue,
} from "../../../lib/utils"
import { SIMPLE_STEPS, COMPLEX_STEPS } from "@/lib/recapitulatif"
import { ENTITIES_PROPERTIES } from "../../../lib/mutualized-steps"
import BackButton from "@/components/buttons/back-button"
import { getStepAnswer } from "../../../lib/answers"
import ProgressMixin from "@/mixins/progress-mixin"
import { useIndividu } from "@/composables/individu.ts"

export default {
  name: "Recapitulatif",
  components: {
    BackButton,
  },
  mixins: [ProgressMixin],
  computed: {
    activeJourney() {
      return this.$store.getters.getAllAnsweredSteps
    },
    propertyData() {
      return {
        openFiscaParameters: this.$store.state.openFiscaParameters,
        simulation: this.$store.state.simulation,
        periods: this.$store.state.dates,
      }
    },
    chapters() {
      return this.$state
        .chapters(this.$route.path, this.$store.getters.getAllSteps)
        .map((chapter) => {
          return {
            label: chapter.label,
            questions: this.stepPerChapter(chapter.name).reduce(
              (accum, step) => {
                accum.push(
                  ...this.questionsPerStep(step).map((question) => {
                    question.path = step.path
                    return question
                  })
                )
                return accum
              },
              []
            ),
          }
        })
    },
    showResultButton() {
      return (
        this.progress === 1 &&
        this.$router.options.history.state.back !== "/simulation/resultats"
      )
    },
  },
  methods: {
    buildMutualizedQuestion({ question, value, component }) {
      return question
        ? [
            {
              label: capitalize(
                executeFunctionOrReturnValue(question, "question", component)
              ),
              value: displayValue(value, question, component),
            },
          ]
        : []
    },

    goBack() {
      window?.history.back()
    },

    questionsPerStep(step) {
      if (SIMPLE_STEPS[step.variable]) {
        return SIMPLE_STEPS[step.variable].bind(this)(step)
      }

      const match = Object.keys(COMPLEX_STEPS).find((key) =>
        COMPLEX_STEPS[key].matcher.bind(this)(step)
      )
      if (match) {
        return COMPLEX_STEPS[match].fn.bind(this)(step)
      }

      if (ENTITIES_PROPERTIES[step.entity]) {
        const answer = getStepAnswer(
          this.$store.state.simulation.answers.all,
          step
        )

        const individu =
          step.entity === "individu" ? useIndividu(step.id) : undefined

        return this.buildMutualizedQuestion({
          question: ENTITIES_PROPERTIES[step.entity][step.variable],
          value: answer,
          component: { ...this.propertyData, individu },
        })
      }
      return []
    },

    stepPerChapter(chapterName) {
      return this.activeJourney.filter((step) => step.chapter === chapterName)
    },
  },
}
</script>
