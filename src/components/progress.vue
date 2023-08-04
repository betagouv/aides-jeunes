<template>
  <div class="aj-debug-progress">
    <h3 class="aj-question"> Parcours complet </h3>
    <button
      v-if="!showInactiveRoutes"
      class="fr-btn fr-btn--sm"
      @click="showInactiveRoutes = true"
    >
      Afficher les étapes cachées
    </button>
    <button
      v-if="showInactiveRoutes"
      class="fr-btn fr-btn--sm"
      @click="showInactiveRoutes = false"
    >
      N'afficher que les étapes actives
    </button>
    <ul class="fr-toggle__list">
      <li
        v-for="step in full"
        :key="step.key || step.path"
        :class="{
          'aj-progress-hide-route': !showInactiveRoutes && !step.isActive,
        }"
      >
        <router-link
          :class="{
            'aj-progress-inactive-step': !step.isActive,
            'aj-progress-current-step': step.path == current,
          }"
          :to="step.path"
        >
          {{ step.path }}
        </router-link>
        <abbr
          v-if="step.missing"
          title="Cette page n'existe pas encore dans le router."
          >🚧</abbr
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/stores/index.js"

export default {
  name: "ProgressDebugger",
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    return {
      showInactiveRoutes: true,
    }
  },
  computed: {
    full() {
      return this.store.getAllSteps.map((s) => {
        if (process.env.NODE_ENV === "production") {
          return s
        } else {
          const route = this.$router.resolve(s.path)
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
    current() {
      return this.$route.path
    },
  },
}
</script>
