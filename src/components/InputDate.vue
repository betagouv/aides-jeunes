<template>
  <div>
    <input
      type="number"
      autofocus
      ref="day"
      aria-label="Jour"
      v-model="day"
      placeholder="23"
      min=1
      max=31 />
      /
    <input
      type="number"
      ref="month"
      aria-label="Mois"
      v-model="month"
      placeholder="02"
      min=1
      max=12 />
      /
    <input
      type="number"
      ref="year"
      aria-label="Année"
      v-model="year"
      placeholder="1973"
      min="1789"
      max="2020">
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'InputDate',
  props: {
    value: Date,
  },
  data: function() {
    return {
      auto: !this.value,
      day: this.value && moment(this.value).format('DD'),
      month: this.value && moment(this.value).format('MM'),
      year: this.value && moment(this.value).format('YYYY'),
    }
  },
  computed: {
    date: function() {
      return `${this.year}-${this.month && this.month.padStart(2, '0')}-${this.day && this.day.padStart(2, '0')}`
    }
  },
  methods: {
    emit: function($event) {
      var value = new Date($event.target.value)
      if (value) {
        this.$emit('input', value)
      }
    },
    update: function() {
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
      this.update()
    },
    month: function(to) {
      if (to && to.length == 2 && this.auto) {
        this.$refs.year.focus()
      }
      this.update()
    },
    year: function(to) {
      if (to && to.length == 4 && this.auto) {
        this.$refs.year.focus()
      }
      this.update()
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
