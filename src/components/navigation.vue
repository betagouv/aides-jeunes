<template>
  <nav
    class="fr-nav"
    id="navigation-menu"
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
          target="_self"
          :aria-current="element.active"
          >{{ element.label }}</a
        >
        <button
          v-if="element.children"
          :aria-current="element.active"
          aria-expanded="false"
          :aria-controls="`nav-menu-${index}`"
          class="fr-nav__btn"
          >{{ element.label }}</button
        >
        <div
          v-if="
            element.children &&
            element.children.some((subelement) => subelement?.children)
          "
          class="fr-collapse fr-mega-menu"
          :id="`nav-menu-${index}`"
          tabindex="-1"
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
              >
                <h5 class="fr-mega-menu__category">
                  <a
                    v-if="category.link"
                    class="fr-nav__link"
                    :href="`${domain}${category.link}`"
                    target="_self"
                    >{{ category.label }}</a
                  >
                  <span v-else class="fr-nav__link">{{ category.label }}</span>
                </h5>
                <ul v-if="category.children" class="fr-mega-menu__list">
                  <li
                    v-for="subcategory in category.children"
                    :key="subcategory.label"
                    ><a
                      :href="`${domain}${subcategory.link}`"
                      class="fr-nav__link"
                      target="_self"
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
                target="_self"
                :aria-current="subelement.active"
                >{{ subelement.label }}</a
              >
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>
<script setup>
const domain = "https://www.1jeune1solution.gouv.fr"
const navigation = [
  { label: "Accueil", link: "/" },
  {
    label: "Offres",
    children: [
      { label: "Emplois", link: "/emplois" },
      { label: "Stages", link: "/stages" },
      { label: "Contrats d’alternance", link: "/apprentissage" },
      { label: "Jobs étudiants", link: "/jobs-etudiants" },
      { label: "Emplois en Europe", link: "/europe" },
    ],
  },
  {
    label: "Formations et orientation",
    children: [
      { label: "Formations", link: "/formations" },
      { label: "Découvrir les métiers", link: "/decouvrir-les-metiers" },
      { label: "Participer à un évènement", link: "/evenements" },
    ],
  },
  {
    label: "Aides et accompagnement",
    active: true,
    children: [
      { label: "Contrat Engagement Jeune", link: "/contrat-engagement-jeune" },
      { label: "Mes aides financières", link: "/mes-aides", active: true },
      { label: "Mes aides au logement", link: "/logements/aides-logement" },
      { label: "Le mentorat", link: "/mentorat" },
      { label: "Je crée mon CV personnalisé", link: "/creer-mon-cv" },
      { label: "Entreprendre", link: "/entreprendre" },
      { label: "Accompagnement", link: "/accompagnement" },
      { label: "Les mesures jeunes", link: "/espace-jeune" },
    ],
  },

  {
    label: "Engagement",
    children: [
      { label: "Le service civique", link: "/service-civique" },
      { label: "Le bénévolat", link: "/benevolat" },
    ],
  },
  {
    label: "Je suis employeur",
    legend: "Découvrez des services faits pour vous !",
    alignRight: true,
    children: [
      {
        label: "Rejoindre la mobilisation",
        link: "/les-entreprises-s-engagent",
      },
      {
        children: [
          { label: "Je recrute", link: "/je-recrute" },
          { label: "Je deviens mentor", link: "/je-deviens-mentor" },
          { label: "Je propose des immersions", link: "/immersions" },
          {
            label: "Je forme les jeunes grâce à l'emploi",
            link: "/je-recrute-afpr-poei",
          },
        ],
        label: "Recruter et agir pour les jeunes",
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
