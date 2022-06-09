<template>
  <div class="skiplinks">
    <nav role="navigation" aria-label="Accès rapide">
      <ul class="skiplinks__list">
        <li>
          <a class="button outline" href="#main">Accéder au contenu</a>
        </li>
        <li>
          <a class="button outline" href="#footer">Accéder au pied de page</a>
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
