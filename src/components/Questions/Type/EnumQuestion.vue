<template>
  <fieldset>
    <legend>
      <h2 class="aj-question"
        >{{ question.label
        }}<EnSavoirPlus v-if="enSavoirPlus" :text="enSavoirPlus"
      /></h2>
      <QuestionError v-if="hasQuestionError">
        {{ questionError }}
      </QuestionError>
    </legend>

    <div
      class="aj-selection-wrapper"
      v-for="item in question.items"
      :key="item.value"
    >
      <input
        :id="item.value"
        type="radio"
        :name="question.fieldName"
        :value="item.value"
        v-model="value"
      />
      <label :for="item.value">
        {{ item.label }}
      </label>
    </div>
  </fieldset>
</template>

<script>
import EnSavoirPlus from "@/components/Questions/Components/EnSavoirPlus"
import QuestionError from "@/components/Questions/Components/QuestionError"
import { createQuestionMixin } from "@/mixins/QuestionMixins"

export default {
  name: "EnumQuestion",
  components: {
    EnSavoirPlus,
    QuestionError,
  },
  mixins: [createQuestionMixin()],
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
  methods: {
    requiredValueMissing: function () {
      const hasError = this.value === undefined
      if (hasError) this.questionError = "Ce champ est obligatoire."
      return hasError
    },
    onSubmit: function () {
      if ("onSubmit" in this.question) this.question.onSubmit(this)
      return this.value
    },
  },
}
</script>

<style scoped></style>
