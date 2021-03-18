<template>
  <div class="aj-actions">
    <button v-if="next" class="button" type="submit" v-show="onSubmit" v-on:click="localOnSubmit($event)">Suivant</button>
    <slot></slot>
    <button class="button secondary" type="button" v-on:click="window && window.history.back()">Précédent</button>
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
  data() {
    return {
      window
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
