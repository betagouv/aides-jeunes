<template>
  <form @submit.prevent="onSubmit">
    <fieldset v-if="questionType === 'enum'">
      <legend>
        <h2 class="aj-question"><div v-html="question"></div></h2
      ></legend>
      <div class="aj-selections">
        <div
          class="aj-selection-wrapper"
          v-for="item in items"
          :key="item.value"
        >
          <input
            :id="item.value"
            type="radio"
            :name="fieldName"
            :value="item.value"
            v-model="value"
          />
          <label :for="item.value">
            {{ item.label }}
          </label>
        </div>
      </div>
    </fieldset>
    <div v-else-if="questionType === 'number'">
      <label :for="fieldName">
        <h2 class="aj-question"><div v-html="question"></div></h2>
      </label>
      <div :class="meta.wrapperClassName">
        <input
          :id="fieldName"
          type="number"
          :name="fieldName"
          v-model="value"
        />
      </div>
    </div>
    <YesNoQuestion v-else v-model="value">
      <div v-html="question"></div>
    </YesNoQuestion>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import YesNoQuestion from "../../components/YesNoQuestion.vue"

const data = {
  _situation: {
    question: "Quelle est la situation de vos parents ?",
    questionType: "enum",
    items: [
      {
        label: "En couple",
        value: "en_couple",
      },
      {
        label: "Séparés",
        value: "separes",
      },
      {
        label: "Veuf ou veuve",
        value: "veuve",
      },
      {
        label: "Décédés",
        value: "decedes",
      },
      {
        label: "Sans autorité parentale",
        value: "sans_autorite",
      },
    ],
  },
  _en_france: {
    question: "Vos parents habitent-ils en France ?",
  },
  nbptr: {
    question:
      "Quel est le nombre de parts sur le plus récent avis d'imposition de vos parents ?",
    questionType: "number",
  },
  rfr: {
    question:
      "Quel est le revenu fiscal de référence (RFR) sur le plus récent avis d'imposition de vos parents ?",
    questionType: "number",
    wrapperClassName: "aj-input-currency-wrapper",
  },
}

export default {
  name: "SimulationParentProperty",
  components: {
    Actions,
    YesNoQuestion,
  },
  data: function () {
    const parents = {
      ...(this.$store.getters.getParents || {}),
    }
    const value = parents[this.$route.params.fieldName]
    return {
      error: false,
      parents,
      value,
    }
  },
  computed: {
    fieldName: function () {
      return this.$route.params.fieldName
    },
    meta: function () {
      return data[this.fieldName]
    },
    questionType: function () {
      return this.meta.questionType
    },
    question: function () {
      return this.meta.question
    },
    items: function () {
      return this.meta.items
    },
  },
  methods: {
    requiredValueMissing: function () {
      const hasError = this.value === undefined
      this.$store.dispatch(
        "updateError",
        hasError && "Ce champ est obligatoire."
      )
      return hasError
    },
    onSubmit: function () {
      if (this.requiredValueMissing()) {
        return
      }
      this.parents[this.fieldName] = this.value
      this.$store.dispatch("updateParents", this.parents)
      this.$push()
    },
  },
}
</script>
