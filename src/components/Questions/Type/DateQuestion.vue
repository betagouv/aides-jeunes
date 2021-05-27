<template>
  <div>
    <label :for="question.fieldName"
      ><h2 class="aj-question"> {{ questionLabel }} </h2
      ><EnSavoirPlus v-if="enSavoirPlus" :text="enSavoirPlus"></EnSavoirPlus>
    </label>
    <QuestionError v-if="hasQuestionError">
      {{ questionError }}
    </QuestionError>
    <InputDate required :id="question.fieldName" v-model="value" />
  </div>
</template>

<script>
import EnSavoirPlus from "@/components/Questions/Components/EnSavoirPlus"
import QuestionError from "@/components/Questions/Components/QuestionError"
import InputDate from "@/components/InputDate"
import { createQuestionBaseMixin } from "@/mixins/Steps/QuestionBaseMixin"
import { createBasicErrorMixin } from "@/mixins/Steps/BasicErrorMixin"

export default {
  name: "DateQuestion",
  components: {
    EnSavoirPlus,
    QuestionError,
    InputDate,
  },
  mixins: [createQuestionBaseMixin(), createBasicErrorMixin()],
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    console.log(this.question.label)
  },
  methods: {},
}
</script>

<style scoped></style>
