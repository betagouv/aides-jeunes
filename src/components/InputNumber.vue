<template>
  <input type="number" v-select-on-click v-model.number="result" />
</template>

<script>
const isNumber = require("lodash/isNumber")

export default {
  name: "InputNumber",
  props: ["value"],
  data() {
    return {
      valueHistory: null,
    }
  },
  computed: {
    result: {
      get: function () {
        return this.value || this.valueHistory
      },
      set: function (value) {
        let errorMessage
        let emittedValue
        if (isNumber(value)) {
          emittedValue = value
        } else if (value !== undefined) {
          errorMessage = "Veuillez renseigner un nombre valide."
        }
        this.$emit("input", emittedValue)
        this.$store.dispatch("updateError", errorMessage)
      },
    },
  },
}
</script>
