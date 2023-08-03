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
            >Sauf mention contraire, tous les contenus de ce site sont sous
            <a
              href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
              target="_blank"
              >licence etalab-2.0</a
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
    "Ministère ",
    "du travail, ",
    "du plein emploi ",
    "et de l'insertion",
  ],
  logoImage: "/img/france-relance.svg",
  logoImageAlt: "France Relance",
  logoLabel:
    "Retour à l’accueil du site - France Relance - Ministère du Travail, de l’Emploi et de l’Insertion",
  logoLink:
    "https://www.1jeune1solution.gouv.fr/?utm_source=mes-aides-beta&utm_medium=menu",
  descText:
    "#1jeune1solution\nUne initiative du Gouvernement pour accompagner, former, et faciliter l’entrée dans la vie professionnelle de tous les jeunes de 15 à 30 ans, sur tous les territoires.",
  ecosystemLinks: [
    {
      label: "legifrance.gouv.fr",
      href: "https://legifrance.gouv.fr",
    },
    {
      label: "gouvernement.fr",
      href: "https://gouvernement.fr",
    },
    {
      label: "service-public.fr",
      href: "https://service-public.fr",
    },
    {
      label: "data.gouv.fr",
      href: "https://data.gouv.fr",
    },
    { label: "france.fr", href: "https://www.france.fr/" },
  ],
  accessLinks: [
    { label: "Accessibilité : partiellement conforme", to: "/accessibilite" },
    { label: "Conditions générales d’utilisation", to: "/cgu" },
    { label: "Mentions légales", to: "/mentions-legales" },
    { label: "Données personnelles", to: "/confidentialite" },
    { label: "Statistiques", to: "/stats" },
    { label: "Toutes les aides", to: "/aides" },
    { label: "Nous contacter", to: "/contact" },
  ],
}
</script>
