<template>
  <div>
    <h2>Récapitulatif de votre simulation</h2>
    <h3>Parcours complet</h3>
    <ul>
      <li v-for="(step) in full" v-bind:key="step.key || step.route">
        <router-link v-bind:class="{ inactive: !step.isActive, current: step.route == current}" v-bind:to="step.route" >{{step.route}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Progress',
  computed: {
    full: function() {
      const start = '/' || this.$route
      return this.$state.full(start, this.$store.state.situation, this.$router)
    },
    active: function() {
      return this.full.filter(s => s.isActive)
    },
    current: function() {
      return this.$route.fullPath
    },
    next: function() {
      return this.$state.full(this.$route, this.$store.state.situation, this.$router)
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
