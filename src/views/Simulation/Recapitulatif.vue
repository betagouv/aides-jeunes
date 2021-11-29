<template>
  <div class="recapitulatif">
    <BackButton
      class="recapitulatif-back-button"
      size="small"
      @click="goBack()"
    >
      Retour
    </BackButton>
    <div>
      <template
        v-for="(chapter, chapterIndex) in chapters"
        :key="chapter.name"
      >
        <div class="chapter-block">
          <h2 class="aj-question">
            {{ chapter.label }}
          </h2>
          <template v-for="(question, questionIndex) in chapter.questions">
            <template v-if="question.isChapterSubtitle">
              <div
                :key="`chapter_${chapterIndex}_question_${questionIndex}`"
                class="recapitulatif-row"
              >
                <div
                  class="subtitle"
                  v-html="question.label"
                />
              </div>
            </template>
            <template v-else>
              <div
                v-if="question.value !== undefined"
                :key="`chapter_${chapterIndex}_question_${questionIndex}`"
                class="recapitulatif-row"
              >
                <div
                  class="question-col"
                  v-html="question.label"
                />

                <div
                  v-if="typeof question.value !== 'object'"
                  class="value-col"
                >
                  {{ question.value }}
                </div>
                <div class="edit-col">
                  <router-link :to="question.path">
                    Modifier
                  </router-link>
                </div>
              </div>
              <template v-if="typeof question.value === 'object'">
                <div
                  :key="`chapter_${chapterIndex}_question_${questionIndex}_obj`"
                  class="recapitulatif-row recapitulatif-row-wrap"
                >
                  <div
                    v-for="(value, name) in question.value"
                    :key="name"
                    class="value-cell"
                  >
                    <div style="font-style: italic">
                      {{ name }} :
                    </div>
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
      <div />
      <BackButton @click="goBack" />
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
          COMPLEX_STEPS[key].matcher.bind(this)(step)
        )
        if (match) {
          return COMPLEX_STEPS[match].fn.bind(this)(step)
        }
      }

      if (ENTITIES_PROPERTIES[step.entity]) {
        const answer = this.$store.getters.getAnswer(
          step.id,
          step.entity,
          step.variable,
          true
        )
        const entity =
          ENTITIES_PROPERTIES[step.entity].loadEntity &&
          ENTITIES_PROPERTIES[step.entity].loadEntity({
            ...this,
            "$store": this.$store,
            params: step,
          })
        return this.buildMutualizedQuestion({
          question: ENTITIES_PROPERTIES[step.entity].STEPS[step.variable],
          value: answer,
          component: { ...this, "$store": this.$store, entity },
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
