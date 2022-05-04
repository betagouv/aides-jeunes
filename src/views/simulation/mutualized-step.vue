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
        <InputNumber
          v-model="value"
          :min="step.min"
          :data-type="step.type ? step.type : 'amount'"
        />
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

    <div v-else-if="questionType === 'multiple'">
      <label :for="fieldName"
        ><h2 class="aj-question">
          <span v-html="question" />
          <EnSavoirPlus v-if="showMoreInfo" /> </h2
      ></label>
      <MultipleAnswers v-model="value" :items="items" />
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

<script lang="ts" setup>
import ActionButtons from "@/components/action-buttons"
import MultipleAnswers from "../../components/multiple-answers.vue"
import YesNoQuestion from "../../components/yes-no-question.vue"
import Hint from "@/lib/hint"

import { executeFunctionOrReturnValue, capitalize } from "../../../lib/utils"
import EnSavoirPlus from "@/components/en-savoir-plus"
import InputNumber from "@/components/input-number"
import InputDate from "@/components/input-date"
import { ENTITIES_PROPERTIES } from "../../../lib/mutualized-steps"
import { getAnswer, nullifyUndefinedValue } from "../../../lib/answers"
import { useGetIndividu } from "@/composables/get-individu.ts"
import { useRoute } from "vue-router"
import { useStore } from "vuex"
import { computed, ref, getCurrentInstance } from "vue"

const app = getCurrentInstance()
const route = useRoute()
const store = useStore()
const entityName = route.path.split("/")[2]
const id = route.params.id

const value = ref(
  getAnswer(
    store.state.simulation.answers.all,
    entityName,
    route.params.fieldName,
    id
  )
)
const individu = entityName === "individu" ? useGetIndividu() : undefined

const entityProperties = ENTITIES_PROPERTIES[entityName]

const fieldName = route.params.fieldName

const propertyData = computed(() => {
  return {
    openFiscaParameters: store.state.openFiscaParameters,
    simulation: store.state.simulation,
    individu: individu,
    periods: store.state.dates,
  }
})

const step = entityProperties.STEPS[fieldName]
const items = executeFunctionOrReturnValue(step, "items", propertyData.value)
const question = capitalize(
  executeFunctionOrReturnValue(step, "question", propertyData.value)
)
const questionType = step.questionType

const showMoreInfo = computed(() => {
  const showMoreInfo =
    step.showMoreInfo === undefined ||
    executeFunctionOrReturnValue(step, "showMoreInfo", propertyData.value)
  return showMoreInfo && Hint.get(fieldName)
})

const requiredValueMissing = (submit: boolean): boolean => {
  const hasError = value.value === undefined

  if (submit) {
    store.dispatch("updateError", hasError && "Ce champ est obligatoire.")
  }

  return hasError
}
const canSubmit = (submit: boolean) => {
  return step.optional || !requiredValueMissing(submit)
}

const onSubmit = (): void => {
  if (!canSubmit(true)) {
    return
  }
  store.dispatch("answer", {
    id,
    entityName,
    fieldName,
    value: nullifyUndefinedValue(value.value),
  })

  // TODO Replace push function by composable
  app?.appContext.config.globalProperties.$push()
}
</script>
