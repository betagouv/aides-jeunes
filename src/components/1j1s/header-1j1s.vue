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
                  id="button-500"
                  class="fr-btn--menu fr-btn"
                  data-fr-opened="false"
                  aria-controls="modal-499"
                  aria-haspopup="menu"
                  title="Menu"
                >
                  Menu
                </button>
              </div>
            </div>
            <div class="fr-header__service aj-header">
              <a
                :href="parameters.homeTo"
                :title="parameters.homeTitle"
                :target="store.inIframe ? '_blank' : '_self'"
                rel="noopener"
              >
                <p class="fr-header__service-title">
                  {{ parameters.serviceTitle }}
                </p>
              </a>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul v-if="$route.name !== 'home'" class="fr-btns-group">
                <li
                  v-for="(quickLink, index) in parameters.quickLinks"
                  :key="index"
                >
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
      id="modal-499"
      class="fr-header__menu fr-modal"
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
        <slot v-if="!attributes?.collapse" />
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { useAttrs } from "vue"
import { useIframeStore } from "@/stores/iframe.js"
const store = useIframeStore()
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
      path: store.inIframe ? "/?iframe=true&data-with-logo=true" : "/",
    },
  ],
}
</script>
