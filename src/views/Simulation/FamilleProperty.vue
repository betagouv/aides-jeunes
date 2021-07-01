<template>
  <form @submit.prevent="onSubmit">
    <div v-if="questionType === 'number'">
      <h2 class="aj-question">
        <span v-html="question" />
        <EnSavoirPlus v-if="showMoreInfo" />
      </h2>
      <label>
        <input
          :min="meta.min"
          type="number"
          v-select-on-click
          v-model.number="value"
        />
      </label>
    </div>
    <YesNoQuestion v-else v-model="value">
      <span v-html="question" />
      <EnSavoirPlus v-if="showMoreInfo" />
      <template v-slot:help v-if="meta.help">
        <p v-html="meta.help" />
      </template>
    </YesNoQuestion>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import Hint from "@/lib/Hint"
import FamilleQuestions from "@/lib/FamilleQuestions"
import { executeFunctionOrReturnValue, capitalize } from "@/lib/Utils"
import EnSavoirPlus from "@/components/EnSavoirPlus"
import YesNoQuestion from "@/components/YesNoQuestion"

export default {
  name: "FamilleProperty",
  components: {
    Actions,
    YesNoQuestion,
    EnSavoirPlus,
  },
  data: function () {
    return this.loadQuestion(this.$route.params.fieldName)
  },
  computed: {
    fieldName: function () {
      return this.$route.params.fieldName
    },
    meta: function () {
      return FamilleQuestions[this.fieldName]
    },
    questionType: function () {
      return this.meta.questionType
    },
    question: function () {
      return capitalize(
        executeFunctionOrReturnValue(this.meta, "question", this)
      )
    },
    showMoreInfo: function () {
      return Hint.get(this.fieldName)
    },
    items: function () {
      return executeFunctionOrReturnValue(this.meta, "items", this)
    },
  },
  methods: {
    loadQuestion(fieldName) {
      const famille = { ...this.$store.state.situation.famille }
      const value = famille[fieldName]
      return {
        famille,
        value,
      }
    },
    requiredValueMissing: function () {
      const hasError = this.value === undefined
      this.$store.dispatch(
        "updateError",
        hasError && "Ce champ est obligatoire."
      )
      return hasError
    },
    onSubmit: function () {
      if (this.requiredValueMissing()) {
        return
      }
      this.famille[this.fieldName] = this.value
      this.$store.dispatch("updateFamille", this.famille)
      this.$push()
    },
  },
}
</script>
