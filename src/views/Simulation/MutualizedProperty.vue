<template>
  <form @submit.prevent="onSubmit">
    <fieldset v-if="questionType === 'enum'">
      <legend>
        <h2 class="aj-question">
          <span v-html="question"></span>
          <EnSavoirPlus v-if="showMoreInfo" />
        </h2>
        <p v-if="property.help" v-html="property.help"></p>
      </legend>
      <div class="aj-selections">
        <div
          class="aj-selection-wrapper"
          v-for="(item, index) in items"
          :key="item.value"
        >
          <input
            :id="item.value"
            type="radio"
            :name="fieldName"
            :value="item.value"
            v-model="value"
            :autofocus="index === 0"
          />
          <label :for="item.value">
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
      <p v-if="property.help" v-html="property.help"></p>
      <label>
        <InputNumber :min="property.min" v-model="value"></InputNumber>
      </label>
    </div>

    <div v-else-if="questionType === 'date'">
      <label :for="fieldName"
        ><h2 class="aj-question">
          <span v-html="question"></span>
          <EnSavoirPlus v-if="showMoreInfo" /> </h2
      ></label>
      <InputDate required :id="fieldName" v-model="value" />
    </div>

    <YesNoQuestion v-else v-model="value">
      <span v-html="question"></span><EnSavoirPlus v-if="showMoreInfo" />
      <template v-slot:help v-if="property.help"
        ><p v-html="property.help"></p
      ></template>
    </YesNoQuestion>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import YesNoQuestion from "../../components/YesNoQuestion.vue"
import Hint from "@/lib/Hint"
import IndividuProperties from "@/lib/IndividuProperties"
import FamilleProperties from "@/lib/FamilleProperties"
import ParentsProperties from "@/lib/ParentsProperties"
import { executeFunctionOrReturnValue, capitalize } from "@/lib/Utils"
import EnSavoirPlus from "@/components/EnSavoirPlus"
import InputNumber from "@/components/InputNumber"
import InputDate from "@/components/InputDate"

const PROPERTIES_BY_ENTITY_NAME = {
  individu: IndividuProperties,
  famille: FamilleProperties,
  parents: ParentsProperties,
}

export default {
  name: "IndividuProperty",
  components: {
    InputNumber,
    InputDate,
    Actions,
    YesNoQuestion,
    EnSavoirPlus,
  },
  data() {
    const entityName = this.$route.path.split("/")[2]
    const entity = PROPERTIES_BY_ENTITY_NAME[entityName].loadEntity(this)
    return {
      value: entity[this.$route.params.fieldName],
      entityName,
      entity,
    }
  },
  computed: {
    fieldName() {
      return this.$route.params.fieldName
    },
    properties() {
      return PROPERTIES_BY_ENTITY_NAME[this.entityName]
    },
    property() {
      return this.properties.PROPERTIES[this.fieldName]
    },
    questionType() {
      return this.property.questionType
    },
    question() {
      return capitalize(
        executeFunctionOrReturnValue(this.property, "question", this)
      )
    },
    showMoreInfo() {
      const showMoreInfo =
        this.property.showMoreInfo === undefined ||
        executeFunctionOrReturnValue(this.property, "showMoreInfo", this)
      return showMoreInfo && Hint.get(this.fieldName)
    },
    items() {
      return executeFunctionOrReturnValue(this.property, "items", this)
    },
  },
  methods: {
    requiredValueMissing() {
      const hasError = this.value === undefined
      this.$store.dispatch(
        "updateError",
        hasError && "Ce champ est obligatoire."
      )
      return hasError
    },
    onSubmit() {
      if (this.requiredValueMissing()) {
        return
      }
      this.entity[this.fieldName] = this.value
      this.$store.dispatch(this.properties.DISPATCH_NAME, this.entity)
      this.$push()
    },
  },
}
</script>
