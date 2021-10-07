<template>
  <div class="recapitulatif">
    <BackButton
      @click.native="goBack()"
      class="recapitulatif-back-button"
      size="small"
      >Retour</BackButton
    >
    <div>
      <template v-for="(chapter, chapterIndex) in chapters">
        <div class="chapter-block" :key="chapter.name">
          <h2 class="aj-question">{{ chapter.label }}</h2>
          <template v-for="(question, questionIndex) in chapter.questions">
            <template v-if="question.isChapterSubtitle">
              <div
                :key="`chapter_${chapterIndex}_question_${questionIndex}`"
                class="recapitulatif-row"
              >
                <div v-html="question.label" class="subtitle"></div>
              </div>
            </template>
            <template v-else>
              <div
                :key="`chapter_${chapterIndex}_question_${questionIndex}`"
                class="recapitulatif-row"
                v-if="question.value !== undefined"
              >
                <div class="question-col" v-html="question.label"></div>

                <div
                  class="value-col"
                  v-if="typeof question.value !== 'object'"
                  >{{ question.value }}</div
                >
                <div class="edit-col"
                  ><router-link :to="question.path">Modifier</router-link></div
                >
              </div>
              <template v-if="typeof question.value === 'object'">
                <div
                  :key="`chapter_${chapterIndex}_question_${questionIndex}_obj`"
                  class="recapitulatif-row recapitulatif-row-wrap"
                >
                  <div
                    class="value-cell"
                    v-for="(value, name) in question.value"
                    :key="name"
                  >
                    <div style="font-style: italic">{{ name }} :</div>
                    <div>{{ value }}</div>
                  </div>
                </div>
              </template>
            </template>
          </template>
        </div>
      </template>
    </div>
    <div class="aj-actions">
      <div></div>
      <BackButton @click.native="goBack"></BackButton>
    </div>
  </div>
</template>

<script>
import {
  capitalize,
  displayValue,
  executeFunctionOrReturnValue,
} from "@/lib/Utils"
import { SIMPLE_STEPS, COMPLEX_STEPS } from "@/lib/Recapitulatif"
import { ENTITIES_PROPERTIES } from "@/lib/State/steps"
import BackButton from "@/components/Buttons/BackButton"

export default {
  name: "Recapitulatif",
  components: {
    BackButton,
  },
  computed: {
    activeJourney() {
      return this.$store.getters.getAllSteps.filter((s) => s.isActive)
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
      window && window.history.back()
    },

    questionsPerStep(step) {
      if (SIMPLE_STEPS[step.variable]) {
        return SIMPLE_STEPS[step.variable].bind(this)(step)
      }
      if (step.variable === undefined) {
        const match = Object.keys(COMPLEX_STEPS).find((key) =>
          COMPLEX_STEPS[key].matcher(step)
        )
        if (match) {
          return COMPLEX_STEPS[match].fn.bind(this)(step)
        }
      }

      if (ENTITIES_PROPERTIES[step.entity]) {
        const answer = this.$store.getters.getAnswer(
          step.id,
          step.entity,
          step.variable
        )
        const entity =
          ENTITIES_PROPERTIES[step.entity].loadEntity &&
          ENTITIES_PROPERTIES[step.entity].loadEntity({
            ...this,
            params: step,
          })
        return this.buildMutualizedQuestion({
          question: ENTITIES_PROPERTIES[step.entity].STEPS[step.variable],
          value: answer,
          component: { ...this, entity },
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

<style scoped lang="scss"></style>
