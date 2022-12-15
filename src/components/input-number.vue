<template>
  <input
    :id="id"
    ref="result"
    v-model="model"
    v-select-on-click
    :data-testid="id"
    :name="name"
    :data-type="dataType"
    type="text"
    class="fr-input"
    :class="dataType !== 'count' ? 'fr-text--right' : ''"
    inputmode="decimal"
    :aria-labelledby="ariaLabelledBy || null"
  />
  <WarningMessage v-if="error" class="fr-mt-2w"
    >Ce champ n'est pas valide.</WarningMessage
  >
</template>

<script>
import WarningMessage from "@/components/warning-message.vue"
import { stringIsValidNumber, stringToNumber } from "@/utils/validator"
export default {
  name: "InputNumber",
  components: { WarningMessage },
  props: {
    id: String,
    name: String,
    ariaLabelledBy: String,
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    dataType: { type: String, default: "amount" },
    value: { type: [Number, String] },
    modelValue: { type: [Number, String] },
    emit: { type: Boolean, default: true },
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
        return this.value || this.modelValue || ""
      },
      set(value) {
        if (
          (value && stringIsValidNumber(value, this.min, this.max)) ||
          value === ""
        ) {
          this.error = false
          this.$emit("update:modelValue", stringToNumber(value))
        } else {
          this.error = true
          this.$emit("update:modelValue", value)
        }
      },
    },
  },
}
</script>
