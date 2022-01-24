<template>
  <div>
    <header class="navbar" role="navigation">
      <div class="container navbar__container">
        <div class="navbar__container">
          <router-link to="/" class="navbar__home" id="logo">
            <img
              class="navbar__logo"
              src="@/../public/mes-aides.org/img/logo.svg"
              alt="Logo de Mes-Aides.org"
            />
          </router-link>
        </div>
        <nav>
          <ul class="nav__links">
            <li class="nav__item">
              <router-link to="/liens-utiles">Obtenir de l'aide</router-link>
            </li>
            <li class="nav__item">
              <router-link to="/a-propos">Qui sommes nous&nbsp;?</router-link>
            </li>
            <li class="nav__item"
              ><router-link to="/ameliorer">
                Comment nous aider&nbsp;?
              </router-link></li
            >
          </ul>
        </nav>
      </div>
    </header>

    <slot></slot>

    <footer>
      <div>
        <router-link to="/liens-utiles">Liens utiles</router-link>
      </div>
      <div>
        <router-link to="/a-propos">À propos</router-link>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "BaseLayout",
  components: {},
  created() {
    this.$router.isReady().then(() => {
      if (this.$route.query.debug === "parcours") {
        this.$store.dispatch("setDebug", true)
      }
    })
  },
}
</script>

<style scoped lang="scss">
.navbar__logo {
  height: 80%;
  margin-left: 1em;
}

.logo.partenaire {
  max-height: 30px;
}

.logo.mesaides {
  position: relative;
  top: 5px;
  left: 2px;
}

.logo.incubateur {
  display: flex;
}

.navbar__container {
  flex-wrap: nowrap;
  -ms-flex-direction: row;
  flex-direction: row;
}
#logo:hover,
#logo:focus {
  opacity: 1;
  background-color: unset;
}

footer {
  display: flex;

  flex-direction: row;
  margin: 1em;
  justify-content: space-between;

  > div {
    display: flex;
    flex-direction: column;
    padding: 1em 0em;
  }
}

@media (max-width: 760px) {
  nav {
    display: none;
  }
}

@media (max-width: 950px) {
  .large_screen_text {
    display: none;
  }
}

@media (min-width: 761px) {
  .navbar__container {
    padding: 1em 0em;
  }
  footer {
    display: none;
  }
}
</style>
