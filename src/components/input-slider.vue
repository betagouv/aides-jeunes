<template>
  <div class="fr-fieldset__content">
    <div class="fr-container fr-px-0">
      <input
        :id="id"
        v-model="model"
        v-select-on-click
        class="fr-input-slider"
        type="range"
        :min="min"
        :max="max"
        :aria-labelledby="ariaLabelledBy"
      />
    </div>
    <p>{{ label }}</p>
  </div>
</template>

<script>
export default {
  name: "InputSlider",
  props: {
    ariaLabelledBy: String,
    id: String,
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    modelValue: { type: [Number, String] },
    items: Object,
    emit: { type: Boolean, default: true },
  },
  emits: ["input", "update:modelValue"],
  computed: {
    label() {
      if (this.modelValue !== null) {
        const item = this.items.find((item) => item.value === this.modelValue)
        if (item) {
          return item.label
        }
      }
      return "Valeur inconnue"
    },
    model: {
      get() {
        return parseFloat(this.modelValue)
      },
      set(value) {
        this.$emit("update:modelValue", parseFloat(value))
      },
    },
  },
  mounted() {
    if (!this.model) {
      this.$emit("update:modelValue", parseFloat(this.items[0].value))
    }
  },
}
</script>
