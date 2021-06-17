<template>
  <div>
    <input
      type="number"
      v-select-on-click
      v-model.number="result"
      :min="min"
      :max="max"
      :step="step"
    />
    <div class="text-red input-number-error" v-if="error">
      Ce champ n'est pas valide.
    </div>
  </div>
</template>

<script>
export default {
  name: "InputNumber",
  props: ["value", "min", "max", "step"],
  data() {
    return {
      error: false,
    }
  },
  computed: {
    result: {
      get: function () {
        return this.value
      },
      set: function (value) {
        this.error = false
        if (value || value === 0) {
          this.$emit("input", value)
        } else {
          this.error = true
          this.$emit("input", undefined)
        }
      },
    },
  },
}
</script>

<style>
.input-number-error {
  color: red;
  padding-top: 5px;
  padding-left: 15px;
}
</style>
