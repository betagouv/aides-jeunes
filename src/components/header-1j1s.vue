<script setup>
import { ref } from "vue"

const showMenu = ref(false)
const openedIndex = ref(null)
const openedSubmenuIndex = ref(null)
const showMenuModal = ref(false)
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
  {
    label: "Je suis employeur",
    expanded: false,
    childrenExpandedIndex: null,
    submenus: [
      {
        label: "Rejoindre la mobilisation",
        href: "les-entreprises-s-engagent",
      },
      {
        label: "Recruter et agir pour les jeunes",
        children: [
          {
            label: "Je recrute",
            href: "je-recrute",
          },
          {
            label: "Je deviens mentor",
            href: "je-deviens-mentor",
          },
          {
            label: "Je propose des immersions",
            href: "immersions",
          },
        ],
      },
      {
        label: "Découvrir les mesures employeur",
        href: "mesures-employeurs",
      },
      {
        label: "Accéder à mon espace",
        href: "mon-espace",
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
  openedSubmenuIndex.value = null
}

const expandChildrenSubmenu = (index, subindex) => {
  if (index != null && subindex != null) {
    if (menu.value[index].childrenExpandedIndex === subindex) {
      menu.value[index].childrenExpandedIndex = null
      openedSubmenuIndex.value = null
    } else {
      menu.value[index].childrenExpandedIndex = subindex
      openedSubmenuIndex.value = subindex
    }
  } else if (index != null && subindex == null) {
    menu.value[index].childrenExpandedIndex = null
    openedSubmenuIndex.value = null
  }
}

const submenuClick = (index, subindex, submenu) => {
  if (submenu?.href) {
    window.location.href = `${vite1jeune1solutionUrl}/${submenu.href}`
  } else {
    expandChildrenSubmenu(index, subindex)
  }
}
</script>

<template>
  <header role="banner" class="aj-1j1s-header">
    <dialog
      v-if="showMenuModal"
      class="aj-1j1s-header-modal"
      open=""
      aria-modal="true"
    >
      <div class="aj-modal-component">
        <div class="aj-modal-close">
          <div
            class="aj-modal-close-button"
            title="Fermer la modale"
            @click="showMenuModal = !showMenuModal"
          >
            <svg
              width="16"
              height="16"
              class="icon_size__Voigr"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.99999 7.05684L11.3 3.75684L12.2427 4.6995L8.94266 7.9995L12.2427 11.2995L11.3 12.2422L7.99999 8.94217L4.69999 12.2422L3.75732 11.2995L7.05732 7.9995L3.75732 4.6995L4.69999 3.75684L7.99999 7.05684Z"
              ></path>
            </svg>
            <span class="aj-modal-close-button-label">Fermer</span>
          </div>
        </div>
        <div class="aj-modal-title"
          ><svg
            width="16"
            height="16"
            class="icon_size__Voigr"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 2.6665H14V3.99984H2V2.6665ZM2 7.33317H10V8.6665H2V7.33317ZM2 11.9998H14V13.3332H2V11.9998Z"
            ></path>
          </svg>
          <span>Menu</span>
        </div>
        <nav role="navigation">
          <ul class="aj-modal-navigation-list">
            <li>
              <a href="/" class="aj-modal-nav-first-item">
                <div class="aj-modal-nav-item">
                  <span class="aj-modal-navigation-list-label">Accueil</span>
                </div>
              </a>
            </li>
            <li v-for="(item, index) in menu" :key="index">
              <div
                v-if="!item.childrenExpandedIndex"
                class="aj-modal-nav-item"
                @click="expandMenu(index)"
              >
                <span
                  class="aj-modal-navigation-list-label"
                  :class="item.expanded ? 'active' : ''"
                  >{{ item.label }}
                </span>
                <svg
                  width="24"
                  height="24"
                  :class="item.expanded ? 'svg-rotate' : ''"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 13.5797L16.95 8.62971L18.364 10.0437L12 16.4077L5.63599 10.0437L7.04999 8.62971L12 13.5797Z"
                  ></path>
                </svg>
              </div>
              <div v-else>
                <div
                  class="aj-modal-nav-item"
                  @click="submenuClick(index, subindex, submenu)"
                >
                  <span v-if="!item.childrenExpandedIndex">
                    <span
                      class="aj-modal-navigation-list-label"
                      :class="item.expanded ? 'active' : ''"
                      >{{ item.label }}
                    </span>
                    <svg
                      width="24"
                      height="24"
                      :class="item.expanded ? 'svg-rotate' : ''"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 13.5797L16.95 8.62971L18.364 10.0437L12 16.4077L5.63599 10.0437L7.04999 8.62971L12 13.5797Z"
                      ></path>
                    </svg>
                  </span>
                  <span v-else class="aj-modal-navigation-subsubmenu">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 13.5797L16.95 8.62971L18.364 10.0437L12 16.4077L5.63599 10.0437L7.04999 8.62971L12 13.5797Z"
                      ></path>
                    </svg>
                    <span
                      class="aj-modal-navigation-list-label"
                      :class="item.expanded ? 'active' : ''"
                      >{{ item.submenus[item.childrenExpandedIndex].label }}
                    </span>
                  </span>
                </div>
                <div
                  v-for="(submenu, subindex) in item.submenus[
                    item.childrenExpandedIndex
                  ].children"
                  :key="`submenu-${subindex}`"
                  class="aj-modal-nav-subitem"
                >
                  <div>
                    <a
                      class="aj-modal-navigation-list-sublabel menu-item-submenu"
                      :class="submenu.active ? 'active' : ''"
                      @click="submenuClick(index, subindex, submenu)"
                    >
                      {{ submenu.label }}
                    </a>
                    <div v-if="submenu.children" class="aj-submenu-children">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.78047 7.99999L5.48047 4.69999L6.42314 3.75732L10.6658 7.99999L6.42314 12.2427L5.48047 11.3L8.78047 7.99999Z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="item.expanded && !openedSubmenuIndex">
                <div
                  v-for="(submenu, subindex) in item.submenus"
                  :key="`submenu-${subindex}`"
                  class="aj-modal-nav-subitem"
                >
                  <div>
                    <a
                      class="aj-modal-navigation-list-sublabel menu-item-submenu"
                      :class="submenu.active ? 'active' : ''"
                      @click="submenuClick(index, subindex, submenu)"
                    >
                      {{ submenu.label }}
                    </a>
                    <div v-if="submenu.children" class="aj-submenu-children">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.78047 7.99999L5.48047 4.69999L6.42314 3.75732L10.6658 7.99999L6.42314 12.2427L5.48047 11.3L8.78047 7.99999Z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </dialog>
    <div class="aj-1j1s-header-logo-container">
      <div class="container">
        <div
          class="aj-1j1s-header-logo-container__col-left"
          :class="{ 'not-home': $route.name !== 'home' }"
        >
          <div class="aj-1j1s-logo">
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
          </div>

          <div
            class="aj-1j1s-responsive-menu-button"
            @click="showMenuModal = !showMenuModal"
          >
            <svg
              width="24"
              height="24"
              class="icon_size__Voigr"
              viewBox="0 0 25 24"
              fill="#566bb1"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.5 3.99976H21.5V5.99976H3.5V3.99976ZM3.5 10.9998H21.5V12.9998H3.5V10.9998ZM3.5 17.9998H21.5V19.9998H3.5V17.9998Z"
              ></path>
            </svg>
            <span class="aj-1j1s-responsive-menu-label">Menu</span>
          </div>
          <div class="aj-1j1s-responsive-label">
            <div>
              <a
                href="https://www.1jeune1solution.gouv.fr?utm_source=mes-aides-beta&utm_medium=menu"
                class="aj-1j1s-header__title"
              >
                1jeune1solution
              </a>
            </div>
          </div>
        </div>

        <div class="aj-1j1s-header-logo-container__col-right">
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
      class="aj-1j1s-header-nav"
      :class="{ show: showMenu }"
    >
      <div class="container">
        <ul class="aj-1j1s-header-nav__menu">
          <li>
            <a href="/">Accueil</a>
          </li>
          <li
            v-for="(item, index) in menu"
            :key="`menu-item-${index}`"
            :class="{
              'aj-1j1s-header-nav__menu-last-item': index === menu.length - 1,
              active: item.href === '/',
            }"
          >
            <div
              class="aj-1j1s-header-nav__menu-item"
              tabindex="0"
              @click="expandMenu(index)"
            >
              <div>{{ item.label }}</div>
              <div>
                <svg
                  width="24"
                  height="24"
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
              v-if="
                menu[index].expanded &&
                menu[index].submenus.length > 0 &&
                index < menu.length - 1
              "
              class="aj-1j1s-header-nav__menu-submenus"
            >
              <li
                v-for="(submenu, subindex) in menu[index].submenus"
                :key="`menu-item-${index}-submenu-${subindex}`"
              >
                <a
                  class="aj-1j1s-header-nav__menu-submenus-item"
                  :class="submenu.active ? 'active' : ''"
                  :href="`${vite1jeune1solutionUrl}/${submenu.href}`"
                  >{{ submenu.label }}</a
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <transition name="fade">
        <div class="menu-employee">
          <ul
            v-if="menu.length > 0 && menu[menu.length - 1].expanded"
            class="menu-item-submenus-employee"
          >
            <div>
              <p class="aj-1j1s-header__title">Je suis employeur</p>
              <p>Découvrez des services faits pour vous !</p>
            </div>
            <div
              v-for="(submenu, subindex) in menu[menu.length - 1].submenus"
              :key="`last-submenu-${subindex}`"
              class="last-submenu-col-right"
            >
              <p v-if="submenu" class="last-menu-submenu-label">
                <a
                  v-if="submenu.href"
                  :href="`${vite1jeune1solutionUrl}/${submenu.href}`"
                >
                  {{ submenu.label }}
                </a>
                <span v-else> {{ submenu.label }} :</span>
              </p>
              <div class="last-menu-subsubmenus">
                <a
                  v-for="(subsubmenu, subsubindex) in submenu.children"
                  :key="`$last-submenu-${subindex}-subsubmenu-${subsubindex}`"
                  :href="`${vite1jeune1solutionUrl}/${subsubmenu.href}`"
                >
                  {{ subsubmenu.label }}
                </a>
              </div>
            </div>
          </ul>
        </div>
      </transition>
    </nav>
  </header>
</template>
