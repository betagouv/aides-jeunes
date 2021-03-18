<template>
  <div>
    <p class="notification warning" v-if="error">
      {{ error }}
    </p>
    <div class="aj-actions">
        <button class="button" type="submit" v-show="onSubmit" v-on:click="localOnSubmit($event)">Suivant</button>
        <slot></slot>
        <button class="button secondary" type="button" v-on:click="window && window.history.back()">Précédent</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Actions',
  props: [
    'onSubmit',
  ],
  data() {
    return {
      window
    }
  },
  computed: {
    error() {
      return this.$store.state.error
    }
  },
  methods: {
    localOnSubmit: function(event) {
      event.preventDefault()
      this.onSubmit()
    },
    goBack: function() {
      window && window.history.back()
    }
  }
}
</script>

<style type="text/css">
</style>
