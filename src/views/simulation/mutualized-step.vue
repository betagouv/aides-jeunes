<template>
  <form @submit.prevent="onSubmit">
    <fieldset v-if="questionType === 'enum'">
      <MutualizedStepTitle
        title-wrapper="legend"
        :question="question"
        :show-more-info="showMoreInfo"
        :help="step.help"
      ></MutualizedStepTitle>
      <div class="aj-selections">
        <div
          v-for="(item, index) in step.getItems(propertyData)"
          :key="`${item.value}`"
          class="aj-selection-wrapper"
        >
          <input
            :id="`${item.value}`"
            v-model="value"
            type="radio"
            :name="fieldName"
            :value="item.value"
            :autofocus="index === 0"
          />
          <label :for="`${item.value}`">
            {{ item.label }}
          </label>
        </div>
      </div>
    </fieldset>

    <div v-else-if="questionType === 'number'">
      <MutualizedStepTitle
        :for-title-wrapper="fieldName"
        :question="question"
        :show-more-info="showMoreInfo"
        :help="step.help"
      ></MutualizedStepTitle>
      <InputNumber
        :id="fieldName"
        v-model="value"
        :min="step.min"
        :data-type="step.type"
      />
    </div>

    <div v-else-if="questionType === 'date'">
      <MutualizedStepTitle
        :for-title-wrapper="fieldName"
        :question="question"
        :show-more-info="showMoreInfo"
        :help="step.help"
      ></MutualizedStepTitle>
      <InputDate :id="fieldName" v-model="value" required />
    </div>

    <fieldset v-else-if="questionType === 'multiple'">
      <MutualizedStepTitle
        title-wrapper="legend"
        :question="question"
        :show-more-info="showMoreInfo"
        :help="step.help"
      ></MutualizedStepTitle>
      <MultipleAnswers v-model="value" :items="step.getItems(propertyData)" />
    </fieldset>

    <div v-else-if="questionType === 'text'">
      <label :for="fieldName"
        ><h2 class="aj-question">
          <span v-html="question" />
          <EnSavoirPlus v-if="showMoreInfo" /> </h2
      ></label>
      <input :id="fieldName" v-model="value" type="text" />
    </div>

    <YesNoQuestion v-else v-model="value">
      <span v-html="question" /><EnSavoirPlus v-if="showMoreInfo" />
      <template v-if="step.help" #help>
        <p v-html="step.help" />
      </template>
    </YesNoQuestion>
    <ActionButtons :on-submit="onSubmit" :disable-submit="!canSubmit(false)" />
  </form>
</template>

<script>
import ActionButtons from "@/components/action-buttons"
import MultipleAnswers from "../../components/multiple-answers.vue"
import YesNoQuestion from "../../components/yes-no-question.vue"
import MutualizedStepTitle from "../../components/mutualized-step-title.vue"
import Hint from "@/lib/hint"

import { executeFunctionOrReturnValue } from "../../../lib/utils"
import EnSavoirPlus from "@/components/en-savoir-plus"
import InputNumber from "@/components/input-number"
import InputDate from "@/components/input-date"
import { ENTITIES_PROPERTIES } from "../../../lib/mutualized-steps"
import { getAnswer, nullifyUndefinedValue } from "../../../lib/answers"
import { useIndividu } from "@/composables/individu.ts"

export default {
  name: "MutualizedStep",
  components: {
    ActionButtons,
    EnSavoirPlus,
    InputNumber,
    InputDate,
    MultipleAnswers,
    YesNoQuestion,
    MutualizedStepTitle,
  },
  data() {
    const entityName = this.$route.path.split("/")[2]
    const id = (this.params || this.$route.params).id
    const value = getAnswer(
      this.$store.state.simulation.answers.all,
      entityName,
      this.$route.params.fieldName,
      id
    )

    return {
      id,
      value,
      entityName,
    }
  },
  computed: {
    entityProperties() {
      return ENTITIES_PROPERTIES[this.entityName]
    },
    fieldName() {
      return this.$route.params.fieldName
    },
    question() {
      return this.step.getQuestion(this.propertyData)
    },
    questionType() {
      return this.step.questionType
    },
    showMoreInfo() {
      const showMoreInfo =
        this.step.showMoreInfo === undefined ||
        executeFunctionOrReturnValue(
          this.step,
          "showMoreInfo",
          this.propertyData
        )
      return Boolean(showMoreInfo && Hint.get(this.fieldName))
    },
    individu() {
      if (this.entityName === "individu") {
        return useIndividu(this.$route.params.id)
      }
      return undefined
    },
    propertyData() {
      return {
        openFiscaParameters: this.$store.state.openFiscaParameters,
        simulation: this.$store.state.simulation,
        individu: this.individu,
        periods: this.$store.state.dates,
      }
    },
    step() {
      return this.entityProperties[this.fieldName]
    },
  },
  methods: {
    onSubmit() {
      if (!this.canSubmit(true)) {
        return
      }
      this.$store.dispatch("answer", {
        id: this.id,
        entityName: this.entityName,
        fieldName: this.fieldName,
        value: nullifyUndefinedValue(this.value),
      })
      this.$push()
    },
    requiredValueMissing(submit) {
      const hasError = this.value === undefined

      if (submit) {
        this.$store.dispatch(
          "updateError",
          hasError && "Ce champ est obligatoire."
        )
      }

      return hasError
    },
    canSubmit(submit) {
      return this.step.optional || !this.requiredValueMissing(submit)
    },
  },
}
</script>
