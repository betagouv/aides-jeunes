<script setup>
import dayjs from "dayjs"
import { defineEmits, defineProps, ref, watch, computed } from "vue"
import { useDateValidation } from "@/composables/useDateValidation.ts"

const emit = defineEmits([
  "date-error-validation",
  "remove-date-error-validation",
  "update:modelValue",
])

const props = defineProps({
  id: String,
  modelValue: [Date, String],
  //dateType should be "date" for a DD-MM-YYY date input and "month" for MM-YYYY
  dateType: {
    type: String,
    default: "date",
  },
})

const { day, month, year, dayValidation, monthValidation, yearValidation } =
  useDateValidation()

const inputMonthRef = ref("")
const inputYearRef = ref("")

day.value =
  props.dateType === "date"
    ? props.modelValue && dayjs(props.modelValue).format("DD")
    : "01"
month.value = props.modelValue && dayjs(props.modelValue).format("MM")
year.value = props.modelValue && dayjs(props.modelValue).format("YYYY")

const lastCharChanged = (to = "", from = "") => {
  if (!from && to) return true
  if (!from && !to) return false
  if (to.length == 2 && to.length != from.length) {
    return true
  } else {
    return to.length == 2 ? to.slice(-1) != from.slice(-1) : false
  }
}

watch(day, (newValue, oldValue) => {
  emit("remove-date-error-validation")
  if (
    newValue.match(/^(0?[1-9]|[12][0-9]|3[01])$/) &&
    lastCharChanged(newValue, oldValue)
  ) {
    inputMonthRef.value.focus()
  }
  update()
})
watch(month, (newValue, oldValue) => {
  emit("remove-date-error-validation")
  if (
    newValue.match(/^(0?[1-9]|1[012])$/) &&
    lastCharChanged(newValue, oldValue)
  ) {
    inputYearRef.value.focus()
  }
  update()
})
watch(year, () => {
  emit("remove-date-error-validation")
  update()
})

const update = () => {
  const dt = dayjs(date.value, "YYYY-MM-DD", true)
  if (!dayValidation() || !monthValidation() || !yearValidation()) {
    emit(
      "date-error-validation",
      "La date n'est pas valide (format accepté : JJ | MM | AAAA)"
    )
  }
  if (
    dt.isValid() &&
    dt.isAfter(dayjs("1900-01-01", "YYYY-MM-DD", true)) &&
    dt.isBefore(dayjs()) &&
    dayValidation() &&
    monthValidation() &&
    yearValidation()
  ) {
    emit("remove-date-error-validation")
    emit("update:modelValue", dt.toDate())
  } else {
    emit("update:modelValue", undefined)
  }
}

const date = computed(() => {
  return `${year.value}-${month.value}-${day.value}`
})

const firstId = computed(() => {
  const uniqueFieldName = `id.${Math.random().toString(36).slice(2)}`
  return props.id || uniqueFieldName
})

const showDay = computed(() => {
  return props.dateType === "date"
})
</script>

<template>
  <div class="aj-input-date">
    <div v-if="showDay" class="aj-input-date-component day">
      <label class="aj-date-label">jour</label>
      <input
        :id="firstId"
        ref="dayRef"
        v-model="day"
        v-select-on-click
        :data-testid="firstId"
        type="text"
        inputmode="numeric"
        data-type="number"
        pattern="[0-9]*"
        autofocus
        aria-label="Jour"
        placeholder="JJ"
        min="1"
        max="31"
      />
    </div>
    <div class="aj-input-date-component month">
      <label class="aj-date-label">mois</label>
      <input
        ref="inputMonthRef"
        v-model="month"
        v-select-on-click
        type="text"
        inputmode="numeric"
        data-type="number"
        pattern="[0-9]*"
        aria-label="Mois"
        placeholder="MM"
        min="1"
        max="12"
      />
    </div>
    <div class="aj-input-date-component year">
      <label class="aj-date-label">année</label>
      <input
        ref="inputYearRef"
        v-model="year"
        v-select-on-click
        type="text"
        inputmode="numeric"
        data-type="number"
        pattern="[0-9]*"
        class="year"
        aria-label="Année"
        placeholder="AAAA"
        min="1900"
      />
    </div>
  </div>
</template>
