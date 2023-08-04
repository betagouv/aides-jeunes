<template>
  <div class="fr-container fr-px-0">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div v-if="showDay" class="fr-col-3 fr-col-sm-3 fr-col-md-2 fr-col-lg-2">
        <label class="fr-label fr-text--center" :for="firstId">
          <span class="fr-hint-text fr-mb-1v">jour</span>
          <input
            :id="firstId"
            ref="day"
            v-model="day"
            v-select-on-click
            class="fr-input"
            :data-testid="firstId"
            aria-label="Jour"
            autofocus
            data-type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="JJ"
            type="text"
            autocomplete="bday-day"
          />
        </label>
      </div>
      <div class="fr-col-3 fr-col-sm-3 fr-col-md-2 fr-col-lg-2">
        <label class="fr-label fr-text--center" for="month-input">
          <span class="fr-hint-text fr-mb-1v">mois</span>
          <input
            id="month-input"
            ref="month"
            v-model="month"
            v-select-on-click
            class="fr-input"
            aria-label="Mois"
            data-type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="MM"
            type="text"
            autocomplete="bday-month"
          />
        </label>
      </div>
      <div class="fr-col-6 fr-col-sm-4 fr-col-md-4 fr-col-lg-4">
        <label class="fr-label fr-text--center" for="year-input">
          <span class="fr-hint-text fr-mb-1v">année</span>
          <input
            id="year-input"
            ref="year"
            v-model="year"
            v-select-on-click
            class="fr-input"
            aria-label="Année"
            data-type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="AAAA"
            type="text"
            autocomplete="bday-year"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

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
          ? this.modelValue && dayjs.utc(this.modelValue).format("DD")
          : "01",
      month: this.modelValue && dayjs.utc(this.modelValue).format("MM"),
      year: this.modelValue && dayjs.utc(this.modelValue).format("YYYY"),
    }
  },
  computed: {
    date: function () {
      return `${this.year}-${this.month && this.month.padStart(2, "0")}-${
        this.day && this.day.padStart(2, "0")
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
      const dt = dayjs.utc(this.date, "YYYY-MM-DD", true)
      if (
        dt.isValid() &&
        dt.isAfter(dayjs.utc("1900-01-01", "YYYY-MM-DD", true)) &&
        dt.isBefore(dayjs.utc())
      ) {
        this.$emit("update:modelValue", dt.toDate())
      } else {
        this.$emit("update:modelValue", undefined)
      }
    },
  },
}
</script>
