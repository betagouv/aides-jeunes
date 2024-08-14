<template>
  <nav
    id="navigation"
    class="fr-nav"
    role="navigation"
    aria-label="Menu principal"
  >
    <ul class="fr-nav__list">
      <li
        v-for="(element, index) in navigation"
        :key="element.label"
        class="fr-nav__item"
        :class="{ 'fr-nav__item--right': element?.alignRight }"
      >
        <a
          v-if="!element.children"
          class="fr-nav__link"
          :href="`${domain}${element.link}`"
          :aria-current="element.active || null"
          :title="element.active ? 'Onglet actif' : null"
          >{{ element.label }}</a
        >
        <button
          v-if="element.children"
          :aria-current="element.active || null"
          aria-expanded="false"
          :aria-controls="`nav-menu-${index}`"
          class="fr-nav__btn"
          :title="element.active ? 'Onglet actif' : null"
          @keydown.esc="escapeKeyHandler"
          >{{ element.label }}</button
        >
        <div
          v-if="
            element.children &&
            element.children.some((subelement) => subelement?.children)
          "
          :id="`nav-menu-${index}`"
          class="fr-collapse fr-mega-menu"
          tabindex="-1"
          @keydown.esc="escapeKeyHandler"
        >
          <div class="fr-container fr-container--fluid fr-container-lg">
            <button
              class="fr-btn--close fr-btn"
              :aria-controls="`nav-menu-${index}`"
              >Fermer</button
            >
            <div class="fr-grid-row fr-grid-row-lg--gutters">
              <div
                v-for="category in element.children"
                :key="category.label"
                class="fr-col-12 fr-col-lg-3"
                :data-submenu="!category.link"
              >
                <h2 class="fr-mega-menu__category">
                  <a
                    v-if="category.link"
                    class="fr-nav__link"
                    :href="`${domain}${category.link}`"
                    >{{ category.label }}</a
                  >
                  <span v-else class="fr-nav__link">{{ category.label }}</span>
                </h2>
                <p v-if="category.legend" class="fr-p-2w">{{
                  category.legend
                }}</p>
                <ul v-if="category.children" class="fr-mega-menu__list">
                  <li
                    v-for="subcategory in category.children"
                    :key="subcategory.label"
                    ><a
                      :href="`${domain}${subcategory.link}`"
                      class="fr-nav__link"
                      >{{ subcategory.label }}</a
                    ></li
                  >
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if="element.children"
          :id="`nav-menu-${index}`"
          class="fr-collapse fr-menu"
          @keydown.esc="escapeKeyHandler"
        >
          <ul class="fr-menu__list">
            <li
              v-for="subelement in element.children"
              :key="subelement.label"
              class="fr-nav__item"
            >
              <a
                class="fr-nav__link"
                :href="`${domain}${subelement.link}`"
                :aria-current="subelement.active || null"
                :title="subelement.active ? 'Sous-onglet actif' : null"
                >{{ subelement.label }}</a
              >
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>
<script setup lang="ts">
function escapeKeyHandler(event) {
  if (event.target.getAttribute("aria-expanded")) {
    // close standard drop-down menu
    event.target.setAttribute("aria-expanded", false)
  } else if (event.target.previousSibling.getAttribute("aria-expanded")) {
    // close mega menu and put focus on opening button
    event.target.previousSibling.focus({ focusVisible: true })
    event.target.previousSibling.setAttribute("aria-expanded", false)
  }
}
const domain = "https://www.1jeune1solution.gouv.fr"
const navigation = [
  { label: "Accueil", link: "/" },
  {
    label: "Offres",
    children: [
      { label: "Emplois", link: "/emplois" },
      { label: "Stages d’études", link: "/stages" },
      { label: "Contrats d’alternance", link: "/apprentissage" },
      { label: "Jobs d'été", link: "/jobs-ete" },
      { label: "Jobs étudiants", link: "/jobs-etudiants" },
    ],
  },
  {
    label: "Formations et orientation",
    children: [
      { label: "Formations initiales", link: "/formations-initiales" },
      {
        label: "Formations en apprentissage",
        link: "/formations/apprentissage",
      },
      { label: "Découvrir les métiers", link: "/decouvrir-les-metiers" },
      { label: "Participer à des évènements", link: "/evenements" },
      {
        label: "Découvrir et trouver sa voie avec l’apprentissage",
        link: "/choisir-apprentissage",
      },
    ],
  },
  {
    label: "Engagement",
    children: [
      { label: "Bénévolat", link: "/benevolat" },
      { label: "Service civique", link: "/service-civique" },
    ],
  },
  {
    label: "Logement",
    children: [
      { label: "Annonces", link: "/logements/annonces" },
      {
        label: "Aides financières au logement",
        link: "/logements/aides-logement",
      },
      { label: "Découvrir tous nos conseils", link: "/logements/conseils" },
    ],
  },
  {
    label: "Accompagnement",
    children: [
      { label: "Contrat Engagement Jeune", link: "/contrat-engagement-jeune" },
      { label: "Échanger avec un mentor", link: "/mentorat" },
      {
        label: "Trouver une structure d'accompagnement",
        link: "/accompagnement",
      },
      {
        label: "Entreprendre : financements, aides et accompagnement",
        link: "/entreprendre",
      },
      { label: "Expérience en Europe", link: "/experience-europe" },
    ],
  },
  {
    label: "Aides et outils",
    active: true,
    children: [
      {
        label: "Simulateur d’aides financières",
        link: "/mes-aides",
        active: true,
      },
      { label: "Aides au permis de conduire", link: "/1jeune1permis" },
      { label: "Créer son CV personnalisé", link: "/creer-mon-cv" },
    ],
  },
  {
    label: "Je suis employeur",
    alignRight: true,
    children: [
      {
        label: "Rejoindre la mobilisation",
        link: "/les-entreprises-s-engagent",
        legend: "Découvrez des services faits pour vous !",
      },
      {
        label: "Recruter et agir pour les jeunes",
        children: [
          { label: "Je recrute", link: "/je-recrute" },
          { label: "Je deviens mentor", link: "/je-deviens-mentor" },
          { label: "Je propose des immersions", link: "/immersions" },
          {
            label: "Je forme les jeunes grâce à l'emploi",
            link: "/je-recrute-afpr-poei",
          },
        ],
      },
      {
        label: "Découvrir les mesures employeurs",
        link: "/mesures-employeurs",
      },
      { label: "Accéder à mon espace", link: "/mon-espace" },
    ],
  },
]
</script>
