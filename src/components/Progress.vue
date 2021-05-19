<template>
  <div class="aj-debug-progress">
    <h3 class="aj-question">Parcours complet</h3>
    <button
      v-if="!showInactiveRoutes"
      class="button small"
      @click="showInactiveRoutes = true"
      >Afficher les étapes cachées</button
    >
    <button
      v-if="showInactiveRoutes"
      class="button small"
      @click="showInactiveRoutes = false"
      >N'afficher que les étapes actives</button
    >
    <ul class="list-unstyled no-padding">
      <li
        v-for="step in full"
        v-bind:key="step.key || step.path"
        :class="{ 'hide-route': !showInactiveRoutes && !step.isActive }"
      >
        <router-link
          v-bind:class="{
            inactive: !step.isActive,
            current: step.path == current,
          }"
          v-bind:to="step.path"
          >{{ step.path }}</router-link
        >
        <abbr
          v-if="step.missing"
          title="Cette page n'existe pas encore dans le router."
          >🚧</abbr
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Progress",
  data() {
    return {
      showInactiveRoutes: true,
    }
  },
  computed: {
    full: function() {
      return this.$store.getters.getAllSteps.map(s => {
        if (process.env.NODE_ENV === 'production') {
          return s
        } else {
          const { route } = this.$router.resolve(s.path)
          return {
            key: s.key,
            isActive: s.isActive,
            path: s.path,
            missing:
              route.matched[route.matched.length - 1].path.match(/:property/),
          }
        }
      })
    },
    current: function () {
      return this.$route.path
    },
  },
}
</script>

<style type="text/css">
.aj-debug-progress a:not(.inactive),
.aj-debug-progress a:not(.inactive):active,
.aj-debug-progress a:not(.inactive):visited {
  color: var(--green);
}
.inactive,
.inactive:active,
.inactive:visited {
  text-decoration: line-through;
}
.current {
  font-weight: bold;
}

.hide-route {
  display: none;
}
</style>
