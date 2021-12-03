<template>
  <div>
    <input
      :id="id"
      v-model.number="result"
      ref="result"
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
  props: ["id", "name", "min", "max", "step", "value"],
  emits: ["update:modelValue"],
  data: function () {
    return {
      result: this.result,
      error: false,
    }
  },

  watch: {
    result: function (value) {
      this.error = false
      if (value && value >= 0) {
        this.$emit("update:modelValue", value)
      } else {
        this.error = true
        this.$emit("update:modelValue", 0)
      }
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
