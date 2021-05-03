<template>
  <header class="aj-1j1s-header">
    <div class="aj-1j1s-header-logo-container">
      <div class="container">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 26 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          fit=""
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
          @click="toggleShowMenu()"
        >
          <title>Logo bouton menu</title>
          <rect
            x="26"
            width="2"
            height="26"
            rx="1"
            transform="rotate(90 26 0)"
            fill="currentColor"
          />
          <rect
            x="26"
            y="8"
            width="2"
            height="26"
            rx="1"
            transform="rotate(90 26 8)"
            fill="currentColor"
          />
          <rect
            x="26"
            y="16"
            width="2"
            height="26"
            rx="1"
            transform="rotate(90 26 16)"
            fill="currentColor"
          />
        </svg>
        <div
          class="aj-1j1s-header-left-links"
          :class="{ 'not-home': $route.name !== 'home' }"
        >
          <a href="https://www.1jeune1solution.gouv.fr" class="rf-link">
            <img
              class="rf"
              alt="Logo République Française"
              src="@/../public/img/logo_rf.svg"
            />
          </a>
          <a href="https://www.1jeune1solution.gouv.fr" class="fr-link">
            <img
              class="fr"
              alt="Logo 1 jeune 1 solution France Relance"
              src="@/../public/img/logo1j1s-france-relance.svg"
            />
          </a>
        </div>

        <div class="aj-1j1s-header-right-links">
          <router-link
            class="button outline is-not-mobile"
            to="/"
            v-if="$route.name !== 'home'"
            >Retour à l'accueil du simulateur</router-link
          >
          <router-link
            class="button outline is-mobile"
            to="/"
            v-if="$route.name !== 'home'"
            >Accueil</router-link
          >
        </div>
      </div>
    </div>
    <nav class="aj-1j1s-header-menu" :class="{ show: showMenu }">
      <div class="container">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          fit=""
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
          @click="toggleShowMenu()"
        >
          <rect
            x="16.7"
            width="1.8"
            height="23.6"
            rx="0.9"
            transform="rotate(45 16.7 0)"
            fill="currentColor"
          />
          <rect
            y="1.3"
            width="1.8"
            height="23.6"
            rx="0.9"
            transform="rotate(-45 0 1.3)"
            fill="currentColor"
          />
        </svg>
        <ul>
          <li class="home-link">
            <a href="/">Accueil</a>
          </li>
          <li
            v-for="(item, index) in menu"
            v-bind:key="item.key"
            :class="{ 'last-item': index === menu.length - 1 }"
          >
            <a :href="item.href">
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header1J1S",
  data() {
    return {
      showMenu: false,
      menu: [
        {
          key: "1",
          label: "Je postule à un job",
          href: "https://www.1jeune1solution.gouv.fr/emplois?utm_source=mes-aides-beta&utm_medium=menu",
        },
        {
          key: "2",
          label: "Je participe à un évenement",
          href: "https://www.1jeune1solution.gouv.fr/evenements?utm_source=mes-aides-beta&utm_medium=menu",
        },
        {
          key: "3",
          label: "Je consulte les mesures",
          href: "https://www.1jeune1solution.gouv.fr/espace-jeune?utm_source=mes-aides-beta&utm_medium=menu",
        },
        {
          key: "4",
          label: "Les entreprises s'engagent",
          href: "https://www.1jeune1solution.gouv.fr/entreprises?utm_source=mes-aides-beta&utm_medium=menu",
        },
        {
          key: "5",
          label: "Je recrute !",
          href: "https://www.1jeune1solution.gouv.fr/je-recrute?utm_source=mes-aides-beta&utm_medium=menu",
        },
      ],
    }
  },
  methods: {
    toggleShowMenu() {
      this.showMenu = !this.showMenu
    },
  },
}
</script>
