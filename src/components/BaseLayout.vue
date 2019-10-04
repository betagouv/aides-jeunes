<template>
  <div>
    <header class="navbar" role="navigation">
      <div class="navbar__container">
        <div class="navbar__home">
          <img class="navbar__logo" src="./../../app/img/marianne.svg"
            alt="Logo de la Marianne" />
        </div>

        <nav>
          <router-link to="/" class="navbar__home" id="logo">
            <img class="navbar__logo" src="./../../app/img/logo.svg" alt="Logo de la Marianne" />
          </router-link>
        </nav>
      </div>
    </header>

    <slot></slot>

    <footer class="footer">
      <nav class="container">
        <ul>
          <li><span class="fa fa-fw fa-life-ring" aria-hidden="true"></span>&nbsp;<a ui-sref="sos">SOS</a></li>
          <li><span class="fa fa-fw fa-star" aria-hidden="true"></span>&nbsp;<a ui-sref="liens-utiles">Liens utiles</a></li>
          <li><span class="fa fa-fw fa-question-circle" aria-hidden="true"></span>&nbsp;<a ui-sref="a-propos">À propos</a></li>
        </ul>
        <ul>
          <li><span class="fa fa-fw fa-bullhorn" aria-hidden="true"></span>&nbsp;<a ui-sref="communication">Supports de communication</a></li>
          <li><span class="fa fa-fw fa-pencil" aria-hidden="true"></span>&nbsp;<a ui-sref="ameliorer">Contribuez</a></li>
          <li><span class="fa fa-fw fa-paperclip" aria-hidden="true"></span>&nbsp;<a ui-sref="cgu">Conditions d'utilisation</a></li>
        </ul>
        <ul>
          <li><span class="fa fa-fw fa-thumbs-up" aria-hidden="true"></span>&nbsp;<a ui-sref="social">Réseaux sociaux</a></li>
          <li><span class="fa fa-fw fa-envelope" aria-hidden="true"></span>&nbsp;<a ui-sref="contact">Contact</a></li>
          <li><span class="fa fa-fw fa-newspaper-o" aria-hidden="true"></span>&nbsp;<a target="_blank" rel="noopener" href="http://eepurl.com/bD9PNP">Abonnez-vous à nos informations</a></li>
        </ul>
      </nav>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.navbar__container {
  padding: 0.2em;
  flex-wrap: nowrap;
  -ms-flex-direction: row;
  flex-direction: row;
}

#logo {
  opacity: .5;
}

#logo:hover, #logo:focus {
    opacity: 1;
    background-color: unset;
}

footer, footer a {
  background-color: white;
  color: #0475a4;
  text-decoration: none;
}
</style>
