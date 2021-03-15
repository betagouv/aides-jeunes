<template>
  <div class="actions">
    <button class="button large" type="submit" v-show="onSubmit" v-on:click="localOnSubmit($event)">Valider</button>
    <slot></slot>
    <button class="button secondary large" type="button" v-on:click="window && window.history.back()">Précédent</button>
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
  methods: {
    localOnSubmit: function(event) {
      event.preventDefault()
      this.onSubmit()
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
