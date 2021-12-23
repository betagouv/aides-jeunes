<template>
  <div>
    <input
      :id="id"
      ref="result"
      v-model.number="model"
      v-select-on-click
      type="number"
      :name="name"
      :min="min"
      :max="max"
      :step="step"
    />
    <div v-if="error" class="text-red input-number-error">
      Ce champ n'est pas valide.
    </div>
  </div>
</template>

<script>
export default {
  name: "InputNumber",
  props: {
    id: String,
    name: String,
    min: Number,
    max: Number,
    step: String,
    modelValue: [Number, String],
    emit: { type: Boolean, default: true },
  },
  emits: ["update:modelValue"],
  data: function () {
    return {
      result: this.result,
      error: false,
    }
  },
  computed: {
    model: {
      get() {
        return this.modelValue
      },
      set(value) {
        if (value || value === 0) {
          this.error = false
          this.$emit("update:modelValue", value)
        } else {
          this.error = true
          this.$emit("update:modelValue", undefined)
        }
      },
    },
  },
}
</script>

<style>
.input-number-error {
  color: #d63626;
  color: var(--red);
  padding-top: 5px;
  padding-left: 15px;
}
</style>
