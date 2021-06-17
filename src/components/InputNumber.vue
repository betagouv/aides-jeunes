<template>
  <input type="text" v-select-on-click v-model="result" />
</template>

<script>
export default {
  name: "InputNumber",
  props: ["value", "toString"],
  computed: {
    result: {
      get: function () {
        return this.value
      },
      set: function (value) {
        const floatValue = parseFloat(value)
        debugger
        this.$emit(
          "input",
          floatValue || floatValue === 0
            ? this.toString !== undefined
              ? floatValue.toString()
              : floatValue
            : undefined
        )
      },
    },
  },
}
</script>
