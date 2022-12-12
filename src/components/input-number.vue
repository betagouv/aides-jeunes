<template>
  <input
    :id="id"
    ref="result"
    v-model.number="model"
    v-select-on-click
    :data-testid="id"
    type="number"
    :name="name"
    :min="min"
    :max="max"
    :step="step"
    :data-type="dataType"
    class="fr-input"
    inputmode="numeric"
    :aria-labelledby="ariaLabelledBy || null"
  />
  <WarningMessage v-if="error" class="fr-mt-2w"
    >Ce champ n'est pas valide.</WarningMessage
  >
</template>

<script>
import WarningMessage from "@/components/warning-message.vue"
export default {
  name: "InputNumber",
  components: { WarningMessage },
  props: {
    id: String,
    name: String,
    ariaLabelledBy: String,
    min: Number,
    max: Number,
    dataType: { type: String, default: "amount" },
    value: { type: [Number, String] },
    modelValue: { type: [Number, String] },
    step: { type: String, default: "any" },
    emit: { type: Boolean, default: true },
    disableNegativeValue: { type: Boolean, default: false },
  },
  emits: ["input", "update:modelValue"],
  data: function () {
    return {
      result: this.result,
      error: false,
    }
  },
  computed: {
    model: {
      get() {
        if (this.value === 0) {
          return 0
        }
        return this.value || this.modelValue
      },
      set(value) {
        if (value !== undefined || value === 0) {
          this.error = false
          this.$emit("update:modelValue", parseFloat(value))
        } else {
          this.error = true
          this.$emit("update:modelValue", undefined)
        }
        if (this.disableNegativeValue) {
          if (value < 0) {
            this.error = true
          }
        }
      },
    },
  },
}
</script>

<style scoped>
.input-number-error {
  color: #d63626;
  color: var(--red);
  padding-top: 5px;
  padding-left: 15px;
}
input[type="number"]:not([data-type="count"]) {
  text-align: right;
}
</style>
