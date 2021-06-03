<template>
  <InputDate
    v-model="date"
    v-on:input="$emit('input', date)"
    dateType="month"
  />
</template>

<script>
//This component is a simple sugar for InputDate.
import InputDate from "@/components/InputDate"

export default {
  name: "InputMonth",
  props: {
    value: Date,
  },
  components: {
    InputDate,
  },
  data: function () {
    let date = this.value
    return { date: date }
  },
  methods: {
    updateDate: function (date) {
      this.$emit("input", date)
    },
  },
}
</script>
