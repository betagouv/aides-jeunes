<template>
  <div>
    <nav
      class="fr-nav"
      role="navigation"
      aria-label="Menu principal"
      tabindex="-1"
    >
      <ul class="fr-nav__list">
        <li class="fr-nav__item">
          <router-link to="/" class="fr-nav__link">Accueil</router-link>
        </li>
        <li class="fr-nav__item">
          <router-link to="/mentions-legales" class="fr-nav__link"
            >Mentions légales</router-link
          >
        </li>
      </ul>
    </nav>
  </div>
</template>
