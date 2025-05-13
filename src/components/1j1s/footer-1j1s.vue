<template>
  <footer id="footer" class="fr-footer" role="contentinfo">
    <div class="fr-container">
      <div class="fr-footer__body">
        <div class="fr-footer__brand fr-enlarge-link">
          <p class="fr-logo fr-text--preformated">{{
            parameters.logoText.join(" \n")
          }}</p>
          <a
            v-if="parameters.logoImage"
            class="fr-footer__brand-link"
            :href="parameters.logoLink"
            :title="parameters.logoLabel"
          >
            <img
              class="fr-footer__logo"
              style="width: 3.5rem"
              :src="parameters.logoImage"
              :alt="parameters.logoImageAlt"
            />
          </a>
        </div>
        <div class="fr-footer__content">
          <p class="fr-footer__content-desc">{{ parameters.descText }}</p>
          <ul class="fr-footer__content-list">
            <li
              v-for="link in parameters.ecosystemLinks"
              :key="link.label"
              class="fr-footer__content-item"
            >
              <a
                class="fr-footer__content-link"
                :href="link.href"
                :title="`${link.label} - nouvelle fenêtre`"
                target="_blank"
                rel="noopener"
                >{{ link.label }}</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="fr-footer__bottom">
        <ul class="fr-footer__bottom-list">
          <li
            v-for="link in parameters.accessLinks"
            :key="link.label"
            class="fr-footer__bottom-item"
          >
            <router-link class="fr-footer__bottom-link" :to="link.to">{{
              link.label
            }}</router-link>
          </li>
        </ul>
        <div class="fr-footer__bottom-copy">
          <p
            >© 2025 MAAS Group - Simulateur d'aides sociales. Tous droits réservés.
            <br>Basé sur le simulateur officiel <a
              href="https://mes-aides.1jeune1solution.beta.gouv.fr"
              target="_blank"
              >mes-aides.1jeune1solution.beta.gouv.fr</a
            >
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const parameters = {
  logoText: [
    "MAAS Group",
    "Simulateur",
    "d'aides sociales",
  ],
  logoImage: "/img/maas-group-logo.svg",
  logoImageAlt: "MAAS Group",
  logoLabel: "Retour à l'accueil du site - MAAS Group - Simulateur d'aides sociales",
  logoLink: "/",
  descText:
    "MAAS Group - Simulateur d'aides sociales\nNotre simulateur vous permet d'évaluer vos droits aux aides sociales et de sauvegarder vos simulations pour un suivi personnalisé.",
  ecosystemLinks: [
    {
      label: "MAAS Group - Site officiel",
      href: "#",
    },
    {
      label: "Nos services",
      href: "#",
    },
    {
      label: "Simulateur officiel",
      href: "https://mes-aides.1jeune1solution.beta.gouv.fr",
    },
    {
      label: "Ressources",
      href: "#",
    },
  ],
  accessLinks: [
    { label: "Conditions générales d'utilisation", to: "/cgu" },
    { label: "Mentions légales", to: "/mentions-legales" },
    { label: "Données personnelles", to: "/confidentialite" },
    { label: "Toutes les aides", to: "/aides" },
    { label: "Mes simulations", to: "/suivi" },
    { label: "Simulateur officiel", to: "https://mes-aides.1jeune1solution.beta.gouv.fr" },
    { label: "Foire aux questions", to: "/faq" },
    { label: "Nous contacter", to: "/contact" },
  ],
}
</script>
