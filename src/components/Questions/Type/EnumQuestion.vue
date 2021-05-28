<template>
  <fieldset>
    <legend>
      <h2 class="aj-question"
        >{{ questionLabel
        }}<EnSavoirPlus v-if="enSavoirPlus" :text="enSavoirPlus"
      /></h2>
      <QuestionError v-if="hasQuestionError">
        {{ questionError }}
      </QuestionError>
    </legend>

    <div
      class="aj-selection-wrapper"
      v-for="item in questionItems"
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
import { createQuestionBaseMixin } from "@/mixins/Steps/QuestionBaseMixin"
import { createBasicErrorMixin } from "@/mixins/Steps/BasicErrorMixin"
import { executeFunctionOrReturnValue } from "@/lib/Utils"

export default {
  name: "EnumQuestion",
  components: {
    EnSavoirPlus,
    QuestionError,
  },
  mixins: [createQuestionBaseMixin(), createBasicErrorMixin()],
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
  computed: {
    questionItems: function () {
      return executeFunctionOrReturnValue(this.question, "items", this).filter(
        (obj) => !obj.isRelevant || obj.isRelevant(this)
      )
    },
  },
}
</script>

<style scoped></style>
