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
    <Actions :on-submit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import InputNumber from "@/components/InputNumber"
import Logement from "@/lib/Logement"

export default {
  name: "SimulationMenageDepCom",
  components: {
    InputNumber,
    Actions,
  },
  data: function () {
    return Logement.getLoyerData(this.$store.getters.getAnswer)
  },
  methods: {
    onSubmit: function () {
      this.$store.dispatch("answer", {
        id: "menage",
        entityName: "menage",
        fieldName: "loyer",
        value: this.loyerQuestion.selectedValue || 0,
      })
      if (this.captureCharges) {
        this.$store.dispatch("answer", {
          id: "menage",
          entityName: "menage",
          fieldName: "charges_locatives",
          value: this.chargesQuestion.selectedValue || 0,
        })
      }
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
