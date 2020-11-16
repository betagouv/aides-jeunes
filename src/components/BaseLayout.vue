<template>
  <div>
    <header class="navbar" role="navigation">
      <div class="container navbar__container">
        <router-link to="/" class="navbar__home" id="logo">
          <img class="navbar__logo" src="./../../public/img/logo.svg" alt="Logo de Mes-Aides.org" />
        </router-link>

        <nav>
          <ul class="nav__links">
            <li class="nav__item">
              <div class="dropdown">
                <router-link to="/sos">Obtenir de l'aide</router-link>
                <div class="dropdown-content">
                  <router-link to="/sos">SOS</router-link>
                  <router-link to="/liens-utiles">Liens utiles</router-link>
                  <router-link to="/contact">Contact</router-link>
                  <router-link to="/toutes">Toutes les aides</router-link>
                </div>
              </div>
            </li>
            <li class="nav__item">
              <div class="dropdown">
                <router-link to="/a-propos">Qui sommes nous&nbsp;?</router-link>
                <div class="dropdown-content">
                  <router-link to="/a-propos">À propos</router-link>
                  <router-link to="/cgu">Conditions d'utilisation</router-link>
                  <router-link to="/social">Réseaux sociaux</router-link>
                  <a target="_blank" rel="noopener" href="https://c8282fe1.sibforms.com/serve/MUIEALeK4cr3WdAp5x5mopAKSViUl_8HOgRWycyFqxzf2U2EwnfJS8GJ2ragsE3WagiU-OmKq_HhRamKpgndNUMN6wnrNKxk-wpY19N5N90_j6_hWPTjJ4XRa0djFNUrsWcCAWJQWR1fQgZRVqfinNCIqcGYRZsedqB9iaqWecSDEdP_dZN0PITSsB78r7SJkWvuSsWDc8nEj9eI">Abonnez-vous</a>
                </div>
              </div>
            </li>
            <li class="nav__item"><router-link to="/ameliorer">
                Comment nous aider&nbsp;?
            </router-link></li>
          </ul>
        </nav>
      </div>
    </header>

    <slot></slot>

    <footer>
      <div>
        <router-link to="/sos">SOS</router-link>
        <router-link to="/liens-utiles">Liens utiles</router-link>
        <router-link to="/contact">Contact</router-link>
        <router-link to="/toutes">Toutes les aides</router-link>
      </div>
      <div>
        <router-link to="/a-propos">À propos</router-link>
        <router-link to="/cgu">Conditions d'utilisation</router-link>
        <router-link to="/social">Réseaux sociaux</router-link>
        <a target="_blank" rel="noopener" href="https://c8282fe1.sibforms.com/serve/MUIEALeK4cr3WdAp5x5mopAKSViUl_8HOgRWycyFqxzf2U2EwnfJS8GJ2ragsE3WagiU-OmKq_HhRamKpgndNUMN6wnrNKxk-wpY19N5N90_j6_hWPTjJ4XRa0djFNUrsWcCAWJQWR1fQgZRVqfinNCIqcGYRZsedqB9iaqWecSDEdP_dZN0PITSsB78r7SJkWvuSsWDc8nEj9eI">Abonnez-vous</a>
      </div>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'BaseLayout',
  components: {
  }
}
</script>


<style scoped lang="scss">

.navbar__logo {
  height: 80%;
  margin-left: 1em;
}

.navbar__container {
  padding: 1em 0em;
  flex-wrap: nowrap;
  -ms-flex-direction: row;
  flex-direction: row;
}

@media (max-width: 760px) {
  nav {
    display: none;
  }
}

#logo:hover, #logo:focus {
    opacity: 1;
    background-color: unset;
}

footer {
  display: flex;

  @media (min-width: 761px) {
    display: none;
  }
  flex-direction: row;
  margin: 1em;
  justify-content: space-between;

  > div {
    display: flex;
    flex-direction: column;
    padding: 1em 0em;
  }
}
</style>
