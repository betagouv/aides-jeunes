<template>
  <div>
    {{value}}
    <button v-on:click="set('1989-02-14')">SET 1989-02-14</button>
    <button v-on:click="set('2000-02-14')">SET 2000-02-14</button>
  </div>
</template>

<script>
export default {
  name: 'InputDate',
  props: {
    value: Date,
  },
  methods: {
    set: function(date) {
      this.$emit('input', new Date(date))
    },
  }
}
</script>
