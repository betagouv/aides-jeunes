<template>
  <fieldset>
    <legend class="width-100"
      ><h2 class="aj-question" v-html="questionLabel"
        ><EnSavoirPlus
          v-if="enSavoirPlus"
          :question-label="questionLabel"
          :question-index="questionIndex"
          :text="enSavoirPlus"
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
import QuestionError from "@/components/Questions/Components/QuestionError"
import { createQuestionBaseMixin } from "@/mixins/Steps/QuestionBaseMixin"
import { createBasicErrorMixin } from "@/mixins/Steps/BasicErrorMixin"
import EnSavoirPlus from "@/components/Questions/Components/EnSavoirPlus"

export default {
  name: "YesNoQuestion",
  components: {
    QuestionError,
    EnSavoirPlus,
  },
  mixins: [createQuestionBaseMixin(), createBasicErrorMixin()],
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
}
</script>

<style scoped></style>
