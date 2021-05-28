<template>
  <form @submit.prevent="onSubmit">
    <template v-for="(question, index) in questions">
      <keep-alive :key="`question_${index}`">
        <component
          v-if="question.fieldName in types"
          :ref="`question_${index}`"
          v-bind:is="types[question.fieldName]"
          :question="question"
          :question-index="index"
        ></component>
      </keep-alive>
    </template>

    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Vue from "vue"
import Actions from "@/components/Actions"

export default {
  name: "QuestionsBlock",
  components: {
    Actions,
  },
  data: function () {
    return {
      currentStep: undefined,
      types: {},
    }
  },
  computed: {
    questions: function () {
      return this.currentStep ? this.currentStep.questions : []
    },
  },
  mounted() {
    this.loadStep(this.$route.params.step)
  },
  watch: {
    currentStep: async function () {},
  },
  beforeRouteUpdate(to, from, next) {
    this.loadStep(to.params.step)
    next()
  },
  methods: {
    questionType(question) {
      return question.type()
    },
    loadQuestions() {
      for (var member in this.types) delete this.types[member]
      for (const question of this.currentStep.questions) {
        const questionType = question.type()
        if (questionType instanceof Promise) {
          question.type().then((component) => {
            Vue.set(this.types, question.fieldName, component)
            console.log(this.types)
          })
        } else {
          Vue.set(this.types, question.fieldName, questionType)
        }
      }
    },
    loadStep(step) {
      this.currentStep = this.$steps[step]
      console.log(this.currentStep)
      this.loadQuestions()
    },
    onSubmit() {
      let hasError = false
      for (const index in this.questions) {
        if (this.$refs[`question_${index}`][0].requiredValueMissing())
          hasError = true
      }
      if (hasError) return

      for (const index in this.questions) {
        this.$refs[`question_${index}`][0].onSubmit()
      }
      if ("onSubmit" in this.currentStep) this.currentStep.onSubmit()

      this.$push()
    },
  },
}
</script>
