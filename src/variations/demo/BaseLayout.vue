<template>
  <div class="aj-website">
    <div class="aj-website-content">
      <router-link to="/">Accueil</router-link>
      <router-link to="/a-propos">À propos</router-link>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseLayout",
}
</script>
