<template>
  <input v-model="item" />
</template>

<script>
import moment from "moment"

export default {
  name: "MonthInput",
  props: {
    modelValue: Date,
  },
  emits: ["update:modelValue"],
  computed: {
    item: {
      get: function () {
        if (!this.modelValue) {
          return
        } else {
          return moment(this.modelValue).format("MM/YYYY")
        }
      },
      set: function (value) {
        if (!value) {
          return this.$emit("update:modelValue", undefined)
        }

        let result = moment(value, "MM/YYYY", true)
        if (result.isValid()) {
          this.$emit("update:modelValue", result.toDate())
        }
      },
    },
  },
}
</script>
