<template>
  <header role="banner" class="fr-header">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <p class="fr-logo fr-text--preformated">
                  {{ parameters.logoText.join(" \n") }}
                </p>
              </div>
              <div class="fr-header__navbar">
                <button
                  v-if="!attributes?.collapse || $route.name !== 'home'"
                  class="fr-btn--menu fr-btn"
                  data-fr-opened="false"
                  aria-controls="modal-499"
                  aria-haspopup="menu"
                  id="button-500"
                  title="Menu"
                >
                  Menu
                </button>
              </div>
            </div>
            <div class="fr-header__service">
              <a :href="parameters.homeTo" :title="parameters.homeTitle">
                <p class="fr-header__service-title">
                  {{ parameters.serviceTitle }}
                </p>
              </a>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul v-if="$route.name !== 'home'" class="fr-btns-group">
                <li v-for="quickLink in parameters.quickLinks" :key="quickLink">
                  <router-link class="fr-btn" :to="quickLink.path">{{
                    quickLink.label
                  }}</router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="fr-header__menu fr-modal"
      id="modal-499"
      aria-labelledby="button-500"
    >
      <div class="fr-container">
        <button
          class="fr-btn--close fr-btn"
          aria-controls="modal-499"
          title="Fermer"
        >
          Fermer
        </button>
        <div class="fr-header__menu-links"> </div>
        <Navigation v-if="!attributes?.collapse" />
      </div>
    </div>
  </header>
</template>
<script setup>
import { useAttrs } from "vue"
import Navigation from "@/components/navigation.vue"
const attributes = useAttrs()
const parameters = {
  homeTo:
    "https://www.1jeune1solution.gouv.fr/?utm_source=mes-aides-beta&utm_medium=menu",
  homeTitle:
    "Retour à l’accueil du site - 1jeune1solution - République Française",
  serviceTitle: "1jeune1solution",
  logoText: ["République", "Française"],
  quickLinks: [
    {
      label: "Retour à l'accueil du simulateur",
      path: "/",
    },
  ],
}
</script>
