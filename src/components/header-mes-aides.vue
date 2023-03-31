<template>
  <header class="fr-header" role="banner">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <a
                  href="/"
                  title="République Française"
                  target="_self"
                  class="ds-fr--no-shadow"
                >
                  <p class="fr-logo">République<br />Française</p>
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
            <div class="fr-header__service">
              <a
                href="https://mes-aides.gouv.fr/"
                title="mes-aides.gouv.fr"
                target="_self"
                class="fr-header__service-title"
                >mes-aides.gouv.fr</a
              >
              <p class="fr-header__service-tagline"
                >Vous informer sur vos aides et vos droits</p
              >
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
        <nav
          id="header-navigation"
          class="fr-nav"
          role="navigation"
          aria-label="Menu principal"
        >
          <ul class="fr-nav__list">
            <li class="fr-nav__item">
              <a href="https://mes-aides.gouv.fr" class="fr-nav__link"
                >Accueil</a
              >
            </li>
            <li class="fr-nav__item">
              <a
                href="https://mes-aides.gouv.fr/questions-frequentes"
                class="fr-nav__link"
                >Questions fréquentes</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>
