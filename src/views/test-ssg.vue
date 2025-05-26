<template>
  <div class="fr-container">
    <h1>Page de test SSG</h1>
    <p>Cette page a été générée le : {{ buildTime }}</p>
    <p>Mode : {{ env.NODE_ENV }}</p>
  </div>
</template>

<script setup lang="ts">
const buildTime = new Date().toLocaleString("fr-FR")
const env = process.env
</script>
