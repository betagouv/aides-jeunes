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
          class="aj-input-euros"
          v-model="loyerQuestion.selectedValue"
        ></InputNumber>
      </div>
    </div>
    <div v-if="captureCharges">
      <label for="charges" class="aj-question"
        >{{ chargesQuestion.label }}
        <span class="help">{{ chargesQuestion.hint }}</span>
      </label>
      <div class="aj-input-currency-wrapper">
        <InputNumber
          id="charges"
          v-model="chargesQuestion.selectedValue"
        ></InputNumber>
      </div>
    </div>
    <Actions v-bind:onSubmit="onSubmit" />
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
    const menage = { ...this.$store.getters.getMenage } || {}
    const logementStatut = this.$store.getters.getLogementStatut || ""

    return Logement.getLoyerData(menage, logementStatut)
  },
  methods: {
    onSubmit: function () {
      this.menage.loyer = this.loyerQuestion.selectedValue || 0
      if (this.captureCharges) {
        this.menage.charges_locatives = this.chargesQuestion.selectedValue || 0
      }
      this.$store.dispatch("updateMenage", this.menage)
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
