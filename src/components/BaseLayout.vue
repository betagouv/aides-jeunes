<template>
  <div>
    <header class="navbar" role="navigation">
      <div class="navbar__container">
        <div class="navbar__home">
          <img class="navbar__logo" src="./../../public/img/marianne.svg"
            alt="Logo de la Marianne" />
            <Modal>
              <template v-slot:message>Je suis bloqué·e…</template>
              <h2>Vous êtes bloqué·e</h2>
              <h3>Veuillez nous excuser…</h3>
              <p>
                Cette version de Mes Aides est en cours de finalisation et peut encore contenir des dysfonctionnements, des erreurs ou des bugs. Si vous êtes bloqué·e, vous pouvez toujours revenir à
                <a
                  target="_blank"
                  rel="noopener"
                  v-analytics="{ action: 'Retour à la version stable', category:'General'}"
                  href="https://mes-aides.gouv.fr">
                  la version stable</a>.
              </p>
              <p>
                Vous pouvez aussi nous contacter <a v-mail="{to: 'feedback@mes-aides.gouv.fr', subject:'Bloquage sur la nouvelle version', body:`Bonjour,

En utilisant la nouvelle version de Mes Aides j'ai rencontré un bloquage.


————
Page : ${$route.fullPath}
————`}">par email</a> pour nous dire comment et où vous êtes bloqué·e pour nous aider à améliorer cette version&nbsp;!
              </p>

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
