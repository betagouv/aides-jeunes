<template>
  <input type="text" v-select-on-click v-model="result" />
</template>

<script>
export default {
  name: "InputNumber",
  props: ["value"],
  computed: {
    result: {
      get: function () {
        return this.value
      },
      set: function (value) {
        const floatValue = parseFloat(value)
        let emittedValue
        if (value) emittedValue = floatValue
        this.$emit("input", emittedValue)
      },
    },
  },
}
</script>
