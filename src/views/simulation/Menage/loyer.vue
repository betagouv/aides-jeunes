<template>
  <form @submit.prevent="onSubmit">
    <div class="field-group">
      <label for="loyer" class="aj-question"
        >{{ loyerQuestion.label }}
        <span class="help">{{ loyerQuestion.hint }}</span>
      </label>
      <div class="aj-input-currency-wrapper">
        <InputNumber
          id="loyer"
          v-model="loyerQuestion.selectedValue"
          class="aj-input-euros"
        />
      </div>
    </div>
    <div v-if="captureCharges">
      <label for="charges" class="aj-question"
        >{{ chargesQuestion.label }}
        <span class="help">{{ chargesQuestion.hint }}</span>
      </label>
      <div class="aj-input-currency-wrapper">
        <InputNumber id="charges" v-model="chargesQuestion.selectedValue" />
      </div>
    </div>
    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script>
import ActionButtons from "@/components/action-buttons"
import InputNumber from "@/components/input-number"
import Logement from "@/lib/logement"

export default {
  name: "SimulationMenageDepCom",
  components: {
    InputNumber,
    ActionButtons,
  },
  props: {
    modelValue: Number,
  },
  data: function () {
    return Logement.getLoyerData(this.$store.state.answers.all)
  },
  methods: {
    onSubmit: function () {
      this.$store.dispatch("answer", {
        entityName: "menage",
        fieldName: "loyer",
        value: {
          loyer: this.loyerQuestion.selectedValue || 0,
          charges_locatives: this.captureCharges
            ? this.chargesQuestion.selectedValue || 0
            : undefined,
        },
      })
      this.$push()
    },
  },
}
</script>

<style scoped lang="scss">
.field-group {
  margin-bottom: 2em;
}
</style>
