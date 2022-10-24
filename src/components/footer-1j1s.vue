<template>
  <p class="aj-1j1s-pre-footer"
    >Une initiative du Gouvernement pour accompagner, former, et faciliter
    l’entrée dans la vie professionnelle de tous les jeunes de 15 à 30 ans, sur
    tous les territoires.</p
  >
  <footer class="aj-1j1s-footer" role="contentInfo">
    <div class="aj-1j1s-footer__container">
      <div class="aj-1j1s-footer__section aj-1j1s-footer__section--logo">
        <div
          class="aj-1j1s-footer__logo-container aj-1j1s-footer__logo-container--republique"
        >
          <img alt="drapeau" class="rf" src="/img/mariane_no_text.svg" />
          <span class="aj-1j1s-footer__republique-logo-text">
            Ministère du travail, de l'emploi et de l'insertion
          </span>
          <img alt="liberté égalité fraternité" src="/img/devise.svg" />
        </div>
        <div
          class="aj-1j1s-footer__logo-container aj-1j1s-footer__logo-container--relance"
        >
          <img alt="logo france relance" src="/img/france-relance.svg" />
        </div>
      </div>
      <div class="aj-1j1s-footer__section aj-1j1s-footer__section--messages">
        <span>#1jeune1solution</span>
        <p
          >Une initiative du Gouvernement pour accompagner, former, et faciliter
          l’entrée dans la vie professionnelle de tous les jeunes de 15 à 30
          ans, sur tous les territoires.</p
        >
        <ul class="aj-1j1s-footer__external-link-list">
          <li
            v-for="link in externalLinks"
            :key="link.label"
            class="aj-1j1s-footer__external-link-list-item"
          >
            <a
              :href="link.href"
              class="aj-1j1s-footer__external-link"
              target="_blank"
            >
              {{ link.label }}
              <i aria-hidden="true" class="ri-share-box-line ri"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="aj-1j1s-footer__bottom-container">
      <template v-for="(item, index) in menu" :key="index">
        <a
          :class="item.class"
          :href="item.href"
          class="aj-1j1s-footer__internal-link"
          @click="toggleShowItem(item)"
        >
          {{ item.label }}
          <i
            v-if="item.newTab"
            aria-hidden="true"
            class="ri-share-box-line ri"
          ></i>
        </a>
      </template>
      <div class="aj-1j1s-footer__legal">
        Sauf mention contraire, tous les contenus de ce site sont sous
        licence&nbsp;
        <a
          class="aj-1j1s-footer__license-link"
          href="https://www.etalab.gouv.fr/wp-content/uploads/2017/04/ETALAB-Licence-Ouverte-v2.0.pdf"
          rel="noreferrer"
          target="_blank"
        >
          <span class="TextIcon_textIcon__fq9Gn">etalab-2.0 </span>
          <i aria-hidden="true" class="ri-share-box-line"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterJ1S",
  data() {
    return {
      menu: [
        {
          label: "Plan du site",
          href: "/plan-du-site",
        },
        {
          label: "CGU & Mentions légales",
          href: "/cgu",
        },
        {
          label: "Accessibilité (non conforme)",
          href: "/accessibilite",
        },
        {
          label: "Politique de confidentialité",
          href: "/confidentialite",
        },
        {
          label: "Nous contacter",
          href: "mailto:contact-1j1s@sg.social.gouv.fr",
          class: "aj-1j1s-footer__internal-link--email",
          newTab: true,
        },
      ],
      externalLinks: [
        {
          label: "legifrance.gouv.fr",
          href: "https://www.legifrance.gouv.fr/",
        },
        {
          label: "gouvernement.fr",
          href: "https://www.gouvernement.fr/",
        },
        {
          label: "service-public.fr",
          href: "https://www.service-public.fr/",
        },
        {
          label: "data.gouv.fr",
          href: "https://www.data.gouv.fr/",
        },
        {
          label: "france.fr",
          href: "https://www.france.fr/fr",
        },
      ],
    }
  },
  methods: {
    toggleShowItem(item) {
      item.show = !item.show
    },
  },
}
</script>
