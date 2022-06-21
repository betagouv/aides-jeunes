<template>
  <div class="skiplinks">
    <nav role="navigation" aria-label="Accès rapide">
      <ul class="skiplinks__list">
        <li>
          <router-link
            class="button outline"
            :to="{ path: `${$route.path}`, hash: `#content` }"
          >
            Accéder au contenu
          </router-link>
        </li>
        <li>
          <router-link
            class="button outline"
            :to="{ path: `${$route.path}`, hash: `#footer` }"
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
  list-style-type: none;
}
</style>
