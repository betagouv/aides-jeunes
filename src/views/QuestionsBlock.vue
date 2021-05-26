<template>
  <form @submit.prevent="onSubmit">
    <template v-for="(question, index) in questions">
      <component
        v-bind:is="question.type"
        :key="`question_${index}`"
        :ref="`question_${index}`"
        :question="question"
      ></component>
    </template>
    <button type="button" @click="$router.push('/questions/step2')"
      >dsds</button
    >
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import EnumQuestion from "@/components/Questions/Type/EnumQuestion"
import YesNoQuestion from "@/components/Questions/Type/YesNoQuestion"

const steps = {
  step1: {
    questions: [
      {
        type: YesNoQuestion,
        label: "Quelle est la situation de vos parents ?",
        fieldName: "question1",
        enSavoirPlus: function (store) {
          store
          return "info lol"
        },
      },
      {
        type: EnumQuestion,
        label: "Quelle est la situation de vos parents ? lol",
        fieldName: "question1",
        items: [
          {
            label: "En couple",
            value: "en_couple",
          },
          {
            label: "Séparés",
            value: "separes",
          },
          {
            label: "Veuf ou veuve",
            value: "veuve",
          },
          {
            label: "Décédés",
            value: "decedes",
          },
          {
            label: "Sans autorité parentale",
            value: "sans_autorite",
          },
        ],
      },
    ],
  },
  step2: {
    questions: [
      {
        type: EnumQuestion,
        label: "Quelle est la situation de vos parents ?",
        fieldName: "question1",
        items: [
          {
            label: "En couple",
            value: "en_couple",
          },
          {
            label: "Séparés",
            value: "separes",
          },
          {
            label: "Veuf ou veuve",
            value: "veuve",
          },
          {
            label: "Décédés",
            value: "decedes",
          },
          {
            label: "Sans autorité parentale",
            value: "sans_autorite",
          },
        ],
      },
      {
        type: EnumQuestion,
        label: "Quelle est la situation de vos parents 2 ?",
        fieldName: "question1",
        items: [
          {
            label: "En couple",
            value: "en_couple",
          },
          {
            label: "Séparés",
            value: "separes",
          },
          {
            label: "Veuf ou veuve",
            value: "veuve",
          },
          {
            label: "Décédés",
            value: "decedes",
          },
          {
            label: "Sans autorité parentale",
            value: "sans_autorite",
          },
        ],
      },
    ],
  },
}

export default {
  name: "QuestionsBlock",
  components: {
    Actions,
  },
  data: function () {
    return {
      currentStep: undefined,
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
  beforeRouteUpdate(to, from, next) {
    this.loadStep(to.params.step)
    next()
  },
  methods: {
    loadStep(step) {
      this.currentStep = steps[step]
      console.log(this.currentStep)
    },
    onSubmit() {
      let hasError = false
      for (const index in this.questions) {
        if (this.$refs[`question_${index}`].requiredValueMissing())
          hasError = true
      }
      if (hasError) return

      for (const index in this.questions) {
        this.$refs[`question_${index}`].onSubmit()
      }
      if ("onSubmit" in this.currentStep) this.currentStep.onSubmit()
    },
  },
}
</script>
