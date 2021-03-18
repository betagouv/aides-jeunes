<template>
  <div>
    <h2>Récapitulatif de votre simulation</h2>
    <h3>Parcours complet</h3>
    <ul>
      <li v-for="(route) in full" v-bind:key="route.fullPath || route">
        <router-link v-bind:to="route" >{{route.fullPath || route}}</router-link>
      </li>
    </ul>

    <h3>Étape courante</h3>
    <p>{{current.fullPath}}</p>

    <h3>Étapes restantes</h3>
    <ul>
      <li v-for="(route) in next" v-bind:key="route.fullPath || route">
        <router-link v-bind:to="route" >{{route.fullPath || route}}</router-link>
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
      return this.full.filter(s => s.isActive).map(s => s.fullPath)
    },
    current: function() {
      return this.$route
    },
    next: function() {
      return this.$state.full(this.$route, this.$store.state.situation, this.$router)
    },
  }
}
</script>
