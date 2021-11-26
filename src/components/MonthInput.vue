<template>
  <input v-model="item">
</template>

<script>
import moment from "moment"

export default {
  name: "MonthInput",
  props: {
    modelValue: Date,
  },
  computed: {
    item: {
      get: function () {
        if (!this.value) {
          return
        } else {
          return moment(this.value).format("MM/YYYY")
        }
      },
      set: function (value) {
        if (!value) {
          return this.$emit("input", undefined)
        }

        let result = moment(value, "MM/YYYY", true)
        if (result.isValid()) {
          this.$emit("input", result.toDate())
        }
      },
    },
  },
}
</script>
