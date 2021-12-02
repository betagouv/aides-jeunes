<template>
  <div>
    <input
      :id="id"
      v-model.number="result"
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
  props: ["id", "name", "modelValue", "min", "max", "step"],
  emits: ["update:modelValue"],
  data() {
    return {
      error: false,
    }
  },
  computed: {
    result: {
      get: function () {
        return this.modelValue
      },
      set: function (value) {
        this.error = false
        if (value || value === 0) {
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
