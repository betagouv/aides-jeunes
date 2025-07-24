<template>
  <div class="fr-header" role="banner">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <a
                  href="/"
                  title="Accueil"
                  target="_self"
                  class="ds-fr--no-shadow"
                >
                  <p>mes-aides.org</p>
                </a>
              </div>
              <div class="fr-header__navbar">
                <button
                  type="button"
                  class="fr-btn--menu fr-btn"
                  aria-label="ouvrir la navigation"
                >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fr-header__menu fr-modal">
      <div class="fr-container">
        <button
          title="Fermer"
          class="fr-link--close fr-link"
          type="button"
          aria-label="fermer la navigation"
          >Fermer</button
        >
        <slot />
      </div>
    </div>
  </div>
</template>
