<template>
  <footer class="aj-1j1s-footer">
    <div class="container">
      <div class="aj-1j1s-footer-logo-container">
        <img
          class="rf"
          alt="Logo République Française"
          src="@/../public/img/logo_rf.svg"
        />
        <img
          class="fr"
          alt="Logo 1 jeune 1 solution France relance"
          src="@/../public/img/logo1j1s-france-relance.svg"
        />
      </div>
      <div
        v-for="(item, index) in menu"
        :key="index"
        class="aj-1j1s-footer-col"
        :class="{ show: item.show }"
      >
        <h2
          :class="{ last: index === menu.length - 1 }"
          @click="toggleShowItem(item)"
        >
          {{ item.label }}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            fit=""
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            <path
              d="M0.75 0.75L6.00005 6.00007L0.749998 11.2501"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </h2>
        <ul>
          <li v-for="(child, childIndex) in item.children" :key="childIndex">
            <a v-if="child.href" :href="child.href">{{ child.label }}</a>
            <router-link v-else :to="child.route">
              {{ child.label }}
            </router-link>
          </li>
        </ul>
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
          label: "À propos",
          show: false,
          children: [
            {
              label: "CGU & Mentions légales",
              route: "/cgu",
            },
            {
              label: "Politique de confidentialité",
              route: "/confidentialite",
            },
            {
              label: "Accessibilité",
              route: "/accessibilite",
            },
            {
              label: "Nous contacter",
              route: "/contact",
            },
            {
              label: "Statistiques",
              href: "/stats",
            },
            {
              label: "Toutes les aides",
              route: "/aides",
            },
          ],
        },
        {
          label: "Plan du site",
          show: false,
          children: [
            {
              label: "Accueil",
              href: "https://www.1jeune1solution.gouv.fr/?utm_source=mes-aides-beta&utm_medium=menu",
            },
            {
              label: "Emploi et stage",
              href: "https://www.1jeune1solution.gouv.fr/emplois?utm_source=mes-aides-beta&utm_medium=menu",
            },
            {
              label: "Orientation et formation",
              href: "https://www.1jeune1solution.gouv.fr/formations?utm_source=mes-aides-beta&utm_medium=menu",
            },
            {
              label: "Aides et accompagnement",
              href: "/",
            },
            {
              label: "Engagement et bénévolat",
              href: "https://www.1jeune1solution.gouv.fr/engagement?utm_source=mes-aides-beta&utm_medium=menu",
            },
            {
              label: "Employeur",
              href: "https://www.1jeune1solution.gouv.fr/je-recrute?utm_source=mes-aides-beta&utm_medium=menu",
            },
            {
              label: "Partenaires",
              href: "https://www.1jeune1solution.gouv.fr/partenaires?utm_source=mes-aides-beta&utm_medium=menu",
            },
          ],
        },
        {
          label: "Liens utiles",
          show: false,
          children: [
            {
              label: "Gouvernement",
              href: "https://www.gouvernement.fr/",
            },
            {
              label: "Ministère du travail, de l'emploi et de l'insertion",
              href: "https://travail-emploi.gouv.fr/",
            },
            {
              label: "Pôle emploi",
              href: "https://www.pole-emploi.fr/accueil/",
            },
            {
              label: "Annuaire des missions locales",
              href: "https://www.unml.info/les-missions-locales/annuaire/",
            },
            {
              label: "Service Civique",
              href: "https://www.service-civique.gouv.fr/",
            },
            {
              label: "France",
              href: "https://www.france.fr/fr",
            },
          ],
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
