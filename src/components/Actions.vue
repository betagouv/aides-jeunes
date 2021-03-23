<template>
  <div>
    <p class="notification warning" v-if="error">
      {{ error }}
    </p>
    <div class="actions">
      <button class="button large" type="submit" v-show="onSubmit" v-on:click="localOnSubmit($event)">Valider</button>
      <slot></slot>
      <button class="button secondary large" type="button" v-on:click="goBack()">Précédent</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Actions',
  props: [
    'onSubmit',
  ],
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
  .actions {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
  }

</style>
