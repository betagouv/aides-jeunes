<template>
  <div class="aj-input-date">
    <div v-if="showDay" class="aj-input-date-component day">
      <label class="aj-date-label">jour</label>
      <input
        :id="firstId"
        ref="day"
        v-model="day"
        v-select-on-click
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
        ref="month"
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
        ref="year"
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

<script>
import padStart from "lodash/padStart"
import dayjs from "dayjs"

export default {
  name: "InputDate",
  props: {
    id: String,
    modelValue: [Date, String],
    //dateType should be "date" for a DD-MM-YYY date input and "month" for MM-YYYY
    dateType: {
      type: String,
      default: "date",
    },
  },
  emits: ["update:modelValue"],
  data: function () {
    return {
      day:
        this.dateType === "date"
          ? this.modelValue && dayjs(this.modelValue).format("DD")
          : "01",
      month: this.modelValue && dayjs(this.modelValue).format("MM"),
      year: this.modelValue && dayjs(this.modelValue).format("YYYY"),
    }
  },
  computed: {
    date: function () {
      return `${this.year}-${this.month && padStart(this.month, 2, "0")}-${
        this.day && padStart(this.day, 2, "0")
      }`
    },
    firstId: function () {
      const uniqueFieldName = `id.${Math.random().toString(36).slice(2)}`
      return this.id || uniqueFieldName
    },
    showDay: function () {
      return this.dateType === "date"
    },
  },
  watch: {
    day: function (to, from) {
      if (
        to.match(/^(0?[1-9]|[12][0-9]|3[01])$/) &&
        this.lastCharChanged(to, from)
      ) {
        this.$refs.month.focus()
      }
      this.update()
    },
    month: function (to, from) {
      if (to.match(/^(0?[1-9]|1[012])$/) && this.lastCharChanged(to, from)) {
        this.$refs.year.focus()
      }
      this.update()
    },
    year: function () {
      this.update()
    },
  },
  methods: {
    lastCharChanged: function (to = "", from = "") {
      if (to.length == 2 && to.length != from.length) {
        return true
      } else {
        return to.length == 2 ? to.slice(-1) != from.slice(-1) : false
      }
    },
    emit: function ($event) {
      let value = new Date($event.target.value)
      if (value) {
        this.$emit("update:modelValue", value)
      }
    },
    update: function () {
      const dt = dayjs(this.date, "YYYY-MM-DD", true)
      if (
        dt.isValid() &&
        dt.isAfter(dayjs("1900-01-01", "YYYY-MM-DD", true)) &&
        dt.isBefore(dayjs())
      ) {
        this.$emit("update:modelValue", dt.toDate())
      } else {
        this.$emit("update:modelValue", undefined)
      }
    },
  },
}
</script>
