<template>
  <div>
    <input
      type="number"
      autofocus
      v-bind:id="firstId"
      ref="day"
      aria-label="Jour"
      v-model="day"
      placeholder="23"
      v-select-on-click
      min=1
      max=31 />
      /
    <input
      type="number"
      ref="month"
      aria-label="Mois"
      v-model="month"
      placeholder="02"
      v-select-on-click
      min=1
      max=12 />
      /
    <input
      type="number"
      ref="year"
      aria-label="Année"
      v-model="year"
      placeholder="1973"
      v-select-on-click
      min="1900"
      max="2020">
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'

function stateManager(current, next) {
  if ((current.element === 'day' && current.length === 0 && next.element === 'day' && next.length === 1) ||
      (current.element === 'day' && current.length === 1 && next.element === 'day' && next.length === 2) ||
      (current.element === 'day' && current.length === 2 && next.element === 'month' && next.length === 1) ||
      (current.element === 'month' && current.length === 1 && next.element === 'month' && next.length === 2) ||
      (current.element === 'month' && current.length === 2 && next.element === 'year' && next.length === 1) ||
      (current.element === 'year' && current.length === 1 && next.element === 'year' && next.length === 2)) {
    return next
  } else {
    return false
  }
}

export default {
  name: 'InputDate',
  props: {
    id: String,
    value: Date,
  },
  data: function() {
    return {
      currentState: this.value ? 0 : { element: 'day', length: 0 },
      day: this.value && moment(this.value).format('DD'),
      month: this.value && moment(this.value).format('MM'),
      year: this.value && moment(this.value).format('YYYY'),
    }
  },
  computed: {
    auto: function() {
      return Boolean(this.currentState)
    },
    date: function() {
      return `${this.year}-${this.month && _.padStart(this.month, 2, '0')}-${this.day && _.padStart(this.day, 2, '0')}`
    },
    firstId: function() {
      const uniqueFieldName = 'id.' + Math.random().toString(36).slice(2)
      return this.id || uniqueFieldName
    }
  },
  methods: {
    emit: function($event) {
      var value = new Date($event.target.value)
      if (value) {
        this.$emit('input', value)
      }
    },
    update: function(name) {
      this.currentState = stateManager(this.currentState, { element: name, length: this[name] && this[name].length || 0 })

      const dt = moment(this.date, 'YYYY-MM-DD', true)
      if (dt.isValid()) {
        this.$emit('input', dt.toDate())
      } else {
        this.$emit('input', undefined)
      }
    }
  },
  watch: {
    day: function(to) {
      if (to && to.length == 2 && this.auto) {
        this.$refs.month.focus()
      }
      this.update('day')
    },
    month: function(to) {
      if (to && to.length == 2 && this.auto) {
        this.$refs.year.focus()
      }
      this.update('month')
    },
    year: function(to) {
      if (to && to.length == 4 && this.auto) {
        this.$refs.year.focus()
      }
      this.update('year')
    },
  }
}
</script>

<style scoped lang="css">
div {
  align-items: center;
  display: flex;
  flex-direction: row;
}
input {
  width: 5em;
}
</style>
