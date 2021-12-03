<template>
  <InputDate
    v-model="date"
    date-type="month"
    @input="$emit('update:modelValue', date)"
  />
</template>

<script>
//This component is a simple sugar for InputDate.
import InputDate from "@/components/InputDate"

export default {
  name: "InputMonth",
  components: {
    InputDate,
  },
  emits: ["update:modelValue"],
  props: {
    modelValue: Date,
  },
  data: function () {
    let date = this.value
    return { date: date }
  },
  methods: {
    updateDate: function (date) {
      this.$emit("update:modelValue", date)
    },
  },
}
</script>
