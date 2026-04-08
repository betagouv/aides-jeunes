<template>
  <nav
    class="fr-sidemenu fr-sidemenu--sticky-full-height"
    role="navigation"
    aria-label="Menu contribution"
  >
    <p class="fr-sidemenu__title">Contribuer au simulateur</p>
    <ul class="fr-sidemenu__list">
      <li class="fr-sidemenu__item">
        <router-link
          class="fr-sidemenu__link"
          to="/contribuer"
          :aria-current="ariaCurrent('/contribuer')"
        >
          Ajouter une aide
        </router-link>
      </li>
      <li class="fr-sidemenu__item">
        <router-link
          class="fr-sidemenu__link"
          to="/contribuer/institution"
          :aria-current="ariaCurrent('/contribuer/institution')"
        >
          Ajouter une institution
        </router-link>
      </li>
      <li class="fr-sidemenu__item">
        <router-link
          class="fr-sidemenu__link"
          to="/contribuer/aides"
          :aria-current="ariaCurrent('/contribuer/aides')"
        >
          Voir la liste des aides
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"

const route = useRoute()

function ariaCurrent(path: string) {
  return route.path === path ? "page" : undefined
}
</script>
