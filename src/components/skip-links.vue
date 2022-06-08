<template>
  <div class="skiplinks">
    <nav
      class="skiplinks-container"
      role="navigation"
      aria-label="Accès rapide"
    >
      <ul class="skiplinks__list">
        <li>
          <a class="skip-link button outline" href="#main"
            >Accéder au contenu</a
          >
        </li>
        <li>
          <a class="skip-link button outline" href="#footer"
            >Accéder au pied de page</a
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "SkipLinks",
}
</script>

<style>
.skiplinks__list {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
}
</style>
