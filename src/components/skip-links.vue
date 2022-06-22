<template>
  <div class="skiplinks">
    <nav role="navigation" aria-label="Accès rapide">
      <ul class="skiplinks__list list-unstyled">
        <li>
          <router-link
            class="button outline"
            :to="{ path: `${$route.path}`, hash: `#content` }"
            @click="focusOnMain()"
          >
            Accéder au contenu
          </router-link>
        </li>
        <li>
          <router-link
            class="button outline"
            :to="{ path: `${$route.path}`, hash: `#footer` }"
            @click="focusOnFooter()"
          >
            Accéder au pied de page
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "SkipLinks",
  data() {
    return {}
  },
  methods: {
    focusOnFooter: function () {
      const footer = document.querySelector("footer")
      footer.tabIndex = -1
      footer.focus()
    },
    focusOnMain: function () {
      const title = document.querySelector("h1")
      title.tabIndex = -1
      title.focus()
    },
  },
}
</script>

<style>
.skiplinks {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.skiplinks:focus-within {
  position: static;
  width: auto;
  height: auto;
}

.skiplinks__list {
  display: flex;
  flex-wrap: wrap;
}
</style>
