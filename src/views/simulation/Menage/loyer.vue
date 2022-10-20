<template>
  <form @submit.prevent="onSubmit" class="fr-form-group">
    <fieldset class="fr-fieldset fr-mb-2w">
      <div class="fr-fieldset__content">
        <div class="fr-input-group">
          <label role="heading" aria-level="2" for="loyer" class="fr-label"
            >{{ loyerQuestion.label }}<br />
            <span class="fr-hint-text">{{ loyerQuestion.hint }}</span>
          </label>
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
        <div v-if="captureCharges" class="fr-input-group">
          <label role="heading" aria-level="2" for="charges" class="fr-label"
            >{{ chargesQuestion.label }}
            <span class="fr-hint-text">{{ chargesQuestion.hint }}</span>
          </label>
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
      </div>
    </fieldset>
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
