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
            <span
              v-if="item.hint && typeof item.hint === 'string'"
              class="help"
            >
              {{ item.hint }}
            </span>
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
      <MutualizedStepTitle
        :for-title-wrapper="fieldName"
        :question="question"
        :show-more-info="showMoreInfo"
        :help="step.help"
      ></MutualizedStepTitle>
      <input
        :id="fieldName"
        v-model="value"
        :data-testid="fieldName"
        type="text"
      />
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
import ActionButtons from "@/components/action-buttons.vue"
import MultipleAnswers from "@/components/multiple-answers.vue"
import YesNoQuestion from "@/components/yes-no-question.vue"
import MutualizedStepTitle from "@/components/mutualized-step-title.vue"
import Hint from "@/lib/hint"

import { executeFunctionOrReturnValue } from "@lib/utils"
import EnSavoirPlus from "@/components/en-savoir-plus.vue"
import Individu from "@lib/individu"
import InputNumber from "@/components/input-number.vue"
import InputDate from "@/components/input-date.vue"
import { ENTITIES_PROPERTIES } from "@lib/mutualized-steps"
import { getAnswer, nullifyUndefinedValue } from "@lib/answers"
import { useIndividu } from "@/composables/individu.ts"
import { useStore } from "@/stores"

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
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    const entityName = this.$route.path.split("/")[2]
    const id = (this.params || this.$route.params).id
    const value = getAnswer(
      this.store.simulation.answers.all,
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
    demandeurIndividu() {
      return useIndividu("demandeur")
    },
    demandeurAge() {
      return Individu.age(
        this.store.situation.demandeur,
        this.store.dates.today.value
      )
    },
    propertyData() {
      return {
        openFiscaParameters: this.store.openFiscaParameters,
        simulation: this.store.simulation,
        individu: this.individu,
        periods: this.store.dates,
        demandeurIndividu: this.demandeurIndividu,
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
      this.store.answer({
        id: this.id,
        entityName: this.entityName,
        fieldName: this.fieldName,
        value: nullifyUndefinedValue(this.value),
      })
      this.$push()
    },
    requiredValueMissing(submit) {
      const hasError =
        this.value === undefined ||
        (this.questionType === "text" && !this.value)

      if (submit) {
        this.store.updateError(hasError && "Ce champ est obligatoire.")
      }

      return hasError
    },
    canSubmit(submit) {
      return this.step.optional || !this.requiredValueMissing(submit)
    },
  },
}
</script>
