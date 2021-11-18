<template>
  <form @submit.prevent="onSubmit">
    <fieldset v-if="questionType === 'enum'">
      <legend>
        <h2 class="aj-question">
          <span v-html="question" />
          <EnSavoirPlus v-if="showMoreInfo" />
        </h2>
        <p v-if="step.help" v-html="step.help" />
      </legend>
      <div class="aj-selections">
        <div
          v-for="(item, index) in items"
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
      <h2 class="aj-question">
        <span v-html="question" />
        <EnSavoirPlus v-if="showMoreInfo" />
      </h2>
      <p v-if="step.help" v-html="step.help" />
      <label>
        <InputNumber v-model="value" :min="step.min" />
      </label>
    </div>

    <div v-else-if="questionType === 'date'">
      <label :for="fieldName"
        ><h2 class="aj-question">
          <span v-html="question" />
          <EnSavoirPlus v-if="showMoreInfo" /> </h2
      ></label>
      <InputDate :id="fieldName" v-model="value" required />
    </div>

    <YesNoQuestion v-else v-model="value">
      <span v-html="question" /><EnSavoirPlus v-if="showMoreInfo" />
      <template v-if="step.help" #help>
        <p v-html="step.help" />
      </template>
    </YesNoQuestion>
    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script>
import ActionButtons from "@/components/action-buttons"
import YesNoQuestion from "../../components/yes-no-question.vue"
import Hint from "@/lib/hint"

import { executeFunctionOrReturnValue, capitalize } from "@/lib/utils"
import EnSavoirPlus from "@/components/en-savoir-plus"
import InputNumber from "@/components/input-number"
import InputDate from "@/components/input-date"
import { ENTITIES_PROPERTIES } from "@/lib/State/steps"
import { getAnswer } from "../../../lib/answers"

export default {
  name: "MutualizedStep",
  components: {
    ActionButtons,
    EnSavoirPlus,
    InputNumber,
    InputDate,
    YesNoQuestion,
  },
  data() {
    const entityName = this.$route.path.split("/")[2]
    const id = (this.params || this.$route.params).id
    const value = getAnswer(
      this.$store.state.answers.all,
      entityName,
      this.$route.params.fieldName,
      id
    )
    const entity = ENTITIES_PROPERTIES[entityName].loadEntity?.(this)

    return {
      id,
      value,
      entityName,
      entity,
    }
  },
  computed: {
    entityProperties() {
      return ENTITIES_PROPERTIES[this.entityName]
    },
    fieldName() {
      return this.$route.params.fieldName
    },
    items() {
      return executeFunctionOrReturnValue(this.step, "items", this)
    },
    question() {
      return capitalize(
        executeFunctionOrReturnValue(this.step, "question", this)
      )
    },
    questionType() {
      return this.step.questionType
    },
    showMoreInfo() {
      const showMoreInfo =
        this.step.showMoreInfo === undefined ||
        executeFunctionOrReturnValue(this.step, "showMoreInfo", this)
      return showMoreInfo && Hint.get(this.fieldName)
    },
    step() {
      return this.entityProperties.STEPS[this.fieldName]
    },
  },
  methods: {
    onSubmit() {
      if (!this.step.optional && this.requiredValueMissing()) {
        return
      }
      this.$store.dispatch("answer", {
        id: this.id,
        entityName: this.entityName,
        fieldName: this.fieldName,
        value: this.value,
      })
      this.$push()
    },
    requiredValueMissing() {
      const hasError = this.value === undefined
      this.$store.dispatch(
        "updateError",
        hasError && "Ce champ est obligatoire."
      )
      return hasError
    },
  },
}
</script>
