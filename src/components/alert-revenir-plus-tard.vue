<template>
  <div class="fr-alert fr-alert--info" role="alert">
    <p>
      Pour ne pas perdre les données que vous avez déclarées, vous pouvez
      <router-link
        :to="{ name: 'revenirPlusTard' }"
        data-testid="come-back-later-link"
        >sauvegarder votre simulation</router-link
      >
      ou garder cet onglet ouvert, puis actualiser la page une fois que le
      problème sera résolu.
    </p>
  </div>
</template>
