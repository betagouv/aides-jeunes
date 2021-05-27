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
    <!--    <button type="button" @click="$router.push('/questions/step2')"-->
    <!--      >dsds</button-->
    <!--    >-->
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"

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
    alert("QuestionsBlock mounted")
    this.loadStep(this.$route.params.step)
  },
  beforeRouteUpdate(to, from, next) {
    this.loadStep(to.params.step)
    next()
  },
  methods: {
    loadStep(step) {
      this.currentStep = this.$steps[step]
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

      this.$push()
    },
  },
}
</script>
