<template>
  <div>
    <p>
      La Garantie Jeune s'adresse aux jeunes qui n'ont pas de ressources ni
      soutien financier familial.
    </p>
    <p>
      Si vous constatez que le montant indiqué ou que l'éligibilité est
      inexacte, vous pouvez prendre contact avec nous pour comprendre l'origine
      de l'écart.
    </p>

    <router-link
      class="button outline text-center back-button"
      to="/simulation/resultats"
      >Retourner aux résultats</router-link
    >
  </div>
</template>

<script>
export default {
  name: "GarantieJeune",
  computed: {},
}
</script>

<style scoped>
.back-button {
  margin-top: 16px !important;
}
</style>
