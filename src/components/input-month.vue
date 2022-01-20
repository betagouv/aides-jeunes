<template>
  <InputDate
    v-model="date"
    date-type="month"
    @input="$emit('update:modelValue', date)"
  />
</template>

<script>
//This component is a simple sugar for InputDate.
import InputDate from "@/components/input-date"

export default {
  name: "InputMonth",
  components: {
    InputDate,
  },
  props: {
    modelValue: Date,
  },
  emits: ["update:modelValue"],
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
