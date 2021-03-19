<template>
  <div>
    <p class="notification warning" v-if="error">
      {{ error }}
    </p>
    <div class="aj-actions">
        <button v-if="next" class="button" type="submit" v-show="onSubmit" v-on:click="localOnSubmit($event)">Suivant</button>
        <slot></slot>
    </div>
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
