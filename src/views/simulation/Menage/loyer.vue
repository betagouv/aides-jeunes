<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label for="loyer" class="fr-px-2v"
        ><span class="fr-text--lead fr-text--bold">{{
          loyerQuestion.label
        }}</span>
        <span class="fr-hint-text fr-px-2v fr-mt-2v">{{
          loyerQuestion.hint
        }}</span>
      </label>

      <div class="fr-container fr-px-0">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-5 fr-col-lg-5">
            <InputNumber
              id="loyer"
              v-model="loyerQuestion.selectedValue"
              :min="0"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="captureCharges" class="fr-mt-6w">
      <label for="charges" class="fr-px-2v">
        <span class="fr-text--lead fr-text--bold">{{
          chargesQuestion.label
        }}</span>
        <span class="fr-hint-text fr-px-2v fr-mt-2v">{{
          chargesQuestion.hint
        }}</span>
      </label>

      <div class="fr-container fr-px-0">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-5 fr-col-lg-5">
            <InputNumber
              id="charges"
              v-model="chargesQuestion.selectedValue"
              :min="0"
            />
          </div>
        </div>
      </div>
    </div>

    <ActionButtons :on-submit="onSubmit" :disable-submit="!canSubmit" />
  </form>
</template>

<script>
import ActionButtons from "@/components/action-buttons.vue"
import InputNumber from "@/components/input-number.vue"
import Logement from "@lib/logement"
import { useStore } from "@/stores/index.ts"

export default {
  name: "SimulationMenageDepCom",
  components: {
    InputNumber,
    ActionButtons,
  },
  props: {
    modelValue: Number,
  },
  setup() {
    return { store: useStore() }
  },
  data() {
    return Logement.getLoyerData(this.store.simulation.answers.all)
  },
  computed: {
    canSubmit() {
      let loyerQuestion = null
      if (this.loyerQuestion) {
        loyerQuestion =
          this.loyerQuestion.selectedValue != undefined &&
          this.loyerQuestion.selectedValue >= 0
      }
      let chargesQuestion = null
      if (this.chargesQuestion) {
        chargesQuestion =
          this.chargesQuestion.selectedValue != undefined &&
          this.chargesQuestion.selectedValue >= 0
      }
      return this.captureCharges
        ? loyerQuestion && chargesQuestion
        : loyerQuestion
    },
  },
  created() {
    if (this.loyerQuestion && !this.loyerQuestion.selectedValue) {
      this.loyerQuestion.selectedValue = 0
    }
    if (this.chargesQuestion && !this.chargesQuestion.selectedValue) {
      this.chargesQuestion.selectedValue = 0
    }
  },
  methods: {
    onSubmit() {
      if (!this.canSubmit) return
      this.store.answer({
        entityName: "menage",
        fieldName: "loyer",
        path: this.$route.path,
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
