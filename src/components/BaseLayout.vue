<template>
  <div>
    <header class="navbar" role="navigation">
      <div class="navbar__container">
        <div class="navbar__home">
          <img class="navbar__logo" src="./../../public/img/marianne.svg"
            alt="Logo de la Marianne" />
            <Modal analyticsCategory="Blocage">
              <template v-slot:message>Je suis bloqué·e…</template>
              <h1>Veuillez nous excuser…</h1>
              <p>Le simulateur Mes Aides est un service en constante évolution.<p>
              <p>Si vous êtes bloqué·e, c'est que nous avons encore du travail à faire.</p>
              <p>Aidez-nous en nous indiquant <a
                v-analytics="{ action: 'Envoi d\'email', category:'Blocage'}"
                v-mail="{to: 'feedback@mes-aides.gouv.fr', subject:'Bloqué·e sur le simulateur', body:`Bonjour,

En utilisant le simulateur Mes Aides, je me suis retrouvé·e bloqué·e.

————
Page : ${$route.fullPath}
————`}">par email</a> comment vous vous êtes retrouvé·e bloqué·e.
              </p>
              <p>Nous essaierons de vous débloquer et d'éviter que d'autres personnes se retrouvent bloquées comme vous.<p>

              <p>
                Merci,<br/>
                L'équipe Mes Aides
              </p>
            </Modal>
        </div>

        <nav>
          <router-link to="/" class="navbar__home" id="logo">
            <img class="navbar__logo" src="./../../public/img/logo.svg" alt="Logo de Mes-Aides.gouv.fr" />
          </router-link>
        </nav>
      </div>
    </header>

    <slot></slot>

    <footer class="footer">
      <nav class="container">
        <ul>
          <li><span class="fa fa-fw fa-life-ring" aria-hidden="true"></span>&nbsp;<router-link to="/sos">SOS</router-link></li>
          <li><span class="fa fa-fw fa-star" aria-hidden="true"></span>&nbsp;<router-link to="/liens-utiles">Liens utiles</router-link></li>
          <li><span class="fa fa-fw fa-question-circle" aria-hidden="true"></span>&nbsp;<router-link to="/a-propos">À propos</router-link></li>
        </ul>
        <ul>
          <li><span class="fa fa-fw fa-bullhorn" aria-hidden="true"></span>&nbsp;<router-link to="/communication">Supports de communication</router-link></li>
          <li><span class="fa fa-fw fa-pencil" aria-hidden="true"></span>&nbsp;<router-link to="/ameliorer">Contribuez</router-link></li>
          <li><span class="fa fa-fw fa-paperclip" aria-hidden="true"></span>&nbsp;<router-link to="/cgu">Conditions d'utilisation</router-link></li>
        </ul>
        <ul>
          <li><span class="fa fa-fw fa-thumbs-up" aria-hidden="true"></span>&nbsp;<router-link to="/social">Réseaux sociaux</router-link></li>
          <li><span class="fa fa-fw fa-envelope" aria-hidden="true"></span>&nbsp;<router-link to="/contact">Contact</router-link></li>
          <li><span class="fa fa-fw fa-newspaper-o" aria-hidden="true"></span>&nbsp;<a target="_blank" rel="noopener" href="http://eepurl.com/bD9PNP">Abonnez-vous à nos informations</a></li>
        </ul>
      </nav>
    </footer>
  </div>
</template>

<script>
import Modal from '@/components/Modal'

export default {
  name: 'BaseLayout',
  components: {
    Modal
  }
}
</script>

<style scoped lang="scss">
.navbar__container {
  padding: 0.2em;
  flex-wrap: nowrap;
  -ms-flex-direction: row;
  flex-direction: row;
}

@media (max-width: 600px) {
  .navbar__home span {
    font-size: 12px;
  }
}

@media (max-width: 450px) {
  .navbar__home {
    height: 20px;
  }
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
