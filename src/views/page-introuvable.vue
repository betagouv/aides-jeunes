<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-mt-8w">
    <div class="fr-col-md-6 fr-col-offset-lg-1">
      <h1>Page introuvable</h1>
      <span class="fr-text--sm">Erreur 404</span>
      <p class="fr-text--lead fr-mt-2w"
        >La page que vous cherchez est introuvable. Veuillez nous excuser pour
        la gêne occasionnée.</p
      >
      <p
        >Si vous avez tapé l'adresse web dans votre navigateur, vérifiez qu'elle
        est correcte. Vous pouvez également consulter la page d'accueil.<br />Si
        vous pensez que la page n'est plus disponible vous pouvez nous
        l'indiquer en nous contactant par email.</p
      >
      <ul class="fr-btns-group fr-btns-group--inline">
        <li>
          <router-link to="/" class="fr-btn">Page d'accueil</router-link>
        </li>
        <li>
          <router-link to="/contact" class="fr-btn fr-btn--secondary"
            >Nous contacter</router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>
