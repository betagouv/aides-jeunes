<script setup>
import { ref } from "vue"

const showMenu = ref(false)
const openedIndex = ref(null)
const vite1jeune1solutionUrl = process.env.VITE_1J1S_URL
const menu = ref([
  {
    label: "Offres",
    expanded: false,
    submenus: [
      {
        label: "Emplois",
        href: `emplois`,
      },
      {
        label: "Stages",
        href: `stages`,
      },
      {
        label: "Contrats d'alternance",
        href: `apprentissage`,
      },
      {
        label: "Jobs étudiants",
        href: "jobs-etudiants",
      },
      {
        label: "Emplois en Europe",
        href: "europe",
      },
    ],
  },
  {
    label: "Formation et orientation",
    href: "https://www.1jeune1solution.gouv.fr/formations?utm_source=mes-aides-beta&utm_medium=menu",
    expanded: false,
    submenus: [
      {
        label: "Formations",
        href: "formations",
      },
      {
        label: "Découvrir les métiers",
        href: "découvrir-les-métiers",
      },
      {
        label: "Participer à un évênement",
        href: "evenements",
      },
    ],
  },
  {
    label: "Aides et accompagnement",
    href: "/",
    expanded: false,
    submenus: [
      {
        label: "Contrat Engagement Jeune",
        href: "contrat-engagement-jeune",
      },
      {
        label: "Mes aides financières",
        href: "mes-aides",
        active: true,
      },
      {
        label: "Mes aides au logement",
        href: "logements/aides-logement",
      },
      {
        label: "Le mentorat",
        href: "mentorat",
      },
      {
        label: "Je crée mon CV personnalisé",
        href: "creer-mon-cv",
      },
      {
        label: "Accompagnement",
        href: "accompagnement",
      },
      {
        label: "Les mesures jeunes",
        href: "espace-jeune",
      },
    ],
  },
  {
    label: "Engagement",
    href: "https://www.1jeune1solution.gouv.fr/engagement?utm_source=mes-aides-beta&utm_medium=menu",
    expanded: false,
    submenus: [
      {
        label: "Le service civique",
        href: "service-civique",
      },
      {
        label: "Le bénévolat",
        href: "benevolat",
      },
    ],
  },
])

const expandMenu = (index) => {
  if (index != null) {
    openedIndex.value = index
    menu.value[index].expanded = !menu.value[index].expanded
  } else {
    openedIndex.value = null
  }
  menu.value.forEach((item, i) => {
    if (i !== index) {
      item.expanded = false
    }
  })
}
</script>

<template>
  <header role="banner" class="aj-1j1s-header">
    <div class="aj-1j1s-header-logo-container">
      <div class="container">
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
        <ul class="ul-menu">
          <div class="menu-col-left">
            <li class="li-item-left">
              <div href="/" class="menu-item">Accueil</div>
            </li>
            <li
              v-for="(item, index) in menu"
              :key="`menu-item-${index}`"
              :class="{
                'last-item': index === menu.length - 1,
                active: item.href === '/',
              }"
            >
              <div class="menu-item" tabindex="0" @click="expandMenu(index)">
                <div>{{ item.label }}</div>
                <div>
                  <svg
                    width="24"
                    height="24"
                    class="Header_subNavItemIcon__3ZdNn icon_size__Voigr"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    :class="item.expanded ? 'svg-rotate' : ''"
                  >
                    <path
                      d="M12 13.5797L16.95 8.62971L18.364 10.0437L12 16.4077L5.63599 10.0437L7.04999 8.62971L12 13.5797Z"
                    ></path>
                  </svg>
                </div>
              </div>
              <ul
                v-if="menu[index].expanded && menu[index].submenus.length > 0"
                class="menu-item-submenus"
              >
                <li
                  v-for="(submenu, subindex) in menu[index].submenus"
                  :key="`menu-item-${index}-submenu-${subindex}`"
                >
                  <a
                    class="menu-item-submenu"
                    :class="submenu.active ? 'active' : ''"
                    :href="`${vite1jeune1solutionUrl}/${submenu.href}`"
                    >{{ submenu.label }}</a
                  >
                </li>
              </ul>
            </li>
          </div>
          <div class="menu-col-right">
            <li class="li-item-right">
              <div class="menu-item">
                <span>Je suis employeur</span>
                <svg
                  width="24"
                  height="24"
                  fill="#fff"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M12 13.5797L16.95 8.62971L18.364 10.0437L12 16.4077L5.63599 10.0437L7.04999 8.62971L12 13.5797Z"
                  ></path>
                </svg>
              </div>
            </li>
          </div>
        </ul>
      </div>
    </nav>
  </header>
</template>
