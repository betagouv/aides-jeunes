<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button v-on:click="update">Update</button>
    <p>value: {{value ? 1 : 0}}</p>
    <p v-if="value">v-if="value"</p>
    <p v-if="isOK()">v-if="isOK()"</p>
  </div>
</template>

<script>
export default {
  name: 'FoyerRecap',
  data: function () {
    return {
      value: true
    }
  },
  methods: {
    update: function() {
      this.value = ! this.value;
    },
    isOK: function() {
      return this.value
    }
  }
}
</script>
