<template>
  <div>
    <input type="date" v-bind:value="item" v-on:input="emit($event)" >
  </div>
</template>

<script>

export default {
  name: 'InputDate',
  props: {
    value: Date,
  },
  data: function() {
    return {
      item: this.value && this.value.toISOString().slice(0,10)
    }
  },
  methods: {
    emit: function($event) {
      var value = new Date($event.target.value)
      if (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
