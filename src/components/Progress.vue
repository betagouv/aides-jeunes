<template>
  <div>
    <h2>Récapitulatif de votre simulation</h2>
    <h3>Parcours complet</h3>
    <ul>
      <li v-for="(step) in full" v-bind:key="step.key || step.fullPath">
        <router-link v-bind:class="{ inactive: !step.isActive, current: step.fullPath == current}" v-bind:to="step.fullPath" >{{step.fullPath}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Progress',
  computed: {
    full: function() {
      return this.$state.full(this.$store.state.situation, this.$router)
    },
    current: function() {
      return this.$route.fullPath
    },
  }
}
</script>

<style type="text/css">
  .inactive {
    text-decoration: line-through;
  }
  .current {
    font-weight: bold;
  }
</style>
