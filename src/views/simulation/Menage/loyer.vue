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
          <div class="fr-col-12 fr-col-md-6 fr-col-md-5 fr-col-lg-5">
            <InputNumber id="loyer" v-model="loyerQuestion.selectedValue" />
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
          <div class="fr-col-12 fr-col-sm-5 fr-col-md-5 fr-col-lg-5">
            <InputNumber
              id="charges"
              v-model="chargesQuestion.selectedValue"
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
