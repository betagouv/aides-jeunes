<template>
  <div class="aj-actions">
    <button v-if="next" class="button" type="submit" v-show="onSubmit" v-on:click="localOnSubmit($event)">Suivant</button>
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'Actions',
  props: {
    onSubmit: {
      type: Function,
      default() {}
    },
    next: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    localOnSubmit: function(event) {
      event.preventDefault()
      this.onSubmit()
    }
  }
}
</script>

<style type="text/css">
</style>
