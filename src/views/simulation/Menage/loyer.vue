<template>
  <form @submit.prevent="onSubmit" class="fr-form-group">
    <div class="fr-mb-6w">
      <label for="loyer">
        <h2 class="fr-text--lead">{{ loyerQuestion.label }}</h2>
      </label>
      <span class="fr-hint-text">{{ loyerQuestion.hint }}</span>
      <div class="fr-container--fluid">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-5 fr-col-lg-5">
            <InputNumber
              id="loyer"
              :amount="true"
              v-model="loyerQuestion.selectedValue"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="captureCharges" class="fr-mb-2w">
      <label for="charges">
        <h2 class="fr-text--lead">{{ chargesQuestion.label }}</h2>
      </label>
      <span class="fr-hint-text">{{ chargesQuestion.hint }}</span>
      <div class="fr-container--fluid">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-5 fr-col-lg-5">
            <InputNumber
              id="charges"
              v-model="chargesQuestion.selectedValue"
              :amount="true"
              data-testid="loyer"
            />
          </div>
        </div>
      </div>
    </div>

    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script>
import ActionButtons from "@/components/action-buttons.vue"
import InputNumber from "@/components/input-number.vue"
import Logement from "@lib/logement"
import { useStore } from "@/stores"

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
  methods: {
    onSubmit() {
      this.store.answer({
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
