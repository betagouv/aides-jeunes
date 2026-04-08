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
          :aria-current="isCurrent('/contribuer') ? 'page' : undefined"
        >
          Ajouter une aide
        </router-link>
      </li>
      <li class="fr-sidemenu__item">
        <router-link
          class="fr-sidemenu__link"
          to="/contribuer/institution"
          :aria-current="
            isCurrent('/contribuer/institution') ? 'page' : undefined
          "
        >
          Ajouter une institution
        </router-link>
      </li>
      <li class="fr-sidemenu__item">
        <router-link
          class="fr-sidemenu__link"
          to="/contribuer/aides"
          :aria-current="
            isCurrentAny(['/contribuer/aides', '/aides']) ? 'page' : undefined
          "
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

function isCurrent(path: string) {
  return route.path === path
}

function isCurrentAny(paths: string[]) {
  return paths.includes(route.path)
}
</script>
