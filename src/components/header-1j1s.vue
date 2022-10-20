<template>
  <header
    role="banner"
    class="fr-header"
  >
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <p class="fr-logo fr-text--preformated">
                  {{ logoText.join(" \n") }}
                </p>
              </div>
              <div class="fr-header__navbar">
                <button
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
              <a
                :href="homeTo"
                :title="homeTitle"
              >
                <p class="fr-header__service-title">
                  {{ serviceTitle }}
                </p>
              </a>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul
                v-if="$route.name !== 'home'"
                class="fr-btns-group"
              >
                <li
                  v-for="quickLink in quickLinks"
                  :key="quickLink"
                >
                  <router-link
                    class="fr-btn"
                    :to="quickLink.path"
                  >{{
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
        <Navigation />
      </div>
    </div>
  </header>
</template>
<script setup>
import Navigation from "@/components/navigation.vue"
const homeTo =
  "https://www.1jeune1solution.gouv.fr/?utm_source=mes-aides-beta&utm_medium=menu"
const homeTitle =
  "Retour à l’accueil du site - 1jeune1solution - République Française"
const serviceTitle = "1jeune1solution"
const logoText = ["République", "Française"]
const quickLinks = [
  {
    label: "Retour à l'accueil du simulateur",
    path: "/",
  },
]
const navItems = [
  {
    to: "/",
    text: "Accueil",
  },
]
</script>
