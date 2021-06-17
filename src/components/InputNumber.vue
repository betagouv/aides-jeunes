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
        this.$emit("input", floatValue ? floatValue : undefined)
      },
    },
  },
}
</script>
