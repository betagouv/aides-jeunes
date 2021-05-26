<template>
  <fieldset>
    <legend
      ><h2 class="aj-question"
        >{{ question.label
        }}<EnSavoirPlus v-if="enSavoirPlus" :text="enSavoirPlus"
      /></h2>
      <QuestionError v-if="hasQuestionError">
        {{ questionError }}
      </QuestionError>
    </legend>
    <div class="aj-selection-wrapper">
      <input
        :id="'yes-' + uniqueFieldName"
        type="radio"
        v-bind:value="true"
        :name="question.fieldName"
        v-model="value"
      />
      <label :for="'yes-' + uniqueFieldName">Oui</label>
    </div>
    <div class="aj-selection-wrapper">
      <input
        :id="'no-' + uniqueFieldName"
        type="radio"
        v-bind:value="false"
        :name="question.fieldName"
        v-model="value"
      />
      <label :for="'no-' + uniqueFieldName">Non</label>
    </div>
  </fieldset>
</template>

<script>
import EnSavoirPlus from "@/components/EnSavoirPlus"
import QuestionError from "@/components/Questions/Components/QuestionError"
import { createQuestionMixin } from "@/mixins/QuestionMixins"

export default {
  name: "YesNoQuestion",
  components: {
    QuestionError,
    EnSavoirPlus,
  },
  mixins: [createQuestionMixin()],
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
  data: function () {
    const uniqueFieldName = "field." + Math.random().toString(36).slice(2)
    return {
      uniqueFieldName,
    }
  },
  requiredValueMissing: function () {
    const hasError = this.value === undefined
    if (hasError) this.questionError = "Ce champ est obligatoire."
    return hasError
  },
  onSubmit: function () {
    if ("onSubmit" in this.question)
      this.question.onSubmit(this.$store, this.value)
    return this.value
  },
}
</script>

<style scoped></style>
