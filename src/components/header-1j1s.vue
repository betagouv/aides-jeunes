<script setup>
import { ref } from "vue"

const showMenu = ref(false)
const menu = ref([
  {
    key: "1",
    label: "Accueil",
    href: "https://www.1jeune1solution.gouv.fr/",
  },
  {
    key: "1",
    label: "Offres",
    href: "https://www.1jeune1solution.gouv.fr/emplois?utm_source=mes-aides-beta&utm_medium=menu",
  },
  {
    key: "2",
    label: "Formation et orientation",
    href: "https://www.1jeune1solution.gouv.fr/formations?utm_source=mes-aides-beta&utm_medium=menu",
  },
  {
    key: "3",
    label: "Aides et accompagnement",
    href: "/",
  },
  {
    key: "4",
    label: "Engagement",
    href: "https://www.1jeune1solution.gouv.fr/engagement?utm_source=mes-aides-beta&utm_medium=menu",
  },
  {
    key: "5",
    label: "Je suis un employeur",
    href: "https://www.1jeune1solution.gouv.fr/je-recrute?utm_source=mes-aides-beta&utm_medium=menu",
  },
])

const toggleShowMenu = () => {
  showMenu.value = !showMenu.value
}
</script>

<template>
  <header role="banner" class="aj-1j1s-header">
    <div class="aj-1j1s-header-logo-container">
      <div class="container">
        <div>
          <svg
            width="26"
            height="18"
            viewBox="0 0 18 26"
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
        </div>
        <div
          class="aj-1j1s-header-left-links"
          :class="{ 'not-home': $route.name !== 'home' }"
        >
          <a
            href="https://www.1jeune1solution.gouv.fr?utm_source=mes-aides-beta&utm_medium=menu"
            class="rf-link"
          >
            <img
              class="rf"
              alt="Accueil 1 jeune 1 solution"
              src="/img/logo_rf.svg"
            />
          </a>
          <a
            href="https://www.1jeune1solution.gouv.fr?utm_source=mes-aides-beta&utm_medium=menu"
            class="aj-1j1s-header-title"
          >
            1jeune1solution
          </a>
        </div>

        <div class="aj-1j1s-header-right-links">
          <router-link
            v-if="$route.name !== 'home'"
            class="button outline is-not-mobile"
            to="/"
          >
            Retour à l'accueil du simulateur
          </router-link>
          <router-link
            v-if="$route.name !== 'home'"
            class="button outline is-mobile"
            to="/"
          >
            Accueil
          </router-link>
        </div>
      </div>
    </div>
    <nav
      role="navigation"
      class="aj-1j1s-header-menu"
      :class="{ show: showMenu }"
    >
      <div class="container">
        <svg
          width="18"
          height="18"
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
            :key="item.key"
            :class="{
              'last-item': index === menu.length - 1,
              active: item.href === '/',
            }"
          >
            <a :href="item.href" class="menu-item">
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.menu-item:hover {
  text-decoration: underline;
  cursor: pointer;
}

.aj-1j1s-header-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #000;
  text-decoration: none;
  font-family: Marianne, arial, sans-serif;
}
</style>
