<script setup>
import { ref } from "vue"

const showMenu = ref(false)
const menu = ref([
  {
    label: "Offres",
    href: "https://www.1jeune1solution.gouv.fr/emplois?utm_source=mes-aides-beta&utm_medium=menu",
    expanded: false,
    submenus: [
      {
        label: "Emplois",
        href: "",
      },
      {
        label: "Stages",
        href: "",
      },
      {
        label: "Contrats d'alternance",
        href: "",
      },
      {
        label: "Jobs étudiants",
        href: "",
      },
      {
        label: "Emplois en Europe",
        href: "",
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
        href: "",
      },
      {
        label: "Découvrir les métiers",
        href: "",
      },
      {
        label: "Participer à un évênement",
        href: "",
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
        href: "",
      },
      {
        label: "Mes aides financières",
        href: "",
        active: true,
      },
      {
        label: "Mes aides au logement",
        href: "",
      },
      {
        label: "Le mentorat",
        href: "",
      },
      {
        label: "Je crée mon CV personnalisé",
        href: "",
      },
      {
        label: "Accompagnement",
        href: "",
      },
      {
        label: "Les mesures jeunes",
        href: "",
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
        href: "",
      },
      {
        label: "Le bénévolat",
        href: "",
      },
    ],
  },
])

const expandMenu = (index) => {
  if (index != null) {
    menu.value[index].expanded = !menu.value[index].expanded
  }
  menu.value.forEach((item, i) => {
    if (i !== index) {
      item.expanded = false
    }
  })
}

const handleFocusOut = () => {
  expandMenu(null)
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
              <div
                class="menu-item"
                tabindex="0"
                @click="expandMenu(index)"
                @focusout="handleFocusOut"
              >
                <span>{{ item.label }}</span>
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
              <ul
                v-if="menu[index].expanded && menu[index].submenus.length > 0"
                class="menu-item-submenus"
              >
                <li
                  v-for="(submenu, subindex) in menu[index].submenus"
                  :key="`menu-item-${index}-submenu-${subindex}`"
                >
                  <a
                    :href="submenu.href"
                    class="menu-item-submenu"
                    :class="submenu.active ? 'active' : ''"
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
