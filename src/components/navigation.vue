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
          v-if="element.children"
          :id="`nav-menu-${index}`"
          class="fr-collapse fr-menu"
        >
          <ul class="fr-menu__list">
            <li
              v-for="(subelement, subindex) in element.children"
              :key="subelement.label"
              class="fr-nav__item"
            >
              <a
                v-if="!subelement.children"
                class="fr-nav__link"
                :href="`${domain}${subelement.link}`"
                target="_self"
                >{{ subelement.label }}</a
              >
              <button
                v-if="subelement.children"
                class="fr-nav__btn"
                aria-expanded="false"
                :aria-controls="`nav-submenu-${index}-${subindex}`"
                >{{ subelement.label }}</button
              >
              <div
                v-if="subelement.children"
                class="fr-container fr-container--fluid fr-container-lg"
              >
                <button
                  :aria-controls="`nav-submenu-${index}-${subindex}`"
                  class="fr-link--close fr-link"
                  >Fermer</button
                >
              </div>
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
      { label: "Mes aides financières", link: "/mes-aides" },
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
